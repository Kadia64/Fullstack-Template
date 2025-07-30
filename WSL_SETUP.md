# WSL Setup Guide for Django + Next.js Development

This guide provides step-by-step instructions for setting up WSL2 with Windows 11 mirrored networking mode to enable seamless development with Django backend and Next.js frontend.

## Prerequisites
- Windows 11 (Build 22H2 or later)
- WSL2 installed
- Django project running on Windows
- Next.js project running on Windows
- Claude CLI installed in WSL

## Step 0: Install Playwright MCP Server for Claude

Before starting the network configuration, you need to install the Playwright MCP server in WSL:

1. Install the Playwright MCP server:
   ```bash
   claude mcp add playwright @playwright/mcp@latest
   ```

2. Install Chromium dependencies for Playwright:
   ```bash
   npx playwright install chrome
   ```

This enables Claude to control a browser instance from within WSL, which is necessary for testing web applications.

## Step 1: Enable WSL2 Mirrored Networking Mode

1. Open your Windows user directory:
   - Press `Windows + R` to open the Run dialog
   - Type `%USERPROFILE%` and press Enter
   - This opens your user directory (e.g., `C:\Users\YourUsername`)

2. Create or edit the `.wslconfig` file in this directory.

3. Add the following configuration:
   ```ini
   [wsl2]
   networkingMode=mirrored
   localhostForwarding=true
   dnsTunneling=true
   firewall=true
   autoProxy=true

   [experimental]
   hostAddressLoopback=true
   ```

4. Save the file.

## Step 2: Configure Windows Firewall

1. Open PowerShell as Administrator.

2. Run the following command to allow WSL through the firewall:
   ```powershell
   New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL)" -Action Allow
   ```
   
   Note: If you get an error about the interface alias, try:
   ```powershell
   New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL (Hyper-V firewall))" -Action Allow
   ```
- To view network interface configuration, open Control Panel > Network and Internet > Network Sharing Center > Change Adapter Settings. And from there you should be able to see a network interface called "vEthernet (WSL)" or "vEthernet (WSL (Hyper-V firewall))"

3. You should see output confirming the rule was created successfully with `PrimaryStatus: OK`.

## Step 3: Update Django Settings

### Finding Your IP Addresses

Before updating Django settings, you need to find your network IP addresses:

1. **WSL Host IP** (from WSL terminal):
   ```bash
   ip route | grep default | awk '{print $3}'
   ```
   Example output: `172.23.240.1`

2. **Your LAN IP** (from Windows Command Prompt):
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.192`)

### Update Django Configuration

1. Edit your Django `settings.py` file to accept connections from all hosts:
   ```python
   ALLOWED_HOSTS = [
       'localhost',           # Standard localhost
       '127.0.0.1',          # Localhost IP
       '172.23.240.1',       # WSL host IP (replace with your output from step 1)
       '192.168.1.192',      # Your LAN IP (replace with your output from step 2)
       '*'                   # Wildcard for development (remove in production)
   ]
   ```
   
   **Why these IPs?**
   - `localhost` and `127.0.0.1`: Standard local development
   - WSL host IP: Allows connections from WSL when mirrored mode isn't active
   - LAN IP: Allows testing from other devices on your network
   - `*`: Catch-all for development (security risk in production)

2. Update CORS settings to allow frontend connections:
   ```python
   # CORS settings
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",        # Standard localhost
       "http://127.0.0.1:3000",       # Localhost IP
       "http://172.23.240.1:3000",    # WSL host IP (replace with yours)
       "http://192.168.1.192:3000",   # Your LAN IP (replace with yours)
   ]
   ```
   
   **Why these origins?**
   - CORS (Cross-Origin Resource Sharing) blocks requests from different origins
   - Frontend at `localhost:3000` needs permission to call backend at `localhost:8000`
   - Each IP address the frontend might be accessed from needs to be whitelisted

## Step 4: Configure Frontend API Calls

1. Create or update your API configuration file (e.g., `app/utils/api.js`) to dynamically use the browser's hostname:
   ```javascript
   // API configuration
   // This will use the current browser's host, making it work everywhere
   const getAPIBaseURL = () => {
     // If we have an explicit URL set, use it (for production)
     if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
       return process.env.NEXT_PUBLIC_API_URL;
     }
     
     // For development, use the current host
     if (typeof window !== 'undefined') {
       return `http://${window.location.hostname}:8000/api`;
     }
     
     // Server-side fallback
     return 'http://localhost:8000/api';
   };
   ```

2. Create a `.env.local` file in your Next.js frontend-application directory:
   - Navigate to your project's `frontend-application` folder
   - Create a new file named `.env.local` (note the dot at the beginning)
   - Add the following content:
   ```
   # This file is for local development only
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   
   **Note:** This file will be hidden in Windows Explorer unless "Show hidden files" is enabled.

