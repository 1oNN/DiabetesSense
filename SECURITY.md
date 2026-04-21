# Security Policy

## Supported Versions

| Version | Supported          | Notes                       |
| ------- | ------------------ | --------------------------- |
| 1.x     | :white_check_mark: | Current stable release      |
| 0.x     | :x:                | Legacy - no longer updated  |

## Reporting a Vulnerability

**Do not create a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please email us at **security@example.com** with:

1. **Description**: Clear description of the vulnerability
2. **Location**: Which component/file is affected
3. **Severity**: Your assessment of the severity
4. **Proof of Concept**: Steps to reproduce the vulnerability
5. **Suggested Fix**: If you have one

We will acknowledge your email within 48 hours and provide an estimated timeline for a fix.

## Security Guidelines

### Input Validation

- All user inputs are validated on the backend
- Health indicators have range checks
- Type validation for numeric fields
- String length limits enforced

### Authentication & Authorization

- Currently no authentication required (stateless API)
- CORS properly configured for production
- API keys can be added for rate limiting if needed

### Data Protection

- No user data is persisted
- Requests are processed and immediately discarded
- Use HTTPS in production (enforce TLS 1.2+)
- No sensitive data in logs

### Dependency Security

- Dependencies are kept up-to-date
- Use `npm audit` and `pip-audit` regularly
- GitHub Dependabot enabled for automatic updates
- Security vulnerabilities are addressed promptly

### ML Model Security

- Model is loaded from trusted source only
- Model files validated before use
- Feature scaling prevents data leakage
- No user data used for model retraining

### Container Security

- Run containers with minimal privileges
- Use non-root user in Dockerfile
- Regular base image updates
- Scan images with Trivy/Snyk

### Environment Variables

- Sensitive config via environment variables only
- Never hardcode secrets
- `.env` files added to `.gitignore`
- Use secret management for production

## Best Practices for Users

1. **Deploy with HTTPS**: Always use TLS in production
2. **Restrict CORS**: Configure allowed origins
3. **Update regularly**: Keep dependencies current
4. **Monitor logs**: Watch for suspicious activity
5. **Use secrets management**: For deployment secrets
6. **Regular backups**: If using persistent storage
7. **Access control**: Limit who can access the API

## Security Scanning

The project uses:

- **GitHub Security tab**: Dependency vulnerabilities
- **Trivy**: Container image scanning
- **CodeQL**: Code analysis
- **SAST**: Static application security testing

## Compliance

- Data handling follows privacy best practices
- No HIPAA compliance (for demonstration only)
- No PII collection or storage
- Educational/research use case

## Incident Response

If a security incident is discovered:

1. Immediately notify maintainers
2. Assess impact and severity
3. Develop a fix
4. Test thoroughly
5. Release security update
6. Publish security advisory
7. Notify affected users

## SSL/TLS

For production deployments:

```nginx
# Enable HTTPS
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;

# HSTS header
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Rate Limiting

Consider implementing rate limiting:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

## CORS Configuration

For production, configure CORS properly:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

## Logging & Monitoring

- Log security-relevant events
- Monitor for suspicious patterns
- Use centralized logging in production
- Alert on security anomalies

Example:

```python
import logging

security_logger = logging.getLogger('security')
security_logger.warning(f"Suspicious request from {ip_address}")
```

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/2.3.x/security/)

## Thank You

We appreciate security researchers who responsibly disclose vulnerabilities and help us keep this project secure.
