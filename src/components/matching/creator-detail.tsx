import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "~/components/ui/sheet";

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

interface CreatorDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    creator: {
        creatorId: string;
        username: string;
        totalScore: number;
        scoreBreakdown: ScoreBreakdown;
    } | null;
}

const breakdownLabels: Record<keyof ScoreBreakdown, string> = {
    nicheMatch: "Niche Match",
    audienceCountryMatch: "Audience Country",
    genderFit: "Gender Fit",
    ageRangeMatch: "Age Range",
    watchTime: "Watch Time",
    followerFit: "Follower Fit",
    hookMatch: "Hook Match",
    contentStyleFit: "Content Style",
    contentReach: "Content Reach",
    brandSafetyPenalty: "Brand Safety",
    postEngagementPenalty: "Post Engagement",
};

const maxScores: Record<keyof ScoreBreakdown, number> = {
    nicheMatch: 30,
    audienceCountryMatch: 20,
    genderFit: 15,
    ageRangeMatch: 10,
    watchTime: 15,
    followerFit: 15,
    hookMatch: 15,
    contentStyleFit: 10,
    contentReach: 20,
    brandSafetyPenalty: 10,
    postEngagementPenalty: 20,
};

export function CreatorDetail({ open, onOpenChange, creator }: CreatorDetailProps) {
    if (!creator) return null;

    const baseScore =
        creator.scoreBreakdown.nicheMatch +
        creator.scoreBreakdown.audienceCountryMatch +
        creator.scoreBreakdown.genderFit +
        creator.scoreBreakdown.ageRangeMatch +
        creator.scoreBreakdown.watchTime +
        creator.scoreBreakdown.followerFit +
        creator.scoreBreakdown.hookMatch +
        creator.scoreBreakdown.contentStyleFit +
        creator.scoreBreakdown.contentReach;

    const penaltyScore =
        creator.scoreBreakdown.brandSafetyPenalty +
        creator.scoreBreakdown.postEngagementPenalty;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-slate-50 border-l border-slate-200">
                <SheetHeader className="pb-6">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        @{creator.username}
                    </SheetTitle>
                    <SheetDescription>
                        Detailed breakdown of campaign match indicators.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Final Score</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-5xl font-black text-slate-900 leading-none">
                                    {creator.totalScore}
                                </span>
                                <span className="text-lg font-bold text-slate-400">/150</span>
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium">
                            <p className="text-emerald-600">Base: +{baseScore}</p>
                            {penaltyScore < 0 && <p className="text-red-500">Penalties: {penaltyScore}</p>}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h4 className="font-semibold text-slate-900 border-b pb-2">Score Components</h4>

                        <div className="grid grid-cols-1 gap-y-3">
                            {(Object.entries(creator.scoreBreakdown) as [keyof ScoreBreakdown, number][])
                                .sort((a, b) => b[1] - a[1])
                                .map(([key, value]) => {
                                    const isPenalty = value < 0;
                                    const isZero = value === 0;
                                    const maxVal = maxScores[key];
                                    const percentageWidth = isZero ? 0 : Math.min((Math.abs(value) / maxVal) * 100, 100);

                                    return (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-700">
                                                    {breakdownLabels[key]}
                                                    <span className="text-xs text-slate-400 ml-1">/ {maxVal}</span>
                                                </span>
                                                <span className={`font-bold tabular-nums ${isPenalty ? "text-red-600" : isZero ? "text-slate-400" : "text-emerald-600"}`}>
                                                    {value > 0 ? `+${value}` : value}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isPenalty ? "bg-red-500" : isZero ? "bg-slate-200" : "bg-emerald-500"}`}
                                                    style={{ width: `${isZero ? 0 : percentageWidth}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
