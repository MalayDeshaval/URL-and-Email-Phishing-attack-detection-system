@echo off
echo Starting PhishGuard AI Full Stack...

:: Open Backend in a new window
start cmd /k "echo Starting Backend... && pip install -r backend/requirements.txt && python backend/app/main.py"

:: Open Frontend in a new window
start cmd /k "echo Starting Frontend... && cd frontend && npm install && npm run dev"

echo Both services are launching in separate windows. 
echo You can close this window now.
pause
