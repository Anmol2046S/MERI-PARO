# MERI PARO — AI Career Intelligence & Job Prediction Platform

## Overview
MERI PARO is a production-ready SaaS platform that analyzes resumes using NLP, predicts best-fit job roles using ML/DL, identifies skill gaps, and generates personalized career recommendations.

## Architecture
```
React Frontend (:3000) → Node.js API Gateway (:5000) → FastAPI AI Service (:8000)
                                    ↓                          ↓
                              MySQL (:3306)            Trained ML Models
                              Redis (:6379)
```

- **Frontend**: React 18 + Tailwind CSS + Recharts + Zustand (Port 3000)
- **Backend**: Node.js + Express.js API Gateway (Port 5000)
- **AI Service**: Python + FastAPI + Scikit-learn + Deep Learning (Port 8000)
- **Database**: MySQL 8.0 (Port 3306)
- **Cache**: Redis 7 (Port 6379)

## Quick Start

### Using Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup

#### 1. Database
```bash
# Start MySQL via XAMPP or Docker
# Run schema and seed files
mysql -u root -p < backend/database/schema.sql
mysql -u root -p meri_paro < backend/database/seed.sql
```

#### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

#### 3. AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

#### 4. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Default Credentials
- **Admin**: admin@meriparo.com / Admin@123456
- **User**: user@meriparo.com / User@123456

## API Documentation
- Backend: http://localhost:5000/api/health
- AI Service: http://localhost:8000/docs

## Core Features
- 📄 **Resume Analyzer** — NLP-powered resume parsing + ATS scoring
- 🎯 **Job Prediction** — 3-layer ML pipeline (Baseline → ML → Deep Learning)
- 📊 **Skill Gap Analysis** — Compare skills vs role requirements
- 🤖 **AI Recommendations** — Courses, certifications, career roadmap
- 📝 **Job Description Analyzer** — Match JD against your profile
- 📈 **Career Simulation** — "What if I learn X?" trajectory prediction
- 🛡️ **Admin Panel** — User management + system analytics

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS 3, Recharts, Zustand, Vite |
| Backend | Node.js 20, Express 4, JWT, Bcrypt, MySQL2 |
| AI/ML | FastAPI, Scikit-learn, NumPy, Sentence Transformers |
| Database | MySQL 8.0, Redis 7 |
| DevOps | Docker, Docker Compose |

## Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: AWS EC2 / Railway
- **AI Service**: Docker on EC2
- **Database**: AWS RDS / PlanetScale
