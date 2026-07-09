"use client";

// Trang cá nhân (account hub): Tổng quan (thống kê) · Hồ sơ học tập · Danh sách của tôi · Hỗ trợ.
import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, PencilLine, Send, Clock, Target, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  scholarshipById,
  matchScore,
  nextDeadline,
  daysLeft,
  profileCompletion,
  advisors,
  REGIONS,
  REGION_KEY,
  COUNTRIES,
  FIELDS,
  INTAKES,
  Level,
  FundingLevel,
  ProviderType,
} from "@/lib/data";
import { useTrack, STAGES, StageId, stageColor } from "@/lib/store";
import { flagEmoji, matchColor, deadlineColor, deadlineText } from "@/lib/ui";
import { downloadIcs, gcalUrl, type CalEvent } from "@/lib/ics";
import i18n from "@/lib/i18n";

const LEVELS: Level[] = ["Bachelor", "Master", "PhD"];
const FUNDINGS: FundingLevel[] = ["Full", "Partial", "TuitionOnly"];
const PROVIDER_TYPES: ProviderType[] = ["Government", "University", "Org", "Corporate"];

type Tab = "overview" | "academic" | "list" | "calendar" | "support";
type ListSort = "deadline" | "match" | "stage";

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function ProfileClient({ email }: { email: string | null }) {
  const { t } = useTranslation();
  const { profile, setProfile, tracked, setStage, setNote, toggleChecklist, progress } = useTrack();
  const [tab, setTab] = useState<Tab>("overview");
  const [listSort, setListSort] = useState<ListSort>("deadline");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completion = profileCompletion(profile);
  const displayName = profile.name.trim() || email || t("account.guest");

  // ---- Gom dữ liệu học bổng đang theo dõi ----
  const rows = useMemo(() => {
    return Object.values(tracked)
      .map((item) => {
        const s = scholarshipById(item.scholarshipId);
        if (!s) return null;
        const dl = nextDeadline(s);
        const days = dl ? daysLeft(dl.date) : 9999;
        return { item, s, dl, days, match: matchScore(profile, s, t), prog: progress(s.id) };
      })
      .filter(Boolean)
      .sort((a, b) => a!.days - b!.days) as {
      item: (typeof tracked)[string];
      s: NonNullable<ReturnType<typeof scholarshipById>>;
      dl: ReturnType<typeof nextDeadline>;
      days: number;
      match: ReturnType<typeof matchScore>;
      prog: number;
    }[];
  }, [tracked, profile, progress, t]);

  // ---- Thống kê ----
  const stats = useMemo(() => {
    const byStage: Record<string, number> = {};
    STAGES.forEach((s) => (byStage[s.id] = 0));
    const byFunding: Record<string, number> = { Full: 0, Partial: 0, TuitionOnly: 0 };
    const byProvider: Record<string, number> = { Government: 0, University: 0, Org: 0, Corporate: 0 };
    const byRegion: Record<string, number> = {};
    REGIONS.forEach((r) => (byRegion[r] = 0));
    const byTier: Record<string, number> = { excellent: 0, good: 0, consider: 0, ineligible: 0 };
    let soon = 0, overdue = 0, matchSum = 0, docSum = 0, docsDone = 0, docsTotal = 0;
    rows.forEach((r) => {
      byStage[r.item.stage] = (byStage[r.item.stage] ?? 0) + 1;
      byFunding[r.s.fundingLevel]++;
      byProvider[r.s.providerType]++;
      byRegion[r.s.region]++;
      byTier[r.match.tier]++;
      if (r.days >= 0 && r.days <= 7) soon++;
      if (r.days < 0) overdue++;
      matchSum += r.match.score;
      docSum += r.prog;
      docsTotal += r.s.documents.length;
      docsDone += r.s.documents.filter((d) => r.item.checklist[d]).length;
    });
    const n = rows.length || 1;
    return {
      total: rows.length,
      byStage, byFunding, byProvider, byRegion, byTier,
      soon, overdue,
      submitted: byStage["da_nop"] + byStage["phong_van"] + byStage["ket_qua"],
      inProgress: byStage["chuan_bi"] + byStage["lien_he_gs"] + byStage["nghien_cuu"],
      avgMatch: Math.round(matchSum / n),
      avgDocs: Math.round(docSum / n),
      docsDone, docsTotal,
    };
  }, [rows]);

  // Việc cần xử lý gấp: deadline ≤30 ngày (kể cả quá hạn) & hồ sơ chưa xong
  const urgent = useMemo(
    () => rows.filter((r) => r.days <= 30 && r.prog < 100).sort((a, b) => a.days - b.days).slice(0, 6),
    [rows]
  );

  // ---- Danh sách đã sắp xếp cho bảng quản lý tiến độ ----
  const stageOrder: Record<string, number> = {};
  STAGES.forEach((st, i) => (stageOrder[st.id] = i));
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    if (listSort === "match") copy.sort((a, b) => b.match.score - a.match.score);
    else if (listSort === "stage") copy.sort((a, b) => stageOrder[b.item.stage] - stageOrder[a.item.stage]);
    else copy.sort((a, b) => a.days - b.days);
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, listSort]);

  const upcoming = rows.filter((r) => r.days >= 0).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      {/* Header cá nhân */}
      <section className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,#0a1230,#1e3a8a)] p-6 text-white sm:p-8">
        <div className="starfield pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0f9d6b] to-[#34c88a] text-3xl font-black">
            {(profile.name.trim() || email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#cfe0ff]">{t("account.title")}</p>
            <h1 className="mt-0.5 truncate text-[23px] font-extrabold tracking-tight">{displayName}</h1>
            <p className="mt-0.5 text-sm text-white/70">
              {email ? `${t("account.email")}: ${email}` : t("account.guestHint")}
            </p>
          </div>
          {/* Vòng % hoàn thiện */}
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#a5cbff" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${completion} ${100 - completion}`} />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-sm font-bold">{completion}%</span>
            </div>
            <div className="hidden max-w-[140px] text-xs text-white/70 sm:block">
              <p className="font-semibold text-white">{t("account.completion")}</p>
              <p>{t("account.completionHint")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-5 flex flex-wrap gap-1 border-b border-[#dce8f4]">
        {(["overview", "academic", "list", "calendar", "support"] as Tab[]).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === tb ? "border-b-2 border-[#2f6fe0] text-[#1c5cc0]" : "text-[#5a7794] hover:text-[#1a3352]"
            }`}
          >
            {t(`account.tabs.${tb}`)}
            {tb === "list" && stats.total > 0 && (
              <span className="ml-1.5 rounded-full bg-[#eaf1fd] px-1.5 text-xs font-bold text-[#1c5cc0]">{stats.total}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===== TAB: TỔNG QUAN ===== */}
      {tab === "overview" && (
        stats.total === 0 ? <EmptyState t={t} /> : (
          <div className="mt-6 space-y-6">
            {/* KPI */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard icon={<Bookmark className="h-[18px] w-[18px]" />} label={t("account.stat.tracking")} value={stats.total} tone="indigo" />
              <StatCard icon={<PencilLine className="h-[18px] w-[18px]" />} label={t("account.stat.inProgress")} value={stats.inProgress} tone="amber" />
              <StatCard icon={<Send className="h-[18px] w-[18px]" />} label={t("account.stat.submitted")} value={stats.submitted} tone="emerald" />
              <StatCard icon={<Clock className="h-[18px] w-[18px]" />} label={t("account.stat.soon")} value={stats.soon} tone="rose" />
              <StatCard icon={<Target className="h-[18px] w-[18px]" />} label={t("account.stat.avgMatch")} value={`${stats.avgMatch}%`} tone="violet" />
              <StatCard icon={<FileText className="h-[18px] w-[18px]" />} label={t("account.stat.avgDocs")} value={`${stats.avgDocs}%`} tone="sky" />
            </div>

            {/* Tổng giấy tờ đã hoàn thành */}
            <div className="rounded-2xl border border-[#dce8f4] bg-white p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#5a7794]">📎 {t("account.overallDocs")}</span>
                <span className="font-semibold text-[#1a3352]">{stats.docsDone}/{stats.docsTotal}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eef3f9]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2f6fe0] to-[#5aa2ff] transition-all"
                  style={{ width: `${stats.docsTotal ? Math.round((stats.docsDone / stats.docsTotal) * 100) : 0}%` }} />
              </div>
            </div>

            {/* Hàng 1: phễu giai đoạn + phân bố match */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title={t("account.funnelTitle")}>
                <div className="space-y-2.5">
                  {STAGES.map((st) => {
                    const c = stats.byStage[st.id];
                    const pct = stats.total ? Math.round((c / stats.total) * 100) : 0;
                    return (
                      <div key={st.id} className="flex items-center gap-3">
                        <span className={`w-32 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${st.color}`}>{t(`stage.${st.id}`)}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eef3f9]">
                          <div className="h-full rounded-full bg-[#eaf1fd]0 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-sm font-semibold text-[#455f78]">{c}</span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title={t("account.matchDistTitle")}>
                <BarChart rows={[
                  { label: t("match.tier.excellent"), value: stats.byTier.excellent, color: "bg-emerald-500" },
                  { label: t("match.tier.good"), value: stats.byTier.good, color: "bg-[#2f6fe0]" },
                  { label: t("match.tier.consider"), value: stats.byTier.consider, color: "bg-amber-500" },
                  { label: t("match.tier.ineligible"), value: stats.byTier.ineligible, color: "bg-rose-500" },
                ]} />
              </Panel>
            </div>

            {/* Hàng 2: mức tài trợ + khu vực + loại học bổng */}
            <div className="grid gap-6 md:grid-cols-3">
              <Panel title={t("account.byFundingTitle")}>
                <BarChart rows={FUNDINGS.map((f, i) => ({
                  label: t(`funding.${f}`), value: stats.byFunding[f],
                  color: ["bg-emerald-500", "bg-amber-500", "bg-slate-400"][i],
                }))} />
              </Panel>
              <Panel title={t("account.byRegionTitle")}>
                <BarChart rows={REGIONS.filter((r) => stats.byRegion[r] > 0).map((r, i) => ({
                  label: t(`region.${REGION_KEY[r]}`), value: stats.byRegion[r],
                  color: ["bg-[#2f6fe0]", "bg-sky-500", "bg-teal-500", "bg-fuchsia-500"][i % 4],
                }))} />
              </Panel>
              <Panel title={t("account.byProviderTitle")}>
                <BarChart rows={PROVIDER_TYPES.map((p, i) => ({
                  label: t(`providerType.${p}`), value: stats.byProvider[p],
                  color: ["bg-[#2f6fe0]", "bg-sky-500", "bg-violet-500", "bg-amber-500"][i],
                }))} />
              </Panel>
            </div>

            {/* Hàng 3: cần xử lý gấp + deadline sắp tới */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title={`⚠️ ${t("account.urgentTitle")}`}>
                <p className="-mt-2 mb-2 text-xs text-[#93a7bd]">{t("account.urgentDesc")}</p>
                {urgent.length === 0 ? (
                  <p className="rounded-lg bg-[#e9f8f0] p-3 text-sm text-[#0b7a52]">{t("account.urgentEmpty")}</p>
                ) : (
                  <ul className="space-y-2">
                    {urgent.map((r) => (
                      <li key={r.s.id}>
                        <Link href={`/scholarships/${r.s.id}/documents`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[#eef3f9] p-2.5 hover:border-[#9cc1f5] hover:bg-[#eaf1fd]/40">
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-bold text-[#1a3352]">{r.s.title}</span>
                            <span className="text-xs text-[#7591ab]">{flagEmoji(r.s.countryCode)} {t(`country.${r.s.countryCode}`)} · {t("account.itemProgress")} {r.prog}%</span>
                          </div>
                          <span className={`shrink-0 text-xs font-semibold ${deadlineColor(r.days)}`}>{deadlineText(r.days, t)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel title={t("account.deadlinesTitle")}>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-[#93a7bd]">{t("account.deadlinesEmpty")}</p>
                ) : (
                  <ul className="divide-y divide-[#eef3f9]">
                    {upcoming.map((r) => (
                      <li key={r.s.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <Link href={`/scholarships/${r.s.id}`} className="block truncate font-bold text-[#1a3352] hover:text-[#2f6fe0]">{r.s.title}</Link>
                          <span className="text-xs text-[#7591ab]">{flagEmoji(r.s.countryCode)} {t(`country.${r.s.countryCode}`)} · {r.dl?.type}</span>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm text-[#455f78]">{r.dl?.date}</p>
                          <p className={`text-xs ${deadlineColor(r.days)}`}>{deadlineText(r.days, t)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
          </div>
        )
      )}

      {/* ===== TAB: HỒ SƠ HỌC TẬP ===== */}
      {tab === "academic" && (
        <div className="mt-6 rounded-2xl border border-[#dce8f4] bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1a3352]">{t("account.academicTitle")}</h2>
              <p className="text-sm text-[#7591ab]">{t("account.academicHint")}</p>
            </div>
            <span className="hidden items-center gap-1 rounded-full bg-[#e9f8f0] px-3 py-1 text-xs font-semibold text-[#0b7a52] sm:flex">✓ {t("account.saved")}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label={t("account.name")}>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder={t("account.namePh")} className="inp" />
            </Field>
            <Field label={t("account.nationality")}>
              <select value={profile.nationality} onChange={(e) => setProfile({ ...profile, nationality: e.target.value })} className="inp">
                <option value="VN">{t("account.natVN")}</option>
                <option value="Other">{t("account.natOther")}</option>
              </select>
            </Field>
            <Field label={t("profilePanel.level")}>
              <select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })} className="inp">
                {LEVELS.map((l) => <option key={l} value={l}>{t(`level.${l}`)}</option>)}
              </select>
            </Field>
            <Field label={t("profilePanel.gpa")}>
              <input type="number" step="0.1" min="0" max="4" value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) || 0 })} className="inp" />
            </Field>
            <Field label={t("profilePanel.ielts")}>
              <input type="number" step="0.5" min="0" max="9" value={profile.ielts}
                onChange={(e) => setProfile({ ...profile, ielts: parseFloat(e.target.value) || 0 })} className="inp" />
            </Field>
            <Field label={t("account.workYears")}>
              <input type="number" step="1" min="0" max="40" value={profile.workYears}
                onChange={(e) => setProfile({ ...profile, workYears: parseInt(e.target.value) || 0 })} className="inp" />
            </Field>
            <Field label={t("profilePanel.fundingNeed")}>
              <select value={profile.fundingNeed} onChange={(e) => setProfile({ ...profile, fundingNeed: e.target.value as "Full" | "Partial" | "Any" })} className="inp">
                <option value="Full">{t("profilePanel.needFull")}</option>
                <option value="Partial">{t("profilePanel.needPartial")}</option>
                <option value="Any">{t("profilePanel.needAny")}</option>
              </select>
            </Field>
            <Field label={t("account.intakeField")}>
              <select value={profile.intake} onChange={(e) => setProfile({ ...profile, intake: e.target.value })} className="inp">
                <option value="">{t("account.intakeAny")}</option>
                {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label={t("profilePanel.hasGre")}>
              <label className="flex h-[42px] cursor-pointer items-center gap-2 rounded-[10px] border border-[#cfe0f2] bg-white px-3">
                <input type="checkbox" checked={profile.hasGre} onChange={() => setProfile({ ...profile, hasGre: !profile.hasGre })} className="h-4 w-4 accent-[#2f6fe0]" />
                <span className="text-sm text-[#455f78]">GRE/GMAT</span>
              </label>
            </Field>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#5a7794]">{t("profilePanel.fields")}</p>
              <div className="flex flex-wrap gap-1.5">
                {FIELDS.map((f) => (
                  <button key={f} onClick={() => setProfile({ ...profile, fields: toggle(profile.fields, f) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${profile.fields.includes(f) ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"}`}>{f}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#5a7794]">{t("profilePanel.countries")}</p>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => setProfile({ ...profile, countries: toggle(profile.countries, c.code) })}
                    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${profile.countries.includes(c.code) ? "bg-[#2f6fe0] text-white ring-[#2f6fe0]" : "bg-white text-[#5a7794] ring-[#cfe0f2] hover:ring-[#9cc1f5]"}`}>{flagEmoji(c.code)} {t(`country.${c.code}`)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: DANH SÁCH CỦA TÔI — bảng quản lý tiến độ ===== */}
      {tab === "list" && (
        stats.total === 0 ? <EmptyState t={t} /> : (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-[#1a3352]">{t("account.listTitle")}</h2>
                <p className="text-xs text-[#7591ab]">{t("account.expandHint")}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-[#7591ab]">{t("filter.sortLabel")}</label>
                <select value={listSort} onChange={(e) => setListSort(e.target.value as ListSort)}
                  className="rounded-[10px] border border-[#cfe0f2] bg-white px-2.5 py-1.5 font-semibold text-[#1a3352]">
                  <option value="deadline">{t("filter.sortDeadline")}</option>
                  <option value="match">{t("filter.sortMatch")}</option>
                  <option value="stage">{t("account.group.stage")}</option>
                </select>
                <Link href="/board" className="rounded-lg bg-[#1a3352] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#22406a]">{t("account.openBoard")}</Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-[#dce8f4] bg-white">
              {/* Đầu bảng (ẩn trên mobile) */}
              <div className="hidden grid-cols-[1fr_150px_130px_120px_28px] gap-3 border-b border-[#e6eef6] bg-[#f6f9fd] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#7591ab] sm:grid">
                <span>{t("board.thScholarship")}</span>
                <span>{t("board.thStatus")}</span>
                <span>{t("board.thDeadline")}</span>
                <span>{t("board.thDocs")}</span>
                <span></span>
              </div>

              {sortedRows.map((r) => {
                const open = expandedId === r.s.id;
                return (
                  <div key={r.s.id} className="border-t border-[#eef3f9]">
                    {/* Hàng chính — bấm để bung chi tiết */}
                    <div
                      onClick={() => setExpandedId(open ? null : r.s.id)}
                      className={`grid cursor-pointer grid-cols-1 gap-2 px-4 py-3 transition hover:bg-[#f6f9fd] sm:grid-cols-[1fr_150px_130px_120px_28px] sm:items-center sm:gap-3 ${open ? "bg-[#eaf1fd]/40" : ""}`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#1a3352]">{r.s.title}</p>
                        <p className="text-xs text-[#7591ab]">
                          {flagEmoji(r.s.countryCode)} {t(`country.${r.s.countryCode}`)}
                          <span className={`ml-2 rounded border px-1 py-0.5 text-[10px] font-bold ${matchColor(r.match.score)}`}>{r.match.score}%</span>
                          {r.item.note && <span className="ml-2 text-[#a9670a]">📝</span>}
                        </p>
                      </div>
                      {/* Đổi trạng thái — chặn nổi bọt để không bung/thu khi chọn */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <select value={r.item.stage} onChange={(e) => setStage(r.s.id, e.target.value as StageId)}
                          className={`w-full rounded-md border px-2 py-1 text-xs font-medium ${stageColor(r.item.stage)}`}>
                          {STAGES.map((st) => <option key={st.id} value={st.id}>{t(`stage.${st.id}`)}</option>)}
                        </select>
                      </div>
                      <div className="text-xs">
                        {r.dl ? (
                          <>
                            <span className="text-[#5a7794]">{r.dl.date}</span>{" "}
                            <span className={deadlineColor(r.days)}>({deadlineText(r.days, t)})</span>
                          </>
                        ) : <span className="text-[#c3ccd8]">—</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef3f9]">
                          <div className="h-full bg-[#2f6fe0]" style={{ width: `${r.prog}%` }} />
                        </div>
                        <span className="text-xs text-[#7591ab]">{r.prog}%</span>
                      </div>
                      <span className={`hidden text-[#93a7bd] transition-transform sm:inline ${open ? "rotate-180" : ""}`}>▾</span>
                    </div>

                    {/* Panel chi tiết */}
                    {open && (
                      <div className="animate-drop grid gap-4 border-t border-[#dbe8f7] bg-[#eaf1fd]/30 px-4 py-4 lg:grid-cols-2">
                        {/* Hồ sơ cần nộp (tick tiến độ) */}
                        <div className="rounded-xl border border-[#dce8f4] bg-white p-3">
                          <p className="mb-2 text-sm font-semibold text-[#1a3352]">📋 {t("detail.checklist")} <span className="font-normal text-[#93a7bd]">({r.prog}%)</span></p>
                          <ul className="space-y-1">
                            {r.s.documents.map((d) => (
                              <li key={d}>
                                <label className="flex cursor-pointer items-start gap-2 rounded p-1 text-sm hover:bg-[#f6f9fd]">
                                  <input type="checkbox" checked={!!r.item.checklist[d]} onChange={() => toggleChecklist(r.s.id, d)} className="mt-0.5 h-4 w-4 accent-[#2f6fe0]" />
                                  <span className={r.item.checklist[d] ? "text-[#93a7bd] line-through" : "text-[#455f78]"}>{d}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          {/* Link đăng ký / nguồn + trợ lý viết hồ sơ */}
                          <div className="rounded-xl border border-[#dce8f4] bg-white p-3">
                            <p className="mb-2 text-sm font-semibold text-[#1a3352]">🔗 {t("account.linksSection")}</p>
                            <div className="flex flex-wrap gap-2">
                              <a href={r.s.officialUrl} target="_blank" rel="noopener noreferrer"
                                className="rounded-lg border border-[#dce8f4] px-3 py-1.5 text-xs font-semibold text-[#5a7794] hover:bg-[#f6f9fd]">🌐 {t("detail.official")}</a>
                              <Link href={`/scholarships/${r.s.id}/documents`}
                                className="rounded-lg bg-[#2f6fe0] px-3 py-1.5 text-xs font-bold text-white hover:brightness-105">{t("docs.openCta")}</Link>
                              <Link href={`/scholarships/${r.s.id}`}
                                className="rounded-lg border border-[#dce8f4] px-3 py-1.5 text-xs font-semibold text-[#5a7794] hover:bg-[#f6f9fd]">{t("account.viewFull")} →</Link>
                            </div>
                          </div>

                          {/* Các mốc thời gian */}
                          <div className="rounded-xl border border-[#dce8f4] bg-white p-3">
                            <p className="mb-2 text-sm font-semibold text-[#1a3352]">🗓️ {t("detail.timeline")}</p>
                            <ul className="space-y-1 text-xs">
                              {r.s.deadlines.map((d, i) => {
                                const dl2 = daysLeft(d.date);
                                return (
                                  <li key={i} className="flex items-center justify-between gap-2">
                                    <span className="text-[#5a7794]">{d.type}</span>
                                    <span className="flex shrink-0 items-center gap-1.5">
                                      <span className="text-[#7591ab]">{d.date}</span>
                                      <span className={deadlineColor(dl2)}>({deadlineText(dl2, t)})</span>
                                      <a href={gcalUrl({ title: `[${d.type}] ${r.s.title}`, date: d.date, url: r.s.officialUrl })}
                                        target="_blank" rel="noopener noreferrer" title={t("calendar.addOne")}
                                        className="text-[#93a7bd] hover:text-[#2f6fe0]">📅</a>
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* Ghi chú */}
                          <div className="rounded-xl border border-[#dce8f4] bg-white p-3">
                            <p className="mb-1.5 text-sm font-semibold text-[#1a3352]">📝 {t("detail.note")}</p>
                            <textarea value={r.item.note} onChange={(e) => setNote(r.s.id, e.target.value)}
                              placeholder={t("detail.notePh")} rows={2}
                              className="w-full rounded-[10px] border border-[#cfe0f2] bg-white px-3 py-2 text-sm text-[#1a3352] outline-none focus:border-[#2f6fe0]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ===== TAB: LỊCH DEADLINE ===== */}
      {tab === "calendar" && (
        stats.total === 0 ? <EmptyState t={t} /> : <CalendarTab rows={rows} />
      )}

      {/* ===== TAB: HỖ TRỢ ===== */}
      {tab === "support" && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1a3352]">{t("account.supportTitle")}</h2>
            <p className="text-sm text-[#7591ab]">{t("account.supportDesc")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {advisors.map((a) => {
              const fits = a.regions.some((r) => profile.countries.includes(r));
              return (
                <div key={a.id} className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${fits ? "border-[#9cc1f5] ring-1 ring-[#dbe8f7]" : "border-[#dce8f4]"}`}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#f3f6fd] text-2xl">{a.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1a3352]">{a.name}</p>
                        {fits && <span className="rounded-full bg-[#eaf1fd] px-2 py-0.5 text-[10px] font-semibold text-[#1c5cc0]">★ {t("account.advisorMatch")}</span>}
                      </div>
                      <p className="text-xs text-[#7591ab]">{t(`advisorRole.${a.roleKey}`)}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[#7591ab]">
                        <span className="text-[#e0921a]">⭐ {a.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{t("account.sessions", { n: a.sessions })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    {a.regions.map((r) => <span key={r} title={t(`country.${r}`)}>{flagEmoji(r)}</span>)}
                    <span className="ml-1 text-[#93a7bd]">{t("account.speaks")}</span>
                    {a.langs.map((l) => <span key={l} className="rounded bg-[#eef3f9] px-1.5 py-0.5 text-[#5a7794]">{t(`teachLang.${l}`)}</span>)}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={`mailto:${a.email}?subject=${encodeURIComponent("[ScholarFinder] " + t("account.book"))}`}
                      className="flex-1 rounded-lg bg-[#2f6fe0] px-3 py-2 text-center text-xs font-bold text-white hover:brightness-105">
                      {t("account.book")}
                    </a>
                    <a href={`mailto:${a.email}`}
                      className="rounded-lg border border-[#dce8f4] px-3 py-2 text-center text-xs font-semibold text-[#5a7794] hover:bg-[#f6f9fd]">
                      {t("account.contactAdvisor")}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kênh hỗ trợ khác */}
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#7591ab]">{t("account.channelsTitle")}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Channel icon="✉️" title={t("account.channelEmail")} desc={t("account.channelEmailDesc")} href="mailto:support@scholarfinder.example" />
              <Channel icon="💬" title={t("account.channelCommunity")} desc={t("account.channelCommunityDesc")} href="#" />
              <Channel icon="❓" title={t("account.channelFaq")} desc={t("account.channelFaqDesc")} href="#" />
            </div>
          </div>

          <p className="rounded-xl bg-[#fdf3e0] p-3 text-xs text-[#a9670a]">⚠️ {t("account.supportDisclaimer")}</p>
        </div>
      )}

      <style jsx>{`
        .inp {
          width: 100%;
          border-radius: 0.625rem;
          border: 1px solid #cfe0f2;
          background: white;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: #1a3352;
          outline: none;
        }
        .inp:focus {
          border-color: #2f6fe0;
        }
      `}</style>
    </div>
  );
}

function EmptyState({ t }: { t: (k: string) => string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-[#cfe0f2] bg-white p-12 text-center">
      <div className="text-5xl">🗂️</div>
      <h2 className="mt-3 text-lg font-bold text-[#1a3352]">{t("account.emptyTitle")}</h2>
      <p className="mt-1 text-sm text-[#7591ab]">{t("account.emptyDesc")}</p>
      <Link href="/" className="mt-5 inline-block rounded-xl bg-[#2f6fe0] px-5 py-2.5 font-bold text-white hover:brightness-105">{t("account.goFind")}</Link>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string | number; tone: string }) {
  const chip: Record<string, string> = {
    indigo: "bg-[#eaf1fd] text-[#1c5cc0]",
    amber: "bg-[#fdf3e0] text-[#a9670a]",
    emerald: "bg-[#e9f8f0] text-[#0b7a52]",
    rose: "bg-[#fdecee] text-[#b23343]",
    violet: "bg-[#f2ecfe] text-[#7c3aed]",
    sky: "bg-[#e0f2fe] text-[#0369a1]",
  };
  return (
    <div className="rounded-[16px] border border-[#dce8f4] bg-white p-4 shadow-[0_1px_2px_rgba(23,50,76,0.04)] transition hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg ${chip[tone]}`}>{icon}</span>
        <p className="text-2xl font-extrabold leading-none text-[#1a3352]">{value}</p>
      </div>
      <p className="mt-2 text-xs leading-tight text-[#7591ab]">{label}</p>
    </div>
  );
}

// Biểu đồ thanh ngang gọn cho các phân bố (match/tài trợ/khu vực/loại)
function BarChart({ rows }: { rows: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-[#5a7794]" title={r.label}>{r.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eef3f9]">
            <div className={`h-full rounded-full transition-all ${r.color}`} style={{ width: `${Math.round((r.value / max) * 100)}%` }} />
          </div>
          <span className="w-6 text-right text-sm font-semibold text-[#455f78]">{r.value}</span>
        </div>
      ))}
      {total === 0 && <p className="text-xs text-[#93a7bd]">—</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#dce8f4] bg-white p-5">
      <h3 className="mb-3 font-semibold text-[#1a3352]">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-[#5a7794]">{label}</span>
      {children}
    </label>
  );
}

// ===== Tab Lịch: lịch tháng + xuất Google Calendar / .ics =====
interface CalRowScholarship {
  id: string;
  title: string;
  countryCode: string;
  officialUrl: string;
  deadlines: { type: string; date: string }[];
}

function CalendarTab({ rows }: { rows: { s: CalRowScholarship }[] }) {
  const { t } = useTranslation();
  const locale = i18n.language === "vi" ? "vi-VN" : "en-GB";

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  // Toàn bộ mốc của các học bổng đang theo dõi
  const events = useMemo(() => {
    const list: (CalEvent & { sId: string; type: string; countryCode: string })[] = [];
    rows.forEach(({ s }) => {
      s.deadlines.forEach((d) => {
        list.push({
          date: d.date,
          type: d.type,
          sId: s.id,
          countryCode: s.countryCode,
          title: `[${d.type}] ${s.title}`,
          description: `ScholarFinder · ${s.title}`,
          url: s.officialUrl,
        });
      });
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [rows]);

  const byDate = useMemo(() => {
    const m = new Map<string, typeof events>();
    events.forEach((e) => {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    });
    return m;
  }, [events]);

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  })();

  const y = month.getFullYear();
  const m0 = month.getMonth();
  const firstOffset = (new Date(y, m0, 1).getDay() + 6) % 7; // tuần bắt đầu Thứ 2
  const daysInMonth = new Date(y, m0 + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  // Nhãn thứ trong tuần (Mon→Sun)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 1 + i)) // 2024-01-01 là Thứ 2
  );

  const monthPrefix = `${y}-${pad2(m0 + 1)}`;
  const monthEvents = events.filter((e) => e.date.startsWith(monthPrefix));
  const shown = selected ? (byDate.get(selected) ?? []) : monthEvents;

  const dotColor = (dateStr: string) => {
    if (dateStr < todayStr) return "bg-[#93a7bd]";
    const days = daysLeft(dateStr);
    return days <= 7 ? "bg-[#d33a4a]" : "bg-[#e0921a]";
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3352]">📅 {t("calendar.title")}</h2>
          <p className="text-xs text-[#7591ab]">{t("calendar.subtitle")}</p>
        </div>
        <button
          onClick={() => downloadIcs("scholarfinder-deadlines", events)}
          className="rounded-lg bg-[#1a3352] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#22406a]"
          title={t("calendar.exportHint")}
        >
          ⬇ {t("calendar.exportAll")}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Lưới tháng */}
        <div className="rounded-2xl border border-[#dce8f4] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <button onClick={() => { setMonth(new Date(y, m0 - 1, 1)); setSelected(null); }}
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#cfe0f2] text-[#5a7794] hover:border-[#9cc1f5]">‹</button>
            <div className="flex items-center gap-2">
              <p className="font-bold capitalize text-[#1a3352]">{monthLabel}</p>
              <button onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setSelected(todayStr); }}
                className="rounded-full border border-[#cfe0f2] px-2 py-0.5 text-[11px] font-semibold text-[#7591ab] hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
                {t("calendar.today")}
              </button>
            </div>
            <button onClick={() => { setMonth(new Date(y, m0 + 1, 1)); setSelected(null); }}
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#cfe0f2] text-[#5a7794] hover:border-[#9cc1f5]">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-[#93a7bd]">
            {weekdays.map((w) => <span key={w} className="py-1">{w}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstOffset }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${monthPrefix}-${pad2(day)}`;
              const evs = byDate.get(dateStr) ?? [];
              const isToday = dateStr === todayStr;
              const isSel = dateStr === selected;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(isSel ? null : dateStr)}
                  className={`relative flex h-14 flex-col items-center rounded-lg pt-1.5 text-sm transition ${
                    isSel ? "bg-[#2f6fe0] text-white" : isToday ? "bg-[#eaf1fd] font-bold text-[#1c5cc0] ring-1 ring-[#9cc1f5]" : "text-[#455f78] hover:bg-[#f6f9fd]"
                  }`}
                >
                  {day}
                  {evs.length > 0 && (
                    <span className="mt-1 flex gap-0.5">
                      {evs.slice(0, 3).map((e, j) => (
                        <span key={j} className={`h-1.5 w-1.5 rounded-full ${isSel ? "bg-white" : dotColor(dateStr)}`} />
                      ))}
                      {evs.length > 3 && <span className={`text-[9px] leading-none ${isSel ? "text-white" : "text-[#93a7bd]"}`}>+</span>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-[#93a7bd]">ℹ️ {t("calendar.timeNote")}</p>
        </div>

        {/* Danh sách mốc */}
        <div className="rounded-2xl border border-[#dce8f4] bg-white p-4">
          <p className="mb-2 text-sm font-bold text-[#1a3352]">
            {selected ? t("calendar.eventsOn", { d: selected }) : t("calendar.monthEvents")}
            <span className="ml-1.5 rounded-full bg-[#eaf1fd] px-1.5 text-xs font-bold text-[#1c5cc0]">{shown.length}</span>
          </p>
          {shown.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#93a7bd]">{t("calendar.empty")}</p>
          ) : (
            <ul className="sf-scroll max-h-96 space-y-2 overflow-y-auto pr-1">
              {shown.map((e, i) => {
                const days = daysLeft(e.date);
                return (
                  <li key={i} className="rounded-xl border border-[#eef3f9] p-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#455f78]">{e.date}</span>
                      <span className={deadlineColor(days)}>{deadlineText(days, t)}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[#1c5cc0]">{e.type}</p>
                    <Link href={`/scholarships/${e.sId}`} className="mt-0.5 block truncate text-sm font-bold text-[#1a3352] hover:text-[#2f6fe0]">
                      {flagEmoji(e.countryCode)} {rows.find((r) => r.s.id === e.sId)?.s.title}
                    </Link>
                    <a href={gcalUrl(e)} target="_blank" rel="noopener noreferrer"
                      className="mt-1.5 inline-block rounded-md border border-[#cfe0f2] px-2 py-1 text-[11px] font-semibold text-[#5a7794] hover:border-[#9cc1f5] hover:text-[#2f6fe0]">
                      📅 {t("calendar.addOne")} · Google
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Channel({ icon, title, desc, href }: { icon: string; title: string; desc: string; href: string }) {
  return (
    <a href={href} className="flex items-start gap-3 rounded-xl border border-[#dce8f4] bg-white p-3 shadow-sm transition hover:border-[#9cc1f5] hover:shadow-md">
      <span className="text-xl">{icon}</span>
      <span>
        <span className="block text-sm font-semibold text-[#1a3352]">{title}</span>
        <span className="block text-xs text-[#7591ab]">{desc}</span>
      </span>
    </a>
  );
}
