/**
 * Supabase database types (extend from codegen or define manually).
 * Run: npx supabase gen types typescript --project-id YOUR_REF > types/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          role: string;
          xp: number;
          level: number;
          current_streak: number;
          longest_streak: number;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          role?: string;
          xp?: number;
          current_streak?: number;
          longest_streak?: number;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          role?: string;
          xp?: number;
          current_streak?: number;
          longest_streak?: number;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pomodoro_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration_minutes: number;
          break_duration_minutes: number;
          completed: boolean;
          focus_score: number | null;
          notes: string | null;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          duration_minutes: number;
          break_duration_minutes?: number;
          completed?: boolean;
          focus_score?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          duration_minutes?: number;
          break_duration_minutes?: number;
          completed?: boolean;
          focus_score?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };

      study_rooms: {
        Row: {
          id: string;
          room_name: string;
          room_code: string;
          host_id: string | null;
          is_private: boolean;
          password_hash: string | null;
          max_members: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_name: string;
          room_code: string;
          host_id?: string | null;
          is_private?: boolean;
          password_hash?: string | null;
          max_members?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_name?: string;
          room_code?: string;
          host_id?: string | null;
          is_private?: boolean;
          password_hash?: string | null;
          max_members?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      room_members: {
        Row: {
          room_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          room_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          room_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };

      room_messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          xp_required: number;
          rarity: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          xp_required: number;
          rarity?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          xp_required?: number;
          rarity?: string | null;
        };
        Relationships: [];
      };

      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
        Relationships: [];
      };

      timetables: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          is_active: boolean;
          schedule: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          is_active?: boolean;
          schedule?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          is_active?: boolean;
          schedule?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      mood_logs: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          energy: number | null;
          note: string | null;
          activities: string[] | null;
          weather: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: number;
          energy?: number | null;
          note?: string | null;
          activities?: string[] | null;
          weather?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          energy?: number | null;
          note?: string | null;
          activities?: string[] | null;
          weather?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image: string | null;
          author_id: string | null;
          tags: string[] | null;
          published: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          tags?: string[] | null;
          published?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          tags?: string[] | null;
          published?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      blog_likes: {
        Row: {
          blog_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          blog_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          blog_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
