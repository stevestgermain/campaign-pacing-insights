import { CampaignData } from './types';

export const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const DEFAULT_CAMPAIGN_DATA: CampaignData = {
  campaignType: 'search',
  budget: 0,
  spent: 0,
  startDate: '',
  endDate: '',
  today: new Date().toISOString().split('T')[0],
};