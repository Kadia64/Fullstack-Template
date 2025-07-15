@echo off

FOR /F "tokens=* USEBACKQ" %%F IN (`cd`) DO (
    SET BATCH_DIR=%%F
)

cd %BATCH_DIR%\Application\frontend-application

echo Starting Next.js development server on http://localhost:3000

CALL npm run dev

cd ..