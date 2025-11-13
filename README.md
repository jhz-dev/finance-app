# FinanSync

FinanSync is a full-stack application for personal finance management. It allows users to track their finances, create budgets, and share them with others with specific permissions.

## Project Structure

This project is a mono-repo using npm workspaces. The two primary packages are:

- `apps/api`: The back-end application (Node.js, Express, TypeScript, Prisma).
- `apps/web`: The front-end application (React, Vite, TypeScript, Tailwind CSS).

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Docker
- npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd FinanSync
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the `.env.example` files in `apps/api` and `apps/web` to `.env` and fill in the required values.

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start the database:**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations:**

   ```bash
   npm run db:migrate --workspace=apps/api
   ```

6. **Seed the database:**

   ```bash
   npm run db:seed --workspace=apps/api
   ```

### Running the Application

- **Back-end (API):**

  ```bash
  npm run dev:api
  ```

- **Front-end (Web):**

  ```bash
  npm run dev:web
  ```

The front-end will be available at `http://localhost:4000/` and the back-end at `http://localhost:3000`.

## How to Link the Apps

The frontend and backend are already linked. The frontend (`apps/web`) makes API calls to the backend (`apps/api`) at the URL specified in `apps/web/.env.example`.

By default, the frontend connects to the backend at `http://localhost:3000`.

## How to Update Linting Rules

The project uses Biome for linting and formatting. The configuration can be found in the `biome.json` file at the root of the project. To update the rules, modify this file and then run `npm run lint:fix` to apply the changes.