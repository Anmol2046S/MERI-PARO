# MERI PARO — Build Walkthrough

## What Was Built

A complete **AI Career Intelligence SaaS Platform** with **95+ production-grade files** across **3 independent microservices**:

```
meri paro/
├── docker-compose.yml          # Orchestration for all 5 services
├── README.md                   # Full project documentation
├── backend/                    # Node.js API Gateway (30 files)
├── ai-service/                 # Python FastAPI AI Service (25 files)
└── frontend/                   # React + Tailwind Dashboard (20+ files)
```

---

## Architecture

```
React Frontend (:3000) → Node.js API Gateway (:5000) → FastAPI AI Service (:8000)
                                    ↕                          ↕
                              MySQL (:3306)            Trained ML/DL Models
                              Redis (:6379)            Sentence Transformers
```

---

## Phase 1 & 2: Infrastructure
| File | Purpose |
|------|---------|
| `docker-compose.yml` | 5-service orchestration (frontend, backend, AI, MySQL, Redis) |
| `database/schema.sql` | 11 tables with indexes and foreign keys |
| `database/seed.sql` | 85 skills, 15 job roles, 2 user accounts |

## Phase 3: Node.js Backend (30 files)
- **Config**: Environment validation, MySQL pool, Redis with graceful fallback
- **Auth**: JWT + bcrypt, register/login/profile management
- **Resume**: Async PDF parsing via AI service, skill sync, ATS scoring
- **Predictions**: 3-layer model selection (baseline/ML/DL), skill gap analysis, JD matching, career simulation
- **AI**: Recommendation engine, dashboard aggregation with caching
- **Admin**: User management, system analytics with 6 parallel queries
- **Middleware**: Auth, validation, error handling, rate limiting, file upload

## Phase 4: Python AI Service (25 files)
- **NLP Pipeline**: Text cleaning → skill extraction → section parsing → ATS scoring
- **Baseline Model**: Keyword-to-role mapping with weighted scoring
- **ML Pipeline**: TF-IDF → Logistic Regression + Random Forest ensemble (40/60 weighted)
- **Deep Learning**: Custom 4-layer feedforward NN (input→256→128→64→output) with ReLU + softmax
- **Embeddings**: Sentence Transformer (all-MiniLM-L6-v2) for semantic matching
- **Hybrid Scoring**: 60% NN + 40% semantic similarity combined confidence
- **Training Data**: 96+ labeled samples across 12 job role categories

## Phase 5: React Frontend (20+ files)
- **Design System**: Dark glassmorphic theme, indigo/cyan gradients, micro-animations
- **State**: 3 Zustand stores (auth, resume, dashboard) with localStorage persistence
- **10 Pages**: Login, Register, Dashboard, Resume, Predictions, Skills, Job Match, Recommendations, History, Settings, Admin
- **Dashboard**: Career Score gauge, progress area chart, predicted roles, skill category bars, gap badges
- **Resume**: Drag-drop upload zone, ATS score display, skill tags
- **Predictions**: 3-model selector, bar chart + detailed list with confidence bars
- **Skills**: Pie chart, gap analysis with match percentage, learning path phases
- **Admin**: System analytics cards, top skills bar chart, daily activity line chart, user management table

---

## How to Run

### Step 1: Backend
```bash
cd backend
npm install
# Start MySQL and create the database with schema.sql + seed.sql
npm run dev
```

### Step 2: AI Service (needs Python 3.11+)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

### Step 3: Frontend
```bash
cd frontend
npm install
npm run dev
```

### Or Docker (all at once)
```bash
docker-compose up --build
```

---

## Credentials
- **Admin**: `admin@meriparo.com` / `Admin@123456`
- **User**: `user@meriparo.com` / `User@123456`

---

## Key Design Decisions
1. **Fallback-first AI**: Every AI endpoint has local rule-based fallbacks so the app works even without the Python service
2. **Redis is optional**: The backend gracefully degrades when Redis isn't running
3. **Auto-training**: ML/DL models train automatically on first startup if no saved models exist
4. **Async resume parsing**: File upload returns immediately; parsing happens in background
5. **Career Score**: Composite metric calculated from skills (30pts), demand (30pts), ATS (20pts), activity (10pts)
