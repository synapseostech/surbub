export interface MetricCard {
  label: string;
  value: string;
  subValue?: string;
  changePercent?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface BusinessAnalytics {
  totalRevenueUGX: number;
  totalOrders: number;
  averageOrderValueUGX: number;
  customerRating: number;
  recentOrdersCount: number;
  topSellingItems: { name: string; count: number; totalUGX: number }[];
}

export interface RiderAnalytics {
  todayEarningsUGX: number;
  weekEarningsUGX: number;
  completedTripsToday: number;
  activeTripHours: number;
  rating: number;
  acceptanceRatePercent: number;
}

export interface AdminAnalytics {
  activeUsersCount: number;
  registeredBusinessesCount: number;
  activeRidersCount: number;
  grossMerchandiseVolumeUGX: number;
  todayRidesCount: number;
  todayOrdersCount: number;
  pendingApprovalsCount: number;
}
