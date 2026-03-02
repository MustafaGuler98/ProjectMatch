import { api, HydrateClient } from "~/trpc/server";
import BriefClient from "./client";

export const dynamic = "force-dynamic";

export default async function BriefPage() {
    // Prefetch dropdown lists so they load instantly without flicker
    void api.campaign.getAll.prefetch();
    void api.creator.getAll.prefetch();

    return (
        <HydrateClient>
            <BriefClient />
        </HydrateClient>
    );
}
