# To-Do for Tomorrow

This document lists the tasks planned for the next development session.

## Today's Plan (2025-11-22) - Completed

---

## Next Steps - Completed

---

## Today's Plan - November 24, 2025

### Critical Fixes & Security

*   **[COMPLETED] Address critical `next` package vulnerabilities:** Run `npm audit fix --force` in the project root.
*   **[COMPLETED] Secure backend session secret:** Ensure `SESSION_SECRET` is configured in `.env.local` and remove hardcoded fallback in `apps/server/src/main.ts`.

### Database & Production Safety

*   **[COMPLETED] Credential Management for `docker-compose.yml`:** Use a `.env` file at the root level to store database credentials and reference these variables from `docker-compose.yml`.
*   **[COMPLETED] Disable `synchronize: true` for production:** Modify `apps/server/src/app.module.ts` to set `synchronize: false` and plan for TypeORM migrations.

### Code Quality & Maintainability

*   **[COMPLETED] Add ESLint configuration to `apps/server`:** Create a `.eslintrc.js` file in `apps/server` with appropriate rules to enable code quality checks.
*   **[COMPLETED] Externalize backend URL in client:** Replace hardcoded `http://localhost:3001` with an environment variable (e.g., `NEXT_PUBLIC_API_URL`) in `apps/client/app/Dashboard.jsx` and `apps/client/components/LoginButton.jsx`.

### Feature Completion

*   **[COMPLETED] Complete user persistence in authentication:** Implement the logic to save or update user information in the `users` table upon successful authentication (`apps/server/src/auth/github.strategy.ts`).