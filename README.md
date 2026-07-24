# 🚀 MERI-PARO - AI-Based Resume and Profile Analyzer

An intelligent system that analyzes resumes, profiles, and career progression using advanced AI and machine learning algorithms.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Resume Analysis**: Comprehensive resume parsing and evaluation
- **AI-Powered Insights**: Machine learning-based career recommendations
- **Profile Evaluation**: Skill and experience assessment
- **Career Progression**: Track and predict career growth
- **Skill Matching**: Match candidate skills to job requirements
- **Real-time Processing**: Fast analysis and results
- **Detailed Reports**: Comprehensive analysis reports
- **Multi-Format Support**: PDF, DOCX, TXT resume parsing

## 🛠️ Tech Stack

### Backend
- Python 3.8+
- Flask/FastAPI - Web framework
- TensorFlow/PyTorch - Deep learning
- NLP - Natural Language Processing
- SQLAlchemy - ORM

### Frontend
- React/Vue.js - UI framework
- HTML5/CSS3 - Markup and styling
- JavaScript - Interactivity

### AI/ML
- Scikit-learn - Machine learning
- NLTK/spaCy - NLP libraries
- TensorFlow/PyTorch - Neural networks
- BERT - Language model

### Infrastructure
- Docker - Containerization
- Docker Compose - Orchestration
- PostgreSQL - Database
- Redis - Caching

## 📁 Project Structure

```
MERI-PARO/
├── backend/                 # Backend service
│   ├── app.py              # Main application
│   ├── requirements.txt     # Python dependencies
│   ├── models/             # ML models
│   ├── routes/             # API routes
│   └── utils/              # Helper functions
├── frontend/               # Frontend application
│   ├── src/                # Source code
│   ├── public/             # Static files
│   └── package.json        # Dependencies
├── ai-service/             # AI processing service
│   ├── analyzer.py         # Analysis logic
│   └── models/             # Trained models
├── docker-compose.yml      # Docker configuration
├── README.md               # Documentation
├── SETUP.md                # Setup guide
└── LICENSE                 # MIT License
```

## 🚀 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Docker & Docker Compose (optional)
- Git

### Local Setup

```bash
# Clone repository
git clone https://github.com/Anmol2046S/MERI-PARO.git
cd MERI-PARO

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Start backend
cd ../backend
python app.py

# Start frontend (in new terminal)
cd frontend
npm start
```

### Docker Setup

```bash
# Build and run
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API: http://localhost:5000/api
```

## 💻 Usage

### Upload Resume

1. Navigate to the application
2. Click "Upload Resume"
3. Select PDF, DOCX, or TXT file
4. Click "Analyze"
5. View detailed analysis

### View Analysis

- Resume summary
- Skill extraction
- Experience assessment
- Career recommendations
- Improvement suggestions

## 🔌 API Endpoints

### Analyze Resume

**POST** `/api/analyze`

```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "skills": [...],
    "experience": [...],
    "score": 8.5,
    "recommendations": [...]
  }
}
```

### Get Analysis

**GET** `/api/analysis/{id}`

```bash
curl http://localhost:5000/api/analysis/123
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
FLASK_ENV=development
DATABASE_URL=postgresql://user:pass@localhost/meri_paro
REDIS_URL=redis://localhost:6379
AI_MODEL_PATH=./models/
API_KEY=your_api_key
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Coverage report
pytest --cov=.
```

## 📊 Performance

- Resume parsing: < 2 seconds
- Analysis generation: < 5 seconds
- API response time: < 1 second
- Database queries: Optimized

## 🔐 Security

- Input validation
- SQL injection prevention
- XSS protection
- CORS security
- Rate limiting
- Authentication (planned)
- Encryption

## 📚 Documentation

- [SETUP.md](SETUP.md) - Installation guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Developer guidelines
- [API.md](API.md) - API documentation
- [meri paro setup.md](meri%20paro%20setup.md) - Original setup guide

## 🐛 Troubleshooting

### Docker Issues
```bash
# Clear Docker cache
docker system prune

# Rebuild images
docker-compose up --build
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Review docker-compose.yml

### Model Loading Error
- Check AI_MODEL_PATH
- Verify model files exist
- Review logs for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 🔗 Links

- **Repository**: https://github.com/Anmol2046S/MERI-PARO
- **Issues**: https://github.com/Anmol2046S/MERI-PARO/issues
- **Discussions**: https://github.com/Anmol2046S/MERI-PARO/discussions

## 📞 Support

For support:
- 📖 Read [README.md](README.md)
- 🚀 Check [SETUP.md](SETUP.md)
- 🐛 Open [GitHub Issues](https://github.com/Anmol2046S/MERI-PARO/issues)
- 💬 Start a [Discussion](https://github.com/Anmol2046S/MERI-PARO/discussions)

## 🎯 Roadmap

### v1.1.0
- [ ] Multi-language support
- [ ] Advanced skill matching
- [ ] Job recommendation engine
- [ ] Portfolio analysis

### v1.2.0
- [ ] LinkedIn integration
- [ ] Career path suggestions
- [ ] Industry benchmarking
- [ ] Salary estimation

---

**Made with ❤️ for career advancement**