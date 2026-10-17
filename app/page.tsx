"use client";

import { useState } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Smile,
  PartyPopper,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { MascotCompanion, type MascotMood } from "@/components/ui/mascot-companion";
import {
  celebrate,
  confettiBurst,
  confettiStars,
  confettiSideCannons,
} from "@/lib/confetti";
import { useGameSound } from "@/lib/sound";

export default function Home() {
  const [studentName, setStudentName] = useState("Ahmad");
  const [avatarVariant, setAvatarVariant] = useState<"adventurer" | "fun-emoji">("adventurer");
  const [mascotMood, setMascotMood] = useState<MascotMood>("happy");
  const [mascotFeedback, setMascotFeedback] = useState<{
    title: string;
    message: string;
    tone: "neutral" | "success" | "info" | "gentle-warning";
  }>({
    title: "Halo, Sobat KENALI!",
    message: "Ayo kita belajar mengenali batasan diri dan menjaga kesehatan reproduksi dengan cara yang seru dan aman!",
    tone: "info",
  });

  const { play, muted, toggleMute } = useGameSound();

  const handleCorrectAnswerSimulation = () => {
    play("success");
    confettiBurst();
    setMascotMood("cheer");
    setMascotFeedback({
      title: "Hebat! Pilihanmu Tepat Sekali!",
      message: "Kamu memahami bahwa tubuhmu adalah otoritasmu. Menolak sentuhan yang membuatmu tidak nyaman adalah hakmu yang berani!",
      tone: "success",
    });
  };

  const handleWarningSimulation = () => {
    play("warning");
    setMascotMood("thinking");
    setMascotFeedback({
      title: "Hmm, Mari Kita Pikirkan Lagi...",
      message: "Jika ada yang memintamu merahasiakan sentuhan atau obrolan pribadi, itu tanda bahaya. Ceritakan segera pada Guru BK atau orang tua ya!",
      tone: "gentle-warning",
    });
  };

  const handleCelebrateSimulation = () => {
    play("fanfare");
    celebrate();
    setMascotMood("cheer");
    setMascotFeedback({
      title: "🎉 Selamat! Kamu Menyelesaikan Modul!",
      message: "Kamu telah meraih badge 'Detektif Batasan Diri' dan siap melangkah ke petualangan berikutnya!",
      tone: "success",
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/90 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-10 rounded-2xl bg-teal-500 border-2 border-teal-600 flex items-center justify-center text-white font-display text-xl shadow-sm">
              K
            </span>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-teal-700 leading-none">
                KENALI
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                SMP Al-Falah Rempoa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-slate-200 bg-white font-bold text-xs text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
              title={muted ? "Nyalakan Suara" : "Matikan Suara"}
            >
              {muted ? (
                <>
                  <VolumeX className="size-4 text-rose-500" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="size-4 text-teal-600" />
                  <span>Sound ON</span>
                </>
              )}
            </button>

            <StudentAvatar seed={studentName} variant={avatarVariant} size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Banner Card */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 border-b-4 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-3 text-center md:text-left flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="size-3.5 text-amber-500" />
                Setup Game-Feel Selesai!
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
                Kenali Dirimu, Lindungi Batasanmu
              </h2>
              <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
                Uji coba langsung seluruh komponen taktil, efek suara sintetis tanpa aset eksternal,
                generator avatar aman privasi, maskot interaktif, dan animasi selebrasi.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-2">
              <StudentAvatar seed={studentName} variant={avatarVariant} size="xl" />
              <span className="text-xs font-bold text-slate-400">
                Avatar Siswa: &quot;{studentName}&quot;
              </span>
            </div>
          </div>
        </section>

        {/* Mascot & Educational Feedback Interactive Area */}
        <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 border-b-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <Smile className="size-5 text-teal-500" />
              Maskot Teman KENALI &amp; Balon Umpan Balik
            </h3>
            <span className="text-xs font-bold text-slate-400">Interaktif</span>
          </div>

          <MascotCompanion
            mood={mascotMood}
            title={mascotFeedback.title}
            message={mascotFeedback.message}
            tone={mascotFeedback.tone}
            size="md"
          />

          <div className="pt-2 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-500 mr-2">Coba Ekspresi:</span>
            {(["happy", "cheer", "thinking", "calm", "supportive"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMascotMood(m);
                  play("pop");
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                  mascotMood === m
                    ? "bg-teal-500 text-white border-teal-600"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {/* 3D Tactile Buttons Showcase */}
        <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 border-b-4 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <Flame className="size-5 text-amber-500" />
              Komponen Tombol Membal (Tactile Pushable Buttons)
            </h3>
            <span className="text-xs font-bold text-slate-400">3D Game Feel</span>
          </div>
          <p className="text-xs text-slate-500">
            Setiap tombol memiliki ketebalan visual 3D, feedback tekan membal tanpa layout-shift,
            dan otomatis memicu efek suara sintetis Web Audio API.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <PushableButton
              variant="teal"
              sound="success"
              fullWidth
              icon={<ShieldCheck className="size-5" />}
              onClick={handleCorrectAnswerSimulation}
            >
              Jawaban Benar (Teal)
            </PushableButton>

            <PushableButton
              variant="rose"
              sound="warning"
              fullWidth
              icon={<AlertTriangle className="size-5" />}
              onClick={handleWarningSimulation}
            >
              Tanda Bahaya (Rose)
            </PushableButton>

            <PushableButton
              variant="amber"
              sound="fanfare"
              fullWidth
              icon={<PartyPopper className="size-5" />}
              onClick={handleCelebrateSimulation}
            >
              Selesaikan Level (Amber)
            </PushableButton>

            <PushableButton
              variant="sky"
              sound="pop"
              fullWidth
              icon={<Heart className="size-5" />}
              onClick={() => {
                confettiStars();
                setMascotMood("calm");
                setMascotFeedback({
                  title: "Diary &amp; Skrining Tenang",
                  message: "Ruang aman untuk mencurahkan isi hati. Hanya kamu yang bisa membaca diary ini.",
                  tone: "info",
                });
              }}
            >
              Skrining &amp; Diary (Sky)
            </PushableButton>

            <PushableButton
              variant="emerald"
              sound="pop"
              fullWidth
              icon={<CheckCircle2 className="size-5" />}
              onClick={() => confettiSideCannons()}
            >
              Meriam Konfeti (Emerald)
            </PushableButton>

            <PushableButton
              variant="white"
              sound="pop"
              fullWidth
              onClick={() => play("pop")}
            >
              Pilihan Netral (White)
            </PushableButton>
          </div>
        </section>

        {/* Avatar Generator Showcase */}
        <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 border-b-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="size-5 text-teal-500" />
              Generator Avatar Ramah Remaja (Menjaga Privasi Siswa)
            </h3>
            <span className="text-xs font-bold text-slate-400">@dicebear</span>
          </div>

          <p className="text-xs text-slate-500">
            Siswa tidak mengunggah foto asli. Avatar digenerate secara deterministik dari nama atau
            nama panggilan mereka, dengan filter ramah lingkungan sekolah (tanpa anting, ekspresi sopan).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ketik Nama Siswa:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Ahmad, Sarah, Budi..."
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 font-sans font-bold text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAvatarVariant("adventurer")}
                className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  avatarVariant === "adventurer"
                    ? "bg-teal-500 text-white border-teal-600"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                Gaya Adventurer
              </button>
              <button
                type="button"
                onClick={() => setAvatarVariant("fun-emoji")}
                className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  avatarVariant === "fun-emoji"
                    ? "bg-teal-500 text-white border-teal-600"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                Gaya Emoji
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-3 bg-[#FFFDF7] rounded-2xl border-2 border-dashed border-slate-200">
            <StudentAvatar seed="Fatimah" variant={avatarVariant} size="md" />
            <StudentAvatar seed="Rizky" variant={avatarVariant} size="md" />
            <StudentAvatar seed="Aisyah" variant={avatarVariant} size="md" />
            <StudentAvatar seed="Zaid" variant={avatarVariant} size="md" />
            <StudentAvatar seed={studentName} variant={avatarVariant} size="lg" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-xs font-bold text-slate-400">
        KENALI &copy; 2026 &bull; Program Studi S1 Ilmu Keperawatan &bull; SMP Al-Falah Rempoa
      </footer>
    </div>
  );
}
