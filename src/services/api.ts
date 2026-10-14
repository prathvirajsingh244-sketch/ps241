import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  AuthTokens,
  LoginPayload,
  SignupPayload,
  User,
  Career,
  CareerListItem,
  PaginatedResponse,
  AssessmentQuestion,
  AssessmentAttemptPayload,
  AssessmentResult,
  CounsellingMessagePayload,
  CounsellingResponse,
  SkillLocation,
  CareerVideo,
  VideoTemplate,
  VideoJobPayload,
  VideoJob,
  MeetingRequestPayload,
  MeetingRequest,
  Meeting,
  HealthResponse,
} from '../types';
import type { AdminOverview, AdminCareerPayload, AdminSourcePayload, AdminLocationPayload } from '../types/admin';
import { mockData } from './mock';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach Bearer token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      // Session expired — clear local auth and redirect to login
      localStorage.removeItem('ss_access_token');
      localStorage.removeItem('ss_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

/** Parse a human-readable message from an API error */
export function parseApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: { message?: string }; detail?: string } | undefined;
    if (data?.error?.message) return data.error.message;
    if (data?.detail) return String(data.detail);
    if (err.message) return err.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  async signup(payload: SignupPayload): Promise<User> {
    if (USE_MOCK) return mockData.user;
    const res = await apiClient.post<User>('/auth/signup', payload);
    return res.data;
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    if (USE_MOCK) {
      const tokens: AuthTokens = { access_token: 'mock_token_abc123', token_type: 'bearer' };
      localStorage.setItem('ss_access_token', tokens.access_token);
      localStorage.setItem('ss_user', JSON.stringify(mockData.user));
      return tokens;
    }
    const res = await apiClient.post<AuthTokens>('/auth/login', payload);
    localStorage.setItem('ss_access_token', res.data.access_token);
    return res.data;
  },

  async getMe(): Promise<User> {
    if (USE_MOCK) return mockData.user;
    const res = await apiClient.get<User>('/auth/me');
    localStorage.setItem('ss_user', JSON.stringify(res.data));
    return res.data;
  },

  async updateProfile(updates: Partial<Pick<User, 'display_name' | 'preferred_language'>>): Promise<User> {
    if (USE_MOCK) return { ...mockData.user, ...updates };
    const res = await apiClient.patch<User>('/profiles/me', updates);
    return res.data;
  },

  logout() {
    localStorage.removeItem('ss_access_token');
    localStorage.removeItem('ss_user');
    window.location.href = '/login';
  },
};

// ─── Careers ───────────────────────────────────────────────────────────────────
export const careersApi = {
  async list(params?: {
    search?: string;
    category?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<CareerListItem>> {
    if (USE_MOCK) {
      const items = mockData.careers.filter((c) => {
        if (params?.search && !c.title.toLowerCase().includes(params.search.toLowerCase())) return false;
        if (params?.category && c.category !== params.category) return false;
        return true;
      });
      return { items, total: items.length, page: 1, page_size: 20 };
    }
    const res = await apiClient.get<PaginatedResponse<CareerListItem>>('/careers', { params });
    return res.data;
  },

  async get(id: string): Promise<Career> {
    if (USE_MOCK) {
      const found = mockData.careerDetails.find((c) => c.id === id);
      if (!found) throw new Error('Career not found');
      return found;
    }
    const res = await apiClient.get<Career>(`/careers/${id}`);
    return res.data;
  },

  // Admin
  async create(payload: AdminCareerPayload): Promise<Career> {
    const res = await apiClient.post<Career>('/careers', payload);
    return res.data;
  },

  async update(id: string, payload: Partial<AdminCareerPayload>): Promise<Career> {
    const res = await apiClient.patch<Career>(`/careers/${id}`, payload);
    return res.data;
  },
};

// ─── Assessment ────────────────────────────────────────────────────────────────
export const assessmentApi = {
  async getQuestions(): Promise<AssessmentQuestion[]> {
    if (USE_MOCK) return mockData.assessmentQuestions;
    const res = await apiClient.get<AssessmentQuestion[] | { questions: AssessmentQuestion[] }>('/assessments/questions');
    const data = res.data;
    return Array.isArray(data) ? data : data.questions ?? [];
  },

  async submitAttempt(payload: AssessmentAttemptPayload): Promise<AssessmentResult> {
    if (USE_MOCK) return mockData.assessmentResult;
    const res = await apiClient.post<AssessmentResult | { result?: AssessmentResult; suggested_career_ids?: string[]; suggested_careers?: AssessmentResult['suggested_careers']; created_at?: string; id?: string; status?: string }>('/assessments/attempts', payload);
    const data = res.data;
    if ('result' in data && data.result) return data.result;
    if ('suggested_careers' in data) {
      return {
        id: data.id ?? 'assessment-result',
        suggested_career_ids: data.suggested_career_ids ?? [],
        suggested_careers: data.suggested_careers ?? [],
        created_at: data.created_at ?? new Date().toISOString(),
      };
    }
    return data as AssessmentResult;
  },
};

// ─── Counselling ───────────────────────────────────────────────────────────────
export const counsellingApi = {
  async sendMessage(payload: CounsellingMessagePayload): Promise<CounsellingResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1200));
      return mockData.counsellingResponse;
    }
    const res = await apiClient.post<CounsellingResponse>('/counselling/messages', payload);
    return res.data;
  },
};

