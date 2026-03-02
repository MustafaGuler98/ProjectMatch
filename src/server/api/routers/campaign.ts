import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getMatchesInput } from "~/shared/schemas";
import { scoreCreators } from "~/server/services/matching";
import { TOP_RESULTS_COUNT } from "~/shared/constants";
import { CAMPAIGN_NOT_FOUND } from "~/shared/messages";

export const campaignRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) =>
        ctx.db.campaign.findMany({
            select: {
                id: true,
                brand: true,
                objective: true,
                targetCountry: true,
                targetGender: true,
                targetAgeRange: true,
                niches: true,
                preferredHookTypes: true,
                minFollowers: true,
                maxFollowers: true,
                tone: true,
                doNotUseWords: true,
            },
        }),
    ),

    getMatches: publicProcedure
        .input(getMatchesInput)
        .query(async ({ ctx, input }) => {
            // Fetch campaign
            const campaign = await ctx.db.campaign.findUnique({
                where: { id: input.campaignId },
            });

            if (!campaign) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: CAMPAIGN_NOT_FOUND(input.campaignId),
                });
            }

            // Fetch all creators with their posts
            const creators = await ctx.db.creator.findMany({
                include: { posts: true },
            });

            // Run scoring engine
            const ranked = scoreCreators(campaign, creators);

            const top20 = ranked.slice(0, TOP_RESULTS_COUNT);
            const rest = ranked.slice(TOP_RESULTS_COUNT);

            return { top20, rest };
        }),
});
