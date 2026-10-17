# KENALI — Interactive Educational Web Application (Project Rules & Architecture)

## 1. Project Overview

**KENALI** adalah aplikasi web edukasi interaktif berbasis video animasi dan mini game tentang kesehatan reproduksi serta pencegahan kekerasan seksual untuk siswa usia 13–15 tahun di SMP Al-Falah Rempoa Ciputat, Tangerang Selatan (Program Studi S1 Ilmu Keperawatan).

## 2. Mandatory Skills Reference

Sebelum membuat atau memodifikasi halaman UI, komponen, maupun fitur permainan, agen WAJIB membaca dan mematuhi:

1. `.agents/skills/kenali-design-system/SKILL.md` — Aturan desain visual Anti-AI-Slop, palet warna, tipografi, dan komponen taktil.
2. `.agents/skills/gamified-ui/SKILL.md` — Mekanisme interaktif 3 Mini Game, animasi, sistem feedback edukatif, skrining, dan diary.

## 3. Tech Stack & Conventions

- **Framework:** Next.js (App Router) dengan TypeScript (`tsconfig.json`) dan Tailwind CSS.
- **Icons & Animations:** `lucide-react`, `framer-motion` (atau `motion`), dan `canvas-confetti`.
- **Backend & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Mobile-First:** Mayoritas siswa mengakses melalui smartphone. Semua layout wajib nyaman di layar mobile (360px–430px) sekaligus rapi di desktop.

## 4. User Roles & Access Control (RBAC)

Sistem wajib menggunakan Login dengan 3 peran pengguna:

1. **`siswa` (Siswa SMP usia 13–15 tahun):**
   - Menonton 3 Video Animasi edukasi secara berurutan.
   - Bermain 3 Mini Game interaktif ("Kenali Batasanku", "Aman/Tidak", "Pilih Responmu") dengan umpan balik edukatif di setiap soal.
   - Mengisi Skrining Tingkat Kecemasan (default: instrumen GAD-7 dinamis), melihat skor, kategori, dan anjuran.
   - Mengakses Menu Informasi Bantuan (kontak langsung Guru BK).
   - Menulis dan membaca Diary Cerita (100% privat, hanya bisa diakses oleh siswa pemilik akun).
2. **`admin_bk` (Admin Guru BK):**
   - Melihat rekapitulasi hasil & kategori skrining kecemasan seluruh siswa.
   - Memfilter siswa berdasarkan tingkat kecemasan untuk tindak lanjut konseling.
   - Mengelola informasi kontak layanan Guru BK.
   - **DILARANG KERAS** memiliki akses/menu untuk membaca isi Diary siswa.
3. **`admin_mahasiswa` (Admin Tim Peneliti Mahasiswa):**
   - Mengelola konten dinamis: link YouTube 3 video animasi, soal & feedback 3 mini game, serta daftar pertanyaan instrumen skrining.
   - Mengunduh (Export CSV/Excel) rekapitulasi data penelitian (partisipasi & hasil skrining).
   - **DILARANG KERAS** memiliki akses/menu untuk membaca isi Diary siswa.

## 5. Privacy & Security Rules

- Tabel `diaries` wajib menggunakan proteksi ketat (`user_id = auth.uid()`). Jangan pernah membuat API route atau tampilan di halaman Admin yang mengambil data dari tabel `diaries`.
- Sebelum siswa mengisi skrining kecemasan, wajib tampilkan halaman _Informed Consent_ (tujuan skrining, privasi bahwa hasil diketahui Guru BK, dan batasan bahwa hasil bukan diagnosis medis mutlak).
