"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { PushableButton } from "./pushable-button";

export interface EducationalFeedbackSheetProps {
  isOpen: boolean;
  status: "success" | "warning";
  title: string;
  message: string;
  correctBadge?: string;
  nextButtonLabel: string;
  onNext: () => void;
}

export function EducationalFeedbackSheet({
  isOpen,
  status,
  title,
  message,
  correctBadge,
  nextButtonLabel,
  onNext,
}: EducationalFeedbackSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 pointer-events-auto"
            onClick={onNext}
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t-4 border-b-0 p-5 sm:p-6 shadow-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))] max-w-lg mx-auto ${
              status === "success"
                ? "bg-teal-50 border-teal-500 text-teal-950"
                : "bg-amber-50 border-amber-500 text-amber-950"
            }`}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300/80 mx-auto -mt-1 mb-4" />

            <div className="space-y-3">
              {/* Header Title with Icon */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-10 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                      status === "success"
                        ? "bg-teal-500 border-teal-600 text-white"
                        : "bg-amber-500 border-amber-600 text-white"
                    }`}
                  >
                    {status === "success" ? (
                      <CheckCircle2 className="size-6" />
                    ) : (
                      <AlertTriangle className="size-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                      Umpan Balik Edukatif
                    </span>
                    <h4 className="font-display text-base sm:text-lg font-bold leading-tight">
                      {title}
                    </h4>
                  </div>
                </div>

                {correctBadge && (
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black bg-white border border-slate-200 shadow-xs">
                    {correctBadge}
                  </span>
                )}
              </div>

              {/* Educational Explanation */}
              <p className="text-xs sm:text-sm font-medium leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-black/5">
                {message}
              </p>

              {/* Thumb-friendly Big Action Button */}
              <div className="pt-2">
                <PushableButton
                  variant={status === "success" ? "teal" : "amber"}
                  size="lg"
                  fullWidth
                  onClick={onNext}
                  icon={<ArrowRight className="size-5" />}
                >
                  {nextButtonLabel}
                </PushableButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
