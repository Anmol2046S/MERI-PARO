# Security Policy

## Reporting Vulnerabilities

Please report security vulnerabilities to: **security@example.com**

Do NOT create public GitHub issues for security vulnerabilities.

## Security Best Practices

### For Users
- Keep browser updated
- Use strong passwords
- Never share API keys
- Clear sensitive data
- Use HTTPS only
- Review uploaded files

### For Developers
- Validate all inputs
- Sanitize outputs
- Use parameterized queries
- Implement rate limiting
- Enable CORS restrictions
- Use environment variables
- Keep dependencies updated
- Enable security headers

## Dependencies Security

```bash
# Check for vulnerabilities
pip audit
npm audit

# Fix vulnerabilities
pip audit --fix
npm audit fix
```

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| 1.0.x   | Active | 2027-07-21   |
| 0.x     | EOL    | 2026-07-21   |

## Security Headers

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Data Protection

- Files encrypted in transit (HTTPS)
- Sensitive data encrypted at rest
- Regular security audits
- GDPR compliant
- Data retention policies

## Update Timeline

- Critical: Fixed within 24 hours
- High: Fixed within 1 week
- Medium: Fixed within 1 month
- Low: Fixed in next release

---

**Last Updated**: 2026-07-21