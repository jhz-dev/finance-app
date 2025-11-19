# Agent Guidelines for FinanSync

This document outlines the guidelines for AI agents interacting with the FinanSync codebase, focusing on understanding the project's architecture, tech stack, best practices, and security considerations.

## 1. Project Overview

FinanSync is a full-stack personal finance management application. It's structured as a monorepo using npm workspaces, separating the backend API and frontend web application.

The primary goal is to allow users to track their finances, create budgets, and share them with others with specific permissions.

## 2. Tech Stack

### Backend (`apps/api`)
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** MySQL (via Docker)
- **Authentication:** JWT-based authentication
- **Validation:** Zod
- **Emailing:** Nodemailer and Handlebars
- **Testing:** Jest, Supertest, and `jest-mock-extended`
- **Linting and Formatting:** Biome
- **Package Manager:** npm

### Frontend (`apps/web`)
- **Language:** TypeScript
- **Framework/Library:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, `lucide-react`, and `recharts`
- **State Management:** Zustand for global state and TanStack Query for server state
- **Routing:** TanStack Router
- **Forms:** TanStack Form
- **Tables:** TanStack Table
- **Testing:** Vitest and React Testing Library
- **Linting and Formatting:** Biome
- **Package Manager:** npm

### Monorepo Tooling
- **Workspaces:** npm workspaces

## 3. Architecture

- **Client-Server Architecture:** The frontend (`apps/web`) communicates with the backend API (`apps/api`) via RESTful endpoints.
- **Database:** MySQL is used as the primary data store, managed by Prisma ORM.
- **Containerization:** Docker is used for the database setup.
- **Directory Structure:**
  - `apps/api/src/application`: Contains the API routes, controllers, services, and tests.
  - `apps/api/src/infrastructure`: Manages the server setup, database connection, and other infrastructure-related code.
  - `apps/web/src/components`: Includes reusable UI components.
  - `apps/web/src/domain`: Defines the core business logic, entities, and repositories for the frontend.
  - `apps/web/src/hooks`: Contains custom hooks for handling data fetching and mutations.
  - `apps/web/src/infrastructure`: Implements the data fetching logic from the API.
  - `apps/web/src/routes`: Manages the application's routes.

## 4. Best Practices

### General
- **TypeScript:** Adhere to strict TypeScript typing for improved code quality and maintainability.
- **Code Consistency:** Follow existing coding styles, naming conventions, and formatting using Biome.
- **Modularity:** Promote small, focused functions and modules.
- **Error Handling:** Implement robust error handling on both client and server sides.
- **Environment Variables:** Utilize `.env` files for sensitive configurations.

### Backend (`apps/api`)
- **RESTful Principles:** Design API endpoints following RESTful conventions.
- **Validation:** Implement input validation for all incoming API requests using Zod.
- **Service Layer:** Separate business logic from controllers.
- **Database Transactions:** Use Prisma transactions for atomic operations where necessary.

### Frontend (`apps/web`)
- **Component-Based Architecture:** Design reusable and modular React components.
- **State Management:** Use Zustand for simple global state and TanStack Query for server-side state management.
- **Accessibility (a11y):** Ensure that all UI components are accessible and follow WAI-ARIA standards.
- **Responsive Design:** Implement a responsive design that works on different screen sizes.

## 5. How to Run the Apps

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations:**
   ```bash
   npm run db:migrate --workspace=apps/api
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed --workspace=apps/api
   ```

4. **Run the backend and frontend apps:**
   ```bash
   npm run dev:api
   npm run dev:web
   ```

## 6. How to Link the Apps

The frontend and backend are already linked. The frontend (`apps/web`) makes API calls to the backend (`apps/api`) at the URL specified in `apps/web/.env.example`.

## 7. How to Update Linting Rules

The project uses Biome for linting and formatting. The configuration can be found in the `biome.json` file at the root of the project. To update the rules, modify this file and then run `npm run lint:fix` to apply the changes.
