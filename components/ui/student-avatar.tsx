"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral, adventurer, funEmoji } from "@dicebear/collection";

/**
 * Teen-friendly cartoon avatar generated from a seed (username / nickname).
 * Avatars are deterministic and contain NO real photo → protects student privacy.
 */

export type AvatarVariant = "adventurer" | "adventurer-neutral" | "fun-emoji";

const STYLES = {
  adventurer,
  "adventurer-neutral": adventurerNeutral,
  "fun-emoji": funEmoji,
} as const;

/** Soft KENALI pastel backgrounds (hex without `#`, as DiceBear expects). */
const KENALI_BG = ["ccfbf1", "fef3c7", "e0f2fe", "ffe4e6", "fde68a", "99f6e4"];

const SIZE_CLASS = {
  sm: "size-10 border-2",
  md: "size-14 border-2 border-b-4",
  lg: "size-20 border-[3px] border-b-[5px]",
  xl: "size-28 border-4 border-b-[6px]",
} as const;

export interface StudentAvatarProps {
  /** Username / nickname — the same seed always yields the same avatar. */
  seed: string;
  variant?: AvatarVariant;
  size?: keyof typeof SIZE_CLASS;
  /** Accessible label. Defaults to "Avatar {seed}". */
  alt?: string;
  className?: string;
}

export function StudentAvatar({
  seed,
  variant = "adventurer",
  size = "md",
  alt,
  className = "",
}: StudentAvatarProps) {
  const src = useMemo(() => {
    const normalized = seed.trim().toLowerCase() || "kenali";
    // Branching per style keeps each call fully type-checked against its own options.
    const common = { seed: normalized, size: 128, backgroundColor: KENALI_BG, radius: 50 };
    switch (variant) {
      case "fun-emoji":
        return createAvatar(STYLES["fun-emoji"], common).toDataUri();
      case "adventurer-neutral":
        return createAvatar(STYLES["adventurer-neutral"], common).toDataUri();
      default:
        return createAvatar(STYLES.adventurer, {
          ...common,
          // Keep it school/teen-appropriate: no earrings, no mustache.
          earringsProbability: 0,
          features: ["blush", "freckles"],
        }).toDataUri();
    }
  }, [seed, variant]);

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full border-slate-200 bg-white ${SIZE_CLASS[size]} ${className}`}
    >
      {/* Data-URI SVG generated locally; next/image optimization adds nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? `Avatar ${seed}`} className="size-full" draggable={false} />
    </span>
  );
}

export default StudentAvatar;
