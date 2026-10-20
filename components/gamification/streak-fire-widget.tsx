"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakFireWidgetProps {
  currentStreak: number;
  highestStreak?: number;
  onClick?: () => void;
  className?: string;
}

export function StreakFireWidget({
  currentStreak,
  highestStreak,
  onClick,
  className = "",
}: StreakFireWidgetProps) {
  const isBlazing = currentStreak >= 3;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl border-2 border-b-3 sm:border-b-4 font-display font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
        isBlazing
          ? "bg-gradient-to-r from-amber-50 to-orange-100 border-orange-400 border-b-orange-500 text-orange-900 shadow-orange-500/20"
          : "bg-orange-50 border-orange-300 border-b-orange-400 text-orange-800"
      } ${className}`}
      title={`Streak Belajar: ${currentStreak} Hari Berturut-turut! (Tertinggi: ${highestStreak ?? currentStreak} Hari) - Klik untuk lihat kartu pamer!`}
    >
      {/* Blazing flame aura for streaks >= 3 */}
      {isBlazing && (
        <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-40 blur-xs group-hover:opacity-60 transition-opacity -z-10 animate-pulse" />
      )}

      {/* Flame Icon with subtle dance animation */}
      <motion.div
        animate={isBlazing ? { scale: [1, 1.2, 1], rotate: [-2, 3, -2] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0"
      >
        <Flame
          className={`size-4 sm:size-4.5 ${
            isBlazing
              ? "text-orange-500 fill-orange-500 drop-shadow-[0_2px_4px_rgba(249,115,22,0.4)]"
              : "text-orange-500 fill-orange-400"
          }`}
        />
      </motion.div>

      <span className="tracking-tight">
        {currentStreak}{" "}
        <span className="text-[10px] sm:text-xs font-bold text-orange-700 font-sans">
          Hari
        </span>
      </span>

      {/* Mini spark pill */}
      <span className="hidden xs:inline-block px-1.5 py-0.2 rounded-md bg-orange-500 text-white text-[9px] font-black uppercase tracking-wider">
        ON FIRE
      </span>
    </motion.button>
  );
}

export default StreakFireWidget;
