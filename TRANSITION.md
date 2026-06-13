# GitHandshake — Project Transition

## Goal
Move this project out of iCloud (`~/Documents/HUB/GitHandshake`) to a stable local path under `~/MATRIX/active/GitHandshake`.

## Current State
- Full source code present (Next.js client + NestJS server, Turborepo monorepo)
- Git remote: `https://github.com/Pinkish-Warrior/GitHandshake.git`
- `.env` recovered and present at project root
- `node_modules` present in `apps/client` and `apps/server`

## Steps to Complete

### 1. Rotate exposed credentials
The `.env` was exposed in a session context. Rotate these before continuing:
- Neon DB password (`POSTGRES_PASSWORD`)
- GitHub App Client Secret (`GITHUB_CLIENT_SECRET`)
- GitHub App Private Key (`GITHUB_PRIVATE_KEY`) — regenerate in GitHub App settings

### 2. Move project outside iCloud
Copy source (excluding generated artifacts) to the new location:

```bash
rsync -av --exclude='node_modules' --exclude='.next' --exclude='dist' --exclude='.turbo' \
  ~/Documents/HUB/GitHandshake/ \
  ~/MATRIX/active/GitHandshake/
```

### 3. Reinstall dependencies at new location

```bash
cd ~/MATRIX/active/GitHandshake
npm install
```

### 4. Verify git remote is intact

```bash
git remote -v
# Should show: origin https://github.com/Pinkish-Warrior/GitHandshake.git
```

### 5. Confirm .env is gitignored

```bash
git check-ignore -v .env
# Should return a match — if not, add .env to .gitignore immediately
```

### 6. Remove old iCloud copy
Once you've verified everything works at the new path:

```bash
rm -rf ~/Documents/HUB/GitHandshake
```

## Post-Move Checklist
- [ ] Credentials rotated
- [ ] Project copied to `~/MATRIX/active/GitHandshake`
- [ ] `npm install` run successfully
- [ ] App starts (`npm run dev` in both apps or via Turborepo)
- [ ] Git remote intact and can push/pull
- [ ] Old iCloud copy removed
