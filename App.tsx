import React, { useMemo } from 'react';
import { DASHBOARD_JSON, WEEKLY_REPORT_JSON, DAILY_COMPARISON_JSON, OPS_METRICS_JSON, OPS_LOW_FULFILLMENT_JSON, OPS_MISSED_ORDERS_BREAKDOWN_JSON, OPS_PENDING_ORDERS_JSON, OPS_PICKUP_STATUS_JSON, PROMO_SAFEGUARD_JSON, PROMO_ACTION_JSON, PROMO_CONCENTRATION_JSON } from './constants';
import { parseDashboardData, calculateMetrics, parseWeeklyData, parseDailyComparisonData, parseOpsData, parseLowFulfillmentData, parseMissedOrdersBreakdown, parsePendingOrdersData, parsePickupStatusData, parsePromoSafeguardData, parsePromoActionData, parsePromoConcentrationData } from './utils/parser';
import { AlertType, GMVAlert, StopperAlert } from './types';
import StatCard from './components/StatCard';
import StopperTable from './components/StopperTable';
import GmvTable from './components/GmvTable';
import WeeklyReport from './components/WeeklyReport';
import DailyComparison from './components/DailyComparison';
import OpsMetrics from './components/OpsMetrics';
import LowFulfillmentTable from './components/LowFulfillmentTable';
import MissedOrdersBreakdown from './components/MissedOrdersBreakdown';
import PendingOrdersTable from './components/PendingOrdersTable';
import PickupStatus from './components/PickupStatus';
import PromoSafeguardTable from './components/PromoSafeguardTable';
import PromoActionTable from './components/PromoActionTable';
import PromoConcentrationTable from './components/PromoConcentrationTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, AlertTriangle, TrendingDown, Store, Flame, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  // Parse data
  const alerts = useMemo(() => parseDashboardData(DASHBOARD_JSON), []);
  const metrics = useMemo(() => calculateMetrics(alerts), [alerts]);
  const weeklyData = useMemo(() => parseWeeklyData(WEEKLY_REPORT_JSON), []);
  const dailyComparisonData = useMemo(() => parseDailyComparisonData(DAILY_COMPARISON_JSON), []);
  const opsData = useMemo(() => parseOpsData(OPS_METRICS_JSON), []);
  const lowFulfillmentData = useMemo(() => parseLowFulfillmentData(OPS_LOW_FULFILLMENT_JSON), []);
  const missedOrdersData = useMemo(() => parseMissedOrdersBreakdown(OPS_MISSED_ORDERS_BREAKDOWN_JSON), []);
  const pendingOrdersData = useMemo(() => parsePendingOrdersData(OPS_PENDING_ORDERS_JSON), []);
  const pickupStatusData = useMemo(() => parsePickupStatusData(OPS_PICKUP_STATUS_JSON), []);
  const promoSafeguardData = useMemo(() => parsePromoSafeguardData(PROMO_SAFEGUARD_JSON), []);
  const promoActionData = useMemo(() => parsePromoActionData(PROMO_ACTION_JSON), []);
  const promoConcentrationData = useMemo(() => parsePromoConcentrationData(PROMO_CONCENTRATION_JSON), []);

  // Segment data
  const stoppers = alerts.filter(a => a.type === AlertType.STOPPER) as StopperAlert[];
  const gmvDecliners = alerts.filter(a => a.type === AlertType.GMV_DECLINE) as GMVAlert[];
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const chartData = gmvDecliners
    .sort((a, b) => b.declinePercentage - a.declinePercentage)
    .slice(0, 5)
    .map(item => ({
      name: item.brandName.length > 10 ? item.brandName.substring(0, 10) + '...' : item.brandName,
      loss: item.previousGMV - item.currentGMV,
      pct: item.declinePercentage
    }));

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans text-brand-dark">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-orange p-2 rounded-lg shadow-sm">
                <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-brand-dark leading-none">Month Over Month MTD Performance</h1>
                <p className="text-xs text-gray-500 mt-1">Daily Store Operations Report</p>
            </div>
          </div>
          <div className="text-sm text-brand-purple font-medium bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
            Reporting Period: Nov 13 - Dec 13
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 1. OVERVIEW SECTION */}
        <div className="space-y-8">
            <section>
            <div className="flex items-center mb-4 space-x-2 border-b border-brand-purple/20 pb-2">
                <Store className="w-5 h-5 text-brand-orange" />
                <h2 className="text-lg font-bold text-brand-orange uppercase tracking-wide">Month Over Month MTD Comparison</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                title="Active Alerts" 
                value={metrics.totalAlerts.toString()} 
                subValue="Total reported incidents"
                icon="alert"
                color="purple"
                />
                <StatCard 
                title="Critical Stoppers" 
                value={metrics.stopperCount.toString()} 
                subValue={`${metrics.ordersLost} monthly orders halted`}
                icon="alert"
                color="red"
                />
                <StatCard 
                title="GMV At Risk" 
                value={formatCurrency(metrics.gmvAtRisk)} 
                subValue="Monthly revenue decline observed"
                icon="money"
                color="yellow"
                />
                <StatCard 
                title="Promo Activity" 
                value="1" 
                subValue="Brand w/ 100% promo spike"
                icon="chart"
                color="green"
                />
            </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Visuals & Lists */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 3. TOP DECLINERS */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <TrendingDown className="w-5 h-5 text-brand-darkOrange" />
                                <h3 className="text-lg font-bold text-brand-dark">Top Decliners (GMV)</h3>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-brand-darkOrange/10 text-brand-darkOrange rounded border border-brand-darkOrange/20">
                                {gmvDecliners.length} Brands
                            </span>
                        </div>
                        
                        {/* Chart Visualization */}
                        <div className="h-64 w-full p-4 border-b border-gray-100 bg-white">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#2E2E2E'}} />
                                    <Tooltip 
                                        formatter={(value: number) => [formatCurrency(value), 'Revenue Loss']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="loss" radius={[0, 4, 4, 0]} barSize={20}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#E8892E" /> 
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <GmvTable data={gmvDecliners} />
                    </section>

                    {/* 4. STOPPERS */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-brand-darkOrange/5">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-brand-darkOrange" />
                                <h3 className="text-lg font-bold text-brand-darkOrange">Critical Stoppers (Zero Orders)</h3>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-white text-brand-darkOrange rounded border border-brand-darkOrange/20">
                                {stoppers.length} Stores
                            </span>
                        </div>
                        <StopperTable data={stoppers} />
                    </section>
                </div>

                {/* Right Column: Gainers & Summary */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* 2. TOP GAINERS */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 h-64 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-brand-dark">Top Gainers</h3>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Store className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-sm">No positive growth detected in current alert report.</p>
                        </div>
                    </section>

                    {/* Promo Spotlight */}
                    <section className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-100 p-6">
                        <h3 className="text-emerald-800 font-bold mb-2">Promotion Spike Detected</h3>
                        <p className="text-emerald-700 text-sm mb-4">
                            One brand has increased promotion intensity by 100pp.
                        </p>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Konafat Knooz</span>
                                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                    0% → 100%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Action: Check promo execution and monitor margins.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>

        {/* 5. PROMO SAFEGUARD SECTION */}
        {(promoSafeguardData || promoActionData || promoConcentrationData) && (
          <div className="border-t-4 border-dashed border-gray-200 pt-8 space-y-8">
             <div className="flex items-center mb-4 space-x-2 border-b border-brand-purple/20 pb-2">
                <Flame className="w-5 h-5 text-brand-orange" />
                <h2 className="text-lg font-bold text-brand-orange uppercase tracking-wide">Promo Safeguards</h2>
            </div>
             {promoSafeguardData && <PromoSafeguardTable data={promoSafeguardData} />}
             {promoActionData && <PromoActionTable data={promoActionData} />}
             {promoConcentrationData && <PromoConcentrationTable data={promoConcentrationData} />}
          </div>
        )}

        {/* 2. WEEKLY REPORT SECTION */}
        <div className="border-t-4 border-dashed border-gray-200 pt-8">
            <WeeklyReport data={weeklyData} />
        </div>

        {/* 3. DAILY COMPARISON SECTION */}
        <div className="border-t-4 border-dashed border-gray-200 pt-8">
            <DailyComparison data={dailyComparisonData} />
        </div>

        {/* 4. OPS METRICS SECTION */}
        <div className="border-t-4 border-dashed border-gray-200 pt-8 space-y-8">
            <OpsMetrics data={opsData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-1">
                    <PickupStatus data={pickupStatusData} />
                </div>
                <div className="xl:col-span-1">
                    <PendingOrdersTable data={pendingOrdersData} />
                </div>
                <div className="xl:col-span-1">
                     <LowFulfillmentTable data={lowFulfillmentData} />
                </div>
                <div className="xl:col-span-1">
                    <MissedOrdersBreakdown data={missedOrdersData} />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;