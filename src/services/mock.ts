/**
 * MaargMitra Mock Data
 * ─────────────────────────────────────────────────────────────────
 * SAMPLE DATA — clearly labelled. This is NOT verified real data.
 * These mocks are temporary fallbacks used when VITE_USE_MOCK=true.
 * Replace with real backend responses once /api/v1 endpoints are live.
 * ─────────────────────────────────────────────────────────────────
 */

import type {
  User,
  Career,
  CareerListItem,
  AssessmentQuestion,
  AssessmentResult,
  CounsellingResponse,
  SkillLocation,
  CareerVideo,
  VideoTemplate,
  MeetingRequest,
  Meeting,
  Source,
} from '../types';
import type { AdminOverview } from '../types/admin';

// ─── Users ──────────────────────────────────────────────────────────────────────
const mockUser: User = {
  id: 'user-mock-001',
  display_name: 'Arjun Sharma',
  email: 'arjun@example.com',
  role: 'learner',
  preferred_language: 'hi',
  created_at: '2026-01-15T10:30:00Z',
};

// ─── Careers ────────────────────────────────────────────────────────────────────
const mockSources: Source[] = [
  {
    id: 'src-001',
    career_id: 'career-001',
    title: 'National Skill Development Corporation — Electrician Sector',
    publisher: 'NSDC',
    source_url: 'https://www.nsdcindia.org/',
    source_type: 'government_portal',
    last_verified_at: '2026-03-01T00:00:00Z',
    verification_status: 'verified',
    notes: 'Referenced from NSDC official curriculum documentation.',
  },
  {
    id: 'src-002',
    career_id: 'career-001',
    title: 'ITI Electrician Course Curriculum 2024-25',
    publisher: 'DGET, Ministry of Skill Development',
    source_url: 'https://dget.nic.in/',
    source_type: 'curriculum_document',
    last_verified_at: '2026-02-15T00:00:00Z',
    verification_status: 'verified',
    notes: null,
  },
];

const mockCareerDetails: Career[] = [
  {
    id: 'career-001',
    title: 'Electrician (ITI)',
    category: 'Engineering & Technology',
    overview:
      'An ITI Electrician installs, maintains and repairs electrical wiring, equipment and fixtures. This is a widely recognised, government-certified skilled trade in India with steady demand in construction, manufacturing and services sectors.',
    eligibility: 'Class 10 pass (Science and Mathematics). Age 14–40 for most government ITI admissions. Physical fitness for fieldwork.',
    skills: ['Electrical wiring & circuits', 'Safety protocols', 'Equipment maintenance', 'Blueprint reading', 'Motor rewinding'],
    training_path:
      'ITI (Industrial Training Institute) — 2-year Electrician trade course. Apprenticeship under Apprentices Act 1961 after ITI. NCVT certification exam.',
    progression_path:
      'Junior Electrician → Electrician → Senior Electrician → Supervisor → Electrical Contractor (self-employed). With further education: Diploma in Electrical Engineering or B.Voc.',
    language: 'en',
    status: 'published',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    sources: mockSources,
    video_url: null,
  },
  {
    id: 'career-002',
    title: 'Beauty & Wellness Therapist',
    category: 'Health & Wellness',
    overview:
      'A Beauty & Wellness Therapist provides skin, hair and body care services in salons, spas and wellness centres. The sector has grown significantly with formalised training under NSDC\'s Beauty & Wellness Sector Skill Council.',
    eligibility: 'Class 8 to Class 12 depending on course level. Good personal hygiene and client communication skills.',
    skills: ['Skin care treatments', 'Hair styling', 'Massage therapy', 'Manicure/Pedicure', 'Client consultation'],
    training_path:
      'Beauty & Wellness Sector Skill Council (B&WSSC) courses: Level 2–4 (3 to 12 months). Government ITIs also offer Cosmetology trade. PMKVY scheme funding available.',
    progression_path:
      'Trainee Therapist → Therapist → Senior Therapist → Salon Manager → Salon Owner. Franchise opportunities with established chains.',
    language: 'en',
    status: 'published',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-02-20T00:00:00Z',
    sources: [
      {
        id: 'src-003',
        career_id: 'career-002',
        title: 'Beauty & Wellness Sector Skill Council — Qualification Packs',
        publisher: 'B&WSSC / NSDC',
        source_url: 'https://bwssc.in/',
        source_type: 'government_portal',
        last_verified_at: '2026-02-01T00:00:00Z',
        verification_status: 'verified',
        notes: null,
      },
    ],
    video_url: null,
  },
  {
    id: 'career-003',
    title: 'Plumber (ITI)',
    category: 'Construction & Infrastructure',
    overview:
      'An ITI Plumber installs and maintains water supply, drainage and sanitation systems. India\'s rapid urbanisation and housing programmes create consistent demand.',
    eligibility: 'Class 10 pass. Age 14–40 for ITI admissions. Physically fit for on-site work.',
    skills: ['Pipe fitting', 'Drainage systems', 'Fixture installation', 'Leak detection', 'Blueprint reading'],
    training_path: 'ITI Plumber trade — 1 year. NCVT certification. Apprenticeship under Apprentices Act.',
    progression_path: 'Helper → Plumber → Senior Plumber → Plumbing Supervisor → Independent Plumbing Contractor.',
    language: 'en',
    status: 'published',
    created_at: '2026-01-14T00:00:00Z',
    updated_at: '2026-02-25T00:00:00Z',
    sources: [
      {
        id: 'src-004',
        career_id: 'career-003',
        title: 'NSDC — Construction Skill Development Council of India',
        publisher: 'CSDC / NSDC',
        source_url: 'https://csdcindia.org/',
        source_type: 'government_portal',
        last_verified_at: '2026-01-20T00:00:00Z',
        verification_status: 'verified',
        notes: null,
      },
    ],
    video_url: null,
  },
  {
    id: 'career-004',
    title: 'Solar Panel Technician',
    category: 'Renewable Energy',
    overview:
      'Solar Panel Technicians install, test and maintain photovoltaic solar energy systems. India\'s solar mission and PM Surya Ghar Muft Bijli Yojana scheme have rapidly expanded demand for trained solar technicians.',
    eligibility: 'Class 10 pass (Physics preferred). Age 18+. Physical fitness required for rooftop work.',
    skills: ['Solar PV installation', 'Electrical safety', 'System testing', 'Basic wiring', 'Maintenance & troubleshooting'],
    training_path:
      'NSDC / Electronics Sector Skill Council courses (3–6 months). MNRE approved training centres. ITI Electrician base plus solar specialisation.',
    progression_path: 'Trainee Technician → Solar Technician → Senior Technician → Site Supervisor → Solar EPC Entrepreneur.',
    language: 'en',
    status: 'published',
    created_at: '2026-01-18T00:00:00Z',
    updated_at: '2026-03-05T00:00:00Z',
    sources: [
      {
        id: 'src-005',
        career_id: 'career-004',
        title: 'MNRE — PM Surya Ghar Muft Bijli Yojana Skill Component',
        publisher: 'Ministry of New & Renewable Energy (MNRE)',
        source_url: 'https://pmsuryaghar.gov.in/',
        source_type: 'government_scheme',
        last_verified_at: '2026-03-01T00:00:00Z',
        verification_status: 'verified',
        notes: null,
      },
    ],
    video_url: null,
  },
  {
    id: 'career-005',
    title: 'Welder (ITI)',
    category: 'Engineering & Technology',
    overview:
      'A trained Welder joins metal parts using gas, arc, MIG or TIG welding techniques. Demand spans manufacturing, shipbuilding, construction and fabrication industries.',
    eligibility: 'Class 8 to Class 10 depending on trade level. Age 14–40 for most government ITI admissions.',
    skills: ['Arc welding', 'MIG/TIG welding', 'Gas welding & cutting', 'Blueprint reading', 'Safety practices'],
    training_path: 'ITI Welder trade — 1 year. NCVT certification. Apprenticeship placement available in manufacturing units.',
    progression_path: 'Helper Welder → Welder → Senior Welder → Welding Inspector → Welding Supervisor / Contractor.',
    language: 'en',
    status: 'published',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-02-28T00:00:00Z',
    sources: [
      {
        id: 'src-006',
        career_id: 'career-005',
        title: 'Capital Goods Skill Council — Welder Qualification Pack',
        publisher: 'CGSC / NSDC',
        source_url: 'https://cgsc.in/',
        source_type: 'government_portal',
        last_verified_at: '2026-01-25T00:00:00Z',
        verification_status: 'verified',
        notes: null,
      },
    ],
    video_url: null,
  },
];

