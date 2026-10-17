"use client";

import { LottieSvg, LottieSubscription } from "lottie-react";

/**
 * Thin client-only wrapper around lottie-react v3.
 * Kept in its own module so `mascot-companion` can lazy-load it with `ssr: false`
 * (lottie-web touches `document` and should never run on the server).
 */
export interface MascotLottieProps {
  /** Lottie JSON object or a URL to a `.json` / `.lottie` file. */
  src: string | object;
  loop?: boolean;
  className?: string;
  onError?: () => void;
}

export default function MascotLottie({ src, loop = true, className, onError }: MascotLottieProps) {
  return (
    <LottieSvg
      src={src}
      autoplay
      loop={loop}
      className={className}
      aria-hidden
      subscriptions={{ [LottieSubscription.error]: () => onError?.() }}
    />
  );
}
