@echo off
echo ===================================================
echo Starting MaargMitra / SkillSathi Full Platform...
echo ===================================================

echo [1/3] Starting FastAPI Backend on port 8000...
start "MaargMitra Backend (FastAPI)" cmd /k "cd /d c:\Users\Deepti\Desktop\ps241\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Vite Frontend on port 5173...
start "MaargMitra Frontend (Vite)" cmd /k "cd /d c:\Users\Deepti\Desktop\ps241 && npm run dev"

echo [3/3] Opening browser at http://localhost:5173/...
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo ===================================================
echo Both servers have been launched in separate windows!
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:8000/docs
echo ===================================================
