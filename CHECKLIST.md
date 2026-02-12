# GitHandshake Audit Checklist

Track progress on audit findings. Mark items `[x]` as they are resolved.

---

## Priority 1 — Critical (Blockers)

- [x] **Fix broken authentication** — Restored `GithubStrategy`, `SessionSerializer`, and `UsersModule` in `auth.module.ts`. Removed non-existent `AuthService` reference.
- [x] **Remove private key logging** — Deleted the `console.log` block for `GITHUB_PRIVATE_KEY` in `main.ts`
- [x] **Update Dockerfiles to pnpm** — Updated `apps/client/Dockerfile`, `apps/server/Dockerfile`, and `docker-compose.yml` to use pnpm with `corepack`, `pnpm-lock.yaml`, and `--frozen-lockfile`

---

## Priority 2 — Security

- [x] **Extract CORS origin to env var** — Now reads `CLIENT_URL` from env (defaults to `http://localhost:3000`)
- [x] **Extract OAuth redirect to env var** — `auth.controller.ts` now uses `CLIENT_URL` from env for post-login redirect
- [x] **Disable TypeORM synchronize for production** — `synchronize` is now `false` when `NODE_ENV=production`, `true` otherwise
- [x] **Remove/untrack debug scripts** — Already untracked by git; `.gitignore` rules are working

---

## Priority 3 — Data Integrity

- [ ] **Add `repoOwner` to Issue entity** — Skipped for now; not causing functional issues
- [x] **Fix language detection** — Now fetches repo language from GitHub API (`repos.get`) instead of guessing from label colors. Also fixed label filter from `"dummy issue"` to `"good first issue"`
- [x] **Create TypeORM migrations** — Added `data-source.ts`, migrations directory, and `migration:generate`/`migration:run`/`migration:revert` scripts

---

## Priority 4 — Code Quality

- [x] **Remove leftover `console.log` statements** — Only 1 remained (in `seed.ts`, appropriate for a CLI script). Rest were already removed in Priority 1
- [x] **Strengthen TypeScript config** — Enabled `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`, `forceConsistentCasingInFileNames`, `noFallthroughCasesInSwitch`. Fixed all resulting type errors across the codebase
- [x] **Fix ESLint config** — Downgraded ESLint to v8 to match `.eslintrc.js` config and `@typescript-eslint` v6 plugins. Auto-fixed all formatting issues
- [x] **Migrate client to TypeScript** — Converted all 7 `.jsx` files to `.tsx`, added prop interfaces, created shared `Issue` type, installed TypeScript + type declarations. Build verified
- [x] **Remove unused root dependency** — Removed `@google/generative-ai` from root `package.json`

---

## Priority 5 — Infrastructure

- [ ] **Add CI/CD pipeline** — Deferred; add when test suite and collaborators are in place
- [ ] **Write tests** — Deferred; add unit and integration tests for server services and controllers
- [x] **Add health check endpoint** — Added `GET /api/health` returning `{ status, timestamp }` in `AppController`
- [x] **Add structured logging** — Server already uses NestJS `Logger`. Only `console.log` remaining is in `seed.ts` (appropriate for CLI)
- [ ] **Add error tracking** — Deferred; integrate Sentry when approaching production
- [x] **Add security headers** — Installed and configured Helmet middleware in `main.ts`
- [x] **Standardize env var naming** — Updated `.env.sample` to use `GITHUB_TOKEN` (matches code). Removed `GITHANDSHAKE_SEEDER_TOKEN`

---

## Priority 6 — Cleanup

- [x] **Clean up root planning documents** — Moved 5 outdated files to `docs/archive/`
- [ ] **Add API documentation** — Document REST endpoints (Swagger/OpenAPI via `@nestjs/swagger`)
- [ ] **Add architecture diagrams** — Document system architecture in `/docs`

---

## Progress

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| 1 — Critical | 3 | 3 | 0 |
| 2 — Security | 4 | 4 | 0 |
| 3 — Data Integrity | 3 | 2 | 1 |
| 4 — Code Quality | 5 | 5 | 0 |
| 5 — Infrastructure | 7 | 4 | 3 |
| 6 — Cleanup | 3 | 1 | 2 |
| **Total** | **25** | **19** | **6** |
