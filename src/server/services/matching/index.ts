import type { Campaign } from "@prisma/client";
import type { CreatorWithPosts, RankedCreator, ScoreBreakdown, ScoringRule } from "./types";
import { CREATOR_SCORING_FAILED } from "~/shared/messages";

import { nicheRelevance } from "./rules/nicheRelevance";
import { audienceCountry } from "./rules/audienceCountry";
import { genderFit } from "./rules/genderFit";
import { ageRange } from "./rules/ageRange";
import { watchTime } from "./rules/watchTime";
import { followerFit } from "./rules/followerFit";
import { hookType } from "./rules/hookType";
import { contentStyle } from "./rules/contentStyle";
import { contentReach } from "./rules/contentReach";
import { brandSafety } from "./rules/brandSafety";
import { engagementRate } from "./rules/engagementRate";

const rules: ScoringRule[] = [
    nicheRelevance,
    audienceCountry,
    genderFit,
    ageRange,
    watchTime,
    followerFit,
    hookType,
    contentStyle,
    contentReach,
    brandSafety,
    engagementRate,
];

export function scoreCreators(
    campaign: Campaign,
    creators: CreatorWithPosts[],
): RankedCreator[] {
    const results: RankedCreator[] = creators.flatMap((creator) => {
        try {
            const breakdown: Record<string, number> = {};
            let totalScore = 0;

            for (const rule of rules) {
                const result = rule(campaign, creator);
                breakdown[result.label] = result.score;
                totalScore += result.score;
            }

            return [
                {
                    creatorId: creator.id,
                    username: creator.username,
                    totalScore,
                    scoreBreakdown: breakdown as unknown as ScoreBreakdown,
                },
            ];
        } catch (error) {
            console.error(CREATOR_SCORING_FAILED(creator.id), error);
            return [];
        }
    });

    // Sort descending by totalScore
    results.sort((a, b) => b.totalScore - a.totalScore);

    return results;
}
