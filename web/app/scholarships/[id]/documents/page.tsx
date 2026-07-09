"use client";

// Trợ lý viết hồ sơ (E18): sinh bản nháp tài liệu nộp học bổng, cho sửa/sao chép/tải.
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { scholarshipById, professorById } from "@/lib/data";
import { generateDrafts } from "@/lib/docs";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";
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
        <p className="text-[#5a7794]">{t("detail.notFound")}</p>
        <Link href="/" className="mt-4 inline-block text-[#2f6fe0] underline">← {t("detail.backSearch")}</Link>
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
    <div className="mx-auto max-w-[900px] px-6 py-6">
      <Link href={`/scholarships/${s.id}`} className="flex w-fit items-center gap-1.5 py-1.5 text-[13.5px] font-semibold text-[#5a7794] hover:text-[#2f6fe0]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        {t("docs.back")}
      </Link>

      {/* Header */}
      <section className="relative mt-2.5 overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,#0e1638_0%,#1c2a63_52%,#34459c_100%)] p-7 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-5 -top-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(90,120,255,0.4),transparent_70%)]" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aebbe8]">✍️ {t("docs.title")}</p>
          <h1 className="mt-1.5 text-[23px] font-extrabold tracking-tight">{t("docs.subtitle")}</h1>
          <p className="mt-2 text-[13.5px] text-[#c5d2f0]">{t("docs.for")} <b className="text-white">{flagEmoji(s.countryCode)} {s.title}</b></p>
        </div>
      </section>

      {/* Ghi chú ngôn ngữ + nhắc hồ sơ */}
      <div className="mt-4 space-y-2">
        <p className="rounded-xl bg-[#eef1fd] p-3 text-sm text-[#3730a3]"
          dangerouslySetInnerHTML={{ __html: "📝 " + t("docs.langNote") }} />
        {(!profile.name.trim() || profile.fields.length === 0) && (
          <p className="rounded-xl bg-[#fdf3e0] p-3 text-sm text-[#a9670a]">
            {t("docs.fillProfilePre")}{" "}
            <Link href="/profile" className="font-bold underline">{t("docs.fillProfileLink")}</Link>{" "}
            {t("docs.fillProfilePost")}
          </p>
        )}
      </div>

      {/* Danh mục nhảy nhanh + copy all */}
      {drafts.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {drafts.map((d) => (
            <a key={d.id} href={`#${d.id}`}
              className="rounded-full border border-[#dce8f4] bg-white px-3 py-1.5 text-xs font-semibold text-[#5a7794] hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
              {d.title}
            </a>
          ))}
          <button onClick={copyAll}
            className="ml-auto rounded-full bg-[#1a3352] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#22406a]">
            {copiedId === "__all__" ? `✓ ${t("docs.copied")}` : `📋 ${t("docs.copyAll")}`}
          </button>
        </div>
      )}

      {/* Các bản nháp */}
      {drafts.length === 0 ? (
        <p className="mt-6 rounded-[16px] border border-dashed border-[#cfe0f2] bg-white p-10 text-center text-[#5a7794]">{t("docs.empty")}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {drafts.map((d) => {
            const text = textOf(d.id, d.body);
            const isEdited = edited[keyOf(d.id)] !== undefined;
            return (
              <section key={d.id} id={d.id} className="scroll-mt-20 rounded-[16px] border border-[#dce8f4] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-extrabold text-[#1a3352]">{d.title}</h2>
                      <span className="rounded-full bg-[#f2ecfe] px-2 py-0.5 text-[10px] font-bold text-[#7c3aed] ring-1 ring-[#ddd0fb]">
                        {isEdited ? t("docs.edited") : t("docs.generatedBadge")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#7591ab]">{d.hint}</p>
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(d.id, e.target.value)}
                  rows={Math.min(22, text.split("\n").length + 2)}
                  spellCheck={false}
                  className="sf-scroll mt-3 w-full rounded-[12px] border border-[#e2e8f0] bg-[#f8fafd] p-4 font-mono text-[13px] leading-relaxed text-[#1a3352] outline-none focus:border-[#2f6fe0] focus:bg-white"
                />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#93a7bd]">{t("docs.words", { n: wordCount(text) })}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => copy(d.id, text)}
                      className="rounded-lg bg-[#2f6fe0] px-3 py-1.5 text-xs font-bold text-white hover:brightness-105">
                      {copiedId === d.id ? `✓ ${t("docs.copied")}` : `📋 ${t("docs.copy")}`}
                    </button>
                    <button onClick={() => download(d.id, text)}
                      className="rounded-lg border border-[#dce8f4] px-3 py-1.5 text-xs font-semibold text-[#5a7794] hover:bg-[#f6f9fd]">
                      ⬇ {t("docs.download")}
                    </button>
                    {isEdited && (
                      <button onClick={() => resetDoc(d.id)}
                        className="rounded-lg border border-[#dce8f4] px-3 py-1.5 text-xs font-semibold text-[#7591ab] hover:border-[#f7d0d5] hover:text-[#d33a4a]">
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-[#ddd0fb] bg-[#f2ecfe] p-4">
        <p className="text-sm text-[#5b21b6]">🧑‍🏫 {t("docs.advisorPre")}</p>
        <Link href="/profile" className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-bold text-white hover:brightness-105">
          {t("docs.advisorLink")}
        </Link>
      </div>

      <p className="mt-4 rounded-xl bg-[#fdf3e0] p-3 text-xs text-[#a9670a]">⚠️ {t("docs.disclaimer")}</p>
    </div>
  );
}
