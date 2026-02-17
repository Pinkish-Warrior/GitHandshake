# GitHandshake Deployment Plan

## Overview

GitHandshake is a Turborepo monorepo deployed across three services:

| Service | Platform | Details |
|---------|----------|---------|
| **Client** | Render (Web Service) | Next.js 14 |
| **Server** | Render (Web Service) | NestJS 11 |
| **Database** | Neon | PostgreSQL (serverless) |

---

## 1. Pre-Deployment Checklist

- [ ] All features merged to `main`
- [ ] `pnpm build` succeeds locally (both client and server)
- [ ] `.env.sample` is up to date with all required variables
- [ ] Database schema/migrations are ready
- [ ] GitHub OAuth App updated with production callback URL
- [ ] Session secret is a strong random string (not the dev one)

---

## 2. Neon Database Setup

1. Create a project at https://console.neon.tech
2. Choose **PostgreSQL 16** and the region closest to your Render services
3. Copy the connection string — it will look like:
   ```
   postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Extract the individual values for your env vars:
   - `DB_HOST` = `ep-xyz-123.us-east-2.aws.neon.tech`
   - `DB_PORT` = `5432`
   - `POSTGRES_USER` = from connection string
   - `POSTGRES_PASSWORD` = from connection string
   - `POSTGRES_DB` = `neondb` (or rename it)
5. Run the schema against Neon using the SQL Editor in the Neon console, or via psql:
   ```bash
   psql "postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require" -f db/schema.sql
   ```

**Neon-specific notes:**
- Neon requires `sslmode=require` — ensure TypeORM config passes `ssl: true` in production
- Neon has connection pooling built in — no need for PgBouncer
- Free tier includes 0.5 GB storage and autoscaling compute

---

## 3. Render Setup

### 3a. Deploy the Server (NestJS)

1. Go to https://dashboard.render.com → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `githandshake-server`
   - **Root Directory:** `apps/server`
   - **Runtime:** Node
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter server build`
   - **Start Command:** `node dist/main`
   - **Instance Type:** Free (or Starter for always-on)
4. Add environment variables (see Section 4 below)
5. Set the **Health Check Path** to `/api/health`

### 3b. Deploy the Client (Next.js)

1. **New** → **Web Service**
2. Connect the same GitHub repo
3. Configure:
   - **Name:** `githandshake-client`
   - **Root Directory:** `apps/client`
   - **Runtime:** Node
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter client build`
   - **Start Command:** `pnpm start`
   - **Instance Type:** Free (or Starter for always-on)
4. Add environment variables (see Section 4 below)

### Render Notes

- Free tier services spin down after 15 min of inactivity (first request takes ~30s)
- Starter tier ($7/mo per service) keeps services always-on
- Render auto-deploys on push to `main` by default
- Both services need the `cd ../..` prefix in build commands because Turborepo needs the root `pnpm-workspace.yaml`

---

## 4. Environment Variables

### Server (Render)

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DB_HOST` | Neon host (e.g., `ep-xyz-123.us-east-2.aws.neon.tech`) |
| `DB_PORT` | `5432` |
| `POSTGRES_USER` | Neon username |
| `POSTGRES_PASSWORD` | Neon password |
| `POSTGRES_DB` | Neon database name |
| `DB_SSL` | `true` |
| `GITHUB_APP_ID` | Your GitHub App ID |
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret |
| `GITHUB_PRIVATE_KEY` | Your GitHub App private key (PEM) |
| `GITHUB_TOKEN` | GitHub personal access token |
| `GITHUB_CALLBACK_URL` | `https://githandshake-client.onrender.com/api/auth/github/callback` |
| `CLIENT_URL` | `https://githandshake-client.onrender.com` |
| `SESSION_SECRET` | Strong random string (32+ chars) |

### Client (Render)

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://githandshake-server.onrender.com` |

**Important:** `NEXT_PUBLIC_API_URL` is baked into the Next.js build at build time. If you change it, you must trigger a rebuild.

---

## 5. GitHub OAuth App Configuration

Update your GitHub OAuth App at https://github.com/settings/developers:

- **Homepage URL:** `https://githandshake-client.onrender.com`
- **Authorization callback URL:** `https://githandshake-client.onrender.com/api/auth/github/callback`

If using a GitHub App (not just OAuth App), also update the webhook URL and callback URL there.

---

## 6. SSL for Neon (TypeORM Config)

Neon requires SSL connections. The TypeORM config needs to handle this in production. Check `apps/server/src/config/typeorm.config.ts` and ensure it includes:

```typescript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
```

Or use the `DB_SSL` env var:

```typescript
ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
```

---

## 7. Database Management

### Initial Schema
Run `db/schema.sql` against Neon via the SQL Editor or psql (see Section 2).

### Seeding (Optional)
After the server is deployed and connected:
- You can run the seed locally pointing at the Neon database
- Or use Render's shell feature to run: `node dist/seed.js`

### TypeORM Synchronize
- **Development:** `synchronize: true` (auto-creates tables)
- **Production:** Must be `false` — use migrations:
  ```bash
  pnpm --filter server migration:run
  ```

**Action needed:** Verify TypeORM config disables `synchronize` when `NODE_ENV=production`.

---

## 8. Production Hardening

### Already in place
- [x] Helmet security headers
- [x] CORS restricted to `CLIENT_URL`
- [x] Session cookies: `httpOnly: true`, `secure: true` in production, `sameSite: lax`
- [x] `getOrThrow` for required env vars (fails fast if missing)

### Still needed
- [ ] Ensure `NODE_ENV=production` is set on both Render services
- [ ] Verify TypeORM `synchronize: false` in production
- [ ] Verify TypeORM `ssl: true` for Neon
- [ ] Rate limiting on API endpoints (consider `@nestjs/throttler`)
- [ ] Wire up `/api/health` to Render health checks
- [ ] Error tracking (Sentry — deferred)

---

## 9. DNS & Custom Domain (Optional)

Render provides `*.onrender.com` subdomains by default. To use a custom domain:

1. Go to your Render service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `githandshake.com`)
3. Update DNS records as instructed by Render (CNAME)
4. Render handles SSL automatically
5. Update all env vars (`CLIENT_URL`, `GITHUB_CALLBACK_URL`, `NEXT_PUBLIC_API_URL`) to use the custom domain
6. Update GitHub OAuth App URLs

---

## 10. Deployment Steps (Quick Start)

1. **Set up Neon database**
   - Create project, copy connection details
   - Run `db/schema.sql` via SQL Editor

2. **Deploy server on Render**
   - Create Web Service, connect repo, set root to `apps/server`
   - Add all server env vars (Section 4)
   - Deploy and verify `/api/health` responds

3. **Deploy client on Render**
   - Create Web Service, connect repo, set root to `apps/client`
   - Set `NEXT_PUBLIC_API_URL` to the server's Render URL
   - Deploy

4. **Update GitHub OAuth App**
   - Set callback URL to `https://githandshake-client.onrender.com/api/auth/github/callback`

5. **Seed the database** (optional)

6. **Test**
   - [ ] Site loads
   - [ ] GitHub login works
   - [ ] Issues load and filter correctly
   - [ ] `/api/health` returns OK

---

## 11. CI/CD (Future)

Render auto-deploys on push to `main` by default. For additional CI:
- Add GitHub Actions for lint + tests on PR
- Use Render's preview environments for feature branches

---

## 12. Monitoring (Future)

- [ ] Uptime monitoring (UptimeRobot, Better Stack)
- [ ] Error tracking (Sentry)
- [ ] Neon dashboard for database metrics and storage
- [ ] Render dashboard for service metrics and logs
