import React from 'react';
import { PromoSafeguardData } from '../types';
import { ShieldAlert, AlertOctagon, Flame } from 'lucide-react';

interface Props {
  data: PromoSafeguardData | null;
}

const PromoSafeguardTable: React.FC<Props> = ({ data }) => {
  if (!data || data.alerts.length === 0) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-brand-orange/10">
        <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-brand-orange" />
            <h3 className="text-lg font-bold text-brand-orange">{data.title}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-white text-brand-orange rounded border border-brand-orange/20 mt-2 sm:mt-0">
             {data.summary}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Burn $</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Burn/GMV</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger Reason</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-brand-orange/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-darkOrange/10 text-brand-darkOrange">
                     <AlertOctagon className="w-3 h-3 mr-1" /> {alert.status}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-bold text-brand-dark">{alert.brandName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <div className="text-sm font-medium text-brand-dark flex items-center justify-end">
                       <Flame className="w-3 h-3 text-brand-orange mr-1" />
                       {formatCurrency(alert.burnAmount)}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                    {alert.burnGmvRatio.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {alert.share.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-brand-dark font-medium">
                    {alert.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-darkOrange font-medium">
                    {alert.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoSafeguardTable;