"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Trophy, Flame } from "lucide-react";
import { ProfileCustomizer } from "@/components/gamification/profile-customizer";
import { StreakShareCard } from "@/components/gamification/streak-share-card";
import { StreakFireWidget } from "@/components/gamification/streak-fire-widget";
import { getUserProfile, type DemoUserProfile } from "@/lib/data-service";
import { useGameSound } from "@/lib/sound";

export default function SiswaProfilePage() {
  const { play } = useGameSound();
  const [profile, setProfile] = useState<DemoUserProfile | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    getUserProfile("ahmad8b").then((p) => {
      setProfile(p);
    });
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center p-6 text-slate-500 font-sans">
        <div className="text-center space-y-2">
          <div className="size-10 rounded-full border-4 border-teal-500 border-t-transparent animate-spin mx-auto" />
          <p className="font-display font-bold text-sm text-slate-700">
            Menyiapkan Lemari Kustomisasimu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-28 font-sans select-none">
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER                                                         */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/dashboard/siswa"
            onClick={() => play("pop")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-display font-bold text-xs shadow-2xs active:border-b-2 active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="size-4 text-slate-500 shrink-0" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <div className="text-center min-w-0">
            <h1 className="font-display text-sm sm:text-base font-extrabold text-slate-800 leading-none truncate">
              Kustomisasi Profil Siswa
            </h1>
            <p className="text-[10px] text-teal-600 font-bold leading-none mt-1">
              Kenali Diri &bull; SMP Al-Falah
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StreakFireWidget
              currentStreak={profile.currentStreak || profile.streakDays || 1}
              highestStreak={profile.highestStreak || 1}
              onClick={() => {
                play("pop");
                setIsShareModalOpen(true);
              }}
            />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT                                                       */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Intro Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 border-2 border-b-4 border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 whitespace-nowrap">
                <Sparkles className="size-3.5 text-teal-600 shrink-0" />
                <span>Kamar Ganti Siswa</span>
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-800 leading-tight">
              Ekspresikan Dirimu, Sobat KENALI!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Atur avatar kartun, ubah nama panggilan, pilih lencana pencapaian, dan warna tema kartu profilmu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              play("pop");
              setIsShareModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-b-4 border-amber-500 bg-amber-400 hover:bg-amber-500 active:border-b-2 active:translate-y-[2px] text-amber-950 font-display font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
          >
            <Trophy className="size-4 text-amber-900 shrink-0" />
            <span>Lihat Kartu Pamer 🔥</span>
          </button>
        </div>

        {/* Customizer Component */}
        <ProfileCustomizer
          initialProfile={profile}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
      </main>

      {/* Sharing Card Modal */}
      <StreakShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        studentName={profile.fullName}
        studentNickname={profile.nickname}
        studentGrade={profile.grade || "Kelas 8B"}
        schoolName={profile.school}
        avatarSeed={profile.avatarSeed || profile.nickname || "Ahmad"}
        avatarVariant={profile.avatarVariant}
        selectedBadgeName={profile.selectedBadge || "Detektif Batasan Diri"}
        cardTheme={profile.cardTheme || "teal"}
        currentStreak={profile.currentStreak || profile.streakDays || 1}
        highestStreak={profile.highestStreak || 1}
        xpPoints={profile.xpPoints}
        collectedStars={profile.collectedStars}
      />
    </div>
  );
}
