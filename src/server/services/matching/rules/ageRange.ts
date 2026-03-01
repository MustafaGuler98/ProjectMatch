import type { ScoringRule } from "../types";
import { AGE_RANGE_MATCH_SCORE } from "~/shared/constants";

export const ageRange: ScoringRule = (campaign, creator) => {
    const score =
        creator.audienceAgeRange === campaign.targetAgeRange ? AGE_RANGE_MATCH_SCORE : 0;

    return { label: "ageRangeMatch", score };
};
