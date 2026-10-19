from __future__ import annotations

# Fix for Python 3.9 compatibility with Pydantic JSON schema generation
try:
    import pydantic.json_schema
    _orig_get_literal_values = pydantic.json_schema.get_literal_values
    def _patched_get_literal_values(annotation, **kwargs):
        for val in _orig_get_literal_values(annotation, **kwargs):
            if hasattr(val, '__args__'):
                yield from _patched_get_literal_values(val, **kwargs)
            else:
                yield val
    pydantic.json_schema.get_literal_values = _patched_get_literal_values
except Exception:
    pass

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from app.ai_service import generate_counselling_reply
from app.config import settings
from app.data import (
    ADMIN_OVERVIEW,
    ASSESSMENT_QUESTIONS,
    CAREER_DETAILS,
    MEETING_REQUESTS,
    SKILL_LOCATIONS,
    VIDEO_ITEMS,
    VIDEO_TEMPLATES,
)
from app.schemas import (
    AdminOverview,
    AssessmentAnswer,
    AssessmentAttemptRequest,
    AssessmentAttemptResponse,
    AssessmentQuestionSet,
    AssessmentResult,
    AuthLoginRequest,
    AuthLoginResponse,
    AuthSignupRequest,
    AuthSignupResponse,
    CareerListItem,
    CareerListResponse,
    CareerOut,
    CounsellingMessageRequest,
    CounsellingResponse,
    HealthResponse,
    MeetingOut,
    MeetingRequestOut,
    MeetingRequestPayload,
    ProfileUpdateRequest,
    UserPublic,
    VideoJobOut,
    VideoJobRequest,
    VideoTemplateOut,
    ParentExpectationsIn,
    ParentExpectationsOut,
    ComparisonReport,
    ComparisonItem,
    RoadmapOut,
    RoadmapStep,
)
from app.security import create_access_token, get_current_user_email, hash_password, verify_password


app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def user_public(user: dict[str, Any]) -> UserPublic:
    return UserPublic(
        id=user['id'],
        display_name=user['display_name'],
        email=user['email'],
        role=user['role'],
        preferred_language=user['preferred_language'],
        created_at=datetime.fromisoformat(user['created_at'].replace('Z', '+00:00')),
    )


USER_DB: Dict[str, Dict[str, Any]] = {
    'arjun@example.com': {
        'id': 'user-001',
        'display_name': 'Arjun Sharma',
        'email': 'arjun@example.com',
        'role': 'learner',
        'preferred_language': 'hi',
        'created_at': iso_now(),
        'password_hash': hash_password('password123'),
    },
    'counsellor@maargmitra.in': {
        'id': 'user-counsellor-001',
        'display_name': 'Meera Singh',
        'email': 'counsellor@maargmitra.in',
        'role': 'counsellor',
        'preferred_language': 'en',
        'created_at': iso_now(),
        'password_hash': hash_password('counsellor123'),
    },
    'admin@maargmitra.in': {
        'id': 'user-admin-001',
        'display_name': 'MaargMitra Admin',
        'email': 'admin@maargmitra.in',
        'role': 'admin',
        'preferred_language': 'en',
        'created_at': iso_now(),
        'password_hash': hash_password('admin123'),
    },
}

# In-memory store for parent expectations
PARENT_EXPECTATIONS_DB: Dict[str, Dict[str, Any]] = {}


def get_user_by_email(email: Optional[str]) -> Optional[Dict[str, Any]]:
    if not email:
        return None
    return USER_DB.get(email.lower())


def require_role(role: str, email: str) -> Dict[str, Any]:
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    if user['role'] != role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    return user


@app.get(settings.api_prefix + '/health', response_model=HealthResponse)
def health() -> dict[str, str]:
    return {'status': 'ok', 'service': 'maargmitra-api', 'version': settings.app_version}


