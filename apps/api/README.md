# FinanSync API

This is the back-end for the FinanSync application.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma
- MySQL
- JWT for authentication
- Zod for validation
- Nodemailer for emails

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Copy the `.env.example` file to `.env` and fill in the required values.

   ```bash
   cp .env.example .env
   ```

3. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

## API Endpoints

See the root `README.md` for a list of API endpoints.
