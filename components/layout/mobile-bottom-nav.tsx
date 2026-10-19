"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Gamepad2, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { useGameSound } from "@/lib/sound";

export type StudentNavZone = "map" | "arcade" | "screening" | "diary" | "counselor";

interface MobileBottomNavProps {
  activeZone: StudentNavZone;
  onSelectZone: (zone: StudentNavZone) => void;
}

interface NavTabItem {
  id: StudentNavZone;
  label: string;
  badge?: string;
  icon: React.ElementType;
  activeColor: {
    bg: string;
    text: string;
    border: string;
  };
}

const TABS: NavTabItem[] = [
  {
    id: "map",
    label: "Video",
    icon: Video,
    activeColor: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-400",
    },
  },
  {
    id: "arcade",
    label: "Game",
    badge: "3 Game",
    icon: Gamepad2,
    activeColor: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-400",
    },
  },
  {
    id: "screening",
    label: "Skrining",
    icon: ShieldCheck,
    activeColor: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-400",
    },
  },
  {
    id: "diary",
    label: "Diary",
    icon: HeartHandshake,
    activeColor: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-400",
    },
  },
  {
    id: "counselor",
    label: "Bantuan",
    icon: PhoneCall,
    activeColor: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-400",
    },
  },
];

export function MobileBottomNav({ activeZone, onSelectZone }: MobileBottomNavProps) {
  const { play } = useGameSound();

  return (
    <nav
      aria-label="Navigasi Menu Siswa"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-lg shadow-slate-900/10"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {TABS.map((tab) => {
          const isActive = activeZone === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                play("pop");
                onSelectZone(tab.id);
                // Scroll to top smoothly if changing tab
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`relative flex flex-col items-center justify-center min-h-[52px] py-1.5 px-1 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? `${tab.activeColor.bg} ${tab.activeColor.text} font-bold border-2 ${tab.activeColor.border} border-b-4 -translate-y-1 shadow-xs`
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-semibold"
              }`}
            >
              {/* Badge if present */}
              {tab.badge && !isActive && (
                <span className="absolute -top-1.5 right-1 size-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}

              <div className="relative">
                <Icon
                  className={`size-5 transition-transform ${
                    isActive ? "scale-110 stroke-[2.5]" : "scale-100"
                  }`}
                />
              </div>

              <span className="text-[10px] leading-tight mt-1 truncate max-w-full font-display">
                {tab.label}
              </span>

              {/* Active Dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 size-1 rounded-full bg-current"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
