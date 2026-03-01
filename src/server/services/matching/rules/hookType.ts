import type { ScoringRule } from "../types";
import { HOOK_MATCH_SCORE } from "~/shared/constants";

export const hookType: ScoringRule = (campaign, creator) => {
    const score = campaign.preferredHookTypes.includes(creator.primaryHookType)
        ? HOOK_MATCH_SCORE
        : 0;

    return { label: "hookMatch", score };
};
