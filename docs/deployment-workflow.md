# GitHandshake Deployment Workflow

## Pre-Deployment Backup

Before starting, create a backup branch:

```bash
git checkout main
git pull origin main
git checkout -b backup/pre-deployment
git push origin backup/pre-deployment
git checkout main
```

---

## Phase 1: Fix Code Blockers (must do before deploying)

These are code changes required for production to work at all.

### Step 1.1 — Add SSL support to TypeORM config

**Why:** Neon requires `sslmode=require`. Without this, the server cannot connect to the database.

**Files to change:**
- `apps/server/src/config/typeorm.config.ts` — add `ssl` option
- `apps/server/src/config/data-source.ts` — add `ssl` option (for CLI migrations)

**What to add:**
```typescript
ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
```

### Step 1.2 — Add `trust proxy` to main.ts

**Why:** Render sits behind a reverse proxy. Without `trust proxy`, Express won't see requests as HTTPS, and `secure: true` cookies will silently fail — breaking GitHub OAuth entirely.

**File to change:** `apps/server/src/main.ts`

**What to add (before session middleware):**
```typescript
app.set('trust proxy', 1);
```

### Step 1.3 — Clean up .env.sample

**Why:** Avoid confusion when setting env vars on Render. The current file lists vars the code doesn't read.

**File to change:** `.env.sample`

**Actions:**
- Remove stale `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` (code reads `POSTGRES_USER`, etc.)
- Add `NODE_ENV`
- Add `DB_SSL`

### Step 1.4 — Verify and test locally

```bash
pnpm build          # both client + server must compile
pnpm dev            # quick smoke test that nothing broke
```

### Step 1.5 — Commit and push

Create a PR: `fix: prepare codebase for production deployment`

---

## Phase 2: Set Up Neon Database

### Step 2.1 — Create Neon project

1. Go to https://console.neon.tech
2. Create a new project
3. Choose **PostgreSQL 16**, region closest to Render (US East recommended)
4. Copy the connection string and extract:
   - `DB_HOST`, `DB_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

### Step 2.2 — Run schema

Use Neon's SQL Editor (easiest) or psql:

```bash
psql "<connection-string>" -f db/schema.sql
```

### Step 2.3 — Verify tables

In Neon SQL Editor:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Expected: `users`, `issues`

---

## Phase 3: Set Up GitHub OAuth for Production

### Step 3.1 — Update GitHub OAuth App

Go to https://github.com/settings/developers and update:

- **Homepage URL:** `https://githandshake-client.onrender.com`
- **Authorization callback URL:** `https://githandshake-client.onrender.com/api/auth/github/callback`

> Note: Do this AFTER you know your Render URLs, or come back to update.

---

## Phase 4: Deploy Server on Render

### Step 4.1 — Create Web Service

1. Go to https://dashboard.render.com → **New** → **Web Service**
2. Connect your GitHub repo (`GitHandshake`)
3. Configure:
   - **Name:** `githandshake-server`
   - **Root Directory:** `apps/server`
   - **Runtime:** Node
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter server build`
   - **Start Command:** `node dist/main`
   - **Instance Type:** Free (or Starter $7/mo for always-on)

### Step 4.2 — Set environment variables

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DB_HOST` | Neon host |
| `DB_PORT` | `5432` |
| `POSTGRES_USER` | From Neon |
| `POSTGRES_PASSWORD` | From Neon |
| `POSTGRES_DB` | From Neon |
| `DB_SSL` | `true` |
| `GITHUB_APP_ID` | Your GitHub App ID |
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret |
| `GITHUB_PRIVATE_KEY` | Your GitHub App private key (PEM) |
| `GITHUB_TOKEN` | GitHub personal access token |
| `GITHUB_CALLBACK_URL` | `https://githandshake-client.onrender.com/api/auth/github/callback` |
| `CLIENT_URL` | `https://githandshake-client.onrender.com` |
| `SESSION_SECRET` | Strong random string (32+ chars) |

### Step 4.3 — Set health check

- **Health Check Path:** `/api/health`

### Step 4.4 — Deploy and verify

After deploy completes, visit:
```
https://githandshake-server.onrender.com/api/health
```
Expected: `{ "status": "ok", "timestamp": "..." }`

---

## Phase 5: Deploy Client on Render

### Step 5.1 — Create Web Service

1. **New** → **Web Service**
2. Connect same GitHub repo
3. Configure:
   - **Name:** `githandshake-client`
   - **Root Directory:** `apps/client`
   - **Runtime:** Node
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter client build`
   - **Start Command:** `pnpm start`
   - **Instance Type:** Free (or Starter)

### Step 5.2 — Set environment variables

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://githandshake-server.onrender.com` |

> Remember: `NEXT_PUBLIC_API_URL` is baked at build time. Changing it requires a redeploy.

### Step 5.3 — Deploy and verify

Visit: `https://githandshake-client.onrender.com`

Expected: Site loads, homepage renders.

---

## Phase 6: End-to-End Testing

### Step 6.1 — Test checklist

- [ ] Homepage loads correctly
- [ ] `/api/health` returns OK (both directly on server and via client proxy)
- [ ] GitHub login button redirects to GitHub OAuth
- [ ] GitHub OAuth callback completes and user is logged in
- [ ] Session persists (refresh page, still logged in)
- [ ] Issues load on the main page
- [ ] Language filter works
- [ ] Logout works

### Step 6.2 — Common issues to watch for

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| DB connection refused | Missing `DB_SSL=true` | Add env var on Render |
| OAuth callback fails | Wrong `GITHUB_CALLBACK_URL` | Update env var + GitHub App |
| Login works but session lost on refresh | Missing `trust proxy` | Verify Step 1.2 was deployed |
| Client shows "fetch failed" | Wrong `NEXT_PUBLIC_API_URL` | Fix and redeploy client |
| CORS errors | `CLIENT_URL` doesn't match client URL | Fix server env var |
| 30s delay on first request | Render free tier cold start | Normal — upgrade to Starter to fix |

---

## Phase 7: Post-Deployment Hardening (recommended but not blocking)

These can be done after the initial deployment is live and working.

### Step 7.1 — Add rate limiting

Install `@nestjs/throttler` and configure in `app.module.ts`.

### Step 7.2 — Seed production data (optional)

Run the seed script pointing at Neon, or use Render's shell.

### Step 7.3 — Custom domain (optional)

Configure in Render → Settings → Custom Domains, then update all URLs.

### Step 7.4 — Monitoring (future)

- Uptime monitoring (UptimeRobot / Better Stack)
- Error tracking (Sentry)

---

## Order of Operations (Summary)

```
1. Backup branch                          ← safety net
2. Fix code blockers (SSL, trust proxy)   ← required for production
3. Clean up .env.sample                   ← avoids confusion
4. Build + test locally                   ← catch errors early
5. Commit + PR + merge to main            ← code ready
6. Create Neon database + run schema      ← DB ready
7. Deploy server on Render                ← backend ready
8. Verify /api/health                     ← confirm server works
9. Deploy client on Render                ← frontend ready
10. Update GitHub OAuth URLs              ← auth ready
11. End-to-end testing                    ← verify everything
12. Post-deployment hardening             ← polish
```
