# MERI PARO — Production-Grade Codebase Audit Report

> **Auditor Role:** Principal DevSecOps Engineer & AI/ML Architect
> **Date:** 2026-04-12
> **Objective:** Determine if the codebase meets an **8.5/10 market-readiness** threshold.

---

## PHASE 1: ARCHITECTURAL MAP

### Component Inventory

| Component | Tech Stack | Port | Dir |
|---|---|---|---|
| **Frontend** | React 19 + Vite 8 + Zustand + TailwindCSS 4 + Recharts | 3000 | `frontend/` |
| **Backend (API Gateway)** | Node.js + Express 4 + MySQL2 + Winston + Helmet | 5000 | `backend/` |
| **AI Service** | Python + FastAPI + Scikit-learn + PyTorch + Sentence-Transformers | 8000 | `ai-service/` |
| **Database** | MySQL 8 (via XAMPP/MariaDB) | 3306 | — |
| **Cache** | Redis 7 (optional, graceful fallback) | 6379 | — |
| **Orchestration** | Docker Compose v3.8 | — | root |

### File Completeness Checklist

| File | Backend | Frontend | AI Service | Root |
|---|---|---|---|---|
| `package.json` / `requirements.txt` | ✅ | ✅ | ✅ | — |
| `Dockerfile` | ✅ | ✅ | ✅ | — |
| `.env` | ✅ | ✅ | ✅ | — |
| `.env.example` | ❌ MISSING | ❌ MISSING | ❌ MISSING | — |
| `.gitignore` | ❌ MISSING | ✅ | ❌ MISSING | ❌ MISSING |
| `.dockerignore` | ❌ MISSING | ❌ MISSING | ❌ MISSING | — |
| `README.md` | ❌ MISSING | ❌ MISSING | ❌ MISSING | ✅ |
| `docker-compose.yml` | — | — | — | ✅ |
| `SETUP_GUIDE.md` | — | — | — | ✅ |
| Test files (`*.test.js`/`*.test.py`) | ❌ ZERO | ❌ ZERO | ❌ ZERO | — |
| `nginx.conf` | — | ✅ | — | — |
| CI/CD config (`.github/workflows`) | — | — | — | ❌ MISSING |

> [!WARNING]
> **Critical gap:** There are **zero automated tests** across the entire stack. The `package.json` references `jest --coverage` but no test files exist. This is a hard blocker for any production CI/CD pipeline.

---

## PHASE 2: DEEP DIVE AUDIT

---

### 🔒 SECURITY AUDIT

#### 1. SQL Injection — **PASS ✅**
All database queries use **parameterized statements** via `mysql2/promise`'s `db.execute(sql, params)`. No string concatenation in queries observed. Example from [database.js](file:///c:/Users/anmol/Downloads/meri%20paro/backend/src/config/database.js#L63-L71):
```javascript
const [rows] = await db.execute(sql, params); // Always parameterized
```

