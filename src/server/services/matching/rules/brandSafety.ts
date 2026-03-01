import type { ScoringRule } from "../types";
import { BRAND_SAFETY_PER_FLAG_PENALTY } from "~/shared/constants";

export const brandSafety: ScoringRule = (campaign, creator) => {
    const flagCount = creator.brandSafetyFlags.length;
    const score = flagCount * BRAND_SAFETY_PER_FLAG_PENALTY;

    return { label: "brandSafetyPenalty", score };
};
