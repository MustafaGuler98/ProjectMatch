import { z } from "zod";

export const getMatchesInput = z.object({
    campaignId: z.string(),
});

export const getBriefInput = z.object({
    campaignId: z.string(),
    creatorId: z.string(),
});
