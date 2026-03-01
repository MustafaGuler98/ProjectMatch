import type { ScoringRule } from "../types";
import { CONTENT_STYLE_MATCH_SCORE, OBJECTIVE_TO_STYLE_MAP } from "~/shared/constants";

export const contentStyle: ScoringRule = (campaign, creator) => {
    const compatibleStyles = OBJECTIVE_TO_STYLE_MAP[campaign.objective] ?? [];
    const score = compatibleStyles.includes(creator.contentStyle)
        ? CONTENT_STYLE_MATCH_SCORE
        : 0;

    return { label: "contentStyleFit", score };
};
