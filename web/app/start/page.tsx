"use client";

// Wizard "Tối ưu lựa chọn" — user mới vào app bấm Bắt đầu và chọn từng bước.
// Kết thúc: lưu hồ sơ + chuyển sang trang tìm kiếm với bộ lọc đã thiết lập sẵn (qua URL).

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
const STEP_ICONS = ["🎓", "📚", "🌍", "📝", "💰", "⚙️", "🎉"];

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
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 py-8">
      {/* Trang trí nền */}
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4">
        {/* Đầu trang */}
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">{t("wizard.eyebrow")}</p>
            <h1 className="mt-0.5 text-2xl font-bold">{t("wizard.title")}</h1>
          </div>
          <Link href="/" className="text-sm text-indigo-200 hover:text-white">
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
                className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
                  i < step ? "cursor-pointer text-white" : i === step ? "text-white" : "cursor-default text-indigo-300/60"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-base ring-2 transition ${
                    i < step
                      ? "bg-emerald-400 text-slate-900 ring-emerald-300"
                      : i === step
                        ? "bg-white text-indigo-700 ring-amber-300"
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
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Nội dung bước */}
        <div key={step} className="animate-rise mt-6 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          {step === 0 && (
            <StepShell title={t("wizard.s1Title")} desc={t("wizard.s1Desc")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { v: "Bachelor", icon: "🎒", d: t("wizard.s1Bachelor") },
                  { v: "Master", icon: "📚", d: t("wizard.s1Master") },
                  { v: "PhD", icon: "🔬", d: t("wizard.s1Phd") },
                ] as { v: Level; icon: string; d: string }[]).map((o) => (
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
                        className={`mb-2 text-sm font-bold ${allSelected ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"}`}
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
                  <p className="mb-2 text-sm font-semibold text-slate-700">{t("wizard.s4Gpa")}</p>
                  <div className="mb-2 flex rounded-lg border border-slate-300 p-0.5 text-sm">
                    {(["4", "10"] as const).map((sc) => (
                      <button key={sc} onClick={() => setGpaScale(sc)}
                        className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${gpaScale === sc ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none focus:border-indigo-500"
                  />
                  {gpaScale === "10" && (
                    <p className="mt-1.5 text-xs text-slate-500">≈ <b>{gpa4.toFixed(2)}/4.0</b> {t("wizard.s4ApproxNote")}</p>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">{t("wizard.s4Ielts")}</p>
                  <div className="flex flex-wrap gap-2">
                    {IELTS_OPTIONS.map((v) => (
                      <Chip key={v} selected={ielts === v} onClick={() => setIelts(v)}>
                        {v === 0 ? t("wizard.s4NoIelts") : v.toFixed(1)}
                      </Chip>
                    ))}
                  </div>
                  <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                    <input type="checkbox" checked={hasGre} onChange={() => setHasGre((v) => !v)} className="h-4 w-4 accent-indigo-600" />
                    <span className="text-slate-700">{t("wizard.s4HasGre1")} <b>GRE/GMAT</b></span>
                  </label>
                </div>
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title={t("wizard.s5Title")} desc={t("wizard.s5Desc")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { v: "Full", icon: "💎", tt: t("wizard.s5FullT"), d: t("wizard.s5FullD") },
                  { v: "Partial", icon: "🌓", tt: t("wizard.s5PartT"), d: t("wizard.s5PartD") },
                  { v: "Any", icon: "🤝", tt: t("wizard.s5AnyT"), d: t("wizard.s5AnyD") },
                ] as { v: Profile["fundingNeed"]; icon: string; tt: string; d: string }[]).map((o) => (
                  <BigCard key={o.v} selected={fundingNeed === o.v} onClick={() => setFundingNeed(o.v)} icon={o.icon} title={o.tt} desc={o.d} />
                ))}
              </div>
              <p className="mb-2 mt-6 text-sm font-semibold text-slate-700">{t("wizard.s5Provider")} <span className="font-normal text-slate-400">{t("wizard.optional")}</span></p>
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
                  <p className="mb-2 text-sm font-semibold text-slate-700">🏆 {t("wizard.s6Qs")}</p>
                  <div className="flex flex-wrap gap-2">
                    {[0, 10, 30, 50, 100].map((v) => (
                      <Chip key={v} selected={maxRank === v} onClick={() => setMaxRank(v)}>
                        {v === 0 ? t("sidebar.anyRank") : t("sidebar.topN", { n: v })}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">👨‍🏫 {t("wizard.s6Sup")}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {([
                      { v: "both", tt: t("wizard.s6SupBothT"), d: t("wizard.s6SupBothD") },
                      { v: "yes", tt: t("wizard.s6SupYesT"), d: t("wizard.s6SupYesD") },
                      { v: "no", tt: t("wizard.s6SupNoT"), d: t("wizard.s6SupNoD") },
                    ] as const).map((o) => (
                      <button key={o.v} onClick={() => setSupervisorPref(o.v)}
                        className={`rounded-xl border-2 p-3 text-left transition ${
                          supervisorPref === o.v ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"
                        }`}>
                        <p className="text-sm font-semibold text-slate-800">{o.tt}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{o.d}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">🗓️ {t("wizard.s6Intake")} <span className="font-normal text-slate-400">{t("wizard.optional")}</span></p>
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
              <div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
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

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
                <div className="text-4xl">🎯</div>
                <div>
                  <p className="text-2xl font-bold">{t("wizard.preview", { n: preview.total })}</p>
                  <p className="text-sm text-indigo-200">{t("wizard.previewSub1")} <b className="text-amber-300">{preview.good}</b> {t("wizard.previewSub2")}</p>
                </div>
              </div>
              {preview.total === 0 && (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                  ⚠️ {t("wizard.noneWarn")}
                </p>
              )}
            </StepShell>
          )}

          {/* Điều hướng */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← {t("common.back")}
            </button>
            {step < STEP_IDS.length - 1 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition enabled:hover:from-indigo-500 enabled:hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("common.next")} →
              </button>
            ) : (
              <button
                onClick={finish}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:from-emerald-400 hover:to-teal-400"
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

        <p className="mt-4 text-center text-xs text-indigo-200">{t("wizard.footerNote")}</p>
      </div>
    </div>
  );
}

// ---------- Các khối UI nhỏ ----------
function StepShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function BigCard({ selected, onClick, icon, title, desc }: { selected: boolean; onClick: () => void; icon: string; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 p-4 text-left transition ${
        selected ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
        <span className={`grid h-5 w-5 place-items-center rounded-full text-xs font-bold ${selected ? "bg-indigo-600 text-white" : "border border-slate-300 text-transparent"}`}>✓</span>
      </div>
      <p className="mt-2 font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
    </button>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${
        selected ? "bg-indigo-600 text-white ring-indigo-600 shadow-sm" : "bg-white text-slate-600 ring-slate-300 hover:ring-indigo-400 hover:text-indigo-700"
      }`}
    >
      {children}
    </button>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">💡 {children}</p>;
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0 sm:border-0">
      <span className="shrink-0 text-slate-500">{k}</span>
      <span className="text-right font-medium text-slate-800">{v}</span>
    </div>
  );
}
