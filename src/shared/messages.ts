// Campaign errors
export const CAMPAIGN_NOT_FOUND = (id: string) =>
    `Campaign "${id}" not found.`;

// Creator errors
export const CREATOR_NO_POSTS = (id: string) =>
    `Creator ${id} has no posts — cannot compute metrics.`;

export const CREATOR_ZERO_VIEWS = (id: string) =>
    `Creator ${id} has a post with 0 views — invalid data.`;

export const CREATOR_ZERO_ENGAGEMENT = (id: string) =>
    `Creator ${id} has 0 engagementRate — invalid data.`;

// AI errors
export const CREATOR_NOT_FOUND = (id: string) =>
    `Creator "${id}" not found.`;

export const AI_GENERATION_FAILED =
    "AI brief generation failed after retries. Please try again later.";

export const AI_INVALID_RESPONSE =
    "AI returned an invalid response that could not be parsed.";
