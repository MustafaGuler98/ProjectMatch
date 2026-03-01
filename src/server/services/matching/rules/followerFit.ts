import type { ScoringRule } from "../types";
import { FOLLOWER_FIT_SCORE, FOLLOWER_FIT_PENALTY, FOLLOWER_FIT_TOLERANCE } from "~/shared/constants";

export const followerFit: ScoringRule = (campaign, creator) => {
    const min = campaign.minFollowers;
    const max = campaign.maxFollowers;
    const followers = creator.followers;

    // Within range
    if (followers >= min && followers <= max) {
        return { label: "followerFit", score: FOLLOWER_FIT_SCORE };
    }

    // Check tolerance zone (within 20% outside)
    const lowerBound = min * (1 - FOLLOWER_FIT_TOLERANCE);
    const upperBound = max * (1 + FOLLOWER_FIT_TOLERANCE);

    if (followers >= lowerBound && followers <= upperBound) {
        return { label: "followerFit", score: 0 };
    }

    return { label: "followerFit", score: FOLLOWER_FIT_PENALTY };
};
