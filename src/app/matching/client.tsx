"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FcSearch } from "react-icons/fc";
import { CampaignSelect } from "~/components/matching/campaign-select";
import { CampaignInfo } from "~/components/matching/campaign-info";
import { CreatorList } from "~/components/matching/creator-list";
import { Skeleton } from "~/components/ui/skeleton";

export default function MatchingClient() {
    const [campaignId, setCampaignId] = useState("");
    const { data: campaigns } = api.campaign.getAll.useQuery();
    const { data, isLoading } = api.campaign.getMatches.useQuery(
        { campaignId },
        { enabled: campaignId !== "" },
    );

    const selectedCampaign = campaigns?.find((c) => c.id === campaignId);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <FcSearch className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Campaign Matching
                    </h1>
                    <p className="text-sm text-slate-500">
                        Evaluate creator profiles against campaign criteria.
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-6">
                <div className="max-w-md">
                    <CampaignSelect value={campaignId} onValueChange={setCampaignId} />
                </div>
                {selectedCampaign && (
                    <CampaignInfo campaign={selectedCampaign} />
                )}
            </div>

            {campaignId && (
                <div className="mt-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-18 rounded-lg" />
                            ))}
                        </div>
                    ) : data ? (
                        <>
                            <p className="mb-3 text-sm font-medium text-slate-500">
                                Top 20 Matches
                            </p>
                            <CreatorList top20={data.top20} rest={data.rest} />
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
