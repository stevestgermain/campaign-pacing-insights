import { CampaignType } from '../types';

interface RecommendationSet {
  early: string;
  mid: string;
  late: string;
  overSpend: string;
  underSpend: string;
  extremeOver: string;
  extremeUnder: string;
  reduceRate: string;
  increaseRate: string;
  projOver: string;
  projUnder: string;
}

const RECOMMENDATIONS: Record<CampaignType, RecommendationSet> = {
  search: {
    early: "Early phase. Focus on establishing Search Impression Share and Quality Score baselines.",
    mid: "Mid-flight. Mine search query reports (SQRs) for negative keywords and expansion opportunities.",
    late: "Final stretch. Ensure bids are competitive on exact match terms to capture remaining high-intent traffic.",
    overSpend: "Spent more than scheduled. Review broad match efficiency and consider lowering bids on high-CPA terms.",
    underSpend: "Under budget. Check for 'Limited by Budget' warnings or low search volume status on key terms.",
    extremeOver: "⚠️ CRITICAL: Pace is dangerously high. Check for broken budget caps, runaway broad match keywords, or click bot spikes.",
    extremeUnder: "⚠️ CRITICAL: Delivery is stalled. Verify payment methods, policy disapprovals, or extremely low Quality Scores blocking impressions.",
    reduceRate: "Lower daily caps or pause high-cost/low-conversion keywords to curb spend.",
    increaseRate: "Increase keyword bids, test broader match types, or expand into upper-funnel generic terms.",
    projOver: "Projected to overspend. Immediate bid calibration required to avoid dark days at end of flight.",
    projUnder: "Projected to underspend. Aggressively bid on Impression Share to maximize capture."
  },
  social: {
    early: "Learning phase. Avoid significant edits to ad sets (budget/creative) to let the algorithm stabilize.",
    mid: "Creative fatigue check. Monitor frequency and CTR; rotate in fresh visuals if performance dips.",
    late: "Final push. Shift budget allocation to best-performing audiences and creatives to close strong.",
    overSpend: "Spending fast. Tighten audience targeting parameters or reduce manual bid caps.",
    underSpend: "Delivery struggling. Creative may have low quality ranking or audience size is too narrow.",
    extremeOver: "⚠️ CRITICAL: Spend is spiraling. Verify bid caps weren't removed or if an ad set has a 'spending limit' that was bypassed.",
    extremeUnder: "⚠️ CRITICAL: Ads may be disapproved or audience is too small to serve. Check Account Quality tab immediately.",
    reduceRate: "Lower ad set budgets or implement stricter cost controls (bid caps).",
    increaseRate: "Expand lookalike percentages (e.g., 1% to 3%) or broaden interest targeting.",
    projOver: "Projected to cap out early. Reduce daily budgets on prospecting layers immediately.",
    projUnder: "Projected to have unspent funds. Launch new creative iterations or broaden geo-targeting."
  },
  display: {
    early: "Ramp-up. Monitor site lists heavily to exclude low-quality inventory or accidental app spillover.",
    mid: "Optimization phase. Adjust bids based on viewability and engagement metrics per domain.",
    late: "Maximize reach. Ensure frequency caps aren't throttling delivery too aggressively.",
    overSpend: "High burn. Review placement reports for high-volume, low-value sites (MFA sites).",
    underSpend: "Low fill. Win rates might be too low; consider raising CPM floors or adding exchanges.",
    extremeOver: "⚠️ CRITICAL: Potential bot traffic or accidental site list inclusion. Check for 100% CTR anomalies or foreign domain spikes.",
    extremeUnder: "⚠️ CRITICAL: Zero or near-zero delivery. Check creative approval status, scanner blocks, or if CPM bids are below floor prices.",
    reduceRate: "Exclude low-performance placements or tighten geo/device targeting.",
    increaseRate: "Add open exchange inventory, PMPs, or loosen brand safety filters slightly.",
    projOver: "Projected to overspend. Cut bottom 20% of inventory sources to consolidate spend.",
    projUnder: "Projected to underspend. Increase CPM bids or add retargeting pools."
  },
  video: {
    early: "Launch phase. Verify VTR (View Through Rate) benchmarks and creative rendering across devices.",
    mid: "Mid-flight. Analyze quartiles; exclude channels or apps with low completion rates.",
    late: "Final push. Prioritize high-completion inventory to ensure full message delivery.",
    overSpend: "High velocity. CPVs might be higher than anticipated; check competitive landscape.",
    underSpend: "Low delivery. VAST errors or strict inventory constraints might be blocking impressions.",
    extremeOver: "⚠️ CRITICAL: Runaway spend. Check if 'Maximize Lift' or 'Maximize Views' strategies are uncapped without daily limits.",
    extremeUnder: "⚠️ CRITICAL: Delivery halted. VAST tags may be broken or creative specs are rejected by major exchanges.",
    reduceRate: "Lower CPV bids or restrict delivery to specific dayparts.",
    increaseRate: "Accept lower viewability thresholds temporarily or add broader topic targets.",
    projOver: "Projected to overspend. Restrict delivery to WiFi only or lower bids.",
    projUnder: "Projected to underspend. Troubleshoot VAST tags or expand to additional video exchanges."
  }
};

export const getRecommendation = (
  type: CampaignType, 
  category: keyof RecommendationSet, 
  fallback?: string
): string => {
  const recs = RECOMMENDATIONS[type];
  return recs ? recs[category] : (fallback || "Monitor campaign performance.");
};

export const getTimelineRec = (type: CampaignType, percentElapsed: number): string => {
  if (percentElapsed < 25) return getRecommendation(type, 'early');
  if (percentElapsed > 75) return getRecommendation(type, 'late');
  return getRecommendation(type, 'mid');
};

export const getSpendStatusMsg = (type: CampaignType, pacingPercent: number): string => {
  if (pacingPercent >= 125) return getRecommendation(type, 'extremeOver');
  if (pacingPercent <= 70) return getRecommendation(type, 'extremeUnder');
  if (pacingPercent > 100) return getRecommendation(type, 'overSpend');
  return getRecommendation(type, 'underSpend');
};