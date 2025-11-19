# Open Source Navigator - MVP Plan (Part 1)

## 1. Core MVP Focus

The primary goal of this Minimum Viable Product (MVP) is to deliver immediate, tangible value to aspiring open-source contributors. To achieve this, the initial development will focus exclusively on **The "First Contribution Finder"**.

This feature directly addresses the most significant barrier for newcomers: finding a suitable first issue to work on. Educational content and other features will be built around this core functionality in later phases.

## 2. Key Objectives for this MVP

* **User Authentication:** Securely authenticate users via a GitHub App.
* **Issue Aggregation:** Develop a backend service to fetch, filter, and store beginner-friendly issues from GitHub.
* **Dynamic Frontend:** Create a simple, clean user interface to display aggregated issues.
* **Personalized Filtering:** Allow users to filter issues by programming language (e.g., Python, JavaScript, Rust).

## 3. Technology Stack

| Component      | Recommended Technology |
| :------------- | :--------------------- |
| **Frontend**   | React / Next.js        |
| **Backend**    | Node.js with NestJS    |
| **Database**   | PostgreSQL             |
| **Auth**       | GitHub App             |
| **Monorepo**   | npm/yarn/pnpm workspaces |

## 4. Initial Project Structure

The project will be organized as a monorepo to streamline development between the frontend and backend.

Of course. That’s an excellent idea. Documenting our plan in an `mvp.md` file is a standard best practice. It keeps us aligned and ensures the project’s scope is clearly defined.

I will create the content for `mvp.md`. This file will outline the core focus, the folder structure we just designed, and the next immediate steps. This serves as our foundational project document.

Here is the content for `mvp.md`. You can create a file with this name in the root of the `open-source-navigator` directory and paste this in.

```text
/open-source-navigator
|
|-- /apps
|   |-- /client           # Next.js Frontend
|   |   |-- /app
|   |   |-- /components
|   |   `-- package.json
|   |
|   `-- /server           # NestJS Backend
|       |-- /src
|       |   |-- /auth
|       |   |-- /config
|       |   |-- /github
|       |   `-- main.ts
|       `-- package.json
|
|-- /packages
|   `-- /ui               # Shared UI components (optional)
|
|-- mvp.md                # This document
`-- package.json          # Root monorepo package.json
```

## 5. The Tech-Stack(Typescript, Next.js and React)

### Why this Stack? A Brief Rationale

For the Open Source Navigator, choosing TypeScript with Next.js (using React) is a strategic decision focused on three core goals: Reliability, Scalability, and Developer Velocity.

* 1\. TypeScript for Reliability and Safety

TypeScript adds a layer of static typing on top of JavaScript. For a project like this, which will handle data from external APIs (GitHub) and manage user state, this is critical. It helps catch common errors—like typos or incorrect data types—during development, not in production. This leads to a more robust, stable, and maintainable codebase, which is essential for long-term success.￼

* 2\. Next.js for Performance and Structure

Next.js is a React framework that provides a powerful, production-ready foundation out of the box. It handles complex tasks like routing, code splitting, and server-side rendering (SSR) automatically. For our “First Contribution Finder,” this means faster initial page loads and a better user experience. Its built-in support for API routes also allows us to manage our backend logic within the same project, streamlining development.￼

* 3\. A Modern, Integrated Ecosystem

Next.js is designed with TypeScript as a first-class citizen, meaning they work together seamlessly with minimal configuration. This combination provides an exceptional developer experience with features like auto-completion and real-time error checking in code editors. By using this modern, integrated stack, we can build a scalable, high-performance application faster and more reliably.￼


## What’s our next move?


* Proceed with creating the `package.json` files and installing the core dependencies.

* Design the initial database schema for the `users` and `issues` tables?

* Drafting the API contract (the endpoints and their expected request/response formats).
