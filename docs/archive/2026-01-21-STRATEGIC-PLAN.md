# Strategic Plan: Getting GitHandshake Running (2026-01-21)

## 1. Objective
To achieve a stable, runnable version of the GitHandshake application in a local development environment by the end of the day. This plan prioritizes immediate blockers to a functional state.

## 2. Key Issues to Address
This plan is informed by the analysis in `docs/REPORT.md`. We will focus on two main areas:
1.  **Dependency Management:** The current `npm` setup has proven to be slow and unreliable, preventing a stable startup.
2.  **Critical Runtime Errors:** The codebase contains hardcoded values and strict initializations that prevent the server from starting correctly and handling authentication.

---

## 3. Phased Execution Plan

### Phase 1: Stabilize Environment & Dependencies
**Goal:** Create a fast, stable, and reliable dependency management system. This is the highest priority as it is our primary blocker.
*   **Action:** Migrate the project's package manager from `npm` to `pnpm`, following the guide in `PKG-PLAN.md`.

### Phase 2: Fix Critical Runtime Configuration
**Goal:** Address code-level issues that will prevent the server from starting, seeding, or authenticating.
*   **Action 1: Fix Strict App Initialization:** Modify the constructor in `src/github/github.service.ts` to relax the strict check for GitHub App credentials. This allows the application and seeder to run in a local development environment without a full GitHub App configuration.
*   **Action 2: Fix Hardcoded Callback URL:** In `src/auth/github.strategy.ts`, replace the hardcoded `localhost:3001` with a dynamic environment variable (`configService.get('GITHUB_CALLBACK_URL')`). This is essential for OAuth2 authentication to function correctly.

### Phase 3: Verify and Run
**Goal:** Start all services, populate the database, and confirm the application is functional for development use.
*   **Action 1:** Start all services (database, server, client) using the new `pnpm` scripts.
*   **Action 2:** Run the database seeding process.
*   **Action 3:** Perform a smoke test: launch the application in a browser, log in via GitHub, and verify that issues are displayed.

---

## 4. Deferred Items
The following important issues identified in `docs/REPORT.md` will be deferred to maintain focus on today's objective. They are not considered immediate blockers for a local development run.
*   Fragile Language Detection Logic
*   Ambiguous Repository Storage (missing `repoOwner`)
*   Removal of Unused Code
*   Enforcing `synchronize: false` for production builds
*   Aligning `GITHUB_TOKEN` environment variable usage
