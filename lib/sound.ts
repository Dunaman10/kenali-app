"use client";

/**
 * KENALI game sound system.
 *
 * - Primary engine: a tiny Web Audio API synthesizer — zero MP3 files, zero network,
 *   works offline on low-end school phones.
 * - Optional engine: `use-sound` (Howler) — register real audio files in
 *   `SOUND_FILES` and they will be used instead of the synth for that sound.
 * - Mute/Unmute state persists in `localStorage` and syncs across tabs/components.
 */

import { useCallback, useSyncExternalStore } from "react";
import useSound from "use-sound";

export type SoundName = "pop" | "success" | "warning" | "fanfare";

/**
 * Optional real audio files (relative to /public). Leave `null` to use the synth.
 * Example: `success: "/sounds/success.mp3"`.
 */
export const SOUND_FILES: Record<SoundName, string | null> = {
  pop: null,
  success: null,
  warning: null,
  fanfare: null,
};

/* -------------------------------------------------------------------------- */
/*                               Mute store                                   */
/* -------------------------------------------------------------------------- */

const MUTE_KEY = "kenali:sound-muted";
const listeners = new Set<() => void>();

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false; // private mode / storage blocked
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === MUTE_KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Read-only hook for the muted flag (SSR-safe: server renders as unmuted). */
export function useSoundMuted(): boolean {
  return useSyncExternalStore(subscribe, readMuted, () => false);
}

/* -------------------------------------------------------------------------- */
/*                         Web Audio synthesizer                              */
/* -------------------------------------------------------------------------- */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // Mobile browsers start suspended until a user gesture.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = {
  freq: number;
  /** Optional end frequency for a pitch glide. */
  to?: number;
  start: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
};

function playTones(tones: Tone[], master = 0.5) {
  const ac = getCtx();
  if (!ac) return;
  const out = ac.createGain();
  out.gain.value = master;
  out.connect(ac.destination);

  const now = ac.currentTime + 0.01;
  for (const t of tones) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    const t0 = now + t.start;
    const t1 = t0 + t.dur;
    const peak = t.gain ?? 0.3;

    osc.type = t.type ?? "sine";
    osc.frequency.setValueAtTime(t.freq, t0);
    if (t.to) osc.frequency.exponentialRampToValueAtTime(t.to, t1);

    // Soft attack + exponential release → no clicks, friendly timbre.
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t1);

    osc.connect(g).connect(out);
    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}

// Note frequencies (Hz)
const N = { C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5, E6: 1318.5 };

/** Synth recipes. Tuned to be cheerful and never harsh (no buzzers for "wrong"). */
const SYNTH: Record<SoundName, () => void> = {
  // Short bubbly "pop" for button taps.
  pop: () => playTones([{ freq: 520, to: 880, start: 0, dur: 0.08, type: "sine", gain: 0.35 }], 0.45),

  // Bright two-step chime for correct answers.
  success: () =>
    playTones(
      [
        { freq: N.E5, start: 0, dur: 0.14, type: "triangle", gain: 0.3 },
        { freq: N.C6, start: 0.09, dur: 0.28, type: "triangle", gain: 0.3 },
        { freq: N.E6, start: 0.09, dur: 0.22, type: "sine", gain: 0.08 },
      ],
      0.5,
    ),

  // Gentle, supportive "hmm, coba lagi" — soft descending, low volume.
  warning: () =>
    playTones(
      [
        { freq: N.A4, start: 0, dur: 0.16, type: "sine", gain: 0.28 },
        { freq: N.E4, start: 0.13, dur: 0.26, type: "sine", gain: 0.24 },
      ],
      0.4,
    ),

  // Level-complete arpeggio ending in a sustained chord.
  fanfare: () =>
    playTones(
      [
        { freq: N.C5, start: 0, dur: 0.12, type: "triangle" },
        { freq: N.E5, start: 0.1, dur: 0.12, type: "triangle" },
        { freq: N.G5, start: 0.2, dur: 0.12, type: "triangle" },
        { freq: N.C6, start: 0.3, dur: 0.55, type: "triangle", gain: 0.28 },
        { freq: N.E5, start: 0.3, dur: 0.55, type: "sine", gain: 0.14 },
        { freq: N.G4, start: 0.3, dur: 0.55, type: "sine", gain: 0.12 },
        { freq: N.C4, start: 0.3, dur: 0.6, type: "sine", gain: 0.1 },
      ],
      0.45,
    ),
};

/** Fire-and-forget synth sound, respecting the persisted mute flag. Usable outside React. */
export function playSynth(name: SoundName) {
  if (typeof window === "undefined" || readMuted()) return;
  try {
    SYNTH[name]();
  } catch {
    /* audio unavailable — fail silently, sound is non-essential */
  }
}

/* -------------------------------------------------------------------------- */
/*                               React hook                                   */
/* -------------------------------------------------------------------------- */

/** Registers one optional file-backed sound. Never loads anything when `src` is null. */
function useFileSound(src: string | null, muted: boolean, volume: number) {
  const [play] = useSound(src ?? "", {
    volume,
    soundEnabled: Boolean(src) && !muted,
    interrupt: true,
    preload: Boolean(src), // forwarded to Howler — no request when unset
  });
  return play;
}

/**
 * `const { play, muted, toggleMute } = useGameSound();`
 * `play("success")`
 */
export function useGameSound({ volume = 0.6 }: { volume?: number } = {}) {
  const muted = useSoundMuted();

  const pop = useFileSound(SOUND_FILES.pop, muted, volume);
  const success = useFileSound(SOUND_FILES.success, muted, volume);
  const warning = useFileSound(SOUND_FILES.warning, muted, volume);
  const fanfare = useFileSound(SOUND_FILES.fanfare, muted, volume);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      if (!SOUND_FILES[name]) return playSynth(name);
      ({ pop, success, warning, fanfare })[name]();
    },
    [muted, pop, success, warning, fanfare],
  );

  const toggleMute = useCallback(() => setMuted(!readMuted()), []);

  return { play, muted, setMuted, toggleMute };
}
