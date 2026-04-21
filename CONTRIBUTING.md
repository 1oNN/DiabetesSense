# Contributing

Found a bug or want to add a feature? Great! Here's how to help.

## Setup

1. Fork and clone the repo
2. Set up the backend:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```bash
   cd diabetes-predictor
   npm install
   ```

## Running Locally

Backend:
```bash
python run.py
```

Frontend (in another terminal):
```bash
cd diabetes-predictor
npm start
```

Or use Docker:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Making Changes

- Keep commits focused and descriptive
- Follow PEP 8 for Python, Airbnb style for JavaScript
- Test your changes before submitting
- Update docs if needed

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Push to your fork
4. Open a pull request

Include:
- What you changed and why
- How to test it
- Screenshots if UI changes

## Code Quality

- Run tests: `pytest` (backend), `npm test` (frontend)
- Format: `black app/` (Python), `npm run format` (JavaScript)

## Questions?

Open an issue or ask in the PR.

Thanks for contributing!