#### 2. JWT Implementation — **PASS ✅ (with caveat)**
- Token verification in [auth.js](file:///c:/Users/anmol/Downloads/meri%20paro/backend/src/middleware/auth.js) correctly handles `JsonWebTokenError` and `TokenExpiredError` separately.
- User is re-fetched from DB on every authenticated request (not relying solely on token payload). This is good for deactivation checks.
- ⚠️ **Caveat:** No JWT blacklist/revocation mechanism exists. If a token is compromised, it remains valid until expiry (7 days). Acceptable for MVP but needs a Redis-backed blacklist for production.

#### 3. Hardcoded Secrets — **FAIL ❌ (Showstopper)**
- [backend/.env](file:///c:/Users/anmol/Downloads/meri%20paro/backend/.env#L13): `JWT_SECRET=meri_paro_jwt_secret_key_2024_production_very_secure` is **committed to the repository** in plain text.
- [env.js](file:///c:/Users/anmol/Downloads/meri%20paro/backend/src/config/env.js#L35-L36) silently falls back to a hardcoded dev secret instead of failing loudly:
  ```javascript
  env[varName] = 'dev_fallback_secret_key_change_in_production';
  ```
- The `docker-compose.yml` also has `MYSQL_ROOT_PASSWORD: meriparo_secret` and `JWT_SECRET` hardcoded.
- **No `.env.example` files exist**, so developers will copy the real `.env` around, leaking secrets.

#### 4. CORS Configuration — **PASS ✅**
- [app.js](file:///c:/Users/anmol/Downloads/meri%20paro/backend/src/app.js#L25-L47) uses a whitelist-based CORS origin check with proper logging for rejected origins.
- Credentials enabled, specific methods and headers listed, `maxAge` set.
- The AI service uses `allow_methods=["*"]` and `allow_headers=["*"]` which is slightly loose but acceptable since it's an internal service.

#### 5. Security Headers — **PASS ✅**
- Helmet.js enabled (`app.use(helmet())`).
- Rate limiting applied globally and with stricter limits for auth (`20/15min`) and AI endpoints (`10/min`).

#### 6. File Upload Security — **PASS ✅**
- MIME-type whitelist (PDF, DOC, DOCX only).
- UUID-based filenames prevent path traversal.
- File size limit enforced (10MB).

#### 7. Password Hashing — **PASS ✅**
- bcrypt with cost factor 12 for registration. Correct `bcrypt.compare()` for login.

---

### 🧠 AI/ML INTEGRITY AUDIT

#### 1. Model Loading Pattern — **PASS ✅ (Singleton/Startup)**
This is one of the strongest aspects of the codebase. Models are loaded **once at startup** via FastAPI's `lifespan` context manager, stored in `app.state`, and accessed by reference:

```python
# main.py — Models loaded ONCE
@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_service_instance = MLService()
    ml_service_instance.initialize()
    app.state.ml_service = ml_service_instance
    # ...
```

Model persistence is handled via `joblib.dump` / `np.savez` — models are trained on first run and loaded from disk on subsequent starts. **No per-request model reloading.**

#### 2. ML Pipeline (TF-IDF + LR + RF Ensemble) — **ACCEPTABLE ⚠️**

**Architecture:**
- TF-IDF vectorizer (max 1000 features, bigrams, sublinear TF) → Logistic Regression + Random Forest → Weighted ensemble (40% LR / 60% RF).
- This is a sound, classical approach for text classification.

**Concerns:**
- **Training data is hardcoded** (~96 samples across 12 classes, ~8 per class). This is extremely small for production ML. The model will overfit to the exact phrasing in the training set.
- The same training data is **duplicated** across `ml_service.py` and `deep_learning_model.py` (DRY violation).
- No train/validation split, no cross-validation, no metrics logging. There's no way to know the model's accuracy.

> [!IMPORTANT]
> The ~96-sample training set means the ML layer is effectively a **sophisticated lookup table**. It works for demo purposes but would not generalize to diverse real-world resumes.

#### 3. Deep Learning Model — **IMPRESSIVE FOR A CUSTOM BUILD ✅**

A fully custom 4-layer feedforward neural network (Input → 256 → 128 → 64 → Output) implemented from scratch with NumPy:
- Correct He weight initialization
- Mini-batch gradient descent with shuffling
- Numerically stable softmax (`x - max(x)`)
- Proper backpropagation with ReLU derivative
- Model serialization via `.npz` files

This demonstrates genuine understanding of neural network fundamentals. However, the same small training data limitation applies.

#### 4. Embedding Model (Sentence-Transformers) — **PASS ✅**

- Uses `all-MiniLM-L6-v2` (lightweight, fast, high-quality embeddings).
- Graceful degradation — if the model fails to load (low-memory systems), the system falls back to NN-only predictions.
- The hybrid scoring (`0.6 * NN + 0.4 * semantic`) is a well-reasoned fusion strategy.

#### 5. NLP Resume Parsing — **ACCEPTABLE ⚠️**

- Skill extraction uses regex-based matching against a 150+ skill taxonomy with proper normalization (`Node.js`, `Vue.js`, etc.).
- PDF parsing has dual-fallback: `pdfplumber` → `PyPDF2`.
- ATS scoring formula is reasonable (skill density + text length + sections + contact + action verbs + quantifiables).
- **Weakness:** Education and experience extraction relies on fragile regex patterns that will fail on non-standard resume formats.

#### 6. Three-Tier Prediction Fallback — **EXCELLENT ✅**
```
Request → ML Ensemble → DL Hybrid → Baseline (keyword matching)
                ↓ (fail)       ↓ (fail)          ↓ (always works)
```
If the AI service is entirely down, the Node.js backend has its own `fallbackPrediction()` method. This means the app **never breaks** for the user. This is production-grade resilience.

---

### 🏗️ CODE CLEANLINESS AUDIT

#### 1. Separation of Concerns — **PASS ✅**
The Node.js backend follows a clean layered architecture:
```
Routes → Controllers → Services → Database
  │          │             │
  │     (thin handlers)   (business logic)
  │
  └── Validators + Middleware (auth, rate limit, upload)
```
Controllers are truly thin (< 30 lines each). All business logic lives in services. This is textbook proper.

#### 2. API Gateway Pattern — **PASS ✅**
The backend correctly acts as a gateway:
- Receives frontend requests
- Proxies to AI service via HTTP
- Falls back to internal logic if AI is unavailable
- Stores results in MySQL
- Returns unified response format

#### 3. Error Handling — **PASS ✅**
- Custom `ApiError` class with static factory methods (`badRequest`, `unauthorized`, etc.)
- Global error handler that distinguishes 4xx (warn) vs 5xx (error with full stack trace)
- Stack traces only exposed in development mode
- Process-level `unhandledRejection` and `uncaughtException` handlers

#### 4. Logging — **PASS ✅**
- Winston with structured JSON logging
- Console (colorized) in dev, file-based rotation in production (5MB, 5 files)
- Morgan HTTP request logging integrated via Winston
- Python side uses standard `logging` module consistently

#### 5. State Management (Frontend) — **PASS ✅**
- Zustand stores are lean and focused (auth, dashboard, resume)
- JWT token stored in `localStorage` with auto-redirect on 401
- Proper loading/error states in stores

---

### ⚡ SCALABILITY AUDIT

#### 1. Database Connection Pool — **PASS ✅**
MySQL connection pool with 20 connections, keep-alive enabled, proper timezone handling. Singleton pattern prevents pool re-creation.

#### 2. Redis Caching — **EXCELLENT ✅**
Graceful degradation is beautifully handled. Redis is optional — every cache call is wrapped in try/catch that returns `null`/`false` on failure. The app works identically with or without Redis.

#### 3. Async Communication Bottleneck — **MEDIUM RISK ⚠️**
- Node.js → Python communication is **synchronous HTTP** (axios with 30s timeout).
- Resume parsing is correctly fire-and-forget (`parseResumeAsync` runs in background), but prediction and recommendation calls are **blocking** — the user waits for the Python service response.
- For 10-100 concurrent users this is fine. For scale, you'd need a message queue (RabbitMQ/Redis Streams).

#### 4. Frontend Build — **PASS ✅**
- Multi-stage Docker build (Node builder → Nginx) is correct.
- Vite dev proxy configured to avoid CORS issues in development.

---

## PHASE 3: MARKET-READY EVALUATION

### Scoring Matrix

| Category | Score | Weight | Weighted |
|---|---|---|---|
| **Security** | 7.0/10 | 25% | 1.75 |
| **AI/ML Quality** | 7.5/10 | 20% | 1.50 |
| **Code Architecture** | 9.0/10 | 20% | 1.80 |
| **Error Handling / Resilience** | 9.0/10 | 15% | 1.35 |
| **Deployability** | 7.0/10 | 10% | 0.70 |
| **UX Logic / Dashboard** | 8.0/10 | 10% | 0.80 |

### **FINAL SCORE: 7.9 / 10**

---

## 🚨 CRITICAL FIXES (Showstoppers for 1.0 Release)

### 1. Remove Hardcoded Secrets — **SEVERITY: CRITICAL**
**Files:** `backend/.env`, `docker-compose.yml`

The `.env` file with real secrets must **never** be committed. Create `.env.example` files with placeholder values and add `.env` to `.gitignore` in every service directory.

```diff
- JWT_SECRET=meri_paro_jwt_secret_key_2024_production_very_secure
+ JWT_SECRET=<generate-with-openssl-rand-base64-64>
```

### 2. Add `.gitignore` to Backend and AI Service — **SEVERITY: CRITICAL**
Currently, `node_modules`, `__pycache__`, `.env`, `trained_models/*.pkl`, `uploads/`, and `logs/` would all be committed to version control. This leaks secrets, bloats the repo, and breaks cross-platform builds.

### 3. Fix Seed Password Hashes — **SEVERITY: HIGH**
The bcrypt hashes in `seed.sql` are invalid/mismatched. This was already patched at runtime via `verify_db.js`, but the `seed.sql` file itself should contain correct hashes so fresh installs work out of the box.

### 4. Pin `requirements.txt` Versions — **SEVERITY: HIGH**
We removed all version pins to fix the Python 3.14 install, but for production deployability, dependencies must be pinned to exact versions (`pip freeze > requirements.txt`) to guarantee reproducible builds.

---

## 🔧 ENHANCEMENTS (Path from 7.9 → 9.0+)

### Security (7.0 → 9.0)
1. **Add CSRF protection** for state-changing requests.
2. **JWT refresh token flow** — short-lived access tokens (15min) + long-lived refresh tokens.
3. **Password reset flow** — currently no way to recover a forgotten password.
4. **Input sanitization** on the AI service side (Pydantic models should have `max_length` constraints).

### AI/ML (7.5 → 9.0)
1. **Expand training data** to 500+ samples per class from real job posting datasets (e.g., Kaggle).
2. **Add model evaluation metrics** — log accuracy, F1-score, confusion matrix during training.
3. **DRY the training data** — extract the duplicated role→skills mapping into a shared JSON file.
4. **Add A/B model comparison** endpoint to compare baseline vs ML vs DL predictions side-by-side.

### Testing (0/10 → 8/10)
1. **Backend:** Add Jest unit tests for services and integration tests for API routes.
2. **AI Service:** Add pytest tests for NLP parsing, skill extraction, and model prediction endpoints.
3. **Frontend:** Add React Testing Library tests for critical flows (login, upload, prediction).
4. **Target:** 70%+ code coverage before any production launch.

### Deployability (7.0 → 9.0)
1. **Add `.dockerignore`** files to shrink image sizes (exclude `node_modules`, `__pycache__`, `.git`).
2. **Add GitHub Actions CI/CD** — lint, test, build Docker images, push to registry.
3. **Add health check endpoints** that verify downstream dependencies (DB alive? AI alive?).
4. **Environment parity** — the backend health check at `/api/health` exists; add the same for db connectivity status.

### UX Logic (8.0 → 9.0)
1. **WebSocket/SSE for resume parsing** — currently the user uploads and must manually refresh to see parsed results. Add real-time status updates.
2. **Loading skeletons** — replace generic spinners with content-aware skeleton screens.
3. **Optimistic updates** — mark recommendations as complete instantly, revert on failure.

---

## 📋 THE VERDICT

| Metric | Value |
|---|---|
| **Final Score** | **7.9 / 10** |
| **Threshold Met (8.5)?** | **NO** |
| **Recommendation** | **NO-GO for market rollout as-is** |

### Rationale
The codebase demonstrates genuinely strong engineering fundamentals — the layered architecture, three-tier ML fallback, graceful Redis degradation, and custom neural network implementation are all well above average. The security posture is solid at the application layer (parameterized queries, Helmet, rate limiting, bcrypt).

However, three factors prevent a "Go" recommendation:
1. **Hardcoded secrets** in committed files are a disqualifying security vulnerability.
2. **Zero automated tests** means any change could silently break core functionality.
3. **The ML training data** (~8 samples per class) is too thin to claim "AI-powered" with integrity.

### Path to GO (8.5+)
Fix the 4 critical items above, add 50+ basic tests across the stack, and expand the ML training data. These changes would conservatively bring the score to **8.7/10** — a confident Go.
