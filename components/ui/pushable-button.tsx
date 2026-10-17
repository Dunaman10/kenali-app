"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useGameSound, type SoundName } from "@/lib/sound";

/**
 * Tactile chunky 3D button (Duolingo-style).
 * A darker "edge" layer sits under a "face" layer; the face springs down on press.
 * No layout shift — siblings don't jump when the button is pressed.
 */

const VARIANTS = {
  teal: { face: "bg-teal-500 text-white border-teal-600", edge: "bg-teal-700" },
  amber: { face: "bg-amber-400 text-amber-950 border-amber-500", edge: "bg-amber-600" },
  sky: { face: "bg-sky-400 text-white border-sky-500", edge: "bg-sky-600" },
  rose: { face: "bg-rose-500 text-white border-rose-600", edge: "bg-rose-700" },
  emerald: { face: "bg-emerald-500 text-white border-emerald-600", edge: "bg-emerald-700" },
  white: { face: "bg-white text-slate-700 border-slate-200", edge: "bg-slate-300" },
} as const;

const SIZES = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
} as const;

const EDGE = 5; // px of visible 3D edge at rest
const spring = { type: "spring", stiffness: 600, damping: 26, mass: 0.6 } as const;

export interface PushableButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  /** Sound to play on press, or `false` to stay silent. Default: `"pop"`. */
  sound?: SoundName | false;
  fullWidth?: boolean;
  /** Optional leading icon (e.g. a lucide-react icon). */
  icon?: ReactNode;
}

export const PushableButton = forwardRef<HTMLButtonElement, PushableButtonProps>(
  function PushableButton(
    {
      children,
      variant = "teal",
      size = "md",
      sound = "pop",
      fullWidth = false,
      icon,
      disabled,
      className = "",
      onClick,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const { play } = useGameSound();
    const v = VARIANTS[variant];

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        initial="rest"
        animate="rest"
        whileHover={disabled ? undefined : "hover"}
        whileTap={disabled ? undefined : "pressed"}
        onClick={(e) => {
          if (sound) play(sound);
          onClick?.(e);
        }}
        className={`group relative select-none rounded-2xl outline-none touch-manipulation
          focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF7]
          disabled:cursor-not-allowed disabled:opacity-50 ${fullWidth ? "w-full" : "inline-block"} ${className}`}
        style={{ marginTop: EDGE }}
        {...rest}
      >
        {/* 3D edge */}
        <span aria-hidden className={`absolute inset-0 rounded-2xl ${v.edge}`} />
        {/* Face */}
        <motion.span
          variants={{
            rest: { y: -EDGE },
            hover: { y: -EDGE - 2 },
            pressed: { y: -1 },
          }}
          transition={spring}
          className={`relative flex items-center justify-center rounded-2xl border-2 font-display font-semibold tracking-wide
            ${SIZES[size]} ${v.face}`}
        >
          {icon && <span className="inline-flex shrink-0 [&>svg]:size-[1.15em]">{icon}</span>}
          {children}
        </motion.span>
      </motion.button>
    );
  },
);

export default PushableButton;
