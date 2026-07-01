"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  scholarships,
  matchScore,
  FIELDS,
  REGIONS,
  LEVEL_VI,
  FUNDING_VI,
  PROVIDER_TYPE_VI,
  Level,
  FundingLevel,
  ProviderType,
} from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";
import ScholarshipCard from "@/components/ScholarshipCard";

// Danh sách quốc gia (suy ra từ dữ liệu)
const COUNTRIES = Array.from(
  new Map(scholarships.map((s) => [s.countryCode, s.country])).entries()
).map(([code, name]) => ({ code, name }));

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function SearchPage() {
  const { profile, setProfile } = useTrack();

  const [q, setQ] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [funding, setFunding] = useState<FundingLevel[]>([]);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
  const [supervisor, setSupervisor] = useState<"any" | "yes" | "no">("any");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [maxRank, setMaxRank] = useState(0);
  const [sort, setSort] = useState<"match" | "deadline" | "funding">("match");
  const [showProfile, setShowProfile] = useState(false);

  const results = useMemo(() => {
    let list = scholarships.map((s) => ({ s, match: matchScore(profile, s) }));

    if (q.trim()) {
      const k = q.toLowerCase();
      list = list.filter(
        ({ s }) =>
          s.title.toLowerCase().includes(k) ||
          s.university.toLowerCase().includes(k) ||
          s.country.toLowerCase().includes(k) ||
          s.fields.some((f) => f.toLowerCase().includes(k)) ||
          s.provider.toLowerCase().includes(k)
      );
    }
    if (regions.length) list = list.filter(({ s }) => regions.includes(s.region));
    if (countries.length) list = list.filter(({ s }) => countries.includes(s.countryCode));
    if (levels.length) list = list.filter(({ s }) => s.levels.some((l) => levels.includes(l)));
    if (fields.length) list = list.filter(({ s }) => s.fields.some((f) => fields.includes(f)));
    if (funding.length) list = list.filter(({ s }) => funding.includes(s.fundingLevel));
    if (providerTypes.length) list = list.filter(({ s }) => providerTypes.includes(s.providerType));
    if (supervisor !== "any")
      list = list.filter(({ s }) => (supervisor === "yes" ? s.requiresSupervisor : !s.requiresSupervisor));
    if (eligibleOnly) list = list.filter(({ match }) => match.label !== "Chưa đủ điều kiện");
    if (maxRank > 0) list = list.filter(({ s }) => s.qsRank <= maxRank);

    list.sort((a, b) => {
      if (sort === "match") return b.match.score - a.match.score;
      if (sort === "funding") {
        const order = { Full: 0, Partial: 1, TuitionOnly: 2 } as const;
        return order[a.s.fundingLevel] - order[b.s.fundingLevel];
      }
      const na = a.s.deadlines[a.s.deadlines.length - 1].date;
      const nb = b.s.deadlines[b.s.deadlines.length - 1].date;
      return new Date(na).getTime() - new Date(nb).getTime();
    });
    return list;
  }, [profile, q, regions, countries, levels, fields, funding, providerTypes, supervisor, eligibleOnly, maxRank, sort]);

  const activeFilters =
    regions.length + countries.length + levels.length + fields.length + funding.length + providerTypes.length +
    (supervisor !== "any" ? 1 : 0) + (eligibleOnly ? 1 : 0) + (maxRank > 0 ? 1 : 0);

  const clearAll = () => {
    setRegions([]); setCountries([]); setLevels([]); setFields([]); setFunding([]);
    setProviderTypes([]); setSupervisor("any"); setEligibleOnly(false); setMaxRank(0); setQ("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Tìm học bổng du học phù hợp với bạn</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">
          Chọn khu vực, hạng trường, ngành, loại học bổng — hệ thống chấm mức độ phù hợp theo hồ sơ của bạn,
          hiển thị kỳ nhập học, giáo sư hướng dẫn và checklist cần chuẩn bị.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên học bổng, trường, ngành, quốc gia…"
            className="flex-1 rounded-lg border-0 px-4 py-3 text-slate-800 outline-none ring-2 ring-transparent focus:ring-white"
          />
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="rounded-lg bg-white/15 px-4 py-3 font-medium ring-1 ring-white/40 hover:bg-white/25"
          >
            ⚙️ Hồ sơ của tôi
          </button>
        </div>
      </section>

      {/* Trình chỉnh hồ sơ */}
      {showProfile && (
        <section className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Hồ sơ dùng để chấm mức phù hợp</h2>
            <button onClick={() => setShowProfile(false)} className="text-sm text-slate-500 hover:text-slate-800">Đóng</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Bậc học</span>
              <select
                value={profile.level}
                onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                {(["Bachelor", "Master", "PhD"] as Level[]).map((l) => (
                  <option key={l} value={l}>{LEVEL_VI[l]}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">GPA (thang 4.0)</span>
              <input
                type="number" step="0.1" min="0" max="4" value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">IELTS</span>
              <input
                type="number" step="0.5" min="0" max="9" value={profile.ielts}
                onChange={(e) => setProfile({ ...profile, ielts: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Nhu cầu tài chính</span>
              <select
                value={profile.fundingNeed}
                onChange={(e) => setProfile({ ...profile, fundingNeed: e.target.value as "Full" | "Partial" | "Any" })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="Full">Cần toàn phần</option>
                <option value="Partial">Bán phần cũng được</option>
                <option value="Any">Không quan trọng</option>
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Ngành mong muốn</span>
              <div className="flex flex-wrap gap-1.5">
                {FIELDS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setProfile({ ...profile, fields: toggle(profile.fields, f) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
                      profile.fields.includes(f)
                        ? "bg-indigo-600 text-white ring-indigo-600"
                        : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Quốc gia ưu tiên</span>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setProfile({ ...profile, countries: toggle(profile.countries, c.code) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
                      profile.countries.includes(c.code)
                        ? "bg-indigo-600 text-white ring-indigo-600"
                        : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}
                  >{flagEmoji(c.code)} {c.name}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nội dung */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Bộ lọc */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Bộ lọc {activeFilters > 0 && <span className="text-indigo-600">({activeFilters})</span>}</h2>
              {activeFilters > 0 && (
                <button onClick={clearAll} className="text-xs text-slate-500 hover:text-rose-600">Xóa tất cả</button>
              )}
            </div>

            <FilterGroup title="Khu vực">
              {REGIONS.map((r) => (
                <Check key={r} label={r} checked={regions.includes(r)} onChange={() => setRegions(toggle(regions, r))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Quốc gia">
              {COUNTRIES.map((c) => (
                <Check key={c.code} label={`${flagEmoji(c.code)} ${c.name}`} checked={countries.includes(c.code)} onChange={() => setCountries(toggle(countries, c.code))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Bậc học">
              {(["Bachelor", "Master", "PhD"] as Level[]).map((l) => (
                <Check key={l} label={LEVEL_VI[l]} checked={levels.includes(l)} onChange={() => setLevels(toggle(levels, l))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Mức tài trợ">
              {(["Full", "Partial", "TuitionOnly"] as FundingLevel[]).map((f) => (
                <Check key={f} label={FUNDING_VI[f]} checked={funding.includes(f)} onChange={() => setFunding(toggle(funding, f))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Loại học bổng">
              {(["Government", "University", "Org", "Corporate"] as ProviderType[]).map((p) => (
                <Check key={p} label={PROVIDER_TYPE_VI[p]} checked={providerTypes.includes(p)} onChange={() => setProviderTypes(toggle(providerTypes, p))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Ngành">
              {FIELDS.map((f) => (
                <Check key={f} label={f} checked={fields.includes(f)} onChange={() => setFields(toggle(fields, f))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Hạng trường (QS)">
              <select value={maxRank} onChange={(e) => setMaxRank(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
                <option value={0}>Mọi hạng</option>
                <option value={10}>Top 10</option>
                <option value={30}>Top 30</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
              </select>
            </FilterGroup>

            <FilterGroup title="Cần liên hệ giáo sư?">
              <div className="flex gap-1 text-sm">
                {(["any", "yes", "no"] as const).map((v) => (
                  <button key={v} onClick={() => setSupervisor(v)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs ring-1 ${supervisor === v ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-300"}`}>
                    {v === "any" ? "Bất kỳ" : v === "yes" ? "Có" : "Không"}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 p-2 text-sm">
              <input type="checkbox" checked={eligibleOnly} onChange={() => setEligibleOnly((v) => !v)} className="h-4 w-4 accent-emerald-600" />
              <span className="text-emerald-800">Chỉ hiện học bổng tôi đủ điều kiện</span>
            </label>
          </div>
        </aside>

        {/* Kết quả */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{results.length}</span> học bổng phù hợp
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Sắp xếp:
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
                <option value="match">Mức phù hợp</option>
                <option value="deadline">Deadline gần nhất</option>
                <option value="funding">Mức tài trợ</option>
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Không có học bổng khớp bộ lọc. Thử <button onClick={clearAll} className="text-indigo-600 underline">xóa bộ lọc</button>.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map(({ s, match }) => (
                <ScholarshipCard key={s.id} s={s} match={match} />
              ))}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Xem <Link href="/board" className="text-indigo-600 underline">Bảng theo dõi</Link> để quản lý tiến độ ứng tuyển.
          </p>
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-100 py-3 first:border-t-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-indigo-600" />
      <span>{label}</span>
    </label>
  );
}
