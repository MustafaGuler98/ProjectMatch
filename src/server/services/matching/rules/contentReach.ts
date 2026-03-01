import type { ScoringRule } from "../types";
import { REACH_THRESHOLDS, REACH_BELOW_PENALTY } from "~/shared/constants";
import { CREATOR_NO_POSTS } from "~/shared/messages";

export const contentReach: ScoringRule = (campaign, creator) => {
    const posts = creator.posts;

    if (posts.length === 0) {
        throw new Error(CREATOR_NO_POSTS(creator.id));
    }

    const avgViews = posts.reduce((sum, p) => sum + p.views, 0) / posts.length;
    const reachRatio = avgViews / creator.followers;

    // Walk thresholds from highest to lowest
    for (const band of REACH_THRESHOLDS) {
        if (reachRatio >= band.min) {
            return { label: "contentReach", score: band.score };
        }
    }

    return { label: "contentReach", score: REACH_BELOW_PENALTY };
};
