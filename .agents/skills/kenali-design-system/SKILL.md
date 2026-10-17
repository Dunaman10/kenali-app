---
name: kenali-gamified-edtech-ui
description: Design system and anti-AI-slop rules for the KENALI interactive educational web app for junior high school students (ages 13-15).
---

# KENALI UI/UX & Game-Feel Guidelines (STRICT ANTI-AI-SLOP)

## 1. Visual Identity & Tone

- **Target Audience:** Indonesian Junior High School students (SMP, ages 13-15) & School Counselors (Guru BK).
- **Vibe:** Playful, tactile, safe, encouraging, and gamified (Inspired by Duolingo, Brilliant.org, and Headspace).
- **Polite & School-Appropriate:** Illustrations and avatars must be modest, friendly, and suitable for an Islamic junior high school environment (SMP Al-Falah).
- **NO AI SLOP:** Never use default dark-mode SaaS templates, neon purple/blue linear gradients, thin 1px gray borders (`border-gray-200`), or sterile corporate layouts.

## 2. Color Palette & Typography

- **Fonts:** Use `Fredoka` or `Plus Jakarta Sans` (Bold/ExtraBold) for headings and game titles; use `Nunito` (Medium/SemiBold) for body text, scenarios, and diary entries.
- **Backgrounds:** Warm Cream (`bg-[#FFFDF7]` or `bg-[#FDFBF7]`) for main screens instead of pure white.
- **Surface Cards:** Pure white (`bg-white`) with thick rounded corners (`rounded-3xl`) and chunky borders (`border-2 border-slate-200 border-b-4`).
- **Primary Accents:**
  - Teal/Mint (`#14B8A6` / `teal-500`) for primary actions, safety, and health themes.
  - Sunny Amber (`#F59E0B` / `amber-500`) for XP, badges, and progress bars.
  - Soft Sky (`#38BDF8` / `sky-400`) for calm screening & diary sections.
  - Coral Rose (`#F43F5E` / `rose-500`) for "Tidak Aman" warnings (avoid scary blood-red).

## 3. Tactile Component Rules (Game-Like Elements)

- **3D Pushable Buttons:** Every interactive button and game option MUST feel tactile:
  `rounded-2xl font-bold border-2 border-b-4 transition-all active:border-b-2 active:translate-y-[2px]`
- **Progress & Gamification:** Always show visual progress bars (chunky rounded bars with a highlight streak inside), completion badges ("Detektif Batasan Diri", "Pelindung Diri"), and friendly mascot feedback boxes.
- **Micro-interactions:** Use `motion` (Framer Motion) for springy card entrances (`type: "spring", stiffness: 300, damping: 24`), swipeable cards in Game 2, and smooth bottom-sheet modals for Educational Feedback.