// ─── Map / Locations ───────────────────────────────────────────────────────────
export const mapApi = {
  async getSkillCentres(params?: { location_type?: string; status?: string }): Promise<SkillLocation[]> {
    if (USE_MOCK) return mockData.locations;
    const res = await apiClient.get<SkillLocation[]>('/map/skill-centres', { params });
    return res.data;
  },

  // Admin
  async createLocation(payload: AdminLocationPayload): Promise<SkillLocation> {
    const res = await apiClient.post<SkillLocation>('/admin/locations', payload);
    return res.data;
  },

  async updateLocation(id: string, payload: Partial<AdminLocationPayload>): Promise<SkillLocation> {
    const res = await apiClient.patch<SkillLocation>(`/admin/locations/${id}`, payload);
    return res.data;
  },
};

// ─── Videos ────────────────────────────────────────────────────────────────────
export const videosApi = {
  async list(params?: { career_id?: string; language?: string }): Promise<CareerVideo[]> {
    if (USE_MOCK) return mockData.videos;
    const res = await apiClient.get<CareerVideo[]>('/videos', { params });
    return res.data;
  },

  async getTemplates(): Promise<VideoTemplate[]> {
    if (USE_MOCK) return mockData.videoTemplates;
    const res = await apiClient.get<VideoTemplate[]>('/videos/templates');
    return res.data;
  },

  async createJob(payload: VideoJobPayload): Promise<VideoJob> {
    if (USE_MOCK) {
      return {
        id: 'mock-job-1',
        status: 'pending',
        career_id: payload.career_id,
        title: payload.title,
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    const res = await apiClient.post<VideoJob>('/videos/jobs', payload);
    return res.data;
  },

  async getJob(jobId: string): Promise<VideoJob> {
    if (USE_MOCK) {
      return {
        id: jobId,
        status: 'processing',
        career_id: 'mock-career-1',
        title: 'Sample Video Job',
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    const res = await apiClient.get<VideoJob>(`/videos/jobs/${jobId}`);
    return res.data;
  },
};

// ─── Meetings ──────────────────────────────────────────────────────────────────
export const meetingsApi = {
  async requestMeeting(payload: MeetingRequestPayload): Promise<MeetingRequest> {
    if (USE_MOCK) {
      return {
        id: 'mock-req-1',
        summary: payload.summary,
        preferred_slots: payload.preferred_slots,
        confirmed_slot: null,
        status: 'pending',
        consent: payload.consent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    const res = await apiClient.post<MeetingRequest>('/meetings/requests', payload);
    return res.data;
  },

  async getMyRequests(): Promise<MeetingRequest[]> {
    if (USE_MOCK) return mockData.meetingRequests;
    const res = await apiClient.get<MeetingRequest[]>('/meetings/requests/me');
    return res.data;
  },

  async getMeeting(id: string): Promise<Meeting> {
    if (USE_MOCK) return mockData.meeting;
    const res = await apiClient.get<Meeting>(`/meetings/${id}`);
    return res.data;
  },

  // Counsellor actions
  async updateRequest(
    requestId: string,
    updates: { status: string; confirmed_slot?: { date: string; time: string; timezone: string }; meet_url?: string },
  ): Promise<MeetingRequest> {
    const res = await apiClient.patch<MeetingRequest>(`/meetings/requests/${requestId}`, updates);
    return res.data;
  },

  async getAllRequests(): Promise<MeetingRequest[]> {
    if (USE_MOCK) return mockData.meetingRequests;
    const res = await apiClient.get<MeetingRequest[]>('/admin/requests');
    return res.data;
  },
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  async getOverview(): Promise<AdminOverview> {
    if (USE_MOCK) return mockData.adminOverview;
    const res = await apiClient.get<AdminOverview>('/admin/overview');
    return res.data;
  },

  async createSource(payload: AdminSourcePayload) {
    const res = await apiClient.post('/admin/sources', payload);
    return res.data;
  },

  async listSources() {
    if (USE_MOCK) return mockData.sources;
    const res = await apiClient.get('/admin/sources');
    return res.data;
  },
};

// ─── Health ────────────────────────────────────────────────────────────────────
export const systemApi = {
  async health(): Promise<HealthResponse> {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },
};

export default apiClient;
