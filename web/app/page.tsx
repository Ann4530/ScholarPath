"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  scholarships,
  matchScore,
  deadlineStatus,
  teachLanguages,
  FIELDS,
  REGIONS,
  REGION_KEY,
  COUNTRIES,
  INTAKES,
  LANGUAGES,
  ALL_TAGS,
  Level,
  FundingLevel,
  ProviderType,
  DeadlineStatus,
} from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";
import ScholarshipCard from "@/components/ScholarshipCard";
import FilterDropdown from "@/components/FilterDropdown";

const LEVELS: Level[] = ["Bachelor", "Master", "PhD"];
const FUNDINGS: FundingLevel[] = ["Full", "Partial", "TuitionOnly"];
const PROVIDER_TYPES: ProviderType[] = ["Government", "University", "Org", "Corporate"];
const DL_STATUSES: DeadlineStatus[] = ["open", "upcoming", "closing", "closed"];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

type Sort = "match" | "deadline" | "funding" | "qs";

export default function SearchPage() {
  const { t } = useTranslation();
  const { profile, setProfile } = useTrack();

  const [q, setQ] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [funding, setFunding] = useState<FundingLevel[]>([]);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
  const [dlStatus, setDlStatus] = useState<DeadlineStatus[]>([]);
  const [intakes, setIntakes] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [maxRank, setMaxRank] = useState(0);
  const [maxIelts, setMaxIelts] = useState(0);
  const [gre, setGre] = useState<"any" | "no" | "yes">("any");
  const [supervisor, setSupervisor] = useState<"any" | "yes" | "no">("any");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("match");
  const [showProfile, setShowProfile] = useState(false);
  const urlReady = useRef(false);

  // ---- Đọc bộ lọc từ URL khi mở trang (chia sẻ được link / nhận từ wizard) ----
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- khởi tạo từ URL sau mount, tránh hydration mismatch */
    const p = new URLSearchParams(window.location.search);
    const arr = (k: string) => p.get(k)?.split(",").filter(Boolean) ?? [];
    if (p.get("q")) setQ(p.get("q")!);
    if (p.get("rg")) setRegions(arr("rg").filter((x) => (REGIONS as readonly string[]).includes(x)));
    if (p.get("c")) setCountries(arr("c"));
    if (p.get("lv")) setLevels(arr("lv").filter((x): x is Level => (LEVELS as string[]).includes(x)));
    if (p.get("f")) setFields(arr("f"));
    if (p.get("fd")) setFunding(arr("fd").filter((x): x is FundingLevel => (FUNDINGS as string[]).includes(x)));
    if (p.get("pt")) setProviderTypes(arr("pt").filter((x): x is ProviderType => (PROVIDER_TYPES as string[]).includes(x)));
    if (p.get("ds")) setDlStatus(arr("ds").filter((x): x is DeadlineStatus => (DL_STATUSES as string[]).includes(x)));
    if (p.get("it")) setIntakes(arr("it"));
    if (p.get("lg")) setLanguages(arr("lg"));
    if (p.get("tg")) setTags(arr("tg"));
    if (p.get("qs")) setMaxRank(Number(p.get("qs")) || 0);
    if (p.get("ie")) setMaxIelts(Number(p.get("ie")) || 0);
    if (p.get("gre") === "no" || p.get("gre") === "yes") setGre(p.get("gre") as "no" | "yes");
    if (p.get("sup") === "yes" || p.get("sup") === "no") setSupervisor(p.get("sup") as "yes" | "no");
    if (p.get("el") === "1") setEligibleOnly(true);
    const s = p.get("sort");
    if (s === "deadline" || s === "funding" || s === "qs") setSort(s);
    /* eslint-enable react-hooks/set-state-in-effect */
    urlReady.current = true;
  }, []);

  // ---- Ghi bộ lọc lên URL (không reload) ----
  useEffect(() => {
    if (!urlReady.current) return;
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (regions.length) p.set("rg", regions.join(","));
    if (countries.length) p.set("c", countries.join(","));
    if (levels.length) p.set("lv", levels.join(","));
    if (fields.length) p.set("f", fields.join(","));
    if (funding.length) p.set("fd", funding.join(","));
    if (providerTypes.length) p.set("pt", providerTypes.join(","));
    if (dlStatus.length) p.set("ds", dlStatus.join(","));
    if (intakes.length) p.set("it", intakes.join(","));
    if (languages.length) p.set("lg", languages.join(","));
    if (tags.length) p.set("tg", tags.join(","));
    if (maxRank > 0) p.set("qs", String(maxRank));
    if (maxIelts > 0) p.set("ie", String(maxIelts));
    if (gre !== "any") p.set("gre", gre);
    if (supervisor !== "any") p.set("sup", supervisor);
    if (eligibleOnly) p.set("el", "1");
    if (sort !== "match") p.set("sort", sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
  }, [q, regions, countries, levels, fields, funding, providerTypes, dlStatus, intakes, languages, tags, maxRank, maxIelts, gre, supervisor, eligibleOnly, sort]);

  // ---- Lọc + sắp xếp ----
  const results = useMemo(() => {
    let list = scholarships.map((s) => ({ s, match: matchScore(profile, s, t) }));

    if (q.trim()) {
      const k = q.toLowerCase();
      list = list.filter(
        ({ s }) =>
          s.title.toLowerCase().includes(k) ||
          s.university.toLowerCase().includes(k) ||
          s.country.toLowerCase().includes(k) ||
          s.city.toLowerCase().includes(k) ||
          s.fields.some((f) => f.toLowerCase().includes(k)) ||
          s.tags.some((tg) => tg.toLowerCase().includes(k)) ||
          s.provider.toLowerCase().includes(k)
      );
    }
    if (regions.length) list = list.filter(({ s }) => regions.includes(s.region));
    if (countries.length) list = list.filter(({ s }) => countries.includes(s.countryCode));
    if (levels.length) list = list.filter(({ s }) => s.levels.some((l) => levels.includes(l)));
    if (fields.length) list = list.filter(({ s }) => s.fields.some((f) => fields.includes(f)));
    if (funding.length) list = list.filter(({ s }) => funding.includes(s.fundingLevel));
    if (providerTypes.length) list = list.filter(({ s }) => providerTypes.includes(s.providerType));
    if (dlStatus.length) list = list.filter(({ s }) => dlStatus.includes(deadlineStatus(s)));
    if (intakes.length) list = list.filter(({ s }) => intakes.includes(s.intake));
    if (languages.length)
      list = list.filter(({ s }) => languages.some((lg) => s.language.includes(lg)));
    if (tags.length) list = list.filter(({ s }) => s.tags.some((tg) => tags.includes(tg)));
    if (maxRank > 0) list = list.filter(({ s }) => s.qsRank <= maxRank);
    if (maxIelts > 0) list = list.filter(({ s }) => s.eligibility.minIelts <= maxIelts);
    if (gre !== "any") list = list.filter(({ s }) => (gre === "yes" ? s.eligibility.gre : !s.eligibility.gre));
    if (supervisor !== "any")
      list = list.filter(({ s }) => (supervisor === "yes" ? s.requiresSupervisor : !s.requiresSupervisor));
    if (eligibleOnly) list = list.filter(({ match }) => match.tier !== "ineligible");

    list.sort((a, b) => {
      if (sort === "match") return b.match.score - a.match.score;
      if (sort === "qs") return a.s.qsRank - b.s.qsRank;
      if (sort === "funding") {
        const order = { Full: 0, Partial: 1, TuitionOnly: 2 } as const;
        return order[a.s.fundingLevel] - order[b.s.fundingLevel];
      }
      const na = a.s.deadlines[a.s.deadlines.length - 1].date;
      const nb = b.s.deadlines[b.s.deadlines.length - 1].date;
      return new Date(na).getTime() - new Date(nb).getTime();
    });
    return list;
  }, [profile, q, regions, countries, levels, fields, funding, providerTypes, dlStatus, intakes, languages, tags, maxRank, maxIelts, gre, supervisor, eligibleOnly, sort, t]);

  // ---- Chips "bộ lọc đang áp dụng" ----
  const chips: { label: string; onRemove: () => void }[] = [
    ...regions.map((r) => ({ label: `🌍 ${t(`region.${REGION_KEY[r as keyof typeof REGION_KEY]}`)}`, onRemove: () => setRegions(toggle(regions, r)) })),
    ...countries.map((c) => ({ label: `${flagEmoji(c)} ${t(`country.${c}`)}`, onRemove: () => setCountries(toggle(countries, c)) })),
    ...levels.map((l) => ({ label: `🎓 ${t(`level.${l}`)}`, onRemove: () => setLevels(toggle(levels, l)) })),
    ...fields.map((f) => ({ label: `📚 ${f}`, onRemove: () => setFields(toggle(fields, f)) })),
    ...funding.map((f) => ({ label: `💰 ${t(`funding.${f}`)}`, onRemove: () => setFunding(toggle(funding, f)) })),
    ...providerTypes.map((p) => ({ label: `🏛️ ${t(`providerType.${p}`)}`, onRemove: () => setProviderTypes(toggle(providerTypes, p)) })),
    ...dlStatus.map((d) => ({ label: `⏰ ${t(`deadlineStatus.${d}`)}`, onRemove: () => setDlStatus(toggle(dlStatus, d)) })),
    ...intakes.map((i) => ({ label: `🗓️ ${i}`, onRemove: () => setIntakes(toggle(intakes, i)) })),
    ...languages.map((l) => ({ label: `🗣️ ${teachLanguages(l, t)}`, onRemove: () => setLanguages(toggle(languages, l)) })),
    ...tags.map((tg) => ({ label: tg, onRemove: () => setTags(toggle(tags, tg)) })),
    ...(maxRank > 0 ? [{ label: `🏆 QS ${t("sidebar.topN", { n: maxRank })}`, onRemove: () => setMaxRank(0) }] : []),
    ...(maxIelts > 0 ? [{ label: `📝 IELTS ≤ ${maxIelts.toFixed(1)}`, onRemove: () => setMaxIelts(0) }] : []),
    ...(gre !== "any" ? [{ label: gre === "no" ? `🚫 ${t("sidebar.greNo")} GRE` : "GRE/GMAT", onRemove: () => setGre("any") }] : []),
    ...(supervisor !== "any" ? [{ label: `👨‍🏫 ${supervisor === "yes" ? t("common.yes") : t("common.no")}`, onRemove: () => setSupervisor("any") }] : []),
    ...(eligibleOnly ? [{ label: `✅ ${t("sidebar.eligibleOnly")}`, onRemove: () => setEligibleOnly(false) }] : []),
  ];

  const clearAll = () => {
    setRegions([]); setCountries([]); setLevels([]); setFields([]); setFunding([]);
    setProviderTypes([]); setDlStatus([]); setIntakes([]); setLanguages([]); setTags([]);
    setSupervisor("any"); setGre("any"); setEligibleOnly(false); setMaxRank(0); setMaxIelts(0); setQ("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-200">ScholarFinder</p>
          <h1 className="mt-1 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            {t("hero.title")} <span className="text-amber-300">{t("hero.titleHl")}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-indigo-100">{t("hero.desc")}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("hero.searchPh")}
                className="w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-slate-800 shadow-lg outline-none ring-2 ring-transparent focus:ring-amber-300"
              />
            </div>
            <Link
              href="/start"
              className="group flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              🚀 {t("hero.start")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="rounded-xl bg-white/15 px-5 py-3.5 font-medium ring-1 ring-white/40 transition hover:bg-white/25"
            >
              ⚙️ {t("hero.profile")}
            </button>
          </div>
          <p className="mt-3 text-xs text-indigo-200">
            💡 {t("hero.hint1")} <b>{t("hero.start")}</b> {t("hero.hint2")}
          </p>
        </div>
      </section>

      {/* Trình chỉnh hồ sơ */}
      {showProfile && (
        <section className="animate-drop mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{t("profilePanel.title")}</h2>
            <div className="flex items-center gap-3">
              <Link href="/start" className="text-sm font-medium text-indigo-600 hover:underline">✨ {t("profilePanel.wizardLink")}</Link>
              <button onClick={() => setShowProfile(false)} className="text-sm text-slate-500 hover:text-slate-800">{t("common.close")}</button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.level")}</span>
              <select
                value={profile.level}
                onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{t(`level.${l}`)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.gpa")}</span>
              <input
                type="number" step="0.1" min="0" max="4" value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.ielts")}</span>
              <input
                type="number" step="0.5" min="0" max="9" value={profile.ielts}
                onChange={(e) => setProfile({ ...profile, ielts: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.fundingNeed")}</span>
              <select
                value={profile.fundingNeed}
                onChange={(e) => setProfile({ ...profile, fundingNeed: e.target.value as "Full" | "Partial" | "Any" })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="Full">{t("profilePanel.needFull")}</option>
                <option value="Partial">{t("profilePanel.needPartial")}</option>
                <option value="Any">{t("profilePanel.needAny")}</option>
              </select>
            </label>
          </div>
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
            <input
              type="checkbox"
              checked={profile.hasGre}
              onChange={() => setProfile({ ...profile, hasGre: !profile.hasGre })}
              className="h-4 w-4 accent-indigo-600"
            />
            <span className="text-slate-700">{t("profilePanel.hasGre")}</span>
          </label>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.fields")}</span>
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
              <span className="mb-1 block font-medium text-slate-600">{t("profilePanel.countries")}</span>
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
                  >{flagEmoji(c.code)} {t(`country.${c.code}`)}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HÀNG LỌC NGANG — bấm vào mới xổ danh sách */}
      <div className="sticky top-14 z-30 -mx-4 mt-5 border-y border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <FilterDropdown
            label={t("filter.region")} icon="🌍"
            options={REGIONS.map((r) => ({ value: r, label: t(`region.${REGION_KEY[r]}`) }))}
            selected={regions}
            onToggle={(v) => setRegions(toggle(regions, v))}
            onClear={() => setRegions([])}
          />
          <FilterDropdown
            label={t("filter.country")} icon="🚩" searchable
            options={COUNTRIES.map((c) => ({ value: c.code, label: `${flagEmoji(c.code)} ${t(`country.${c.code}`)}` }))}
            selected={countries}
            onToggle={(v) => setCountries(toggle(countries, v))}
            onClear={() => setCountries([])}
          />
          <FilterDropdown
            label={t("filter.level")} icon="🎓"
            options={LEVELS.map((l) => ({ value: l, label: t(`level.${l}`) }))}
            selected={levels}
            onToggle={(v) => setLevels(toggle(levels, v as Level))}
            onClear={() => setLevels([])}
          />
          <FilterDropdown
            label={t("filter.field")} icon="📚" searchable
            options={FIELDS.map((f) => ({ value: f, label: f }))}
            selected={fields}
            onToggle={(v) => setFields(toggle(fields, v))}
            onClear={() => setFields([])}
          />
          <FilterDropdown
            label={t("filter.funding")} icon="💰"
            options={FUNDINGS.map((f) => ({ value: f, label: t(`funding.${f}`) }))}
            selected={funding}
            onToggle={(v) => setFunding(toggle(funding, v as FundingLevel))}
            onClear={() => setFunding([])}
          />
          <FilterDropdown
            label={t("filter.providerType")} icon="🏛️"
            options={PROVIDER_TYPES.map((p) => ({ value: p, label: t(`providerType.${p}`) }))}
            selected={providerTypes}
            onToggle={(v) => setProviderTypes(toggle(providerTypes, v as ProviderType))}
            onClear={() => setProviderTypes([])}
          />
          <FilterDropdown
            label={t("filter.deadline")} icon="⏰"
            options={DL_STATUSES.map((d) => ({ value: d, label: t(`deadlineStatus.${d}`) }))}
            selected={dlStatus}
            onToggle={(v) => setDlStatus(toggle(dlStatus, v as DeadlineStatus))}
            onClear={() => setDlStatus([])}
          />
          <FilterDropdown
            label={t("filter.intake")} icon="🗓️" align="right"
            options={INTAKES.map((i) => ({ value: i, label: i }))}
            selected={intakes}
            onToggle={(v) => setIntakes(toggle(intakes, v))}
            onClear={() => setIntakes([])}
          />

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden text-xs font-medium text-slate-400 sm:block">{t("filter.sortLabel")}</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              <option value="match">{t("filter.sortMatch")}</option>
              <option value="deadline">{t("filter.sortDeadline")}</option>
              <option value="funding">{t("filter.sortFunding")}</option>
              <option value="qs">{t("filter.sortQs")}</option>
            </select>
          </div>
        </div>

        {/* Chips bộ lọc đang áp dụng */}
        {chips.length > 0 && (
          <div className="mx-auto mt-2.5 flex max-w-7xl flex-wrap items-center gap-1.5">
            {chips.map((c, i) => (
              <span key={i} className="animate-drop flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                {c.label}
                <button onClick={c.onRemove} className="ml-0.5 text-indigo-400 hover:text-rose-600">✕</button>
              </span>
            ))}
            <button onClick={clearAll} className="ml-1 text-xs font-medium text-slate-400 hover:text-rose-600">
              {t("common.clearAll")}
            </button>
          </div>
        )}
      </div>

      {/* Nội dung: sidebar dọc (nâng cao) + kết quả */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm shadow-sm">
            <input type="checkbox" checked={eligibleOnly} onChange={() => setEligibleOnly((v) => !v)} className="h-4 w-4 accent-emerald-600" />
            <span className="font-medium text-emerald-800">{t("sidebar.eligibleOnly")}</span>
          </label>

          <div className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
            <div className="flex items-center justify-between py-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t("sidebar.advanced")}</h2>
            </div>

            <Accordion title={`🏆 ${t("sidebar.qs")}`} active={maxRank > 0}>
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 10, 30, 50, 100].map((v) => (
                  <button key={v} onClick={() => setMaxRank(v)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-medium ring-1 transition ${
                      maxRank === v ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}>{v === 0 ? t("sidebar.anyRank") : t("sidebar.topN", { n: v })}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`📝 ${t("sidebar.ielts")}`} active={maxIelts > 0}>
              <p className="mb-2 text-xs text-slate-400">{t("sidebar.ieltsHint")}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 6.0, 6.5, 7.0].map((v) => (
                  <button key={v} onClick={() => setMaxIelts(v)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-medium ring-1 transition ${
                      maxIelts === v ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}>{v === 0 ? t("common.any") : `≤ ${v.toFixed(1)}`}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`🧮 ${t("sidebar.gre")}`} active={gre !== "any"}>
              <div className="flex gap-1.5">
                {(["any", "no", "yes"] as const).map((v) => (
                  <button key={v} onClick={() => setGre(v)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ring-1 transition ${
                      gre === v ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}>{v === "any" ? t("common.any") : v === "no" ? t("sidebar.greNo") : t("sidebar.greYes")}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`👨‍🏫 ${t("sidebar.supervisor")}`} active={supervisor !== "any"}>
              <div className="flex gap-1.5">
                {(["any", "yes", "no"] as const).map((v) => (
                  <button key={v} onClick={() => setSupervisor(v)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ring-1 transition ${
                      supervisor === v ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400"
                    }`}>{v === "any" ? t("common.any") : v === "yes" ? t("common.yes") : t("common.no")}</button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-slate-400">{t("sidebar.supervisorHint")}</p>
            </Accordion>

            <Accordion title={`🗣️ ${t("sidebar.teachLang")}`} active={languages.length > 0}>
              <div className="space-y-1.5">
                {LANGUAGES.map((l) => (
                  <label key={l} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={languages.includes(l)} onChange={() => setLanguages(toggle(languages, l))} className="h-4 w-4 accent-indigo-600" />
                    <span>{teachLanguages(l, t)}</span>
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion title={`🏷️ ${t("sidebar.tags")}`} active={tags.length > 0}>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tg) => (
                  <button key={tg} onClick={() => setTags(toggle(tags, tg))}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition ${
                      tags.includes(tg) ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-500 ring-slate-300 hover:ring-indigo-400"
                    }`}>{tg}</button>
                ))}
              </div>
            </Accordion>
          </div>

          {/* Tóm tắt hồ sơ */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{t("sidebar.profileTitle")}</h3>
              <button onClick={() => { setShowProfile(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs text-indigo-600 hover:underline">{t("common.edit")}</button>
            </div>
            <dl className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between"><dt>{t("sidebar.rowLevel")}</dt><dd className="font-medium text-slate-800">{t(`level.${profile.level}`)}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowGpa")}</dt><dd className="font-medium text-slate-800">{profile.gpa.toFixed(1)}/4.0</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowIelts")}</dt><dd className="font-medium text-slate-800">{profile.ielts.toFixed(1)}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowGre")}</dt><dd className="font-medium text-slate-800">{profile.hasGre ? t("sidebar.greHave") : t("sidebar.greNone")}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowFunding")}</dt><dd className="font-medium text-slate-800">{profile.fundingNeed === "Full" ? t("profilePanel.needFull") : profile.fundingNeed === "Partial" ? t("profilePanel.needPartial") : t("profilePanel.needAny")}</dd></div>
            </dl>
            <Link href="/start" className="mt-3 block rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500">
              ✨ {t("sidebar.wizardCta")}
            </Link>
          </div>
        </aside>

        {/* Kết quả */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{t("results.count", { n: results.length })}</span>
              {chips.length > 0 && <span className="text-slate-400"> {t("results.filtersOn", { n: chips.length })}</span>}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="text-4xl">🔎</div>
              <p className="mt-3 font-medium text-slate-700">{t("results.emptyTitle")}</p>
              <p className="mt-1 text-sm text-slate-500">
                {t("results.tryPre")} <button onClick={clearAll} className="text-indigo-600 underline">{t("results.clearFilters")}</button> {t("results.or")}{" "}
                <Link href="/start" className="text-indigo-600 underline">{t("results.resetWizard")}</Link>.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map(({ s, match }) => (
                <ScholarshipCard key={s.id} s={s} match={match} />
              ))}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            {t("results.tip1")} <b>⇄ {t("results.tipCompare")}</b> {t("results.tip2")}{" "}
            <Link href="/board" className="text-indigo-600 underline">{t("results.tipBoard")}</Link> {t("results.tip3")}
          </p>
        </section>
      </div>
    </div>
  );
}

// Nhóm lọc dạng accordion: đóng mặc định, bấm mới xổ nội dung
function Accordion({ title, active, children }: { title: string; active?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <span className="flex items-center gap-1.5">
          {active && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
          <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {open && <div className="animate-drop pb-4">{children}</div>}
    </div>
  );
}
