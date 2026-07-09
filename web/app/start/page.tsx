"use client";

// Wizard "Tối ưu lựa chọn" — user mới vào app bấm Bắt đầu và chọn từng bước.
// Kết thúc: lưu hồ sơ + chuyển sang trang tìm kiếm với bộ lọc đã thiết lập sẵn (qua URL).

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Globe, PenLine, Coins, Settings, PartyPopper, Backpack, Microscope, Gem, PiggyBank, Handshake, Trophy, UserCheck, CalendarDays, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import HeroSky from "@/components/HeroSky";
import {
  scholarships,
  matchScore,
  gpa10to4,
  FIELDS,
  REGIONS,
  REGION_KEY,
  COUNTRIES,
  INTAKES,
  Level,
  ProviderType,
  Profile,
} from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";

const STEP_IDS = ["level", "fields", "dest", "academic", "funding", "prefs", "done"] as const;
const ICON_CLS = "h-[18px] w-[18px]";
const STEP_ICONS = [
  <GraduationCap key="0" className={ICON_CLS} />,
  <BookOpen key="1" className={ICON_CLS} />,
  <Globe key="2" className={ICON_CLS} />,
  <PenLine key="3" className={ICON_CLS} />,
  <Coins key="4" className={ICON_CLS} />,
  <Settings key="5" className={ICON_CLS} />,
  <PartyPopper key="6" className={ICON_CLS} />,
];

