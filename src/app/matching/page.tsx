import { api, HydrateClient } from "~/trpc/server";
import MatchingClient from "./client";

export const dynamic = "force-dynamic";

export default async function MatchingPage() {
    // Prefetch campaign list so the dropdown is instantly available
    void api.campaign.getAll.prefetch();

    return (
        <HydrateClient>
            <MatchingClient />
        </HydrateClient>
    );
}
