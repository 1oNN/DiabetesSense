# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Health check endpoint for container orchestration
- Comprehensive Docker configuration for production
- GitHub Actions CI/CD pipeline
- Security policy and guidelines
- Contributing guide and code of conduct

### Changed
- Updated documentation with deployment guides
- Improved error handling in API routes

### Fixed
- CORS configuration for production environments

## [1.0.0] - 2026-04-21

### Added
- Initial release of Diabetes Risk Predictor
- React frontend with multi-page interface
- Flask backend with ML model serving
- Random Forest classifier for diabetes risk prediction
- BMI calculator component
- Personalized health recommendations
- Docker containerization support
- Heroku deployment ready

### Features
- **Core Prediction**: Risk probability calculation based on 21 health indicators
- **Contributing Factors Analysis**: Identifies key risk factors
- **Personalized Recommendations**: Tailored health advice
- **Responsive UI**: Works on desktop and mobile
- **RESTful API**: POST /predict endpoint
- **CORS Enabled**: Frontend-backend communication
- **Production Ready**: Gunicorn server with multiple workers

### Technical Stack
- **Backend**: Flask, scikit-learn, joblib
- **Frontend**: React, React Router, Axios
- **ML Model**: Random Forest Classifier
- **Training Data**: BRFSS 2015 health indicators
- **Deployment**: Docker, Heroku compatible

### Documentation
- README with quick start guide
- Technical architecture documentation (HOW_IT_WORKS.md)
- Deployment guide (DEPLOYMENT.md)
- API endpoint documentation
- Model details and feature explanations

---

## Versioning

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes and minor improvements

## How to Update This Changelog

When making changes:

1. Add changes under `[Unreleased]` section
2. Use appropriate subsections: Added, Changed, Deprecated, Removed, Fixed, Security
3. Link issues: `(#123)` or direct links
4. When releasing, move to new version section with date

### Example Entry

```markdown
## [1.1.0] - 2026-05-15

### Added
- New feature description (#456)
- Another new feature

### Fixed
- Bug fix description (#789)

### Security
- Security update description (#101)
```

## Release Process

1. Update version in `package.json` and `setup.py` (if applicable)
2. Update CHANGELOG with version and date
3. Commit: `chore: release v1.1.0`
4. Tag: `git tag v1.1.0`
5. Push: `git push origin main --tags`
6. Create GitHub release with changelog excerpt
7. Build and push Docker image with version tag
8. Deploy to production

## Deprecation Policy

- Features deprecated in version X will be removed in version X+2
- Deprecation warnings will be provided with clear upgrade paths
- Migration guides will be documented

## Support

- Latest version: Fully supported
- Previous major version: Security updates only
- Older versions: No support

## Questions?

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidance on reporting issues and requesting features.
