"use client";

// Trang chủ CÔNG KHAI (landing): giới thiệu sản phẩm cho khách chưa đăng nhập.
// Không bắt buộc đăng nhập để xem. Từ đây bấm "Bắt đầu" (cá nhân hóa qua wizard)
// hoặc "Đăng nhập/Đăng ký", hoặc xem toàn bộ học bổng.

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Search, LogIn, ArrowRight, Target, GraduationCap,
  CalendarClock, KanbanSquare, Globe2, BookOpen, ShieldCheck,
} from "lucide-react";
import { scholarships, COUNTRIES, FIELDS } from "@/lib/data";
import HeroSky from "@/components/HeroSky";

export default function LandingPage() {
  const { t } = useTranslation();

  const countryCount = new Set(scholarships.map((s) => s.countryCode)).size;
  const stats = [
    { icon: <GraduationCap className="h-5 w-5" />, value: `${scholarships.length}+`, label: t("landing.statScholarships") },
    { icon: <Globe2 className="h-5 w-5" />, value: `${countryCount}`, label: t("landing.statCountries") },
    { icon: <BookOpen className="h-5 w-5" />, value: `${FIELDS.length}`, label: t("landing.statFields") },
    { icon: <ShieldCheck className="h-5 w-5" />, value: t("landing.statFreeValue"), label: t("landing.statFree") },
  ];

  const features = [
    { icon: <Target className="h-[22px] w-[22px]" />, title: t("landing.f1Title"), desc: t("landing.f1Desc") },
    { icon: <GraduationCap className="h-[22px] w-[22px]" />, title: t("landing.f2Title"), desc: t("landing.f2Desc") },
    { icon: <KanbanSquare className="h-[22px] w-[22px]" />, title: t("landing.f3Title"), desc: t("landing.f3Desc") },
    { icon: <CalendarClock className="h-[22px] w-[22px]" />, title: t("landing.f4Title"), desc: t("landing.f4Desc") },
  ];

  const steps = [
    { n: "1", title: t("landing.step1Title"), desc: t("landing.step1Desc") },
    { n: "2", title: t("landing.step2Title"), desc: t("landing.step2Desc") },
    { n: "3", title: t("landing.step3Title"), desc: t("landing.step3Desc") },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20">
      {/* ============ HERO ============ */}
      <section className="pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#0a1230_0%,#152159_52%,#243a86_100%)] px-8 py-14 sm:px-12 sm:py-20">
          <div className="starfield pointer-events-none absolute inset-0" />
          <div className="animate-twinkle pointer-events-none absolute left-[20%] top-10 h-1 w-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" />
          <div className="animate-twinkle pointer-events-none absolute left-[60%] top-[80px] h-[3px] w-[3px] rounded-full bg-[#cfe0ff] shadow-[0_0_7px_2px_rgba(160,200,255,0.7)] [animation-delay:0.6s]" />
          <div className="animate-twinkle pointer-events-none absolute left-[82%] top-16 h-1 w-1 rounded-full bg-[#ffe9a8] shadow-[0_0_9px_2px_rgba(255,220,140,0.7)] [animation-delay:0.3s]" />
          <HeroSky id="landing" progress={78} />

          <div className="relative max-w-[640px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#cfe0ff]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("landing.badge")}
            </div>
            <h1 className="mt-5 text-[36px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[48px]">
              {t("landing.heroTitle")} <span className="text-[#a5cbff]">{t("landing.heroTitleHl")}</span>
            </h1>
            <p className="mt-4 max-w-[540px] text-[16px] leading-relaxed text-white/75">
              {t("landing.heroDesc")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/start"
                className="flex items-center gap-2.5 rounded-[14px] bg-gradient-to-br from-[#3b82f6] to-[#5aa2ff] px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_18px_38px_-14px_rgba(59,130,246,0.95)] transition hover:brightness-110"
              >
                <Sparkles className="h-[18px] w-[18px]" />
                {t("landing.startCta")}
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-[14px] border border-white/25 bg-white/10 px-5 py-3.5 text-[14.5px] font-bold text-white transition hover:bg-white/20"
              >
                <LogIn className="h-[17px] w-[17px]" />
                {t("landing.loginCta")}
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 px-2 py-3.5 text-[14.5px] font-bold text-[#cfe0ff] transition hover:text-white"
              >
                <Search className="h-[17px] w-[17px]" />
                {t("landing.browseCta")}
              </Link>
            </div>

            <p className="mt-5 text-[12.5px] text-white/55">{t("landing.heroNote")}</p>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="-mt-6 relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-[18px] border border-[#d9e6f3] bg-white px-4 py-4 shadow-[0_10px_30px_-18px_rgba(23,50,76,0.35)]">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#eaf1fd] text-[#2f6fe0]">{s.icon}</span>
            <p className="mt-2.5 text-[22px] font-extrabold text-[#1a3352]">{s.value}</p>
            <p className="text-[12.5px] font-medium text-[#5a7794]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mt-16">
        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="text-[28px] font-extrabold tracking-tight text-[#1a3352] sm:text-[32px]">{t("landing.featTitle")}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5a7794]">{t("landing.featDesc")}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="rounded-[20px] border border-[#dce8f4] bg-white p-6 shadow-[0_1px_2px_rgba(23,50,76,0.04)] transition hover:shadow-[0_18px_40px_-22px_rgba(23,50,76,0.4)]">
              <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-[0_10px_22px_-10px_rgba(30,58,138,0.7)]">
                {f.icon}
              </span>
              <h3 className="mt-4 text-[16px] font-extrabold text-[#1a3352]">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5a7794]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="mt-16 rounded-[24px] border border-[#dce8f4] bg-white p-8 sm:p-10">
        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="text-[26px] font-extrabold tracking-tight text-[#1a3352] sm:text-[30px]">{t("landing.howTitle")}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5a7794]">{t("landing.howDesc")}</p>
        </div>
        <div className="mt-9 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eaf1fd] text-[22px] font-extrabold text-[#2f6fe0] ring-4 ring-[#f2f7fd]">
                {s.n}
              </span>
              <h3 className="mt-4 text-[16px] font-extrabold text-[#1a3352]">{s.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5a7794]">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute right-[-14px] top-4 hidden h-5 w-5 text-[#c4d6ee] sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(120deg,#12225f_0%,#2450b8_100%)] px-8 py-12 text-center sm:px-12 sm:py-14">
          <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative mx-auto max-w-[560px]">
            <h2 className="text-[26px] font-extrabold tracking-tight text-white sm:text-[32px]">{t("landing.ctaTitle")}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">{t("landing.ctaDesc")}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/start"
                className="flex items-center gap-2.5 rounded-[14px] bg-white px-6 py-3.5 text-[15px] font-extrabold text-[#1e3a8a] shadow-[0_18px_38px_-16px_rgba(0,0,0,0.6)] transition hover:brightness-95"
              >
                <Sparkles className="h-[18px] w-[18px]" />
                {t("landing.startCta")}
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-[14px] border border-white/30 bg-white/10 px-5 py-3.5 text-[14.5px] font-bold text-white transition hover:bg-white/20"
              >
                <LogIn className="h-[17px] w-[17px]" />
                {t("landing.loginCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
