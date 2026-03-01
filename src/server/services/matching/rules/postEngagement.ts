import type { ScoringRule } from "../types";
import { ENGAGEMENT_DEVIATION_BANDS, ENGAGEMENT_EXTREME_PENALTY } from "~/shared/constants";
import { CREATOR_NO_POSTS, CREATOR_ZERO_VIEWS, CREATOR_ZERO_ENGAGEMENT } from "~/shared/messages";

export const postEngagement: ScoringRule = (campaign, creator) => {
    const posts = creator.posts;

    if (posts.length === 0) {
        throw new Error(CREATOR_NO_POSTS(creator.id));
    }

    // Compute real engagement from post data
    const ratios = posts.map((p) => {
        if (p.views === 0) {
            throw new Error(CREATOR_ZERO_VIEWS(creator.id));
        }
        return p.likes / p.views;
    });

    const computedER = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
    const reportedER = creator.engagementRate;

    if (reportedER === 0) {
        throw new Error(CREATOR_ZERO_ENGAGEMENT(creator.id));
    }

    const deviation = Math.abs(computedER - reportedER) / reportedER;

    // Walk deviation bands from tightest to widest
    for (const band of ENGAGEMENT_DEVIATION_BANDS) {
        if (deviation < band.maxDeviation) {
            return { label: "postEngagementPenalty", score: band.score };
        }
    }

    return { label: "postEngagementPenalty", score: ENGAGEMENT_EXTREME_PENALTY };
};
