---
name: gamified-ui
description: Interactive game mechanics, educational feedback modals, screening flows, and private diary UX patterns for KENALI. Use this skill when building features for students.
---

# Gamified UI & Interactive Mechanics for KENALI

## 1. General Gamification Principles

- Setiap permainan wajib memiliki **Layar Pengantar Konsep** singkat sebelum mulai bermain agar siswa paham konteks edukasinya, bukan sekadar asal menebak.
- Setiap kali siswa memilih jawaban di dalam game, **WAJIB memunculkan Bottom-Sheet / Pop-up Umpan Balik Edukatif (Educational Feedback)** yang menjelaskan _mengapa_ pilihan tersebut tepat atau kurang tepat dengan bahasa yang suportif dan tidak menghakimi.
- Berikan progres visual (Indikator Soal `1/5`, Bintang/XP, dan efek `canvas-confetti` saat menyelesaikan modul).

## 2. Specific Mini Game Mechanics

### A. Game 1: "Kenali Batasanku" (Body Boundaries)

- **UI Mechanic:** Tampilkan ilustrasi/ikon situasi sehari-hari dalam bentuk kartu cerita interaktif disertai indikator zona batasan diri.
- **Interaction:** Siswa memilih respon yang tepat dari 3 tombol taktil ketika menghadapi situasi terkait batasan tubuh dan sentuhan.

### B. Game 2: "Aman / Tidak" (Situation Radar)

- **UI Mechanic:** Kartu situasi interaktif (_Flashcard / Swipeable Card style_).
- **Interaction:** Siswa menganalisis situasi dan menentukan ke dalam 3 tombol kategori berikon jelas:
  1. 🛡️ **Aman** (Emerald)
  2. ⚠️ **Perlu Diwaspadai** (Amber)
  3. 🚨 **Tidak Aman** (Rose)
- Setelah memilih, kartu menampilkan penjelasan alasan dan tanda-tanda yang harus dikenali siswa.

### C. Game 3: "Pilih Responmu" (Interactive Chat / Scenario Simulator)

- **UI Mechanic:** Desain menyerupai percakapan chat di HP atau komik skenario situasi sulit (contoh: ancaman penyebaran foto pribadi / manipulasi).
- **Interaction:** Siswa memilih tindakan terbaik (Opsi A, B, atau C) dalam bentuk balon tindakan.
- **Feedback:** Tekankan pesan kunci bahwa meminta bantuan orang dewasa terpercaya (seperti Guru BK atau orang tua) dan menghentikan interaksi berbahaya adalah langkah yang berani dan tepat.

## 3. Video Animasi Learning Path

- Tampilkan 3 video animasi seperti "Peta Perjalanan / Level Belajar":
  - **Level 1:** Mengenal perubahan tubuh saat pubertas & batasan tubuh serta sentuhan yang tidak diinginkan.
  - **Level 2:** Mengenali bujuk rayu & manipulasi.
  - **Level 3:** Pencegahan kekerasan seksual di sekolah/pergaulan & cara mencari bantuan.
- Sediakan poin "Intisari Penting" di bawah pemutar video agar siswa tetap menyerap poin utama.

## 4. Skrining Kecemasan & Diary UX

- **Skrining Kecemasan:** Tampilkan pertanyaan satu per satu (_step-by-step wizard_) dengan progress bar lembut agar siswa tidak pusing melihat tabel kuesioner panjang. Di akhir, tampilkan kartu hasil yang menenangkan beserta tombol langsung ke **Menu Informasi Bantuan (Guru BK)**.
- **Diary Cerita (Privat):** Berikan badge gembok keamanan _"🔒 Hanya Kamu yang Bisa Membaca Diary Ini"_ di bagian atas halaman agar siswa merasa benar-benar aman menuliskan curhatannya pada 4 pertanyaan pemandu dan kolom cerita bebas.
