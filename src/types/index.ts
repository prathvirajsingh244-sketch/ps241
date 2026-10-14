// SkillSaathi TypeScript Types — matches /api/v1 API contract draft

export type UserRole = 'learner' | 'counsellor' | 'admin';
export type Language = 'en' | 'hi';

export interface User {
  id: string;
  display_name: string;
  email: string;
  role: UserRole;
  preferred_language: Language;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'bearer';
}

export interface SignupPayload {
  display_name: string;
  email: string;
  password: string;
  preferred_language?: Language;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type CareerStatus = 'draft' | 'published';

export interface Source {
  id: string;
  career_id: string;
  title: string;
  publisher: string;
  source_url: string;
  source_type: string;
  last_verified_at: string | null;
  verification_status: 'verified' | 'unverified' | 'pending';
  notes: string | null;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  overview: string;
  eligibility: string;
  skills: string[];
  training_path: string;
  progression_path: string;
  language: Language;
  status: CareerStatus;
  created_at: string;
  updated_at: string;
  sources: Source[];
  video_url?: string | null;
}

export interface CareerListItem {
  id: string;
  title: string;
  category: string;
  overview: string;
  eligibility: string;
  status: CareerStatus;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  answer_options: string[];
  category: string;
  order_index: number;
}

export interface AssessmentAnswer {
  question_id: string;
  selected_option: string;
}

export interface AssessmentAttemptPayload {
  answers: AssessmentAnswer[];
}

export interface AssessmentResult {
  id: string;
  suggested_career_ids: string[];
  suggested_careers: CareerListItem[];
  created_at: string;
}

export interface CounsellingMessage {
  id: string;
  role: 'user' | 'assistant';
  message_text: string;
  created_at: string;
  source_refs?: string[];
}

export interface CounsellingMessagePayload {
  message: string;
  conversation_id?: string;
  language?: Language;
}

export interface CounsellingResponse {
  answer: string;
  source_refs: string[];
  needs_human_followup: boolean;
  fallback_used: boolean;
  conversation_id: string;
}

export interface SkillLocation {
  id: string;
  name: string;
  location_type: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  source_id: string;
  last_verified_at: string | null;
  status: 'active' | 'inactive';
}

export interface CareerVideo {
  id: string;
  career_id: string;
  title: string;
  provider: string;
  video_url: string;
  language: Language;
  status: 'draft' | 'published' | 'review';
  reviewed_at: string | null;
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
}

export interface VideoJobPayload {
  career_id: string;
  template_id: string;
  title: string;
  language: Language;
  script?: string;
}

export interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  career_id: string;
  title: string;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MeetingRequestStatus = 'pending' | 'confirmed' | 'alternate_proposed' | 'cancelled';

export interface MeetingSlot {
  date: string; // ISO 8601 date
  time: string; // HH:MM
  timezone: string;
}

export interface MeetingRequestPayload {
  summary: string;
  preferred_slots: MeetingSlot[];
  consent: boolean;
  contact_info?: string;
}

export interface MeetingRequest {
  id: string;
  summary: string;
  preferred_slots: MeetingSlot[];
  confirmed_slot: MeetingSlot | null;
  status: MeetingRequestStatus;
  consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  request_id: string;
  start_at: string;
  timezone: string;
  meet_url: string | null;
  calendar_event_id: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    request_id?: string;
  };
}

export interface HealthResponse {
  status: 'ok';
  version: string;
}
