import React from 'react';
import { PromoActionData } from '../types';
import { ShieldAlert, AlertTriangle, AlertOctagon, Flame, DollarSign, PieChart } from 'lucide-react';

interface Props {
  data: PromoActionData | null;
}

const PromoActionTable: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header & Totals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-brand-darkOrange" />
                <h3 className="text-xl font-bold text-brand-dark">{data.title}</h3>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-darkOrange/10 p-4 rounded-lg border border-brand-darkOrange/20 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-brand-darkOrange uppercase">Total Burn</span>
                    <div className="text-2xl font-bold text-brand-darkOrange">{formatCurrency(data.totals.burn)}</div>
                </div>
                <Flame className="w-8 h-8 text-brand-darkOrange/50" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Total GMV</span>
                    <div className="text-2xl font-bold text-brand-dark">{formatCurrency(data.totals.gmv)}</div>
                </div>
                <DollarSign className="w-8 h-8 text-gray-300" />
            </div>
            <div className="bg-brand-orange/10 p-4 rounded-lg border border-brand-orange/20 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-brand-orange uppercase">Burn / GMV</span>
                    <div className="text-2xl font-bold text-brand-orange">{data.totals.burnGmvRatio.toFixed(2)}%</div>
                </div>
                <PieChart className="w-8 h-8 text-brand-orange/50" />
            </div>
        </div>
      </div>

      {/* Action Sections */}
      {data.sections.map((section, idx) => {
          const isP0 = section.title.includes('P0');
          // Use Dark Orange for P0, Yellow/Orange for P1
          const borderColor = isP0 ? 'border-brand-darkOrange/20' : 'border-yellow-200';
          const headerBg = isP0 ? 'bg-brand-darkOrange/10' : 'bg-yellow-50';
          const titleColor = isP0 ? 'text-brand-darkOrange' : 'text-yellow-800';
          const icon = isP0 ? <AlertOctagon className="w-5 h-5 mr-2 text-brand-darkOrange" /> : <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />;

          return (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border ${borderColor} overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${borderColor} ${headerBg} flex items-center`}>
                    {icon}
                    <h3 className={`text-lg font-bold ${titleColor}`}>{section.title}</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Burn $</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Burn/GMV</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Δpp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {section.items.map((item) => (
                        <tr key={item.id} className={`hover:${isP0 ? 'bg-brand-darkOrange/5' : 'bg-yellow-50'} transition-colors`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 font-mono text-sm font-bold border border-gray-300">
                                    {item.code}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm font-medium text-brand-dark">
                                    {formatCurrency(item.burnAmount)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span className={`text-sm font-bold ${item.burnGmv > 50 ? 'text-brand-darkOrange' : 'text-gray-700'}`}>
                                    {item.burnGmv.toFixed(2)}%
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-brand-dark">
                                {item.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                {item.deltaPp.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={`${isP0 ? 'text-brand-darkOrange' : 'text-yellow-800'}`}>
                                    {item.recommendation}
                                </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
          );
      })}
    </div>
  );
};

export default PromoActionTable;