"use client";

// Danh sách giáo sư / người hướng dẫn (E15) — tìm theo hướng nghiên cứu.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { professors, scholarshipById } from "@/lib/data";
import { flagEmoji } from "@/lib/ui";
import FilterDropdown from "@/components/FilterDropdown";

const PROF_FIELDS = Array.from(new Set(professors.flatMap((p) => p.fields))).sort();
const PROF_COUNTRIES = Array.from(new Set(professors.map((p) => p.countryCode)));
const RANKS = ["professor", "associate", "assistant", "dr"] as const;
const RANK_CLS: Record<string, string> = {
  professor: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  associate: "bg-sky-50 text-sky-700 ring-sky-200",
  assistant: "bg-teal-50 text-teal-700 ring-teal-200",
  dr: "bg-slate-100 text-slate-600 ring-slate-200",
};

const RECRUITING_CLS: Record<string, string> = {
  recruiting: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  unknown: "bg-slate-100 text-slate-600 ring-slate-200",
  not_recruiting: "bg-rose-100 text-rose-700 ring-rose-200",
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
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-700 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-2xl font-bold sm:text-3xl">{t("professors.title")}</h1>
        <p className="mt-2 max-w-2xl text-violet-100">{t("professors.desc")}</p>
        <div className="relative mt-4 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("professors.searchPh")}
            className="w-full rounded-xl border-0 py-3 pl-11 pr-4 text-slate-800 shadow-lg outline-none ring-2 ring-transparent focus:ring-amber-300"
          />
        </div>
      </section>

      {/* Hàng lọc ngang */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label={t("professors.fField")} icon="🧪" searchable
          options={PROF_FIELDS.map((f) => ({ value: f, label: f }))}
          selected={fields}
          onToggle={(v) => setFields(toggle(fields, v))}
          onClear={() => setFields([])}
        />
        <FilterDropdown
          label={t("professors.fRank")} icon="🎖️"
          options={RANKS.map((r) => ({ value: r, label: t(`rank.${r}`) }))}
          selected={ranks}
          onToggle={(v) => setRanks(toggle(ranks, v))}
          onClear={() => setRanks([])}
        />
        <FilterDropdown
          label={t("professors.fCountry")} icon="🚩"
          options={PROF_COUNTRIES.map((c) => ({ value: c, label: `${flagEmoji(c)} ${t(`country.${c}`)}` }))}
          selected={countries}
          onToggle={(v) => setCountries(toggle(countries, v))}
          onClear={() => setCountries([])}
        />
        <FilterDropdown
          label={t("professors.fRecruiting")} icon="🟢"
          options={Object.keys(RECRUITING_KEY).map((v) => ({ value: v, label: t(RECRUITING_KEY[v]) }))}
          selected={recruiting}
          onToggle={(v) => setRecruiting(toggle(recruiting, v))}
          onClear={() => setRecruiting([])}
        />
        {active > 0 && (
          <button
            onClick={() => { setFields([]); setRanks([]); setCountries([]); setRecruiting([]); }}
            className="text-xs font-medium text-slate-400 hover:text-rose-600"
          >
            {t("professors.clearFilters", { n: active })}
          </button>
        )}
        <p className="ml-auto text-sm text-slate-500">
          <b className="text-slate-900">{t("professors.count", { n: results.length })}</b>
        </p>
      </div>

      {/* Kết quả */}
      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          {t("professors.empty")}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => {
            const sch = p.scholarshipIds[0] ? scholarshipById(p.scholarshipIds[0]) : null;
            return (
              <div key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/professors/${p.id}`} className="font-bold text-slate-900 hover:text-violet-600">
                      {p.name}
                    </Link>
                    <p className="mt-1">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ${RANK_CLS[p.rank]}`}>{t(`rank.${p.rank}`)}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{flagEmoji(p.countryCode)} {p.university}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${RECRUITING_CLS[p.recruiting]}`}>
                    {t(RECRUITING_KEY[p.recruiting])}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.keywords.slice(0, 3).map((k) => (
                    <span key={k} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] text-violet-700 ring-1 ring-violet-200">{k}</span>
                  ))}
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.summary}</p>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2 text-center">
                  <div><p className="text-sm font-bold text-slate-800">{p.metrics.publications}</p><p className="text-[10px] text-slate-400">{t("professors.pubs")}</p></div>
                  {/* Locale cố định để server/client render giống nhau (tránh hydration mismatch) */}
                  <div><p className="text-sm font-bold text-slate-800">{p.metrics.citations.toLocaleString("en-US")}</p><p className="text-[10px] text-slate-400">{t("professors.cites")}</p></div>
                  <div><p className="text-sm font-bold text-slate-800">{p.metrics.hIndex}</p><p className="text-[10px] text-slate-400">{t("professors.hIndex")}</p></div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  {sch ? (
                    <Link href={`/scholarships/${sch.id}`} className="truncate text-xs text-indigo-600 hover:underline" title={sch.title}>
                      🎓 {sch.title.length > 24 ? sch.title.slice(0, 24) + "…" : sch.title}
                    </Link>
                  ) : <span />}
                  <Link href={`/professors/${p.id}`} className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700">
                    {t("professors.cta")} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-400">
        💡 {t("professors.tipPre")} <b>{t("professors.tipBold")}</b> {t("professors.tipPost")}
      </p>
    </div>
  );
}
