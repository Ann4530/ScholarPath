"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { professorById, scholarshipById } from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";

const RECRUITING_CLS: Record<string, string> = {
  recruiting: "bg-emerald-100 text-emerald-700",
  unknown: "bg-slate-100 text-slate-600",
  not_recruiting: "bg-rose-100 text-rose-700",
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
        <p className="text-slate-500">{t("profDetail.notFound")}</p>
        <Link href="/professors" className="mt-4 inline-block text-indigo-600 underline">← {t("profDetail.back")}</Link>
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
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link href="/professors" className="text-sm text-slate-500 hover:text-indigo-600">← {t("profDetail.back")}</Link>

      {/* Header */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
            <p className="mt-1 text-slate-600">{p.title}</p>
            <p className="mt-1 text-sm text-slate-500">
              {flagEmoji(p.countryCode)} {p.university} · {p.department}
            </p>
            <p className="text-sm text-slate-500">{t("profDetail.lab")} {p.lab}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${RECRUITING_CLS[p.recruiting]}`}>{t(RECRUITING_KEY[p.recruiting])}</span>
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

          <Card title={t("profDetail.featuredPubs")}>
            <ul className="space-y-2">
              {p.publications.map((pub, i) => (
                <li key={i} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <p className="font-medium text-slate-800">{pub.title}</p>
                  <p className="text-xs text-slate-500">{pub.venue} · {pub.year}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={t("profDetail.outreach")}>
            <p className="mb-2 text-sm text-slate-600">{t("profDetail.outreachDesc")}</p>
            <pre className="thin-scroll max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{emailTemplate}</pre>
            <button onClick={copy} className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              {copied ? t("profDetail.copied") : t("profDetail.copy")}
            </button>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li>✓ {t("profDetail.tip1")}</li>
              <li>✓ {t("profDetail.tip2")}</li>
              <li>✓ {t("profDetail.tip3")}</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <Card title={t("profDetail.contact")}>
            <div className="space-y-2 text-sm">
              <LinkRow label={t("profDetail.email")} value={p.email} href={`mailto:${p.email}`} />
              <LinkRow label={t("profDetail.website")} value={t("profDetail.websiteVal")} href={p.website} />
              <LinkRow label="Google Scholar" value={t("profDetail.scholarVal")} href={p.scholar} />
              <LinkRow label="ORCID" value={p.orcid} href={`https://orcid.org/${p.orcid}`} />
            </div>
            <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-700">
              ⚠️ {t("profDetail.warn")}
            </p>
          </Card>

          {related.length > 0 && (
            <Card title={t("profDetail.applicable")}>
              <div className="space-y-2">
                {related.map((s) => s && (
                  <Link key={s.id} href={`/scholarships/${s.id}`}
                    className="block rounded-lg border border-slate-200 p-3 text-sm hover:border-indigo-400 hover:bg-indigo-50/40">
                    <p className="font-medium text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-500">{flagEmoji(s.countryCode)} {t(`country.${s.countryCode}`)}</p>
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
