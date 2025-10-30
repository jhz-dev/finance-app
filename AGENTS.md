# Agent Guidelines for FinanSync

This document outlines the guidelines for AI agents interacting with the FinanSync codebase, focusing on understanding the project's architecture, tech stack, best practices, and security considerations.

## 1. Project Overview

FinanSync is a full-stack personal finance management application. It's structured as a monorepo using npm workspaces, separating the backend API and frontend web application.

## 2. Tech Stack

### Backend (`apps/api`)
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (via Docker)
- **Package Manager:** npm

### Frontend (`apps/web`)
- **Language:** TypeScript
- **Framework/Library:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Package Manager:** npm

### Monorepo Tooling
- **Workspaces:** npm workspaces

## 3. Architecture

- **Client-Server Architecture:** The frontend (`apps/web`) communicates with the backend API (`apps/api`) via RESTful endpoints.
- **Database:** PostgreSQL is used as the primary data store, managed by Prisma ORM.
- **Containerization:** Docker is used for database setup and potentially for deployment.

## 4. Best Practices

### General
- **TypeScript:** Adhere to strict TypeScript typing for improved code quality and maintainability.
- **Code Consistency:** Follow existing coding styles, naming conventions, and formatting.
- **Modularity:** Promote small, focused functions and modules.
- **Error Handling:** Implement robust error handling on both client and server sides.
- **Logging:** Ensure appropriate logging for debugging and monitoring.

### Backend (`apps/api`)
- **RESTful Principles:** Design API endpoints following RESTful conventions.
- **Validation:** Implement input validation for all incoming API requests (e.g., using Zod or similar).
- **Service Layer:** Separate business logic from controllers.
- **Database Transactions:** Use Prisma transactions for atomic operations where necessary.
- **Environment Variables:** Utilize `.env` files for sensitive configurations.

### Frontend (`apps/web`)
- **Component-Based Architecture:** Design reusable and modular React components.
- **State Management:** Use appropriate state management patterns (e.g., React Context, Zustand, or similar if introduced).
- **Accessibility (a11y):**