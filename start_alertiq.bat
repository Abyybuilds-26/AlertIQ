@echo off
title AlertIQ App Launcher
echo ========================================================
echo  Launching AlertIQ Scam Detection & Digital Safety
echo  1. Starting Backend API on http://127.0.0.1:8000
echo  2. Starting Frontend Web App on http://localhost:5173
echo ========================================================
start "AlertIQ Backend (FastAPI)" cmd /k "%~dp0run_backend.bat"
timeout /t 2 /nobreak >nul
start "AlertIQ Frontend (React Vite)" cmd /k "%~dp0run_frontend.bat"
echo.
echo Both servers are launching!
echo Once started, open your browser at: http://localhost:5173
pause
