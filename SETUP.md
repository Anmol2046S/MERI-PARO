# MERI-PARO Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Anmol2046S/MERI-PARO.git
cd MERI-PARO

# Backend setup
cd backend
pip install -r requirements.txt
export FLASK_APP=app.py
flask run

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

## Detailed Setup

### Step 1: Install Python

#### Windows
1. Download from https://www.python.org/
2. Run installer
3. Check "Add Python to PATH"
4. Verify: `python --version`

#### Mac
```bash
brew install python3
python3 --version
```

#### Linux
```bash
sudo apt-get install python3 python3-pip
python3 --version
```

### Step 2: Clone Repository

```bash
git clone https://github.com/Anmol2046S/MERI-PARO.git
cd MERI-PARO
```

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your settings
```

### Step 4: Database Setup

```bash
# Install PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
sudo -u postgres createdb meri_paro

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost/meri_paro
```

### Step 5: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### Step 6: Start Application

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Backend running on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
# Frontend running on http://localhost:3000
```

### Step 7: Verify Installation

1. Open http://localhost:3000
2. Upload a resume
3. View analysis results
4. Check console for errors

## Docker Setup

### Prerequisites
- Docker installed
- Docker Compose

### Build and Run

```bash
# Build images
docker-compose build

# Start containers
docker-compose up

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# Stop containers
docker-compose down
```

## Configuration

### Backend Environment Variables

```env
FLASK_ENV=development          # Environment
DATABASE_URL=postgresql://...  # Database URL
REDIS_URL=redis://localhost    # Redis cache
AI_MODEL_PATH=./models/        # Model directory
API_KEY=your_api_key           # API key
JWT_SECRET=secret_key          # JWT secret
LOG_LEVEL=INFO                 # Logging level
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Troubleshooting

### Python Issues

**"python: command not found"**
```bash
# Install Python from https://www.python.org/
# Or: brew install python3 (Mac)
```

**"pip not found"**
```bash
# Python should include pip
python -m pip --version
python -m pip install package_name
```

### Virtual Environment Issues

**"Module not found"**
```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Issues

**"Connection refused"**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials
- Create database if missing

**"Database does not exist"**
```bash
sudo -u postgres createdb meri_paro
```

### Frontend Issues

**"Port 3000 already in use"**
```bash
PORT=3001 npm start
```

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**"Cannot connect to container"**
```bash
# Check container status
docker ps

# View logs
docker-compose logs

# Rebuild
docker-compose up --build
```

## Development

### Hot Reload

**Backend** - Flask automatically reloads on file changes

**Frontend** - React dev server has hot reload built-in

### Running Tests

```bash
# Backend tests
cd backend
pytest
pytest -v  # Verbose

# Frontend tests
cd frontend
npm test
npm test -- --coverage
```

## Project Structure

```
MERI-PARO/
├── backend/
│   ├── app.py              # Main Flask app
│   ├── requirements.txt     # Python packages
│   ├── .env.example        # Environment template
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   └── tests/              # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main component
│   ├── public/             # Static files
│   ├── package.json        # Dependencies
│   └── .env.example        # Environment template
├── ai-service/             # AI processing
├── docker-compose.yml      # Docker configuration
└── README.md               # Documentation
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure database
3. ✅ Start services
4. 📖 Read API documentation
5. 🧪 Run tests
6. 🚀 Deploy application

---

**Setup complete! Ready to analyze resumes! 🚀**