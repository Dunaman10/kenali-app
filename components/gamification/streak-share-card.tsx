"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flame,
  Star,
  Zap,
  Download,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { StudentAvatar } from "@/components/ui/student-avatar";
import {
  CARD_THEMES,
  KENALI_BADGES,
  type CardThemeId,
  type AvatarVariantType,
} from "@/lib/gamification";
import { toPng } from "html-to-image";
import { confettiBurst } from "@/lib/confetti";

export interface StreakShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentNickname?: string;
  studentGrade?: string;
  schoolName?: string;
  avatarSeed: string;
  avatarVariant?: AvatarVariantType;
  selectedBadgeName: string;
  cardTheme: CardThemeId;
  currentStreak: number;
  highestStreak: number;
  xpPoints: number;
  collectedStars: number;
  maxStars?: number;
}

export function StreakShareCard({
  isOpen,
  onClose,
  studentName,
  studentNickname,
  studentGrade = "Kelas 8B",
  schoolName = "SMP Al-Falah Rempoa",
  avatarSeed,
  avatarVariant = "adventurer",
  selectedBadgeName,
  cardTheme = "teal",
  currentStreak,
  highestStreak,
  xpPoints,
  collectedStars,
  maxStars = 10,
}: StreakShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const themeConfig = CARD_THEMES[cardTheme] || CARD_THEMES.teal;
  const activeBadge =
    KENALI_BADGES.find((b) => b.name === selectedBadgeName) || KENALI_BADGES[0];

  const displayName = studentNickname || studentName;

  // Teks pesan WhatsApp untuk dibagikan ke teman sekelas
  const shareMessage = `Halo teman-teman! 🔥 Aku sudah belajar di aplikasi KENALI selama ${currentStreak} hari berturut-turut dan meraih lencana [${activeBadge.name}]! 🛡️✨\n\nYuk kenali batasan tubuhmu, pelajari cara mencegah kekerasan, dan jaga api streak belajarmu bersama di KENALI: https://kenali.app\n#KENALI #SMPAlFalah #SobatAman`;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      confettiBurst();

      // Render DOM element to high-res PNG
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });

      const link = document.createElement("a");
      const safeFilename = `kenali-streak-${displayName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.download = safeFilename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengekspor kartu pencapaian:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl border-4 border-slate-300 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-slate-200 bg-[#FFFDF7]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 leading-tight">
                  Kartu Pamer Pencapaian
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Bagikan api streak dan lencanamu ke teman-teman!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4.5" />
            </button>
          </div>

          {/* Modal Body: Card to Capture */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* The Capture Canvas Container */}
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white border-4 border-b-8 ${themeConfig.cardBorder} bg-gradient-to-br ${themeConfig.gradientClass} shadow-xl select-none`}
            >
              {/* Background Decorative Circles */}
              <div className="absolute -top-12 -right-12 size-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 size-36 rounded-full bg-black/10 blur-xl pointer-events-none" />

              {/* Card Brand Header */}
              <div className="relative flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-white text-teal-700 font-display font-black text-base flex items-center justify-center shadow-xs">
                    K
                  </div>
                  <div>
                    <span className="font-display font-black text-sm tracking-wider uppercase text-white drop-shadow-xs">
                      KENALI APP
                    </span>
                    <span className="block text-[9px] font-bold text-white/80 leading-none">
                      {schoolName}
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-[10px] font-extrabold tracking-wide uppercase whitespace-nowrap shrink-0">
                  ⭐ Duta Pelindung Diri
                </div>
              </div>

              {/* Student Identity Section */}
              <div className="relative flex items-center gap-3.5 mb-4">
                <div className="relative shrink-0">
                  <StudentAvatar
                    seed={avatarSeed}
                    variant={avatarVariant}
                    size="lg"
                    className="border-white border-b-white/80 shadow-md ring-4 ring-white/30"
                  />
                  <span className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs shadow-xs">
                    {themeConfig.mascotMood}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-black text-lg sm:text-xl text-white leading-tight truncate drop-shadow-xs">
                    {displayName}
                  </h4>
                  <p className="text-xs font-semibold text-white/90 truncate">
                    {studentGrade} &bull; {schoolName}
                  </p>
                  {/* Selected Featured Badge Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1.5 rounded-full bg-white text-slate-800 text-[11px] font-bold shadow-xs max-w-full">
                    <span className="shrink-0">{activeBadge.icon}</span>
                    <span className="truncate">{activeBadge.name}</span>
                  </div>
                </div>
              </div>

              {/* Big Streak Highlight Banner */}
              <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/25 flex items-center justify-between mb-4 shadow-inner">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="size-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                    <Flame className="size-6 text-white fill-white animate-pulse" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-black text-amber-200 tracking-wider block truncate">
                      Streak Belajar Aktif
                    </span>
                    <h5 className="font-display font-black text-lg sm:text-2xl text-white leading-none truncate mt-0.5">
                      {currentStreak} Hari Berturut-turut!
                    </h5>
                  </div>
                </div>

                <div className="text-right pl-2.5 ml-2 border-l border-white/20 shrink-0">
                  <span className="text-[9px] uppercase font-bold text-white/70 block">
                    Rekor
                  </span>
                  <span className="font-display font-black text-xs sm:text-sm text-white whitespace-nowrap">
                    {highestStreak} Hari 🔥
                  </span>
                </div>
              </div>

              {/* Stats Footer Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-black/15 rounded-xl p-2.5 flex items-center gap-2 border border-white/10">
                  <Zap className="size-4 text-amber-300 fill-amber-300 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-white/70 font-semibold block uppercase leading-none truncate">
                      Total XP
                    </span>
                    <span className="font-display font-black text-xs sm:text-sm text-white leading-tight truncate">
                      {xpPoints} XP
                    </span>
                  </div>
                </div>

                <div className="bg-black/15 rounded-xl p-2.5 flex items-center gap-2 border border-white/10">
                  <Star className="size-4 text-amber-300 fill-amber-300 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-white/70 font-semibold block uppercase leading-none truncate">
                      Bintang Belajar
                    </span>
                    <span className="font-display font-black text-xs sm:text-sm text-white leading-tight truncate">
                      {collectedStars}/{maxStars} ⭐
                    </span>
                  </div>
                </div>
              </div>

              {/* Mascot Quote Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-white/20 flex items-center justify-between text-[10px] text-white/80">
                <span className="font-medium italic truncate">
                  &ldquo;Aku tahu batasanku &amp; berani saling menjaga!&rdquo;
                </span>
                <span className="font-black text-amber-200 shrink-0 ml-1 whitespace-nowrap">
                  #KENALIAlFalah
                </span>
              </div>
            </div>

            {/* Sharing Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Download PNG Button */}
                <button
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                  className="w-full py-3 px-3 rounded-2xl border-2 border-b-4 border-teal-700 bg-teal-500 hover:bg-teal-600 text-white font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <Download className="size-4 shrink-0" />
                  <span>{isExporting ? "Menyimpan..." : "Unduh Kartu (PNG)"}</span>
                </button>

                {/* WhatsApp Share Button */}
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 px-3 rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Share2 className="size-4 shrink-0" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>

              {/* Copy Share Text Button */}
              <button
                onClick={handleCopyText}
                className="w-full py-2.5 px-3 rounded-2xl border-2 border-b-4 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-display font-bold text-xs flex items-center justify-center gap-2 active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-emerald-600" />
                    <span className="text-emerald-700">Teks Ajakan Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-slate-500" />
                    <span>Salin Pesan Ajak Teman</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default StreakShareCard;
