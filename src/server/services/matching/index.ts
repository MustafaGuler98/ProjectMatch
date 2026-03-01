import type { Campaign } from "@prisma/client";
import type { CreatorWithPosts, RankedCreator, ScoreBreakdown, ScoringRule } from "./types";

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
import { postEngagement } from "./rules/postEngagement";

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
    postEngagement,
];

export function scoreCreators(
    campaign: Campaign,
    creators: CreatorWithPosts[],
): RankedCreator[] {
    const results: RankedCreator[] = creators.map((creator) => {
        const breakdown: Record<string, number> = {};
        let totalScore = 0;

        for (const rule of rules) {
            const result = rule(campaign, creator);
            breakdown[result.label] = result.score;
            totalScore += result.score;
        }

        return {
            creatorId: creator.id,
            username: creator.username,
            totalScore,
            scoreBreakdown: breakdown as unknown as ScoreBreakdown,
        };
    });

    // Sort descending by totalScore
    results.sort((a, b) => b.totalScore - a.totalScore);

    return results;
}
