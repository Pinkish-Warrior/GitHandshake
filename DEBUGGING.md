# GitHandshake - Debugging and Restoration Plan

This document outlines the debugging process and the steps required to restore the `GitHandshake` application to a fully functional state. The evaluation has identified several configuration and code issues that prevent the server from running correctly and the application from working as intended.

The following plan is prioritized from most critical to least critical.

## Priority 1: Critical Server Configuration Fixes

These issues must be resolved for the backend server to start and operate correctly.

### 1. Module System Mismatch (CommonJS vs. ESM)

-   **Problem**: The NestJS server is configured to output CommonJS modules (`"module": "commonjs"` in `tsconfig.json`), but its `package.json` specifies `"type": "module"`, creating a fatal conflict.
-   **File to Fix**: `apps/server/package.json`
-   **Action**: Remove the `"type": "module"` line to align with the NestJS and TypeScript compiler configuration.

### 2. Seeder Authentication Token Mismatch

-   **Problem**: The database seeding service (`GithubService`) expects a `GITHUB_TOKEN` environment variable, but the `.env.local` file provides `GITHANDSHAKE_SEEDER_TOKEN`.
-   **File to Fix**: `.env.local`
-   **Action**: Rename the `GITHANDSHAKE_SEEDER_TOKEN` variable to `GITHUB_TOKEN` to match what the application code expects.

### 3. Insecure Session Secret

-   **Problem**: The `SESSION_SECRET` in `.env.local` uses a weak, placeholder value, which is a security risk.
-   **File to Fix**: `.env.local`
-   **Action**: Replace the placeholder secret with a strong, randomly generated string.

## Priority 2: Restore Core Functionality

This step ensures all necessary application modules are active.

### 4. Disabled `GithubModule`

-   **Problem**: The `GithubModule`, which is essential for interacting with the GitHub API, is commented out in the main application module, likely from a previous debugging session.
-   **File to Fix**: `apps/server/src/app.module.ts`
-   **Action**: Re-enable the module by uncommenting `GithubModule` in the `imports` array.

## Priority 3: Verification and Execution Plan

After applying the fixes, the following steps will be used to run and test the application.

1.  **Start Services**: Use the project's startup script to launch the database and servers.
    ```bash
    ./start-dev.sh
    ```
2.  **Seed the Database**: In a new terminal, run the seeding script to populate the database with issues from GitHub.
    ```bash
    npm run seed --workspace=server
    ```
3.  **Test the Application**:
    -   Open the frontend at `http://localhost:3000`.
    -   Verify that the dashboard loads and displays the seeded issues.
    -   Test the GitHub login functionality.
    -   Confirm that filtering by language works as expected.
