import type { Campaign, Creator, Post } from "@prisma/client";

export type CreatorWithPosts = Creator & { posts: Post[] };

export interface RuleResult {
  label: string;
  score: number;
}

export interface ScoreBreakdown {
  nicheMatch: number;
  audienceCountryMatch: number;
  genderFit: number;
  ageRangeMatch: number;
  watchTime: number;
  followerFit: number;
  hookMatch: number;
  contentStyleFit: number;
  contentReach: number;
  brandSafetyPenalty: number;
  engagementRateScore: number;
}

export interface RankedCreator {
  creatorId: string;
  username: string;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export type ScoringRule = (campaign: Campaign, creator: CreatorWithPosts) => RuleResult;
