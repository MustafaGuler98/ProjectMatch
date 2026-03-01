import type { Campaign, Creator } from "@prisma/client";

export function buildBriefPrompt(campaign: Campaign, creator: Creator): string {
    return `You are an expert influencer marketing strategist.
Generate a personalized creative brief for the following campaign and creator pairing.

--- CAMPAIGN DETAILS ---
Brand: ${campaign.brand}
Objective: ${campaign.objective}
Target Country: ${campaign.targetCountry}
Target Age Range: ${campaign.targetAgeRange}
Tone: ${campaign.tone}
Forbidden Words / Topics: ${campaign.doNotUseWords.join(", ")}
Preferred Hook Types: ${campaign.preferredHookTypes.join(", ")}

--- CREATOR PROFILE ---
Username: @${creator.username}
Niches: ${creator.niches.join(", ")}
Content Style: ${creator.contentStyle}
Primary Hook Type: ${creator.primaryHookType}
Followers: ${creator.followers}
Engagement Rate: ${creator.engagementRate}%

Return a JSON object with exactly these fields:
- outreachMessage: A personalized outreach message to send to this creator. Reference the brand name, creator's niche, and content style.
- contentIdea1 through contentIdea5: Five distinct, specific content ideas for this campaign.
- hookSuggestion1 through hookSuggestion3: Three hook suggestions that match the creator's existing style.

All output must be in English.`;
}
