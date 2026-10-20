"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Check,
  Save,
  Palette,
  ShieldCheck,
  Smile,
  Flame,
  Star,
  Zap,
  RotateCcw,
} from "lucide-react";
import { StudentAvatar } from "@/components/ui/student-avatar";
import {
  KENALI_BADGES,
  CARD_THEMES,
  AVATAR_SEEDS_PRESET,
  AVATAR_VARIANTS,
  type CardThemeId,
  type AvatarVariantType,
  type StudentBadge,
} from "@/lib/gamification";
import { updateStudentProfile, type DemoUserProfile } from "@/lib/data-service";
import { celebrate, confettiBurst } from "@/lib/confetti";
import { useGameSound } from "@/lib/sound";

export interface ProfileCustomizerProps {
  initialProfile: DemoUserProfile;
  onProfileUpdated?: (updated: DemoUserProfile) => void;
  className?: string;
}

export function ProfileCustomizer({
  initialProfile,
  onProfileUpdated,
  className = "",
}: ProfileCustomizerProps) {
  const { play } = useGameSound();

  // Local state for live customizer
  const [nickname, setNickname] = useState(
    initialProfile.nickname || initialProfile.fullName.split(" ")[0]
  );
  const [avatarSeed, setAvatarSeed] = useState(
    initialProfile.avatarSeed || initialProfile.nickname || "Ahmad"
  );
  const [avatarVariant, setAvatarVariant] = useState<AvatarVariantType>(
    initialProfile.avatarVariant || "adventurer"
  );
  const [selectedBadge, setSelectedBadge] = useState<string>(
    initialProfile.selectedBadge || "Detektif Batasan Diri"
  );
  const [cardTheme, setCardTheme] = useState<CardThemeId>(
    initialProfile.cardTheme || "teal"
  );

  const [customSeedInput, setCustomSeedInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeTheme = CARD_THEMES[cardTheme] || CARD_THEMES.teal;
  const currentBadgeObj =
    KENALI_BADGES.find((b) => b.name === selectedBadge) || KENALI_BADGES[0];

  const handleSelectSeed = (seed: string) => {
    play("pop");
    setAvatarSeed(seed);
  };

  const handleApplyCustomSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSeedInput.trim()) return;
    play("pop");
    setAvatarSeed(customSeedInput.trim());
    setCustomSeedInput("");
  };

  const handleSelectVariant = (variantId: AvatarVariantType) => {
    play("pop");
    setAvatarVariant(variantId);
  };

  const handleSelectBadge = (badge: StudentBadge) => {
    play("pop");
    setSelectedBadge(badge.name);
  };

  const handleSelectTheme = (themeId: CardThemeId) => {
    play("pop");
    setCardTheme(themeId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    play("success");
    celebrate();

    try {
      const updated = await updateStudentProfile(initialProfile.id, {
        nickname: nickname.trim() || initialProfile.nickname,
        avatarSeed: avatarSeed.trim() || "Ahmad",
        avatarVariant: avatarVariant,
        selectedBadge: selectedBadge,
        cardTheme: cardTheme,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);

      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start ${className}`}>
      {/* ------------------------------------------------------------------ */}
      {/* LEFT COLUMN: LIVE PREVIEW HERO CARD (STICKY ON DESKTOP)            */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Preview Kartu Profilmu
            </span>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              ✨ Tampilan Langsung
            </span>
          </div>

          <motion.div
            layout
            className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white border-4 border-b-8 ${activeTheme.cardBorder} bg-gradient-to-br ${activeTheme.gradientClass} shadow-xl`}
          >
            {/* Subtle Glows */}
            <div className="absolute -top-12 -right-12 size-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div className="relative flex items-center justify-between border-b border-white/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-lg bg-white text-teal-700 font-display font-black text-sm flex items-center justify-center">
                  K
                </span>
                <span className="font-display font-black text-xs uppercase tracking-wider">
                  SMP Al-Falah Rempoa
                </span>
              </div>

              <div className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase">
                {activeTheme.tagline}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <StudentAvatar
                  seed={avatarSeed}
                  variant={avatarVariant}
                  size="lg"
                  className="border-white border-b-white/80 shadow-md ring-4 ring-white/30"
                />
                <span className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs shadow-xs">
                  {activeTheme.mascotMood}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-xl text-white leading-tight truncate">
                  {nickname || "Siswa Cerdas"}
                </h3>
                <p className="text-xs font-semibold text-white/90 truncate">
                  {initialProfile.grade || "Kelas 8B"} &bull; {initialProfile.school}
                </p>

                {/* Chosen Featured Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs max-w-full">
                  <span className="shrink-0">{currentBadgeObj.icon}</span>
                  <span className="truncate">{currentBadgeObj.name}</span>
                </div>
              </div>
            </div>

            {/* Mini Stats Bar in Card */}
            <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/20 rounded-2xl py-2 px-1 border border-white/10 shadow-inner">
                <span className="text-[10px] text-amber-200 block font-bold leading-none truncate">
                  🔥 Streak
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-white block mt-1 truncate">
                  {initialProfile.currentStreak || initialProfile.streakDays || 4} Hari
                </span>
              </div>

              <div className="bg-black/20 rounded-2xl py-2 px-1 border border-white/10 shadow-inner">
                <span className="text-[10px] text-amber-200 block font-bold leading-none truncate">
                  ⚡ XP Belajar
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-white block mt-1 truncate">
                  {initialProfile.xpPoints} XP
                </span>
              </div>

              <div className="bg-black/20 rounded-2xl py-2 px-1 border border-white/10 shadow-inner">
                <span className="text-[10px] text-amber-200 block font-bold leading-none truncate">
                  ⭐ Bintang
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-white block mt-1 truncate">
                  {initialProfile.collectedStars}/10
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Preview Information Helper for Desktop */}
        <div className="hidden lg:block p-4 rounded-2xl bg-white border-2 border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-2xs">
          <p className="font-display font-bold text-slate-800 flex items-center gap-1.5">
            <span>💡</span> Info Kustomisasi Real-time
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
            Setiap pilihan avatar, nama panggilan, lencana, dan warna tema di kolom kanan akan langsung terpasang di kartu ini!
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT COLUMN: CONTROLS & SETTINGS                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:col-span-7 space-y-5">
        {/* ------------------------------------------------------------------ */}
        {/* 1. UBAH NAMA PANGGILAN / DISPLAY NAME                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-3xl p-5 border-2 border-b-4 border-slate-200 shadow-xs space-y-3">
        <label className="block">
          <span className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span>✏️</span> Nama Panggilan Siswa
          </span>
          <span className="block text-xs text-slate-400 mt-0.5">
            Nama ini akan muncul di kartu pamer dan percakapan aplikasi.
          </span>
          <input
            type="text"
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: Ahmad 8B"
            className="mt-2.5 w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none font-display font-bold text-sm text-slate-800 transition-colors"
          />
        </label>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. PILIH KARAKTER & EKSPRESI AVATAR                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded-3xl p-5 border-2 border-b-4 border-slate-200 shadow-xs space-y-4">
        <div>
          <h4 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span>🎨</span> Gaya &amp; Karakter Avatar
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih gaya gambar kartun ramah remaja favoritmu (@dicebear):
          </p>
        </div>

        {/* Style Variant Switcher */}
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_VARIANTS.map((v) => {
            const isSelected = avatarVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVariant(v.id)}
                className={`p-2.5 rounded-2xl border-2 border-b-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-50 border-teal-500 border-b-teal-600 text-teal-900 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  <StudentAvatar seed={avatarSeed} variant={v.id} size="sm" />
                </div>
                <span className="block font-display font-bold text-xs truncate">
                  {v.label}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {v.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preset Seeds Quick Picker */}
        <div className="space-y-2 pt-1">
          <span className="block text-xs font-bold text-slate-500">
            Pilih Wajah Karakter:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {AVATAR_SEEDS_PRESET.map((seed) => {
              const isSelected = avatarSeed === seed;
              return (
                <button
                  key={seed}
                  type="button"
                  onClick={() => handleSelectSeed(seed)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-3 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-teal-500 border-teal-700 text-white shadow-xs scale-105"
                      : "bg-white border-slate-200 hover:border-teal-300 text-slate-700"
                  }`}
                >
                  <StudentAvatar seed={seed} variant={avatarVariant} size="sm" className="size-6 border-0" />
                  <span className="font-display font-bold text-xs">{seed}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Seed Input */}
        <form onSubmit={handleApplyCustomSeed} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customSeedInput}
            onChange={(e) => setCustomSeedInput(e.target.value)}
            placeholder="Ketik nama acak unik untuk avatar baru..."
            className="flex-1 px-3.5 py-2 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-xs font-medium"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-2xl border-2 border-b-4 border-slate-300 bg-slate-100 hover:bg-slate-200 font-display font-bold text-xs text-slate-700 active:border-b-2 active:translate-y-[1px] transition-all cursor-pointer"
          >
            Acak!
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. KOLEKSI & PAMER LENCANA (BADGE SHOWCASE)                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded-3xl p-5 border-2 border-b-4 border-slate-200 shadow-xs space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <span>🛡️</span> Galeri Lencana Pencapaian
            </h4>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Pilih 1 untuk Dipamerkan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Lencana yang kamu pilih akan bersanding di samping namamu pada kartu pamer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {KENALI_BADGES.map((b) => {
            const isSelected = selectedBadge === b.name;
            const streakCount = initialProfile.currentStreak || initialProfile.streakDays || 1;
            const isLocked = b.minStreak ? streakCount < b.minStreak : false;

            return (
              <button
                key={b.id}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelectBadge(b)}
                className={`p-3 rounded-2xl border-2 border-b-4 text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isLocked
                    ? "opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed"
                    : isSelected
                    ? `${b.badgeBg} ${b.badgeBorder} border-b-teal-600 shadow-xs ring-2 ring-teal-400/40`
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="size-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display font-bold text-xs text-slate-800 truncate">
                      {b.name}
                    </span>
                    {isSelected && (
                      <span className="size-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                    {b.description}
                  </p>
                  {isLocked && (
                    <span className="inline-block mt-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                      🔒 Perlu {b.minStreak} Hari Streak
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. PILIH TEMA WARNA KARTU                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded-3xl p-5 border-2 border-b-4 border-slate-200 shadow-xs space-y-3">
        <div>
          <h4 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span>✨</span> Warna Tema Kartu Profil
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih warna aura yang mencerminkan semangat belajarmu:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(Object.keys(CARD_THEMES) as CardThemeId[]).map((themeKey) => {
            const theme = CARD_THEMES[themeKey];
            const isSelected = cardTheme === themeKey;
            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => handleSelectTheme(themeKey)}
                className={`p-3 rounded-2xl border-2 border-b-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-slate-800 ring-2 ring-slate-400 shadow-md scale-102"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`h-10 rounded-xl bg-gradient-to-r ${theme.gradientClass} mb-2 shadow-xs flex items-center justify-center text-white font-bold text-sm`}
                >
                  {theme.mascotMood}
                </div>
                <span className="block font-display font-bold text-xs text-slate-800">
                  {theme.name}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {theme.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

        {/* ------------------------------------------------------------------ */}
        {/* 5. TOMBOL SIMPAN TAKTIL 3D                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-3xl border-2 border-b-6 border-teal-700 bg-teal-500 hover:bg-teal-600 active:border-b-2 active:translate-y-[3px] text-white font-display font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="size-6 text-white" />
                <span>Profil Kerenmu Berhasil Disimpan! 🎉</span>
              </>
            ) : (
              <>
                <Save className="size-5 text-white" />
                <span>{isSaving ? "Menyimpan ke Profil..." : "Simpan Kustomisasi Profil"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCustomizer;
