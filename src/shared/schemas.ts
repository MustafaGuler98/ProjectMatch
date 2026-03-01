import { z } from "zod";

export const getMatchesInput = z.object({
    campaignId: z.string(),
});
