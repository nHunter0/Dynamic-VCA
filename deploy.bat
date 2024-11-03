@echo off
setlocal

REM Navigate to the quant-dashboard directory
cd %~dp0\quant-dashboard

REM --- Backend Deployment ---
echo Setting up backend...
cd backend

REM Check if virtual environment folder exists in quant-dashboard
if not exist "..\venv" (
    echo Creating virtual environment...
    python -m venv ..\venv
)

REM Activate virtual environment and install dependencies
call ..\venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt

REM Start backend server in a new command window (adjust the command as needed)
echo Starting backend server...
start cmd /k "call ..\venv\Scripts\activate && python -m app"

REM Return to quant-dashboard directory
cd ..

REM --- Frontend Deployment ---
echo Setting up frontend...
cd frontend

REM Check if node_modules folder exists, if not, install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Build the frontend application
echo Building frontend...
npm run build

REM (Optional) Start frontend preview server (adjust if needed for deployment)
echo Starting frontend preview server...
start cmd /k "npm run preview"

REM Return to quant-dashboard root directory
cd ..

echo Deployment complete!
pause
endlocal
