"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  HeartHandshake,
  Microscope,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Home,
  CheckCircle2,
  AlertCircle,
  AtSign,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import { MascotCompanion } from "@/components/ui/mascot-companion";
import { useGameSound } from "@/lib/sound";
import { createClient } from "@/lib/supabase/client";
import { formatUsernameToEmail, DEMO_USERS } from "@/lib/data-service";

export default function LoginPage() {
  const router = useRouter();
  const { play } = useGameSound();

  const [username, setUsername] = useState("ahmad8b");
  const [password, setPassword] = useState("kenali2026");
  const [selectedRole, setSelectedRole] = useState<"siswa" | "admin_bk" | "admin_mahasiswa">("siswa");
  const [isLoading, setIsLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  const demoAccounts = [
    {
      role: "siswa" as const,
      title: "Siswa SMP",
      subtitle: "Ahmad Fauzi (Kelas 8B)",
      username: "ahmad8b",
      targetUrl: "/dashboard/siswa",
      icon: GraduationCap,
      color: "teal",
      bgClass: "hover:border-teal-400 group-hover:bg-teal-50",
      badge: "Siswa",
    },
    {
      role: "admin_bk" as const,
      title: "Guru BK",
      subtitle: "Ibu Nurul Hidayati, S.Pd",
      username: "bk_nurul",
      targetUrl: "/dashboard/bk",
      icon: HeartHandshake,
      color: "amber",
      bgClass: "hover:border-amber-400 group-hover:bg-amber-50",
      badge: "Konselor",
    },
    {
      role: "admin_mahasiswa" as const,
      title: "Tim Peneliti",
      subtitle: "Sarah Amanda (S1 Keperawatan)",
      username: "peneliti_sarah",
      targetUrl: "/dashboard/mahasiswa",
      icon: Microscope,
      color: "sky",
      bgClass: "hover:border-sky-400 group-hover:bg-sky-50",
      badge: "Peneliti",
    },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    play("pop");
    setSelectedRole(acc.role);
    setUsername(acc.username);
    setPassword("kenali2026");
    setAuthNotice({
      type: "info",
      message: `Akun demo ${acc.title} siap digunakan. Klik tombol masuk di bawah!`,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthNotice(null);

    const cleanUsername = username.trim().toLowerCase();
    const internalEmail = formatUsernameToEmail(cleanUsername);

    // Cari target URL jika sesuai dengan salah satu demo account
    const matchedDemo = demoAccounts.find((a) => a.username === cleanUsername || a.role === selectedRole);
    let targetUrl = matchedDemo?.targetUrl || "/dashboard/siswa";

    try {
      const supabase = createClient();

      // Coba autentikasi Supabase Auth menggunakan format email internal
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: password,
      });

      if (!authError && authData?.user) {
        play("success");
        setAuthNotice({
          type: "success",
          message: `Berhasil login via Supabase Auth (${internalEmail})!`,
        });

        // Ambil role dari profile Supabase jika ada
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profile?.role === "admin_bk") {
          targetUrl = "/dashboard/bk";
        } else if (profile?.role === "admin_mahasiswa") {
          targetUrl = "/dashboard/mahasiswa";
        } else {
          targetUrl = "/dashboard/siswa";
        }

        setTimeout(() => {
          router.push(targetUrl);
        }, 600);
        return;
      }

      // Jika Supabase Auth gagal (misal user belum didaftarkan di Supabase Auth atau offline)
      // Otomatis fallback mulus ke Demo Mode agar prototipe tetap 100% dapat didemokan
      play("success");
      setAuthNotice({
        type: "success",
        message: `Masuk sebagai ${matchedDemo?.title || "Siswa"} (Mode Demo Presensi Siswa). Mengalihkan...`,
      });

      setTimeout(() => {
        router.push(targetUrl);
      }, 650);
    } catch {
      // Fallback mulus untuk demo
      play("success");
      setTimeout(() => {
        router.push(targetUrl);
      }, 450);
    }
  };

  const currentEmailPreview = formatUsernameToEmail(username);

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Navbar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b-2 border-slate-200 pb-3 mb-2">
        <Link href="/" className="flex items-center gap-2.5 group min-w-0">
          <span className="size-9 sm:size-10 rounded-2xl bg-teal-500 border-2 border-b-3 sm:border-b-4 border-teal-700 flex items-center justify-center text-white font-display text-lg sm:text-xl font-bold shadow-xs transition-transform group-hover:scale-105 active:scale-95 shrink-0">
            K
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-teal-900 leading-none">
                KENALI
              </h1>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-teal-100/90 text-teal-800 border border-teal-300/80 leading-none shrink-0">
                Masuk
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-none mt-1 truncate">
              SMP Al-Falah Rempoa
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 h-8 sm:h-9 rounded-xl border-2 border-b-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-display text-xs font-bold active:border-b-2 active:translate-y-[1px] transition-all shadow-2xs shrink-0"
        >
          <Home className="size-3.5" />
          <span className="hidden xs:inline">Beranda</span>
        </Link>
      </header>

      {/* Main Login Box */}
      <main className="max-w-4xl mx-auto w-full my-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mascot & Encouragement */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold">
              <Sparkles className="size-3.5 text-amber-500" />
              Portal Edukasi Interaktif
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Kenali Dirimu, <br />
              <span className="text-teal-600">Lindungi Batasanmu!</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Selamat datang di aplikasi edukasi kesehatan reproduksi &amp; perlindungan diri untuk siswa
              SMP Al-Falah Rempoa. Masuk untuk mengakses video animasi, mini game, dan ruang aman curhat.
            </p>

            {/* Mascot Companion */}
            <div className="pt-2">
              <MascotCompanion
                mood="cheer"
                title="Login Mudah Ramah Siswa!"
                message="Siswa cukup memasukkan Nama Pengguna (misal: ahmad8b). Tidak perlu repot mengetik email panjang!"
                tone="success"
                size="md"
              />
            </div>
          </div>

          {/* Right Column: Interactive Login Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border-2 border-slate-200 border-b-4 p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Quick Demo Switcher Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" />
                    Pilih Peran Demo (1-Klik Masuk)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Semua Akun Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {demoAccounts.map((acc) => {
                    const Icon = acc.icon;
                    const isSelected = selectedRole === acc.role;

                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleSelectDemo(acc)}
                        className={`text-left p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                          isSelected
                            ? "border-teal-500 bg-teal-50/50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`p-1.5 rounded-xl ${
                              isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="size-4" />
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {acc.badge}
                          </span>
                        </div>
                        <p className="font-display text-xs font-bold text-slate-800 leading-tight">
                          {acc.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {acc.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notice Banner */}
              <AnimatePresence>
                {authNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                      authNotice.type === "success"
                        ? "bg-teal-50 border-teal-200 text-teal-800"
                        : authNotice.type === "info"
                        ? "bg-sky-50 border-sky-200 text-sky-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {authNotice.type === "success" ? (
                      <CheckCircle2 className="size-4 shrink-0 text-teal-600" />
                    ) : authNotice.type === "info" ? (
                      <Info className="size-4 shrink-0 text-sky-600" />
                    ) : (
                      <AlertCircle className="size-4 shrink-0 text-rose-600" />
                    )}
                    <span className="font-medium">{authNotice.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form with Username-to-Email Wrapper */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 border-t-2 border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Nama Pengguna (Username)
                    </label>
                    <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                      <AtSign className="size-3" />
                      Auto-wrapper Supabase
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="size-4" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: ahmad8b"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 font-sans text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  {username.trim() && (
                    <p className="text-[11px] text-slate-400 pl-1 font-mono">
                      Email internal: <span className="text-slate-600 font-semibold">{currentEmailPreview}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="size-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 font-sans text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <PushableButton
                    type="submit"
                    variant={selectedRole === "admin_bk" ? "amber" : selectedRole === "admin_mahasiswa" ? "sky" : "teal"}
                    size="md"
                    fullWidth
                    sound="success"
                    disabled={isLoading}
                    icon={<ArrowRight className="size-5" />}
                  >
                    {isLoading ? "Menyiapkan Sesi..." : `Masuk sebagai ${demoAccounts.find((a) => a.role === selectedRole)?.title}`}
                  </PushableButton>
                </div>
              </form>

              {/* Informative Note */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-start gap-2.5 text-xs text-teal-900">
                <ShieldCheck className="size-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-teal-950 font-bold">Privasi &amp; Akses Demo:</strong> Semua akun demo siswa,
                  guru BK, dan mahasiswa peneliti aktif. Kamu juga dapat berganti peran secara instan melalui kartu di atas.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full py-4 text-center text-xs font-bold text-slate-400 border-t border-slate-200">
        KENALI &copy; 2026 &bull; Tim Peneliti S1 Keperawatan &bull; SMP Al-Falah Rempoa
      </footer>
    </div>
  );
}
