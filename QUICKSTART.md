# Quickstart

Get GitHandshake running locally in 5 minutes.

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9 (`corepack enable && corepack prepare pnpm@9.1.0 --activate`)
- **Docker** or **Podman** (for PostgreSQL)
- A **GitHub OAuth App** or **GitHub App** (for authentication)
- A **GitHub Personal Access Token** (for fetching issues)

## 1. Clone and install

```bash
git clone https://github.com/your-org/GitHandshake.git
cd GitHandshake
pnpm install
```

## 2. Configure environment

```bash
cp .env.sample .env
```

Edit `.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `DB_HOST` | `localhost` for local dev |
| `DB_PORT` | `5432` (default) |
| `DB_USERNAME` | Same as `POSTGRES_USER` |
| `DB_PASSWORD` | Same as `POSTGRES_PASSWORD` |
| `DB_DATABASE` | Same as `POSTGRES_DB` |
| `GITHUB_APP_ID` | From your GitHub App settings |
| `GITHUB_CLIENT_ID` | From your GitHub App settings |
| `GITHUB_CLIENT_SECRET` | From your GitHub App settings |
| `GITHUB_PRIVATE_KEY` | PEM-encoded private key from your GitHub App |
| `GITHUB_CALLBACK_URL` | `http://localhost:3000/api/auth/github/callback` |
| `GITHUB_TOKEN` | Personal access token with `public_repo` scope |
| `CLIENT_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |
| `SESSION_SECRET` | A long random string (generate with `openssl rand -base64 32`) |

## 3. Start the database

Using Docker:
```bash
docker-compose up -d
```

Using Podman:
```bash
podman-compose up -d
```

Verify it's running:
```bash
docker exec -it githandshake-db-1 pg_isready
```

## 4. Start the server

```bash
pnpm --filter server start:dev
```

The API will be available at `http://localhost:3001`.

## 5. Start the client

In a separate terminal:
```bash
pnpm --filter client dev
```

The app will be available at `http://localhost:3000`.

## 6. Seed the database

In a separate terminal, populate the database with "good first issue" issues from popular repos:

```bash
pnpm --filter server seed
```

## 7. Open the app

Visit `http://localhost:3000`. You should see issues listed. Click "Login with GitHub" to authenticate.

## Useful commands

| Command | Description |
|---------|-------------|
| `pnpm --filter server start:dev` | Start server with hot reload |
| `pnpm --filter client dev` | Start client with hot reload |
| `pnpm --filter server seed` | Seed database with GitHub issues |
| `pnpm dev` | Start both client and server via Turbo |
| `pnpm build` | Build both apps |
| `pnpm lint` | Lint both apps |

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill -9   # free port 3001
lsof -ti:3000 | xargs kill -9   # free port 3000
```

**Database connection refused:** Make sure the database container is running and healthy.

**"Bad credentials" on seed:** Your `GITHUB_TOKEN` is expired or invalid. Generate a new one at GitHub > Settings > Developer settings > Personal access tokens.

**Login button doesn't work:** Ensure `NEXT_PUBLIC_API_URL` is set in `.env` and restart the client (Next.js reads `NEXT_PUBLIC_*` vars at startup).
