-- ==============================================================================
-- KENALI — SKEMA DATABASE, RELASI, & KEAMANAN ROW LEVEL SECURITY (RLS)
-- SMP Al-Falah Rempoa Ciputat, Tangerang Selatan
-- Target: Supabase Postgres
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('siswa', 'admin_bk', 'admin_mahasiswa');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE touch_zone AS ENUM ('Aman', 'Privasi', 'Tidak Aman');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE situation_category AS ENUM ('Aman', 'Perlu Diwaspadai', 'Tidak Aman');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE anxiety_category AS ENUM (
    'Kecemasan Minimal',
    'Kecemasan Ringan',
    'Kecemasan Sedang',
    'Kecemasan Berat'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE diary_mood AS ENUM ('senang', 'tenang', 'bingung', 'cemas', 'sedih');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABEL UTAMA & RELASI
-- ==============================================================================

-- Tabel Profiles (Terhubung ke auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  nickname TEXT,
  role user_role NOT NULL DEFAULT 'siswa',
  grade TEXT,
  school TEXT NOT NULL DEFAULT 'SMP Al-Falah Rempoa',
  gender TEXT CHECK (gender IN ('Laki-laki', 'Perempuan')),
  xp_points INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 1,
  highest_streak INTEGER NOT NULL DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  avatar_seed TEXT DEFAULT 'Ahmad',
  avatar_variant TEXT DEFAULT 'adventurer',
  selected_badge TEXT DEFAULT 'Detektif Batasan Diri',
  card_theme TEXT DEFAULT 'teal',
  collected_stars INTEGER NOT NULL DEFAULT 0,
  completed_levels INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migrasi tambahan untuk tabel profiles yang sudah ada
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS highest_streak INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_seed TEXT DEFAULT 'Ahmad';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_variant TEXT DEFAULT 'adventurer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_badge TEXT DEFAULT 'Detektif Batasan Diri';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS card_theme TEXT DEFAULT 'teal';

-- Tabel Videos (3 Modul Edukasi Interaktif)
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY DEFAULT ('vid-' || gen_random_uuid()),
  level INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_color TEXT NOT NULL DEFAULT 'from-teal-400 to-emerald-500',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Game Questions (Soal 3 Mini Game)
CREATE TABLE IF NOT EXISTS public.game_questions (
  id TEXT PRIMARY KEY DEFAULT ('game-' || gen_random_uuid()),
  game_type INTEGER NOT NULL CHECK (game_type IN (1, 2, 3)),
  title TEXT,
  scenario TEXT NOT NULL,
  character TEXT,
  location TEXT,
  touch_zone touch_zone,
  category situation_category,
  signs JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  sender_name TEXT,
  sender_role TEXT,
  risk_context TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Screening Instruments (Instrumen GAD-7 Dinamis)
CREATE TABLE IF NOT EXISTS public.screening_instruments (
  id SERIAL PRIMARY KEY,
  instrument_name TEXT NOT NULL DEFAULT 'GAD-7',
  question TEXT NOT NULL,
  guidance TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Screening Results (Hasil Skrining Kecemasan)
CREATE TABLE IF NOT EXISTS public.screening_results (
  id TEXT PRIMARY KEY DEFAULT ('scr-' || gen_random_uuid()),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  nickname TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
  grade TEXT NOT NULL,
  school TEXT NOT NULL DEFAULT 'SMP Al-Falah Rempoa',
  total_score INTEGER NOT NULL,
  category anxiety_category NOT NULL,
  needs_counseling BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  follow_up_status TEXT NOT NULL DEFAULT 'Belum Ditindaklanjuti' CHECK (
    follow_up_status IN ('Belum Ditindaklanjuti', 'Dalam Konseling', 'Selesai', 'Belum Dihubungi', 'Sedang Didampingi', 'Selesai Konseling')
  ),
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Diaries (100% PRIVAT — HANYA SISWA PEMILIK AKUN)
CREATE TABLE IF NOT EXISTS public.diaries (
  id TEXT PRIMARY KEY DEFAULT ('dry-' || gen_random_uuid()),
  student_id TEXT NOT NULL,
  mood diary_mood NOT NULL,
  feeling_today TEXT,
  safe_place TEXT,
  uncomfortable_experience TEXT,
  who_can_help TEXT,
  free_note TEXT,
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;

-- 4.1. POLICIES: PROFILES
DROP POLICY IF EXISTS "Profiles dapat dilihat oleh user terdaftar" ON public.profiles;
CREATE POLICY "Profiles dapat dilihat oleh user terdaftar"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "User dapat mengupdate profile miliknya sendiri" ON public.profiles;
CREATE POLICY "User dapat mengupdate profile miliknya sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4.2. POLICIES: VIDEOS (Publik membaca, Peneliti mengelola)
DROP POLICY IF EXISTS "Videos dapat dibaca publik" ON public.videos;
CREATE POLICY "Videos dapat dibaca publik"
  ON public.videos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Videos dapat diubah oleh user terautentikasi" ON public.videos;
CREATE POLICY "Videos dapat diubah oleh user terautentikasi"
  ON public.videos FOR ALL
  USING (auth.role() = 'authenticated');

-- 4.3. POLICIES: GAME QUESTIONS
DROP POLICY IF EXISTS "Soal game dapat dibaca publik" ON public.game_questions;
CREATE POLICY "Soal game dapat dibaca publik"
  ON public.game_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Soal game dapat dikelola oleh user terautentikasi" ON public.game_questions;
CREATE POLICY "Soal game dapat dikelola oleh user terautentikasi"
  ON public.game_questions FOR ALL
  USING (auth.role() = 'authenticated');

-- 4.4. POLICIES: SCREENING INSTRUMENTS
DROP POLICY IF EXISTS "Instrumen skrining dapat dibaca publik" ON public.screening_instruments;
CREATE POLICY "Instrumen skrining dapat dibaca publik"
  ON public.screening_instruments FOR SELECT
  USING (true);

-- 4.5. POLICIES: SCREENING RESULTS (Rekap untuk Guru BK & Peneliti)
DROP POLICY IF EXISTS "Hasil skrining dapat dibaca" ON public.screening_results;
CREATE POLICY "Hasil skrining dapat dibaca"
  ON public.screening_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Siswa dapat submit hasil skrining" ON public.screening_results;
CREATE POLICY "Siswa dapat submit hasil skrining"
  ON public.screening_results FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Guru BK dapat mengupdate status tindak lanjut" ON public.screening_results;
CREATE POLICY "Guru BK dapat mengupdate status tindak lanjut"
  ON public.screening_results FOR UPDATE
  USING (true);

-- 4.6. POLICIES: DIARIES (ATURAN KETAT: SISWA PEMILIK AKUN SAJA)
-- Guru BK & Admin Mahasiswa DILARANG KERAS mengakses tabel ini!
DROP POLICY IF EXISTS "Siswa hanya bisa membaca diary miliknya sendiri" ON public.diaries;
CREATE POLICY "Siswa hanya bisa membaca diary miliknya sendiri"
  ON public.diaries FOR SELECT
  USING (
    student_id = auth.uid()::text 
    OR student_id = 'std-ahmad' -- Izin fallback akun demo siswa
  );

DROP POLICY IF EXISTS "Siswa hanya bisa menambah diary miliknya sendiri" ON public.diaries;
CREATE POLICY "Siswa hanya bisa menambah diary miliknya sendiri"
  ON public.diaries FOR INSERT
  WITH CHECK (
    student_id = auth.uid()::text 
    OR student_id = 'std-ahmad'
  );

-- ==============================================================================
-- 5. SEED DATA AWAL (VIDEOS & INSTRUMEN SKRINING GAD-7)
-- ==============================================================================

INSERT INTO public.videos (id, level, title, topic, duration, youtube_id, youtube_url, summary, key_points, thumbnail_color)
VALUES
  (
    'vid-1',
    1,
    'Mengenal Perubahan Tubuh & Batasan Diri',
    'Pubertas, Anatomi Tubuh, dan Sentuhan yang Diperbolehkan / Dilarang',
    '04:35',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Video ini mengajak siswa memahami perubahan fisik dan emosional di masa pubertas, mengenal bagian tubuh privasi (pakaian renang), serta konsep kepemilikan tubuh diri sendiri.',
    '["Bagian tubuh yang tertutup baju renang adalah area privasi milikmu sendiri.", "Tidak ada orang lain yang berhak menyentuh tanpa alasan medis yang sah didampingi orang tua.", "Kamu punya hak penuh untuk berkata TIDAK pada sentuhan yang membuatmu merasa risih atau takut."]'::jsonb,
    'from-teal-400 to-emerald-500'
  ),
  (
    'vid-2',
    2,
    'Mengenali Bujuk Rayu & Trik Manipulasi',
    'Grooming, Rahasia Buruk vs Rahasia Baik, dan Tekanan Teman Sebaya',
    '05:12',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Membongkar trik orang yang berniat jahat melalui hadiah berlebihan, ancaman terselubung, manipulasi rahasia berdua, dan cara membedakannya.',
    '["Pelaku kekerasan sering kali orang yang sudah dikenal dan memulai dengan perhatian khusus atau hadiah berlebihan.", "Rahasia baik membuat hati hangat. Rahasia berbahaya membuat dada sesak atau takut.", "Jika seseorang memintamu merahasiakan suatu perbuatan dari orang tua atau guru, itu adalah bahaya!"]'::jsonb,
    'from-amber-400 to-orange-500'
  ),
  (
    'vid-3',
    3,
    'Berani Bicara & Cara Mencari Bantuan',
    'Pencegahan Kekerasan di Sekolah, Circle Bantuan, & Peran Guru BK',
    '04:58',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Panduan langkah konkret jika mengalami atau melihat kekerasan di lingkungan SMP Al-Falah: cara melapor ke Guru BK dan menghapus stigma rasa bersalah.',
    '["Korban kekerasan seksual TIDAK PERNAH bersalah. Kesalahan sepenuhnya ada pada pelaku.", "Langkah darurat T-K-L: TOLAK dengan tegas, KELUAR dari tempat tersebut, dan LAPOR pada orang dewasa yang kamu percaya.", "Guru BK SMP Al-Falah adalah sahabat siswa yang siap mendengarkan tanpa menghakimi."]'::jsonb,
    'from-sky-400 to-indigo-500'
  )
ON CONFLICT (level) DO NOTHING;

INSERT INTO public.screening_instruments (id, instrument_name, question, guidance, order_index)
VALUES
  (1, 'GAD-7', 'Merasa gugup, cemas, gelisah, atau merasa tidak tenang?', 'Apakah kamu sering merasa tegang tanpa alasan yang jelas beberapa minggu terakhir?', 1),
  (2, 'GAD-7', 'Tidak mampu menghentikan atau mengendalikan rasa khawatir?', 'Pikiran tentang hal-hal buruk terus berputar di kepala dan sulit untuk dialihkan.', 2),
  (3, 'GAD-7', 'Terlalu mengkhawatirkan berbagai hal yang belum tentu terjadi?', 'Khawatir berlebihan tentang sekolah, pergaulan teman, atau masa depan.', 3),
  (4, 'GAD-7', 'Sulit untuk bersantai atau merasa tenang saat sedang istirahat?', 'Tubuh terasa kaku atau pikiran selalu siaga seolah ada bahaya yang mengintai.', 4),
  (5, 'GAD-7', 'Sangat gelisah sehingga sulit untuk duduk diam?', 'Sering menggerak-gerakkan kaki, meremas tangan, atau berjalan mondar-mandir.', 5),
  (6, 'GAD-7', 'Menjadi mudah merasa kesal atau mudah tersinggung?', 'Cepat terpancing marah oleh hal-hal kecil di rumah atau di sekolah.', 6),
  (7, 'GAD-7', 'Merasa takut seolah-olah sesuatu yang mengerikan akan segera terjadi?', 'Rasa panik mendadak atau firasat buruk yang mengganggu aktivitas sehari-hari.', 7)
ON CONFLICT (id) DO NOTHING;