const IELTS_OPTIONS = [0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function StartWizard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, setProfile } = useTrack();

  const [step, setStep] = useState(0);

  // --- Lựa chọn của user (khởi tạo từ hồ sơ hiện tại) ---
  const [level, setLevel] = useState<Level>(profile.level);
  const [fields, setFields] = useState<string[]>(profile.fields);
  const [countries, setCountries] = useState<string[]>(profile.countries);
  const [gpaScale, setGpaScale] = useState<"10" | "4">("4");
  const [gpaInput, setGpaInput] = useState<number>(profile.gpa);
  const [ielts, setIelts] = useState<number>(profile.ielts);
  const [hasGre, setHasGre] = useState<boolean>(profile.hasGre);
  const [fundingNeed, setFundingNeed] = useState<Profile["fundingNeed"]>(profile.fundingNeed);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
  const [maxRank, setMaxRank] = useState(0);
  const [supervisorPref, setSupervisorPref] = useState<"both" | "yes" | "no">("both");
  const [intakes, setIntakes] = useState<string[]>([]);

  const gpa4 = gpaScale === "10" ? gpa10to4(gpaInput) : gpaInput;

  const nextProfile: Profile = useMemo(
    () => ({
      ...profile, // giữ các trường không đổi trong wizard (name, nationality, intake, workYears)
      level,
      fields,
      countries,
      gpa: Math.min(4, Math.max(0, gpa4)),
      ielts,
      fundingNeed,
      hasGre,
    }),
    [profile, level, fields, countries, gpa4, ielts, fundingNeed, hasGre]
  );

  // Đếm trước kết quả với đúng bộ lọc sẽ áp dụng sau khi hoàn tất
  const preview = useMemo(() => {
    let list = scholarships.map((s) => ({ s, match: matchScore(nextProfile, s, t) }));
    list = list.filter(({ s }) => s.levels.includes(level));
    if (fields.length) list = list.filter(({ s }) => s.fields.some((f) => fields.includes(f)));
    if (countries.length) list = list.filter(({ s }) => countries.includes(s.countryCode));
    if (providerTypes.length) list = list.filter(({ s }) => providerTypes.includes(s.providerType));
    if (maxRank > 0) list = list.filter(({ s }) => s.qsRank <= maxRank);
    if (supervisorPref !== "both")
      list = list.filter(({ s }) => (supervisorPref === "yes" ? s.requiresSupervisor : !s.requiresSupervisor));
    if (intakes.length) list = list.filter(({ s }) => intakes.includes(s.intake));
    const good = list.filter(({ match }) => match.score >= 60).length;
    return { total: list.length, good };
  }, [nextProfile, level, fields, countries, providerTypes, maxRank, supervisorPref, intakes, t]);

  const finish = () => {
    setProfile(nextProfile);
    const p = new URLSearchParams();
    p.set("lv", level);
    if (fields.length) p.set("f", fields.join(","));
    if (countries.length) p.set("c", countries.join(","));
    if (providerTypes.length) p.set("pt", providerTypes.join(","));
    if (maxRank > 0) p.set("qs", String(maxRank));
    if (supervisorPref !== "both") p.set("sup", supervisorPref);
    if (intakes.length) p.set("it", intakes.join(","));
    router.push(`/?${p.toString()}`);
  };

  const canNext =
    step === 0 ? !!level :
    step === 1 ? fields.length > 0 :
    step === 2 ? countries.length > 0 :
    true;

  const pct = Math.round((step / (STEP_IDS.length - 1)) * 100);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[linear-gradient(165deg,#0a1230_0%,#152159_52%,#233a86_100%)] py-8">
      {/* Nền sao + tuyến bay */}
      <div className="starfield pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px]">
        <HeroSky id="wizard" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4">
        {/* Đầu trang */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-[#3b82f6] to-[#7cb8ff] text-white shadow-[0_6px_18px_-6px_rgba(59,130,246,0.8)]">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff"><path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.34-1.97-1.54-1.45.39 2.59 4.49 17.42-4.67c.81-.23 1.28-1.05 1.06-1.86z" /></svg>
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#cfe0ff]">{t("wizard.eyebrow")}</p>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight">{t("wizard.title")}</h1>
            </div>
          </div>
          <Link href="/" className="text-sm font-semibold text-[#cfe0ff] hover:text-white">
            {t("wizard.skip")} →
          </Link>
        </div>

        {/* Thanh tiến trình */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            {STEP_IDS.map((id, i) => (
              <button
                key={id}
                onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                  i < step ? "cursor-pointer text-white" : i === step ? "text-white" : "cursor-default text-white/40"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-base ring-2 transition ${
                    i < step
                      ? "bg-[#34c88a] text-[#0a1230] ring-[#5fe0aa]"
                      : i === step
                        ? "bg-white text-[#12345c] ring-[#a5cbff]"
                        : "bg-white/10 ring-white/20"
                  }`}
                >
                  {i < step ? "✓" : STEP_ICONS[i]}
                </span>
                <span className="hidden sm:block">{t(`wizard.steps.${id}`)}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-[#5aa2ff] to-[#a5cbff] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Nội dung bước */}
        <div key={step} className="animate-rise mt-6 rounded-[24px] bg-white p-6 shadow-2xl sm:p-8">
          {step === 0 && (
            <StepShell title={t("wizard.s1Title")} desc={t("wizard.s1Desc")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { v: "Bachelor", icon: <Backpack className="h-5 w-5" />, d: t("wizard.s1Bachelor") },
                  { v: "Master", icon: <BookOpen className="h-5 w-5" />, d: t("wizard.s1Master") },
                  { v: "PhD", icon: <Microscope className="h-5 w-5" />, d: t("wizard.s1Phd") },
                ] as { v: Level; icon: React.ReactNode; d: string }[]).map((o) => (
                  <BigCard key={o.v} selected={level === o.v} onClick={() => setLevel(o.v)} icon={o.icon} title={t(`level.${o.v}`)} desc={o.d} />
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title={t("wizard.s2Title")} desc={t("wizard.s2Desc")}>
              <div className="flex flex-wrap gap-2">
                {FIELDS.map((f) => (
                  <Chip key={f} selected={fields.includes(f)} onClick={() => setFields(toggle(fields, f))}>{f}</Chip>
                ))}
              </div>
              <Hint>{t("wizard.s2Hint", { n: fields.length })}</Hint>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title={t("wizard.s3Title")} desc={t("wizard.s3Desc")}>
              <div className="space-y-4">
                {REGIONS.map((r) => {
                  const group = COUNTRIES.filter((c) => c.region === r);
                  const allSelected = group.every((c) => countries.includes(c.code));
                  return (
                    <div key={r}>
                      <button
                        onClick={() =>
                          setCountries(
                            allSelected
                              ? countries.filter((c) => !group.some((g) => g.code === c))
                              : Array.from(new Set([...countries, ...group.map((g) => g.code)]))
                          )
                        }
                        className={`mb-2 text-sm font-bold ${allSelected ? "text-[#2f6fe0]" : "text-[#5a7794] hover:text-[#2f6fe0]"}`}
                      >
                        {t(`region.${REGION_KEY[r]}`)} {allSelected ? t("wizard.s3GroupClear") : t("wizard.s3GroupAll")}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {group.map((c) => (
                          <Chip key={c.code} selected={countries.includes(c.code)} onClick={() => setCountries(toggle(countries, c.code))}>
                            {flagEmoji(c.code)} {t(`country.${c.code}`)}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Hint>{t("wizard.s3Hint", { n: countries.length })}</Hint>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title={t("wizard.s4Title")} desc={t("wizard.s4Desc")}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-bold text-[#5a7794]">{t("wizard.s4Gpa")}</p>
                  <div className="mb-2 flex rounded-lg border border-[#cfe0f2] p-0.5 text-sm">
                    {(["4", "10"] as const).map((sc) => (
                      <button key={sc} onClick={() => setGpaScale(sc)}
                        className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${gpaScale === sc ? "bg-[#2f6fe0] text-white" : "text-[#5a7794]"}`}>
                        {sc === "4" ? t("wizard.s4Scale4") : t("wizard.s4Scale10")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step={gpaScale === "10" ? 0.1 : 0.05}
                    min={0}
                    max={gpaScale === "10" ? 10 : 4}
                    value={gpaInput}
                    onChange={(e) => setGpaInput(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#cfe0f2] px-4 py-3 text-lg font-semibold text-[#1a3352] outline-none focus:border-[#2f6fe0]"
                  />
                  {gpaScale === "10" && (
                    <p className="mt-1.5 text-xs text-[#7591ab]">≈ <b>{gpa4.toFixed(2)}/4.0</b> {t("wizard.s4ApproxNote")}</p>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-[#5a7794]">{t("wizard.s4Ielts")}</p>
                  <div className="flex flex-wrap gap-2">
                    {IELTS_OPTIONS.map((v) => (
                      <Chip key={v} selected={ielts === v} onClick={() => setIelts(v)}>
                        {v === 0 ? t("wizard.s4NoIelts") : v.toFixed(1)}
                      </Chip>
                    ))}
                  </div>
                  <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-[#e6eef6] bg-[#f6f9fd] px-3 py-2.5 text-sm">
                    <input type="checkbox" checked={hasGre} onChange={() => setHasGre((v) => !v)} className="h-4 w-4 accent-[#2f6fe0]" />
                    <span className="text-[#455f78]">{t("wizard.s4HasGre1")} <b>GRE/GMAT</b></span>
                  </label>
                </div>
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title={t("wizard.s5Title")} desc={t("wizard.s5Desc")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { v: "Full", icon: <Gem className="h-5 w-5" />, tt: t("wizard.s5FullT"), d: t("wizard.s5FullD") },
                  { v: "Partial", icon: <PiggyBank className="h-5 w-5" />, tt: t("wizard.s5PartT"), d: t("wizard.s5PartD") },
                  { v: "Any", icon: <Handshake className="h-5 w-5" />, tt: t("wizard.s5AnyT"), d: t("wizard.s5AnyD") },
                ] as { v: Profile["fundingNeed"]; icon: React.ReactNode; tt: string; d: string }[]).map((o) => (
                  <BigCard key={o.v} selected={fundingNeed === o.v} onClick={() => setFundingNeed(o.v)} icon={o.icon} title={o.tt} desc={o.d} />
                ))}
              </div>
              <p className="mb-2 mt-6 text-sm font-bold text-[#5a7794]">{t("wizard.s5Provider")} <span className="font-normal text-[#93a7bd]">{t("wizard.optional")}</span></p>
              <div className="flex flex-wrap gap-2">
                {(["Government", "University", "Org", "Corporate"] as ProviderType[]).map((p) => (
                  <Chip key={p} selected={providerTypes.includes(p)} onClick={() => setProviderTypes(toggle(providerTypes, p))}>
                    {t(`providerType.${p}`)}
                  </Chip>
                ))}
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell title={t("wizard.s6Title")} desc={t("wizard.s6Desc")}>
              <div className="space-y-6">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#5a7794]"><Trophy className="h-4 w-4 text-[#2f6fe0]" /> {t("wizard.s6Qs")}</p>
                  <div className="flex flex-wrap gap-2">
                    {[0, 10, 30, 50, 100].map((v) => (
                      <Chip key={v} selected={maxRank === v} onClick={() => setMaxRank(v)}>
                        {v === 0 ? t("sidebar.anyRank") : t("sidebar.topN", { n: v })}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#5a7794]"><UserCheck className="h-4 w-4 text-[#2f6fe0]" /> {t("wizard.s6Sup")}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {([
                      { v: "both", tt: t("wizard.s6SupBothT"), d: t("wizard.s6SupBothD") },
                      { v: "yes", tt: t("wizard.s6SupYesT"), d: t("wizard.s6SupYesD") },
                      { v: "no", tt: t("wizard.s6SupNoT"), d: t("wizard.s6SupNoD") },
                    ] as const).map((o) => (
                      <button key={o.v} onClick={() => setSupervisorPref(o.v)}
                        className={`rounded-xl border-2 p-3 text-left transition ${
                          supervisorPref === o.v ? "border-[#2f6fe0] bg-[#eaf1fd]" : "border-[#e2e8f0] hover:border-[#9cc1f5]"
                        }`}>
                        <p className="text-sm font-bold text-[#1a3352]">{o.tt}</p>
                        <p className="mt-0.5 text-xs text-[#7591ab]">{o.d}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#5a7794]"><CalendarDays className="h-4 w-4 text-[#2f6fe0]" /> {t("wizard.s6Intake")} <span className="font-normal text-[#93a7bd]">{t("wizard.optional")}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {INTAKES.map((i) => (
                      <Chip key={i} selected={intakes.includes(i)} onClick={() => setIntakes(toggle(intakes, i))}>{i}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </StepShell>
          )}

          {step === 6 && (
            <StepShell title={t("wizard.s7Title")} desc={t("wizard.s7Desc")}>
              <div className="grid gap-2 rounded-2xl bg-[#f6f9fd] p-4 text-sm sm:grid-cols-2">
                <SummaryRow k={t("wizard.sumLevel")} v={t(`level.${level}`)} />
                <SummaryRow k={t("wizard.sumGpa")} v={`${gpa4.toFixed(2)}/4.0${gpaScale === "10" ? ` ${t("wizard.sumFrom10", { v: gpaInput })}` : ""}`} />
                <SummaryRow k={t("wizard.sumIelts")} v={ielts === 0 ? t("wizard.s4NoIelts") : ielts.toFixed(1)} />
                <SummaryRow k={t("wizard.sumGre")} v={hasGre ? t("wizard.greHave") : t("wizard.greNone")} />
                <SummaryRow k={t("wizard.sumFields")} v={fields.join(", ") || "—"} />
                <SummaryRow k={t("wizard.sumCountries")} v={countries.map((c) => flagEmoji(c)).join(" ") || t("common.all")} />
                <SummaryRow k={t("wizard.sumFunding")} v={fundingNeed === "Full" ? t("wizard.s5FullT") : fundingNeed === "Partial" ? t("wizard.s5PartT") : t("wizard.s5AnyT")} />
                <SummaryRow k={t("wizard.sumProvider")} v={providerTypes.length ? providerTypes.map((p) => t(`providerType.${p}`)).join(", ") : t("common.all")} />
                <SummaryRow k={t("wizard.sumRank")} v={maxRank > 0 ? `QS ${t("sidebar.topN", { n: maxRank })}` : t("sidebar.anyRank")} />
                <SummaryRow k={t("wizard.sumSup")} v={supervisorPref === "both" ? t("wizard.supBoth") : supervisorPref === "yes" ? t("wizard.supYes") : t("wizard.supNo")} />
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] p-5 text-white">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-white/15"><Target className="h-6 w-6" /></div>
                <div>
                  <p className="text-2xl font-bold">{t("wizard.preview", { n: preview.total })}</p>
                  <p className="text-sm text-[#cfe0ff]">{t("wizard.previewSub1")} <b className="text-[#a5cbff]">{preview.good}</b> {t("wizard.previewSub2")}</p>
                </div>
              </div>
              {preview.total === 0 && (
                <p className="mt-3 rounded-xl bg-[#fdf3e0] p-3 text-sm text-[#a9670a]">
                  ⚠️ {t("wizard.noneWarn")}
                </p>
              )}
            </StepShell>
          )}

          {/* Điều hướng */}
          <div className="mt-8 flex items-center justify-between border-t border-[#eef3f9] pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5a7794] transition enabled:hover:bg-[#eef3f9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← {t("common.back")}
            </button>
            {step < STEP_IDS.length - 1 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#5aa2ff] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("common.next")} →
              </button>
            ) : (
              <button
                onClick={finish}
                className="rounded-xl bg-gradient-to-br from-[#0f9d6b] to-[#34c88a] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                {t("wizard.finish", { n: preview.total })} →
              </button>
            )}
          </div>
          {!canNext && (
            <p className="mt-2 text-right text-xs text-amber-600">
              {step === 1 ? t("wizard.needField") : step === 2 ? t("wizard.needCountry") : ""}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#cfe0ff]">{t("wizard.footerNote")}</p>
      </div>
    </div>
  );
}

// ---------- Các khối UI nhỏ ----------
function StepShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-[#1a3352]">{title}</h2>
      <p className="mt-1 text-sm text-[#7591ab]">{desc}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function BigCard({ selected, onClick, icon, title, desc }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 p-4 text-left transition ${
        selected ? "border-[#2f6fe0] bg-[#eaf1fd] shadow-md" : "border-[#e2e8f0] bg-white hover:border-[#9cc1f5] hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-[13px] transition ${selected ? "bg-[#2f6fe0] text-white" : "bg-[#eef4fb] text-[#2f6fe0]"}`}>{icon}</span>
        <span className={`grid h-5 w-5 place-items-center rounded-full text-xs font-bold ${selected ? "bg-[#2f6fe0] text-white" : "border border-[#cfe0f2] text-transparent"}`}>✓</span>
      </div>
      <p className="mt-2 font-extrabold text-[#1a3352]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#7591ab]">{desc}</p>
    </button>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${
        selected ? "bg-[#2f6fe0] text-white ring-[#2f6fe0] shadow-sm" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5] hover:text-[#2f6fe0]"
      }`}
    >
      {children}
    </button>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl bg-[#f6f9fd] px-3 py-2 text-xs text-[#7591ab]">💡 {children}</p>;
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#eef3f9] py-1.5 last:border-0 sm:border-0">
      <span className="shrink-0 text-[#7591ab]">{k}</span>
      <span className="text-right font-semibold text-[#1a3352]">{v}</span>
    </div>
  );
}
