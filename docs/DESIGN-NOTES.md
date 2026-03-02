# Design Notes & Future Improvements

## Trade-offs

### 1. Database Connection Strategy: Single URL vs. Dual URL

**Context:** Supabase and Prisma in a serverless environment (like Vercel) often recommend a dual-URL strategy: a Pooler URL for runtime queries and a Direct URL for migrations.
**Trade-off Made:** I simplified the infrastructure by using a Single Connection URL.
**Reasoning:** While connection pooling is a best practice for production apps under heavy load, this assignment has limited traffic. Setting up connection pooling introduces unnecessary complexity and configuration overhead for an environment that will never hit connection limits. A single URL reduces friction and speeds up reviewer setup.

### 2. Database Design: Strict Normalization vs. JSONB Columns

**Context:** The mock dataset includes arrays and nested objects, such as `lastPosts`. Prisma supports storing these natively as `Json` types.
**Trade-off Made:** Instead of taking the faster route with JSONB data dumps, I strictly normalized the relational schema.
**Reasoning:** Using JSONB saves setup time but undermines relational query capabilities. Normalizing data—like extracting `lastPosts` into a One-to-Many `Post` table—demonstrates a commitment to scalable architecture and strong, type-safe data modeling.

### 3. Database Seeding: Idempotency vs. Clean-Slate

**Context:** The `seed.ts` script populates the database using provided JSON files.
**Trade-off Made:** I implemented an idempotent seed script utilizing Prisma's `upsert` mechanism.
**Reasoning:** Because reviewers will independently build and test the project, the seed script might be run multiple times. An idempotent script safely updates existing records without causing Primary Key conflicts or duplicating rows, ensuring a foolproof local setup experience.

### 4. Matching Engine: In-Memory Computation vs. Database Queries

**Context:** The engine currently calculates match scores for all creators entirely in-memory using JavaScript arrays and `.map()`.
**Trade-off Made:** I kept the scoring logic at the application layer rather than moving it to Prisma/SQL queries or a search engine like Elasticsearch.
**Reasoning:** With the assignment's dataset of 1,900 creators, an in-memory `O(N)` calculation executes extremely fast (in milliseconds) and is much simpler to test and debug. 

### 5. Scoring Metrics: Reported ER vs. Computed ER

**Context:** The creator data contains both a reported `engagementRate` and a list of `lastPosts`.
**Trade-off Made:** The engine scores the creator based entirely on the explicitly reported `engagementRate`, rather than attempting to compute an alternative value from the raw `likes` / `views` of recent posts.
**Reasoning:** While computing the value from raw data might seem mathematically superior, analysis of the mock artifact revealed highly unrealistic disconnects between generated post metrics and the assigned `engagementRate`. Relying on the reported profile field provided much more stable and accurate ranking signals across the dataset.

### 6. AI Generation: Synchronous Rendering vs. Queues

**Context:** Generating an outreach brief requires a relatively slow call to the LLM.
**Trade-off Made:** The AI brief generator is built as a standard synchronous API endpoint (the user clicks generate and waits for the request to complete).
**Reasoning:** Implementing asynchronous background job queues (like Redis/BullMQ) is overkill for the current technical scope. Synchronous requests are sufficient to demonstrate the AI integration capability.

---

## Potential Improvements

If deployed in a true production environment or if more time were allotted, the following features would be prioritized:

### 1. Streaming AI Output (SSE)

Currently, users must wait 5-10 seconds for the complete JSON payload from the AI model. Implementing Server-Sent Events (SSE) or React Server Components to stream the AI output token-by-token would dramatically improve the perceived performance and user experience.

### 2. SQL-level Pre-filtering

Before bringing the entire creators table into Node.js memory for scoring, the system could utilize Prisma queries to eliminate immediate mismatches (e.g., completely filtering out creators who have zero audience presence in the campaign's target country). This would drastically reduce the size of the array evaluated by the O(N) JavaScript scoring loop.

### 3. Result Pagination

The matching engine currently returns the top 20 scoring creators at once. As the platform scales, implementing offset or cursor-based pagination (e.g., "Load More Matches") would improve the frontend UX when browsing extended match results.
