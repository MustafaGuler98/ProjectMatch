Architectural Decision Records

Context
This document outlines the core architectural decisions I made for a technical assignment. The goal is to deliver a functional, scalable, and clean solution within the timeframe while fulfilling all the requirements specified in the brief.

Decision 1: Framework & Architecture Layout
Decision: Next.js (App Router) using a Layered Directory Structure (app, components, server/api, server/services).
Reason: The assignment requires clean architecture and separation of concerns. This folder structure naturally separates routing, UI, API, and business logic without over-engineering the Next.js environment.

Decision 2: API Layer
Decision: tRPC.
Reason: It was explicitly stated as the preferred API layer in the assignment brief. Additionally, it provides great end-to-end type safety between the Next.js backend and frontend.

Decision 3: Database & ORM
Decision: Supabase (PostgreSQL) + Prisma ORM.
Reason: Supabase was preferred in the brief. I added Prisma because its code-first approach and type safety. Note: I configured separate Session and Pooler URLs to avoid Supabase's free tier connection limits in a serverless setup.

Decision 4: Data Initialization
Decision: A custom seed.ts script.
Reason: Instead of manually importing the provided campaigns.json and creators.json files, a seed script allows anyone reviewing the project to populate the database.

Decision 5: Scoring Engine Implementation
Decision: Backend Service Layer using a Rule-Based Approach (Strategy Pattern).
Reason: The brief asks for "explainable matching logic". Writing the algorithm in TypeScript services using individual rule functions makes the scoring weights transparent, easy to tweak, and highly readable.

Decision 6: AI Provider
Decision: Google AI Studio
Reason: It offers a generous free tier while providing fast responses and native support for strict JSON outputs.

Decision 7: AI Output Validation & Repair Mechanism
Decision: Zod Validation + Try/Catch Retry Logic.
Reason: To satisfy the strict JSON and schema validation requirements. If Zod parsing fails, the catch block intercepts the specific Zod error and makes a second AI call, asking the model to fix its mistake.

Decision 8: AI Caching Strategy
Decision: Database-level caching (ai_brief_cache table with a JSONB column).
Reason: To fulfill the requirement of caching outputs per campaign + creator. Using Postgres for this is sufficient and avoids the unnecessary overhead.

Decision 9: Error Handling
Decision: Centralized messages.ts and TRPCError.
Reason: To avoid hardcoded magic strings and provide predictable, consistent HTTP error codes and messages across the application.

Decision 10: Deployment & Delivery
Decision: GitHub Repository + Live Vercel Deployment.
Reason: While I provide a .env.example and instructions for local setup, deploying a live demo allows the reviewers to immediately test the matching engine and AI integration without needing to configure their own API keys and database locally.