const mockCareers: CareerListItem[] = mockCareerDetails.map(({ id, title, category, overview, eligibility, status }) => ({
  id,
  title,
  category,
  overview,
  eligibility,
  status,
}));

// ─── Assessment ────────────────────────────────────────────────────────────────
const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q-001',
    prompt: 'Which type of work do you enjoy most?',
    answer_options: ['Working with my hands on physical tasks', 'Helping and caring for people', 'Working with tools and machines', 'Creative and artistic work'],
    category: 'work_preference',
    order_index: 1,
  },
  {
    id: 'q-002',
    prompt: 'What is your highest educational qualification?',
    answer_options: ['Below Class 8', 'Class 8 pass', 'Class 10 pass', 'Class 12 pass or above'],
    category: 'education',
    order_index: 2,
  },
  {
    id: 'q-003',
    prompt: 'How comfortable are you with working outdoors or on-site?',
    answer_options: ['Very comfortable', 'Comfortable', 'Prefer indoor work', 'I have physical limitations'],
    category: 'work_environment',
    order_index: 3,
  },
  {
    id: 'q-004',
    prompt: 'Which sector interests you most?',
    answer_options: ['Construction & Infrastructure', 'Health & Wellness', 'Renewable Energy', 'Manufacturing & Engineering'],
    category: 'sector_interest',
    order_index: 4,
  },
  {
    id: 'q-005',
    prompt: 'How many months can you dedicate to initial training?',
    answer_options: ['Less than 3 months', '3 to 6 months', '6 to 12 months', 'More than 1 year (ITI/Diploma)'],
    category: 'training_duration',
    order_index: 5,
  },
];

const mockAssessmentResult: AssessmentResult = {
  id: 'result-mock-001',
  suggested_career_ids: ['career-001', 'career-004', 'career-003'],
  suggested_careers: [mockCareers[0], mockCareers[3], mockCareers[2]],
  created_at: new Date().toISOString(),
};

// ─── Counselling ───────────────────────────────────────────────────────────────
const mockCounsellingResponse: CounsellingResponse = {
  answer:
    'Based on the verified information available, the ITI Electrician trade is one of the most widely recognised vocational qualifications in India. Training typically takes 2 years through a government ITI and leads to NCVT certification. Employment prospects are generally stable in construction, manufacturing and services. However, please consult a local counsellor or visit an ITI for current admission and placement details, as outcomes vary by location and institution.',
  source_refs: ['NSDC — National Occupational Standards for Electrician', 'DGET ITI Curriculum Documentation 2024-25'],
  needs_human_followup: false,
  fallback_used: false,
  conversation_id: 'conv-mock-001',
};

// ─── Locations ─────────────────────────────────────────────────────────────────
// SAMPLE DATA — coordinates are representative ITI/training centre areas, not exact addresses.
const mockLocations: SkillLocation[] = [
  {
    id: 'loc-001',
    name: 'Govt. ITI Jaipur (Sample)',
    location_type: 'ITI',
    address: 'Near SMS Hospital, Jaipur, Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    description: 'Government Industrial Training Institute offering Electrician, Plumber and Welder trades.',
    source_id: 'src-001',
    last_verified_at: '2026-01-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'loc-002',
    name: 'NSDC Skill Centre Lucknow (Sample)',
    location_type: 'Skill Centre',
    address: 'Hazratganj Area, Lucknow, Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    description: 'NSDC affiliated centre offering short-term skill courses in Beauty & Wellness and Solar Technology.',
    source_id: 'src-001',
    last_verified_at: '2026-02-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'loc-003',
    name: 'Govt. ITI Mumbai (Sample)',
    location_type: 'ITI',
    address: 'Sion, Mumbai, Maharashtra',
    latitude: 19.0396,
    longitude: 72.8654,
    description: 'Government ITI with Electrician, Welder, Plumber and Mechanic Motor Vehicle trades.',
    source_id: 'src-002',
    last_verified_at: '2026-01-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 'loc-004',
    name: 'PMKVY Centre Hyderabad (Sample)',
    location_type: 'PMKVY Centre',
    address: 'Secunderabad, Hyderabad, Telangana',
    latitude: 17.4399,
    longitude: 78.4983,
    description: 'Pradhan Mantri Kaushal Vikas Yojana centre — short-term skill training for multiple sectors.',
    source_id: 'src-003',
    last_verified_at: '2026-02-10T00:00:00Z',
    status: 'active',
  },
  {
    id: 'loc-005',
    name: 'Govt. ITI Delhi (Sample)',
    location_type: 'ITI',
    address: 'Pusa Road, New Delhi',
    latitude: 28.6368,
    longitude: 77.1685,
    description: 'One of the largest government ITIs in Delhi, offering a wide range of engineering and non-engineering trades.',
    source_id: 'src-002',
    last_verified_at: '2026-01-25T00:00:00Z',
    status: 'active',
  },
];

