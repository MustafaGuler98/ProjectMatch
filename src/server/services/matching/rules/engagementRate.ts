import type { ScoringRule } from "../types";
import { ENGAGEMENT_THRESHOLDS } from "~/shared/constants";

export const engagementRate: ScoringRule = (campaign, creator) => {
    const reportedER = creator.engagementRate;

    let finalScore = 0;
    for (const t of ENGAGEMENT_THRESHOLDS) {
        if (reportedER >= t.min) {
            finalScore = t.score;
            break;
        }
    }

    return { label: "engagementRateScore", score: finalScore };
};
