# MERI PARO — Complete Setup Guide

## 📋 Prerequisites (Install These First)

### 1. Node.js (v18 or v20 LTS)
- **Download**: https://nodejs.org/en/download
- **Verify**: `node --version` → should show `v18.x.x` or `v20.x.x`
- **Also gives you**: `npm` (Node Package Manager)

### 2. Python (v3.10 or v3.11)
- **Download**: https://www.python.org/downloads/
- ⚠️ **IMPORTANT**: Check "Add Python to PATH" during installation
- **Verify**: `python --version` → should show `Python 3.10.x` or `3.11.x`
- **Also gives you**: `pip` (Python Package Manager)

### 3. MySQL (v8.0+)
- **Download**: https://dev.mysql.com/downloads/installer/ (MySQL Community Server)
- During installation, set **root password** (remember it!)
- **Verify**: `mysql --version`
- **Alternative**: Use XAMPP (https://www.apachefriends.org/) which bundles MySQL + phpMyAdmin

### 4. Redis (Optional - for caching)
- **Windows**: Download from https://github.com/microsoftarchive/redis/releases
- **Or skip it** — the app works without Redis (graceful fallback built-in)

### 5. Git (Optional - for version control)
- **Download**: https://git-scm.com/downloads

---

## 🚀 Step-by-Step Setup

### Step 1: Set Up MySQL Database

Open MySQL command line or phpMyAdmin and run:

```sql
-- Create the database
CREATE DATABASE meriparo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (or use root)
CREATE USER 'meriparo_user'@'localhost' IDENTIFIED BY 'MeriParo@2024';
GRANT ALL PRIVILEGES ON meriparo_db.* TO 'meriparo_user'@'localhost';
FLUSH PRIVILEGES;
```

Then import the schema and seed data:

```bash
# From the project root directory:
mysql -u meriparo_user -p meriparo_db < backend/database/schema.sql
mysql -u meriparo_user -p meriparo_db < backend/database/seed.sql
```

Or via MySQL Workbench:
1. Open `backend/database/schema.sql` → Execute
2. Open `backend/database/seed.sql` → Execute

---

### Step 2: Configure Backend Environment

Edit `backend/.env` and update the database credentials:

```env
# Server
NODE_ENV=development
PORT=5000

# Database — UPDATE THESE to match your MySQL setup
DB_HOST=localhost
DB_PORT=3306
DB_USER=meriparo_user
DB_PASSWORD=MeriParo@2024
DB_NAME=meriparo_db

# Redis (optional - leave as-is, works without Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret — change this in production!
JWT_SECRET=meri-paro-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

### Step 3: Install & Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MySQL connected
⚠️ Redis connection failed (using fallback) — this is OK if Redis isn't installed
```

---

### Step 4: Install & Start AI Service (Python)

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
INFO: Loading ML models...
INFO: ML models trained: 96 samples, 12 classes
INFO: Uvicorn running on http://0.0.0.0:8000
```

> **Note**: First startup takes 30-60 seconds as ML/DL models are trained automatically.
> The AI service is OPTIONAL — the backend has built-in fallback logic.

---

### Step 5: Install & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v8.x.x ready in 200 ms
➜ Local: http://localhost:3000/
```

---

### Step 6: Open the App! 🎉

Open your browser and go to: **http://localhost:3000**

Login with demo credentials:
- **Admin**: `admin@meriparo.com` / `Admin@123456`
- **User**: `user@meriparo.com` / `User@123456`

---

## 🐳 Alternative: Docker Setup (All-in-One)

If you have Docker Desktop installed, you can start everything with ONE command:

```bash
# From the project root
docker-compose up --build
```

This automatically starts all 5 services (frontend, backend, AI, MySQL, Redis).

---

## 📁 Project Structure

```
meri paro/
├── frontend/          # React + Tailwind (port 3000)
│   ├── src/
│   │   ├── pages/     # 10 pages (Login, Dashboard, Resume, etc.)
│   │   ├── store/     # Zustand state management
│   │   ├── api/       # Axios HTTP client
│   │   └── components/# UI components
│   └── package.json
│
├── backend/           # Node.js + Express API (port 5000)
│   ├── database/      # SQL schema + seed data
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── controllers/
│   │   ├── middleware/ # Auth, validation, rate limiting
│   │   └── config/    # DB, Redis, env
│   └── package.json
│
├── ai-service/        # Python + FastAPI (port 8000)
│   ├── app/
│   │   ├── models/    # ML/DL models
│   │   ├── services/  # NLP, ML, DL pipelines
│   │   ├── routes/    # AI endpoints
│   │   └── utils/     # Text processing
│   └── requirements.txt
│
└── docker-compose.yml # Orchestration
```

---

## 🔧 Troubleshooting

### "Network Error" on login
→ Backend is not running. Start it: `cd backend && npm run dev`

### "MySQL connection refused"
→ MySQL is not running or credentials are wrong. Check `backend/.env`

### "Python not found"
→ Install Python and make sure "Add to PATH" is checked

### "npm not recognized"
→ Install Node.js from https://nodejs.org

### Backend starts but AI predictions return fallback
→ The AI service (Python) isn't running. Start it or it will use built-in fallback (still works!)

### PowerShell "scripts disabled" error
→ Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

---

## 🔑 Summary: Startup Order

```
1. Start MySQL           → must be running first
2. cd backend && npm run dev    → port 5000
3. cd ai-service && uvicorn ... → port 8000 (optional)
4. cd frontend && npm run dev   → port 3000
5. Open http://localhost:3000   → 🎉
```
