# To-Do for Tomorrow

This document lists the tasks planned for the next development session.

## Frontend Development

- **UI/UX Wireframing:** Design simple wireframes for the main dashboard. The focus will be on displaying the list of issues and providing filtering options.
- **Core Components:** Begin development of the initial set of React components:
  - `IssueCard`: To display a single issue.
  - `IssueList`: To display a list of `IssueCard` components.
  - `LanguageFilter`: To allow users to filter issues by programming language.
  - `LoginButton`: To initiate the GitHub authentication flow.

Instructions:

📐 UI/UX WireframingThe main dashboard should be structured to make the issue list the central focus while keeping filtering and login easily accessible.Header/Navigation Bar: A fixed bar at the top containing the LoginButton and potentially the application title/logo. This ensures login is always one click away.Sidebar/Filter Area: A left or right column (or a collapsable panel) dedicated to filtering. This is where the LanguageFilter will live. It allows users to quickly modify the issue list without navigating away.Main Content Area: The largest section, dedicated to the IssueList which contains multiple IssueCard components. This area should be scrollable.🏗️ Core Components ImplementationYour component breakdown is excellent. Here's a suggested structure for development:1. IssueCard (The Atom)This is the smallest, reusable unit. It needs to clearly and concisely present the key information for a single issue.PropTypeDescriptiontitlestringThe title of the issue.languagestringThe primary language/label.labelsstring[]Other relevant labels (e.g., "bug", "help wanted").urlstringThe URL to the actual issue on GitHub.Tip: Make the entire card or just the title a link (<a>) using the url prop so users can navigate to the issue quickly.2. IssueList (The Organizer)This component fetches data (or receives it via props from a parent container) and maps over the array to render multiple IssueCard components.Input: An array of issue objects (e.g., issues: IssueData[]).Logic:JavaScript{issues.map(issue => (
    <IssueCard key={issue.id} {...issue} />
))}
3. LanguageFilter (The Selector)This component handles the logic for selecting a filter and communicating that selection back up to the parent component (the Dashboard) that holds the state for the issue data.State Management: It often uses a simple onClick handler for each language/button/checkbox.Communication: When a filter is selected, it calls a function passed down as a prop (e.g., onFilterChange) with the new selected language. The parent component then uses this value to filter the issues array before passing it to IssueList.4. LoginButton (The Gateway)A simple, prominently placed button that kicks off the authentication process.Action: When clicked, it should redirect the user to your backend authentication endpoint, which in turn redirects to GitHub's authorization page.State: The button text/appearance might change based on whether the user is authenticated (e.g., "Login with GitHub" vs. "Logout").

---

## Log of Issues

- **2025-11-21: GitHub App Seeding Permission Issue**
  - **Problem:** The `npm run seed --workspace=server` command consistently failed with a "Not Found" error from the GitHub API (`https://docs.github.com/rest/apps/apps#get-a-repository-installation-for-the-authenticated-app`).
  - **Root Cause:** The GitHub App (configured via `.env.local`) was not installed on the target public repositories (e.g., `facebook/react`, `angular/angular`) that the seed script attempted to fetch issues from. The app requires installation on an organization or user account to access its repositories.
  - **Resolution/Workaround:** The seeding process cannot be completed without manual intervention to install the GitHub App on desired repositories. For immediate frontend testing, the `Dashboard.jsx` was updated to fetch from the backend API, and a placeholder message for empty results was added. To use the seed script effectively, ensure the GitHub App is installed on the `owner/repo` specified in `src/seed.ts`.

---

## Today's Plan (2025-11-22)

### Frontend

- **[Done] Complete Live Filtering:** Implemented client-side logic for "Filter by Language" dropdown, now leveraging backend API.
- **[Done] Enhance UI States:** Added loading spinner and improved empty/error messages.
- **[Done] Begin GitHub Authentication Flow (Frontend):** Implemented frontend redirection for the LoginButton.

### Backend(actioned)

- **[Done] Implement API Filtering:** Added filtering capabilities to the backend `/issues` endpoint (e.g., `/issues?language=javascript`).

---

## Next Steps

### 1.0 Backend

- **[DONE] Implement full GitHub Authentication Flow:** Implemented session management, GitHub strategy, auth controller, and frontend integration for login/logout.
- **[DONE] Generate comprehensive repository evaluation report (`report.md`).**
- **[DONE] Conduct `npm audit` and document findings in `report.md`.**

### 2.0 Frontend

- **[DONE] Implement favicon and webmanifest metadata in client (`layout.jsx`).**
- **[DONE] Create public directory for static assets (`apps/client/public`).**

### Backend (Seed Data)

- **[DONE] Update backend seed script (`src/seed.ts`) with popular repos for testing.**

### Git Repository Management

- **[DONE] Clean up merged remote feature branches.**
- **[DONE] Delete local merged feature branch.**

---

## Tomorrow's Plan (2025-11-23)

### Critical Fixes & Security

- **[TODO] Address critical `next` package vulnerabilities:** Run `npm audit fix --force` in the project root.
- **[TODO] Secure backend session secret:** Ensure `SESSION_SECRET` is configured in `.env.local` and remove hardcoded fallback in `apps/server/src/main.ts`.

### Code Quality & Maintainability

- **[TODO] Add ESLint configuration to `apps/server`:** Create a `.eslintrc.js` file to enable code quality checks.
- **[TODO] Externalize backend URL in client:** Replace hardcoded `http://localhost:3001` with an environment variable (e.g., `NEXT_PUBLIC_API_URL`) in `apps/client/app/Dashboard.jsx` and `apps/client/components/LoginButton.jsx`.
- **[TODO] Disable `synchronize: true` for production:** Modify `apps/server/src/app.module.ts` and plan for TypeORM migrations.

### Feature Completion

- **[TODO] Complete user persistence in authentication:** Save authenticated user data to the `users` table in the database (`apps/server/src/auth/github.strategy.ts`).
