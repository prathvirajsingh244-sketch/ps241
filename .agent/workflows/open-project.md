---
description: Start the PS241 (MaargMitra) frontend and backend dev servers and open the project in the browser
---

> ⚠️ **RULE: Never run `git commit` or `git push` automatically. Always wait for explicit user instruction before committing any changes.**


# Open PS241 Project

// turbo-all

1. Install frontend dependencies if not already installed
```
npm install
```
Run from: `c:\Users\Deepti\Desktop\ps241`

2. Install backend dependencies if not already installed
```
python -m pip install -r backend/requirements.txt
```
Run from: `c:\Users\Deepti\Desktop\ps241`

3. Start the Vite frontend dev server (runs on http://localhost:5173)
```
npm run dev
```
Run from: `c:\Users\Deepti\Desktop\ps241`

4. Start the FastAPI backend server (runs on http://localhost:8000)
```
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Run from: `c:\Users\Deepti\Desktop\ps241\backend`

5. Open the browser at http://localhost:5173/
