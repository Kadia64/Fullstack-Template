import os
import re

# Read the current settings.py
with open('backend/settings.py', 'r') as f:
    content = f.read()

# Check if CORS settings already exist
if 'CORS_ALLOWED_ORIGINS' not in content:
    # Add to the end of settings.py
    with open('backend/settings.py', 'a') as f:
        f.write('''

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
''')

# Re-read the content
with open('backend/settings.py', 'r') as f:
    content = f.read()

# Add apps to INSTALLED_APPS only if they don't exist
if '"corsheaders"' not in content and "'corsheaders'" not in content:
    pattern = r'(INSTALLED_APPS = \[)(.*?)(\])'
    def add_apps(match):
        return match.group(1) + match.group(2) + '    "corsheaders",\n    "rest_framework",\n' + match.group(3)
    content = re.sub(pattern, add_apps, content, flags=re.DOTALL)

# Add corsheaders middleware only if it doesn't exist
if 'corsheaders.middleware.CorsMiddleware' not in content:
    middleware_pattern = r'(MIDDLEWARE = \[)(.*?)(\])'
    def add_middleware(match):
        return match.group(1) + '\n    "corsheaders.middleware.CorsMiddleware",' + match.group(2) + match.group(3)
    content = re.sub(middleware_pattern, add_middleware, content, flags=re.DOTALL)

with open('backend/settings.py', 'w') as f:
    f.write(content)