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

  // Chips chọn nhanh trên hero — nối vào các bộ lọc sẵn có
  const quickChips: { label: string; active: boolean; onClick: () => void }[] = [
    { label: `💰 ${t("funding.Full")}`, active: funding.includes("Full"), onClick: () => setFunding(toggle(funding, "Full")) },
    { label: `🎓 ${t("level.Master")}`, active: levels.includes("Master"), onClick: () => setLevels(toggle(levels, "Master")) },
    { label: `🎓 ${t("level.PhD")}`, active: levels.includes("PhD"), onClick: () => setLevels(toggle(levels, "PhD")) },
    { label: `✅ ${t("sidebar.eligibleOnly")}`, active: eligibleOnly, onClick: () => setEligibleOnly((v) => !v) },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-16">
      {/* ============ STARRY HERO ============ */}
      <section className="pt-6">
        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#0a1230_0%,#152159_52%,#243a86_100%)] px-8 py-11 sm:px-10">
          <div className="starfield pointer-events-none absolute inset-0" />
          {/* twinkles */}
          <div className="animate-twinkle pointer-events-none absolute left-[22%] top-8 h-1 w-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" />
          <div className="animate-twinkle pointer-events-none absolute left-[64%] top-[70px] h-[3px] w-[3px] rounded-full bg-[#cfe0ff] shadow-[0_0_7px_2px_rgba(160,200,255,0.7)] [animation-delay:0.6s]" />
          <div className="animate-twinkle pointer-events-none absolute left-[84%] top-11 h-1 w-1 rounded-full bg-[#ffe9a8] shadow-[0_0_9px_2px_rgba(255,220,140,0.7)] [animation-delay:0.3s]" />
          {/* crescent moon */}
          <div className="pointer-events-none absolute right-11 top-8 text-[#f6efc9] opacity-90 drop-shadow-[0_0_16px_rgba(246,239,201,0.5)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" /></svg>
          </div>
          {/* flight arc + plane */}
          <svg className="pointer-events-none absolute right-0 top-0 h-full w-[62%]" viewBox="0 0 560 320" fill="none" preserveAspectRatio="xMaxYMin meet">
            <path className="animate-dash" d="M10 300 C 180 270, 300 230, 400 150 S 540 60, 560 30" stroke="#7cb8ff" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" opacity="0.65" />
          </svg>
          <div className="animate-plane pointer-events-none absolute right-[16%] top-[88px] text-[#dbe9ff] drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)]">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.34-1.97-1.54-1.45.39 2.59 4.49 17.42-4.67c.81-.23 1.28-1.05 1.06-1.86z" /></svg>
          </div>

          <div className="relative max-w-[600px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-[#cfe0ff]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#4ade80] shadow-[0_0_0_4px_rgba(74,222,128,0.2)]" />
              {t("results.count", { n: scholarships.length })} · 7/2026
            </div>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[39px]">
              {t("hero.title")} <span className="text-[#a5cbff]">{t("hero.titleHl")}</span>
            </h1>
            <p className="mt-3.5 max-w-[490px] text-[15px] leading-relaxed text-white/75">{t("hero.desc")}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="relative flex min-w-[260px] flex-1 items-center rounded-[14px] bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]">
                <svg className="absolute left-4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93a7bd" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("hero.searchPh")}
                  className="w-full rounded-[14px] border-0 bg-transparent py-3.5 pl-11 pr-4 text-[14.5px] text-[#1a3352] outline-none"
                />
              </div>
              <Link
                href="/start"
                className="flex items-center gap-2.5 rounded-[14px] bg-gradient-to-br from-[#3b82f6] to-[#5aa2ff] px-5 py-3.5 text-[14.5px] font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(59,130,246,0.9)] transition hover:brightness-110"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 13.9 8.6 19.5 8.6 15 12.1 16.7 17.6 12 14.2 7.3 17.6 9 12.1 4.5 8.6 10.1 8.6z" /></svg>
                {t("hero.start")}
              </Link>
              <button
                onClick={() => setShowProfile((v) => !v)}
                title={t("hero.profile")}
                className="grid place-items-center rounded-[14px] border border-white/20 bg-white/10 px-4 text-white transition hover:bg-white/20"
              >
                ⚙️
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[12.5px] font-semibold text-white/60">{t("common.quickPick")}:</span>
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={chip.onClick}
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                    chip.active
                      ? "border-white/40 bg-white/25 text-white"
                      : "border-white/20 bg-white/10 text-[#e7f0ff] hover:bg-white/20"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trình chỉnh hồ sơ */}
      {showProfile && (
        <section className="animate-drop mt-4 rounded-[18px] border border-[#dce8f4] bg-white p-5 shadow-[0_1px_2px_rgba(23,50,76,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-extrabold text-[#1a3352]">{t("profilePanel.title")}</h2>
            <div className="flex items-center gap-3">
              <Link href="/start" className="text-sm font-semibold text-[#2f6fe0] hover:underline">✨ {t("profilePanel.wizardLink")}</Link>
              <button onClick={() => setShowProfile(false)} className="text-sm text-[#7591ab] hover:text-[#1a3352]">{t("common.close")}</button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.level")}</span>
              <select
                value={profile.level}
                onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })}
                className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-[#1a3352]"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{t(`level.${l}`)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.gpa")}</span>
              <input
                type="number" step="0.1" min="0" max="4" value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-[#1a3352]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.ielts")}</span>
              <input
                type="number" step="0.5" min="0" max="9" value={profile.ielts}
                onChange={(e) => setProfile({ ...profile, ielts: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-[#1a3352]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.fundingNeed")}</span>
              <select
                value={profile.fundingNeed}
                onChange={(e) => setProfile({ ...profile, fundingNeed: e.target.value as "Full" | "Partial" | "Any" })}
                className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-[#1a3352]"
              >
                <option value="Full">{t("profilePanel.needFull")}</option>
                <option value="Partial">{t("profilePanel.needPartial")}</option>
                <option value="Any">{t("profilePanel.needAny")}</option>
              </select>
            </label>
          </div>
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-[10px] bg-[#f6f9fd] px-3 py-2 text-sm ring-1 ring-[#dce8f4]">
            <input
              type="checkbox"
              checked={profile.hasGre}
              onChange={() => setProfile({ ...profile, hasGre: !profile.hasGre })}
              className="h-4 w-4 accent-[#2f6fe0]"
            />
            <span className="text-[#455f78]">{t("profilePanel.hasGre")}</span>
          </label>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.fields")}</span>
              <div className="flex flex-wrap gap-1.5">
                {FIELDS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setProfile({ ...profile, fields: toggle(profile.fields, f) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
                      profile.fields.includes(f)
                        ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]"
                        : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <span className="mb-1 block font-semibold text-[#5a7794]">{t("profilePanel.countries")}</span>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setProfile({ ...profile, countries: toggle(profile.countries, c.code) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
                      profile.countries.includes(c.code)
                        ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]"
                        : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}
                  >{flagEmoji(c.code)} {t(`country.${c.code}`)}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nội dung: sidebar dọc (nâng cao) + kết quả */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[258px_1fr]">
        {/* SIDEBAR */}
        <aside className="h-fit lg:sticky lg:top-[82px]">
          <div className="rounded-[18px] border border-[#d9e6f3] bg-white p-2 shadow-[0_1px_2px_rgba(23,50,76,0.03)]">
            <div className="flex items-center gap-2 px-3 pb-2.5 pt-3 text-sm font-extrabold text-[#1a3352]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
              {t("sidebar.advanced")}
            </div>

            <Accordion title={`🏆 ${t("sidebar.qs")}`} active={maxRank > 0}>
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 10, 30, 50, 100].map((v) => (
                  <button key={v} onClick={() => setMaxRank(v)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 transition ${
                      maxRank === v ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}>{v === 0 ? t("sidebar.anyRank") : t("sidebar.topN", { n: v })}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`📝 ${t("sidebar.ielts")}`} active={maxIelts > 0}>
              <p className="mb-2 text-xs text-[#93a7bd]">{t("sidebar.ieltsHint")}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 6.0, 6.5, 7.0].map((v) => (
                  <button key={v} onClick={() => setMaxIelts(v)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 transition ${
                      maxIelts === v ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}>{v === 0 ? t("common.any") : `≤ ${v.toFixed(1)}`}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`🧮 ${t("sidebar.gre")}`} active={gre !== "any"}>
              <div className="flex gap-1.5">
                {(["any", "no", "yes"] as const).map((v) => (
                  <button key={v} onClick={() => setGre(v)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 transition ${
                      gre === v ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}>{v === "any" ? t("common.any") : v === "no" ? t("sidebar.greNo") : t("sidebar.greYes")}</button>
                ))}
              </div>
            </Accordion>

            <Accordion title={`👨‍🏫 ${t("sidebar.supervisor")}`} active={supervisor !== "any"}>
              <div className="flex gap-1.5">
                {(["any", "yes", "no"] as const).map((v) => (
                  <button key={v} onClick={() => setSupervisor(v)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 transition ${
                      supervisor === v ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}>{v === "any" ? t("common.any") : v === "yes" ? t("common.yes") : t("common.no")}</button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-[#93a7bd]">{t("sidebar.supervisorHint")}</p>
            </Accordion>

            <Accordion title={`🗣️ ${t("sidebar.teachLang")}`} active={languages.length > 0}>
              <div className="space-y-1.5">
                {LANGUAGES.map((l) => (
                  <label key={l} className="flex cursor-pointer items-center gap-2 text-sm text-[#455f78]">
                    <input type="checkbox" checked={languages.includes(l)} onChange={() => setLanguages(toggle(languages, l))} className="h-4 w-4 accent-[#2f6fe0]" />
                    <span>{teachLanguages(l, t)}</span>
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion title={`🏷️ ${t("sidebar.tags")}`} active={tags.length > 0}>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tg) => (
                  <button key={tg} onClick={() => setTags(toggle(tags, tg))}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${
                      tags.includes(tg) ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"
                    }`}>{tg}</button>
                ))}
              </div>
            </Accordion>

            <div className="border-t border-[#eef3f9] p-3">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#c4ecd8] bg-[#e9f8f0] px-3 py-2.5">
                <input type="checkbox" checked={eligibleOnly} onChange={() => setEligibleOnly((v) => !v)} className="h-4 w-4 accent-[#0f9d6b]" />
                <span className="text-[12.5px] font-bold text-[#0b7a52]">{t("sidebar.eligibleOnly")}</span>
              </label>
            </div>
          </div>

          {/* Tóm tắt hồ sơ */}
          <div className="mt-4 rounded-[18px] border border-[#dce8f4] bg-white p-4 text-sm shadow-[0_1px_2px_rgba(23,50,76,0.03)]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-[#1a3352]">{t("sidebar.profileTitle")}</h3>
              <button onClick={() => { setShowProfile(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs text-[#2f6fe0] hover:underline">{t("common.edit")}</button>
            </div>
            <dl className="space-y-1 text-xs text-[#5a7794]">
              <div className="flex justify-between"><dt>{t("sidebar.rowLevel")}</dt><dd className="font-semibold text-[#1a3352]">{t(`level.${profile.level}`)}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowGpa")}</dt><dd className="font-semibold text-[#1a3352]">{profile.gpa.toFixed(1)}/4.0</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowIelts")}</dt><dd className="font-semibold text-[#1a3352]">{profile.ielts.toFixed(1)}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowGre")}</dt><dd className="font-semibold text-[#1a3352]">{profile.hasGre ? t("sidebar.greHave") : t("sidebar.greNone")}</dd></div>
              <div className="flex justify-between"><dt>{t("sidebar.rowFunding")}</dt><dd className="font-semibold text-[#1a3352]">{profile.fundingNeed === "Full" ? t("profilePanel.needFull") : profile.fundingNeed === "Partial" ? t("profilePanel.needPartial") : t("profilePanel.needAny")}</dd></div>
            </dl>
            <Link href="/start" className="mt-3 block rounded-[10px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-3 py-2 text-center text-xs font-bold text-white transition hover:brightness-110">
              ✨ {t("sidebar.wizardCta")}
            </Link>
          </div>
        </aside>

        {/* KẾT QUẢ */}
        <main>
          {/* Thanh lọc ngang */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-[16px] border border-[#d9e6f3] bg-white p-3 shadow-[0_4px_16px_-10px_rgba(23,50,76,0.25)]">
            <div className="flex items-center gap-1.5 px-1 text-[13.5px] font-extrabold text-[#2f6fe0]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z" /></svg>
              {t("filter.title")}
            </div>
            <FilterDropdown
              label={t("filter.region")} icon="🌍"
              options={REGIONS.map((r) => ({ value: r, label: t(`region.${REGION_KEY[r]}`) }))}
              selected={regions} onToggle={(v) => setRegions(toggle(regions, v))} onClear={() => setRegions([])}
            />
            <FilterDropdown
              label={t("filter.country")} icon="🚩" searchable
              options={COUNTRIES.map((c) => ({ value: c.code, label: `${flagEmoji(c.code)} ${t(`country.${c.code}`)}` }))}
              selected={countries} onToggle={(v) => setCountries(toggle(countries, v))} onClear={() => setCountries([])}
            />
            <FilterDropdown
              label={t("filter.level")} icon="🎓"
              options={LEVELS.map((l) => ({ value: l, label: t(`level.${l}`) }))}
              selected={levels} onToggle={(v) => setLevels(toggle(levels, v as Level))} onClear={() => setLevels([])}
            />
            <FilterDropdown
              label={t("filter.field")} icon="📚" searchable
              options={FIELDS.map((f) => ({ value: f, label: f }))}
              selected={fields} onToggle={(v) => setFields(toggle(fields, v))} onClear={() => setFields([])}
            />
            <FilterDropdown
              label={t("filter.funding")} icon="💰"
              options={FUNDINGS.map((f) => ({ value: f, label: t(`funding.${f}`) }))}
              selected={funding} onToggle={(v) => setFunding(toggle(funding, v as FundingLevel))} onClear={() => setFunding([])}
            />
            <FilterDropdown
              label={t("filter.providerType")} icon="🏛️"
              options={PROVIDER_TYPES.map((p) => ({ value: p, label: t(`providerType.${p}`) }))}
              selected={providerTypes} onToggle={(v) => setProviderTypes(toggle(providerTypes, v as ProviderType))} onClear={() => setProviderTypes([])}
            />
            <FilterDropdown
              label={t("filter.deadline")} icon="⏰"
              options={DL_STATUSES.map((d) => ({ value: d, label: t(`deadlineStatus.${d}`) }))}
              selected={dlStatus} onToggle={(v) => setDlStatus(toggle(dlStatus, v as DeadlineStatus))} onClear={() => setDlStatus([])}
            />
            <FilterDropdown
              label={t("filter.intake")} icon="🗓️" align="right"
              options={INTAKES.map((i) => ({ value: i, label: i }))}
              selected={intakes} onToggle={(v) => setIntakes(toggle(intakes, v))} onClear={() => setIntakes([])}
            />

            <div className="flex-1" />
            {chips.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1.5 rounded-[11px] border border-[#f7d0d5] bg-[#fff0f1] px-3 py-2 text-[12.5px] font-bold text-[#d33a4a]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                {t("common.clearAll")} ({chips.length})
              </button>
            )}
            <label className="flex items-center gap-2 pr-1 text-[12.5px] font-semibold text-[#5a7794]">{t("filter.sortLabel")}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-[10px] border border-[#cfe0f2] bg-white px-2.5 py-2 text-[12.5px] font-semibold text-[#1a3352] outline-none"
              >
                <option value="match">{t("filter.sortMatch")}</option>
                <option value="deadline">{t("filter.sortDeadline")}</option>
                <option value="funding">{t("filter.sortFunding")}</option>
                <option value="qs">{t("filter.sortQs")}</option>
              </select>
            </label>
          </div>

          {/* Chips bộ lọc đang áp dụng */}
          {chips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {chips.map((c, i) => (
                <button key={i} onClick={c.onRemove} className="animate-drop flex items-center gap-1.5 rounded-full border border-[#c4dbfb] bg-[#e7f0ff] py-1 pl-3 pr-2 text-xs font-semibold text-[#1c5cc0]">
                  {c.label}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              ))}
            </div>
          )}

          {/* Header kết quả */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#5a7794]">
              <span className="text-[21px] font-extrabold text-[#1a3352]">{results.length}</span> {t("results.matchWord")}
            </p>
            <Link href="/start" className="flex items-center gap-1.5 rounded-[11px] border border-[#c8dcfa] bg-[#eaf1fd] px-3.5 py-2 text-[12.5px] font-bold text-[#2f6fe0]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 13.9 8.6 19.5 8.6 15 12.1 16.7 17.6 12 14.2 7.3 17.6 9 12.1 4.5 8.6 10.1 8.6z" /></svg>
              {t("results.suggestCta")}
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#cfe0f2] bg-white p-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4fb]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#93a7bd" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <p className="mt-3.5 font-semibold text-[#5a7794]">{t("results.emptyTitle")}</p>
              <button onClick={clearAll} className="mt-3 rounded-[11px] bg-[#2f6fe0] px-5 py-2.5 text-[13.5px] font-bold text-white">{t("results.clearFilters")}</button>
            </div>
          ) : (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
              {results.map(({ s, match }) => (
                <ScholarshipCard key={s.id} s={s} match={match} />
              ))}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[#93a7bd]">
            {t("results.tip1")} <b className="text-[#5a7794]">⇄ {t("results.tipCompare")}</b> {t("results.tip2")}{" "}
            <Link href="/board" className="text-[#2f6fe0] underline">{t("results.tipBoard")}</Link> {t("results.tip3")}
          </p>
        </main>
      </div>
    </div>
  );
}

// Nhóm lọc dạng accordion: đóng mặc định, bấm mới xổ nội dung
function Accordion({ title, active, children }: { title: string; active?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#eef3f9]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-3 text-left"
      >
        <span className="text-[13.5px] font-bold text-[#324a63]">{title}</span>
        <span className="flex items-center gap-1.5">
          {active && <span className="h-2 w-2 rounded-full bg-[#2f6fe0]" />}
          <svg className={`h-3.5 w-3.5 text-[#93a7bd] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {open && <div className="animate-drop px-3 pb-4">{children}</div>}
    </div>
  );
}
