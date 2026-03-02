"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FcIdea } from "react-icons/fc";
import { CampaignSelect } from "~/components/matching/campaign-select";
import { CreatorSelect } from "~/components/brief/creator-select";
import { BriefResult } from "~/components/brief/brief-result";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";

export default function BriefClient() {
    const [campaignId, setCampaignId] = useState("");
    const [creatorId, setCreatorId] = useState("");
    const [shouldFetch, setShouldFetch] = useState(false);

    const { data, isLoading, error } = api.creator.getBrief.useQuery(
        { campaignId, creatorId },
        { enabled: shouldFetch && campaignId !== "" && creatorId !== "" },
    );

    const handleGenerate = () => {
        if (campaignId && creatorId) {
            setShouldFetch(true);
        }
    };

    const handleCampaignChange = (value: string) => {
        setCampaignId(value);
        setShouldFetch(false);
    };

    const handleCreatorChange = (value: string) => {
        setCreatorId(value);
        setShouldFetch(false);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <FcIdea className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Brief Generator
                    </h1>
                    <p className="text-sm text-slate-500">
                        Compile outreach content and directives for selected creators.
                    </p>
                </div>
            </div>

            {/* Controls: horizontal top bar */}
            <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        Campaign
                    </label>
                    <CampaignSelect value={campaignId} onValueChange={handleCampaignChange} />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        Creator
                    </label>
                    <CreatorSelect value={creatorId} onValueChange={handleCreatorChange} />
                </div>
                <Button
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6"
                    disabled={!campaignId || !creatorId || isLoading}
                    onClick={handleGenerate}
                >
                    {isLoading ? "Generating..." : "Generate Brief"}
                </Button>
            </div>

            {/* Results: full width */}
            <div className="mt-8">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-48 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                    </div>
                ) : error ? (
                    <Card className="bg-white border-red-200">
                        <CardContent className="p-4 text-sm text-red-600">
                            {error.message}
                        </CardContent>
                    </Card>
                ) : data ? (
                    <BriefResult data={data} />
                ) : (
                    <Card className="bg-white">
                        <CardContent className="flex items-center justify-center p-12 text-sm text-slate-400">
                            Select a campaign and creator, then click &quot;Generate Brief&quot;
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

