import type { ScoringRule } from "../types";
import { MAX_GENDER_SCORE } from "~/shared/constants";

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

export const genderFit: ScoringRule = (campaign, creator) => {
    const target = campaign.targetGender;

    if (target === "all") {
        return { label: "genderFit", score: MAX_GENDER_SCORE };
    }

    const targetValue = target === "female" ? creator.audienceFemale : creator.audienceMale;
    const total = creator.audienceFemale + creator.audienceMale;

    if (total === 0) {
        return { label: "genderFit", score: 0 };
    }

    const raw = Math.floor((targetValue / total) * MAX_GENDER_SCORE);
    const score = clamp(raw, 0, MAX_GENDER_SCORE);

    return { label: "genderFit", score };
};
