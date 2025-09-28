// Tipos para o endpoint de estatísticas do usuário

export type PopularLink = {
  id: string;
  shortId: string;
  originalUrl: string;
  customAlias: string | null;
  clicks: number;
  displayUrl: string;
};

export type ClickOverTime = {
  date: string;
  clicks: number;
};

export type Overview = {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  inactiveLinks: number;
  clickRate: number;
};

export type PeriodData = {
  clicks: number;
};

export interface TodayPeriod extends PeriodData {
  clicksGrowthVsYesterday: number;
}

export interface MonthPeriod extends PeriodData {
  newLinks: number;
  clicksGrowthVsLastMonth: number;
  linksGrowthVsLastMonth: number;
}

export type Periods = {
  today: TodayPeriod;
  yesterday: PeriodData;
  thisMonth: MonthPeriod;
  lastMonth: PeriodData;
};

export type Growth = {
  clicksVsLastMonth: number;
  clicksVsYesterday: number;
  linksVsLastMonth: number;
  clickRateVsLastMonth: number;
};

export type Charts = {
  clicksOverTime: ClickOverTime[];
};

export type UserStatsData = {
  overview: Overview;
  periods: Periods;
  growth: Growth;
  charts: Charts;
  popularLinks: PopularLink[];
};
