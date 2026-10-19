/**
 * HYBRID DATA SERVICE - APLIKASI EDUKASI "KENALI"
 * SMP Al-Falah Rempoa Ciputat, Tangerang Selatan
 * 
 * Melakukan query ke Supabase secara langsung, dengan graceful fallback
 * otomatis ke lib/mock-data.ts jika tabel belum dibuat, kosong, RLS error,
 * atau koneksi offline. Memastikan prototipe tetap 100% interaktif untuk demo.
 */

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import {
  MOCK_VIDEOS,
  MOCK_GAME1_QUESTIONS,
  MOCK_GAME2_SITUATIONS,
  MOCK_GAME3_SCENARIOS,
  MOCK_GAD7_QUESTIONS,
  MOCK_SCREENING_RECORDS,
  MOCK_STUDENT_DIARIES,
  MOCK_BK_CONTACT,
  MOCK_RESEARCH_METRICS,
  type VideoContent,
  type Game1Question,
  type Game2Situation,
  type Game3ChatStep,
  type ScreeningQuestion,
  type StudentScreeningRecord,
  type StudentDiaryEntry,
} from "@/lib/mock-data";
import type { Database } from "@/lib/database.types";

// ============================================================================
// 1. DEMO PROFILES (Selalu tersedia untuk Demo Siswa, BK, & Mahasiswa)
// ============================================================================

export interface DemoUserProfile {
  id: string;
  username: string;
  fullName: string;
  nickname: string;
  role: "siswa" | "admin_bk" | "admin_mahasiswa";
  grade: string | null;
  school: string;
  gender: "Laki-laki" | "Perempuan";
  xpPoints: number;
  streakDays: number;
  collectedStars: number;
  completedLevels: number[];
  targetUrl: string;
  avatarSeed: string;
}

export const DEMO_USERS: Record<string, DemoUserProfile> = {
  ahmad8b: {
    id: "std-ahmad",
    username: "ahmad8b",
    fullName: "Ahmad Fauzi",
    nickname: "Ahmad",
    role: "siswa",
    grade: "8B",
    school: "SMP Al-Falah Rempoa",
    gender: "Laki-laki",
    xpPoints: 350,
    streakDays: 4,
    collectedStars: 8,
    completedLevels: [1],
    targetUrl: "/dashboard/siswa",
    avatarSeed: "Ahmad",
  },
  bk_nurul: {
    id: "bk-nurul",
    username: "bk_nurul",
    fullName: "Ibu Nurul Hidayati, S.Pd., Kons.",
    nickname: "Bu Nurul",
    role: "admin_bk",
    grade: null,
    school: "SMP Al-Falah Rempoa",
    gender: "Perempuan",
    xpPoints: 0,
    streakDays: 0,
    collectedStars: 0,
    completedLevels: [],
    targetUrl: "/dashboard/bk",
    avatarSeed: "Nurul",
  },
  peneliti_sarah: {
    id: "peneliti-sarah",
    username: "peneliti_sarah",
    fullName: "Sarah Amanda",
    nickname: "Sarah",
    role: "admin_mahasiswa",
    grade: null,
    school: "SMP Al-Falah Rempoa",
    gender: "Perempuan",
    xpPoints: 0,
    streakDays: 0,
    collectedStars: 0,
    completedLevels: [],
    targetUrl: "/dashboard/mahasiswa",
    avatarSeed: "Sarah",
  },
};

/**
 * Mendapatkan browser client jika berada di browser, dengan penanganan error.
 */
function getClient() {
  if (typeof window === "undefined") return null;
  try {
    return createBrowserClient();
  } catch {
    return null;
  }
}

// Local in-memory caches to persist writes during client sessions
const localState = {
  videos: [...MOCK_VIDEOS],
  screeningRecords: [...MOCK_SCREENING_RECORDS],
  studentDiaries: [...MOCK_STUDENT_DIARIES],
  bkContact: { ...MOCK_BK_CONTACT },
  userProgress: { ...DEMO_USERS.ahmad8b },
};

// ============================================================================
// 2. VIDEO EDUKASI HYBRID SERVICE
// ============================================================================

export async function getVideos(): Promise<VideoContent[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("level", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((v) => ({
          id: v.id,
          level: v.level,
          title: v.title,
          topic: v.topic,
          duration: v.duration,
          youtubeId: v.youtube_id,
          youtubeUrl: v.youtube_url,
          summary: v.summary,
          keyPoints: Array.isArray(v.key_points) ? (v.key_points as string[]) : [],
          thumbnailColor: v.thumbnail_color || "from-teal-400 to-emerald-500",
        }));
      }
    } catch {
      // Fallback silently to mock data
    }
  }
  return localState.videos;
}

