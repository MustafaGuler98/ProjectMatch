import { Card, CardContent } from "~/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";

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

interface CreatorCardProps {
    creatorId: string;
    username: string;
    totalScore: number;
    scoreBreakdown: ScoreBreakdown;
    onClick: () => void;
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

function getScoreColor(score: number): string {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
}

function getInitialColor(username: string): string {
    const colors = [
        "bg-blue-100 text-blue-700",
        "bg-emerald-100 text-emerald-700",
        "bg-purple-100 text-purple-700",
        "bg-amber-100 text-amber-700",
        "bg-rose-100 text-rose-700",
        "bg-cyan-100 text-cyan-700",
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index]!;
}

export function CreatorCard({ username, totalScore, scoreBreakdown, onClick }: CreatorCardProps) {
    const initial = username.charAt(0).toUpperCase();

    return (
        <Card
            className="cursor-pointer bg-white transition-shadow hover:shadow-md"
            onClick={onClick}
        >
            <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${getInitialColor(username)}`}>
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                        @{username}
                    </p>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`text-xl font-bold tabular-nums ${getScoreColor(totalScore)}`}>
                            {totalScore}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="w-56">
                        <p className="mb-2 font-semibold text-xs">Score Breakdown</p>
                        <div className="space-y-1">
                            {Object.entries(scoreBreakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                    <span className="text-slate-400">
                                        {breakdownLabels[key as keyof ScoreBreakdown]}
                                    </span>
                                    <span className={value < 0 ? "text-red-400" : "text-slate-200"}>
                                        {value > 0 ? `+${value}` : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
