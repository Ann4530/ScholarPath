"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { tracked, profile, setStage, setNote, removeTrack, progress } = useTrack();
  const [view, setView] = useState<"table" | "kanban">("table");
  const [dragId, setDragId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    return Object.values(tracked)
      .map((item) => {
        const s = scholarshipById(item.scholarshipId);
        if (!s) return null;
        const dl = nextDeadline(s);
        const days = dl ? daysLeft(dl.date) : 9999;
        const prof = s.professorIds[0] ? professorById(s.professorIds[0]) : null;
        return { item, s, dl, days, prof, match: matchScore(profile, s, t), prog: progress(s.id) };
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
  }, [tracked, profile, progress, t]);

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
        <h1 className="mt-4 text-xl font-extrabold text-[#1a3352]">{t("board.emptyTitle")}</h1>
        <p className="mt-2 text-[#7591ab]">{t("board.emptyDesc")}</p>
        <Link href="/" className="mt-6 inline-block rounded-[11px] bg-[#2f6fe0] px-5 py-2.5 font-bold text-white hover:brightness-105">
          {t("board.findCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#12345c]">{t("board.title")}</h1>
        <div className="flex rounded-[11px] bg-[#dbe8f7] p-1 text-sm">
          {(["table", "kanban"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-lg px-4 py-2 font-bold ${view === v ? "bg-white text-[#1a3352] shadow-[0_1px_3px_rgba(23,50,76,0.08)]" : "text-[#5a7794]"}`}>
              {v === "table" ? t("board.viewTable") : t("board.viewKanban")}
            </button>
          ))}
        </div>
      </div>

      {/* Thống kê */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("board.statTracking")} value={stats.total} tone="slate" />
        <Stat label={t("board.statSoon")} value={stats.soon} tone="rose" />
        <Stat label={t("board.statUrgent")} value={stats.urgent} tone="amber" />
        <Stat label={t("board.statSubmitted")} value={stats.byStage["da_nop"] + stats.byStage["phong_van"] + stats.byStage["ket_qua"]} tone="emerald" />
      </div>

      {view === "table" ? (
        <div className="sf-scroll mt-6 overflow-x-auto rounded-[16px] border border-[#dce8f4] bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-[#e6eef6] bg-[#f6f9fd] text-left text-xs uppercase tracking-wide text-[#7591ab]">
                <th className="p-3">{t("board.thScholarship")}</th>
                <th className="p-3">{t("board.thMatch")}</th>
                <th className="p-3">{t("board.thDeadline")}</th>
                <th className="p-3">{t("board.thProf")}</th>
                <th className="p-3">{t("board.thDocs")}</th>
                <th className="p-3">{t("board.thStatus")}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.s.id}>
                <tr className="border-t border-[#eef3f9] hover:bg-[#f6f9fd]">
                  <td className="p-3">
                    <Link href={`/scholarships/${r.s.id}`} className="font-bold text-[#1a3352] hover:text-[#2f6fe0]">{r.s.title}</Link>
                    <div className="text-xs text-[#7591ab]">{flagEmoji(r.s.countryCode)} {t(`country.${r.s.countryCode}`)}</div>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${matchColor(r.match.score)}`}>{r.match.score}%</span>
                  </td>
                  <td className="p-3">
                    {r.dl && <>
                      <div className="font-semibold text-[#455f78]">{r.dl.date}</div>
                      <div className={`text-xs ${deadlineColor(r.days)}`}>{deadlineText(r.days, t)}</div>
                    </>}
                  </td>
                  <td className="p-3">
                    {r.prof ? (
                      <Link href={`/professors/${r.prof.id}`} className="font-semibold text-[#7c3aed] hover:underline">{r.prof.name}</Link>
                    ) : <span className="text-[#c3ccd8]">—</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#eef3f9]">
                        <div className="h-full bg-[#2f6fe0]" style={{ width: `${r.prog}%` }} />
                      </div>
                      <span className="text-xs text-[#7591ab]">{r.prog}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <select value={r.item.stage} onChange={(e) => setStage(r.s.id, e.target.value as StageId)}
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${stageColor(r.item.stage)}`}>
                      {STAGES.map((st) => <option key={st.id} value={st.id}>{t(`stage.${st.id}`)}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setNoteOpen(noteOpen === r.s.id ? null : r.s.id)}
                        className={`text-sm ${r.item.note ? "text-[#e0921a]" : "text-[#c3ccd8] hover:text-[#e0921a]"}`}
                        title={r.item.note ? t("board.noteHas") : t("board.noteAdd")}
                      >
                        📝
                      </button>
                      <button onClick={() => removeTrack(r.s.id)} className="text-xs text-[#93a7bd] hover:text-[#d33a4a]" title={t("board.removeTitle")}>✕</button>
                    </div>
                  </td>
                </tr>
                {noteOpen === r.s.id && (
                  <tr className="border-t border-[#eef3f9] bg-[#fdf3e0]/40">
                    <td colSpan={7} className="px-3 pb-3 pt-1">
                      <label className="mb-1 block text-xs font-bold text-[#a9670a]">{t("board.noteLabel")}</label>
                      <textarea
                        value={r.item.note}
                        onChange={(e) => setNote(r.s.id, e.target.value)}
                        placeholder={t("board.notePh")}
                        rows={2}
                        className="w-full rounded-lg border border-[#f5e0b8] bg-white px-3 py-2 text-sm text-[#1a3352] outline-none focus:border-[#e0921a]"
                      />
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="sf-scroll mt-6 flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((st) => {
            const items = rows.filter((r) => r.item.stage === st.id);
            return (
              <div key={st.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragId) { setStage(dragId, st.id); setDragId(null); } }}
                className="flex w-[266px] shrink-0 flex-col rounded-[14px] bg-[#eff3f9] p-2.5">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${st.color}`}>{t(`stage.${st.id}`)}</span>
                  <span className="text-xs font-bold text-[#93a7bd]">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((r) => (
                    <div key={r.s.id} draggable
                      onDragStart={() => setDragId(r.s.id)}
                      onDragEnd={() => setDragId(null)}
                      className="cursor-grab rounded-[12px] border border-[#dce8f4] bg-white p-3 shadow-[0_1px_2px_rgba(23,50,76,0.05)] active:cursor-grabbing">
                      <Link href={`/scholarships/${r.s.id}`} className="text-sm font-bold text-[#1a3352] hover:text-[#2f6fe0]">{r.s.title}</Link>
                      <div className="mt-1 flex items-center justify-between text-xs text-[#7591ab]">
                        <span>{flagEmoji(r.s.countryCode)} {t(`country.${r.s.countryCode}`)}</span>
                        <span className={`font-semibold ${deadlineColor(r.days)}`}>{deadlineText(r.days, t)}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef3f9]">
                        <div className="h-full bg-[#2f6fe0]" style={{ width: `${r.prog}%` }} />
                      </div>
                      {r.item.note && (
                        <p className="mt-2 truncate rounded bg-[#fdf3e0] px-2 py-1 text-[11px] text-[#a9670a]" title={r.item.note}>
                          📝 {r.item.note}
                        </p>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <p className="px-2 py-3 text-center text-xs text-[#aebccd]">{t("board.dragHere")}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-[#93a7bd]">
        {t("board.tip1")} <b>{t("board.tipDrag")}</b> {t("board.tip2")}
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "slate" | "rose" | "amber" | "emerald" }) {
  const tones = {
    slate: "bg-white text-[#1a3352] border-[#dce8f4]",
    rose: "bg-[#fdecee] text-[#b23343] border-[#f7ccd2]",
    amber: "bg-[#fdf3e0] text-[#a9670a] border-[#f5e0b8]",
    emerald: "bg-[#e9f8f0] text-[#0b7a52] border-[#c4ecd8]",
  };
  return (
    <div className={`rounded-[14px] border p-4 ${tones[tone]}`}>
      <p className="text-[26px] font-extrabold">{value}</p>
      <p className="text-xs font-semibold opacity-80">{label}</p>
    </div>
  );
}
