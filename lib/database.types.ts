/**
 * SUPABASE DATABASE TYPES - APLIKASI EDUKASI "KENALI"
 * SMP Al-Falah Rempoa Ciputat, Tangerang Selatan
 * Program Studi S1 Ilmu Keperawatan
 * Project Ref: faxshddubozrgchgcsmx
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "siswa" | "admin_bk" | "admin_mahasiswa";

export type TouchZone = "Aman" | "Privasi" | "Tidak Aman";

export type SituationCategory = "Aman" | "Perlu Diwaspadai" | "Tidak Aman";

export type AnxietyCategory =
  | "Kecemasan Minimal"
  | "Kecemasan Ringan"
  | "Kecemasan Sedang"
  | "Kecemasan Berat";

export type DiaryMood = "senang" | "tenang" | "bingung" | "cemas" | "sedih";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          nickname: string | null;
          role: UserRole;
          grade: string | null;
          school: string;
          gender: "Laki-laki" | "Perempuan" | null;
          xp_points: number;
          streak_days: number;
          current_streak: number;
          highest_streak: number;
          last_active_date: string | null;
          avatar_seed: string;
          avatar_variant: string;
          selected_badge: string;
          card_theme: string;
          collected_stars: number;
          completed_levels: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          nickname?: string | null;
          role?: UserRole;
          grade?: string | null;
          school?: string;
          gender?: "Laki-laki" | "Perempuan" | null;
          xp_points?: number;
          streak_days?: number;
          current_streak?: number;
          highest_streak?: number;
          last_active_date?: string | null;
          avatar_seed?: string;
          avatar_variant?: string;
          selected_badge?: string;
          card_theme?: string;
          collected_stars?: number;
          completed_levels?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          nickname?: string | null;
          role?: UserRole;
          grade?: string | null;
          school?: string;
          gender?: "Laki-laki" | "Perempuan" | null;
          xp_points?: number;
          streak_days?: number;
          current_streak?: number;
          highest_streak?: number;
          last_active_date?: string | null;
          avatar_seed?: string;
          avatar_variant?: string;
          selected_badge?: string;
          card_theme?: string;
          collected_stars?: number;
          completed_levels?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          level: number;
          title: string;
          topic: string;
          duration: string;
          youtube_id: string;
          youtube_url: string;
          summary: string;
          key_points: string[];
          thumbnail_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          level: number;
          title: string;
          topic: string;
          duration: string;
          youtube_id: string;
          youtube_url: string;
          summary: string;
          key_points?: string[];
          thumbnail_color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          level?: number;
          title?: string;
          topic?: string;
          duration?: string;
          youtube_id?: string;
          youtube_url?: string;
          summary?: string;
          key_points?: string[];
          thumbnail_color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      game_questions: {
        Row: {
          id: string;
          game_type: 1 | 2 | 3;
          title: string | null;
          scenario: string;
          character: string | null;
          location: string | null;
          touch_zone: TouchZone | null;
          category: SituationCategory | null;
          signs: string[] | null;
          explanation: string | null;
          sender_name: string | null;
          sender_role: string | null;
          risk_context: string | null;
          options: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          game_type: 1 | 2 | 3;
          title?: string | null;
          scenario: string;
          character?: string | null;
          location?: string | null;
          touch_zone?: TouchZone | null;
          category?: SituationCategory | null;
          signs?: string[] | null;
          explanation?: string | null;
          sender_name?: string | null;
          sender_role?: string | null;
          risk_context?: string | null;
          options: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          game_type?: 1 | 2 | 3;
          title?: string | null;
          scenario?: string;
          character?: string | null;
          location?: string | null;
          touch_zone?: TouchZone | null;
          category?: SituationCategory | null;
          signs?: string[] | null;
          explanation?: string | null;
          sender_name?: string | null;
          sender_role?: string | null;
          risk_context?: string | null;
          options?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      screening_instruments: {
        Row: {
          id: number;
          instrument_name: string;
          question: string;
          guidance: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          instrument_name?: string;
          question: string;
          guidance: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          instrument_name?: string;
          question?: string;
          guidance?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      screening_results: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          nickname: string | null;
          gender: "Laki-laki" | "Perempuan";
          grade: string;
          school: string;
          total_score: number;
          category: AnxietyCategory;
          needs_counseling: boolean;
          answers: number[];
          follow_up_status: "Belum Ditindaklanjuti" | "Dalam Konseling" | "Selesai";
          notes: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          student_name: string;
          nickname?: string | null;
          gender: "Laki-laki" | "Perempuan";
          grade: string;
          school?: string;
          total_score: number;
          category: AnxietyCategory;
          needs_counseling: boolean;
          answers: number[];
          follow_up_status?: "Belum Ditindaklanjuti" | "Dalam Konseling" | "Selesai";
          notes?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          student_name?: string;
          nickname?: string | null;
          gender?: "Laki-laki" | "Perempuan";
          grade?: string;
          school?: string;
          total_score?: number;
          category?: AnxietyCategory;
          needs_counseling?: boolean;
          answers?: number[];
          follow_up_status?: "Belum Ditindaklanjuti" | "Dalam Konseling" | "Selesai";
          notes?: string | null;
          submitted_at?: string;
        };
        Relationships: [];
      };
      diaries: {
        Row: {
          id: string;
          student_id: string;
          mood: DiaryMood;
          feeling_today: string;
          safe_place: string;
          uncomfortable_experience: string;
          who_can_help: string;
          free_note: string;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          mood: DiaryMood;
          feeling_today?: string;
          safe_place?: string;
          uncomfortable_experience?: string;
          who_can_help?: string;
          free_note?: string;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          mood?: DiaryMood;
          feeling_today?: string;
          safe_place?: string;
          uncomfortable_experience?: string;
          who_can_help?: string;
          free_note?: string;
          is_private?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      touch_zone: TouchZone;
      situation_category: SituationCategory;
      anxiety_category: AnxietyCategory;
      diary_mood: DiaryMood;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
