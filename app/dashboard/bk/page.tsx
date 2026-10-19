"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Search,
  Lock,
  PhoneCall,
  Save,
  MessageCircle,
  Edit3,
  Calendar,
  Home,
} from "lucide-react";
import { PushableButton } from "@/components/ui/pushable-button";
import {
  MOCK_SCREENING_RECORDS,
  MOCK_BK_CONTACT,
  type StudentScreeningRecord,
} from "@/lib/mock-data";
import { getScreeningRecords, updateScreeningFollowUp } from "@/lib/data-service";
import { useGameSound } from "@/lib/sound";

type ViewTab = "priority" | "all" | "contact";

export default function AdminBkDashboardPage() {
  const { play } = useGameSound();

  const [records, setRecords] = useState<StudentScreeningRecord[]>(MOCK_SCREENING_RECORDS);
  const [activeTab, setActiveTab] = useState<ViewTab>("priority");
  const [searchQuery, setSearchQuery] = useState("");

  // Student WhatsApp modal
  const [waModalStudent, setWaModalStudent] = useState<StudentScreeningRecord | null>(null);

  // Student notes modal
  const [noteModalStudent, setNoteModalStudent] = useState<StudentScreeningRecord | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState("");

  // Contact settings state
  const [waNumber, setWaNumber] = useState(MOCK_BK_CONTACT.whatsappDisplay);
  const [hours, setHours] = useState(MOCK_BK_CONTACT.operatingHours);
  const [welcomeMsg, setWelcomeMsg] = useState(MOCK_BK_CONTACT.welcomeMessage);
  const [contactSavedAlert, setContactSavedAlert] = useState(false);

  // Quick toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics
  const priorityStudents = records.filter(
    (r) => r.category === "Kecemasan Sedang" || r.category === "Kecemasan Berat"
  );
  const stableStudents = records.filter(
    (r) => r.category === "Kecemasan Minimal" || r.category === "Kecemasan Ringan"
  );
  const completedCount = records.filter((r) => r.status === "Selesai Konseling").length;

  // Active records based on tab
  const displayedRecords = (activeTab === "priority" ? priorityStudents : records).filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    play("pop");
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const nextStatus =
          rec.status === "Selesai Konseling"
            ? "Sedang Didampingi"
            : rec.status === "Sedang Didampingi"
            ? "Selesai Konseling"
            : "Sedang Didampingi";
        showToast(`Status ${rec.studentName} diperbarui: ${nextStatus}`);
        updateScreeningFollowUp(rec.id, nextStatus, rec.bkNotes).catch(() => {});
        return { ...rec, status: nextStatus };
      })
    );
  };

  const handleSaveNotes = (id: string, notes: string) => {
    play("success");
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          updateScreeningFollowUp(id, rec.status, notes).catch(() => {});
          return { ...rec, bkNotes: notes };
        }
        return rec;
      })
    );
    setNoteModalStudent(null);
    showToast("Catatan konselor berhasil disimpan!");
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    play("success");
    setContactSavedAlert(true);
    setTimeout(() => setContactSavedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-24 font-sans select-none">
      {/* -------------------------------------------------------------------------- */}
      {/* TOP NAVBAR GURU BK (MOBILE-OPTIMIZED)                                      */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              onClick={() => play("pop")}
              className="size-9 sm:size-10 rounded-2xl bg-amber-500 border-2 border-b-3 sm:border-b-4 border-amber-700 flex items-center justify-center text-white font-display text-sm sm:text-base font-bold shadow-xs active:border-b-2 active:translate-y-[1px] transition-all shrink-0"
              title="Kembali ke Beranda"
            >
              BK
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-sm sm:text-base font-bold text-slate-800 leading-none truncate">
                  Ruang Guru BK
                </h1>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 leading-none shrink-0">
                  Konselor
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-none mt-1 truncate">
                Ibu Nurul, S.Pd &bull; SMP Al-Falah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border-2 border-b-3 border-slate-200 text-xs font-bold text-slate-600 shadow-2xs">
              <Calendar className="size-3.5 text-amber-500" />
              TA 2026/2027
            </span>

            <Link
              href="/"
              onClick={() => play("pop")}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl border-2 border-b-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-display text-xs font-bold active:border-b-2 active:translate-y-[1px] transition-all shadow-2xs shrink-0"
              title="Keluar ke Beranda"
            >
              <Home className="size-3.5" />
              <span className="hidden xs:inline">Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                          */}
      {/* -------------------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-teal-100 border-2 border-teal-400 text-teal-900 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <CheckCircle className="size-4 text-teal-600" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warm Privacy Protection Note (Human-friendly, no scary warning) */}
        <section className="bg-sky-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-sky-300 border-b-4 sm:border-b-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 font-sans">
          <div className="flex items-start gap-3">
            <div className="size-10 sm:size-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="size-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <h3 className="font-sans text-sm sm:text-base font-bold text-sky-950 flex items-center gap-1.5 leading-snug">
                Privasi Siswa Terjaga Penuh 🔒
              </h3>
              <p className="text-sky-800/90 font-medium leading-relaxed text-xs">
                Halaman ini memuat hasil skrining kecemasan siswa untuk kebutuhan pendampingan konseling
                SMP Al-Falah. Catatan diary pribadi siswa tetap 100% terkunci dan terlindungi demi menjaga
                rasa aman anak.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-white text-sky-800 text-[11px] font-bold border border-sky-200 shadow-2xs">
            Aman &amp; Rahasia
          </span>
        </section>

        {/* Quick Action Metrics Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 font-sans">
          <div
            onClick={() => setActiveTab("priority")}
            className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-b-4 sm:border-b-5 cursor-pointer transition-all active:translate-y-[1px] ${
              activeTab === "priority"
                ? "bg-amber-100/90 border-amber-400 text-amber-950 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-amber-300"
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block text-amber-800 truncate">
              Perlu Pendampingan
            </span>
            <p className="font-sans text-xl sm:text-2xl font-bold mt-1 text-amber-700 leading-none">
              {priorityStudents.length} <span className="text-xs sm:text-sm font-semibold text-amber-900/70">Siswa</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-amber-800/80 font-semibold mt-1 leading-tight">
              Kecemasan Sedang &amp; Berat
            </p>
          </div>

          <div
            onClick={() => setActiveTab("all")}
            className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-b-4 sm:border-b-5 cursor-pointer transition-all active:translate-y-[1px] ${
              activeTab === "all"
                ? "bg-teal-100/90 border-teal-400 text-teal-950 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block text-teal-800 truncate">
              Total Siswa Skrining
            </span>
            <p className="font-sans text-xl sm:text-2xl font-bold mt-1 text-teal-700 leading-none">
              {records.length} <span className="text-xs sm:text-sm font-semibold text-teal-900/70">Siswa</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-teal-800/80 font-semibold mt-1 leading-tight">
              Semua Kelas 7, 8, 9
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border-2 border-slate-200 border-b-4 sm:border-b-5 text-slate-700 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block text-emerald-700 truncate">
              Kondisi Stabil / Rileks
            </span>
            <p className="font-sans text-xl sm:text-2xl font-bold mt-1 text-emerald-700 leading-none">
              {stableStudents.length} <span className="text-xs sm:text-sm font-semibold text-slate-500">Siswa</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mt-1 leading-tight">
              Minimal &amp; Ringan
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border-2 border-slate-200 border-b-4 sm:border-b-5 text-slate-700 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block text-teal-700 truncate">
              Sudah Dikonseling
            </span>
            <p className="font-sans text-xl sm:text-2xl font-bold mt-1 text-teal-700 leading-none">
              {completedCount} <span className="text-xs sm:text-sm font-semibold text-slate-500">Selesai</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mt-1 leading-tight">
              Tindak Lanjut Berjalan
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* TWO SIMPLE TABS + CONTACT SETTING (RESPONSIVE SCROLLABLE ON MOBILE)        */}
        {/* -------------------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 font-sans">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
            <button
              onClick={() => {
                play("pop");
                setActiveTab("priority");
              }}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-sans text-xs sm:text-sm font-bold border-2 border-b-3 sm:border-b-4 transition-all whitespace-nowrap shrink-0 active:translate-y-[1px] ${
                activeTab === "priority"
                  ? "bg-amber-400 text-amber-950 border-amber-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>⚠️ <span className="xs:hidden">Perlu Tindak</span><span className="hidden xs:inline">Perlu Pendampingan</span></span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-950/15 text-[11px] font-extrabold leading-none">
                {priorityStudents.length}
              </span>
            </button>

            <button
              onClick={() => {
                play("pop");
                setActiveTab("all");
              }}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-sans text-xs sm:text-sm font-bold border-2 border-b-3 sm:border-b-4 transition-all whitespace-nowrap shrink-0 active:translate-y-[1px] ${
                activeTab === "all"
                  ? "bg-teal-500 text-white border-teal-700 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>👥 Semua Siswa</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/10 text-[11px] font-extrabold leading-none">
                {records.length}
              </span>
            </button>

            <button
              onClick={() => {
                play("pop");
                setActiveTab("contact");
              }}
              className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-sans text-xs sm:text-sm font-bold border-2 border-b-3 sm:border-b-4 transition-all whitespace-nowrap shrink-0 active:translate-y-[1px] ${
                activeTab === "contact"
                  ? "bg-sky-400 text-sky-950 border-sky-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              ⚙️ <span className="xs:hidden">Kontak BK</span><span className="hidden xs:inline">Pengaturan Kontak</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== "contact" && (
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-sm placeholder:text-xs font-sans font-medium focus:outline-none focus:border-amber-400 bg-white"
              />
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* STUDENT CARD LIST (NO COLD GRAY CORPORATE TABLE!)                          */}
        {/* -------------------------------------------------------------------------- */}
        {activeTab !== "contact" && (
          <div className="space-y-4">
            {displayedRecords.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 border-b-6 text-center space-y-2">
                <span className="text-3xl">✨</span>
                <h4 className="font-display text-base font-bold text-slate-800">
                  Tidak Ada Siswa yang Sesuai Pencarian
                </h4>
                <p className="text-xs text-slate-500">
                  Coba kata kunci lain atau beralih ke tab &quot;Semua Siswa&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedRecords.map((student) => {
                  const isSevere = student.category === "Kecemasan Berat";
                  const isModerate = student.category === "Kecemasan Sedang";
                  const isMild = student.category === "Kecemasan Ringan";

                  // Friendly Color Theming
                  const cardTheme = isSevere
                    ? "border-rose-300 bg-rose-50/40"
                    : isModerate
                    ? "border-amber-300 bg-amber-50/40"
                    : isMild
                    ? "border-sky-200 bg-white"
                    : "border-emerald-200 bg-white";

                  const badgeTheme = isSevere
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : isModerate
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : isMild
                    ? "bg-sky-100 text-sky-800 border-sky-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300";

                  const badgeEmoji = isSevere ? "🚨" : isModerate ? "⚠️" : isMild ? "🌱" : "🛡️";

                  return (
                    <div
                      key={student.id}
                      className={`rounded-3xl p-5 border-2 border-b-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${cardTheme}`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 font-sans">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-sans text-sm sm:text-base font-bold text-slate-900 leading-tight">
                              {student.studentName}
                            </h4>
                            <span className="text-[11px] font-bold text-slate-400">
                              ({student.gender === "Laki-laki" ? "L" : "P"})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Kelas {student.grade} &bull; SMP Al-Falah Rempoa
                          </p>
                        </div>

                        {/* Anxiety Category Badge */}
                        <div
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-2xs whitespace-nowrap flex items-center gap-1 font-sans ${badgeTheme}`}
                        >
                          <span>{badgeEmoji}</span>
                          <span>{student.category}</span>
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5 font-sans">
                        <div className="flex items-center justify-between text-slate-500 font-medium text-[11px]">
                          <span>Waktu Pengisian:</span>
                          <span className="font-bold text-slate-700">{student.submittedAt}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500 font-medium text-[11px]">
                          <span>Skor GAD-7:</span>
                          <span className="font-sans font-bold text-sm text-slate-800">
                            {student.totalScore} <span className="text-slate-400 text-xs font-normal">/ 21</span>
                          </span>
                        </div>

                        {student.bkNotes && (
                          <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                            <strong className="text-slate-700 font-bold block mb-0.5">
                              Catatan Konselor:
                            </strong>
                            <p className="italic">&quot;{student.bkNotes}&quot;</p>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons (Mobile-first Thumb-friendly Stacked Layout) */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-sans">
                        {/* WhatsApp Button */}
                        <button
                          onClick={() => {
                            play("pop");
                            setWaModalStudent(student);
                          }}
                          className="min-h-[42px] flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl bg-teal-500 text-white font-sans text-xs sm:text-sm font-bold border-2 border-b-3 sm:border-b-4 border-teal-700 active:translate-y-[1px] transition-all shadow-xs"
                        >
                          <MessageCircle className="size-4" />
                          <span>Chat Siswa / Wali</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Status Toggle Button */}
                          <button
                            onClick={() => handleToggleStatus(student.id)}
                            className={`min-h-[42px] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl font-sans text-xs font-bold border-2 border-b-3 sm:border-b-4 active:translate-y-[1px] transition-all ${
                              student.status === "Selesai Konseling"
                                ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                            title="Klik untuk mengubah status pendampingan"
                          >
                            {student.status === "Selesai Konseling" ? "✔️ Selesai" : "⏳ Tandai Konseling"}
                          </button>

                          {/* Notes Edit Button */}
                          <button
                            onClick={() => {
                              play("pop");
                              setNoteModalStudent(student);
                              setCurrentNoteText(student.bkNotes || "");
                            }}
                            className="min-h-[42px] size-10 sm:size-11 flex items-center justify-center rounded-xl sm:rounded-2xl border-2 border-b-3 sm:border-b-4 border-slate-300 bg-white text-slate-600 hover:text-amber-700 active:translate-y-[1px] shrink-0"
                            title="Tulis Catatan Konseling"
                          >
                            <Edit3 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* TAB 3: PENGATURAN INFORMASI KONTAK BK                                      */}
        {/* -------------------------------------------------------------------------- */}
        {activeTab === "contact" && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 border-b-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">
                  Pengaturan Kontak Layanan Guru BK
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini ditampilkan di dashboard siswa agar anak merasa mudah dan aman menghubungi Ibu Nurul.
                </p>
              </div>
              {contactSavedAlert && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="size-4" /> Tersimpan!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nomor WhatsApp Konseling</label>
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Jam Piket / Konsultasi Ruang BK</label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Pesan Pembuka Hangat untuk Siswa</label>
                <textarea
                  rows={3}
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-medium leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <PushableButton
                  type="submit"
                  variant="amber"
                  size="md"
                  icon={<Save className="size-4" />}
                >
                  Simpan Perubahan Kontak BK
                </PushableButton>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: PREFILL WHATSAPP CHAT KE SISWA / WALI                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {waModalStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl border-2 border-slate-200 border-b-8 max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <MessageCircle className="size-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-800 leading-tight">
                      Kirim Pesan WhatsApp Ramah
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      Kepada: {waModalStudent.studentName} ({waModalStudent.grade})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setWaModalStudent(null)}
                  className="size-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Template Message Box */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700">
                  Draf Pesan Pendampingan (Bisa Diedit):
                </label>
                <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-slate-700 leading-relaxed font-sans font-medium space-y-2">
                  <p>
                    &quot;Assalamualaikum wr. wb. Halo ananda <strong>{waModalStudent.nickname}</strong>,
                    bagaimana kabarnya hari ini?&quot;
                  </p>
                  <p>
                    &quot;Ibu Nurul melihat hasil refleksi di aplikasi KENALI. Ibu ingin mengobrol santai
                    saja saat istirahat besok di Ruang BK sambil makan camilan. Tidak perlu cemas ya nak,
                    ini obrolan rahasia kita berdua.&quot;
                  </p>
                  <p>&quot;Kira-kira ananda lebih nyaman hari apa ya? Terima kasih banyak ya.&quot;</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                💡 <strong>Catatan:</strong> Tombol di bawah akan membuka tautan WhatsApp Web / App
                langsung ke nomor kontak terdaftar.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <PushableButton
                  variant="white"
                  size="sm"
                  onClick={() => setWaModalStudent(null)}
                >
                  Tutup
                </PushableButton>
                <PushableButton
                  variant="teal"
                  size="sm"
                  onClick={() => {
                    play("success");
                    alert(
                      `Membuka WhatsApp ke wali / ananda ${waModalStudent.studentName} dengan draf pesan ramah.`
                    );
                    setWaModalStudent(null);
                  }}
                  icon={<PhoneCall className="size-4" />}
                >
                  Buka WhatsApp Chat
                </PushableButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: CATATAN KONSELOR INTERNAL                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {noteModalStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl border-2 border-slate-200 border-b-8 max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                <div>
                  <h4 className="font-display text-base font-bold text-slate-800">
                    Catatan Pendampingan: {noteModalStudent.studentName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Kategori: {noteModalStudent.category} (Skor: {noteModalStudent.totalScore}/21)
                  </p>
                </div>
                <button
                  onClick={() => setNoteModalStudent(null)}
                  className="size-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="block font-bold text-slate-700">Catatan Internal Guru BK:</label>
                <textarea
                  rows={4}
                  value={currentNoteText}
                  onChange={(e) => setCurrentNoteText(e.target.value)}
                  placeholder="Tuliskan hasil obrolan konseling, respon anak, atau rencana tindak lanjut..."
                  className="w-full p-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <PushableButton
                  variant="white"
                  size="sm"
                  onClick={() => setNoteModalStudent(null)}
                >
                  Batal
                </PushableButton>
                <PushableButton
                  variant="amber"
                  size="sm"
                  onClick={() => handleSaveNotes(noteModalStudent.id, currentNoteText)}
                  icon={<Save className="size-4" />}
                >
                  Simpan Catatan
                </PushableButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
