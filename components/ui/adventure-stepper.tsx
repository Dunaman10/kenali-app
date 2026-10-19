"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Lock, Play, Star, Sparkles } from "lucide-react";
import { useGameSound } from "@/lib/sound";

export interface AdventureStep {
  level: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  xpReward: number;
  duration: string;
}

interface AdventureStepperProps {
  steps: AdventureStep[];
  onSelectStep?: (level: number) => void;
}

export function AdventureStepper({ steps, onSelectStep }: AdventureStepperProps) {
  const { play } = useGameSound();

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200 border-b-6 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center font-bold">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-800">
              Peta Perjalanan Belajar
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Selesaikan 3 level berurutan untuk menjadi Pelindung Diri Handal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
          <Star className="size-3.5 fill-amber-400 text-amber-500" />
          <span>Total +150 XP</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="relative space-y-4">
        {/* Connecting Progress Line */}
        <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-6 w-1 bg-slate-200 rounded-full -z-0" />

        {steps.map((step) => {
          const handleClick = () => {
            if (step.isLocked) {
              play("warning");
              return;
            }
            play("pop");
            onSelectStep?.(step.level);
          };

          return (
            <motion.div
              key={step.level}
              whileHover={!step.isLocked ? { scale: 1.01 } : {}}
              whileTap={!step.isLocked ? { scale: 0.99 } : {}}
              onClick={handleClick}
              className={`relative z-10 flex items-center gap-4 sm:gap-5 p-4 rounded-2xl border-2 border-b-4 transition-all cursor-pointer ${
                step.isCurrent
                  ? "bg-teal-50/70 border-teal-400 border-b-teal-600 shadow-xs ring-2 ring-teal-300/30"
                  : step.isCompleted
                  ? "bg-slate-50 border-slate-200 border-b-slate-300 hover:bg-slate-100/80"
                  : "bg-slate-50/50 border-slate-200 border-b-slate-300 opacity-70 cursor-not-allowed"
              }`}
            >
              {/* Step Icon Indicator */}
              <div
                className={`size-11 sm:size-13 rounded-2xl border-2 flex items-center justify-center font-display font-black text-base shrink-0 transition-all ${
                  step.isCompleted
                    ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                    : step.isCurrent
                    ? "bg-teal-500 border-teal-600 text-white animate-pulse"
                    : "bg-slate-200 border-slate-300 text-slate-400"
                }`}
              >
                {step.isCompleted ? (
                  <Check className="size-5 stroke-[3]" />
                ) : step.isLocked ? (
                  <Lock className="size-4 text-slate-400" />
                ) : (
                  <Play className="size-4 fill-white ml-0.5" />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      step.isCompleted
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : step.isCurrent
                        ? "bg-teal-100 text-teal-800 border-teal-300"
                        : "bg-slate-200 text-slate-600 border-slate-300"
                    }`}
                  >
                    Level {step.level}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    &bull; {step.duration}
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm sm:text-base text-slate-800 truncate mt-1">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  {step.subtitle}
                </p>
              </div>

              {/* Status / XP Badge */}
              <div className="shrink-0 text-right">
                {step.isCompleted ? (
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                    <Check className="size-4" /> Selesai
                  </span>
                ) : step.isCurrent ? (
                  <span className="px-3 py-1 rounded-xl bg-teal-500 text-white font-display text-xs font-bold shadow-xs border border-teal-600">
                    Buka Misi
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Terkunci</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
