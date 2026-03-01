import type { ScoringRule } from "../types";
import { WATCH_TIME_PASS_SCORE, WATCH_TIME_FAIL_PENALTY, WATCH_TIME_TOLERANCE } from "~/shared/constants";

export const watchTime: ScoringRule = (campaign, creator) => {
    const threshold = campaign.minAvgWatchTime;
    const actual = creator.avgWatchTime;

    let score: number;

    if (actual >= threshold) {
        score = WATCH_TIME_PASS_SCORE;
    } else {
        const ratio = (threshold - actual) / threshold;
        score = ratio <= WATCH_TIME_TOLERANCE ? 0 : WATCH_TIME_FAIL_PENALTY;
    }

    return { label: "watchTime", score };
};