@app.post(settings.api_prefix + '/auth/signup', response_model=AuthSignupResponse)
def signup(payload: AuthSignupRequest):
    normalized_email = payload.email.lower().strip()
    if get_user_by_email(normalized_email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User already exists')

    user = {
        'id': f'user-{uuid.uuid4()}',
        'display_name': payload.display_name.strip(),
        'email': normalized_email,
        'role': payload.role,
        'preferred_language': payload.preferred_language,
        'created_at': iso_now(),
        'password_hash': hash_password(payload.password),
    }
    USER_DB[normalized_email] = user

    token = create_access_token(normalized_email)
    return {
        'user': user_public(user),
        'access_token': token,
        'token_type': 'bearer',
    }


@app.post(settings.api_prefix + '/auth/login', response_model=AuthLoginResponse)
def login(payload: AuthLoginRequest):
    user = get_user_by_email(payload.email.lower().strip())
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
    if not verify_password(payload.password, user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

    token = create_access_token(user['email'])
    return {
        'access_token': token,
        'token_type': 'bearer',
        'user': user_public(user),
    }


@app.get(settings.api_prefix + '/auth/me', response_model=UserPublic)
def get_me(current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user_public(user)


@app.patch(settings.api_prefix + '/profiles/me', response_model=UserPublic)
def update_profile(payload: ProfileUpdateRequest, current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    if payload.display_name is not None:
        user['display_name'] = payload.display_name.strip()
    if payload.preferred_language is not None:
        user['preferred_language'] = payload.preferred_language
    if payload.education_level is not None:
        user['education_level'] = payload.education_level
    if payload.district is not None:
        user['district'] = payload.district

    USER_DB[user['email']] = user
    return user_public(user)


@app.get(settings.api_prefix + '/careers', response_model=CareerListResponse)
def list_careers(
    q: str | None = Query(default=None, alias='q'),
    category: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    results = []
    for career in CAREER_DETAILS:
        title = (career['title'] or '').lower()
        overview = (career['overview'] or '').lower()
        match_query = True
        if q:
            search_term = q.lower()
            match_query = search_term in title or search_term in overview
        if category and career['category'] != category:
            match_query = False
        if match_query:
            results.append(CareerListItem(
                id=career['id'],
                title=career['title'],
                category=career['category'],
                overview=career['overview'],
                eligibility=career['eligibility'],
                status=career['status'],
            ))

    total = len(results)
    start = (page - 1) * page_size
    end = start + page_size
    paged = results[start:end]
    return CareerListResponse(items=paged, total=total, page=page, page_size=page_size)


@app.get(settings.api_prefix + '/careers/{career_id}', response_model=CareerOut)
def get_career(career_id: str):
    career = next((item for item in CAREER_DETAILS if item['id'] == career_id), None)
    if not career:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Career not found')
    return CareerOut(**career)


@app.get(settings.api_prefix + '/assessments/questions', response_model=list[dict[str, Any]])
def get_assessment_questions():
    return ASSESSMENT_QUESTIONS


@app.post(settings.api_prefix + '/assessments/attempts', response_model=dict[str, Any])
def submit_attempt(payload: AssessmentAttemptRequest):
    if not payload.answers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No answers submitted')

    suggested = CAREER_DETAILS[:3]
    suggested_ids = [item['id'] for item in suggested]
    suggested_careers = [CareerListItem(
        id=item['id'],
        title=item['title'],
        category=item['category'],
        overview=item['overview'],
        eligibility=item['eligibility'],
        status=item['status'],
    ) for item in suggested]

    result = AssessmentResult(
        id=f'attempt-{uuid.uuid4()}',
        suggested_career_ids=suggested_ids,
        suggested_careers=suggested_careers,
        created_at=iso_now(),
    )
    return {
        'attempt_id': result.id,
        'status': 'completed',
        'id': result.id,
        'suggested_career_ids': result.suggested_career_ids,
        'suggested_careers': result.suggested_careers,
        'created_at': result.created_at,
    }


@app.post(settings.api_prefix + '/counselling/messages', response_model=CounsellingResponse)
def counselling_message(payload: CounsellingMessageRequest):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Message is required')

    response = generate_counselling_reply(message, payload.language, settings.gemini_api_key)
    return {
        'answer': response['answer'],
        'source_refs': response.get('source_refs', []),
        'needs_human_followup': response.get('needs_human_followup', False),
        'fallback_used': response.get('fallback_used', False),
        'conversation_id': payload.conversation_id or f'conv-{uuid.uuid4()}',
    }


@app.get(settings.api_prefix + '/map/skill-centres')
def get_skill_centres():
    return SKILL_LOCATIONS


@app.get(settings.api_prefix + '/videos', response_model=list[dict[str, Any]])
def list_videos(language: str | None = Query(default=None, alias='language')):
    items = VIDEO_ITEMS
    if language:
        items = [video for video in items if video.get('language') == language]
    return items


@app.get(settings.api_prefix + '/videos/templates', response_model=list[VideoTemplateOut])
def get_video_templates():
    return VIDEO_TEMPLATES


@app.post(settings.api_prefix + '/videos/jobs', response_model=VideoJobOut)
def create_video_job(payload: VideoJobRequest):
    job = {
        'id': f'job-{uuid.uuid4()}',
        'status': 'pending',
        'career_id': payload.career_id,
        'title': payload.title,
        'video_url': None,
        'created_at': iso_now(),
        'updated_at': iso_now(),
    }
    return VideoJobOut(**job)


@app.get(settings.api_prefix + '/videos/jobs/{job_id}', response_model=VideoJobOut)
def get_video_job(job_id: str):
    return VideoJobOut(
        id=job_id,
        status='processing',
        career_id='career-001',
        title='Sample Video Job',
        video_url=None,
        created_at=iso_now(),
        updated_at=iso_now(),
    )


@app.post(settings.api_prefix + '/meetings/requests', response_model=MeetingRequestOut)
def create_meeting_request(payload: MeetingRequestPayload, current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    req = {
        'id': f'req-{uuid.uuid4()}',
        'summary': payload.summary,
        'preferred_slots': [slot.model_dump() for slot in payload.preferred_slots],
        'confirmed_slot': None,
        'status': 'pending',
        'consent': payload.consent,
        'created_at': iso_now(),
        'updated_at': iso_now(),
    }
    MEETING_REQUESTS.append(req)
    return MeetingRequestOut(**req)


@app.get(settings.api_prefix + '/meetings/requests/me', response_model=list[MeetingRequestOut])
def list_my_meeting_requests(current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return [MeetingRequestOut(**item) for item in MEETING_REQUESTS]


@app.patch(settings.api_prefix + '/meetings/requests/{request_id}', response_model=MeetingRequestOut)
def update_meeting_request(request_id: str, payload: Dict[str, Any], current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    request_item = next((item for item in MEETING_REQUESTS if item['id'] == request_id), None)
    if not request_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Meeting request not found')

    if 'status' in payload:
        request_item['status'] = payload['status']
    if 'confirmed_slot' in payload and payload['confirmed_slot'] is not None:
        request_item['confirmed_slot'] = payload['confirmed_slot']
    request_item['updated_at'] = iso_now()
    return MeetingRequestOut(**request_item)


@app.get(settings.api_prefix + '/admin/overview', response_model=AdminOverview)
def admin_overview(current_email: str = Depends(get_current_user_email)):
    require_role('admin', current_email)
    return AdminOverview(**ADMIN_OVERVIEW)


@app.get(settings.api_prefix + '/admin/requests', response_model=list[MeetingRequestOut])
def admin_requests(current_email: str = Depends(get_current_user_email)):
    require_role('admin', current_email)
    return [MeetingRequestOut(**item) for item in MEETING_REQUESTS]


@app.post(settings.api_prefix + '/admin/careers', response_model=CareerOut)
def admin_create_career(payload: dict[str, Any], current_email: str = Depends(get_current_user_email)):
    require_role('admin', current_email)
    new_id = f"career-{uuid.uuid4()}"
    career = {
        'id': new_id,
        'title': payload.get('title', 'New Career'),
        'category': payload.get('category', 'General'),
        'overview': payload.get('overview', 'Sample overview'),
        'eligibility': payload.get('eligibility', 'Program-specific eligibility'),
        'skills': payload.get('skills', []),
        'training_path': payload.get('training_path', 'Training pathway to be added'),
        'progression_path': payload.get('progression_path', 'Career progression to be added'),
        'language': payload.get('language', 'en'),
        'status': payload.get('status', 'published'),
        'created_at': iso_now(),
        'updated_at': iso_now(),
        'sources': [],
        'video_url': payload.get('video_url'),
    }
    CAREER_DETAILS.append(career)
    return CareerOut(**career)


# ── Parent Endpoints ──────────────────────────────────────────────────────────

@app.post(settings.api_prefix + '/parent/expectations', response_model=ParentExpectationsOut)
def save_parent_expectations(payload: ParentExpectationsIn, current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    record = {
        'id': f'exp-{uuid.uuid4()}',
        'parent_id': user['id'],
        'salary_range': payload.salary_range,
        'preferred_field': payload.preferred_field,
        'future_goal': payload.future_goal,
        'notes': payload.notes,
        'created_at': iso_now(),
    }
    PARENT_EXPECTATIONS_DB[user['id']] = record
    return ParentExpectationsOut(**record)


@app.get(settings.api_prefix + '/parent/expectations/me', response_model=Optional[ParentExpectationsOut])
def get_parent_expectations(current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    record = PARENT_EXPECTATIONS_DB.get(user['id'])
    if not record:
        return None
    return ParentExpectationsOut(**record)


@app.get(settings.api_prefix + '/parent/comparison', response_model=ComparisonReport)
def get_comparison_report(current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    expectations = PARENT_EXPECTATIONS_DB.get(user['id'])
    salary = expectations['salary_range'] if expectations else 'Not specified'
    field = expectations['preferred_field'] if expectations else 'Not specified'
    return ComparisonReport(
        summary='Comparison based on parent expectations and student assessment results.',
        alignment_score=72,
        items=[
            ComparisonItem(topic='Preferred Field', parent_view=field, student_view='Engineering & Technology', aligned=field in ['Engineering', 'Technology', 'Engineering & Technology']),
            ComparisonItem(topic='Expected Salary', parent_view=salary, student_view='₹15,000–₹25,000/month (entry level)', aligned=False),
            ComparisonItem(topic='Work Environment', parent_view='Office/Indoor preferred', student_view='Comfortable with outdoor/on-site', aligned=False),
            ComparisonItem(topic='Training Duration', parent_view='Short course preferred', student_view='More than 1 year (ITI/Diploma)', aligned=False),
        ],
        recommendation='There are some expectation gaps. A counsellor session is recommended to align on career goals.',
    )


# ── Roadmap Endpoint ──────────────────────────────────────────────────────────

@app.get(settings.api_prefix + '/roadmap/me', response_model=RoadmapOut)
def get_my_roadmap(current_email: str = Depends(get_current_user_email)):
    user = get_user_by_email(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return RoadmapOut(
        career_title='Electrician (ITI)',
        steps=[
            RoadmapStep(step=1, title='Complete Class 10', description='Pass Class 10 with Science and Mathematics.', duration='As applicable', completed=True),
            RoadmapStep(step=2, title='Apply to Government ITI', description='Fill ITI admission form (NCVT/SCVT). Deadline usually June–July.', duration='1 month', completed=False),
            RoadmapStep(step=3, title='ITI Electrician Trade (2 years)', description='Complete 2-year Electrician course at ITI. Covers wiring, circuits, safety.', duration='2 years', completed=False),
            RoadmapStep(step=4, title='NCVT Certification Exam', description='Appear for National Council for Vocational Training exam.', duration='2 months', completed=False),
            RoadmapStep(step=5, title='Apprenticeship', description='Join apprenticeship under Apprentices Act 1961 at a company.', duration='1 year', completed=False),
            RoadmapStep(step=6, title='First Job / Self Employment', description='Apply for Junior Electrician roles or start as an independent contractor.', duration='Ongoing', completed=False),
        ]
    )


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app.main:app', host='0.0.0.0', port=8000, reload=True)
