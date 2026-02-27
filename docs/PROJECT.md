TABLE OF CONTENTS

PROJECT IDENTITY & SCOPE
TECHNICAL ARCHITECTURE & STACK
DIRECTORY STRUCTURE
DATABASE & DATA MANAGEMENT
CORE LOGIC & FEATURES
DEVELOPMENT WORKFLOW
DEPLOYMENT & DELIVERY

1. PROJECT IDENTITY & SCOPE

Core Requirements:

1- Campaign Matching Engine:
Implement an endpoint that ranks the Top 20 creators for a given campaign.
Develop a transparent and "explainable" scoring logic based on multiple criteria (niche, audience, engagement, etc.).
Return a detailed scoreBreakdown for each creator.

2- AI Brief Generator:
Implement a procedure to generate personalized outreach messages, content ideas, and hook suggestions.
Ensure the AI returns strict JSON output validated against a schema.
Handle malformed AI responses with a retry/repair mechanism.
Cache AI outputs per campaign and creator to avoid redundant API calls.

Technical Expectations:
Clean Architecture: Strict separation of concerns between UI, API, business logic, and data layers.
Robust Error Handling: Predictable and user-friendly error management.
Cost Awareness: Efficient use of resources, particularly by avoiding repeated LLM calls.


2. TECHNICAL ARCHITECTURE & STACK

Framework & Language: Next.js (App Router) & TypeScript
API Layer: tRPC
Database: PostgreSQL (via Supabase)
ORM: Prisma
AI Integration: google AI Studio
Validation: Zod
UI & Styling: Tailwind CSS & Shadcn/UI
Deployment: Vercel

3. DIRECTORY STRUCTURE

The project follows a Layered Architecture inspired by the T3 Stack standard to ensure a clear separation of concerns between the presentation, API, and business logic layers.

PROJECTMATCH/
├── docs/                   # -> Project Documentation
├── prisma/                 # -> Prisma ORM Schema & Migrations
├── public/                 # -> Static Assets (Images, Icons)
├── src/
│   ├── app/                # -> [Frontend] Next.js App Router (Pages & Layouts)
│   ├── components/         # -> [Frontend] Reusable UI Components (Shadcn)
│   ├── server/             # -> [Backend] All Server-Side Logic
│   │   ├── api/            #    -> API Layer (tRPC Routers)
│   │   ├── services/       #    -> Business Logic (Scoring Engine, AI Service)
│   │   └── db.ts           #    -> Database Client (Prisma Singleton)
│   └── shared/             # -> [Common] Code shared by Frontend & Backend
│       ├── schemas.ts      #    -> Zod validation schemas
│       └── constants.ts    #    -> Message constants, scoring weights
├── .env.example            # -> Environment variables template
└── README.md               # -> Setup instructions

4. DATABASE & DATA MANAGEMENT

Schema Design:
The core tables (Campaign, Creator) are structured to directly map the data provided in the campaigns.json and creators.json files.
A dedicated Cache table is used to store AI-generated responses, fulfilling the project's caching requirement.

Connection Strategy:
To manage the connection limits of Supabase's free tier in a serverless environment, a dual-URL strategy is employed:

Pooler URL: Used by the running application for all runtime queries to prevent connection exhaustion.
Direct URL: Used exclusively for one-off CLI tasks like database migrations and running the seed script.

Data Seeding: A custom seed.ts script is included to automate the initial data population. It reads the provided JSON files and uses Prisma Client to insert the records into the database, ensuring a consistent and repeatable setup.


5. CORE LOGIC & FEATURES

Campaign Matching Engine:
To ensure the scoring logic is transparent and "explainable" as required, a Rule-Based Approach (Strategy Pattern) is implemented.
Each matching criterion (Niche Relevance, Audience Country, Engagement Rate, etc.) is encapsulated in its own isolated rule function.
The main engine processes a creator through this pipeline of rules to calculate a final score and a detailed scoreBreakdown. This design makes the scoring weights easy to read, modify, and extend with new rules in the future.

AI Brief Generator:
A multi-layered strategy is used to guarantee robust and reliable AI responses.
Strict JSON Output: The AI provider is configured to use its native JSON mode, which prevents conversational text and ensures the response is a valid JSON string.
Schema Validation: Upon receiving the response, it is parsed and validated against a predefined Zod schema. This guarantees that the JSON structure and data types match the application's expectations.
Auto-Retry Mechanism: A try/catch block is wrapped around the Zod validation. If parsing fails, the system automatically makes a second call to the AI, providing the specific validation error and instructing the model to correct its output.

Error Handling:
The application uses a centralized error handling strategy.
All backend errors are thrown as standard TRPCError instances.
Error messages are stored in a central messages.ts file to avoid hardcoded strings and ensure consistency across the API.


6. DEVELOPMENT WORKFLOW

Phase 1: Infrastructure & Data Setup:
Setup Next.js, tRPC, and Supabase.
Define the Prisma schema for tables.
Implement the seed.ts script to populate the database with initial data.

Phase 2: Logic Implementation (Service Layer):
Build the ScoringService and its rule functions (matching logic) first, ensuring the core algorithm is testable and isolated from the UI.
Implement the AIService and its retry mechanism for generating briefs.

Phase 3: API & Connectivity (tRPC Layer):
Create tRPC routers to expose the verified backend logic to the frontend in a type-safe manner.

Phase 4: User Interface (UI Layer):
Build the frontend components using Shadcn/UI and connect them to the tRPC endpoints.

Phase 5: Deployment (Time Permitting):
Deploy the application to Vercel to allow for immediate review and testing without local environment configuration. This step is contingent on completing the core requirements within the allocated time-box.

7. DEPLOYMENT & DELIVERY

Environment Variables: Sensitive keys (Database URLs, API Keys) are managed strictly via .env files and are never committed to version control.

Local Setup: A .env.example file is provided in the repository root, serving as a template for required configuration keys.

Source Code: The primary deliverable is the GitHub Repository, containing the full source code, documentation, and setup instructions (README.md).

Live Demo: A live version of the application hosted on Vercel. This allows for immediate testing of the Matching Engine and AI generation features without requiring local environment setup.