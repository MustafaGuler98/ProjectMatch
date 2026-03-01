// Niche Relevance
export const MAX_NICHE_SCORE = 30;
export const PARTIAL_NICHE_SCORE = 15;

// Audience Country
export const COUNTRY_SINGLE_MATCH_SCORE = 20;
export const COUNTRY_MULTI_MATCH_SCORE = 12;

// Gender Fit
export const MAX_GENDER_SCORE = 15;

// Age Range
export const AGE_RANGE_MATCH_SCORE = 10;

// Watch Time
export const WATCH_TIME_PASS_SCORE = 15;
export const WATCH_TIME_FAIL_PENALTY = -15;
export const WATCH_TIME_TOLERANCE = 0.2;

// Follower Fit
export const FOLLOWER_FIT_SCORE = 15;
export const FOLLOWER_FIT_PENALTY = -15;
export const FOLLOWER_FIT_TOLERANCE = 0.2;

// Hook Type
export const HOOK_MATCH_SCORE = 15;

// Content Style
export const CONTENT_STYLE_MATCH_SCORE = 10;
export const OBJECTIVE_TO_STYLE_MAP: Record<string, string[]> = {
    "Brand Awareness": ["storytelling", "aesthetic", "educational"],
    "Engagement": ["trend-based", "pov", "relatable", "dark-humor"],
    "Song Launch": ["aesthetic", "dark-humor", "trend-based"],
};

// Content Reach
export const REACH_THRESHOLDS = [
    { min: 1.5, score: 20 },
    { min: 1.0, score: 10 },
    { min: 0.5, score: 0 },
] as const;
export const REACH_BELOW_PENALTY = -15;

// Brand Safety
export const BRAND_SAFETY_PER_FLAG_PENALTY = -10;

// Post Engagement Validation
export const ENGAGEMENT_DEVIATION_BANDS = [
    { maxDeviation: 0.2, score: 0 },
    { maxDeviation: 0.4, score: -20 },
    { maxDeviation: 0.8, score: -40 },
] as const;
export const ENGAGEMENT_EXTREME_PENALTY = -100;

// Engine
export const TOP_RESULTS_COUNT = 20;
