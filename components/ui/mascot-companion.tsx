"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MascotLottie = dynamic(() => import("./mascot-lottie"), { ssr: false });

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type MascotMood = "happy" | "cheer" | "thinking" | "calm" | "supportive";
export type MascotTone = "neutral" | "success" | "info" | "gentle-warning";

export interface MascotCompanionProps {
  mood?: MascotMood;
  /** Short bold heading in the bubble, e.g. "Tepat sekali!" */
  title?: string;
  /** Educational feedback text. Omit to hide the bubble. */
  message?: ReactNode;
  tone?: MascotTone;
  /** Optional Lottie JSON / URL. Falls back to the built-in SVG mascot if absent or broken. */
  lottieSrc?: string | object;
  size?: "sm" | "md" | "lg";
  /** Put the bubble on the left of the mascot instead of the right. */
  flip?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Tokens                                    */
/* -------------------------------------------------------------------------- */

const MASCOT_SIZE = { sm: "size-16", md: "size-24", lg: "size-32" } as const;

const TONE = {
  neutral: { ring: "border-slate-200", title: "text-slate-800", tail: "#e2e8f0" },
  success: { ring: "border-teal-300", title: "text-teal-700", tail: "#5eead4" },
  info: { ring: "border-sky-300", title: "text-sky-700", tail: "#7dd3fc" },
  "gentle-warning": { ring: "border-amber-300", title: "text-amber-700", tail: "#fcd34d" },
} as const;

const springy = { type: "spring", stiffness: 300, damping: 24 } as const;

/* -------------------------------------------------------------------------- */
/*                         SVG fallback: "Teman KENALI"                        */
/* -------------------------------------------------------------------------- */

/** Friendly teal bean with a sprout — modest, school-appropriate, mood-reactive. */
function MascotSvg({ mood }: { mood: MascotMood }) {
  const reduce = useReducedMotion();

  const body = mood === "calm" ? "#38BDF8" : "#14B8A6";
  const bodyDark = mood === "calm" ? "#0284C7" : "#0F766E";
  const belly = mood === "calm" ? "#E0F2FE" : "#CCFBF1";

  const bob = reduce
    ? {}
    : mood === "cheer"
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
      : mood === "thinking"
        ? { rotate: [0, -3, 0] }
        : { y: [0, -3, 0] };

  const mouth: Record<MascotMood, ReactNode> = {
    happy: <path d="M50 70 Q60 80 70 70" stroke="#134E4A" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    cheer: <path d="M48 68 Q60 84 72 68 Z" fill="#134E4A" stroke="#134E4A" strokeWidth="2" strokeLinejoin="round" />,
    thinking: <path d="M52 73 Q60 70 68 74" stroke="#134E4A" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    calm: <path d="M52 71 Q60 77 68 71" stroke="#0C4A6E" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    supportive: <path d="M51 71 Q60 78 69 71" stroke="#134E4A" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
  };

  const eyesClosed = mood === "calm";

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="size-full drop-shadow-[0_4px_0_rgba(15,118,110,0.18)]"
      animate={bob}
      transition={{ duration: mood === "cheer" ? 0.9 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {/* Sprout */}
      <motion.g
        style={{ originX: "60px", originY: "26px" }}
        animate={reduce ? {} : { rotate: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M60 28 V16" stroke={bodyDark} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M60 18 C52 8 42 12 44 18 C48 22 56 21 60 18 Z" fill="#34D399" stroke="#047857" strokeWidth="2" />
        <path d="M60 16 C67 5 78 9 76 15 C72 20 64 19 60 16 Z" fill="#6EE7B7" stroke="#047857" strokeWidth="2" />
      </motion.g>

      {/* Arms */}
      <motion.path
        d="M24 72 Q14 66 16 56"
        stroke={bodyDark}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        style={{ originX: "24px", originY: "72px" }}
        animate={mood === "cheer" && !reduce ? { rotate: [0, 30, 0] } : { rotate: mood === "cheer" ? 30 : 0 }}
        transition={{ duration: 0.45, repeat: mood === "cheer" ? Infinity : 0, repeatType: "mirror" }}
      />
      <motion.path
        d={mood === "thinking" ? "M96 74 Q90 66 80 66" : "M96 72 Q106 66 104 56"}
        stroke={bodyDark}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        style={{ originX: "96px", originY: "72px" }}
        animate={mood === "cheer" && !reduce ? { rotate: [0, -30, 0] } : { rotate: mood === "cheer" ? -30 : 0 }}
        transition={{ duration: 0.45, repeat: mood === "cheer" ? Infinity : 0, repeatType: "mirror" }}
      />

      {/* Body (chunky border = design-system look) */}
      <rect x="22" y="28" width="76" height="80" rx="38" fill={bodyDark} />
      <rect x="22" y="26" width="76" height="78" rx="38" fill={body} />
      <ellipse cx="60" cy="82" rx="24" ry="17" fill={belly} opacity="0.9" />

      {/* Eyes */}
      {eyesClosed ? (
        <g stroke="#0C4A6E" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M40 56 Q46 61 52 56" />
          <path d="M68 56 Q74 61 80 56" />
        </g>
      ) : (
        <motion.g
          style={{ originY: "56px" }}
          animate={reduce ? {} : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] }}
        >
          <ellipse cx="46" cy="55" rx="7" ry={mood === "cheer" ? 7 : 8.5} fill="#fff" />
          <ellipse cx="74" cy="55" rx="7" ry={mood === "cheer" ? 7 : 8.5} fill="#fff" />
          <circle cx={mood === "thinking" ? 48 : 47} cy={mood === "thinking" ? 52 : 56} r="4" fill="#1E293B" />
          <circle cx={mood === "thinking" ? 76 : 75} cy={mood === "thinking" ? 52 : 56} r="4" fill="#1E293B" />
          <circle cx="48.5" cy="53.5" r="1.4" fill="#fff" />
          <circle cx="76.5" cy="53.5" r="1.4" fill="#fff" />
        </motion.g>
      )}

      {/* Cheeks */}
      <ellipse cx="36" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="84" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />

      {mouth[mood]}

      {/* Mood extras */}
      {mood === "thinking" && (
        <motion.g animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <circle cx="104" cy="30" r="3" fill="#94A3B8" />
          <circle cx="110" cy="20" r="4.5" fill="#94A3B8" />
        </motion.g>
      )}
      {mood === "cheer" && (
        <motion.path
          d="M104 22 l2.5 5.5 6 .6 -4.5 4 1.3 6 -5.3 -3.1 -5.3 3.1 1.3 -6 -4.5 -4 6 -.6 z"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="1.5"
          strokeLinejoin="round"
          animate={reduce ? {} : { scale: [0.8, 1.15, 0.8], rotate: [0, 20, 0] }}
          style={{ originX: "104px", originY: "30px" }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {mood === "supportive" && (
        <motion.path
          d="M104 34 c-3-4-9-2-8 3 c1 4 8 8 8 8 s7-4 8-8 c1-5-5-7-8-3z"
          fill="#F43F5E"
          animate={reduce ? {} : { scale: [1, 1.18, 1] }}
          style={{ originX: "104px", originY: "38px" }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      )}
    </motion.svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

export function MascotCompanion({
  mood = "happy",
  title,
  message,
  tone = "neutral",
  lottieSrc,
  size = "md",
  flip = false,
  className = "",
}: MascotCompanionProps) {
  const [lottieFailed, setLottieFailed] = useState(false);
  const t = TONE[tone];
  const showLottie = Boolean(lottieSrc) && !lottieFailed;
  const hasBubble = Boolean(title || message);

  return (
    <div className={`flex items-end gap-3 ${flip ? "flex-row-reverse" : ""} ${className}`}>
      <motion.div
        className={`relative shrink-0 ${MASCOT_SIZE[size]}`}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springy}
        role="img"
        aria-label="Teman KENALI, maskot pendamping"
      >
        {showLottie ? (
          <MascotLottie src={lottieSrc!} className="size-full" onError={() => setLottieFailed(true)} />
        ) : (
          <MascotSvg mood={mood} />
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {hasBubble && (
          <motion.div
            key={`${title ?? ""}|${typeof message === "string" ? message : mood}`}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={springy}
            style={{ transformOrigin: flip ? "bottom right" : "bottom left" }}
            className={`relative mb-3 min-w-0 flex-1 rounded-3xl border-2 border-b-4 bg-white px-4 py-3 ${t.ring}`}
            aria-live="polite"
          >
            {/* Bubble tail */}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={`absolute bottom-3 size-4 ${flip ? "-right-[13px] -scale-x-100" : "-left-[13px]"}`}
            >
              <path d="M16 2 L2 10 L16 14 Z" fill="#fff" stroke={t.tail} strokeWidth="2" strokeLinejoin="round" />
              <rect x="14" y="0" width="4" height="16" fill="#fff" />
            </svg>

            <p className="mb-0.5 text-xs font-extrabold uppercase tracking-wider text-slate-400">Teman KENALI</p>
            {title && <p className={`font-display text-lg font-semibold leading-snug ${t.title}`}>{title}</p>}
            {message && <div className="text-[15px] font-medium leading-relaxed text-slate-600">{message}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MascotCompanion;
