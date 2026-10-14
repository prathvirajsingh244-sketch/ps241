# SkillSaathi Backend

This backend is a FastAPI implementation for the SkillSaathi project. It follows the member handoff contract and is designed to work with the existing frontend API client.

## Quick start

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open:
- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

## Base URL

```text
/api/v1
```

## Notes

This is a working mock-backed backend for development and demo purposes. It exposes the same routes expected by the frontend contract, while keeping data in memory so it runs without a database setup.
