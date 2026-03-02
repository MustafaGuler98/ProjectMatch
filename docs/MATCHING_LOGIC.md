# Matching Logic

This document explains the scoring algorithm used by the Campaign Matching Engine. For a given campaign, every creator in the database is evaluated against 11 independent rules. Each rule produces a score contribution. The contributions are summed to produce a `totalScore`, and creators are ranked in descending order. The top 20 are returned.

---

## Scoring Overview

| # | Rule | Max | Min |
|---|---|---|---|
| 1 | Niche Relevance | +30 | 0 |
| 2 | Audience Country Match | +20 | 0 |
| 3 | Gender Fit | +15 | 0 |
| 4 | Watch Time | +15 | -15 |
| 5 | Follower Fit | +15 | -15 |
| 6 | Hook Type Match | +15 | 0 |
| 7 | Age Range Match | +10 | 0 |
| 8 | Content Style Fit | +10 | 0 |
| 9 | Content Reach | +20 | -15 |
| 10 | Brand Safety | 0 | -10 per flag |
| 11 | Engagement Rate Scoring | +20 | 0 |

**Maximum achievable score: 170**

> All computed values are clamped to their expected min/max range to prevent float arithmetic anomalies from producing out-of-bounds scores.

---

## Rule Definitions

### 1 — Niche Relevance (max: +30)

**Fields:** `campaign.niches` ↔ `creator.niches`

The creator's content niches are compared against the campaign's target niches. Partial matches are rewarded because a fitness campaign benefits from a creator who covers both fitness and lifestyle.

| Condition | Points |
|---|---|
| All campaign niches matched | +30 |
| At least one niche matched | +15 |
| No match | 0 |

---

### 2 — Audience Country Match (max: +20)

**Fields:** `campaign.targetCountry` ↔ `creator.audienceCountries`

The campaign targets a specific country. A creator whose entire audience is concentrated in that one country is a stronger signal than one whose audience spans many countries.

| Condition | Points |
|---|---|
| Creator has exactly 1 audience country and it matches | +20 |
| Creator has multiple audience countries and one matches | +12 |
| No match | 0 |

---

### 3 — Gender Fit (max: +15)

**Fields:** `campaign.targetGender` ↔ `creator.audienceFemale` / `creator.audienceMale`

When the campaign targets all genders, any creator qualifies fully. When a specific gender is targeted, the creator's audience gender distribution is used to compute a proportional score.

**Formula (when `targetGender != "all"`):**

```
ratio = targetGenderValue / (audienceFemale + audienceMale)
score = Math.floor(ratio * 15)
score = clamp(score, 0, 15)
```

| Condition | Points |
|---|---|
| `targetGender` is `"all"` | +15 |
| Target gender represents 100% of audience | +15 |
| Target gender represents ~50% of audience | +7 |
| Target gender not represented | 0 |

---

### 4 — Age Range Match (max: +10)

**Fields:** `campaign.targetAgeRange` ↔ `creator.audienceAgeRange`

| Condition | Points |
|---|---|
| Exact string match (e.g. `"18-24"` == `"18-24"`) | +10 |
| No match | 0 |

---

### 5 — Watch Time (max: +15 / min: -15)

**Fields:** `campaign.minAvgWatchTime` ↔ `creator.avgWatchTime`

`minAvgWatchTime` is a hard floor defined by the campaign. A creator below this threshold may not be able to sustain viewer attention long enough to deliver the message effectively.

| Condition | Points |
|---|---|
| `avgWatchTime >= minAvgWatchTime` | +15 |
| `avgWatchTime` is 0–20% below threshold | 0 |
| `avgWatchTime` is more than 20% below threshold | -15 |

---

### 6 — Follower Fit (max: +15 / min: -15)

**Fields:** `campaign.budgetRange` ↔ `creator.followers`

The campaign's budget range defines the appropriate creator tier. A creator far outside the range (in either direction) is a poor fit: too small may lack reach, too large may be unaffordable or misaligned.

| Condition | Points |
|---|---|
| `followers` within `[minFollowers, maxFollowers]` | +15 |
| `followers` within 20% outside the range | 0 |
| `followers` more than 20% outside the range | -15 |

---

### 7 — Hook Type Match (max: +15)

**Fields:** `campaign.preferredHookTypes` ↔ `creator.primaryHookType`

| Condition | Points |
|---|---|
| `primaryHookType` is in `preferredHookTypes` | +15 |
| No match | 0 |

---

### 8 — Content Style Fit (max: +10)

**Fields:** `campaign.objective` ↔ `creator.contentStyle`

Each campaign objective is mapped to a set of compatible content styles. This captures the softer alignment between a campaign's goal and how a creator communicates with their audience.

| Campaign Objective | Compatible Content Styles |
|---|---|
| `Brand Awareness` | `storytelling`, `aesthetic`, `educational` |
| `Engagement` | `trend-based`, `pov`, `relatable`, `dark-humor` |
| `Song Launch` | `aesthetic`, `dark-humor`, `trend-based` |

| Condition | Points |
|---|---|
| `contentStyle` maps to campaign `objective` | +10 |
| No mapping found | 0 |

---

### 9 — Content Reach (max: +20 / min: -15)

**Fields:** `creator.lastPosts[].views` ↔ `creator.followers`

The follower count is already scored in Rule 6. This rule uses the `lastPosts` view data to evaluate how far the creator's content actually spreads relative to their follower base — a proxy for organic virality.

```
avgViews   = average(lastPosts[].views)
reachRatio = avgViews / followers
```

| Reach Ratio | Points | Signal |
|---|---|---|
| `>= 1.5` | +20 | Viral — content reaches well beyond follower base |
| `1.0 – 1.5` | +10 | Strong organic reach |
| `0.5 – 1.0` | 0 | Average reach |
| `< 0.5` | -15 | Content underperforms relative to follower count |

---

### 10 — Brand Safety Penalty (-10 per matching flag)

**Fields:** `creator.brandSafetyFlags` ↔ `campaign.doNotUseWords`

Each flag in `brandSafetyFlags` represents a potential content risk (e.g. `supplement_claim`, `explicit_language`). The penalty is only applied when a flag **matches** one of the campaign's `doNotUseWords`.

| Condition | Points |
|---|---|
| No matching flags (or no doNotUseWords defined) | 0 |
| Per matching flag | -10 |

---

### 11 — Engagement Rate Scoring (max: +20)

**Fields:** `creator.engagementRate`

The creator's reported engagement rate is used to award points:

```
reportedER = creator.engagementRate
```

| Reported ER | Points | Signal |
|---|---|---|
| `>= 12%` | +20 | Top-tier engagement |
| `>= 9%` | +15 | Above average |
| `>= 6%` | +10 | Average (median ~7.7%) |
| `>= 4%` | +5 | Below average |
| `< 4%` | 0 | Low engagement, no reward |
