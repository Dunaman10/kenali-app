"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Microscope,
  KeyRound,
  Gamepad2,
  Lock,
  Compass,
  Star,
  CheckCircle2,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import { BentoFeatures } from "@/components/ui/bento-features";
import { useGameSound } from "@/lib/sound";

export default function Home() {
  const { play, muted, toggleMute } = useGameSound();

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col justify-between font-sans select-none">
      {/* -------------------------------------------------------------------------- */}
      {/* TOP NAVBAR                                                                 */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <Link
            href="/"
            onClick={() => play("pop")}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
          >
            <span className="size-9 sm:size-10 rounded-2xl bg-teal-500 border-2 border-b-3 sm:border-b-4 border-teal-700 flex items-center justify-center text-white font-display text-lg sm:text-xl font-bold shadow-xs transition-transform group-hover:scale-105 active:scale-95 shrink-0">
              K
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-teal-900 leading-none">
                  KENALI
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-teal-100/90 text-teal-800 border border-teal-300/80 leading-none shrink-0">
                  Resmi
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-none mt-1 truncate">
                SMP Al-Falah Rempoa
              </p>
            </div>
          </Link>

          {/* Quick Nav / Audio Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={toggleMute}
              className="size-9 rounded-xl border-2 border-b-3 border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 active:border-b-2 active:translate-y-[1px] transition-all flex items-center justify-center shrink-0 shadow-2xs"
              title={muted ? "Nyalakan Suara" : "Matikan Suara"}
              aria-label="Sound Toggle"
            >
              {muted ? (
                <VolumeX className="size-4 text-rose-500" />
              ) : (
                <Volume2 className="size-4 text-teal-600" />
              )}
            </button>

            <Link
              href="/login"
              onClick={() => play("pop")}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 h-9 rounded-xl border-2 border-b-3 border-teal-700 bg-teal-500 text-white font-display text-xs sm:text-sm font-bold active:border-b-2 active:translate-y-[1px] transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <KeyRound className="size-3.5 sm:size-4" />
              <span className="hidden xs:inline">Masuk Akun</span>
              <span className="xs:hidden">Masuk</span>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/* MAIN CONTENT                                                               */}
      {/* -------------------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-12 space-y-12 sm:space-y-16 flex-1">
        {/* ========================================================================= */}
        {/* BAGIAN 1: HERO SECTION KUAT & MENJELASKAN TUJUAN                          */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-br from-white via-[#FFFDF7] to-teal-50/40 rounded-3xl p-5 sm:p-10 border-2 border-slate-200 border-b-6 sm:border-b-8 shadow-sm relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Heading, Purpose Paragraph, and CTAs */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] sm:text-xs font-semibold text-teal-900">
                <span className="size-2 rounded-full bg-teal-500 shrink-0" />
                <span className="whitespace-nowrap">SMP Al-Falah Rempoa &bull; Edukasi Remaja</span>
              </div>

              <h1 className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-[1.2] sm:leading-[1.16] tracking-tight">
                Kenali Dirimu, <br />
                <span className="text-teal-600">Jaga Batasanmu,</span> <br />
                <span className="text-amber-500">Berani Bersuara!</span>
              </h1>

              <p className="text-slate-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance">
                <strong>KENALI</strong> adalah ruang belajar interaktif berbasis video animasi dan mini game
                untuk membantu teman-teman usia 13–15 tahun memahami perubahan tubuh saat pubertas,
                mengenali bujuk rayu atau manipulasi, serta mencegah kekerasan seksual dengan cara yang aman,
                sopan, dan menyenangkan.
              </p>

              {/* Action Buttons - Compact, single line, no awkward wrapping */}
              <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center justify-center lg:justify-start gap-3 w-full">
                <Link href="/dashboard/siswa" onClick={() => play("fanfare")} className="w-full xs:w-auto">
                  <PushableButton
                    variant="teal"
                    size="md"
                    fullWidth
                    icon={<Compass className="size-4" />}
                  >
                    Mulai Belajar
                  </PushableButton>
                </Link>

                <Link href="/login" onClick={() => play("pop")} className="w-full xs:w-auto">
                  <PushableButton
                    variant="white"
                    size="md"
                    fullWidth
                    icon={<HeartHandshake className="size-4 text-amber-600" />}
                  >
                    Portal Guru &amp; Tim
                  </PushableButton>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-teal-700">
                  <ShieldCheck className="size-4 text-teal-600" />
                  100% Ramah Lingkungan Sekolah
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Lock className="size-4 text-slate-400" />
                  Privasi Diary Terkunci Rapat
                </span>
              </div>
            </div>

            {/* Right Column: Friendly Mascot & Gamified Aesthetic Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Cheerful Speech Bubble */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="mb-3 bg-white text-slate-800 rounded-2xl border-2 border-b-4 border-teal-300 px-3.5 py-2.5 max-w-[240px] shadow-md text-center relative"
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
                <p className="font-display text-xs font-bold text-teal-800">
                  Halo, Sobat KENALI! 👋
                </p>
                <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-snug">
                  Yuk kenali batasan dirimu dengan seru dan aman!
                </p>
              </motion.div>

              {/* Big Mascot SVG Illustration */}
              <div className="size-36 sm:size-44 relative drop-shadow-[0_10px_0_rgba(15,118,110,0.18)] hover:scale-105 transition-transform cursor-pointer">
                <svg viewBox="0 0 120 120" className="size-full">
                  {/* Sprout */}
                  <g style={{ transformOrigin: "60px 26px" }}>
                    <path d="M60 28 V16" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" />
                    <path
                      d="M60 18 C52 8 42 12 44 18 C48 22 56 21 60 18 Z"
                      fill="#34D399"
                      stroke="#047857"
                      strokeWidth="2"
                    />
                    <path
                      d="M60 16 C67 5 78 9 76 15 C72 20 64 19 60 16 Z"
                      fill="#6EE7B7"
                      stroke="#047857"
                      strokeWidth="2"
                    />
                  </g>
                  {/* Arms cheering */}
                  <path
                    d="M24 72 Q14 66 16 56"
                    stroke="#0F766E"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M96 72 Q106 66 104 56"
                    stroke="#0F766E"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Body */}
                  <rect x="22" y="28" width="76" height="80" rx="38" fill="#0F766E" />
                  <rect x="22" y="26" width="76" height="78" rx="38" fill="#14B8A6" />
                  <ellipse cx="60" cy="82" rx="24" ry="17" fill="#CCFBF1" opacity="0.9" />
                  {/* Eyes */}
                  <ellipse cx="46" cy="55" rx="7" ry="8" fill="#fff" />
                  <ellipse cx="74" cy="55" rx="7" ry="8" fill="#fff" />
                  <circle cx="47" cy="56" r="4" fill="#1E293B" />
                  <circle cx="75" cy="56" r="4" fill="#1E293B" />
                  <circle cx="48.5" cy="53.5" r="1.4" fill="#fff" />
                  <circle cx="76.5" cy="53.5" r="1.4" fill="#fff" />
                  {/* Cheeks */}
                  <ellipse cx="36" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />
                  <ellipse cx="84" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />
                  {/* Happy Smile */}
                  <path
                    d="M48 68 Q60 84 72 68 Z"
                    fill="#134E4A"
                    stroke="#134E4A"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Floating Mini Badge Cards */}
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                  <Star className="size-3.5 text-amber-500 fill-amber-400" /> 3 Modul Animasi
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                  <Gamepad2 className="size-3.5 text-teal-600" /> 3 Mini Game
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BAGIAN 2: MENGAPA WEBSITE KENALI DIBUAT? (3 KARTU TUJUAN EDUKASI)          */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Tujuan Edukasi
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Mengapa Website KENALI Dibuat?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Masa remaja usia 13–15 tahun adalah fase penting penuh perubahan fisik dan dinamika sosial.
              KENALI hadir untuk mendampingi siswa SMP Al-Falah melalui 3 pilar perlindungan utama:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Pubertas */}
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 border-b-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-teal-400 transition-all">
              <div className="space-y-2.5">
                <div className="size-12 rounded-2xl bg-teal-100 border-2 border-teal-300 text-teal-700 flex items-center justify-center font-display text-2xl shadow-xs">
                  🌱
                </div>
                <h3 className="font-display text-lg font-bold text-slate-800 leading-snug">
                  Edukasi Pubertas yang Aman &amp; Sopan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Membantu siswa mengenal perubahan tubuh dan batasan diri (sentuhan aman vs tidak aman)
                  tanpa rasa takut, malu, atau tabu dengan tata krama sekolah yang santun.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Pahami Hak Otoritas Tubuh
              </div>
            </div>

            {/* Card 2: Tameng Manipulasi */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 border-b-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-2.5">
                <div className="size-12 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center font-display text-2xl shadow-xs">
                  🛡️
                </div>
                <h3 className="font-display text-lg font-bold text-slate-800 leading-snug">
                  Tameng dari Manipulasi &amp; Kekerasan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Melatih siswa mengenali tanda-tanda bujuk rayu (<em>grooming</em>), jebakan rahasia berbahaya,
                  ancaman di dunia nyata maupun media sosial, serta cara merespon dengan tegas.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Berani Menolak &amp; Menjaga Diri
              </div>
            </div>

            {/* Card 3: Ruang Aman Cerita */}
            <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 border-b-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-sky-400 transition-all">
              <div className="space-y-2.5">
                <div className="size-12 rounded-2xl bg-sky-100 border-2 border-sky-300 text-sky-700 flex items-center justify-center font-display text-2xl shadow-xs">
                  🤝
                </div>
                <h3 className="font-display text-lg font-bold text-slate-800 leading-snug">
                  Ruang Aman untuk Bercerita &amp; Bantuan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Menghubungkan siswa dengan dukungan emosional melalui skrining perasaan, buku diary privat,
                  serta akses komunikasi yang hangat langsung ke Guru BK sekolah.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-sky-800 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Didampingi Konselor Sekolah
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BAGIAN 3: BENTO GRID FITUR UTAMA (ADAPTASI 21ST.DEV & TACTILE KENALI)      */}
        {/* ========================================================================= */}
        <BentoFeatures />

        {/* ========================================================================= */}
        {/* BAGIAN 4: BANNER JAMINAN PRIVASI                                         */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white border-4 border-b-8 border-teal-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="size-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 text-3xl shadow-xs">
              🔒
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
                Privasi Kamu Adalah Prioritas Tertinggi Kami
              </h3>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-medium">
                Catatan di fitur <strong>Diary Rahasia</strong> terkunci rapat di dalam akun pribadimu dan
                tidak dapat dibaca oleh siapa pun, termasuk Guru BK maupun tim peneliti mahasiswa. Kamu
                berhak memiliki ruang aman yang bebas dari rasa khawatir.
              </p>
            </div>
          </div>
        </section>

        {/* Role Portal Cards Links */}
        <section className="pt-2 border-t-2 border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
            Akses Langsung Berdasarkan Peran Pengguna:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard/siswa"
              onClick={() => play("pop")}
              className="p-3.5 rounded-2xl border-2 border-teal-200 bg-white hover:border-teal-400 transition-all flex items-center justify-between group active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="size-4" />
                </span>
                <div className="text-left">
                  <p className="font-display text-xs font-bold text-slate-800">Siswa SMP</p>
                  <p className="text-[11px] text-teal-700">Video, Game, Diary</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/bk"
              onClick={() => play("pop")}
              className="p-3.5 rounded-2xl border-2 border-amber-200 bg-white hover:border-amber-400 transition-all flex items-center justify-between group active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <HeartHandshake className="size-4" />
                </span>
                <div className="text-left">
                  <p className="font-display text-xs font-bold text-slate-800">Guru BK</p>
                  <p className="text-[11px] text-amber-800">Pendampingan Siswa</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/mahasiswa"
              onClick={() => play("pop")}
              className="p-3.5 rounded-2xl border-2 border-sky-200 bg-white hover:border-sky-400 transition-all flex items-center justify-between group active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <Microscope className="size-4" />
                </span>
                <div className="text-left">
                  <p className="font-display text-xs font-bold text-slate-800">Tim Peneliti</p>
                  <p className="text-[11px] text-sky-800">Kelola &amp; Download Data</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------------------- */}
      {/* FOOTER PROYEK AKADEMIK RESMI                                               */}
      {/* -------------------------------------------------------------------------- */}
      <footer className="border-t-4 border-slate-200 bg-white py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-2 text-xs text-slate-500">
          <p className="font-display font-bold text-slate-700 text-sm">
            Website Edukasi Interaktif KENALI &bull; Kenali Dirimu, Lindungi Batasanmu
          </p>
          <p className="font-medium text-slate-500">
            Program Nursing Care: Karsa Cipta Untuk Klien &bull; Program Studi S1 Ilmu Keperawatan
            (Syahrani, Viona Finanda, Vira Auliya)
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">
            SMP Al-Falah Rempoa Ciputat, Tangerang Selatan &bull; Tahun Ajaran 2026/2027
          </p>
        </div>
      </footer>
    </div>
  );
}
