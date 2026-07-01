"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { professorById, scholarshipById } from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";

const RECRUITING_VI: Record<string, { label: string; cls: string }> = {
  recruiting: { label: "Đang tuyển nghiên cứu sinh", cls: "bg-emerald-100 text-emerald-700" },
  unknown: { label: "Chưa rõ tình trạng tuyển", cls: "bg-slate-100 text-slate-600" },
  not_recruiting: { label: "Hiện không tuyển", cls: "bg-rose-100 text-rose-700" },
};

export default function ProfessorDetail() {
  const params = useParams<{ id: string }>();
  const p = professorById(params.id);
  const { profile } = useTrack();
  const [copied, setCopied] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Không tìm thấy giáo sư.</p>
        <Link href="/" className="mt-4 inline-block text-indigo-600 underline">← Về trang tìm kiếm</Link>
      </div>
    );
  }

  const rec = RECRUITING_VI[p.recruiting];
  const related = p.scholarshipIds.map((id) => scholarshipById(id)).filter(Boolean);

  const emailTemplate = `Chủ đề: Prospective ${profile.level} applicant interested in your research on ${p.keywords[0]}

Kính gửi ${p.name},

Em là [Tên của bạn], hiện [nền tảng học vấn/ngành]. Em đặc biệt quan tâm tới hướng nghiên cứu ${p.keywords.slice(0, 2).join(" và ")} của thầy/cô, đặc biệt là công trình "${p.publications[0]?.title}" (${p.publications[0]?.year}).

Em dự định ứng tuyển tại ${p.university} và mong muốn được thầy/cô cân nhắc hướng dẫn. Nền tảng của em phù hợp vì [1-2 lý do cụ thể: kỹ năng, dự án, điểm số].

Em xin đính kèm CV và [đề cương nghiên cứu/bảng điểm]. Không biết thầy/cô có nhận nghiên cứu sinh cho kỳ tới không ạ? Em rất mong có cơ hội trao đổi thêm.

Trân trọng cảm ơn,
[Tên của bạn] — [email] — [link CV/hồ sơ]`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emailTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">← Trang tìm kiếm</Link>

      {/* Header */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
            <p className="mt-1 text-slate-600">{p.title}</p>
            <p className="mt-1 text-sm text-slate-500">
              {flagEmoji(p.countryCode)} {p.university} · {p.department}
            </p>
            <p className="text-sm text-slate-500">Phòng thí nghiệm: {p.lab}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${rec.cls}`}>{rec.label}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Metric label="Công bố" value={p.metrics.publications} />
          <Metric label="Trích dẫn" value={p.metrics.citations.toLocaleString()} />
          <Metric label="h-index" value={p.metrics.hIndex} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title="Hướng nghiên cứu">
            <p className="text-sm text-slate-700">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.keywords.map((k) => (
                <span key={k} className="rounded-full bg-violet-50 px-3 py-1 text-xs text-violet-700 ring-1 ring-violet-200">{k}</span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.fields.map((f) => (
                <span key={f} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{f}</span>
              ))}
            </div>
          </Card>

          <Card title="Công bố tiêu biểu">
            <ul className="space-y-2">
              {p.publications.map((pub, i) => (
                <li key={i} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <p className="font-medium text-slate-800">{pub.title}</p>
                  <p className="text-xs text-slate-500">{pub.venue} · {pub.year}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Trợ lý liên hệ giáo sư (Outreach Helper)">
            <p className="mb-2 text-sm text-slate-600">
              Mẫu email đã cá nhân hóa theo hướng nghiên cứu &amp; hồ sơ của bạn. Hãy đọc kỹ 1–2 công bố của giáo sư và điền phần trong [ngoặc] trước khi gửi.
            </p>
            <pre className="thin-scroll max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{emailTemplate}</pre>
            <button onClick={copy} className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              {copied ? "✓ Đã sao chép" : "📋 Sao chép mẫu email"}
            </button>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li>✓ Đã tham chiếu công bố cụ thể của giáo sư</li>
              <li>✓ Nêu rõ lý do phù hợp &amp; đính kèm CV</li>
              <li>✓ Gửi từ email cá nhân của bạn (hệ thống không gửi hàng loạt — chống spam)</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <Card title="Liên hệ & hồ sơ">
            <div className="space-y-2 text-sm">
              <LinkRow label="Email" value={p.email} href={`mailto:${p.email}`} />
              <LinkRow label="Website / Lab" value="Trang nhóm nghiên cứu" href={p.website} />
              <LinkRow label="Google Scholar" value="Hồ sơ Scholar" href={p.scholar} />
              <LinkRow label="ORCID" value={p.orcid} href={`https://orcid.org/${p.orcid}`} />
            </div>
            <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-700">
              ⚠️ Thông tin nghề nghiệp công khai (demo). Liên hệ có trách nhiệm, không gửi hàng loạt.
            </p>
          </Card>

          {related.length > 0 && (
            <Card title="Học bổng có thể áp dụng">
              <div className="space-y-2">
                {related.map((s) => s && (
                  <Link key={s.id} href={`/scholarships/${s.id}`}
                    className="block rounded-lg border border-slate-200 p-3 text-sm hover:border-indigo-400 hover:bg-indigo-50/40">
                    <p className="font-medium text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-500">{flagEmoji(s.countryCode)} {s.country}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
function LinkRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="truncate text-indigo-600 hover:underline">{value}</a>
    </div>
  );
}
