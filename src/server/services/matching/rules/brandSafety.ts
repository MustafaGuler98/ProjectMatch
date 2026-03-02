import type { ScoringRule } from "../types";
import { BRAND_SAFETY_PER_FLAG_PENALTY } from "~/shared/constants";

export const brandSafety: ScoringRule = (campaign, creator) => {
    const forbiddenWords = campaign.doNotUseWords.map((w) => w.toLowerCase());

    if (forbiddenWords.length === 0) {
        return { label: "brandSafetyPenalty", score: 0 };
    }

    const matchingFlags = creator.brandSafetyFlags.filter((flag) => {
        const lowerFlag = flag.toLowerCase();
        return forbiddenWords.some((word) => lowerFlag.includes(word));
    });

    const score = matchingFlags.length * BRAND_SAFETY_PER_FLAG_PENALTY;

    return { label: "brandSafetyPenalty", score };
};
