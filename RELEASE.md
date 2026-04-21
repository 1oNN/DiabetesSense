# Release Guidelines

## Pre-Release Checklist

- [ ] All tests passing (`pytest` and `npm test`)
- [ ] No outstanding issues blocking release
- [ ] Documentation updated (README, HOW_IT_WORKS, API docs)
- [ ] CHANGELOG updated with all changes
- [ ] No security vulnerabilities (run `npm audit` and `pip-audit`)
- [ ] Code review completed
- [ ] Performance tested
- [ ] Docker build successful

## Release Process

### 1. Prepare Release Branch
```bash
git checkout -b release/v1.1.0
```

### 2. Update Version Numbers

**In `diabetes-predictor/package.json`:**
```json
{
  "version": "1.1.0"
}
```

**In Python files (if using versioning):**
```python
__version__ = "1.1.0"
```

### 3. Update CHANGELOG
- Move content from `[Unreleased]` to new version section
- Add release date
- Ensure all changes are documented

### 4. Commit Release Changes
```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v1.1.0"
```

### 5. Create Git Tag
```bash
git tag -a v1.1.0 -m "Release version 1.1.0

Major changes:
- Feature 1
- Feature 2
- Bug fix 3"
```

### 6. Push Release
```bash
git push origin release/v1.1.0
git push origin v1.1.0
```

### 7. Create Pull Request
- Title: "Release: v1.1.0"
- Description: Include changelog excerpt
- Require approvals before merge

### 8. Merge to Main
After approval:
```bash
git checkout main
git pull origin main
git merge --no-ff release/v1.1.0
git push origin main
```

### 9. Build & Push Docker Image
```bash
# Build with version tag
docker build -t diabetes-predictor:1.1.0 .
docker tag diabetes-predictor:1.1.0 diabetes-predictor:latest

# Push to registry
docker push diabetes-predictor:1.1.0
docker push diabetes-predictor:latest
```

### 10. Create GitHub Release
```bash
gh release create v1.1.0 \
  --title "v1.1.0 - Release Title" \
  --notes "Release notes from CHANGELOG" \
  --draft  # Remove --draft when ready
```

### 11. Deploy to Production
```bash
# Update production deployment
docker pull diabetes-predictor:1.1.0
docker-compose -f docker-compose.prod.yml up -d
```

### 12. Announce Release
- Post on GitHub Discussions
- Update website/docs
- Send release email to subscribers
- Update demo site (if applicable)

## Version Numbering

Use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
  - Example: Removing endpoint, changing response format
  - Update: X.0.0

- **MINOR**: Backward-compatible new features
  - Example: New endpoint, new feature
  - Update: 1.X.0

- **PATCH**: Backward-compatible bug fixes
  - Example: Bug fix, security patch
  - Update: 1.0.X

## Hotfix Release

For urgent production fixes:

```bash
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/v1.1.1

# Make fix and commit
git commit -m "fix: critical bug"

# Follow release process with minor version bump
```

## Post-Release

- [ ] Close related issues
- [ ] Monitor for issues
- [ ] Archive release branch: `git branch -d release/v1.1.0`
- [ ] Document release notes in GitHub
- [ ] Update live deployment

## Rollback Procedure

If critical issues found after release:

```bash
# Revert to previous version
docker pull diabetes-predictor:1.0.0
docker-compose down
docker-compose up -d

# Create hotfix branch from stable tag
git checkout -b hotfix/critical-bug v1.0.0
```

## Long-term Support (LTS) Releases

For LTS releases (major versions):
- Extended bug fix support: 18+ months
- Security updates: 24+ months
- Tag with: `v1.0.0-lts`

## Beta Releases

For pre-release testing:

```bash
git tag v1.1.0-beta.1
git tag v1.1.0-rc.1  # Release candidate
```

Pre-release versions are published but not marked as latest.

## Communication

### Release Notes Template

```markdown
# v1.1.0 - Feature Release

**Released**: 2026-05-15

## What's New

### Features
- New prediction features (#456)
- Improved UI/UX

### Improvements
- Better error messages
- Performance optimizations

### Fixes
- Fixed bug with #789
- Fixed security issue #101

### Breaking Changes
None in this release

### Upgrade Guide
1. Pull latest
2. Run `docker pull diabetes-predictor:1.1.0`
3. Update deployment
4. Run migrations (if applicable)

## Download
- [Docker Image](ghcr.io/username/diabetes-predictor:1.1.0)
- [Source Code](https://github.com/username/diabetes-app/releases/tag/v1.1.0)
```

## Release Cadence

- **Major releases**: 6-12 months
- **Minor releases**: 4-8 weeks
- **Patch releases**: As needed (1-2 weeks)
- **Security patches**: Immediate if critical

## Questions?

See CONTRIBUTING.md or open a GitHub issue.
