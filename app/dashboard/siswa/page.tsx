"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Lock,
  Gamepad2,
  Sparkles,
  PhoneCall,
  Volume2,
  VolumeX,
  ArrowRight,
  RefreshCw,
  Send,
  Flame,
  Star,
  Zap,
  ShieldCheck,
  ChevronLeft,
  Compass,
  Trophy,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { AdventureStepper } from "@/components/ui/adventure-stepper";
import { MobileBottomNav, type StudentNavZone } from "@/components/layout/mobile-bottom-nav";
import { EducationalFeedbackSheet } from "@/components/ui/educational-feedback-sheet";
import {
  MOCK_VIDEOS,
  MOCK_GAME1_QUESTIONS,
  MOCK_GAME2_SITUATIONS,
  MOCK_GAME3_SCENARIOS,
  MOCK_GAD7_QUESTIONS,
  GAD7_SCALE_OPTIONS,
  calculateGad7Category,
  MOCK_STUDENT_DIARIES,
  MOCK_BK_CONTACT,
  type VideoContent,
  type StudentDiaryEntry,
} from "@/lib/mock-data";
import { saveStudentDiary, saveScreeningResult } from "@/lib/data-service";
import { useGameSound } from "@/lib/sound";
import { celebrate, confettiBurst, confettiStars } from "@/lib/confetti";

type ActiveZone = "map" | "arcade" | "screening" | "diary" | "counselor";