## Step 5: Start Services with Correct Configuration

1. **Django Backend**: Start with binding to all interfaces:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   
   Alternatively, create a `run-backend.bat` file:
   ```batch
   @echo off
   echo Starting Django backend on all interfaces...
   cd /d "%~dp0"
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Next.js Frontend**: The default `npm run dev` already binds to all interfaces.

## Step 6: Apply WSL Configuration Changes

1. Close all WSL terminals.

2. In PowerShell or Command Prompt, shutdown WSL:
   ```powershell
   wsl --shutdown
   ```

3. Start WSL again.

## Verification

After completing these steps, test your setup:

### Testing with nc (netcat) from WSL

The `nc` (netcat) command tests if a port is open and accepting connections.

1. **Test Frontend Connection** (from WSL terminal):
   ```bash
   nc -zv localhost 3000
   ```
   
   **Expected output:**
   ```
   Connection to localhost (127.0.0.1) 3000 port [tcp/*] succeeded!
   ```
   This means the Next.js frontend is accessible from WSL.

2. **Test Backend Connection** (from WSL terminal):
   ```bash
   nc -zv localhost 8000
   ```
   
   **Expected output:**
   ```
   Connection to localhost (127.0.0.1) 8000 port [tcp/*] succeeded!
   ```
   This means the Django backend is accessible from WSL.

   **If you see "Connection refused":**
   - Ensure Django is running with `python manage.py runserver 0.0.0.0:8000`
   - Check that the firewall rule was applied
   - Verify mirrored mode is active

### Understanding the nc command:
- `-z`: Zero I/O mode (just test connectivity, don't send data)
- `-v`: Verbose output (shows success/failure messages)
- `localhost`: The hostname to test
- `3000`/`8000`: The port numbers to test

### Additional Verification

1. From Windows browser:
   - Access frontend: `http://localhost:3000`
   - Access backend: `http://localhost:8000/admin`

2. From WSL-based tools (like Playwright MCP):
   - Can access `http://localhost:3000` directly
   - API calls from frontend to backend work seamlessly

## Troubleshooting

1. **If localhost doesn't work from WSL:**
   - Verify `.wslconfig` is saved in the correct location
   - Ensure you've run `wsl --shutdown` and restarted WSL
   - Check Windows version supports mirrored mode (Windows 11 22H2+)

2. **If backend isn't accessible:**
   - Ensure Django is running with `0.0.0.0:8000` not just `localhost:8000`
   - Check firewall rule was applied successfully
   - Verify ALLOWED_HOSTS includes necessary entries

3. **If API calls fail:**
   - Check browser console for CORS errors
   - Verify Django CORS_ALLOWED_ORIGINS includes all necessary URLs
   - Ensure Django server was restarted after settings changes

## Benefits of This Setup

- Single `localhost` URL works everywhere (Windows, WSL, development tools)
- No need to manage multiple IP addresses
- Seamless integration with WSL-based development tools
- Production-ready configuration with environment variables