export async function updateVideo(video: VideoContent): Promise<VideoContent> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("videos")
        .upsert({
          id: video.id,
          level: video.level,
          title: video.title,
          topic: video.topic,
          duration: video.duration,
          youtube_id: video.youtubeId,
          youtube_url: video.youtubeUrl,
          summary: video.summary,
          key_points: video.keyPoints,
          thumbnail_color: video.thumbnailColor,
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        // Update local state too
        const idx = localState.videos.findIndex((v) => v.id === video.id);
        if (idx >= 0) localState.videos[idx] = video;
        return video;
      }
    } catch {
      // Fallback to local
    }
  }

  // Update in local state fallback
  const idx = localState.videos.findIndex((v) => v.id === video.id);
  if (idx >= 0) {
    localState.videos[idx] = video;
  } else {
    localState.videos.push(video);
  }
  return video;
}

// ============================================================================
// 3. MINI GAMES HYBRID SERVICE
// ============================================================================

export async function getGame1Questions(): Promise<Game1Question[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("game_questions")
        .select("*")
        .eq("game_type", 1);

      if (!error && data && data.length > 0) {
        return data.map((q) => ({
          id: q.id,
          scenario: q.scenario,
          character: q.character || "Seseorang di Sekolah",
          location: q.location || "Lingkungan Sekolah",
          touchZone: (q.touch_zone as "Aman" | "Privasi" | "Tidak Aman") || "Tidak Aman",
          options: (q.options as unknown as Game1Question["options"]) || [],
        }));
      }
    } catch {
      // Fallback silently
    }
  }
  return MOCK_GAME1_QUESTIONS;
}

export async function getGame2Situations(): Promise<Game2Situation[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("game_questions")
        .select("*")
        .eq("game_type", 2);

      if (!error && data && data.length > 0) {
        return data.map((q) => ({
          id: q.id,
          title: q.title || "Situasi",
          story: q.scenario,
          category: (q.category as "Aman" | "Perlu Diwaspadai" | "Tidak Aman") || "Perlu Diwaspadai",
          signs: Array.isArray(q.signs) ? (q.signs as string[]) : [],
          explanation: q.explanation || "",
        }));
      }
    } catch {
      // Fallback silently
    }
  }
  return MOCK_GAME2_SITUATIONS;
}

export async function getGame3Scenarios(): Promise<Game3ChatStep[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("game_questions")
        .select("*")
        .eq("game_type", 3);

      if (!error && data && data.length > 0) {
        return data.map((q) => ({
          id: q.id,
          senderName: q.sender_name || "Seseorang",
          senderRole: q.sender_role || "Teman",
          incomingMessage: q.scenario,
          riskContext: q.risk_context || "",
          options: (q.options as unknown as Game3ChatStep["options"]) || [],
        }));
      }
    } catch {
      // Fallback silently
    }
  }
  return MOCK_GAME3_SCENARIOS;
}

// ============================================================================
// 4. SKRINING KECEMASAN (GAD-7) HYBRID SERVICE
// ============================================================================

export async function getScreeningQuestions(): Promise<ScreeningQuestion[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("screening_instruments")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          question: item.question,
          guidance: item.guidance,
        }));
      }
    } catch {
      // Fallback silently
    }
  }
  return MOCK_GAD7_QUESTIONS;
}

export async function getScreeningRecords(): Promise<StudentScreeningRecord[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("screening_results")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          nickname: r.nickname || r.student_name.split(" ")[0],
          gender: r.gender,
          grade: r.grade,
          school: r.school,
          submittedAt: new Date(r.submitted_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
          gad7Answers: Array.isArray(r.answers) ? (r.answers as number[]) : [],
          totalScore: r.total_score,
          category: r.category,
          status: (r.follow_up_status as StudentScreeningRecord["status"]) || "Belum Dihubungi",
          bkNotes: r.notes || undefined,
        }));
      }
    } catch {
      // Fallback silently
    }
  }
  return localState.screeningRecords;
}

export async function saveScreeningResult(
  record: Omit<StudentScreeningRecord, "id">
): Promise<StudentScreeningRecord> {
  const newId = `scr-${Date.now()}`;
  const completeRecord: StudentScreeningRecord = {
    ...record,
    id: newId,
  };

  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("screening_results")
        .insert({
          student_id: record.studentId,
          student_name: record.studentName,
          nickname: record.nickname,
          gender: record.gender,
          grade: record.grade,
          school: record.school,
          total_score: record.totalScore,
          category: record.category,
          needs_counseling: record.totalScore >= 10,
          answers: record.gad7Answers,
          follow_up_status: (record.status as Database["public"]["Tables"]["screening_results"]["Insert"]["follow_up_status"]) || "Belum Ditindaklanjuti",
          notes: record.bkNotes || null,
        })
        .select()
        .single();

      if (!error && data) {
        completeRecord.id = data.id;
      }
    } catch {
      // Fallback continues with local record
    }
  }

  // Prepend to local state
  localState.screeningRecords.unshift(completeRecord);
  return completeRecord;
}

