# Contributing to Diabetes Risk Predictor

First off, thanks for considering contributing to our project! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem** in as many details as possible
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs** if possible
- **Include your environment** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior** and **explain the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the Python and JavaScript style guides
- End all files with a newline
- Avoid platform-dependent code
- Include appropriate test cases
- Document new code based on the [Documentation Styleguide](#documentation-styleguide)

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/diabetes-app.git
   cd diabetes_app
   ```

2. **Set up the backend**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   pip install pytest black flake8
   ```

3. **Set up the frontend**
   ```bash
   cd diabetes-predictor
   npm install
   cd ..
   ```

4. **Run the development servers**
   ```bash
   # Terminal 1: Backend
   python run.py
   
   # Terminal 2: Frontend
   cd diabetes-predictor
   npm start
   ```

### Using Docker for Development

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Styleguides

### Python Style Guide

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use `black` for code formatting
- Use `flake8` for linting
- Maximum line length: 100 characters

```bash
# Format code
black app/ run.py

# Check for issues
flake8 app/ run.py
```

### JavaScript/React Style Guide

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use `prettier` for formatting (installed with create-react-app)
- Maximum line length: 100 characters

```bash
# Format code
cd diabetes-predictor
npm run format
```

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎉 `:tada:` for initial commits
  - ✨ `:sparkles:` for new features
  - 🐛 `:bug:` for bug fixes
  - 📚 `:books:` for documentation
  - 🎨 `:art:` for style/formatting changes
  - ♻️ `:recycle:` for refactoring
  - ✅ `:white_check_mark:` for tests

Example:
```
✨ Add health check endpoint for container orchestration

- Adds GET /health endpoint that returns model status
- Used for Kubernetes liveness/readiness probes
- Returns JSON with status, model_loaded, and scaler_loaded fields

Closes #42
```

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown/) for all documentation
- Reference method and class names in backticks: `` `RandomForestModel` ``
- Include code blocks with language specification:
  ````markdown
  ```python
  def predict(data):
      pass
  ```
  ````
- Keep line length to 100 characters in documentation files

## Testing

### Backend Tests

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_routes.py::test_predict
```

### Frontend Tests

```bash
cd diabetes-predictor
npm test -- --coverage
```

### Test Requirements

- All new code should have tests
- Maintain or improve code coverage (target: 80%+)
- Tests should pass locally before submitting PR

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration. All PRs must pass:

- ✅ Linting (flake8 for Python, eslint for JavaScript)
- ✅ Type checking
- ✅ Unit tests
- ✅ Build tests (Docker build verification)

Check `.github/workflows/` for CI configuration.

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "✨ Add amazing feature"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

4. **Open a Pull Request** with:
   - Clear title describing the change
   - Reference to related issues
   - Description of changes made
   - Testing instructions
   - Screenshots (if UI changes)

5. **Respond to review feedback**
   - Address comments
   - Re-request review when ready
   - Don't force-push unless requested

6. **Merge after approval**
   - Ensure all checks pass
   - Ensure branch is up-to-date with main
   - Squash commits if requested

## Additional Notes

### Project Organization

- `app/` - Flask backend
- `diabetes-predictor/` - React frontend
- `diabetes_dataset/` - Training data
- `tests/` - Test files

### Important Files

- `README.md` - Start here for project overview
- `HOW_IT_WORKS.md` - Architecture and technical details
- `DEPLOYMENT.md` - Deployment instructions
- `requirements.txt` - Python dependencies
- `diabetes-predictor/package.json` - Frontend dependencies

### Review Criteria

When submitting a PR, ensure:

1. **Code Quality**
   - Follows style guidelines
   - No linting errors
   - Properly formatted
   - Meaningful variable names

2. **Functionality**
   - Solves the stated problem
   - Doesn't break existing features
   - Handles edge cases
   - Properly tested

3. **Documentation**
   - Code is commented where necessary
   - README updated if needed
   - Documentation files updated
   - Commit messages are clear

4. **Security**
   - No credentials in code
   - Input validation present
   - No security vulnerabilities
   - Follows OWASP principles

### Release Process

Maintainers will:
1. Update version numbers
2. Update CHANGELOG.md
3. Create GitHub release
4. Tag version in git

---

## Recognition

Contributors will be recognized in:
- CHANGELOG.md (for features)
- GitHub Contributors page
- Project README (significant contributions)

## Questions?

Feel free to open an issue with the `question` label, or contact the maintainers directly.

Thank you for contributing! 🎉
