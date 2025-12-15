import React from 'react';
import { WeeklyReportData, WeeklyMetric, WeeklyBrandMetric, WeeklyAction } from '../types';
import { Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Tag, AlertOctagon, CheckSquare } from 'lucide-react';

interface Props {
  data: WeeklyReportData | null;
}

const MetricCard: React.FC<{ title: string; metric: WeeklyMetric; icon: React.ReactNode }> = ({ title, metric, icon }) => {
  const isPositive = metric.trend === 'up';
  
  // Use Emerald for good, Dark Orange for bad (declines)
  let colorClass = isPositive ? 'text-emerald-600' : 'text-brand-darkOrange';
  let bgClass = isPositive ? 'bg-emerald-50' : 'bg-brand-darkOrange/10';
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        <div className={`p-1.5 rounded-full ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-xl font-bold text-brand-dark">{metric.value}</span>
      </div>
      <div className="mt-2 text-xs flex flex-wrap gap-1 items-center">
        <span className="text-gray-400">vs {metric.previous}</span>
        <span className={`font-medium ${colorClass} flex items-center bg-opacity-10 px-1 rounded`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
            {metric.delta} {metric.percentChange && `(${metric.percentChange})`}
        </span>
      </div>
    </div>
  );
};

const BrandList: React.FC<{ title: string; items: WeeklyBrandMetric[]; type: 'gainer' | 'decliner' }> = ({ title, items, type }) => {
  const isGainer = type === 'gainer';
  const headerColor = isGainer ? 'text-emerald-800' : 'text-brand-darkOrange';
  const headerBg = isGainer ? 'bg-emerald-50' : 'bg-brand-darkOrange/10';
  const borderColor = isGainer ? 'border-emerald-100' : 'border-brand-darkOrange/20';

  return (
    <div className={`bg-white rounded-xl border ${borderColor} shadow-sm overflow-hidden h-full`}>
      <div className={`px-4 py-3 border-b ${borderColor} ${headerBg} flex justify-between items-center`}>
        <h4 className={`font-bold ${headerColor} flex items-center`}>
          {isGainer ? <TrendingUp className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
          {title}
        </h4>
      </div>
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-brand-dark text-sm flex items-center">
                        <span className="text-gray-400 mr-2 w-4 text-xs font-mono">#{item.rank}</span> 
                        {item.name}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${isGainer ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-darkOrange/10 text-brand-darkOrange'}`}>
                        {item.gmvChange}
                    </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    {item.description}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

const ActionBox: React.FC<{ title: string; actions: WeeklyAction[]; priority: 'p0' | 'p1' }> = ({ title, actions, priority }) => {
  const isP0 = priority === 'p0';
  // Use Dark Orange for P0 (Critical) and Purple for P1
  const borderColor = isP0 ? 'border-brand-darkOrange/20' : 'border-brand-purple/20';
  const titleColor = isP0 ? 'text-brand-darkOrange' : 'text-brand-purple';
  const bgHeader = isP0 ? 'bg-brand-darkOrange/10' : 'bg-brand-purple/10';

  return (
    <div className={`bg-white rounded-lg border ${borderColor} overflow-hidden mb-4`}>
        <div className={`px-4 py-2 ${bgHeader} border-b ${borderColor}`}>
            <h4 className={`text-sm font-bold ${titleColor} flex items-center`}>
                <CheckSquare className="w-4 h-4 mr-2" /> {title}
            </h4>
        </div>
        <div className="p-4 space-y-3">
            {actions.map(action => (
                <div key={action.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 rounded uppercase">{action.owner}</span>
                        <span className="text-brand-dark font-medium">{action.task}</span>
                    </div>
                    <div className="text-xs text-gray-500 italic pl-1 border-l-2 border-gray-200 ml-1">
                        KPI: {action.kpi}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

const WeeklyReport: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-purple/20 pb-4">
        <div>
            <h2 className="text-xl font-bold text-brand-orange">Weekly Top 30 Brands Report</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Window: {data.window}</span>
            </div>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Orders" metric={data.totals.orders} icon={<ShoppingBag className="w-4 h-4" />} />
        <MetricCard title="Total GMV" metric={data.totals.gmv} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard title="Avg Transaction" metric={data.totals.ats} icon={<Tag className="w-4 h-4" />} />
        <MetricCard title="Promo Rate" metric={data.totals.promo} icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Takeaways & Stoppers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-4">Key Takeaways</h3>
              <ul className="space-y-2">
                  {data.takeaways.map((point, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start">
                          <span className="mr-2 text-slate-400">•</span>
                          {point}
                      </li>
                  ))}
              </ul>
          </div>

          <div className="bg-brand-darkOrange/5 rounded-xl border border-brand-darkOrange/20 p-6">
              <h3 className="text-sm font-bold text-brand-darkOrange uppercase mb-4 flex items-center">
                  <AlertOctagon className="w-4 h-4 mr-2" /> Weekly Stoppers
              </h3>
              <ul className="space-y-3">
                  {data.stoppers.map(stopper => (
                      <li key={stopper.id} className="bg-white p-3 rounded shadow-sm border border-brand-darkOrange/20">
                          <div className="font-bold text-brand-dark text-sm">{stopper.name}</div>
                          <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>LW Orders: {stopper.lwOrders}</span>
                              <span className="font-mono">GMV: {stopper.lwGmv}</span>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
      </div>

      {/* Gainers & Decliners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandList title="Top GMV Gainers" items={data.gainers} type="gainer" />
        <BrandList title="Top GMV Decliners" items={data.decliners} type="decliner" />
      </div>

      {/* Actions */}
      <div>
        <h3 className="text-lg font-bold text-brand-dark mb-4">Action Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionBox title="P0 Actions (Today)" actions={data.actions.p0} priority="p0" />
            <ActionBox title="P1 Actions (This Week)" actions={data.actions.p1} priority="p1" />
        </div>
      </div>

    </div>
  );
};

export default WeeklyReport;