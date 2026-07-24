# Contributing to MERI-PARO

Thank you for your interest in contributing to MERI-PARO!

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MERI-PARO.git
   cd MERI-PARO
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

## Code Style

### Python
- Follow PEP 8 standards
- Use 4 spaces for indentation
- Add type hints
- Document functions

### JavaScript/React
- Use 2 spaces for indentation
- Follow ES6+ standards
- Use functional components
- Add PropTypes

## Commit Guidelines

```
feat: Add resume parsing feature
fix: Fix analysis accuracy bug
docs: Update API documentation
style: Format code
refactor: Improve performance
test: Add unit tests
```

## Testing

```bash
# Backend tests
cd backend
pytest
pytest -v
pytest --cov=.

# Frontend tests
cd frontend
npm test
npm test -- --coverage
```

## Pull Request Process

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Clear title and description
   - Link related issues
   - Include testing details
   - Add screenshots if UI changes

## PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Changes tested thoroughly
- [ ] Performance optimized

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Python/Node version
- OS and browser
- Error logs
- Screenshots

## Feature Requests

Describe:
- Problem being solved
- Proposed solution
- Use cases and benefits
- Alternative approaches

## Documentation

- Update README for major changes
- Add inline code comments
- Document new functions/classes
- Update API documentation
- Update SETUP guide if needed

## Review Process

- Maintain respectful tone
- Provide constructive feedback
- Test changes locally
- Approve when satisfied

---

Thank you for contributing! 🙏