# GitHandshake — Architecture

## System Overview

```mermaid
graph TD
  User([Browser])

  subgraph Render
    Client["Client\nNext.js 14\ngithandshake-client.onrender.com"]
    Server["Server\nNestJS 11\ngithandshake-server.onrender.com"]
  end

  DB[(Neon\nPostgreSQL 16)]
  GitHub([GitHub API\n& OAuth])

  User -->|HTTPS| Client
  Client -->|API proxy rewrites| Server
  Client -->|Auth proxy routes| Server
  Server -->|TypeORM| DB
  Server -->|Octokit REST| GitHub
  Server -->|Passport OAuth| GitHub
```

---

## Auth Flow

```mermaid
sequenceDiagram
  actor User
  participant Client as Next.js Client
  participant Server as NestJS Server
  participant GitHub as GitHub OAuth

  User->>Client: Click "Login with GitHub"
  Client->>Server: GET /api/auth/github
  Server-->>Client: 302 → GitHub OAuth URL
  Client-->>User: Redirect to GitHub

  User->>GitHub: Authorize GitHandshake
  GitHub-->>Client: Redirect to /api/auth/github/callback?code=...

  Client->>Server: GET /api/auth/github/callback?code=...
  Server->>GitHub: Exchange code for access token
  GitHub-->>Server: Access token + profile
  Server->>Server: findOrCreate user in DB
  Server-->>Client: 200 + Set-Cookie (session)

  Client-->>User: Redirect to / (logged in)
```

---

## Data Flow — Issues

```mermaid
sequenceDiagram
  actor User
  participant Client as Next.js Client
  participant Server as NestJS Server
  participant DB as Neon PostgreSQL
  participant GitHub as GitHub API

  User->>Client: Load dashboard (optionally filter by language)
  Client->>Server: GET /api/issues?language=TypeScript
  Server->>DB: SELECT issues WHERE language = 'TypeScript'
  DB-->>Server: Issue rows
  Server-->>Client: JSON array of issues
  Client-->>User: Render issue cards

  note over Server,GitHub: Issues are pre-seeded via the seed script,<br/>which fetches from GitHub API using Octokit
```

---

## Monorepo Structure

```
GitHandshake/               ← Turborepo root
├── apps/
│   ├── client/             ← Next.js 14 (deployed on Render)
│   │   ├── app/
│   │   │   ├── api/auth/   ← Auth proxy routes (cookie forwarding)
│   │   │   └── page.tsx    ← Dashboard
│   │   └── components/
│   └── server/             ← NestJS 11 (deployed on Render)
│       └── src/
│           ├── auth/        ← Passport GitHub OAuth + sessions
│           ├── issues/      ← Issues CRUD + GitHub fetch
│           ├── github/      ← GitHub App integration
│           └── users/       ← User entity + findOrCreate
├── db/
│   └── schema.sql          ← Database schema
└── docs/                   ← Documentation
```
