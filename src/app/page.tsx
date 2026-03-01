import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold">PROJECTMATCH</h1>
        <p className="text-muted-foreground mt-2">
          Project setup is complete. Ready for development.
        </p>
      </main>
    </HydrateClient>
  );
}