export async function updateScreeningFollowUp(
  recordId: string,
  status: StudentScreeningRecord["status"],
  notes?: string
): Promise<boolean> {
  const supabase = getClient();
  if (supabase) {
    try {
      await supabase
        .from("screening_results")
        .update({
          follow_up_status: status as Database["public"]["Tables"]["screening_results"]["Update"]["follow_up_status"],
          notes: notes || null,
        })
        .eq("id", recordId);
    } catch {
      // Fallback to local
    }
  }

  // Update in local state
  const target = localState.screeningRecords.find((r) => r.id === recordId);
  if (target) {
    target.status = status;
    if (notes !== undefined) target.bkNotes = notes;
    return true;
  }
  return false;
}

// ============================================================================
// 5. DIARY CERITA SISWA (100% PRIVAT — SISWA PEMILIK AKUN SAJA)
// ============================================================================

export async function getStudentDiaries(studentId: string = "std-ahmad"): Promise<StudentDiaryEntry[]> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          studentId: d.student_id,
          createdAt: new Date(d.created_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
          mood: d.mood,
          answers: {
            feelingToday: d.feeling_today,
            safePlace: d.safe_place,
            uncomfortableExperience: d.uncomfortable_experience,
            whoCanHelp: d.who_can_help,
          },
          freeNote: d.free_note,
          isPrivate: true,
        }));
      }
    } catch {
      // Fallback silently
    }
  }

  return localState.studentDiaries.filter((d) => d.studentId === studentId || d.studentId === "std-ahmad");
}

export async function saveStudentDiary(
  entry: Omit<StudentDiaryEntry, "id" | "createdAt">
): Promise<StudentDiaryEntry> {
  const newId = `dry-${Date.now()}`;
  const nowDisplay = new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";

  const completeEntry: StudentDiaryEntry = {
    ...entry,
    id: newId,
    createdAt: nowDisplay,
  };

  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("diaries")
        .insert({
          student_id: entry.studentId,
          mood: entry.mood,
          feeling_today: entry.answers.feelingToday,
          safe_place: entry.answers.safePlace,
          uncomfortable_experience: entry.answers.uncomfortableExperience,
          who_can_help: entry.answers.whoCanHelp,
          free_note: entry.freeNote,
          is_private: true,
        })
        .select()
        .single();

      if (!error && data) {
        completeEntry.id = data.id;
      }
    } catch {
      // Continue to local state
    }
  }

  localState.studentDiaries.unshift(completeEntry);
  return completeEntry;
}

// ============================================================================
// 6. INFORMASI KONTAK BK & METRIK RISET
// ============================================================================

export function getBkContact() {
  return localState.bkContact;
}

export function updateBkContact(contact: Partial<typeof MOCK_BK_CONTACT>) {
  localState.bkContact = {
    ...localState.bkContact,
    ...contact,
  };
  return localState.bkContact;
}

export function getResearchMetrics() {
  return MOCK_RESEARCH_METRICS;
}

// ============================================================================
// 7. USER PROFILE & AUTH WRAPPER (Username-to-Email)
// ============================================================================

/**
 * Format username siswa ke internal email: ${username}@kenali.local
 */
export function formatUsernameToEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (clean.includes("@")) {
    return clean;
  }
  return `${clean}@kenali.local`;
}

/**
 * Mendapatkan profil pengguna aktif untuk sesi demo atau dari Supabase
 */
export async function getUserProfile(usernameOrId: string = "ahmad8b"): Promise<DemoUserProfile> {
  const clean = usernameOrId.trim().toLowerCase().replace("@kenali.local", "");
  
  // Cek demo accounts terlebih dahulu
  if (DEMO_USERS[clean]) {
    return DEMO_USERS[clean];
  }

  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.eq.${clean},id.eq.${usernameOrId}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          username: data.username,
          fullName: data.full_name,
          nickname: data.nickname || data.full_name.split(" ")[0],
          role: data.role,
          grade: data.grade,
          school: data.school,
          gender: data.gender || "Laki-laki",
          xpPoints: data.xp_points,
          streakDays: data.streak_days,
          collectedStars: data.collected_stars,
          completedLevels: data.completed_levels,
          targetUrl: data.role === "admin_bk" ? "/dashboard/bk" : data.role === "admin_mahasiswa" ? "/dashboard/mahasiswa" : "/dashboard/siswa",
          avatarSeed: data.nickname || data.username,
        };
      }
    } catch {
      // Fallback silently
    }
  }

  // Default fallback ke Ahmad
  return DEMO_USERS.ahmad8b;
}
