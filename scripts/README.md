# 🚀 Places Ingestor - Scripts Usage Guide

สคริปต์ PowerShell สำหรับการรันโปรแกรม Places Ingestor บน Windows

## 📋 Prerequisites

ต้องติดตั้งก่อนใช้งาน:

- **Python 3.8+** - [ดาวน์โหลด](https://www.python.org/downloads/)
- **Node.js 18+** - [ดาวน์โหลด](https://nodejs.org/)
- **PowerShell 5.1+** (มากับ Windows แล้ว)

## 🔧 Initial Setup

### 1. ตั้งค่า Execution Policy (ครั้งแรกเท่านั้น)

เปิด PowerShell เป็น Administrator และรันคำสั่ง:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. เซ็ตอัพ Environment

```powershell
.\scripts\setup-env.ps1
```

สคริปต์นี้จะ:
- ตรวจสอบ Python และ Node.js
- ติดตั้ง dependencies ทั้งหมด
- สร้างไฟล์ .env สำหรับ backend และ frontend
- ตรวจสอบไฟล์ข้อมูลที่จำเป็น

### 3. เพิ่ม API Keys

แก้ไขไฟล์ต่อไปนี้และใส่ API keys ของคุณ:

**webui/backend/.env:**
```env
GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key_here
```

**webui/frontend/.env.local:**
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

## 🏃‍♂️ Running the Application

### Quick Start (แนะนำ)

เปิด 2 Terminal/PowerShell windows:

**Terminal 1 - Backend:**
```powershell
.\scripts\run-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\scripts\run-frontend.ps1
```

จากนั้นเปิดเบราว์เซอร์ไปที่: http://localhost:5173

## 📁 Scripts Overview

### 🔧 `setup-env.ps1`
Automated environment setup script that:
- Checks system requirements (Python, Node.js, npm)
- Installs Python and Node.js dependencies
- Creates `.env` and `.env.local` files
- Verifies admin areas data and terms configuration

**Usage:**
```powershell
# Basic setup with prompts for API keys
.\scripts\setup-env.ps1

# Setup with API keys as parameters
.\scripts\setup-env.ps1 -GooglePlacesKey "YOUR_PLACES_KEY" -GoogleMapsKey "YOUR_MAPS_KEY"
```

### 🖥️ `run-backend.ps1`
Backend server management script that:
- Checks environment setup and dependencies
- Manages port conflicts
- Starts FastAPI server with Uvicorn
- Provides detailed status information

**Usage:**
```powershell
# Start backend server
.\scripts\run-backend.ps1

# Start with custom port
.\scripts\run-backend.ps1 -Port 8080

# Stop existing processes and start
.\scripts\run-backend.ps1 -StopExisting

# Enable verbose logging
.\scripts\run-backend.ps1 -Verbose
```

### 🎨 `run-frontend.ps1`
Frontend development server script that:
- Checks environment setup and dependencies
- Manages port conflicts
- Starts Vite development server
- Supports build and preview modes

**Usage:**
```powershell
# Start development server
.\scripts\run-frontend.ps1

# Start with custom port
.\scripts\run-frontend.ps1 -Port 3000

# Start with network access (accessible from other devices)
.\scripts\run-frontend.ps1 -NetworkHost

# Build for production
.\scripts\run-frontend.ps1 -Build

# Preview production build
.\scripts\run-frontend.ps1 -Preview

# Stop existing processes and start
.\scripts\run-frontend.ps1 -StopExisting
```

## 🚀 Quick Start Workflow

### First Time Setup:
```powershell
# 1. Clone repository and navigate to root directory
cd places_ingestor_starter

# 2. Run setup script
.\scripts\setup-env.ps1

# 3. Start backend (Terminal 1)
.\scripts\run-backend.ps1

# 4. Start frontend (Terminal 2)
.\scripts\run-frontend.ps1

# 5. Open http://localhost:5173
```

### Daily Development:
```powershell
# Start both services quickly
.\scripts\run-backend.ps1 -StopExisting
.\scripts\run-frontend.ps1 -StopExisting
```

## 🔧 Advanced Options

### Environment Variables Setup:
```powershell
# Setup with custom API keys
.\scripts\setup-env.ps1 `
  -GooglePlacesKey "AIzaSyC..." `
  -GoogleMapsKey "AIzaSyD..."
```

### Custom Configuration:
```powershell
# Backend on different port
.\scripts\run-backend.ps1 -Port 8080

# Frontend accessible from network
.\scripts\run-frontend.ps1 -NetworkHost -Port 3000
```

### Production Build:
```powershell
# Build frontend for production
.\scripts\run-frontend.ps1 -Build

# Preview production build
.\scripts\run-frontend.ps1 -Preview
```

## 🐛 Troubleshooting

### PowerShell Execution Policy:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Check Script Status:
```powershell
# Check if processes are running
Get-Process | Where-Object {$_.Name -like "*python*" -or $_.Name -like "*node*"}

# Check port usage
Get-NetTCPConnection -LocalPort 8000
Get-NetTCPConnection -LocalPort 5173
```

### Force Stop Processes:
```powershell
# Stop all Python processes
Get-Process -Name "python*" | Stop-Process -Force

# Stop all Node processes
Get-Process -Name "node*" | Stop-Process -Force
```

## 📋 System Requirements

### Required Software:
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **PowerShell 5.1+** (Windows default)

### Optional:
- **Git** for repository management
- **VS Code** with PowerShell extension

### Network Ports:
- **8000**: Backend API server
- **5173**: Frontend development server
- **3000**: Alternative frontend port

## 🔒 Security Notes

- Scripts include basic execution policy handling
- Environment files (`.env`, `.env.local`) are gitignored
- API keys should never be committed to repository
- Demo keys are used by default for initial setup

## 💡 Tips

1. **Use Tab Completion**: PowerShell supports tab completion for script parameters
2. **Run as Administrator**: Some operations may require elevated privileges
3. **Check Logs**: Scripts provide detailed output for troubleshooting
4. **Restart Services**: Use `-StopExisting` flag to restart cleanly
5. **Network Access**: Use `-NetworkHost` flag for testing on mobile devices

## 🔄 Script Maintenance

These scripts are designed to be:
- **Self-documenting**: Verbose output explains each step
- **Error-resistant**: Comprehensive error checking and handling
- **User-friendly**: Interactive prompts for required information
- **Production-safe**: Only affect local development environment

For updates or issues with these scripts, check the main README.md or create an issue in the repository.