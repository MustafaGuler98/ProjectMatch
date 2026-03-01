# Trade-offs & Development Notes

## 1. Database Connection Strategy: Single URL vs. Dual URL (Pooler + Direct)

**Context:** When working with Supabase and Prisma in a serverless environment (like Vercel), it's often recommended to use a dual-URL strategy: a `Pooler` URL for runtime queries (to prevent connection exhaustion) and a `Direct` URL for migrations.
**Trade-off Made:** I initially planned a dual-URL strategy but ultimately decided to simplify and use a **Single Connection URL**.
**Reasoning:**
While a connection pooler is a best practice for production apps under heavy load, this project is a technical assignment that will only be accessed by a few reviewers simultaneously. Setting up and debugging connection pooling introduces unnecessary complexity and configuration overhead for an environment that will never hit Supabase's connection limits. Choosing a single URL reduces friction, speeds up development, and avoids "over-engineering" a solution for a problem that doesn't exist at this scale.

## 2. Database Design: Strict Normalization vs JSONB Columns

**Context:** The `creators.json` dataset includes nested arrays and objects, particularly for the `audience` and `lastPosts` data. Prisma supports using `Json` data types in PostgreSQL to store these directly.
**Trade-off Made:** Instead of taking the fast route and storing nested data as JSONB, I chose to **fully normalize** the schema (creating separate relational tables and columns).
**Reasoning:**
While using JSONB columns saves time during initial setup and seeding, it undermines the principles of good database design. Normalizing the data—such as extracting `lastPosts` into a dedicated One-to-Many `Post` table and flattening `audience` data into explicit scalar columns—demonstrates a commitment to scalable, relational architecture and robust typing.

## 3. Database Seeding: Idempotency vs Clean-Slate

**Context:** The `seed.ts` script populates the database using the provided JSON files.
**Trade-off Made:** I implemented an **idempotent** seed script using Prisma's `upsert` mechanism.
**Reasoning:**
Since the assignment requires setup instructions for reviewers who will independently build and test the project, there is a high likelihood the seed script could be run multiple times. An idempotent script—which safely updates existing records without causing Primary Key conflict errors or duplicating relational data ensures a foolproof setup experience. While an upsert script is slightly more verbose to write, the trade-off significantly improves reliability and developer experience by eliminating the risk of accidental database corruption during the evaluation process.
