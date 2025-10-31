export interface Course {
  id: number;
  name: string;
  description: string | null;
  duration_days: number;
  is_active: number; // SQLite boolean (0 or 1)
  created_at: string;
}

export interface Day {
  id: number;
  course_id: number;
  day_number: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  day_id: number;
  session_number: number;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface SessionContent {
  id: number;
  session_id: number;
  content_type: 'facilitator_guide' | 'coaches_manual' | 'worksheet';
  content: string;
  updated_at: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  duration_days: number;
  is_active?: boolean;
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  duration_days?: number;
  is_active?: boolean;
}

export interface CreateDayData {
  day_number: number;
  title: string;
  description?: string;
}

export interface UpdateDayData {
  title?: string;
  description?: string;
}

export interface CreateSessionData {
  session_number: number;
  title: string;
  description?: string;
  duration_minutes?: number;
}

export interface UpdateSessionData {
  title?: string;
  description?: string;
  duration_minutes?: number;
}
