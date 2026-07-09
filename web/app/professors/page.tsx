"use client";

// Danh sách giáo sư / người hướng dẫn (E15) — tìm theo hướng nghiên cứu.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FlaskConical, Medal, Flag, UserSearch, Search } from "lucide-react";
import { professors, scholarshipById } from "@/lib/data";
import { flagEmoji } from "@/lib/ui";
import FilterDropdown from "@/components/FilterDropdown";
import AcademicScene from "@/components/AcademicScene";

const PROF_FIELDS = Array.from(new Set(professors.flatMap((p) => p.fields))).sort();
const PROF_COUNTRIES = Array.from(new Set(professors.map((p) => p.countryCode)));
const RANKS = ["professor", "associate", "assistant", "dr"] as const;
const RANK_CLS: Record<string, string> = {
  professor: "bg-[#eef2ff] text-[#4338ca] ring-[#c7d2fe]",
  associate: "bg-[#e0f2fe] text-[#0369a1] ring-[#bae6fd]",
  assistant: "bg-[#e9f8f0] text-[#0b7a52] ring-[#c4ecd8]",
  dr: "bg-[#f1f5f9] text-[#475569] ring-[#e2e8f0]",
};

const RECRUITING_CLS: Record<string, string> = {
  recruiting: "bg-[#e9f8f0] text-[#0b7a52] ring-[#c4ecd8]",
  unknown: "bg-[#f1f5f9] text-[#475569] ring-[#e2e8f0]",
  not_recruiting: "bg-[#fdecee] text-[#b23343] ring-[#f7ccd2]",
};
const RECRUITING_KEY: Record<string, string> = {
  recruiting: "professors.recruiting",
  unknown: "professors.unknown",
  not_recruiting: "professors.notRecruiting",
};

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function ProfessorsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [recruiting, setRecruiting] = useState<string[]>([]);

  const results = useMemo(() => {
    let list = [...professors];
    if (q.trim()) {
      const k = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(k) ||
          p.university.toLowerCase().includes(k) ||
          p.department.toLowerCase().includes(k) ||
          p.keywords.some((kw) => kw.toLowerCase().includes(k)) ||
          p.fields.some((f) => f.toLowerCase().includes(k))
      );
    }
    if (fields.length) list = list.filter((p) => p.fields.some((f) => fields.includes(f)));
    if (ranks.length) list = list.filter((p) => ranks.includes(p.rank));
    if (countries.length) list = list.filter((p) => countries.includes(p.countryCode));
    if (recruiting.length) list = list.filter((p) => recruiting.includes(p.recruiting));
    // Ưu tiên người đang tuyển, rồi theo chỉ số
    const order = { recruiting: 0, unknown: 1, not_recruiting: 2 } as const;
    list.sort((a, b) => order[a.recruiting] - order[b.recruiting] || b.metrics.hIndex - a.metrics.hIndex);
    return list;
  }, [q, fields, ranks, countries, recruiting]);

  const active = fields.length + ranks.length + countries.length + recruiting.length;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(150deg,#0e1638_0%,#1c2a63_52%,#34459c_100%)] px-8 py-9 text-white">
        <div className="starfield pointer-events-none absolute inset-0" />
        <AcademicScene id="profs" />
        <div className="relative">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#cdd6f7]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            {t("professors.count", { n: results.length })}
          </div>
          <h1 className="text-[27px] font-extrabold tracking-tight">{t("professors.title")}</h1>
          <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-[#c5d2f0]">{t("professors.desc")}</p>
          <div className="relative mt-5 flex max-w-[520px] items-center rounded-[13px] bg-white shadow-[0_14px_34px_-16px_rgba(0,0,0,0.5)]">
            <Search className="absolute left-4 h-[18px] w-[18px] text-[#93a7bd]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("professors.searchPh")}
              className="w-full rounded-[13px] border-0 bg-transparent py-3 pl-11 pr-4 text-[14px] text-[#1a3352] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Hàng lọc ngang */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label={t("professors.fField")} icon={<FlaskConical className="h-4 w-4" />} searchable
          options={PROF_FIELDS.map((f) => ({ value: f, label: f }))}
          selected={fields}
          onToggle={(v) => setFields(toggle(fields, v))}
          onClear={() => setFields([])}
        />
        <FilterDropdown
          label={t("professors.fRank")} icon={<Medal className="h-4 w-4" />}
          options={RANKS.map((r) => ({ value: r, label: t(`rank.${r}`) }))}
          selected={ranks}
          onToggle={(v) => setRanks(toggle(ranks, v))}
          onClear={() => setRanks([])}
        />
        <FilterDropdown
          label={t("professors.fCountry")} icon={<Flag className="h-4 w-4" />}
          options={PROF_COUNTRIES.map((c) => ({ value: c, label: `${flagEmoji(c)} ${t(`country.${c}`)}` }))}
          selected={countries}
          onToggle={(v) => setCountries(toggle(countries, v))}
          onClear={() => setCountries([])}
        />
        <FilterDropdown
          label={t("professors.fRecruiting")} icon={<UserSearch className="h-4 w-4" />}
          options={Object.keys(RECRUITING_KEY).map((v) => ({ value: v, label: t(RECRUITING_KEY[v]) }))}
          selected={recruiting}
          onToggle={(v) => setRecruiting(toggle(recruiting, v))}
          onClear={() => setRecruiting([])}
        />
        {active > 0 && (
          <button
            onClick={() => { setFields([]); setRanks([]); setCountries([]); setRecruiting([]); }}
            className="flex items-center gap-1.5 rounded-[11px] border border-[#f7d0d5] bg-[#fff0f1] px-3 py-2 text-xs font-bold text-[#d33a4a]"
          >
            {t("professors.clearFilters", { n: active })}
          </button>
        )}
        <p className="ml-auto text-sm text-[#5a7794]">
          <b className="text-[21px] font-extrabold text-[#1a3352]">{results.length}</b>
        </p>
      </div>

      {/* Kết quả */}
      {results.length === 0 ? (
        <div className="mt-6 rounded-[18px] border border-dashed border-[#cfe0f2] bg-white p-12 text-center text-[#5a7794]">
          {t("professors.empty")}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
          {results.map((p) => {
            const sch = p.scholarshipIds[0] ? scholarshipById(p.scholarshipIds[0]) : null;
            return (
              <div key={p.id} className="flex flex-col rounded-[18px] border border-[#e2e8f4] bg-white p-[18px] shadow-[0_1px_2px_rgba(23,50,76,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/professors/${p.id}`} className="text-[16px] font-extrabold text-[#1a3352] hover:text-[#4f46e5]">
                      {p.name}
                    </Link>
                    <p className="mt-1">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${RANK_CLS[p.rank]}`}>{t(`rank.${p.rank}`)}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#7591ab]">{flagEmoji(p.countryCode)} {p.university}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${RECRUITING_CLS[p.recruiting]}`}>
                    {t(RECRUITING_KEY[p.recruiting])}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.keywords.slice(0, 3).map((k) => (
                    <span key={k} className="rounded-full bg-[#eef1fd] px-2.5 py-0.5 text-[11px] font-semibold text-[#4f46e5] ring-1 ring-[#dbe0fb]">{k}</span>
                  ))}
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#7591ab]">{p.summary}</p>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#f3f6fd] p-2 text-center">
                  <div><p className="text-sm font-extrabold text-[#1a3352]">{p.metrics.publications}</p><p className="text-[10px] text-[#93a7bd]">{t("professors.pubs")}</p></div>
                  {/* Locale cố định để server/client render giống nhau (tránh hydration mismatch) */}
                  <div><p className="text-sm font-extrabold text-[#1a3352]">{p.metrics.citations.toLocaleString("en-US")}</p><p className="text-[10px] text-[#93a7bd]">{t("professors.cites")}</p></div>
                  <div><p className="text-sm font-extrabold text-[#1a3352]">{p.metrics.hIndex}</p><p className="text-[10px] text-[#93a7bd]">{t("professors.hIndex")}</p></div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  {sch ? (
                    <Link href={`/scholarships/${sch.id}`} className="truncate text-xs text-[#2f6fe0] hover:underline" title={sch.title}>
                      🎓 {sch.title.length > 24 ? sch.title.slice(0, 24) + "…" : sch.title}
                    </Link>
                  ) : <span />}
                  <Link href={`/professors/${p.id}`} className="shrink-0 rounded-[10px] bg-[#4f46e5] px-3 py-1.5 text-xs font-bold text-white hover:brightness-110">
                    {t("professors.cta")} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[#93a7bd]">
        💡 {t("professors.tipPre")} <b className="text-[#5a7794]">{t("professors.tipBold")}</b> {t("professors.tipPost")}
      </p>
    </div>
  );
}
