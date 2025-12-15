export enum AlertType {
  STOPPER = 'STOPPER',
  GMV_DECLINE = 'GMV_DECLINE',
  PROMO_SPIKE = 'PROMO_SPIKE',
  UNKNOWN = 'UNKNOWN'
}

export interface BaseAlert {
  id: string;
  brandName: string;
  rawText: string;
  action: string;
  type: AlertType;
}

export interface StopperAlert extends BaseAlert {
  type: AlertType.STOPPER;
  previousOrders: number;
  currentOrders: number;
}

export interface GMVAlert extends BaseAlert {
  type: AlertType.GMV_DECLINE;
  declinePercentage: number;
  previousGMV: number;
  currentGMV: number;
}

export interface PromoAlert extends BaseAlert {
  type: AlertType.PROMO_SPIKE;
  increasePoints: number;
  previousRate: number;
  currentRate: number;
}

export interface UnknownAlert extends BaseAlert {
  type: AlertType.UNKNOWN;
}

export type DashboardAlert = StopperAlert | GMVAlert | PromoAlert;

export interface DashboardMetrics {
  totalAlerts: number;
  stopperCount: number;
  gmvAtRisk: number;
  ordersLost: number;
}

// WEEKLY REPORT TYPES

export interface WeeklyMetric {
  value: string;
  previous: string;
  delta: string;
  percentChange?: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface WeeklyBrandMetric {
  id: string;
  rank: number;
  name: string;
  gmvChange: string;
  description: string;
}

export interface WeeklyStopper {
  id: string;
  name: string;
  lwOrders: number;
  lwGmv: string;
}

export interface WeeklyAction {
  id: string;
  owner: string;
  task: string;
  kpi: string;
}

export interface WeeklyReportData {
  window: string;
  totals: {
    orders: WeeklyMetric;
    gmv: WeeklyMetric;
    ats: WeeklyMetric;
    promo: WeeklyMetric;
  };
  takeaways: string[];
  gainers: WeeklyBrandMetric[];
  decliners: WeeklyBrandMetric[];
  stoppers: WeeklyStopper[];
  actions: {
    p0: WeeklyAction[];
    p1: WeeklyAction[];
  };
}

// DAILY COMPARISON TYPES

export interface DailyAnomaly {
  id: string;
  metric: string;
  description: string;
}

export interface DailyComparisonData {
  generatedAt: string;
  headline: string;
  insights: string[];
  anomalies: DailyAnomaly[];
}

// OPS METRICS TYPES

export interface OpsData {
  date: string;
  fulfillmentRate: number;
  missedOrders: number;
  pendingOrders: number;
}

export interface LowFulfillmentStore {
  id: string;
  rank: number;
  name: string;
  missedOrders: number;
  fulfillmentRate: number;
}

export interface MissedOrdersData {
  date: string;
  totalPlaced: number;
  picked: number;
  pending: number;
  reasons: {
    reason: string;
    count: number;
  }[];
}

export interface PendingBrand {
  brandName: string;
  pendingOrders: number;
}

export interface PendingOrdersData {
  totalPending: number;
  brandCount: number;
  topBrands: PendingBrand[];
}

export interface PickupStatusData {
  generatedAt: string;
  brands: any[]; 
  rawText: string;
}

// PROMO SAFEGUARD TYPES

export interface PromoSafeguardAlert {
  id: string;
  brandName: string;
  status: string;
  burnAmount: number;
  burnGmvRatio: number;
  share: number;
  orders: number;
  reason: string;
}

export interface PromoSafeguardData {
  title: string;
  summary: string;
  alerts: PromoSafeguardAlert[];
}

// PROMO ACTION TYPES

export interface PromoActionItem {
  id: string;
  code: string;
  burnAmount: number;
  burnGmv: number; // percentage
  orders: number;
  deltaPp: number;
  recommendation: string;
}

export interface PromoActionSection {
  title: string;
  items: PromoActionItem[];
}

export interface PromoActionData {
  title: string;
  totals: {
    burn: number;
    gmv: number;
    burnGmvRatio: number;
  };
  sections: PromoActionSection[];
}

// PROMO CONCENTRATION TYPES

export interface PromoConcentrationStore {
  id: string;
  action: string;
  storeName: string;
  storeId: string;
  burnAmount: number;
  share: number;
}

export interface PromoConcentrationPromo {
  id: string;
  promoCode: string;
  totalBurn: number;
  top5Share: number;
  stores: PromoConcentrationStore[];
}

export interface PromoConcentrationData {
  title: string;
  summary: string;
  promos: PromoConcentrationPromo[];
}