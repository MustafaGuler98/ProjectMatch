"use client";

import { useState } from "react";
import { CreatorDetail } from "./creator-detail";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

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

interface CreatorListProps {
    top20: RankedCreator[];
    rest: RankedCreator[];
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" {
    if (score >= 80) return "default"; 
    if (score >= 50) return "secondary";
    return "destructive";
}

function getScoreColorClass(score: number): string {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none";
    if (score >= 50) return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-none";
    return "bg-red-100 text-red-800 hover:bg-red-200 border-none";
}

export function CreatorList({ top20, rest }: CreatorListProps) {
    const [selectedCreator, setSelectedCreator] = useState<RankedCreator | null>(null);
    const [showRest, setShowRest] = useState(false);

    const renderTable = (creators: RankedCreator[], startIndex: number = 0) => (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-16 text-center font-semibold">Rank</TableHead>
                        <TableHead className="font-semibold">Creator</TableHead>
                        <TableHead className="text-right font-semibold">Match Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creators.map((creator, index) => {
                        const rank = startIndex + index + 1;

                        return (
                            <TableRow
                                key={creator.creatorId}
                                className="cursor-pointer transition-colors hover:bg-slate-50"
                                onClick={() => setSelectedCreator(creator)}
                            >
                                <TableCell className="text-center font-medium text-slate-500">
                                    #{rank}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">
                                    @{creator.username}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={getScoreColorClass(creator.totalScore)}>
                                        {creator.totalScore} pts
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderTable(top20, 0)}

            {rest.length > 0 && (
                <div>
                    {!showRest ? (
                        <Button
                            variant="outline"
                            className="w-full text-slate-600 bg-white hover:bg-slate-50"
                            onClick={() => setShowRest(true)}
                        >
                            Show Remaining {rest.length} Creators
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-500">
                                Remaining Creators
                            </p>
                            {renderTable(rest, 20)}
                        </div>
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
        </div>
    );
}
