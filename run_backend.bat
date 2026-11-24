@echo off
title AlertIQ - Backend API (FastAPI)
cd /d "%~dp0\backend"
echo ========================================================
echo  AlertIQ FastAPI Backend Server
echo  Listening at: http://127.0.0.1:8000
echo  Interactive API Docs: http://127.0.0.1:8000/docs
echo ========================================================
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
