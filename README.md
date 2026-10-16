# मार्गमित्र (MaargMitra) Frontend

मार्गमित्र (MaargMitra) is a vocational career guidance platform. The app is built with React, TypeScript, Vite, Tailwind CSS, React Router and Axios, with a central API layer and mock fallback data for demo and integration readiness.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios for API calls
- Leaflet + react-leaflet for map rendering
- Lucide icons

## Project structure

- `src/pages` — route-level screens for landing, auth, careers, assessment, counselling, map, meetings, and admin
- `src/components` — reusable UI pieces such as navbar, cards, wrappers, and loading/error states
- `src/context/AuthContext.tsx` — session handling and auth provider
- `src/services/api.ts` — central API client and service layer
- `src/services/mock.ts` — sample/mock data for demo mode
- `src/types` — shared TypeScript interfaces matching the API contract draft

## Environment setup

Create a local environment file from the template:

```bash
cp .env.example .env
```

Required variables:

```env
VITE_API_BASE_URL=
VITE_USE_MOCK=
```

- `VITE_API_BASE_URL`: backend base URL, e.g. `http://localhost:8000/api/v1`
- `VITE_USE_MOCK`: set to `true` to use mock data or `false` for live backend integration

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev -- --host 0.0.0.0
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173/`.

## Production build and validation

```bash
npm run build
npm run lint
```

There is no dedicated automated `npm test` script configured in this repository. The project currently validates via linting and a production build; a smoke-test checklist is included below for manual route verification.

## Page-to-endpoint mapping

| Page | Route | Backend endpoint | Notes |
| --- | --- | --- | --- |
| Landing page | `/` | None | Static marketing and navigation page |
| Login | `/login` | `POST /auth/login` | Auth flow uses JWT token in local storage |
| Signup | `/signup` | `POST /auth/signup` | Learner account creation |
| Profile | `/profile` | `GET /auth/me`, `PATCH /profiles/me` | Protected learner route |
| Career directory | `/careers` | `GET /careers` | Filtered search and category view |
| Career details | `/careers/:id` | `GET /careers/{career_id}` | Source citations and CTA actions |
| Assessment | `/assessment` | `GET /assessments/questions`, `POST /assessments/attempts` | Multi-step question flow and result display |
| Assessment result | `/assessment/result` | result returned from submit attempt | Result page receives state from assessment submit |
| AI counselling | `/counselling` | `POST /counselling/messages` | Text-based counselling with AI and source refs |
| Skill map | `/map` | `GET /map/skill-centres` | Interactive map with sample skill centre data |
| Career videos | `/videos` | `GET /videos/templates`, `POST /videos/jobs`, `GET /videos/jobs/{job_id}` | Video generation and listing flow |
| Book counsellor meeting | `/counsellor-request` | `POST /meetings/requests` | Learner meeting request form |
| My meetings | `/my-requests` | `GET /meetings/requests/me` | Status and details for learner |
| Meeting detail | `/meeting/:id` | `GET /meetings/{id}` | Shows Google Meet link when backend provides it |
| Counsellor queue | `/counsellor/requests` | `GET /admin/requests` and `PATCH /meetings/requests/{request_id}` | Counsellor workflow |
| Admin overview | `/admin` | `GET /admin/overview` | Dashboard summary |
| Admin careers | `/admin/careers` | `POST /admin/careers` | Content management |
| Admin locations | `/admin/locations` | `POST /admin/locations` | Map maintenance |
| Admin sources | `/admin/sources` | `GET /admin/sources` | Source validation and admin review |
| Admin videos | `/admin/videos` | Video admin endpoints | Content workflow |
| Admin requests | `/admin/requests` | `GET /admin/requests` | Meeting queue management |

## Mocked or blocked integrations

The frontend explicitly labels sample/mock data and keeps provider secrets out of browser code.

- `VITE_USE_MOCK=true` enables mock data for auth, careers, assessment, counselling, map, videos and meeting flows.
- AI provider calls are expected to remain on the backend. The frontend only sends a text payload and displays the backend response.
- Google Meet URL generation is intentionally not created on the frontend. The backend must provide `meet_url` once a counsellor confirms the request.
- Video generation/rendering remains a backend job workflow; the frontend represents the queue, state and job status only.
- Location data is displayed as sample coordinates and is clearly marked as sample in the UI.
- Auth uses a local token in browser storage; the backend must provide the real JWT/OAuth implementation.

## Backend dependency notes

The application is ready to integrate with the draft backend contract, but the following backend work remains required for production use:

1. Real authentication provider and token lifecycle
2. User profile and RBAC enforcement for learner, counsellor and admin roles
3. Career content CRUD and source verification pipeline
4. Assessment recommendation engine with approved scoring logic
5. AI counselling service with source-grounded retrieval and provider wrappers
6. Google Calendar/Meet integration for meeting confirmation and link generation
7. Verified location dataset with geospatial coordinates and status updates
8. Video job processing pipeline and published media hosting

## Smoke-test checklist

1. Start the app with `npm run dev -- --host 0.0.0.0`.
2. Verify the landing page loads and the navigation is visible.
3. Open `/careers` and confirm cards render with sample data.
4. Open `/assessment` and complete the assessment flow from start to result page.
5. Open `/counselling` and send a sample question in English and Hindi.
6. Open `/map` and ensure markers and filter chips render without crashes.
7. Open `/counsellor-request` and submit a meeting request successfully.
8. Open `/my-requests` and verify the request is visible.
9. Open `/login` and `/signup` forms and test validation messages.
10. Open `/admin` and confirm protected-role handling works with the mock session.

## Notes

This frontend intentionally follows the draft API contract without inventing undocumented fields or silently removing required backend calls. Where a backend dependency is missing, the UI shows the right state and clearly documents the pending integration.
