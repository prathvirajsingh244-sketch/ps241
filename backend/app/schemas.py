from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

UserRole = Literal["learner", "counsellor", "admin"]
Language = Literal["en", "hi"]


class UserInDB(BaseModel):
    id: str
    display_name: str
    email: str
    role: UserRole
    preferred_language: Language
    created_at: datetime
    password_hash: str


class UserPublic(BaseModel):
    id: str
    display_name: str
    email: str
    role: UserRole
    preferred_language: Language
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthLoginRequest(BaseModel):
    email: str
    password: str


class AuthSignupRequest(BaseModel):
    display_name: str
    email: str
    password: str
    preferred_language: Language = "hi"
    role: UserRole = "learner"


class AuthLoginResponse(TokenResponse):
    user: UserPublic


class AuthSignupResponse(BaseModel):
    user: UserPublic
    access_token: str
    token_type: str = "bearer"


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    preferred_language: Optional[Language] = None
    education_level: Optional[str] = None
    district: Optional[str] = None


class SourceOut(BaseModel):
    id: str
    career_id: str
    title: str
    publisher: str
    source_url: str
    source_type: str
    last_verified_at: Optional[str] = None
    verification_status: Literal["verified", "unverified", "pending"]
    notes: Optional[str] = None


class CareerOut(BaseModel):
    id: str
    title: str
    category: str
    overview: str
    eligibility: str
    skills: List[str]
    training_path: str
    progression_path: str
    language: Language
    status: Literal["draft", "published"]
    created_at: str
    updated_at: str
    sources: List[SourceOut]
    video_url: Optional[str] = None


class CareerListItem(BaseModel):
    id: str
    title: str
    category: str
    overview: str
    eligibility: str
    status: Literal["draft", "published"]


class CareerListResponse(BaseModel):
    items: List[CareerListItem]
    total: int
    page: int
    page_size: int


class AssessmentQuestion(BaseModel):
    id: str
    prompt: str
    answer_options: List[str]
    category: str
    order_index: int


class AssessmentQuestionSet(BaseModel):
    assessment_id: str
    version: int
    questions: List[AssessmentQuestion]


class AssessmentAnswer(BaseModel):
    question_id: str
    selected_option: str


class AssessmentAttemptRequest(BaseModel):
    answers: List[AssessmentAnswer]


class AssessmentResult(BaseModel):
    id: str
    suggested_career_ids: List[str]
    suggested_careers: List[CareerListItem]
    created_at: str


class AssessmentAttemptResponse(BaseModel):
    attempt_id: str
    status: str = "completed"
    result: AssessmentResult


class CounsellingMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: Optional[Language] = None


class CounsellingResponse(BaseModel):
    answer: str
    source_refs: List[str]
    needs_human_followup: bool
    fallback_used: bool
    conversation_id: str


class SkillLocationOut(BaseModel):
    id: str
    name: str
    location_type: str
    address: str
    latitude: float
    longitude: float
    description: str
    source_id: str
    last_verified_at: Optional[str] = None
    status: Literal["active", "inactive"]


class VideoTemplateOut(BaseModel):
    id: str
    name: str
    description: str
    fields: List[str]


class VideoJobRequest(BaseModel):
    career_id: str
    template_id: str
    title: str
    language: Language = "en"
    script: Optional[str] = None


class VideoJobOut(BaseModel):
    id: str
    status: Literal["pending", "processing", "completed", "failed"]
    career_id: str
    title: str
    video_url: Optional[str] = None
    created_at: str
    updated_at: str


class MeetingSlot(BaseModel):
    date: str
    time: str
    timezone: str


class MeetingRequestPayload(BaseModel):
    summary: str
    preferred_slots: List[MeetingSlot]
    consent: bool = True
    contact_info: Optional[str] = None


class MeetingRequestOut(BaseModel):
    id: str
    summary: str
    preferred_slots: List[MeetingSlot]
    confirmed_slot: Optional[MeetingSlot] = None
    status: Literal["pending", "confirmed", "alternate_proposed", "cancelled"]
    consent: bool
    created_at: str
    updated_at: str


class MeetingOut(BaseModel):
    id: str
    request_id: str
    start_at: str
    timezone: str
    meet_url: Optional[str] = None
    calendar_event_id: Optional[str] = None
    status: Literal["scheduled", "completed", "cancelled"]


class AdminOverview(BaseModel):
    career_count: int
    published_career_count: int
    source_count: int
    pending_meeting_requests: int
    total_meeting_requests: int
    active_locations: int
    video_count: int
    assessment_attempts_today: int


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str


class ErrorEnvelope(BaseModel):
    error: dict


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "skillsaathi-api"
    version: str = "0.1.0"
