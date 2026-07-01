"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  scholarshipById,
  professorById,
  matchScore,
  nextDeadline,
  daysLeft,
  FUNDING_VI,
  LEVEL_VI,
  PROVIDER_TYPE_VI,
} from "@/lib/data";
import { useTrack, STAGES, StageId } from "@/lib/store";
import { flagEmoji, matchColor, matchBar, deadlineColor, deadlineText } from "@/lib/ui";

export default function ScholarshipDetail() {
  const params = useParams<{ id: string }>();
  const s = scholarshipById(params.id);
  const { profile, isTracked, toggleTrack, tracked, setStage, toggleChecklist, progress } = useTrack();

  if (!s) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Không tìm thấy học bổng.</p>
        <Link href="/" className="mt-4 inline-block text-indigo-600 underline">← Về trang tìm kiếm</Link>
      </div>
    );
  }

  const match = matchScore(profile, s);
  const dl = nextDeadline(s);
  const days = dl ? daysLeft(dl.date) : 0;
  const item = tracked[s.id];
  const isT = isTracked(s.id);
  const profs = s.professorIds.map((id) => professorById(id)).filter(Boolean);
  const prog = progress(s.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">← Danh sách học bổng</Link>

      {/* Header */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="text-lg">{flagEmoji(s.countryCode)}</span>
              <span>{s.country}</span><span>·</span>
              <span>{s.university} · QS #{s.qsRank}</span><span>·</span>
              <span>{PROVIDER_TYPE_VI[s.providerType]}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{s.title}</h1>
            <p className="mt-1 text-sm text-slate-600">Nhà tài trợ: {s.provider}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">{FUNDING_VI[s.fundingLevel]}</Badge>
              {s.levels.map((l) => <Badge key={l} className="bg-slate-100 text-slate-600 ring-slate-200">{LEVEL_VI[l]}</Badge>)}
              <Badge className="bg-sky-50 text-sky-700 ring-sky-200">{s.language}</Badge>
              {s.requiresSupervisor && <Badge className="bg-violet-50 text-violet-700 ring-violet-200">Cần giáo sư</Badge>}
              {s.requiresProposal && <Badge className="bg-amber-50 text-amber-700 ring-amber-200">Cần Research Proposal</Badge>}
              {s.tags.map((t) => <Badge key={t} className="bg-slate-50 text-slate-500 ring-slate-200">{t}</Badge>)}
            </div>
          </div>
          <div className={`shrink-0 rounded-xl border p-3 text-center ${matchColor(match.score)}`}>
            <div className="text-3xl font-bold leading-none">{match.score}%</div>
            <div className="text-xs">{match.label}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Cột chính */}
        <div className="space-y-6">
          <Section title="Tổng quan">
            <p className="text-sm leading-relaxed text-slate-700">{s.summary}</p>
          </Section>

          <Section title="Mức độ phù hợp với hồ sơ của bạn">
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${matchBar(match.score)}`} style={{ width: `${match.score}%` }} />
            </div>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {match.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span>{r.status === "ok" ? "✅" : r.status === "warn" ? "⚠️" : "❌"}</span>
                  <span className={r.status === "fail" ? "text-rose-700" : r.status === "warn" ? "text-amber-700" : "text-slate-700"}>{r.label}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Quyền lợi học bổng">
            <ul className="grid gap-2 sm:grid-cols-2">
              {s.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500">◆</span>{b}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Điều kiện dự tuyển">
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact label="GPA tối thiểu" value={`${s.eligibility.minGpa.toFixed(1)} / 4.0`} />
              <Fact label="Ngoại ngữ" value={`IELTS ≥ ${s.eligibility.minIelts.toFixed(1)}`} />
              <Fact label="Chuẩn hóa (GRE/GMAT)" value={s.eligibility.gre ? "Có thể yêu cầu" : "Không yêu cầu"} />
              <Fact label="Nhận ứng viên VN" value={s.eligibility.allowVN ? "Có" : "Không"} />
              <Fact label="Ngành/lĩnh vực" value={s.fields.join(", ")} />
              <Fact label="Kỳ nhập học" value={s.intake} />
            </div>
          </Section>

          <Section title="Kỳ nhập học & các mốc thời gian">
            <ol className="relative ml-3 border-l-2 border-slate-200">
              {s.deadlines.map((d, i) => {
                const dleft = daysLeft(d.date);
                return (
                  <li key={i} className="mb-4 ml-4">
                    <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-indigo-500" />
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-medium text-slate-800">{d.type}</span>
                      <span className="text-sm text-slate-500">{d.date}</span>
                      <span className={`text-xs ${deadlineColor(dleft)}`}>({deadlineText(dleft)})</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          {s.requiresSupervisor && (
            <Section title="Giáo sư hướng dẫn tiềm năng">
              <p className="mb-3 text-sm text-slate-600">
                Học bổng này yêu cầu/khuyến khích liên hệ giáo sư trước khi nộp. Dưới đây là giáo sư phù hợp hướng nghiên cứu:
              </p>
              {profs.length === 0 ? (
                <p className="text-sm text-slate-400">Chưa có dữ liệu giáo sư mẫu cho học bổng này.</p>
              ) : (
                <div className="grid gap-3">
                  {profs.map((p) => p && (
                    <Link key={p.id} href={`/professors/${p.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-violet-400 hover:bg-violet-50/40">
                      <div>
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.university} · {p.keywords.slice(0, 3).join(", ")}</p>
                      </div>
                      <div className="text-right">
                        {p.recruiting === "recruiting" && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Đang tuyển NCS</span>}
                        <p className="mt-1 text-xs text-violet-600">Xem hồ sơ →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Section>
          )}

          <Section title="Checklist chuẩn bị hồ sơ">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${prog}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{prog}%</span>
            </div>
            {!isT && <p className="mb-2 text-xs text-amber-600">Bấm “Theo dõi học bổng” để lưu tiến độ checklist.</p>}
            <ul className="space-y-1.5">
              {s.documents.map((d) => (
                <li key={d}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-lg p-2 text-sm hover:bg-slate-50">
                    <input type="checkbox" checked={!!item?.checklist[d]} onChange={() => toggleChecklist(s.id, d)} className="mt-0.5 h-4 w-4 accent-indigo-600" />
                    <span className={item?.checklist[d] ? "text-slate-400 line-through" : "text-slate-700"}>{d}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700">
              💡 <b>Trợ lý viết hồ sơ (E18):</b> các mục như CV, SOP/Motivation Letter, Research Proposal, thư giới thiệu sẽ có template &amp; hướng dẫn để bạn “đọc là làm theo”. (Minh họa trong demo)
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <button
              onClick={() => toggleTrack(s.id)}
              className={`w-full rounded-lg px-4 py-2.5 font-medium transition ${
                isT ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isT ? "✓ Đang theo dõi" : "+ Theo dõi học bổng"}
            </button>

            {isT && (
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-slate-500">Trạng thái ứng tuyển</label>
                <select
                  value={item?.stage ?? "quan_tam"}
                  onChange={(e) => setStage(s.id, e.target.value as StageId)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {STAGES.map((st) => <option key={st.id} value={st.id}>{st.label}</option>)}
                </select>
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-4">
              {dl && (
                <>
                  <p className="text-xs text-slate-500">{dl.type}</p>
                  <p className="text-lg font-bold text-slate-900">{dl.date}</p>
                  <p className={`text-sm ${deadlineColor(days)}`}>{deadlineText(days)}</p>
                </>
              )}
            </div>

            <a href={s.officialUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 block rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
              🔗 Tới nguồn chính thức
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Độ tin cậy nguồn</span>
              <span className="font-semibold text-emerald-600">{s.trustScore}/100</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Cập nhật lần cuối</span><span>{s.lastVerified}</span>
            </div>
            <p className="mt-3 rounded bg-amber-50 p-2 text-amber-700">
              ⚠️ Thông tin mang tính tham khảo (demo). Luôn kiểm tra tại nguồn chính thức trước khi nộp.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${className}`}>{children}</span>;
}
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
