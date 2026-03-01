import type { ScoringRule } from "../types";
import { COUNTRY_SINGLE_MATCH_SCORE, COUNTRY_MULTI_MATCH_SCORE } from "~/shared/constants";

export const audienceCountry: ScoringRule = (campaign, creator) => {
    const target = campaign.targetCountry;
    const countries = creator.audienceCountries;
    const hasMatch = countries.includes(target);

    let score = 0;
    if (hasMatch) {
        score = countries.length === 1 ? COUNTRY_SINGLE_MATCH_SCORE : COUNTRY_MULTI_MATCH_SCORE;
    }

    return { label: "audienceCountryMatch", score };
};
