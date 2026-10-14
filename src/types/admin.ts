export interface AdminOverview {
  career_count: number;
  published_career_count: number;
  source_count: number;
  pending_meeting_requests: number;
  total_meeting_requests: number;
  active_locations: number;
  video_count: number;
  assessment_attempts_today: number;
}

export interface AdminCareerPayload {
  title: string;
  category: string;
  overview: string;
  eligibility: string;
  skills: string[];
  training_path: string;
  progression_path: string;
  language: 'en' | 'hi';
  status: 'draft' | 'published';
}

export interface AdminSourcePayload {
  career_id: string;
  title: string;
  publisher: string;
  source_url: string;
  source_type: string;
  notes?: string;
}

export interface AdminLocationPayload {
  name: string;
  location_type: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  status: 'active' | 'inactive';
}
