/**
 * GAMIFICATION SYSTEM - APLIKASI EDUKASI "KENALI"
 * SMP Al-Falah Rempoa Ciputat, Tangerang Selatan
 * 
 * Modul terpusat untuk Badges (Lencana), Tema Kartu Profil,
 * Avatar Seeds, dan Logika Perhitungan Streak Harian.
 */

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "keamanan" | "konsistensi" | "keberanian" | "refleksi";
  color: "teal" | "amber" | "sky" | "rose" | "orange" | "purple";
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  unlockedByDefault: boolean;
  minStreak?: number;
  minXp?: number;
}

export const KENALI_BADGES: StudentBadge[] = [
  {
    id: "badge-detektif-diri",
    name: "Detektif Batasan Diri",
    description: "Menguasai batasan tubuh pribadi dan paham sentuhan yang aman vs tidak pantas.",
    icon: "🛡️",
    category: "keamanan",
    color: "teal",
    badgeBg: "bg-teal-50",
    badgeBorder: "border-teal-400",
    textColor: "text-teal-900",
    unlockedByDefault: true,
  },
  {
    id: "badge-pelindung-sesama",
    name: "Pelindung Sesama",
    description: "Cerdas mengenali bujuk rayu / manipulasi rahasia dan siap saling menjaga teman.",
    icon: "🤝",
    category: "keberanian",
    color: "amber",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-400",
    textColor: "text-amber-900",
    unlockedByDefault: true,
  },
  {
    id: "badge-suara-berani",
    name: "Master Suara Berani",
    description: "Pemberani yang tahu langkah darurat T-K-L dan siap melapor ke Guru BK / orang dewasa terpercaya.",
    icon: "📢",
    category: "keberanian",
    color: "sky",
    badgeBg: "bg-sky-50",
    badgeBorder: "border-sky-400",
    textColor: "text-sky-900",
    unlockedByDefault: true,
  },
  {
    id: "badge-streak-7",
    name: "Master Streak 7 Hari",
    description: "Menjaga kobaran api belajar aktif selama 7 hari berturut-turut tanpa padam!",
    icon: "🔥",
    category: "konsistensi",
    color: "orange",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-400",
    textColor: "text-orange-900",
    unlockedByDefault: false,
    minStreak: 7,
  },
  {
    id: "badge-pena-kejujuran",
    name: "Pena Kejujuran",
    description: "Rajin menuangkan emosi dan menjaga kesehatan mental melalui Diary Cerita yang privat.",
    icon: "✍️",
    category: "refleksi",
    color: "purple",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-400",
    textColor: "text-purple-900",
    unlockedByDefault: true,
  },
  {
    id: "badge-hati-tangguh",
    name: "Hati Tangguh & Tenang",
    description: "Berani melakukan refleksi skrining rasa cemas secara jujur demi kenyamanan diri.",
    icon: "🌱",
    category: "refleksi",
    color: "rose",
    badgeBg: "bg-rose-50",
    badgeBorder: "border-rose-400",
    textColor: "text-rose-900",
    unlockedByDefault: true,
  },
];

export type CardThemeId = "teal" | "amber" | "sky" | "rose";

export interface CardTheme {
  id: CardThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  gradientClass: string;
  cardBorder: string;
  glowColor: string;
  badgePill: string;
  mascotMood: string;
}

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  teal: {
    id: "teal",
    name: "Teal Mint",
    tagline: "Petualang Penjaga Diri",
    primaryColor: "#0d9488",
    gradientClass: "from-teal-500 via-teal-600 to-emerald-600",
    cardBorder: "border-teal-400",
    glowColor: "shadow-teal-500/25",
    badgePill: "bg-teal-100 text-teal-800 border-teal-300",
    mascotMood: "🌟",
  },
  amber: {
    id: "amber",
    name: "Sunny Amber",
    tagline: "Bintang Harapan Ceria",
    primaryColor: "#d97706",
    gradientClass: "from-amber-400 via-amber-500 to-orange-500",
    cardBorder: "border-amber-400",
    glowColor: "shadow-amber-500/25",
    badgePill: "bg-amber-100 text-amber-900 border-amber-300",
    mascotMood: "☀️",
  },
  sky: {
    id: "sky",
    name: "Soft Sky",
    tagline: "Langit Pelindung Damai",
    primaryColor: "#0284c7",
    gradientClass: "from-sky-400 via-sky-500 to-indigo-500",
    cardBorder: "border-sky-400",
    glowColor: "shadow-sky-500/25",
    badgePill: "bg-sky-100 text-sky-800 border-sky-300",
    mascotMood: "🕊️",
  },
  rose: {
    id: "rose",
    name: "Coral Rose",
    tagline: "Kobaran Semangat Muda",
    primaryColor: "#e11d48",
    gradientClass: "from-rose-400 via-rose-500 to-pink-500",
    cardBorder: "border-rose-400",
    glowColor: "shadow-rose-500/25",
    badgePill: "bg-rose-100 text-rose-800 border-rose-300",
    mascotMood: "💖",
  },
};

