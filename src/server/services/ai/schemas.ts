import { z } from "zod";

export const aiBriefSchema = z.object({
    outreachMessage: z.string().describe("Personalized outreach message to send to the creator"),
    contentIdea1: z.string().describe("Content idea #1 for this campaign"),
    contentIdea2: z.string().describe("Content idea #2 for this campaign"),
    contentIdea3: z.string().describe("Content idea #3 for this campaign"),
    contentIdea4: z.string().describe("Content idea #4 for this campaign"),
    contentIdea5: z.string().describe("Content idea #5 for this campaign"),
    hookSuggestion1: z.string().describe("Hook suggestion #1 matching the creator style"),
    hookSuggestion2: z.string().describe("Hook suggestion #2 matching the creator style"),
    hookSuggestion3: z.string().describe("Hook suggestion #3 matching the creator style"),
});

export type AiBrief = z.infer<typeof aiBriefSchema>;
