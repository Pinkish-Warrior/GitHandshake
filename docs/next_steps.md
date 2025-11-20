# Next Steps for Open Source Navigator

This document outlines the immediate next steps for the development of the Open Source Navigator application, building upon the foundational setup.

## 1. Backend: Implement Issue Aggregation ✅

The core backend service for fetching and storing beginner-friendly issues from GitHub needs to be built.

- **Task:** Create an "Issue Aggregator" service in the `server` application. ✅
- **Details:** ✅

  - This service will use the configured GitHub App credentials to make authenticated calls to the GitHub API. ✅
  - It should fetch issues tagged with labels like `good first issue`, `help wanted`, `beginner`, etc. ✅
  - The fetched issues should be stored in the PostgreSQL `issues` table. ✅
- **Endpoint:** Create a new endpoint (e.g., `GET /issues`) to expose the aggregated issues to the frontend. ✅

## 2. Frontend: Build the User Interface

With the backend foundation in place, work on the client-side application can begin.

- **Task:** Start building the React/Next.js frontend in the `client` application.
- **Immediate Steps:**
    1\.  **UI/UX Wireframing:** Design simple wireframes for the main dashboard, focusing on displaying the list of issues and filtering options.
    2\.  **Core Components:** Develop the initial set of React components:
        -   `IssueCard`: To display a single issue.
        -   `IssueList`: To display a list of `IssueCard` components.
        -   `LanguageFilter`: To allow users to filter issues by programming language.
        -   `LoginButton`: To initiate the GitHub authentication flow.
    3\.  **Authentication:** Implement the frontend logic to handle the GitHub login flow by communicating with the backend authentication endpoints.

## 3. Database: Finalize Schema and Seeding ✅

- **Task:** Review and finalize the database schema.
- **Details:**

  - Consider if any additional fields are needed for the `issues` or `users` tables based on the data that will be fetched from the GitHub API.
  - Create a seeding script to populate the database with initial sample data for development and testing purposes.

---

## Action Plan: Backend Issue Aggregation ✅

Here is a more detailed breakdown of the steps to implement the Issue Aggregation feature:

1. **Enhance `GithubService`:** ✅
    - Add methods to authenticate as a GitHub App installation (using JWTs to get an installation access token). ✅
    - Create a method to fetch issues from the GitHub API, allowing filtering by labels (e.g., `good first issue`). ✅

2. **Create an `Issues` Module:** ✅
    - Generate a new `IssuesModule`, `IssuesService`, and `IssuesController` using the NestJS CLI. ✅
    - The `IssuesService` will contain the core business logic for orchestrating issue fetching and storage. ✅

3. **Set Up Database Connection:** ✅
    - Install and configure `@nestjs/typeorm` and `pg` to connect the server application to the PostgreSQL database. ✅
    - Create a TypeORM entity for the `Issue` to map to the `issues` database table. ✅

4. **Implement the `GET /issues` Endpoint:** ✅
    - In the `IssuesController`, create the `GET /issues` endpoint. ✅
    - This endpoint will use the `IssuesService` to retrieve the list of aggregated issues from the database and return them as a JSON response. ✅
