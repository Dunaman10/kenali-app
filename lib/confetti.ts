import confetti, { type Options as ConfettiOptions } from "canvas-confetti";

/** KENALI theme colors: Teal, Sunny Amber, Sky Blue, Coral Rose (+ light tints). */
export const KENALI_CONFETTI_COLORS = [
  "#14B8A6", // teal-500
  "#5EEAD4", // teal-300
  "#F59E0B", // amber-500
  "#FCD34D", // amber-300
  "#38BDF8", // sky-400
  "#F43F5E", // rose-500
  "#FDA4AF", // rose-300
] as const;

const BASE: ConfettiOptions = {
  colors: [...KENALI_CONFETTI_COLORS],
  disableForReducedMotion: true,
  zIndex: 9999,
  ticks: 220,
  scalar: 1.05,
};

const isBrowser = () => typeof window !== "undefined";

/**
 * Small, quick burst — e.g. a correct answer inside a mini game.
 * `origin` is normalised (0–1); pass the button's position for a local pop.
 */
export function confettiBurst(origin: { x: number; y: number } = { x: 0.5, y: 0.6 }) {
  if (!isBrowser()) return;
  void confetti({
    ...BASE,
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    origin,
  });
}

/** Burst that starts from a DOM element (e.g. the button the student tapped). */
export function confettiFromElement(el: Element | null) {
  if (!isBrowser() || !el) return confettiBurst();
  const r = el.getBoundingClientRect();
  confettiBurst({
    x: (r.left + r.width / 2) / window.innerWidth,
    y: (r.top + r.height / 2) / window.innerHeight,
  });
}

/** Two side cannons — e.g. finishing a video level. */
export function confettiSideCannons() {
  if (!isBrowser()) return;
  const shared: ConfettiOptions = { ...BASE, particleCount: 70, spread: 60, startVelocity: 55 };
  void confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.75 } });
  void confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.75 } });
}

/**
 * Big celebration — finishing a whole mini game / module.
 * Layers several bursts with different physics for a richer feel.
 * Returns a cancel function.
 */
export function celebrate(durationMs = 1800): () => void {
  if (!isBrowser()) return () => {};

  const fire = (ratio: number, opts: ConfettiOptions) =>
    void confetti({ ...BASE, origin: { y: 0.7 }, ...opts, particleCount: Math.floor(220 * ratio) });

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.25 });
  fire(0.1, { spread: 120, startVelocity: 45 });

  // Trailing side streams for the remaining duration.
  const end = Date.now() + durationMs;
  let raf = 0;
  const frame = () => {
    void confetti({ ...BASE, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
    void confetti({ ...BASE, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(raf);
}

/** Gold star shower — e.g. earning a badge ("Detektif Batasan Diri"). */
export function confettiStars() {
  if (!isBrowser()) return;
  const shared: ConfettiOptions = {
    ...BASE,
    colors: ["#F59E0B", "#FCD34D", "#FDE68A", "#14B8A6"],
    shapes: ["star"],
    spread: 360,
    ticks: 80,
    gravity: 0,
    decay: 0.94,
    startVelocity: 26,
    origin: { x: 0.5, y: 0.45 },
  };
  void confetti({ ...shared, particleCount: 40, scalar: 1.2 });
  void confetti({ ...shared, particleCount: 12, scalar: 0.75, shapes: ["circle"] });
}

/** Stop and clear all running confetti (e.g. on route change). */
export function resetConfetti() {
  if (!isBrowser()) return;
  confetti.reset();
}
