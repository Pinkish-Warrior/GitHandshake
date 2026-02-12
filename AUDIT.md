# Project Audit: GitHandshake

**Date:** 2026-02-12
**Branch:** `feat/migrate-npm-to-pnpm`
**Auditor:** Claude Code

---

## Overview

Turborepo monorepo with a **Next.js 14** client and **NestJS 11** server, using PostgreSQL 16 via Docker. Package manager recently migrated from npm to pnpm.

---

## Critical Issues

### 1. Broken Authentication

`apps/server/src/auth/auth.module.ts` — `GithubStrategy` is **commented out**, making GitHub OAuth completely non-functional. The `AuthGuard('github')` used in `AuthController` will fail because `GithubStrategy` is not provided.

### 2. Private Key Logged to Console

`apps/server/src/main.ts:18-25` — The `GITHUB_PRIVATE_KEY` is printed to stdout. This exposes secrets in logs, CloudWatch, Docker output, etc.

```typescript
// DANGEROUS — remove this block
console.log("--- START of GITHUB_PRIVATE_KEY ---");
console.log(githubPrivateKey);
console.log("--- END of GITHUB_PRIVATE_KEY ---");
```

### 3. Docker Still Uses npm

Both Dockerfiles and `docker-compose.yml` reference `npm install` and `package-lock.json` despite the pnpm migration.

**Affected files:**

- `apps/client/Dockerfile`
- `apps/server/Dockerfile`
- `docker-compose.yml`

---

## Security Concerns

| Issue | Location | Severity |
|-------|----------|----------|
| Private key logging | `server/src/main.ts` | Critical |
| `synchronize: true` in TypeORM | `server/src/config/typeorm.config.ts` | High |
| Hardcoded CORS origin (`localhost:3000`) | `server/src/main.ts` | High |
| Hardcoded OAuth redirect (`localhost:3000`) | `server/src/auth/auth.controller.ts` | High |
| Debug scripts tracked in git | `check-model.js`, `debug-models.js` | Medium |
| 5 leftover `console.log` statements | Various server files | Low |

Environment files (`.env`, `.env.local`) are properly gitignored.

---

## Code Quality

- **TypeScript strictness is weak** — `strictNullChecks: false`, `noImplicitAny: false`, `@typescript-eslint/no-explicit-any: off`
- **Client uses JSX instead of TSX** — no TypeScript in the frontend
- **No tests exist** — Jest is configured but zero test files written
- **No CI/CD pipeline** — no GitHub Actions or equivalent
- **Missing `repoOwner`** on Issue entity — will cause collisions for same-named repos from different owners
- **Fragile language detection** — relies on label color `#ededed` instead of GitHub API data

---

## Dependency Notes

### Server

- `@nestjs/core`: 11.1.12
- `typeorm`: 0.3.17
- `pg`: 8.11.3
- `@octokit/rest`: 20.0.2
- `passport-github2`: 0.1.12
- `typescript`: 5.9.3
- `jest`: 30.2.0
- `eslint`: 9.39.2 (config uses v8 syntax)

### Client

- `next`: 14.2.33
- `react`: 18
- `eslint`: 8

### Root

- `turbo`: 2.7.5
- `@google/generative-ai`: 0.24.1 (appears unused)

### Issues

- ESLint version mismatch: server uses v9 with v8-style config
- `diff` override in server `package.json` indicates a security patch
- `@google/generative-ai` in root appears unused in production code

---

## Configuration

### TypeScript (Server)

Overly permissive compiler settings weaken type safety:

- `strictNullChecks: false`
- `noImplicitAny: false`
- `forceConsistentCasingInFileNames: false`

### TypeScript (Client)

No `tsconfig.json` — relies on Next.js defaults. Client uses `.jsx` not `.tsx`.

### ESLint (Server)

- `@typescript-eslint/no-explicit-any: off`
- Most strict TypeScript checks disabled

### Docker

- PostgreSQL 16 Alpine with healthcheck
- Multi-stage builds in both Dockerfiles
- Still references npm (needs pnpm update)

### CI/CD

No CI/CD configuration found. No `.github/workflows` directory.

### Turbo

Properly configured for v2.7.5 with build, dev, lint, and test tasks.

---

## Data Model Issues

1. **Missing `repoOwner` column** — `Issue` entity lacks `repoOwner` despite the DB schema having it. Two repos with the same name from different owners will collide.
2. **Fragile language detection** — Uses label color `#ededed` to identify language labels. Unreliable and repository-specific.
3. **Environment variable naming** — `GithubService` uses `GITHUB_TOKEN` but docs reference `GITHANDSHAKE_SEEDER_TOKEN`.

---

## Missing Infrastructure

- No test files (Jest configured but unused)
- No CI/CD pipeline
- No API documentation
- No error tracking (Sentry, etc.)
- No structured logging
- No health check endpoints
- No migration strategy (relies on `synchronize: true`)
- No security headers configured

---

## Positive Aspects

- Clean monorepo structure with Turbo
- Successful pnpm migration (lock file, workspace config)
- Modern, current dependency versions
- Well-designed PostgreSQL schema with indexes
- Secure session configuration (httpOnly, secure in prod, sameSite)
- Good documentation structure in `/docs`
- Proper `.env` management (all sensitive files gitignored)

---

## Production Readiness: NOT READY

Requires fixes to authentication, security, Docker configuration, and testing before deployment.

**Code Quality Score:** 6.5/10
**Security Score:** 5/10
