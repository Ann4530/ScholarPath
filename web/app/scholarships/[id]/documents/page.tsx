"use client";

// Trợ lý viết hồ sơ (E18): sinh bản nháp tài liệu nộp học bổng, cho sửa/sao chép/tải.
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { scholarshipById, professorById } from "@/lib/data";
import { generateDrafts } from "@/lib/docs";
import { useTrack } from "@/lib/store";
import i18n from "@/lib/i18n";

const DRAFTS_KEY = "scholarfinder_drafts_v1";

export default function DocumentsPage() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { profile } = useTrack();
  const s = scholarshipById(params.id);

  // Bản nháp gốc (tiếng Anh, cá nhân hóa) — tính lại khi hồ sơ đổi
  const drafts = useMemo(() => {
    if (!s) return [];
    const profs = s.professorIds.map((id) => professorById(id)).filter(Boolean) as NonNullable<ReturnType<typeof professorById>>[];
    const tEn = i18n.getFixedT("en") as (k: string, o?: Record<string, unknown>) => string;
    return generateDrafts(profile, s, profs, tEn);
  }, [s, profile]);

  // Bản đã chỉnh (giữ giữa các phiên) — map key `${scholarshipId}:${docId}` -> text
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- nạp localStorage sau mount */
    try {
      const raw = localStorage.getItem(DRAFTS_KEY);
      if (raw) setEdited(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(DRAFTS_KEY, JSON.stringify(edited));
  }, [edited, loaded]);

  if (!s) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">{t("detail.notFound")}</p>
        <Link href="/" className="mt-4 inline-block text-indigo-600 underline">← {t("detail.backSearch")}</Link>
      </div>
    );
  }

  const keyOf = (docId: string) => `${s.id}:${docId}`;
  const textOf = (docId: string, fallback: string) => edited[keyOf(docId)] ?? fallback;

  const setText = (docId: string, value: string) =>
    setEdited((e) => ({ ...e, [keyOf(docId)]: value }));

  const resetDoc = (docId: string) =>
    setEdited((e) => {
      const next = { ...e };
      delete next[keyOf(docId)];
      return next;
    });

  const copy = async (docId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(docId);
      setTimeout(() => setCopiedId((c) => (c === docId ? null : c)), 1800);
    } catch {
      /* ignore */
    }
  };

  const download = (docId: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${s.id}-${docId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAll = async () => {
    const all = drafts.map((d) => `### ${d.title}\n\n${textOf(d.id, d.body)}`).join("\n\n──────────\n\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopiedId("__all__");
      setTimeout(() => setCopiedId((c) => (c === "__all__" ? null : c)), 1800);
    } catch {
      /* ignore */
    }
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href={`/scholarships/${s.id}`} className="text-sm text-slate-500 hover:text-indigo-600">← {t("docs.back")}</Link>

      {/* Header */}
      <section className="relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">✍️ {t("docs.title")}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{t("docs.subtitle")}</h1>
          <p className="mt-2 text-sm text-indigo-100">{t("docs.for")} <b className="text-white">{s.title}</b></p>
        </div>
      </section>

      {/* Ghi chú ngôn ngữ + nhắc hồ sơ */}
      <div className="mt-4 space-y-2">
        <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800"
          dangerouslySetInnerHTML={{ __html: "📝 " + t("docs.langNote") }} />
        {(!profile.name.trim() || profile.fields.length === 0) && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            {t("docs.fillProfilePre")}{" "}
            <Link href="/profile" className="font-semibold underline">{t("docs.fillProfileLink")}</Link>{" "}
            {t("docs.fillProfilePost")}
          </p>
        )}
      </div>

      {/* Danh mục nhảy nhanh + copy all */}
      {drafts.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {drafts.map((d) => (
            <a key={d.id} href={`#${d.id}`}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700">
              {d.title}
            </a>
          ))}
          <button onClick={copyAll}
            className="ml-auto rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
            {copiedId === "__all__" ? `✓ ${t("docs.copied")}` : `📋 ${t("docs.copyAll")}`}
          </button>
        </div>
      )}

      {/* Các bản nháp */}
      {drafts.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">{t("docs.empty")}</p>
      ) : (
        <div className="mt-4 space-y-5">
          {drafts.map((d) => {
            const text = textOf(d.id, d.body);
            const isEdited = edited[keyOf(d.id)] !== undefined;
            return (
              <section key={d.id} id={d.id} className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">{d.title}</h2>
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 ring-1 ring-violet-200">
                        {isEdited ? t("docs.edited") : t("docs.generatedBadge")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{d.hint}</p>
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(d.id, e.target.value)}
                  rows={Math.min(22, text.split("\n").length + 2)}
                  spellCheck={false}
                  className="thin-scroll mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[13px] leading-relaxed text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
                />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400">{t("docs.words", { n: wordCount(text) })}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => copy(d.id, text)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                      {copiedId === d.id ? `✓ ${t("docs.copied")}` : `📋 ${t("docs.copy")}`}
                    </button>
                    <button onClick={() => download(d.id, text)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      ⬇ {t("docs.download")}
                    </button>
                    {isEdited && (
                      <button onClick={() => resetDoc(d.id)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-rose-300 hover:text-rose-600">
                        ↺ {t("docs.reset")}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Nối với cố vấn viết luận */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-sm text-violet-900">🧑‍🏫 {t("docs.advisorPre")}</p>
        <Link href="/profile" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
          {t("docs.advisorLink")}
        </Link>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">⚠️ {t("docs.disclaimer")}</p>
    </div>
  );
}
