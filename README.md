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

### Running the Application

- **Back-end (API):**

  ```bash
  npm run dev --workspace=apps/api
  ```

- **Front-end (Web):**

  ```bash
  npm run dev --workspace=apps/web
  ```

The front-end will be available at `http://localhost:4000/` and the back-end at `http://localhost:3000`.
