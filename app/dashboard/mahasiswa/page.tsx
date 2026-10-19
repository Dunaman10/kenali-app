"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet,
  Download,
  Gamepad2,
  Edit3,
  CheckCircle,
  Lock,
  Save,
  ShieldCheck,
  Play,
  Home,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import {
  MOCK_VIDEOS,
  MOCK_GAME1_QUESTIONS,
  MOCK_GAD7_QUESTIONS,
  MOCK_SCREENING_RECORDS,
  MOCK_RESEARCH_METRICS,
  type VideoContent,
  type Game1Question,
} from "@/lib/mock-data";
import { updateVideo } from "@/lib/data-service";
import { useGameSound } from "@/lib/sound";

type MahasiswaTab = "download" | "videos" | "games" | "screening";

export default function AdminMahasiswaDashboardPage() {
  const { play } = useGameSound();

  const [activeTab, setActiveTab] = useState<MahasiswaTab>("download");

  // Video Management State
  const [videos, setVideos] = useState<VideoContent[]>(MOCK_VIDEOS);
  const [selectedVideoLevel, setSelectedVideoLevel] = useState<1 | 2 | 3>(1);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(MOCK_VIDEOS[0].youtubeUrl);
  const [currentVideoTitle, setCurrentVideoTitle] = useState(MOCK_VIDEOS[0].title);
  const [currentKeyPoint0, setCurrentKeyPoint0] = useState(MOCK_VIDEOS[0].keyPoints[0]);
  const [currentKeyPoint1, setCurrentKeyPoint1] = useState(MOCK_VIDEOS[0].keyPoints[1]);
  const [currentKeyPoint2, setCurrentKeyPoint2] = useState(MOCK_VIDEOS[0].keyPoints[2]);

  // Mini Game Management State (Game 1 editable)
  const [game1Questions, setGame1Questions] = useState<Game1Question[]>(MOCK_GAME1_QUESTIONS);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Success toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync video form when level changes
  const handleSelectVideoLevel = (lvl: 1 | 2 | 3) => {
    play("pop");
    setSelectedVideoLevel(lvl);
    const v = videos.find((item) => item.level === lvl) || videos[0];
    setCurrentVideoUrl(v.youtubeUrl);
    setCurrentVideoTitle(v.title);
    setCurrentKeyPoint0(v.keyPoints[0] || "");
    setCurrentKeyPoint1(v.keyPoints[1] || "");
    setCurrentKeyPoint2(v.keyPoints[2] || "");
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    play("success");
    setVideos((prev) =>
      prev.map((v) => {
        if (v.level === selectedVideoLevel) {
          const updated: VideoContent = {
            ...v,
            title: currentVideoTitle,
            youtubeUrl: currentVideoUrl,
            keyPoints: [currentKeyPoint0, currentKeyPoint1, currentKeyPoint2],
          };
          updateVideo(updated).catch(() => {});
          return updated;
        }
        return v;
      })
    );
    showToast(`Video Modul Level ${selectedVideoLevel} berhasil diperbarui!`);
  };

  // CSV Export functions
  const handleExportScreeningCsv = () => {
    play("success");
    const headers = [
      "ID Skrining",
      "Nama Siswa",
      "Jenis Kelamin",
      "Kelas",
      "Waktu Pengisian",
      "Skor Total GAD-7",
      "Kategori Kecemasan",
      "Status Konseling",
    ];

    const rows = MOCK_SCREENING_RECORDS.map((r) => [
      r.id,
      `"${r.studentName}"`,
      r.gender,
      r.grade,
      `"${r.submittedAt}"`,
      r.totalScore,
      `"${r.category}"`,
      `"${r.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `data_skripsi_skrining_gad7_kenali_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File data skrining (.csv) berhasil diunduh!");
  };

  const handleExportGameEvaluationCsv = () => {
    play("success");
    const headers = [
      "Modul Edukasi",
      "Jumlah Soal",
      "Persentase Partisipasi Siswa (%)",
      "Rata-rata Ketepatan Pemahaman (%)",
    ];

    const rows = [
      ["Video Animasi 1: Perubahan Tubuh & Batasan", "3 Intisari", "88%", "100%"],
      ["Video Animasi 2: Trik Manipulasi & Grooming", "3 Intisari", "82%", "100%"],
      ["Video Animasi 3: Berani Bicara & Cari Bantuan", "3 Intisari", "81%", "100%"],
      ["Mini Game 1: Kenali Batasanku", "3 Skenario", "78%", "91%"],
      ["Mini Game 2: Aman / Tidak (Radar)", "4 Kasus", "75%", "86%"],
      ["Mini Game 3: Pilih Responmu (Chat)", "2 Skenario", "72%", "88%"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `evaluasi_pemahaman_game_kenali_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File evaluasi game (.csv) berhasil diunduh!");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-24 font-sans select-none">
      {/* -------------------------------------------------------------------------- */}
      {/* TOP NAVBAR PENELITI MAHASISWA (MOBILE-OPTIMIZED)                           */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              onClick={() => play("pop")}
              className="size-9 sm:size-10 rounded-2xl bg-sky-500 border-2 border-b-3 sm:border-b-4 border-sky-700 flex items-center justify-center text-white font-sans text-sm sm:text-base font-black shadow-xs active:border-b-2 active:translate-y-[1px] transition-all shrink-0"
              title="Kembali ke Beranda"
            >
              M
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans text-sm sm:text-base font-bold text-slate-900 leading-none truncate">
                  Portal Peneliti
                </h1>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 leading-none shrink-0">
                  S1 Ners
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-none mt-1 truncate">
                {MOCK_RESEARCH_METRICS.leadResearcher} &bull; SMP Al-Falah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border-2 border-b-3 border-slate-200 text-xs font-bold text-slate-600 shadow-2xs font-sans">
              <ShieldCheck className="size-3.5 text-teal-600" />
              Etika Riset Valid
            </span>

            <Link
              href="/"
              onClick={() => play("pop")}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl border-2 border-b-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-sans text-xs font-bold active:border-b-2 active:translate-y-[1px] transition-all shadow-2xs shrink-0"
              title="Keluar ke Beranda"
            >
              <Home className="size-3.5" />
              <span className="hidden xs:inline">Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                             */}
      {/* -------------------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-teal-100 border-2 border-teal-400 text-teal-900 text-xs font-bold flex items-center gap-2 shadow-sm font-sans"
            >
              <CheckCircle className="size-4 text-teal-600" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Research Title Card in Plain Friendly Indonesian */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-slate-200 border-b-4 sm:border-b-6 shadow-sm space-y-3 font-sans">
          <div className="space-y-2 border-b-2 border-slate-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Skripsi S1 Keperawatan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 whitespace-nowrap shrink-0">
                SMP Al-Falah Rempoa
              </span>
            </div>
            <h2 className="font-sans text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-snug">
              {MOCK_RESEARCH_METRICS.researchTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-sans">
            <div className="p-3 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border border-slate-200">
              <span className="text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold block truncate">Responden Masuk</span>
              <p className="font-sans font-bold text-sm sm:text-base text-slate-900 mt-0.5 leading-none">
                {MOCK_RESEARCH_METRICS.participatedStudents} <span className="text-slate-500 text-xs font-medium">/ {MOCK_RESEARCH_METRICS.totalEnrolledStudents} Siswa</span>
              </p>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border border-slate-200">
              <span className="text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold block truncate">Tonton Video</span>
              <p className="font-sans font-bold text-sm sm:text-base text-sky-700 mt-0.5 leading-none">
                {MOCK_RESEARCH_METRICS.averageVideoWatchRate}% <span className="text-slate-500 text-xs font-medium">Selesai</span>
              </p>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border border-slate-200">
              <span className="text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold block truncate">Skor Game</span>
              <p className="font-sans font-bold text-sm sm:text-base text-amber-700 mt-0.5 leading-none">
                {MOCK_RESEARCH_METRICS.averageQuizScorePercent}% <span className="text-slate-500 text-xs font-medium">Akurasi</span>
              </p>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border border-slate-200">
              <span className="text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold block truncate">Dosen Pembimbing</span>
              <p className="font-sans font-bold text-xs sm:text-sm text-slate-800 mt-0.5 truncate leading-none">
                {MOCK_RESEARCH_METRICS.advisor}
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* SIMPLE & CLEAN 4 MAIN TABS (RESPONSIVE SCROLLABLE ON MOBILE)               */}
        {/* -------------------------------------------------------------------------- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap font-sans">
          {[
            { id: "download", icon: "📥", label: "Unduh Data", badge: "Utama" },
            { id: "videos", icon: "🎬", label: "Kelola Video", badge: "YouTube" },
            { id: "games", icon: "🎮", label: "Kelola Game", badge: "3 Game" },
            { id: "screening", icon: "📋", label: "Instrumen GAD-7", badge: "Skrining" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  play("pop");
                  setActiveTab(tab.id as MahasiswaTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-sans text-xs sm:text-sm font-bold border-2 border-b-3 sm:border-b-4 transition-all whitespace-nowrap shrink-0 active:translate-y-[1px] ${
                  isActive
                    ? "bg-sky-500 text-white border-sky-700 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold leading-none ${
                    isActive ? "bg-sky-700 text-sky-100" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DOWNLOAD DATA PENELITIAN / SKRIPSI                                 */}
        {/* ========================================================================= */}
        {activeTab === "download" && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-slate-200 border-b-4 sm:border-b-6 shadow-sm space-y-5 sm:space-y-6 font-sans">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Format Siap Analisis
              </span>
              <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-900 mt-1">
                Pusat Unduhan Data Penelitian
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Klik tombol di bawah untuk mengunduh rekapitulasi nilai siswa. Format CSV ini sudah rapi,
                berbahasa Indonesia, dan bisa langsung dibuka di Microsoft Excel atau diimpor ke SPSS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Card 1: GAD-7 CSV */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-teal-50 to-teal-100/60 border-2 border-teal-300 border-b-4 sm:border-b-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-2xl bg-teal-500 text-white font-bold">
                      <FileSpreadsheet className="size-5 sm:size-6" />
                    </span>
                    <span className="text-xs font-bold text-teal-800 bg-teal-200/60 px-2.5 py-0.5 rounded-full font-sans">
                      78 Baris Data
                    </span>
                  </div>
                  <h4 className="font-sans text-sm sm:text-base md:text-lg font-bold text-slate-900">
                    Rekapitulasi Skrining Kecemasan (GAD-7)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Memuat ID, Nama Siswa, Jenis Kelamin, Kelas, Tanggal Pengisian, Total Skor GAD-7 (0–21),
                    dan Kategori Kecemasan siswa SMP Al-Falah.
                  </p>
                </div>

                <div className="pt-2">
                  <PushableButton
                    variant="teal"
                    size="md"
                    fullWidth
                    onClick={handleExportScreeningCsv}
                    icon={<Download className="size-4" />}
                  >
                    📥 Download Data Skrining (.CSV / Excel)
                  </PushableButton>
                </div>
              </div>

              {/* Card 2: Game Evaluation CSV */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-50 to-sky-100/60 border-2 border-sky-300 border-b-4 sm:border-b-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-2xl bg-sky-500 text-white font-bold">
                      <Gamepad2 className="size-5 sm:size-6" />
                    </span>
                    <span className="text-xs font-bold text-sky-800 bg-sky-200/60 px-2.5 py-0.5 rounded-full font-sans">
                      Evaluasi Modul
                    </span>
                  </div>
                  <h4 className="font-sans text-sm sm:text-base md:text-lg font-bold text-slate-900">
                    Rekapitulasi Evaluasi 3 Mini Game &amp; Video
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Memuat persentase ketepatan pemahaman siswa pada Game 1 (&quot;Kenali Batasanku&quot;),
                    Game 2 (&quot;Aman/Tidak&quot;), Game 3 (&quot;Pilih Responmu&quot;), dan 3 video animasi.
                  </p>
                </div>

                <div className="pt-2">
                  <PushableButton
                    variant="sky"
                    size="md"
                    fullWidth
                    onClick={handleExportGameEvaluationCsv}
                    icon={<Download className="size-4" />}
                  >
                    📥 Download Evaluasi Game (.CSV / Excel)
                  </PushableButton>
                </div>
              </div>
            </div>

            {/* Pratinjau Data Skrining (Tabel di Desktop, Stacked Cards di Mobile) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-sm sm:text-base font-bold text-slate-900">
                    Pratinjau Data Responden Siswa ({MOCK_SCREENING_RECORDS.length})
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Tampilan data langsung yang siap diekspor ke format CSV / SPSS
                  </p>
                </div>
              </div>

              {/* Mobile View (< md): STACKED ACTION CARDS (NO HORIZONTAL SCROLL) */}
              <div className="block md:hidden space-y-3">
                {MOCK_SCREENING_RECORDS.map((r) => {
                  const isSevere = r.category === "Kecemasan Berat";
                  const isModerate = r.category === "Kecemasan Sedang";
                  const isMild = r.category === "Kecemasan Ringan";
                  const badgeColor = isSevere
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : isModerate
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : isMild
                    ? "bg-sky-100 text-sky-800 border-sky-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300";

                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 border-b-4 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 font-sans">
                            <h5 className="font-sans font-bold text-sm text-slate-900">
                              {r.studentName}
                            </h5>
                            <span className="text-[11px] font-bold text-slate-400">
                              ({r.gender === "Laki-laki" ? "L" : "P"})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Kelas {r.grade} &bull; {r.submittedAt}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-sans ${badgeColor}`}
                        >
                          {r.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-sans">
                        <span className="text-slate-500 font-medium">Skor GAD-7:</span>
                        <span className="font-sans font-bold text-sm text-slate-800">
                          {r.totalScore} / 21
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Status Konseling:</span>
                        <span className="text-xs font-bold text-teal-800">
                          {r.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View (>= md): TABLE VIEW */}
              <div className="hidden md:block overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b-2 border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Skor GAD-7</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {MOCK_SCREENING_RECORDS.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-bold text-slate-800">{r.studentName}</td>
                        <td className="p-3">{r.grade}</td>
                        <td className="p-3">{r.gender}</td>
                        <td className="p-3 text-slate-500">{r.submittedAt}</td>
                        <td className="p-3 font-sans font-bold text-slate-800">{r.totalScore} / 21</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200">
                            {r.category}
                          </span>
                        </td>
                        <td className="p-3 text-teal-700 font-semibold">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ethics Assurance */}
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 flex items-start gap-3 text-xs text-slate-600 font-sans">
              <Lock className="size-4 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-800 font-bold">Catatan Etika Penelitian:</strong> Data curahan
                hati siswa di buku diary bersifat sangat privat dan tidak diikutsertakan dalam berkas unduhan
                demi mematuhi persetujuan etik penelitian keperawatan.
              </p>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: KELOLA 3 VIDEO EDUKASI (SIMPLE & PREVIEW LANGSUNG)                  */}
        {/* ========================================================================= */}
        {activeTab === "videos" && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-slate-200 border-b-4 sm:border-b-6 shadow-sm space-y-5 sm:space-y-6 font-sans">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Konten Dinamis
              </span>
              <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-900 mt-1">
                Ganti Tautan Video &amp; Intisari Edukasi
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pilih modul video yang ingin diperbarui, masukkan link YouTube baru, dan klik &quot;Simpan Video&quot;.
              </p>
            </div>

            {/* Level Selector Pills */}
            <div className="flex items-center gap-2 font-sans">
              <span className="text-xs font-bold text-slate-500 mr-1">Pilih Modul:</span>
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSelectVideoLevel(lvl as 1 | 2 | 3)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl font-sans text-xs font-bold border-2 border-b-3 sm:border-b-4 transition-all active:translate-y-[1px] ${
                    selectedVideoLevel === lvl
                      ? "bg-amber-400 text-amber-950 border-amber-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  🎬 Modul {lvl}
                </button>
              ))}
            </div>

            {/* Form & Live Video Preview */}
            <form onSubmit={handleSaveVideo} className="space-y-4 pt-2 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Judul Materi Modul:</label>
                  <input
                    type="text"
                    value={currentVideoTitle}
                    onChange={(e) => setCurrentVideoTitle(e.target.value)}
                    required
                    className="w-full text-base placeholder:text-xs px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Tautan YouTube:</label>
                  <input
                    type="text"
                    value={currentVideoUrl}
                    onChange={(e) => setCurrentVideoUrl(e.target.value)}
                    required
                    className="w-full text-base placeholder:text-xs px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="space-y-1 text-xs">
                <label className="block font-bold text-slate-700">Pratinjau Video (Live Preview):</label>
                <div className="aspect-video w-full rounded-2xl bg-slate-900 border-2 border-slate-300 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden group shadow-inner">
                  <div className="size-14 sm:size-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="size-7 sm:size-8 fill-current ml-1" />
                  </div>
                  <p className="font-sans text-xs sm:text-sm font-bold mt-3 text-center px-4">{currentVideoTitle}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-full px-4">{currentVideoUrl}</p>
                </div>
              </div>

              {/* 3 Key Points */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700">
                  3 Intisari Pembelajaran (Ditampilkan di bawah video siswa):
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentKeyPoint0}
                    onChange={(e) => setCurrentKeyPoint0(e.target.value)}
                    placeholder="Poin Intisari 1"
                    className="w-full text-base placeholder:text-xs px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={currentKeyPoint1}
                    onChange={(e) => setCurrentKeyPoint1(e.target.value)}
                    placeholder="Poin Intisari 2"
                    className="w-full text-base placeholder:text-xs px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={currentKeyPoint2}
                    onChange={(e) => setCurrentKeyPoint2(e.target.value)}
                    placeholder="Poin Intisari 3"
                    className="w-full text-base placeholder:text-xs px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <PushableButton
                  type="submit"
                  variant="amber"
                  size="md"
                  icon={<Save className="size-4" />}
                >
                  Simpan Video Level {selectedVideoLevel}
                </PushableButton>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KELOLA SOAL MINI GAME & FEEDBACK EDUKATIF                          */}
        {/* ========================================================================= */}
        {activeTab === "games" && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-slate-200 border-b-4 sm:border-b-6 shadow-sm space-y-5 sm:space-y-6 font-sans">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Skenario &amp; Feedback
              </span>
              <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-900 mt-1">
                Kelola Soal &amp; Kalimat Umpan Balik Mini Game
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pendidik atau peneliti dapat menyesuaikan narasi situasi dan pesan edukatif agar relevan
                dengan kondisi terkini siswa SMP Al-Falah.
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {game1Questions.map((q, idx) => {
                const isEditing = editingQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl border-2 border-slate-200 border-b-6 bg-[#FFFDF7] space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="size-7 rounded-xl bg-teal-500 text-white font-sans font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-sans text-sm font-bold text-slate-900">
                          {q.character} ({q.location})
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Zona: {q.touchZone}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 text-xs pt-1">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Teks Narasi Skenario:
                          </label>
                          <textarea
                            rows={2}
                            defaultValue={q.scenario}
                            id={`edit-scenario-${q.id}`}
                            className="w-full text-base placeholder:text-xs p-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-teal-400 font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block font-bold text-slate-700">3 Pilihan Respon Siswa:</label>
                          {q.options.map((opt, optIdx) => (
                            <div key={opt.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold text-teal-700">
                                Opsi {optIdx + 1} {opt.isRecommended ? "(Rekomendasi Terbaik)" : ""}
                              </span>
                              <input
                                type="text"
                                defaultValue={opt.text}
                                id={`edit-opt-${q.id}-${opt.id}`}
                                className="w-full text-base placeholder:text-xs px-2.5 py-2 rounded-lg border border-slate-200 font-medium"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingQuestionId(null)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-600"
                          >
                            Batal
                          </button>
                          <PushableButton
                            variant="teal"
                            size="sm"
                            onClick={() => {
                              play("success");
                              const newScenario = (
                                document.getElementById(`edit-scenario-${q.id}`) as HTMLTextAreaElement
                              )?.value;
                              setGame1Questions((prev) =>
                                prev.map((item) =>
                                  item.id === q.id ? { ...item, scenario: newScenario || item.scenario } : item
                                )
                              );
                              setEditingQuestionId(null);
                              showToast("Skenario soal berhasil disimpan!");
                            }}
                          >
                            Simpan Soal
                          </PushableButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {q.scenario}
                        </p>

                        <div className="space-y-1 text-xs">
                          <strong className="text-slate-500 font-bold block text-[11px]">
                            Opsi Respon:
                          </strong>
                          {q.options.map((opt) => (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-xl text-[11px] font-medium border ${
                                opt.isRecommended
                                  ? "bg-teal-50 text-teal-900 border-teal-200"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              {opt.isRecommended ? "⭐ " : "• "} {opt.text}
                            </div>
                          ))}
                        </div>

                        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                          <strong className="font-bold flex items-center gap-1.5">
                            💡 Umpan Balik Edukatif Jawaban:
                          </strong>
                          <p className="text-[11px] leading-relaxed">
                            {q.options[0].feedbackMessage}
                          </p>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              play("pop");
                              setEditingQuestionId(q.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-slate-200 bg-white hover:border-teal-400 font-bold text-xs text-slate-700 active:scale-95 transition-all"
                          >
                            <Edit3 className="size-3.5 text-teal-600" />
                            Edit Skenario Soal Ini
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PENGATURAN SKRINING GAD-7                                          */}
        {/* ========================================================================= */}
        {activeTab === "screening" && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-slate-200 border-b-4 sm:border-b-6 shadow-sm space-y-5 sm:space-y-6 font-sans">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Instrumen Baku
              </span>
              <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-900 mt-1">
                7 Butir Pertanyaan Kuesioner GAD-7
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kuesioner ini dirancang untuk mendeteksi tanda-tanda kecemasan siswa dalam 2 minggu terakhir.
              </p>
            </div>

            <div className="space-y-3">
              {MOCK_GAD7_QUESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-[#FFFDF7] flex items-start gap-3.5 text-xs font-sans"
                >
                  <span className="size-8 rounded-xl bg-sky-500 text-white font-sans font-bold text-sm flex items-center justify-center shrink-0">
                    {item.id}
                  </span>
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-sm text-slate-900 leading-snug">
                      {item.question}
                    </p>
                    <p className="text-slate-500 font-medium">
                      💡 <strong>Petunjuk untuk Siswa:</strong> {item.guidance}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
              <strong className="font-bold block">Rentang Penilaian Skor GAD-7:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <strong>0 - 4:</strong> Minimal (Kondisi Stabil)
                </div>
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <strong>5 - 9:</strong> Ringan (Stres Biasa)
                </div>
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <strong>10 - 14:</strong> Sedang (Dampingi)
                </div>
                <div className="p-2 rounded-xl bg-white border border-sky-100">
                  <strong>15 - 21:</strong> Berat (Konseling Prioritas)
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
