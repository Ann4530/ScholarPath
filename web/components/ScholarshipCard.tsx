"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  MatchResult,
  nextDeadline,
  daysLeft,
  Scholarship,
} from "@/lib/data";
import { flagEmoji, matchRingBar, matchFg, deadlineColor, deadlineHex, deadlineText } from "@/lib/ui";
import { useTrack } from "@/lib/store";

export default function ScholarshipCard({
  s,
  match,
}: {
  s: Scholarship;
  match: MatchResult;
}) {
  const { t } = useTranslation();
  const { isTracked, toggleTrack, isCompared, toggleCompare } = useTrack();
  const tracked = isTracked(s.id);
  const compared = isCompared(s.id);
  const dl = nextDeadline(s);
  const days = dl ? daysLeft(dl.date) : 0;
  const ring = matchRingBar(match.score);
  const fg = matchFg(match.score);
  const needsGre = s.eligibility.gre;
  const needsProposal = /đề cương|proposal|research plan/i.test(s.documents.join(" "));

  return (
    <div className="flex flex-col rounded-[18px] border border-[#dce8f4] bg-white p-[18px] shadow-[0_1px_2px_rgba(23,50,76,0.04)] transition hover:shadow-md">
      {/* head */}
      <div className="flex items-start justify-between gap-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#7591ab]">
            <span className="text-[15px]">{flagEmoji(s.countryCode)}</span>
            <span>{t(`country.${s.countryCode}`)} · {s.city}</span>
            <span className="rounded-full bg-[#eaf4fe] px-1.5 py-px text-[11px] font-bold text-[#1c5cc0]">QS #{s.qsRank}</span>
          </div>
          <Link
            href={`/scholarships/${s.id}`}
            className="mt-2.5 block text-[16px] font-bold leading-tight tracking-tight text-[#1a3352] hover:text-[#2f6fe0]"
          >
            {s.title}
          </Link>
          <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#7591ab]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93a7bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M10 6h4M10 10h4M10 14h4" /></svg>
            {s.university}
          </div>
        </div>
        {/* match ring */}
        <div className="flex w-[66px] shrink-0 flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: ring }}>
            <div className="grid h-[42px] w-[42px] place-items-center rounded-full bg-white text-[14px] font-extrabold" style={{ color: fg }}>
              {match.score}%
            </div>
          </div>
          <div className="mt-1.5 text-center text-[10px] font-bold leading-tight" style={{ color: fg }}>{match.label}</div>
        </div>
      </div>

      {/* meta grid */}
      <div className="mt-[15px] grid grid-cols-2 gap-2.5 text-[12px] font-semibold text-[#455f78]">
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f9d6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" /></svg>
          {t(`funding.${s.fundingLevel}`)}
        </div>
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c74e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>
          {s.levels.map((l) => t(`level.${l}`)).join(", ")}
        </div>
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2f8fe6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" /></svg>
          {s.language}
        </div>
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0921a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          {s.intake}
        </div>
      </div>

      {/* requirement chips */}
      <div className="mt-[13px] flex flex-wrap gap-1.5 text-[11px] font-semibold">
        {s.requiresSupervisor && (
          <span className="rounded-lg border border-[#ddd0fb] bg-[#f2ecfe] px-2 py-1 font-bold text-[#6d3ee0]">
            {t("card.needSupervisor")}
          </span>
        )}
        {needsGre && (
          <span className="rounded-lg border border-[#f5e0b8] bg-[#fdf3e0] px-2 py-1 font-bold text-[#a9670a]">GRE/GMAT</span>
        )}
        {needsProposal && (
          <span className="rounded-lg border border-[#bcdcfb] bg-[#e7f2ff] px-2 py-1 font-bold text-[#1c5cc0]">{t("card.needProposal")}</span>
        )}
      </div>

      <div className="flex-1" />

      {/* deadline */}
      {dl && (
        <div className="mt-[15px] flex items-center gap-2 border-t border-[#eef3f9] pt-[13px] text-[12.5px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={deadlineHex(days)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span className="text-[#7591ab]">{dl.type}:</span>
          <span className="font-semibold text-[#455f78]">{dl.date}</span>
          <span className={`ml-auto font-bold ${deadlineColor(days)}`}>{deadlineText(days, t)}</span>
        </div>
      )}

      {/* actions */}
      <div className="mt-3.5 flex gap-2.5">
        <button
          onClick={() => toggleTrack(s.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[11px] px-3 py-2.5 text-[13px] font-bold transition ${
            tracked
              ? "bg-[#0f9d6b] text-white hover:brightness-105"
              : "border border-[#c8dcfa] bg-[#eaf1fd] text-[#2f6fe0] hover:bg-[#e0ebfc]"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={tracked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          {tracked ? t("card.tracking") : t("card.track")}
        </button>
        <button
          onClick={() => toggleCompare(s.id)}
          title={compared ? t("card.compareRemove") : t("card.compareAdd")}
          className={`grid place-items-center rounded-[11px] border px-3 py-2.5 transition ${
            compared
              ? "border-[#7c3aed] bg-[#7c3aed] text-white"
              : "border-[#dce8f4] bg-white text-[#7591ab] hover:border-[#c4b5fd] hover:text-[#7c3aed]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 3 4 4-4 4" /><path d="M21 7H9a4 4 0 0 0-4 4" /><path d="m7 21-4-4 4-4" /><path d="M3 17h12a4 4 0 0 0 4-4" /></svg>
        </button>
        <Link
          href={`/scholarships/${s.id}`}
          className="grid place-items-center rounded-[11px] bg-[#1a3352] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#22406a]"
        >
          {t("card.detail")}
        </Link>
      </div>
    </div>
  );
}
