# Security Policy

## Supported Versions

The following versions of Droy Language are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability within Droy Language, please follow these steps:

### ⚠️ Please Do NOT

- **Do NOT** open a public issue describing the vulnerability
- **Do NOT** disclose the vulnerability publicly until it has been addressed
- **Do NOT** share details of the vulnerability on public forums or social media

### ✅ Please DO

- **DO** report vulnerabilities privately through GitHub Security Advisories
- **DO** provide detailed information about the vulnerability
- **DO** include steps to reproduce the issue
- **DO** suggest potential fixes if you have them

### How to Report

1. **Via GitHub Security Advisories** (Preferred):
   - Go to [Security Advisories](https://github.com/droy-go/droy-lang/security/advisories/new)
   - Click "New draft security advisory"
   - Fill in the details about the vulnerability

2. **Via Email** (Alternative):
   - Send an email to: [security@droy-lang.dev](mailto:security@droy-lang.dev)
   - Use the subject line: `[SECURITY] Brief description of the issue`
   - Include all relevant details in the email body

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker achieve by exploiting this?
- **Steps to Reproduce**: Detailed steps to reproduce the vulnerability
- **Affected Versions**: Which versions are affected?
- **Environment**: OS, compiler, build configuration
- **Proof of Concept**: Code or commands demonstrating the vulnerability
- **Suggested Fix**: If you have ideas on how to fix it

### Response Timeline

We aim to respond to security reports within:

| Timeframe | Action |
|-----------|--------|
| **24 hours** | Acknowledge receipt of the report |
| **72 hours** | Initial assessment of the vulnerability |
| **7 days** | Develop and test a fix |
| **14 days** | Release a security patch (if applicable) |

These timelines may vary depending on the severity and complexity of the issue.

## Security Measures

### Current Security Practices

1. **Code Review**: All code changes are reviewed by maintainers
2. **Static Analysis**: We use tools like CodeQL and cppcheck
3. **Memory Safety**: Regular testing with Valgrind and sanitizers
4. **Dependency Management**: Automated dependency updates with Dependabot
5. **CI/CD Security**: Secure build pipelines with minimal privileges

### Security Tools Used

- **CodeQL**: Automated security analysis
- **Dependabot**: Dependency vulnerability alerts
- **Valgrind**: Memory leak detection
- **AddressSanitizer**: Memory error detection
- **UBSan**: Undefined behavior detection

## Security Best Practices for Users

### Building Securely

```bash
# Build with security hardening
cmake -B build -DCMAKE_BUILD_TYPE=Release -DENABLE_SANITIZERS=ON
cmake --build build
```

### Running Safely

- Run with minimal privileges
- Validate all input files
- Use sandboxing when possible
- Keep your installation updated

## Security Updates

Security updates will be:

1. Released as patch versions (e.g., 1.0.1)
2. Announced in the [CHANGELOG](CHANGELOG.md)
3. Posted to [GitHub Releases](https://github.com/droy-go/droy-lang/releases)
4. Notified to users who have enabled security alerts

## Known Security Issues

### Current Known Issues

None at this time.

### Past Security Issues

| Issue | CVE | Severity | Fixed Version | Description |
|-------|-----|----------|---------------|-------------|
| None  | -   | -        | -             | No security issues reported yet |

## Acknowledgments

We would like to thank the following security researchers who have responsibly disclosed vulnerabilities:

- *No disclosures yet - be the first!*

## Contact

For security-related inquiries:

- **Security Email**: [security@droy-lang.dev](mailto:security@droy-lang.dev)
- **GitHub Security**: [Security Advisories](https://github.com/droy-go/droy-lang/security)

---

**Thank you for helping keep Droy Language and its users safe!**