export const AVATAR_SEEDS_PRESET = [
  "Ahmad",
  "Fauzi",
  "Rian",
  "Budi",
  "Zahra",
  "Aisyah",
  "Nurul",
  "Dewi",
  "Alif",
  "Putra",
  "Reza",
  "Salma",
];

export const AVATAR_VARIANTS = [
  { id: "adventurer", label: "Petualang Keren", desc: "Karakter kartun ekspresif" },
  { id: "fun-emoji", label: "Emoji Lucu", desc: "Ekspresi senyum ramah" },
  { id: "adventurer-neutral", label: "Petualang Kalem", desc: "Gaya minimalis bersahabat" },
] as const;

export type AvatarVariantType = (typeof AVATAR_VARIANTS)[number]["id"];

/**
 * Mendapatkan format tanggal lokal YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface StreakUpdateResult {
  isNewDay: boolean;
  currentStreak: number;
  highestStreak: number;
  lastActiveDate: string;
  xpEarned: number;
  message: string;
}

/**
 * Menghitung pembaruan streak harian siswa berdasarkan aktivitas:
 * - Jika hari ini sudah beraktivitas: streak tetap, xp tetap.
 * - Jika aktivitas kemarin: currentStreak + 1, +50 XP bonus.
 * - Jika bolong lebih dari 1 hari: reset currentStreak ke 1, +50 XP bonus awal streak.
 * - Jika pengguna baru (belum ada lastActiveDate): currentStreak = 1, +50 XP bonus.
 */
export function calculateStreakProgress(
  lastActiveDateStr: string | null | undefined,
  currentStreak: number = 0,
  highestStreak: number = 0
): StreakUpdateResult {
  const todayStr = getTodayDateString();

  if (!lastActiveDateStr) {
    // Siswa pertama kali aktif
    const newStreak = Math.max(1, currentStreak);
    const newHighest = Math.max(newStreak, highestStreak);
    return {
      isNewDay: true,
      currentStreak: newStreak,
      highestStreak: newHighest,
      lastActiveDate: todayStr,
      xpEarned: 50,
      message: "🔥 Api Streak Menyala! Kamu memulai streak hari ke-1 (+50 XP)!",
    };
  }

  // Jika hari ini sudah tercatat
  if (lastActiveDateStr === todayStr) {
    return {
      isNewDay: false,
      currentStreak,
      highestStreak: Math.max(currentStreak, highestStreak),
      lastActiveDate: todayStr,
      xpEarned: 0,
      message: "🔥 Streak harianmu sudah aktif hari ini!",
    };
  }

  // Hitung selisih hari
  const lastDate = new Date(lastActiveDateStr);
  const today = new Date(todayStr);
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Konsisten! Lanjut streak berikutnya
    const newStreak = currentStreak + 1;
    const newHighest = Math.max(newStreak, highestStreak);
    return {
      isNewDay: true,
      currentStreak: newStreak,
      highestStreak: newHighest,
      lastActiveDate: todayStr,
      xpEarned: 50,
      message: `🔥 Keren Banget! Streak bertambah menjadi ${newStreak} Hari (+50 XP)!`,
    };
  } else if (diffDays > 1) {
    // Terlewat, nyalakan kembali api dari 1
    const newStreak = 1;
    return {
      isNewDay: true,
      currentStreak: newStreak,
      highestStreak: Math.max(highestStreak, newStreak),
      lastActiveDate: todayStr,
      xpEarned: 50,
      message: "🔥 Api Streak Dinyalakan Lagi! Mari jaga konsistensi belajar (+50 XP)!",
    };
  }

  return {
    isNewDay: false,
    currentStreak,
    highestStreak,
    lastActiveDate: todayStr,
    xpEarned: 0,
    message: "Aktivitas tercatat.",
  };
}
