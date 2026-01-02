import { CampaignData, PacingResult } from '../types';
import { ONE_DAY_MS } from '../constants';

export const calculatePacing = (data: CampaignData): PacingResult | null => {
  const { budget, spent, startDate, endDate, today } = data;

  if (!startDate || !endDate || !today || budget <= 0) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(today);

  // Set hours to 0 to treat as pure dates
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  if (start > end) return null;

  // Calculate days (Inclusive of start/end dates usually)
  const totalDays = Math.round((end.getTime() - start.getTime()) / ONE_DAY_MS) + 1;
  
  // Days elapsed includes today
  let daysElapsed = Math.round((current.getTime() - start.getTime()) / ONE_DAY_MS) + 1;
  daysElapsed = Math.max(0, Math.min(daysElapsed, totalDays)); // Clamp between 0 and total

  const daysRemaining = totalDays - daysElapsed;

  const percentElapsed = (daysElapsed / totalDays) * 100;

  // Budget Used %
  const percentBudgetUsed = (spent / budget) * 100;

  // If calculating before start date, ideal spend is 0
  const idealSpend = current < start ? 0 : (budget * (daysElapsed / totalDays));
  
  const variance = spent - idealSpend;
  
  // Pacing %
  let pacingPercent = 0;
  if (idealSpend > 0) {
    pacingPercent = (spent / idealSpend) * 100;
  } else if (spent > 0) {
    pacingPercent = 1000; // Arbitrary high number if spent before start
  }

  // Daily rates
  const dailyBurnRate = daysElapsed > 0 ? spent / daysElapsed : 0;
  const remainingBudget = budget - spent;
  const requiredDailySpend = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;

  // Projections
  const projectedTotal = dailyBurnRate * totalDays;
  const projectedVariance = projectedTotal - budget;

  // Determine Status with wider buffers
  // Critical: >125% or <70%
  // Warning/Slight: 110-125% or 70-90%
  // Healthy: 90-110%
  let status: PacingResult['status'] = 'healthy';
  
  if (pacingPercent > 125) status = 'over';
  else if (pacingPercent < 70) status = 'under';
  else if (pacingPercent >= 110) status = 'trending_high';
  else if (pacingPercent <= 90) status = 'trending_low';

  return {
    daysElapsed,
    daysRemaining,
    totalDays,
    percentElapsed,
    percentBudgetUsed,
    idealSpend,
    actualSpend: spent,
    variance,
    pacingPercent,
    dailyBurnRate,
    remainingBudget,
    requiredDailySpend,
    projectedTotal,
    projectedVariance,
    status
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(val);
};

export const formatPercent = (val: number) => {
  return `${val.toFixed(1)}%`;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
};