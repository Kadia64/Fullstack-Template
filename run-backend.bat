@echo off

FOR /F "tokens=* USEBACKQ" %%F IN (`cd`) DO (
    SET BATCH_DIR=%%F
)

cd %BATCH_DIR%\Application

IF NOT EXIST "%BATCH_DIR%\Application\venv" (
    echo Starting python virtual environment...
    python -m venv venv

    echo installing django dependencies...
    CALL venv\Scripts\activate && pip install django djangorestframework django-cors-headers
)


echo Starting Django server on http://localhost:8000

CALL venv\Scripts\activate
CALL python manage.py migrate
CALL python manage.py runserver 0.0.0.0:8000

cd ..
