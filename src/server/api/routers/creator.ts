import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBriefInput } from "~/shared/schemas";
import { CAMPAIGN_NOT_FOUND, CREATOR_NOT_FOUND, AI_GENERATION_FAILED } from "~/shared/messages";
import { generateBrief } from "~/server/services/ai";
import { aiBriefSchema } from "~/server/services/ai/schemas";

export const creatorRouter = createTRPCRouter({
    getBrief: publicProcedure
        .input(getBriefInput)
        .query(async ({ ctx, input }) => {
            // Check cache first
            const cached = await ctx.db.aiCache.findUnique({
                where: {
                    campaignId_creatorId: {
                        campaignId: input.campaignId,
                        creatorId: input.creatorId,
                    },
                },
            });

            if (cached) {
                return aiBriefSchema.parse(cached.response);
            }

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

            // Fetch creator
            const creator = await ctx.db.creator.findUnique({
                where: { id: input.creatorId },
            });

            if (!creator) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: CREATOR_NOT_FOUND(input.creatorId),
                });
            }

            // Generate brief via AI
            try {
                const brief = await generateBrief(campaign, creator);

                // Save to cache
                await ctx.db.aiCache.create({
                    data: {
                        campaignId: input.campaignId,
                        creatorId: input.creatorId,
                        response: brief,
                    },
                });

                return brief;
            } catch {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: AI_GENERATION_FAILED,
                });
            }
        }),
});
