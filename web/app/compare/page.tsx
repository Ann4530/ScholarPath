"use client";

// So sánh học bổng cạnh nhau (E4-03): chọn 2–4 học bổng từ trang tìm kiếm.

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, ArrowRight, Bookmark, Check, Crown, Lock, X } from "lucide-react";
import {
  scholarshipById,
  matchScore,
  nextDeadline,
  daysLeft,
  teachLanguages,
} from "@/lib/data";
import { useTrack } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { matchColor, deadlineColor, deadlineText } from "@/lib/ui";
import CountryTag from "@/components/CountryTag";

export default function ComparePage() {
  const { t } = useTranslation();
  const { loggedIn, requireAuth } = useAuth();
  const { compare, toggleCompare, clearCompare, profile, isTracked, toggleTrack } = useTrack();
  const items = compare.map((id) => scholarshipById(id)).filter(Boolean) as NonNullable<ReturnType<typeof scholarshipById>>[];

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-white text-[#93a7bd] shadow-[0_1px_2px_rgba(23,50,76,0.06)] ring-1 ring-[#dce8f4]">
          <ArrowLeftRight className="h-8 w-8" strokeWidth={1.6} />
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-[#1a3352]">{t("compare.emptyTitle")}</h1>
        <p className="mt-2 text-[#7591ab]">
          {items.length === 0 ? t("compare.emptyNone") : t("compare.emptyOne")}{" "}
          {t("compare.emptyHint1")}{" "}
          <ArrowLeftRight className="inline h-3.5 w-3.5 text-[#5a7794]" />{" "}
          {t("compare.emptyHint2")}
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-[#2f6fe0] px-5 py-2.5 font-bold text-white hover:brightness-105">
          {t("compare.backCta")}
        </Link>
      </div>
    );
  }

  const matches = items.map((s) => matchScore(profile, s, t));
  const minGpa = Math.min(...items.map((s) => s.eligibility.minGpa));
  const minIelts = Math.min(...items.map((s) => s.eligibility.minIelts));
  const bestQs = Math.min(...items.map((s) => s.qsRank));
  const bestMatch = Math.max(...matches.map((m) => m.score));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-[#7591ab] hover:text-[#2f6fe0]">{t("compare.back")}</Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#12345c]">{t("compare.title", { n: items.length })}</h1>
        </div>
        <button onClick={clearCompare} className="rounded-lg border border-[#f7d0d5] bg-[#fff0f1] px-3 py-2 text-sm font-bold text-[#d33a4a]">
          {t("compare.clear")}
        </button>
      </div>

      <div className="sf-scroll mt-5 overflow-x-auto rounded-[16px] border border-[#dce8f4] bg-white">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-44 bg-[#f6f9fd] p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#93a7bd]">
                {t("compare.criteria")}
              </th>
              {items.map((s) => (
                <th key={s.id} className="min-w-52 border-l border-[#eef3f9] bg-[#f6f9fd] p-3 text-left align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-normal text-[#7591ab]">
                        <CountryTag name={t(`country.${s.countryCode}`)} code={s.countryCode} title={s.country} />
                        QS #{s.qsRank}
                      </p>
                      <Link href={`/scholarships/${s.id}`} className="mt-0.5 block font-bold leading-snug text-[#12345c] hover:text-[#2f6fe0]">
                        {s.title}
                      </Link>
                    </div>
                    <button onClick={() => toggleCompare(s.id)} className="shrink-0 text-[#c3ccd8] hover:text-[#d33a4a]" title={t("compare.removeTitle")}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label={t("compare.rowMatch")}>
              {items.map((s, i) => (
                <td key={s.id} className="border-l border-t border-[#eef3f9] p-3">
                  {loggedIn ? (
                    <>
                      <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-bold ${matchColor(matches[i].score)}`}>
                        {matches[i].score}%
                        {matches[i].score === bestMatch && <Crown className="h-3.5 w-3.5" aria-label={t("compare.kingTitle")} />}
                      </span>
                      <p className="mt-1 text-xs text-[#7591ab]">{matches[i].label}</p>
                    </>
                  ) : (
                    <button onClick={() => requireAuth()} title={t("authGate.title")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#cfe0f2] px-2.5 py-1 text-xs font-semibold text-[#93a7bd] transition hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
                      <Lock className="h-3.5 w-3.5" /> {t("filter.sortMatch")}
                    </button>
                  )}
                </td>
              ))}
            </Row>
            <Row label={t("compare.rowFunding")}>
              {items.map((s) => (
                <Cell key={s.id}><b className={s.fundingLevel === "Full" ? "text-[#0b7a52]" : "text-[#a9670a]"}>{t(`funding.${s.fundingLevel}`)}</b></Cell>
              ))}
            </Row>
            <Row label={t("compare.rowBenefits")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  <ul className="space-y-0.5 text-xs text-[#455f78]">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#7591ab]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowLevel")}>
              {items.map((s) => <Cell key={s.id}>{s.levels.map((l) => t(`level.${l}`)).join(", ")}</Cell>)}
            </Row>
            <Row label={t("compare.rowField")}>
              {items.map((s) => <Cell key={s.id}><span className="text-xs">{s.fields.join(", ")}</span></Cell>)}
            </Row>
            <Row label={t("compare.rowMinGpa")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  <b className={s.eligibility.minGpa === minGpa ? "text-[#0b7a52]" : "text-[#1a3352]"}>
                    {s.eligibility.minGpa.toFixed(1)}/4.0
                  </b>
                  {s.eligibility.minGpa === minGpa && <span className="ml-1 text-xs text-[#0b7a52]">{t("compare.easiest")}</span>}
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowMinIelts")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  <b className={s.eligibility.minIelts === minIelts ? "text-[#0b7a52]" : "text-[#1a3352]"}>
                    {s.eligibility.minIelts.toFixed(1)}
                  </b>
                  {s.eligibility.minIelts === minIelts && <span className="ml-1 text-xs text-[#0b7a52]">{t("compare.easiest")}</span>}
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowGre")}>
              {items.map((s) => (
                <Cell key={s.id}>{s.eligibility.gre ? <span className="text-[#a9670a]">{t("compare.greMaybe")}</span> : <span className="text-[#0b7a52]">{t("compare.greNo")}</span>}</Cell>
              ))}
            </Row>
            <Row label={t("compare.rowSup")}>
              {items.map((s) => (
                <Cell key={s.id}>{s.requiresSupervisor ? <span className="text-[#2f6fe0]">{t("compare.supYes")}</span> : t("common.no")}</Cell>
              ))}
            </Row>
            <Row label={t("compare.rowProposal")}>
              {items.map((s) => <Cell key={s.id}>{s.requiresProposal ? t("compare.need") : t("compare.noNeed")}</Cell>)}
            </Row>
            <Row label={t("compare.rowDeadline")}>
              {items.map((s) => {
                const dl = nextDeadline(s);
                const days = dl ? daysLeft(dl.date) : 0;
                return (
                  <Cell key={s.id}>
                    {dl && (
                      <>
                        <p className="font-semibold text-[#1a3352]">{dl.date}</p>
                        <p className="text-xs text-[#7591ab]">{dl.type} · <span className={deadlineColor(days)}>{deadlineText(days, t)}</span></p>
                      </>
                    )}
                  </Cell>
                );
              })}
            </Row>
            <Row label={t("compare.rowIntake")}>
              {items.map((s) => <Cell key={s.id}>{s.intake}</Cell>)}
            </Row>
            <Row label={t("compare.rowUni")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  {s.university}
                  <p className={`text-xs ${s.qsRank === bestQs ? "font-semibold text-[#0b7a52]" : "text-[#7591ab]"}`}>
                    QS #{s.qsRank}{s.qsRank === bestQs && ` ${t("compare.best")}`}
                  </p>
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowProvider")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  {t(`providerType.${s.providerType}`)}
                  <p className="text-xs text-[#7591ab]">{s.provider}</p>
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowLang")}>
              {items.map((s) => <Cell key={s.id}>{teachLanguages(s.language, t)}</Cell>)}
            </Row>
            <Row label={t("compare.rowDocs")}>
              {items.map((s) => (
                <Cell key={s.id}>
                  <b>{t("compare.docsCount", { n: s.documents.length })}</b>
                  <p className="text-xs text-[#7591ab]">{s.documents.slice(0, 3).join(" · ")}{s.documents.length > 3 ? "…" : ""}</p>
                </Cell>
              ))}
            </Row>
            <Row label={t("compare.rowTrust")}>
              {items.map((s) => <Cell key={s.id}><b className="text-[#0b7a52]">{s.trustScore}/100</b> · {t("compare.updated", { d: s.lastVerified })}</Cell>)}
            </Row>
            <Row label="">
              {items.map((s) => (
                <td key={s.id} className="border-l border-t border-[#eef3f9] p-3">
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => requireAuth(() => toggleTrack(s.id))}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        loggedIn && isTracked(s.id) ? "bg-[#0f9d6b] text-white" : "border border-[#c8dcfa] bg-[#eaf1fd] text-[#2f6fe0] hover:bg-[#e0ebfc]"
                      }`}
                    >
                      {loggedIn && isTracked(s.id)
                        ? <><Check className="h-3.5 w-3.5" />{t("compare.tracking")}</>
                        : <><Bookmark className="h-3.5 w-3.5" />{t("compare.track")}</>}
                    </button>
                    <Link href={`/scholarships/${s.id}`} className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1a3352] px-3 py-1.5 text-center text-xs font-bold text-white hover:bg-[#22406a]">
                      {t("compare.viewDetail")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>

      {/* Chú giải — icon vương miện đứng trước, vì chuỗi dịch không còn mang glyph */}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#93a7bd]">
        <Crown className="h-3.5 w-3.5 shrink-0" />
        {t("compare.legend")}
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="align-top">
      <th className="sticky left-0 z-10 border-t border-[#eef3f9] bg-white p-3 text-left text-xs font-semibold text-[#7591ab]">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="border-l border-t border-[#eef3f9] p-3 text-[#455f78]">{children}</td>;
}
