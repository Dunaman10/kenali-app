"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Video, Gamepad2, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGameSound } from "@/lib/sound";

interface BentoFeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accent: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
  linkHref: string;
  linkLabel: string;
  metric?: string;
  colSpan?: string;
}

const features: BentoFeatureItem[] = [
  {
    id: "video-series",
    title: "3 Video Animasi Interaktif",
    tagline: "Pahami Batasan & Perubahan Diri",
    description:
      "Tonton petualangan visual tentang pubertas, batas sentuhan pribadi, hingga mengenali bujuk rayu dan manipulasi.",
    icon: Video,
    accent: {
      bg: "bg-teal-50/70",
      border: "border-teal-300",
      text: "text-teal-600",
      badgeBg: "bg-teal-100",
      badgeText: "text-teal-800",
    },
    linkHref: "/video/1",
    linkLabel: "Mulai Nonton Level 1",
    metric: "3 Episode Ringkas",
    colSpan: "sm:col-span-2 lg:col-span-1",
  },
  {
    id: "mini-games",
    title: "3 Mini Game Pengambil Keputusan",
    tagline: "Latih Refleks Batasanmu",
    description:
      "Mulai dari 'Kenali Batasanku', 'Radar Aman/Tidak', hingga simulasi chat 'Pilih Responmu' dengan feedback ramah.",
    icon: Gamepad2,
    accent: {
      bg: "bg-amber-50/70",
      border: "border-amber-300",
      text: "text-amber-600",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
    },
    linkHref: "/game/1",
    linkLabel: "Mainkan Game 1",
    metric: "Skor & Bintang XP",
    colSpan: "sm:col-span-2 lg:col-span-1",
  },
  {
    id: "screening-gad7",
    title: "Skrining Tingkat Kecemasan",
    tagline: "Cek Kondisi Hatimu Saat Ini",
    description:
      "Instrumen 7 pertanyaan terpandu (GAD-7) dengan informed consent transparan untuk mendeteksi kecemasan secara dini.",
    icon: ShieldCheck,
    accent: {
      bg: "bg-sky-50/70",
      border: "border-sky-300",
      text: "text-sky-600",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-800",
    },
    linkHref: "/skrining",
    linkLabel: "Mulai Skrining",
    metric: "Hasil Langsung & Rekomendasi",
    colSpan: "sm:col-span-1 lg:col-span-1",
  },
  {
    id: "diary-bk",
    title: "Buku Harian Privat & Layanan BK",
    tagline: "Ruang Curhat 100% Aman",
    description:
      "Tuliskan perasaanmu dalam Diary yang terkunci sandi untukmu sendiri, atau hubungi konselor Guru BK jika butuh teman bicara.",
    icon: HeartHandshake,
    accent: {
      bg: "bg-rose-50/70",
      border: "border-rose-300",
      text: "text-rose-600",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-800",
    },
    linkHref: "/diary",
    linkLabel: "Buka Diary Privat",
    metric: "Privasi Terjamin",
    colSpan: "sm:col-span-1 lg:col-span-1",
  },
];

export function BentoFeatures() {
  const { play } = useGameSound();

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="size-3.5" />
            Fitur Utama Aplikasi
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Semua yang Kamu Butuhkan untuk Belajar Aman
          </h2>
        </div>
        <p className="text-slate-500 font-medium text-sm sm:max-w-xs">
          Dirancang khusus untuk siswa SMP usia 13–15 tahun agar belajar lebih santai, seru, dan bermakna.
        </p>
      </div>

      {/* Bento Grid layout inspired by 21st.dev with tactile KENALI styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: idx * 0.08,
              }}
              whileHover={{ y: -3 }}
              className={`rounded-3xl bg-white border-2 border-slate-200 border-b-6 p-6 sm:p-7 flex flex-col justify-between transition-shadow hover:shadow-md relative overflow-hidden`}
            >
              {/* Background Tint */}
              <div
                className={`absolute top-0 right-0 w-36 h-36 ${item.accent.bg} rounded-full blur-2xl pointer-events-none -mr-8 -mt-8`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`size-12 rounded-2xl ${item.accent.bg} border-2 ${item.accent.border} flex items-center justify-center ${item.accent.text} shadow-xs`}
                  >
                    <Icon className="size-6" />
                  </div>
                  {item.metric && (
                    <span
                      className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${item.accent.badgeBg} ${item.accent.badgeText} border ${item.accent.border}`}
                    >
                      {item.metric}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {item.tagline}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-800 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                <Link
                  href={item.linkHref}
                  onClick={() => play("pop")}
                  className={`inline-flex items-center gap-2 font-display text-sm font-bold ${item.accent.text} group hover:underline`}
                >
                  <span>{item.linkLabel}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
