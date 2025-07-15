@echo off

cd C:\Users\wesgl\OneDrive\Desktop\Website Automation\Model Context Protocol\Fullstack Template

echo Starting Django server on http://localhost:8000

CALL venv\Scripts\activate
CALL python manage.py migrate
CALL python manage.py runserver

cd ..