"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  scholarshipById,
  professorById,
  matchScore,
  nextDeadline,
  daysLeft,
  teachLanguages,
} from "@/lib/data";
import {
  ChevronLeft, ArrowRight, ArrowLeftRight, Bookmark, Check, CircleCheck, CircleX,
  TriangleAlert, Lightbulb, PenLine, StickyNote, ExternalLink, Info, Lock,
} from "lucide-react";
import { useTrack, STAGES, StageId } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { matchBar, matchRingBar, matchFg, deadlineColor, deadlineText } from "@/lib/ui";
import CountryTag from "@/components/CountryTag";

export default function ScholarshipDetail() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const s = scholarshipById(params.id);
  const { loggedIn, requireAuth } = useAuth();
  const { profile, isTracked, toggleTrack, tracked, setStage, setNote, toggleChecklist, progress, isCompared, toggleCompare } = useTrack();

  if (!s) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-[#5a7794]">{t("detail.notFound")}</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1 text-[#2f6fe0] underline">
          <ChevronLeft className="h-4 w-4" />
          {t("detail.backSearch")}
        </Link>
      </div>
    );
  }

  const match = matchScore(profile, s, t);
  const ring = matchRingBar(match.score);
  const fg = matchFg(match.score);
  const dl = nextDeadline(s);
  const days = dl ? daysLeft(dl.date) : 0;
  const item = tracked[s.id];
  const isT = isTracked(s.id);
  const profs = s.professorIds.map((id) => professorById(id)).filter(Boolean);
  const prog = progress(s.id);

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-6">
      <Link href="/" className="flex w-fit items-center gap-1.5 py-1.5 text-[13.5px] font-semibold text-[#5a7794] hover:text-[#2f6fe0]">
        <ChevronLeft className="h-4 w-4" />
        {t("detail.backList")}
      </Link>

      {/* Header */}
      <div className="mt-2.5 rounded-[20px] border border-[#dce8f4] bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#7591ab]">
              <CountryTag name={t(`country.${s.countryCode}`)} code={s.countryCode} title={s.country} />
              <span>{s.city}</span>
              <span>· QS #{s.qsRank}</span>
              <span>· {t(`providerType.${s.providerType}`)}</span>
            </div>
            <h1 className="mt-2.5 text-[26px] font-extrabold tracking-tight text-[#12345c]">{s.title}</h1>
            <p className="mt-1.5 text-[13.5px] text-[#5a7794]">{t("detail.provider")} {s.provider}</p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {/* Chỉ mức tài trợ giữ màu (tín hiệu chính); còn lại nhãn xám để bớt rối */}
              <Badge className="bg-[#e9f8f0] text-[#0b7a52] ring-[#c4ecd8]">{t(`funding.${s.fundingLevel}`)}</Badge>
              {s.levels.map((l) => <Badge key={l} className="bg-[#f8fafd] text-[#5a7794] ring-[#dce8f4]">{t(`level.${l}`)}</Badge>)}
              <Badge className="bg-[#f8fafd] text-[#5a7794] ring-[#dce8f4]">{teachLanguages(s.language, t)}</Badge>
              {s.requiresSupervisor && <Badge className="bg-[#f8fafd] text-[#5a7794] ring-[#dce8f4]">{t("detail.needSupervisor")}</Badge>}
              {s.requiresProposal && <Badge className="bg-[#f8fafd] text-[#5a7794] ring-[#dce8f4]">{t("detail.needProposal")}</Badge>}
              {s.tags.map((tg) => <Badge key={tg} className="bg-[#f8fafd] text-[#7591ab] ring-[#e6eef6]">{tg}</Badge>)}
            </div>
          </div>
          {loggedIn ? (
            <div className="flex shrink-0 flex-col items-center">
              <div className="grid h-[88px] w-[88px] place-items-center rounded-full" style={{ background: `conic-gradient(${ring} ${match.score}%, #e6eef6 0)` }}>
                <div className="grid h-[66px] w-[66px] place-items-center rounded-full bg-white">
                  <div className="text-[22px] font-extrabold leading-none" style={{ color: fg }}>{match.score}%</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-bold" style={{ color: fg }}>{match.label}</div>
            </div>
          ) : (
            <button onClick={() => requireAuth()} title={t("authGate.title")} className="flex shrink-0 flex-col items-center">
              <div className="grid h-[88px] w-[88px] place-items-center rounded-full border-2 border-dashed border-[#cfe0f2] text-[#93a7bd] transition hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
                <Lock className="h-6 w-6" />
              </div>
              <div className="mt-2 text-xs font-semibold text-[#93a7bd]">{t("filter.sortMatch")}</div>
            </button>
          )}
        </div>
      </div>

      <div className="mt-[18px] grid gap-[18px] lg:grid-cols-[1fr_336px]">
        {/* Cột chính */}
        <div className="space-y-4">
          <Section title={t("detail.overview")}>
            <p className="text-sm leading-relaxed text-[#455f78]">{s.summary}</p>
          </Section>

          <Section title={t("detail.matchTitle")}>
            {loggedIn ? (
              <>
                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[#eef3f9]">
                  <div className={`h-full rounded-full ${matchBar(match.score)}`} style={{ width: `${match.score}%` }} />
                </div>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {match.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {r.status === "ok" ? (
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10a06d]" />
                      ) : r.status === "warn" ? (
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#e0921a]" />
                      ) : (
                        <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-[#e14b5a]" />
                      )}
                      <span className={r.status === "fail" ? "text-[#b23343]" : r.status === "warn" ? "text-[#a9670a]" : "text-[#455f78]"}>{r.label}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <button onClick={() => requireAuth()} className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-[#cfe0f2] bg-[#f8fafd] p-4 text-left transition hover:border-[#9cc1f5]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eaf1fd] text-[#2f6fe0]"><Lock className="h-[18px] w-[18px]" /></span>
                <span>
                  <span className="block text-sm font-bold text-[#1a3352]">{t("authGate.title")}</span>
                  <span className="mt-0.5 block text-xs text-[#5a7794]">{t("authGate.desc")}</span>
                </span>
              </button>
            )}
          </Section>

          <Section title={t("detail.benefits")}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {s.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-[#455f78]">
                  <Check className="mt-0.5 h-[15px] w-[15px] shrink-0 text-[#10a06d]" />{b}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t("detail.eligibility")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact label={t("detail.minGpa")} value={`${s.eligibility.minGpa.toFixed(1)} / 4.0`} />
              <Fact label={t("detail.langReq")} value={`IELTS ≥ ${s.eligibility.minIelts.toFixed(1)}`} />
              <Fact label={t("detail.stdTest")} value={s.eligibility.gre ? t("detail.greMaybe") : t("detail.greNo")} />
              <Fact label={t("detail.acceptVN")} value={s.eligibility.allowVN ? t("common.yes") : t("common.no")} />
              <Fact label={t("detail.fields")} value={s.fields.join(", ")} />
              <Fact label={t("detail.intake")} value={s.intake} />
            </div>
          </Section>

          <Section title={t("detail.timeline")}>
            <ol className="relative ml-3 border-l-2 border-[#e6eef6]">
              {s.deadlines.map((d, i) => {
                const dleft = daysLeft(d.date);
                return (
                  <li key={i} className="mb-4 ml-4">
                    <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-white bg-[#2f6fe0] shadow-[0_0_0_2px_#cfe0f2]" />
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-bold text-[#1a3352]">{d.type}</span>
                      <span className="text-sm text-[#7591ab]">{d.date}</span>
                      <span className={`text-xs font-bold ${deadlineColor(dleft)}`}>· {deadlineText(dleft, t)}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          {s.requiresSupervisor && (
            <Section title={t("detail.profSection")}>
              <p className="mb-3 text-sm text-[#7591ab]">{t("detail.profDesc")}</p>
              {profs.length === 0 ? (
                <p className="text-sm text-[#93a7bd]">{t("detail.noProfData")}</p>
              ) : (
                <div className="grid gap-3">
                  {profs.map((p) => p && (
                    <Link key={p.id} href={`/professors/${p.id}`}
                      className="flex items-center justify-between rounded-xl border border-[#dce8f4] bg-[#f8fafd] p-3.5 hover:border-[#9cc1f5]">
                      <div className="min-w-0">
                        <p className="font-bold text-[#1a3352]">{p.name}</p>
                        <p className="text-xs text-[#7591ab]">{p.university} · {p.keywords.slice(0, 3).join(", ")}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        {p.recruiting === "recruiting" && <span className="rounded bg-[#e9f8f0] px-2 py-0.5 text-xs text-[#0b7a52]">{t("detail.recruiting")}</span>}
                        <p className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-[#2f6fe0]">
                          {t("detail.viewProfile")}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Section>
          )}

          <Section title={t("detail.checklist")}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eef3f9]">
                <div className="h-full rounded-full bg-[#2f6fe0] transition-all" style={{ width: `${prog}%` }} />
              </div>
              <span className="text-sm font-extrabold text-[#2f6fe0]">{prog}%</span>
            </div>
            {!isT && (
              <p className="mb-2 flex items-start gap-1.5 text-xs text-[#93a7bd]">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                {t("detail.trackToSave")}
              </p>
            )}
            <ul className="space-y-1.5">
              {s.documents.map((d) => (
                <li key={d}>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 text-sm hover:bg-[#f6f9fd]">
                    <input type="checkbox" checked={!!item?.checklist[d]} onChange={() => toggleChecklist(s.id, d)} className="mt-0.5 h-4 w-4 accent-[#2f6fe0]" />
                    <span className={item?.checklist[d] ? "text-[#93a7bd] line-through" : "text-[#455f78]"}>{d}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#dce8f4] bg-[#f8fafd] p-3 text-xs text-[#5a7794]">
              <span className="flex items-start gap-2">
                <Lightbulb className="mt-px h-3.5 w-3.5 shrink-0 text-[#7591ab]" />
                <span><b className="text-[#1a3352]">{t("detail.e18Title")}</b> {t("detail.e18Desc")}</span>
              </span>
              <Link href={`/scholarships/${s.id}/documents`}
                className="shrink-0 rounded-lg bg-[#2f6fe0] px-3 py-2 text-xs font-bold text-white hover:brightness-105">
                {t("docs.openCta")}
              </Link>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-3.5 lg:sticky lg:top-[82px] lg:h-fit">
          <div className="rounded-[16px] border border-[#dce8f4] bg-white p-4">
            <button
              onClick={() => requireAuth(() => toggleTrack(s.id))}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:brightness-105 ${
                loggedIn && isT ? "bg-[#0f9d6b]" : "bg-[#2f6fe0]"
              }`}
            >
              {loggedIn && isT
                ? <><Check className="h-4 w-4" />{t("detail.tracking")}</>
                : <><Bookmark className="h-4 w-4" />{t("detail.track")}</>}
            </button>

            <button
              onClick={() => toggleCompare(s.id)}
              className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                isCompared(s.id)
                  ? "border-[#9cc1f5] bg-[#eef4fb] text-[#2f6fe0]"
                  : "border-[#dce8f4] bg-white text-[#5a7794] hover:bg-[#f6f9fd]"
              }`}
            >
              {isCompared(s.id)
                ? <><Check className="h-4 w-4" />{t("detail.compareIn")}</>
                : <><ArrowLeftRight className="h-4 w-4" />{t("detail.compareAdd")}</>}
            </button>

            <Link href={`/scholarships/${s.id}/documents`}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#dce8f4] bg-[#f8fafd] px-4 py-2.5 text-sm font-bold text-[#5a7794] hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
              <PenLine className="h-4 w-4" />
              {t("docs.openCta")}
            </Link>

            {isT && (
              <div className="mt-3.5">
                <label className="mb-1.5 block text-[11.5px] font-bold text-[#7591ab]">{t("detail.status")}</label>
                <select
                  value={item?.stage ?? "quan_tam"}
                  onChange={(e) => setStage(s.id, e.target.value as StageId)}
                  className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2.5 text-sm font-semibold text-[#1a3352] outline-none"
                >
                  {STAGES.map((st) => <option key={st.id} value={st.id}>{t(`stage.${st.id}`)}</option>)}
                </select>
                <label className="mb-1.5 mt-3 flex items-center gap-1.5 text-[11.5px] font-bold text-[#7591ab]">
                  <StickyNote className="h-3.5 w-3.5" />
                  {t("detail.note")}
                </label>
                <textarea
                  value={item?.note ?? ""}
                  onChange={(e) => setNote(s.id, e.target.value)}
                  placeholder={t("detail.notePh")}
                  rows={3}
                  className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-sm text-[#1a3352] outline-none focus:border-[#2f6fe0]"
                />
              </div>
            )}

            <div className="mt-3.5 border-t border-[#eef3f9] pt-3.5">
              {dl && (
                <>
                  <p className="text-[11.5px] font-semibold text-[#7591ab]">{dl.type}</p>
                  <p className="text-lg font-extrabold text-[#1a3352]">{dl.date}</p>
                  <p className={`text-sm font-bold ${deadlineColor(days)}`}>{deadlineText(days, t)}</p>
                </>
              )}
            </div>

            <a href={s.officialUrl} target="_blank" rel="noopener noreferrer"
              className="mt-3.5 flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-center text-sm font-bold text-[#5a7794] hover:bg-[#f6f9fd]">
              <ExternalLink className="h-4 w-4" />
              {t("detail.official")}
            </a>
          </div>

          <div className="rounded-[16px] border border-[#dce8f4] bg-white p-4 text-[12.5px] text-[#7591ab]">
            <div className="flex items-center justify-between">
              <span>{t("detail.trust")}</span>
              <span className="font-extrabold text-[#0b7a52]">{s.trustScore}/100</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>{t("detail.updated")}</span><span className="font-semibold text-[#455f78]">{s.lastVerified}</span>
            </div>
            {/* Ghi chú nhỏ: chữ nhạt + icon, không dùng hộp vàng */}
            <p className="mt-3 flex items-start gap-1.5 border-t border-[#eef3f9] pt-3 text-[11.5px] leading-relaxed text-[#93a7bd]">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" />
              {t("detail.disclaimer")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] border border-[#dce8f4] bg-white p-5">
      <h2 className="mb-3 text-[15px] font-extrabold text-[#1a3352]">{title}</h2>
      {children}
    </section>
  );
}
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>{children}</span>;
}
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[11px] border border-[#e6eef6] bg-[#f6f9fd] p-3">
      <p className="text-[11.5px] font-semibold text-[#7591ab]">{label}</p>
      <p className="mt-0.5 text-[13.5px] font-bold text-[#1a3352]">{value}</p>
    </div>
  );
}
