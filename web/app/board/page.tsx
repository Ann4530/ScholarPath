"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  scholarshipById,
  professorById,
  matchScore,
  nextDeadline,
  daysLeft,
} from "@/lib/data";
import { useTrack, STAGES, StageId, stageColor } from "@/lib/store";
import { flagEmoji, deadlineColor, deadlineText, matchColor } from "@/lib/ui";

export default function BoardPage() {
  const { tracked, profile, setStage, removeTrack, progress } = useTrack();
  const [view, setView] = useState<"table" | "kanban">("table");
  const [dragId, setDragId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return Object.values(tracked)
      .map((item) => {
        const s = scholarshipById(item.scholarshipId);
        if (!s) return null;
        const dl = nextDeadline(s);
        const days = dl ? daysLeft(dl.date) : 9999;
        const prof = s.professorIds[0] ? professorById(s.professorIds[0]) : null;
        return { item, s, dl, days, prof, match: matchScore(profile, s), prog: progress(s.id) };
      })
      .filter(Boolean)
      .sort((a, b) => a!.days - b!.days) as {
      item: (typeof tracked)[string];
      s: NonNullable<ReturnType<typeof scholarshipById>>;
      dl: ReturnType<typeof nextDeadline>;
      days: number;
      prof: ReturnType<typeof professorById> | null;
      match: ReturnType<typeof matchScore>;
      prog: number;
    }[];
  }, [tracked, profile, progress]);

  const stats = useMemo(() => {
    const byStage: Record<string, number> = {};
    STAGES.forEach((s) => (byStage[s.id] = 0));
    let soon = 0, urgent = 0;
    rows.forEach((r) => {
      byStage[r.item.stage] = (byStage[r.item.stage] ?? 0) + 1;
      if (r.days >= 0 && r.days <= 7) soon++;
      if (r.days >= 0 && r.days <= 30 && r.prog < 100) urgent++;
    });
    return { total: rows.length, byStage, soon, urgent };
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl">🗂️</div>
        <h1 className="mt-4 text-xl font-bold text-slate-800">Bảng theo dõi trống</h1>
        <p className="mt-2 text-slate-500">Hãy bấm “Theo dõi” ở một học bổng để bắt đầu quản lý tiến độ ứng tuyển.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">
          Tìm học bổng →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Bảng theo dõi ứng tuyển</h1>
        <div className="flex rounded-lg border border-slate-300 bg-white p-0.5 text-sm">
          {(["table", "kanban"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 font-medium ${view === v ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
              {v === "table" ? "Bảng" : "Kanban"}
            </button>
          ))}
        </div>
      </div>

      {/* Thống kê */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Đang theo dõi" value={stats.total} tone="slate" />
        <Stat label="Sắp hết hạn ≤7 ngày" value={stats.soon} tone="rose" />
        <Stat label="Gấp: hồ sơ <100% & ≤30 ngày" value={stats.urgent} tone="amber" />
        <Stat label="Đã nộp" value={stats.byStage["da_nop"] + stats.byStage["phong_van"] + stats.byStage["ket_qua"]} tone="emerald" />
      </div>

      {view === "table" ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="p-3">Học bổng</th>
                <th className="p-3">Match</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Giáo sư</th>
                <th className="p-3">Hồ sơ</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="p-3">
                    <Link href={`/scholarships/${r.s.id}`} className="font-medium text-slate-800 hover:text-indigo-600">{r.s.title}</Link>
                    <div className="text-xs text-slate-500">{flagEmoji(r.s.countryCode)} {r.s.country}</div>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${matchColor(r.match.score)}`}>{r.match.score}%</span>
                  </td>
                  <td className="p-3">
                    {r.dl && <>
                      <div className="text-slate-700">{r.dl.date}</div>
                      <div className={`text-xs ${deadlineColor(r.days)}`}>{deadlineText(r.days)}</div>
                    </>}
                  </td>
                  <td className="p-3">
                    {r.prof ? (
                      <Link href={`/professors/${r.prof.id}`} className="text-violet-600 hover:underline">{r.prof.name}</Link>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-indigo-500" style={{ width: `${r.prog}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{r.prog}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <select value={r.item.stage} onChange={(e) => setStage(r.s.id, e.target.value as StageId)}
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${stageColor(r.item.stage)}`}>
                      {STAGES.map((st) => <option key={st.id} value={st.id}>{st.label}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => removeTrack(r.s.id)} className="text-xs text-slate-400 hover:text-rose-600" title="Bỏ theo dõi">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="thin-scroll mt-6 flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((st) => {
            const items = rows.filter((r) => r.item.stage === st.id);
            return (
              <div key={st.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragId) { setStage(dragId, st.id); setDragId(null); } }}
                className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100/70 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                  <span className="text-xs text-slate-400">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((r) => (
                    <div key={r.s.id} draggable
                      onDragStart={() => setDragId(r.s.id)}
                      onDragEnd={() => setDragId(null)}
                      className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing">
                      <Link href={`/scholarships/${r.s.id}`} className="text-sm font-medium text-slate-800 hover:text-indigo-600">{r.s.title}</Link>
                      <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                        <span>{flagEmoji(r.s.countryCode)} {r.s.country}</span>
                        <span className={`font-semibold ${deadlineColor(r.days)}`}>{deadlineText(r.days)}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-indigo-500" style={{ width: `${r.prog}%` }} />
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="px-2 py-3 text-center text-xs text-slate-400">Kéo thẻ vào đây</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Mẹo: ở chế độ Kanban, <b>kéo–thả</b> thẻ giữa các cột để đổi trạng thái. Ở chế độ Bảng, đổi trạng thái bằng ô chọn.
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "slate" | "rose" | "amber" | "emerald" }) {
  const tones = {
    slate: "bg-white text-slate-900 border-slate-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}
