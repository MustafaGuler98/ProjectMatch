"use client";

import { useState } from "react";
import { CreatorCard } from "./creator-card";
import { CreatorDetail } from "./creator-detail";
import { Button } from "~/components/ui/button";

interface ScoreBreakdown {
    nicheMatch: number;
    audienceCountryMatch: number;
    genderFit: number;
    ageRangeMatch: number;
    watchTime: number;
    followerFit: number;
    hookMatch: number;
    contentStyleFit: number;
    contentReach: number;
    brandSafetyPenalty: number;
    postEngagementPenalty: number;
}

interface RankedCreator {
    creatorId: string;
    username: string;
    totalScore: number;
    scoreBreakdown: ScoreBreakdown;
}

interface CreatorGridProps {
    top20: RankedCreator[];
    rest: RankedCreator[];
}

export function CreatorGrid({ top20, rest }: CreatorGridProps) {
    const [selectedCreator, setSelectedCreator] = useState<RankedCreator | null>(null);
    const [showRest, setShowRest] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {top20.map((creator) => (
                    <CreatorCard
                        key={creator.creatorId}
                        {...creator}
                        onClick={() => setSelectedCreator(creator)}
                    />
                ))}
            </div>

            {rest.length > 0 && (
                <div className="mt-6">
                    {!showRest ? (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowRest(true)}
                        >
                            Show Remaining {rest.length} Creators
                        </Button>
                    ) : (
                        <>
                            <p className="mb-3 text-sm font-medium text-slate-500">
                                Remaining Creators
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {rest.map((creator) => (
                                    <CreatorCard
                                        key={creator.creatorId}
                                        {...creator}
                                        onClick={() => setSelectedCreator(creator)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <CreatorDetail
                open={!!selectedCreator}
                onOpenChange={(open) => {
                    if (!open) setSelectedCreator(null);
                }}
                creator={selectedCreator}
            />
        </>
    );
}
