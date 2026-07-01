"use client";

import Link from "next/link";
import {
  FUNDING_VI,
  LEVEL_VI,
  MatchResult,
  nextDeadline,
  daysLeft,
  Scholarship,
} from "@/lib/data";
import { flagEmoji, matchColor, matchBar, deadlineColor, deadlineText } from "@/lib/ui";
import { useTrack } from "@/lib/store";

export default function ScholarshipCard({
  s,
  match,
}: {
  s: Scholarship;
  match: MatchResult;
}) {
  const { isTracked, toggleTrack } = useTrack();
  const tracked = isTracked(s.id);
  const dl = nextDeadline(s);
  const days = dl ? daysLeft(dl.date) : 0;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-base">{flagEmoji(s.countryCode)}</span>
            <span className="truncate">{s.country}</span>
            <span>·</span>
            <span className="truncate">{s.university}</span>
            <span className="hidden sm:inline">· QS #{s.qsRank}</span>
          </div>
          <Link
            href={`/scholarships/${s.id}`}
            className="mt-1 block text-base font-semibold text-slate-900 hover:text-indigo-600"
          >
            {s.title}
          </Link>
        </div>
        <div
          className={`shrink-0 rounded-lg border px-2 py-1 text-center ${matchColor(match.score)}`}
          title={match.label}
        >
          <div className="text-lg font-bold leading-none">{match.score}%</div>
          <div className="text-[10px] leading-tight">{match.label}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          {FUNDING_VI[s.fundingLevel]}
        </span>
        {s.levels.map((l) => (
          <span key={l} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {LEVEL_VI[l]}
          </span>
        ))}
        {s.requiresSupervisor && (
          <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
            Cần giáo sư
          </span>
        )}
      </div>

      {/* Thanh match */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${matchBar(match.score)}`} style={{ width: `${match.score}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div>
          {dl && (
            <>
              <span className="text-slate-500">{dl.type}: </span>
              <span className="text-slate-700">{dl.date}</span>{" "}
              <span className={deadlineColor(days)}>({deadlineText(days)})</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => toggleTrack(s.id)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            tracked
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          {tracked ? "✓ Đang theo dõi" : "+ Theo dõi"}
        </button>
        <Link
          href={`/scholarships/${s.id}`}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  );
}
