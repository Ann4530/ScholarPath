"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultProfile, Profile, scholarshipById } from "./data";

// Các trạng thái trong pipeline theo dõi (E17) — nhãn hiển thị dịch qua t(`stage.${id}`)
export const STAGES = [
  { id: "quan_tam", color: "bg-slate-100 text-slate-700 border-slate-300" },
  { id: "nghien_cuu", color: "bg-sky-100 text-sky-700 border-sky-300" },
  { id: "lien_he_gs", color: "bg-violet-100 text-violet-700 border-violet-300" },
  { id: "chuan_bi", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { id: "da_nop", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "phong_van", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { id: "ket_qua", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];
export const stageColor = (id: string) => STAGES.find((s) => s.id === id)?.color ?? "";

export interface TrackItem {
  scholarshipId: string;
  stage: StageId;
  note: string;
  checklist: Record<string, boolean>;
  addedAt: number;
}

interface TrackState {
  tracked: Record<string, TrackItem>;
  profile: Profile;
  compare: string[]; // danh sách id học bổng đang chọn so sánh (tối đa 4)
}

export const MAX_COMPARE = 4;

interface TrackContextType extends TrackState {
  isTracked: (id: string) => boolean;
  toggleTrack: (id: string) => void;
  setStage: (id: string, stage: StageId) => void;
  setNote: (id: string, note: string) => void;
  toggleChecklist: (id: string, doc: string) => void;
  removeTrack: (id: string) => void;
  setProfile: (p: Profile) => void;
  progress: (id: string) => number;
  count: number;
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const KEY = "scholarfinder_v1";
const TrackContext = createContext<TrackContextType | null>(null);

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrackState>({ tracked: {}, profile: defaultProfile, compare: [] });
  const [loaded, setLoaded] = useState(false);

  // Load từ localStorage sau khi mount (tránh hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- nạp localStorage sau mount, tránh hydration mismatch
        setState({
          tracked: parsed.tracked ?? {},
          profile: { ...defaultProfile, ...(parsed.profile ?? {}) },
          compare: Array.isArray(parsed.compare) ? parsed.compare.slice(0, MAX_COMPARE) : [],
        });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Lưu khi thay đổi
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const isTracked = (id: string) => !!state.tracked[id];

  const toggleTrack = (id: string) =>
    setState((s) => {
      const next = { ...s.tracked };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = { scholarshipId: id, stage: "quan_tam", note: "", checklist: {}, addedAt: Date.now() };
      }
      return { ...s, tracked: next };
    });

  const setStage = (id: string, stage: StageId) =>
    setState((s) => {
      const item = s.tracked[id] ?? { scholarshipId: id, stage: "quan_tam", note: "", checklist: {}, addedAt: Date.now() };
      return { ...s, tracked: { ...s.tracked, [id]: { ...item, stage } } };
    });

  const setNote = (id: string, note: string) =>
    setState((s) => {
      const item = s.tracked[id];
      if (!item) return s;
      return { ...s, tracked: { ...s.tracked, [id]: { ...item, note } } };
    });

  const toggleChecklist = (id: string, doc: string) =>
    setState((s) => {
      const item = s.tracked[id] ?? { scholarshipId: id, stage: "chuan_bi" as StageId, note: "", checklist: {}, addedAt: Date.now() };
      const checklist = { ...item.checklist, [doc]: !item.checklist[doc] };
      return { ...s, tracked: { ...s.tracked, [id]: { ...item, checklist } } };
    });

  const removeTrack = (id: string) =>
    setState((s) => {
      const next = { ...s.tracked };
      delete next[id];
      return { ...s, tracked: next };
    });

  const setProfile = (p: Profile) => setState((s) => ({ ...s, profile: p }));

  const isCompared = (id: string) => state.compare.includes(id);

  const toggleCompare = (id: string) =>
    setState((s) => {
      if (s.compare.includes(id)) return { ...s, compare: s.compare.filter((x) => x !== id) };
      if (s.compare.length >= MAX_COMPARE) return s; // tối đa 4
      return { ...s, compare: [...s.compare, id] };
    });

  const clearCompare = () => setState((s) => ({ ...s, compare: [] }));

  const progress = (id: string) => {
    const item = state.tracked[id];
    const sch = scholarshipById(id);
    if (!item || !sch || sch.documents.length === 0) return 0;
    const done = sch.documents.filter((d) => item.checklist[d]).length;
    return Math.round((done / sch.documents.length) * 100);
  };

  const value: TrackContextType = {
    ...state,
    isTracked,
    toggleTrack,
    setStage,
    setNote,
    toggleChecklist,
    removeTrack,
    setProfile,
    progress,
    count: Object.keys(state.tracked).length,
    isCompared,
    toggleCompare,
    clearCompare,
  };

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
}

export function useTrack() {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error("useTrack must be used within TrackProvider");
  return ctx;
}