export default function SiswaDashboardPage() {
  const { play, muted, toggleMute } = useGameSound();

  // Navigation State
  const [activeZone, setActiveZone] = useState<ActiveZone>("map");

  // Student Gamification Stats
  const [studentName] = useState("Ahmad Fauzi");
  const [studentGrade] = useState("Kelas 8B &bull; SMP Al-Falah");
  const [xpPoints, setXpPoints] = useState(420);
  const [streakDays] = useState(3);
  const [collectedStars, setCollectedStars] = useState(8);
  const [maxStars] = useState(10);
  const [completedLevels, setCompletedLevels] = useState<number[]>([1, 2]); // Level 1 & 2 completed, Level 3 active

  // Video Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<VideoContent | null>(null);

  // Mascot Speech State
  const [mascotBubble, setMascotBubble] = useState({
    title: "Yuhuu, Sobat Ahmad!",
    text: "Satu misi lagi di Level 3 untuk membuka Badge 'Detektif Batasan Diri'!",
  });

  /* -------------------------------------------------------------------------- */
  /* Mini Game States                                                           */
  /* -------------------------------------------------------------------------- */
  const [activeGameId, setActiveGameId] = useState<1 | 2 | 3 | null>(null);

  // Game 1
  const [game1Index, setGame1Index] = useState(0);
  const [game1SelectedOpt, setGame1SelectedOpt] = useState<string | null>(null);

  // Game 2
  const [game2Index, setGame2Index] = useState(0);
  const [game2SelectedCat, setGame2SelectedCat] = useState<string | null>(null);

  // Game 3
  const [game3Index, setGame3Index] = useState(0);
  const [game3SelectedChoice, setGame3SelectedChoice] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Screening State                                                            */
  /* -------------------------------------------------------------------------- */
  const [screeningConsentGiven, setScreeningConsentGiven] = useState(false);
  const [screeningActive, setScreeningActive] = useState(false);
  const [screeningStep, setScreeningStep] = useState(0);
  const [screeningAnswers, setScreeningAnswers] = useState<number[]>([]);
  const [screeningResult, setScreeningResult] = useState<ReturnType<
    typeof calculateGad7Category
  > | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Diary State                                                                */
  /* -------------------------------------------------------------------------- */
  const [diaries, setDiaries] = useState<StudentDiaryEntry[]>(MOCK_STUDENT_DIARIES);
  const [diaryMood, setDiaryMood] = useState<StudentDiaryEntry["mood"]>("tenang");
  const [newFeeling, setNewFeeling] = useState("");
  const [newSafePlace, setNewSafePlace] = useState("");
  const [newUncomfortable, setNewUncomfortable] = useState("");
  const [newWhoCanHelp, setNewWhoCanHelp] = useState("");
  const [newFreeNote, setNewFreeNote] = useState("");
  const [diarySavedAlert, setDiarySavedAlert] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */
  const handleLevelNodeClick = (video: VideoContent) => {
    play("pop");
    setActiveVideoModal(video);
  };

  const handleCompleteVideo = (video: VideoContent) => {
    play("success");
    confettiStars();
    if (!completedLevels.includes(video.level)) {
      setCompletedLevels([...completedLevels, video.level]);
      setXpPoints((p) => p + 50);
      setCollectedStars((s) => Math.min(s + 1, maxStars));
    }
    setActiveVideoModal(null);
    setMascotBubble({
      title: "Hebat! Video Selesai!",
      text: "Kamu mendapatkan +50 XP dan +1 Bintang Belajar! Terus jelajahi dunia KENALI!",
    });
  };

  const handleSaveDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeling.trim() && !newFreeNote.trim()) return;

    play("success");
    confettiBurst();
    const newEntry: StudentDiaryEntry = {
      id: `dry-${Date.now()}`,
      studentId: "std-ahmad",
      createdAt: "Hari ini, baru saja",
      mood: diaryMood,
      answers: {
        feelingToday: newFeeling || "Saya merasa baik dan aman.",
        safePlace: newSafePlace || "Kamar tidurku.",
        uncomfortableExperience: newUncomfortable || "Semuanya aman terkendali.",
        whoCanHelp: newWhoCanHelp || "Orang tua / Guru BK.",
      },
      freeNote: newFreeNote,
      isPrivate: true,
    };

    setDiaries([newEntry, ...diaries]);
    setNewFeeling("");
    setNewSafePlace("");
    setNewUncomfortable("");
    setNewWhoCanHelp("");
    setNewFreeNote("");
    setDiarySavedAlert(true);
    setTimeout(() => setDiarySavedAlert(false), 4000);

    // Hybrid background save to Supabase / local cache
    saveStudentDiary({
      studentId: "std-ahmad",
      mood: diaryMood,
      answers: newEntry.answers,
      freeNote: newEntry.freeNote,
      isPrivate: true,
    }).catch(() => {});
  };

  const handleScreeningAnswer = (score: number) => {
    play("pop");
    const nextAnswers = [...screeningAnswers, score];
    setScreeningAnswers(nextAnswers);

    if (screeningStep + 1 < MOCK_GAD7_QUESTIONS.length) {
      setScreeningStep(screeningStep + 1);
    } else {
      const total = nextAnswers.reduce((a, b) => a + b, 0);
      const cat = calculateGad7Category(total);
      setScreeningResult(cat);
      setScreeningActive(false);
      play("fanfare");
      celebrate();
      setXpPoints((prev) => prev + 50);
      setCollectedStars((s) => Math.min(s + 1, maxStars));

      // Hybrid background save to Supabase / local cache
      saveScreeningResult({
        studentId: "std-ahmad",
        studentName: studentName,
        nickname: "Ahmad",
        gender: "Laki-laki",
        grade: "8B",
        school: "SMP Al-Falah Rempoa",
        submittedAt: new Date().toLocaleString("id-ID") + " WIB",
        gad7Answers: nextAnswers,
        totalScore: total,
        category: cat.category,
        status: "Belum Dihubungi",
        bkNotes: undefined,
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-32 font-sans select-none overflow-x-hidden">
      {/* -------------------------------------------------------------------------- */}
      {/* TOP GAMEPLAY BAR (Duolingo style stats)                                    */}
      {/* -------------------------------------------------------------------------- */}
      {/* TOP NAVBAR SISWA (MOBILE-OPTIMIZED)                                        */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              onClick={() => play("pop")}
              className="size-9 sm:size-10 rounded-2xl bg-teal-500 border-2 border-b-3 sm:border-b-4 border-teal-700 flex items-center justify-center text-white font-display text-lg sm:text-xl font-bold shadow-xs active:border-b-2 active:translate-y-[1px] transition-all shrink-0"
              title="Kembali ke Beranda"
            >
              K
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-sm sm:text-base font-bold text-slate-800 leading-none truncate">
                  {studentName}
                </h1>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 leading-none shrink-0">
                  Siswa
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-none mt-1 truncate">
                Kelas 8B &bull; SMP Al-Falah
              </p>
            </div>
          </div>

          {/* Gamified Stat Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Streak Badge */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-orange-50 border-2 border-b-3 border-orange-300 text-orange-700 font-display font-bold text-[11px] sm:text-xs shadow-2xs shrink-0"
              title="Streak Belajar Aktif"
            >
              <Flame className="size-3.5 sm:size-4 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
              <span>{streakDays} <span className="hidden sm:inline">Hari</span></span>
            </div>

            {/* Stars Badge */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-50 border-2 border-b-3 border-amber-300 text-amber-800 font-display font-bold text-[11px] sm:text-xs shadow-2xs shrink-0"
              title="Bintang Terkumpul"
            >
              <Star className="size-3.5 sm:size-4 text-amber-500 fill-amber-400 shrink-0" />
              <span>
                {collectedStars}/{maxStars}
              </span>
            </div>

            {/* XP Badge (desktop only) */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 border-2 border-b-3 border-teal-300 text-teal-800 font-display font-bold text-xs shadow-2xs shrink-0"
              title="Experience Points"
            >
              <Zap className="size-3.5 text-teal-600 fill-teal-500" />
              <span>{xpPoints} XP</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="size-8 sm:size-9 rounded-xl border-2 border-b-3 border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center active:border-b-2 active:translate-y-[1px] transition-all shrink-0 text-slate-600 shadow-2xs"
              title={muted ? "Nyalakan Suara" : "Matikan Suara"}
              aria-label="Sound Toggle"
            >
              {muted ? (
                <VolumeX className="size-3.5 sm:size-4 text-rose-500" />
              ) : (
                <Volume2 className="size-3.5 sm:size-4 text-teal-600" />
              )}
            </button>

            {/* Student Avatar */}
            <div className="shrink-0">
              <StudentAvatar seed={studentName} variant="adventurer" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                             */}
      {/* -------------------------------------------------------------------------- */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* ========================================================================= */}
        {/* HERO BANNER DENGAN MASKOT TIMBUL 3D (OVERLAPPING / POPPING OUT)          */}
        {/* ========================================================================= */}
        <section className="relative mt-8 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 border-4 border-b-8 border-teal-800 shadow-xl text-white overflow-visible">
          {/* Decorative Background Elements */}
          <div className="absolute top-2 right-4 text-4xl opacity-20 pointer-events-none select-none">
            ✨
          </div>
          <div className="absolute bottom-2 left-6 text-3xl opacity-20 pointer-events-none select-none">
            🛡️
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left Content */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-teal-400/40 border border-teal-200 text-teal-100 backdrop-blur-xs">
                <Compass className="size-3.5 text-amber-300" />
                Peta Petualangan Belajar KENALI
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
                Jelajahi Jalur &amp; Kenali Batasanmu!
              </h2>

              <p className="text-teal-100 text-xs sm:text-sm font-medium leading-relaxed max-w-lg">
                Klik pulau level di bawah untuk membuka video petualangan. Kumpulkan bintang, selesaikan
                mini game seru, dan raih badge pelindung diri!
              </p>

              {/* Progress Tracker bar */}
              <div className="pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs font-bold text-teal-100 mb-1.5">
                  <span>Progres Petualangan</span>
                  <span className="text-amber-300 font-extrabold">Level 2 Selesai &bull; 65%</span>
                </div>
                <div className="h-5 w-full bg-teal-900/60 rounded-full overflow-hidden p-1 border-2 border-teal-400/50">
                  <div
                    className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full relative transition-all duration-500 shadow-inner"
                    style={{ width: "65%" }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mascot Popping Out of Container */}
            <div className="relative shrink-0 flex flex-col items-center">
              {/* Mascot Bubble */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="relative -mt-10 sm:-mt-14 mb-2 bg-white text-slate-800 rounded-2xl border-2 border-b-4 border-slate-300 p-3 max-w-[220px] shadow-lg text-center"
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
                <p className="font-display text-xs font-bold text-teal-700 leading-tight">
                  {mascotBubble.title}
                </p>
                <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-snug">
                  {mascotBubble.text}
                </p>
              </motion.div>

              {/* Mascot Avatar Body Pop-out */}
              <div className="size-24 sm:size-28 relative transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                {/* SVG Mascot with sprout & cheering animation */}
                <svg
                  viewBox="0 0 120 120"
                  className="size-full drop-shadow-[0_8px_0_rgba(15,118,110,0.35)]"
                >
                  <g style={{ transformOrigin: "60px 26px" }}>
                    <path d="M60 28 V16" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" />
                    <path
                      d="M60 18 C52 8 42 12 44 18 C48 22 56 21 60 18 Z"
                      fill="#34D399"
                      stroke="#047857"
                      strokeWidth="2"
                    />
                    <path
                      d="M60 16 C67 5 78 9 76 15 C72 20 64 19 60 16 Z"
                      fill="#6EE7B7"
                      stroke="#047857"
                      strokeWidth="2"
                    />
                  </g>
                  <rect x="22" y="28" width="76" height="80" rx="38" fill="#0F766E" />
                  <rect x="22" y="26" width="76" height="78" rx="38" fill="#14B8A6" />
                  <ellipse cx="60" cy="82" rx="24" ry="17" fill="#CCFBF1" opacity="0.9" />
                  <ellipse cx="46" cy="55" rx="7" ry="8" fill="#fff" />
                  <ellipse cx="74" cy="55" rx="7" ry="8" fill="#fff" />
                  <circle cx="47" cy="56" r="4" fill="#1E293B" />
                  <circle cx="75" cy="56" r="4" fill="#1E293B" />
                  <circle cx="48.5" cy="53.5" r="1.4" fill="#fff" />
                  <circle cx="76.5" cy="53.5" r="1.4" fill="#fff" />
                  <ellipse cx="36" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />
                  <ellipse cx="84" cy="67" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.85" />
                  <path
                    d="M48 68 Q60 84 72 68 Z"
                    fill="#134E4A"
                    stroke="#134E4A"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BAGIAN 1: JALUR PETUALANGAN VIDEO INTERAKTIF (WINDING STEPPER / PATH)    */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 border-b-6 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-md mx-auto space-y-1 mb-8">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Jalur Petualangan Belajar
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-800">
              Peta Modul Animasi &amp; Batasan Diri
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tap setiap pulau level untuk menonton dan mengambil intisari penting!
            </p>
          </div>

          {/* Stepper Path Container with Winding Nodes */}
          <div className="relative max-w-sm sm:max-w-md mx-auto py-4">
            {/* SVG Winding Road Connector Line behind nodes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minHeight: "540px" }}
              viewBox="0 0 380 540"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Thick Gray Base Road */}
              <path
                d="M 120 70 Q 280 150 260 230 T 130 380 T 200 490"
                stroke="#E2E8F0"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              {/* Dashed Golden Path */}
              <path
                d="M 120 70 Q 280 150 260 230 T 130 380 T 200 490"
                stroke="#FBBF24"
                strokeWidth="6"
                strokeDasharray="12 12"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* NODES CONTAINER */}
            <div className="relative space-y-16 sm:space-y-20 py-4">
              {/* ----------------- LEVEL 1 (Offset Left - Selesai) ----------------- */}
              <div className="flex flex-col items-start pl-4 sm:pl-10 relative">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleLevelNodeClick(MOCK_VIDEOS[0])}
                    className="relative group size-20 sm:size-24 rounded-full bg-emerald-500 border-4 border-b-8 border-emerald-700 flex flex-col items-center justify-center text-white shadow-lg active:border-b-4 active:translate-y-1 transition-all"
                  >
                    <span className="size-8 rounded-full bg-white/20 flex items-center justify-center text-emerald-100 font-bold mb-0.5">
                      <CheckCircle2 className="size-6 text-white" />
                    </span>
                    <span className="font-display font-extrabold text-xs sm:text-sm">LVL 1</span>
                    {/* Crown badge */}
                    <span className="absolute -top-3 -right-2 text-xl drop-shadow-sm">⭐</span>
                  </motion.button>

                  {/* Level Info Banner */}
                  <div
                    onClick={() => handleLevelNodeClick(MOCK_VIDEOS[0])}
                    className="cursor-pointer bg-[#FFFDF7] p-3 rounded-2xl border-2 border-b-4 border-emerald-300 hover:border-emerald-400 transition-all max-w-[200px] sm:max-w-[230px]"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                      <CheckCircle2 className="size-3" /> Selesai Ditonton
                    </div>
                    <h4 className="font-display text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                      {MOCK_VIDEOS[0].title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Durasi 04:35</p>
                  </div>
                </div>
              </div>

              {/* ----------------- LEVEL 2 (Offset Right - Selesai) ----------------- */}
              <div className="flex flex-col items-end pr-4 sm:pr-10 relative">
                <div className="flex flex-row-reverse items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleLevelNodeClick(MOCK_VIDEOS[1])}
                    className="relative group size-20 sm:size-24 rounded-full bg-emerald-500 border-4 border-b-8 border-emerald-700 flex flex-col items-center justify-center text-white shadow-lg active:border-b-4 active:translate-y-1 transition-all"
                  >
                    <span className="size-8 rounded-full bg-white/20 flex items-center justify-center text-emerald-100 font-bold mb-0.5">
                      <CheckCircle2 className="size-6 text-white" />
                    </span>
                    <span className="font-display font-extrabold text-xs sm:text-sm">LVL 2</span>
                    <span className="absolute -top-3 -left-2 text-xl drop-shadow-sm">⭐</span>
                  </motion.button>

                  {/* Level Info Banner */}
                  <div
                    onClick={() => handleLevelNodeClick(MOCK_VIDEOS[1])}
                    className="cursor-pointer bg-[#FFFDF7] p-3 rounded-2xl border-2 border-b-4 border-emerald-300 hover:border-emerald-400 transition-all max-w-[200px] sm:max-w-[230px] text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                      Selesai Ditonton <CheckCircle2 className="size-3" />
                    </div>
                    <h4 className="font-display text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                      {MOCK_VIDEOS[1].title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Durasi 05:12</p>
                  </div>
                </div>
              </div>

              {/* ----------------- LEVEL 3 (Offset Left - AKTIF PULSING) ----------------- */}
              <div className="flex flex-col items-start pl-6 sm:pl-14 relative">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {/* Glowing Aura Ring */}
                    <span className="absolute -inset-3 rounded-full bg-amber-400/35 animate-ping" />
                    <span className="absolute -inset-1.5 rounded-full bg-amber-400/50" />

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleLevelNodeClick(MOCK_VIDEOS[2])}
                      className="relative z-10 size-22 sm:size-26 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 border-4 border-b-8 border-amber-700 flex flex-col items-center justify-center text-slate-900 shadow-2xl active:border-b-4 active:translate-y-1 transition-all"
                    >
                      <div className="size-10 rounded-full bg-white text-amber-700 flex items-center justify-center font-bold shadow-md animate-bounce mb-0.5">
                        <Play className="size-5 fill-current ml-0.5" />
                      </div>
                      <span className="font-display font-black text-xs sm:text-sm tracking-wide text-amber-950">
                        LVL 3
                      </span>
                      {/* Badge 'Misi Aktif' */}
                      <span className="absolute -bottom-3 px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider border-2 border-white shadow-sm whitespace-nowrap">
                        Misi Aktif!
                      </span>
                    </motion.button>
                  </div>

                  {/* Level Info Banner */}
                  <div
                    onClick={() => handleLevelNodeClick(MOCK_VIDEOS[2])}
                    className="cursor-pointer bg-amber-50 p-3.5 rounded-2xl border-2 border-b-4 border-amber-400 hover:border-amber-500 transition-all max-w-[200px] sm:max-w-[240px] shadow-sm"
                  >
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
                      Tonton Sekarang!
                    </span>
                    <h4 className="font-display text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-1">
                      {MOCK_VIDEOS[2].title}
                    </h4>
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      Klaim +50 XP &amp; Bintang ⭐
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------- BONUS BOSS LEVEL (Centered - LOCKED) ----------------- */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative group size-18 sm:size-20 rounded-full bg-slate-200 border-4 border-b-8 border-slate-300 flex flex-col items-center justify-center text-slate-400 shadow-inner">
                  <Lock className="size-7 text-slate-400" />
                  <span className="font-display font-extrabold text-[10px] uppercase text-slate-500 mt-0.5">
                    Terkunci
                  </span>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-display text-xs font-bold text-slate-500">
                    Tantangan Detektif Batasan Diri
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Selesaikan Level 3 untuk membuka Ujian Akhir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BAGIAN 1.5: RINCIAN MISI PETUALANGAN (ADAPTASI 21ST.DEV STEPPER)          */}
        {/* ========================================================================= */}
        <AdventureStepper
          steps={[
            {
              level: 1,
              title: MOCK_VIDEOS[0].title,
              subtitle: "Mengenal Perubahan Tubuh & Batasan Sentuhan",
              isCompleted: completedLevels.includes(1),
              isCurrent: false,
              isLocked: false,
              xpReward: 50,
              duration: MOCK_VIDEOS[0].duration,
            },
            {
              level: 2,
              title: MOCK_VIDEOS[1].title,
              subtitle: "Mengenali Bujuk Rayu & Trik Manipulasi",
              isCompleted: completedLevels.includes(2),
              isCurrent: false,
              isLocked: false,
              xpReward: 50,
              duration: MOCK_VIDEOS[1].duration,
            },
            {
              level: 3,
              title: MOCK_VIDEOS[2].title,
              subtitle: "Pencegahan & Berani Mengambil Tindakan Nyata",
              isCompleted: completedLevels.includes(3),
              isCurrent: true,
              isLocked: false,
              xpReward: 50,
              duration: MOCK_VIDEOS[2].duration,
            },
          ]}
          onSelectStep={(level) => handleLevelNodeClick(MOCK_VIDEOS[level - 1])}
        />

        {/* ========================================================================= */}
        {/* BAGIAN 2: 4 KARTU PORTAL PETUALANGAN BESAR (ZONA PETUALANGAN)            */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Aktivitas Lanjutan
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
                Zona Petualangan Siswa
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pilih portal petualangan di bawah untuk bermain game, mengisi skrining, atau curhat aman.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. PORTAL ZONA 3 MINI GAME (Kuning Ceria) */}
            <div
              onClick={() => {
                play("pop");
                setActiveZone("arcade");
                setActiveGameId(1);
              }}
              className="bg-gradient-to-b from-amber-100 to-amber-200/90 rounded-3xl p-6 border-2 border-amber-400 border-b-8 shadow-md transition-all active:border-b-2 active:translate-y-1.5 hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-14 rounded-2xl bg-amber-400 border-2 border-b-4 border-amber-600 text-amber-950 flex items-center justify-center font-display text-2xl shadow-sm group-hover:scale-105 transition-transform">
                  🎮
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-300 text-amber-950 border border-amber-400">
                  3 Mini Game
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h4 className="font-display text-xl font-extrabold text-amber-950 leading-tight">
                  Zona 3 Mini Game
                </h4>
                <p className="text-xs text-amber-900 font-semibold">
                  Uji Respon &amp; Ketangkasan Batasan Dirimu!
                </p>
                <p className="text-[11px] text-amber-800/80 leading-relaxed pt-1">
                  &bull; Kenali Batasanku &bull; Aman / Tidak &bull; Pilih Responmu
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-950 pt-3 border-t-2 border-amber-300/80">
                <span className="flex items-center gap-1">
                  <Trophy className="size-4 text-amber-600" /> +120 Total XP
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Mulai Main <ArrowRight className="size-4" />
                </span>
              </div>
            </div>

            {/* 2. PORTAL SKRINING RASA AMAN GAD-7 (Biru Langit Tenang) */}
            <div
              onClick={() => {
                play("pop");
                setActiveZone("screening");
              }}
              className="bg-gradient-to-b from-sky-100 to-sky-200/90 rounded-3xl p-6 border-2 border-sky-400 border-b-8 shadow-md transition-all active:border-b-2 active:translate-y-1.5 hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-14 rounded-2xl bg-sky-400 border-2 border-b-4 border-sky-600 text-white flex items-center justify-center font-display text-2xl shadow-sm group-hover:scale-105 transition-transform">
                  📋
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-300 text-sky-950 border border-sky-400">
                  Skrining GAD-7
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h4 className="font-display text-xl font-extrabold text-sky-950 leading-tight">
                  Skrining Rasa Aman
                </h4>
                <p className="text-xs text-sky-900 font-semibold">
                  Cek Kondisi Hatimu &amp; Tingkat Rasa Cemas
                </p>
                <p className="text-[11px] text-sky-800/80 leading-relaxed pt-1">
                  7 pertanyaan ramah remaja dengan penjelasan anjuran hangat dan rahasia.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-sky-950 pt-3 border-t-2 border-sky-300/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-4 text-sky-600" /> Bukan Vonis Medis
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Isi Kuesioner <ArrowRight className="size-4" />
                </span>
              </div>
            </div>

            {/* 3. PORTAL BUKU DIARY RAHASIA (Pink / Rose Pastel Hangat) */}
            <div
              onClick={() => {
                play("pop");
                setActiveZone("diary");
              }}
              className="bg-gradient-to-b from-rose-100 to-rose-200/90 rounded-3xl p-6 border-2 border-rose-400 border-b-8 shadow-md transition-all active:border-b-2 active:translate-y-1.5 hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-14 rounded-2xl bg-rose-400 border-2 border-b-4 border-rose-600 text-white flex items-center justify-center font-display text-2xl shadow-sm group-hover:scale-105 transition-transform">
                  🔒
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-300 text-rose-950 border border-rose-400">
                  100% Privat
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h4 className="font-display text-xl font-extrabold text-rose-950 leading-tight">
                  Buku Diary Rahasia
                </h4>
                <p className="text-xs text-rose-900 font-semibold">
                  Hanya Kamu yang Bisa Membaca Catatan Ini!
                </p>
                <p className="text-[11px] text-rose-800/80 leading-relaxed pt-1">
                  Ruang aman menulis perasaan, 4 pertanyaan pemandu, dan unek-unek tanpa rasa takut.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-rose-950 pt-3 border-t-2 border-rose-300/80">
                <span className="flex items-center gap-1">
                  <Lock className="size-4 text-rose-600" /> Guru BK Tidak Baca
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Buka Diary <ArrowRight className="size-4" />
                </span>
              </div>
            </div>

            {/* 4. PORTAL POJOK CURHAT GURU BK (Teal / Mint Ramah) */}
            <div
              onClick={() => {
                play("pop");
                setActiveZone("counselor");
              }}
              className="bg-gradient-to-b from-teal-100 to-teal-200/90 rounded-3xl p-6 border-2 border-teal-400 border-b-8 shadow-md transition-all active:border-b-2 active:translate-y-1.5 hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-14 rounded-2xl bg-teal-500 border-2 border-b-4 border-teal-700 text-white flex items-center justify-center font-display text-2xl shadow-sm group-hover:scale-105 transition-transform">
                  💬
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-teal-300 text-teal-950 border border-teal-400">
                  Layanan BK
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h4 className="font-display text-xl font-extrabold text-teal-950 leading-tight">
                  Pojok Curhat Guru BK
                </h4>
                <p className="text-xs text-teal-900 font-semibold">
                  Ngobrol Hangat Bersama {MOCK_BK_CONTACT.teacherName}
                </p>
                <p className="text-[11px] text-teal-800/80 leading-relaxed pt-1">
                  Ruang BK SMP Al-Falah siap mendengar ceritamu dengan penuh empati dan kasih sayang.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-teal-950 pt-3 border-t-2 border-teal-300/80">
                <span className="flex items-center gap-1">
                  <PhoneCall className="size-4 text-teal-700" /> WhatsApp Konseling
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Hubungi Guru BK <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* POPUP / MODAL LEVEL VIDEO PETUALANGAN                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl border-2 border-slate-200 border-b-8 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-xl bg-amber-400 text-amber-950 font-display font-black text-sm flex items-center justify-center">
                    {activeVideoModal.level}
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Level {activeVideoModal.level} &bull; {activeVideoModal.duration}
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                      {activeVideoModal.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="size-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-transform"
                >
                  ✕
                </button>
              </div>

              {/* Video Player Simulation Card */}
              <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden group shadow-inner">
                <div className="size-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white">
                  <Play className="size-8 fill-current ml-1" />
                </div>
                <p className="font-display text-sm font-bold mt-3">
                  Pemutar Animasi Petualangan Level {activeVideoModal.level}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  {activeVideoModal.topic}
                </p>
              </div>

              {/* Summary and 3 Key Takeaways */}
              <div className="space-y-3 text-xs text-slate-600">
                <p className="leading-relaxed font-medium">{activeVideoModal.summary}</p>
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-amber-300 space-y-2">
                  <strong className="text-amber-900 font-bold block text-xs flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-500" /> 3 Intisari Penting yang Wajib Kamu Ingat:
                  </strong>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                    {activeVideoModal.keyPoints.map((pt, idx) => (
                      <li key={idx} className="leading-snug">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tactile Action */}
              <div className="pt-2">
                <PushableButton
                  variant="teal"
                  size="md"
                  fullWidth
                  onClick={() => handleCompleteVideo(activeVideoModal)}
                  icon={<CheckCircle2 className="size-5" />}
                >
                  Selesai Menonton &amp; Klaim (+50 XP ⭐)
                </PushableButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OVERLAY ZONA 1: ARCADE 3 MINI GAME                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeZone === "arcade" && (
          <div className="fixed inset-0 z-40 bg-[#FFFDF7] overflow-y-auto p-4 sm:p-6 pb-28">
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {/* Header Navigation */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <button
                  onClick={() => {
                    play("pop");
                    setActiveZone("map");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-display text-xs font-bold text-slate-700 hover:border-slate-300 active:border-b-2 active:translate-y-[2px]"
                >
                  <ChevronLeft className="size-4" /> Kembali ke Peta
                </button>
                <span className="font-display font-extrabold text-sm text-amber-900 flex items-center gap-1.5">
                  <Gamepad2 className="size-5 text-amber-600" /> Arcade KENALI
                </span>
              </div>

              {/* Game Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, label: "Game 1", title: "Kenali Batasanku", icon: "🛡️" },
                  { id: 2, label: "Game 2", title: "Aman / Tidak", icon: "⚠️" },
                  { id: 3, label: "Game 3", title: "Pilih Responmu", icon: "💬" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      play("pop");
                      setActiveGameId(g.id as 1 | 2 | 3);
                    }}
                    className={`p-3 rounded-2xl border-2 border-b-4 text-center transition-all active:border-b-2 active:translate-y-[2px] ${
                      activeGameId === g.id
                        ? "bg-amber-400 text-amber-950 border-amber-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xl block">{g.icon}</span>
                    <span className="font-display text-xs font-bold block leading-tight mt-1">
                      {g.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* GAME 1 INTERACTION */}
              {activeGameId === 1 && (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 border-b-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      Soal {game1Index + 1} dari {MOCK_GAME1_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {MOCK_GAME1_QUESTIONS[game1Index].location}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">
                      Tokoh: {MOCK_GAME1_QUESTIONS[game1Index].character}
                    </span>
                    <p className="font-display text-base font-bold text-slate-800 leading-snug">
                      {MOCK_GAME1_QUESTIONS[game1Index].scenario}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">Pilih Respon Terbaikmu:</p>
                    {MOCK_GAME1_QUESTIONS[game1Index].options.map((opt) => {
                      const isSelected = game1SelectedOpt === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setGame1SelectedOpt(opt.id);
                            if (opt.isRecommended) {
                              play("success");
                              confettiBurst();
                            } else {
                              play("warning");
                            }
                          }}
                          className={`min-h-[56px] w-full p-4 rounded-2xl border-2 border-b-4 text-left transition-all text-xs sm:text-sm font-bold leading-relaxed active:border-b-2 active:translate-y-[2px] ${
                            isSelected
                              ? opt.isRecommended
                                ? "bg-teal-50 border-teal-500 text-teal-900"
                                : "bg-amber-50 border-amber-500 text-amber-900"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {/* Slide-Up Educational Feedback Sheet */}
                  {(() => {
                    const currentQ = MOCK_GAME1_QUESTIONS[game1Index];
                    const selectedOpt = currentQ.options.find((o) => o.id === game1SelectedOpt);
                    if (!selectedOpt) return null;
                    return (
                      <EducationalFeedbackSheet
                        isOpen={!!game1SelectedOpt}
                        status={selectedOpt.isRecommended ? "success" : "warning"}
                        title={selectedOpt.feedbackTitle}
                        message={selectedOpt.feedbackMessage}
                        correctBadge={selectedOpt.isRecommended ? "Respon Tepat! ⭐" : "Tips Batasan Diri 💡"}
                        nextButtonLabel={
                          game1Index + 1 < MOCK_GAME1_QUESTIONS.length
                            ? "Lanjut ke Soal Berikutnya →"
                            : "Selesai Game 1 & Lanjut ke Game 2! 🏆"
                        }
                        onNext={() => {
                          if (game1Index + 1 < MOCK_GAME1_QUESTIONS.length) {
                            setGame1Index(game1Index + 1);
                            setGame1SelectedOpt(null);
                            play("pop");
                          } else {
                            play("fanfare");
                            celebrate();
                            setXpPoints((p) => p + 40);
                            setGame1SelectedOpt(null);
                            setActiveGameId(2);
                          }
                        }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* GAME 2 INTERACTION */}
              {activeGameId === 2 && (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 border-b-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      Situasi {game2Index + 1} dari {MOCK_GAME2_SITUATIONS.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Radar Situasi</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 space-y-2">
                    <h4 className="font-display text-base font-bold text-slate-800">
                      {MOCK_GAME2_SITUATIONS[game2Index].title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {MOCK_GAME2_SITUATIONS[game2Index].story}
                    </p>
                  </div>

                  {/* 3 Categories buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500">Tentukan Status Situasi:</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setGame2SelectedCat("Aman");
                          play("pop");
                        }}
                        className={`min-h-[56px] p-3 sm:p-4 rounded-2xl border-2 border-b-4 font-display text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all active:border-b-2 active:translate-y-[2px] ${
                          game2SelectedCat === "Aman"
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <span className="text-xl mb-0.5">🛡️</span>
                        <span>Aman</span>
                      </button>

                      <button
                        onClick={() => {
                          setGame2SelectedCat("Perlu Diwaspadai");
                          play("pop");
                        }}
                        className={`min-h-[56px] p-3 sm:p-4 rounded-2xl border-2 border-b-4 font-display text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all active:border-b-2 active:translate-y-[2px] ${
                          game2SelectedCat === "Perlu Diwaspadai"
                            ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <span className="text-xl mb-0.5">⚠️</span>
                        <span>Waspada</span>
                      </button>

                      <button
                        onClick={() => {
                          setGame2SelectedCat("Tidak Aman");
                          play("pop");
                        }}
                        className={`min-h-[56px] p-3 sm:p-4 rounded-2xl border-2 border-b-4 font-display text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all active:border-b-2 active:translate-y-[2px] ${
                          game2SelectedCat === "Tidak Aman"
                            ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-rose-300"
                        }`}
                      >
                        <span className="text-xl mb-0.5">🚨</span>
                        <span>Bahaya</span>
                      </button>
                    </div>
                  </div>

                  {/* Slide-Up Educational Feedback Sheet */}
                  {(() => {
                    const currentSit = MOCK_GAME2_SITUATIONS[game2Index];
                    if (!game2SelectedCat) return null;
                    const isCorrect = game2SelectedCat === currentSit.category;
                    return (
                      <EducationalFeedbackSheet
                        isOpen={!!game2SelectedCat}
                        status={isCorrect ? "success" : "warning"}
                        title={isCorrect ? "Analisis Sangat Tepat! 🎉" : "Periksa Kunci Edukatif 💡"}
                        message={currentSit.explanation}
                        correctBadge={`Kunci: ${currentSit.category}`}
                        nextButtonLabel={
                          game2Index + 1 < MOCK_GAME2_SITUATIONS.length
                            ? "Situasi Berikutnya →"
                            : "Selesai Game 2 & Lanjut ke Game 3! 🏆"
                        }
                        onNext={() => {
                          if (game2Index + 1 < MOCK_GAME2_SITUATIONS.length) {
                            setGame2Index(game2Index + 1);
                            setGame2SelectedCat(null);
                            play("pop");
                          } else {
                            play("fanfare");
                            celebrate();
                            setXpPoints((p) => p + 40);
                            setGame2SelectedCat(null);
                            setActiveGameId(3);
                          }
                        }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* GAME 3 INTERACTION */}
              {activeGameId === 3 && (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 border-b-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      Skenario Chat {game3Index + 1} dari {MOCK_GAME3_SCENARIOS.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Simulasi Chat</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                        👤
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {MOCK_GAME3_SCENARIOS[game3Index].senderName}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-xs border-2 border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
                      {MOCK_GAME3_SCENARIOS[game3Index].incomingMessage}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">Pilih Balasanmu:</p>
                    {MOCK_GAME3_SCENARIOS[game3Index].options.map((opt) => {
                      const isSelected = game3SelectedChoice === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setGame3SelectedChoice(opt.id);
                            if (opt.isBestChoice) {
                              play("success");
                              confettiBurst();
                            } else {
                              play("warning");
                            }
                          }}
                          className={`min-h-[56px] w-full p-4 rounded-2xl border-2 border-b-4 text-left transition-all text-xs sm:text-sm font-bold active:border-b-2 active:translate-y-[2px] ${
                            isSelected
                              ? opt.isBestChoice
                                ? "bg-sky-50 border-sky-500 text-sky-900"
                                : "bg-amber-50 border-amber-500 text-amber-900"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <span className="block text-[10px] font-extrabold uppercase text-slate-400 mb-0.5">
                            {opt.label}
                          </span>
                          &quot;{opt.responseText}&quot;
                        </button>
                      );
                    })}
                  </div>

                  {/* Slide-Up Educational Feedback Sheet */}
                  {(() => {
                    const currentScen = MOCK_GAME3_SCENARIOS[game3Index];
                    const selectedOpt = currentScen.options.find((o) => o.id === game3SelectedChoice);
                    if (!selectedOpt) return null;
                    return (
                      <EducationalFeedbackSheet
                        isOpen={!!game3SelectedChoice}
                        status={selectedOpt.isBestChoice ? "success" : "warning"}
                        title={selectedOpt.feedbackTitle}
                        message={selectedOpt.feedbackMessage}
                        correctBadge={selectedOpt.isBestChoice ? "Pilihan Bijak! 🛡️" : "Saran Keamanan 💡"}
                        nextButtonLabel={
                          game3Index + 1 < MOCK_GAME3_SCENARIOS.length
                            ? "Skenario Berikutnya →"
                            : "Selesaikan Semua Game (+40 XP & ⭐) 🏆"
                        }
                        onNext={() => {
                          if (game3Index + 1 < MOCK_GAME3_SCENARIOS.length) {
                            setGame3Index(game3Index + 1);
                            setGame3SelectedChoice(null);
                            play("pop");
                          } else {
                            play("fanfare");
                            celebrate();
                            setXpPoints((p) => p + 40);
                            setCollectedStars((s) => Math.min(s + 1, maxStars));
                            setGame3SelectedChoice(null);
                            setActiveZone("map");
                            setMascotBubble({
                              title: "Juara Mini Game!",
                              text: "Semua 3 mini game telah kamu taklukkan! Kamu berhak bangga atas pemahaman batasan dirimu!",
                            });
                          }
                        }}
                      />
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OVERLAY ZONA 2: SKRINING RASA AMAN GAD-7                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeZone === "screening" && (
          <div className="fixed inset-0 z-40 bg-[#FFFDF7] overflow-y-auto p-4 sm:p-6 pb-28">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <button
                  onClick={() => {
                    play("pop");
                    setActiveZone("map");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-display text-xs font-bold text-slate-700 hover:border-slate-300 active:border-b-2 active:translate-y-[2px]"
                >
                  <ChevronLeft className="size-4" /> Kembali ke Peta
                </button>
                <span className="font-display font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
                  <ShieldCheck className="size-5 text-sky-600" /> Skrining GAD-7
                </span>
              </div>

              {!screeningConsentGiven && !screeningResult && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-300 border-b-8 shadow-sm space-y-5 text-center">
                  <div className="size-16 rounded-3xl bg-sky-100 border-2 border-sky-300 text-sky-600 flex items-center justify-center mx-auto text-3xl">
                    📋
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-slate-800">
                      Skrining Kesehatan Emosional Siswa
                    </h3>
                    <p className="text-xs font-bold text-sky-700 mt-0.5 uppercase tracking-wider">
                      Instrumen GAD-7 (Generalized Anxiety Disorder 7)
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 text-left text-xs text-slate-600 space-y-2">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="size-4 text-teal-600" /> Persetujuan Siswa (Informed Consent):
                    </p>
                    <p>&bull; Kuesioner ini membantumu mengenali kondisi rasa cemas selama 2 minggu terakhir.</p>
                    <p>&bull; <strong>Bukan Diagnosis Medis:</strong> Hasil kuesioner ini adalah bahan refleksi dan bukan label penyakit medis.</p>
                    <p>&bull; <strong>Kerahasiaan Terjaga:</strong> Hanya Guru BK yang dapat melihat rekap skor untuk memberikan bantuan jika kamu membutuhkannya.</p>
                  </div>

                  <PushableButton
                    variant="teal"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      play("pop");
                      setScreeningConsentGiven(true);
                      setScreeningActive(true);
                      setScreeningStep(0);
                      setScreeningAnswers([]);
                    }}
                    icon={<ArrowRight className="size-5" />}
                  >
                    Saya Mengerti &amp; Mulai Skrining
                  </PushableButton>
                </div>
              )}

              {screeningActive && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-300 border-b-8 shadow-sm space-y-6">
                  {/* Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Pertanyaan {screeningStep + 1} dari {MOCK_GAD7_QUESTIONS.length}</span>
                      <span className="text-sky-600 font-extrabold">
                        {Math.round(((screeningStep + 1) / MOCK_GAD7_QUESTIONS.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${((screeningStep + 1) / MOCK_GAD7_QUESTIONS.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-sky-200 space-y-2">
                    <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">
                      Dalam 2 Minggu Terakhir, Seberapa Sering Kamu:
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-slate-800 leading-snug">
                      {MOCK_GAD7_QUESTIONS[screeningStep].question}
                    </h4>
                    <p className="text-xs text-slate-500 italic">
                      💡 {MOCK_GAD7_QUESTIONS[screeningStep].guidance}
                    </p>
                  </div>

                  {/* 4 Scale Options */}
                  <div className="space-y-3">
                    {GAD7_SCALE_OPTIONS.map((opt) => (
                      <button
                        key={opt.score}
                        onClick={() => handleScreeningAnswer(opt.score)}
                        className="min-h-[58px] w-full p-4 rounded-2xl border-2 border-slate-200 border-b-4 bg-white hover:border-sky-400 hover:bg-sky-50/50 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-between text-left group shadow-xs"
                      >
                        <div>
                          <p className="font-display text-sm sm:text-base font-bold text-slate-800 group-hover:text-sky-800">
                            {opt.label}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">{opt.sub}</p>
                        </div>
                        <span className="size-8 rounded-xl bg-slate-100 group-hover:bg-sky-500 group-hover:text-white text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">
                          +{opt.score}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {screeningResult && !screeningActive && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-300 border-b-8 shadow-sm space-y-6 text-center">
                  <div className="size-20 rounded-3xl bg-teal-100 border-2 border-teal-300 text-teal-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
                    🌟
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Hasil Skrining GAD-7 Kamu
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-800 mt-1">
                      {screeningResult.category}
                    </h3>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                      Total Skor: {screeningAnswers.reduce((a, b) => a + b, 0)} / 21
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 text-left space-y-3 text-xs text-slate-700">
                    <p>{screeningResult.description}</p>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <strong className="text-teal-700 block font-bold mb-1">
                        🌱 Anjuran Untukmu:
                      </strong>
                      <p>{screeningResult.recommendation}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <PushableButton
                      variant="teal"
                      fullWidth
                      onClick={() => {
                        play("pop");
                        setActiveZone("counselor");
                      }}
                      icon={<PhoneCall className="size-4" />}
                    >
                      Hubungi Guru BK
                    </PushableButton>

                    <PushableButton
                      variant="white"
                      fullWidth
                      onClick={() => {
                        play("pop");
                        setScreeningResult(null);
                        setScreeningConsentGiven(false);
                      }}
                      icon={<RefreshCw className="size-4" />}
                    >
                      Ulangi Skrining
                    </PushableButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OVERLAY ZONA 3: BUKU DIARY RAHASIA                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeZone === "diary" && (
          <div className="fixed inset-0 z-40 bg-[#FFFDF7] overflow-y-auto p-4 sm:p-6 pb-28">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <button
                  onClick={() => {
                    play("pop");
                    setActiveZone("map");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-display text-xs font-bold text-slate-700 hover:border-slate-300 active:border-b-2 active:translate-y-[2px]"
                >
                  <ChevronLeft className="size-4" /> Kembali ke Peta
                </button>
                <span className="font-display font-extrabold text-sm text-rose-950 flex items-center gap-1.5">
                  <Lock className="size-5 text-rose-600" /> Diary Rahasia
                </span>
              </div>

              {/* Security Banner */}
              <div className="bg-rose-50 rounded-3xl p-4 sm:p-5 border-2 border-rose-300 border-b-6 flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="size-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-rose-950">
                    🔒 Ruang Aman 100% Privat
                  </h4>
                  <p className="text-xs text-rose-800 font-medium">
                    Hanya kamu yang bisa membaca tulisan ini. Guru BK maupun Admin Mahasiswa tidak
                    memiliki akses ke halaman ini.
                  </p>
                </div>
              </div>

              {diarySavedAlert && (
                <div className="p-3.5 rounded-2xl bg-teal-100 border-2 border-teal-300 text-teal-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-600" />
                  Catatan diary berhasil disimpan dengan aman di perangkatmu!
                </div>
              )}

              {/* Form Entry */}
              <form
                onSubmit={handleSaveDiary}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 border-b-6 shadow-sm space-y-4"
              >
                <div className="space-y-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-800">
                      Cerita &amp; Perasaanmu Hari Ini
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Pilih mood yang paling menggambarkan perasaanmu saat ini:
                    </p>
                  </div>

                  {/* Mood Selector Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "senang", emoji: "😊", label: "Senang" },
                      { id: "tenang", emoji: "😌", label: "Tenang" },
                      { id: "bingung", emoji: "🤔", label: "Bingung" },
                      { id: "cemas", emoji: "😟", label: "Cemas" },
                      { id: "sedih", emoji: "🛡️", label: "Tidak Aman" },
                    ].map((m) => {
                      const isSelected = diaryMood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            play("pop");
                            setDiaryMood(m.id as any);
                          }}
                          className={`min-h-[44px] px-3.5 py-2 rounded-2xl border-2 border-b-4 font-display text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:border-b-2 active:translate-y-[2px] ${
                            isSelected
                              ? "bg-rose-500 text-white border-rose-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:border-rose-300"
                          }`}
                        >
                          <span className="text-base">{m.emoji}</span>
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 mb-1">
                      1. Bagaimana perasaan tubuh &amp; hatimu hari ini?
                    </label>
                    <input
                      type="text"
                      value={newFeeling}
                      onChange={(e) => setNewFeeling(e.target.value)}
                      placeholder="Contoh: Merasa tenang dan semangat..."
                      className="w-full text-base placeholder:text-xs sm:placeholder:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 font-medium bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 mb-1">
                      2. Tempat apa yang membuatmu merasa paling aman?
                    </label>
                    <input
                      type="text"
                      value={newSafePlace}
                      onChange={(e) => setNewSafePlace(e.target.value)}
                      placeholder="Contoh: Kamarku, teras rumah..."
                      className="w-full text-base placeholder:text-xs sm:placeholder:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 font-medium bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 mb-1">
                      3. Apakah ada perlakuan orang lain yang membuatmu tidak nyaman?
                    </label>
                    <input
                      type="text"
                      value={newUncomfortable}
                      onChange={(e) => setNewUncomfortable(e.target.value)}
                      placeholder="Contoh: Ada teman yang bercanda kelewat batas..."
                      className="w-full text-base placeholder:text-xs sm:placeholder:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 font-medium bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 mb-1">
                      4. Siapa orang dewasa yang paling kamu percaya jika butuh bantuan?
                    </label>
                    <input
                      type="text"
                      value={newWhoCanHelp}
                      onChange={(e) => setNewWhoCanHelp(e.target.value)}
                      placeholder="Contoh: Ibu, Ayah, Guru BK..."
                      className="w-full text-base placeholder:text-xs sm:placeholder:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 font-medium bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 mb-1">
                      Curahan Cerita Bebas:
                    </label>
                    <textarea
                      rows={3}
                      value={newFreeNote}
                      onChange={(e) => setNewFreeNote(e.target.value)}
                      placeholder="Tuliskan apa saja tanpa takut..."
                      className="w-full text-base placeholder:text-xs sm:placeholder:text-sm p-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 font-medium bg-slate-50/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <PushableButton
                    type="submit"
                    variant="rose"
                    size="md"
                    fullWidth
                    icon={<Send className="size-4" />}
                  >
                    Simpan Catatan Privat
                  </PushableButton>
                </div>
              </form>

              {/* Saved list */}
              <div className="space-y-3">
                <h5 className="font-display text-sm font-bold text-slate-800">
                  Catatan Tersimpan ({diaries.length})
                </h5>
                {diaries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl p-4 border-2 border-slate-200 border-b-4 space-y-2 text-xs"
                  >
                    <div className="flex justify-between text-slate-400 font-bold border-b border-slate-100 pb-1">
                      <span className="text-slate-700">{entry.createdAt}</span>
                      <span className="capitalize">Mood: {entry.mood}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{entry.answers.feelingToday}</p>
                    {entry.freeNote && (
                      <p className="p-2.5 rounded-xl bg-[#FFFDF7] border border-slate-200 text-slate-600 italic">
                        &quot;{entry.freeNote}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OVERLAY ZONA 4: POJOK CURHAT GURU BK                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeZone === "counselor" && (
          <div className="fixed inset-0 z-40 bg-[#FFFDF7] overflow-y-auto p-4 sm:p-6 pb-28">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <button
                  onClick={() => {
                    play("pop");
                    setActiveZone("map");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-display text-xs font-bold text-slate-700 hover:border-slate-300 active:border-b-2 active:translate-y-[2px]"
                >
                  <ChevronLeft className="size-4" /> Kembali ke Peta
                </button>
                <span className="font-display font-extrabold text-sm text-teal-900 flex items-center gap-1.5">
                  <PhoneCall className="size-5 text-teal-600" /> Bantuan Guru BK
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-300 border-b-8 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                  <div className="size-14 rounded-2xl bg-teal-100 border-2 border-teal-300 text-teal-700 flex items-center justify-center text-3xl font-bold">
                    🧑‍🏫
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-800">
                      {MOCK_BK_CONTACT.teacherName}
                    </h3>
                    <p className="text-xs text-slate-500">{MOCK_BK_CONTACT.role}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-amber-200 text-xs text-slate-700 leading-relaxed italic">
                  &quot;{MOCK_BK_CONTACT.welcomeMessage}&quot;
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase">Kontak WhatsApp</span>
                    <p className="font-display text-base font-bold text-teal-700">
                      {MOCK_BK_CONTACT.whatsappDisplay}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase">Lokasi Ruang BK</span>
                    <p className="font-display text-xs font-bold text-slate-800">
                      {MOCK_BK_CONTACT.roomLocation}
                    </p>
                  </div>
                </div>

                <PushableButton
                  variant="amber"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    play("pop");
                    alert(`Menghubungkan ke WhatsApp Guru BK: ${MOCK_BK_CONTACT.whatsappNumber}`);
                  }}
                  icon={<PhoneCall className="size-5" />}
                >
                  Kirim Pesan WhatsApp ke Guru BK
                </PushableButton>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------------- */}
      {/* FIXED MOBILE BOTTOM NAVIGATION BAR (KHUSUS SISWA)                          */}
      {/* -------------------------------------------------------------------------- */}
      <MobileBottomNav
        activeZone={activeZone}
        onSelectZone={(zone) => {
          setActiveZone(zone);
          if (zone === "arcade" && !activeGameId) {
            setActiveGameId(1);
          }
        }}
      />
    </div>
  );
}
