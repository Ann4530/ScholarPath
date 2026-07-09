"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { professorById, scholarshipById } from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";

const RECRUITING_CLS: Record<string, string> = {
  recruiting: "bg-[#e9f8f0] text-[#0b7a52]",
  unknown: "bg-[#f1f5f9] text-[#475569]",
  not_recruiting: "bg-[#fdecee] text-[#b23343]",
};
const RECRUITING_KEY: Record<string, string> = {
  recruiting: "profDetail.recruiting",
  unknown: "profDetail.unknown",
  not_recruiting: "profDetail.notRecruiting",
};

export default function ProfessorDetail() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const p = professorById(params.id);
  const { profile } = useTrack();
  const [copied, setCopied] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-[#5a7794]">{t("profDetail.notFound")}</p>
        <Link href="/professors" className="mt-4 inline-block text-[#2f6fe0] underline">← {t("profDetail.back")}</Link>
      </div>
    );
  }

  const related = p.scholarshipIds.map((id) => scholarshipById(id)).filter(Boolean);

  const emailTemplate = t("profDetail.emailTpl", {
    level: profile.level,
    kw: p.keywords[0],
    kws: p.keywords.slice(0, 2).join(t("common.and")),
    name: p.name,
    pub: p.publications[0]?.title,
    pubYear: p.publications[0]?.year,
    uni: p.university,
  });

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
    <div className="mx-auto max-w-[1000px] px-6 py-6">
      <Link href="/professors" className="flex w-fit items-center gap-1.5 py-1.5 text-[13.5px] font-semibold text-[#5a7794] hover:text-[#2f6fe0]">← {t("profDetail.back")}</Link>

      {/* Header */}
      <div className="mt-2.5 rounded-[20px] border border-[#e2e8f4] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[25px] font-extrabold tracking-tight text-[#12345c]">{p.name}</h1>
            <p className="mt-1 text-[#5a7794]">{t(`rank.${p.rank}`)}</p>
            <p className="mt-1 text-sm text-[#7591ab]">
              {flagEmoji(p.countryCode)} {p.university} · {p.department}
            </p>
            <p className="text-sm text-[#7591ab]">{t("profDetail.lab")} {p.lab}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RECRUITING_CLS[p.recruiting]}`}>{t(RECRUITING_KEY[p.recruiting])}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Metric label={t("professors.pubs")} value={p.metrics.publications} />
          {/* Locale cố định để server/client render giống nhau (tránh hydration mismatch) */}
          <Metric label={t("professors.cites")} value={p.metrics.citations.toLocaleString("en-US")} />
          <Metric label={t("professors.hIndex")} value={p.metrics.hIndex} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title={t("profDetail.research")}>
            <p className="text-sm text-[#455f78]">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.keywords.map((k) => (
                <span key={k} className="rounded-full bg-[#eef1fd] px-3 py-1 text-xs font-semibold text-[#4f46e5] ring-1 ring-[#dbe0fb]">{k}</span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.fields.map((f) => (
                <span key={f} className="rounded-md bg-[#eef3f9] px-2 py-0.5 text-xs text-[#5a7794]">{f}</span>
              ))}
            </div>
          </Card>

          <Card title={t("profDetail.featuredPubs")}>
            <ul className="space-y-2">
              {p.publications.map((pub, i) => (
                <li key={i} className="rounded-lg border border-[#eef3f9] p-3 text-sm">
                  <p className="font-bold text-[#1a3352]">{pub.title}</p>
                  <p className="text-xs text-[#7591ab]">{pub.venue} · {pub.year}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={t("profDetail.outreach")}>
            <p className="mb-2 text-sm text-[#7591ab]">{t("profDetail.outreachDesc")}</p>
            <pre className="sf-scroll max-h-72 overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#161d33] p-4 text-xs leading-relaxed text-[#e6eaf6]">{emailTemplate}</pre>
            <button onClick={copy} className="mt-2 rounded-[10px] bg-[#4f46e5] px-4 py-2 text-sm font-bold text-white hover:brightness-110">
              {copied ? t("profDetail.copied") : t("profDetail.copy")}
            </button>
            <ul className="mt-3 space-y-1 text-xs text-[#7591ab]">
              <li>✓ {t("profDetail.tip1")}</li>
              <li>✓ {t("profDetail.tip2")}</li>
              <li>✓ {t("profDetail.tip3")}</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[82px] lg:h-fit">
          <Card title={t("profDetail.contact")}>
            <div className="space-y-2 text-sm">
              <LinkRow label={t("profDetail.email")} value={p.email} href={`mailto:${p.email}`} />
              <LinkRow label={t("profDetail.website")} value={t("profDetail.websiteVal")} href={p.website} />
              <LinkRow label="Google Scholar" value={t("profDetail.scholarVal")} href={p.scholar} />
              <LinkRow label="ORCID" value={p.orcid} href={`https://orcid.org/${p.orcid}`} />
            </div>
            <p className="mt-3 rounded-lg bg-[#fdf3e0] p-2.5 text-xs text-[#a9670a]">
              ⚠️ {t("profDetail.warn")}
            </p>
          </Card>

          {related.length > 0 && (
            <Card title={t("profDetail.applicable")}>
              <div className="space-y-2">
                {related.map((s) => s && (
                  <Link key={s.id} href={`/scholarships/${s.id}`}
                    className="block rounded-xl border border-[#e6eef6] bg-[#f6f9fd] p-3 text-sm hover:border-[#9cc1f5]">
                    <p className="font-bold text-[#1a3352]">{s.title}</p>
                    <p className="text-xs text-[#7591ab]">{flagEmoji(s.countryCode)} {t(`country.${s.countryCode}`)}</p>
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
    <section className="rounded-[16px] border border-[#e2e8f4] bg-white p-5">
      <h2 className="mb-3 text-[15px] font-extrabold text-[#1a3352]">{title}</h2>
      {children}
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[11px] bg-[#f3f6fd] p-3 text-center">
      <p className="text-xl font-extrabold text-[#1a3352]">{value}</p>
      <p className="text-xs text-[#7591ab]">{label}</p>
    </div>
  );
}
function LinkRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#7591ab]">{label}</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="truncate font-semibold text-[#4f46e5] hover:underline">{value}</a>
    </div>
  );
}
