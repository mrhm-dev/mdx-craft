# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of MDX Craft seriously. If you have discovered a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email your findings to security@mdx-craft.dev (replace with actual email)
3. Include the following information:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: Within 5 business days, we will provide an initial assessment
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 30 days
- **Updates**: We will keep you informed about the progress of addressing the vulnerability
- **Credit**: Security researchers who responsibly disclose vulnerabilities will be acknowledged in our release notes (unless you prefer to remain anonymous)

### Security Update Process

1. The security team will investigate and validate the reported vulnerability
2. A fix will be developed and tested
3. A security advisory will be prepared
4. The fix will be released, and users will be notified
5. The security advisory will be published

## Security Best Practices

When using MDX Craft:

1. **Keep Dependencies Updated**: Regularly update MDX Craft and its dependencies
2. **Sanitize User Input**: Always sanitize user-generated MDX content before rendering
3. **Use Content Security Policy**: Implement appropriate CSP headers in production
4. **Validate Components**: Only use trusted React components in your MDX content
5. **Review Third-party Plugins**: Carefully review any third-party MDX plugins before use

## Scope

The following are within scope for security reports:

- MDX parsing vulnerabilities
- XSS vulnerabilities in rendered content
- Code execution vulnerabilities
- Authentication/authorization issues (if applicable)
- Dependency vulnerabilities with direct impact

The following are **out of scope**:

- Vulnerabilities in dependencies without direct impact
- Social engineering attacks
- Physical attacks
- Attacks requiring privileged access

Thank you for helping keep MDX Craft and its users safe!