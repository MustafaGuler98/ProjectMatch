import type { ScoringRule } from "../types";
import { MAX_NICHE_SCORE, PARTIAL_NICHE_SCORE } from "~/shared/constants";

export const nicheRelevance: ScoringRule = (campaign, creator) => {
    const campaignNiches = campaign.niches;
    const creatorNiches = creator.niches;

    const matchCount = campaignNiches.filter((n) => creatorNiches.includes(n)).length;

    let score = 0;
    if (matchCount === campaignNiches.length) {
        score = MAX_NICHE_SCORE;
    } else if (matchCount > 0) {
        score = PARTIAL_NICHE_SCORE;
    }

    return { label: "nicheMatch", score };
};
