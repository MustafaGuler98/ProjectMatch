import { api, HydrateClient } from "~/trpc/server";
import MatchingClient from "./client";

export default async function MatchingPage() {
    // Prefetch the campaigns list so the dropdown loads instantly
    void api.campaign.getAll.prefetch();

    return (
        <HydrateClient>
            <MatchingClient />
        </HydrateClient>
    );
}
