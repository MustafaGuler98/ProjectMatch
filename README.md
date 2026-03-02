# AI Full Stack Developer Technical Assignment

This repository contains the implementation of a technical assignment.

The goal of this assignment is to build a platform that matches brands with content creators based on specific campaign criteria, and to utilize AI to generate personalized outreach briefs.

## Local Setup

Follow these instructions to run the project locally for review.

### 1. Prerequisites

- Node.js (v18.x or higher)
- npm or pnpm
- A running PostgreSQL database instance (e.g., Supabase)
- AI API Key (Ai Studio, Gemini)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository_url>
cd project-match
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update your `.env` file with the necessary credentials:

```env

DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"

GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Database Initialization

Push the Prisma schema to your database and seed it with the provided mock data (campaigns and creators):

```bash
npx prisma db push
npm run db:seed
```

### 5. Running the Application

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