// ─── Videos ────────────────────────────────────────────────────────────────────
const mockVideos: CareerVideo[] = [
  {
    id: 'vid-001',
    career_id: 'career-001',
    title: 'A Day in the Life of an ITI Electrician',
    provider: 'YouTube',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    language: 'hi',
    status: 'published',
    reviewed_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'vid-002',
    career_id: 'career-004',
    title: 'Solar Panel Installation — Step by Step',
    provider: 'YouTube',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    language: 'en',
    status: 'published',
    reviewed_at: '2026-02-05T00:00:00Z',
  },
];

const mockVideoTemplates: VideoTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Career Introduction',
    description: 'A structured script introducing a career — what it is, who it suits, and how to start.',
    fields: ['career_title', 'overview_summary', 'eligibility', 'training_steps', 'progression_highlight'],
  },
  {
    id: 'tmpl-002',
    name: 'Day in the Life',
    description: 'Narrative script following a professional through a typical working day.',
    fields: ['career_title', 'morning_routine', 'main_tasks', 'challenges', 'rewards'],
  },
];

// ─── Meetings ──────────────────────────────────────────────────────────────────
const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'req-001',
    summary: 'I want to understand the ITI Electrician pathway and admission process better.',
    preferred_slots: [
      { date: '2026-10-20', time: '10:00', timezone: 'Asia/Kolkata' },
      { date: '2026-10-21', time: '14:00', timezone: 'Asia/Kolkata' },
    ],
    confirmed_slot: null,
    status: 'pending',
    consent: true,
    created_at: '2026-10-13T09:00:00Z',
    updated_at: '2026-10-13T09:00:00Z',
  },
  {
    id: 'req-002',
    summary: 'My daughter is interested in Beauty & Wellness. Need guidance on reliable training centres.',
    preferred_slots: [
      { date: '2026-10-18', time: '15:00', timezone: 'Asia/Kolkata' },
    ],
    confirmed_slot: { date: '2026-10-18', time: '15:00', timezone: 'Asia/Kolkata' },
    status: 'confirmed',
    consent: true,
    created_at: '2026-10-10T11:00:00Z',
    updated_at: '2026-10-12T14:00:00Z',
  },
];

const mockMeeting: Meeting = {
  id: 'meet-001',
  request_id: 'req-002',
  start_at: '2026-10-18T15:00:00+05:30',
  timezone: 'Asia/Kolkata',
  meet_url: null, // NOTE: Google Meet URL supplied by backend when integration is configured
  calendar_event_id: null,
  status: 'scheduled',
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
const mockAdminOverview: AdminOverview = {
  career_count: 5,
  published_career_count: 5,
  source_count: 6,
  pending_meeting_requests: 1,
  total_meeting_requests: 2,
  active_locations: 5,
  video_count: 2,
  assessment_attempts_today: 12,
};

// ─── Export ────────────────────────────────────────────────────────────────────
export const mockData = {
  user: mockUser,
  careers: mockCareers,
  careerDetails: mockCareerDetails,
  sources: mockSources,
  assessmentQuestions: mockAssessmentQuestions,
  assessmentResult: mockAssessmentResult,
  counsellingResponse: mockCounsellingResponse,
  locations: mockLocations,
  videos: mockVideos,
  videoTemplates: mockVideoTemplates,
  meetingRequests: mockMeetingRequests,
  meeting: mockMeeting,
  adminOverview: mockAdminOverview,
};
