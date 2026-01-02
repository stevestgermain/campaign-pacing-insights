export type CampaignType = 'search' | 'social' | 'display' | 'video';

export interface CampaignData {
  campaignType: CampaignType;
  budget: number;
  spent: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  today: string;     // YYYY-MM-DD
}

export interface PacingResult {
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
  percentElapsed: number;
  percentBudgetUsed: number; // New field for visualization
  idealSpend: number;
  actualSpend: number;
  variance: number;
  pacingPercent: number;
  dailyBurnRate: number;
  remainingBudget: number;
  requiredDailySpend: number;
  projectedTotal: number;
  projectedVariance: number;
  status: 'over' | 'under' | 'healthy' | 'trending_high' | 'trending_low';
}