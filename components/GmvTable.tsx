import React from 'react';
import { GMVAlert } from '../types';
import { TrendingDown } from 'lucide-react';

interface GmvTableProps {
  data: GMVAlert[];
}

const GmvTable: React.FC<GmvTableProps> = ({ data }) => {
  // Sort by biggest decline percentage
  const sortedData = [...data].sort((a, b) => b.declinePercentage - a.declinePercentage);

  if (sortedData.length === 0) return <div className="p-4 text-gray-500 italic">No significant declines.</div>;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">GMV Drop</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prev / Curr</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((alert) => (
            <tr key={alert.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-brand-dark">{alert.brandName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end text-brand-darkOrange font-bold">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  {alert.declinePercentage.toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                <div className="flex flex-col">
                    <span className="line-through text-xs text-gray-400">{formatCurrency(alert.previousGMV)}</span>
                    <span className="font-medium text-brand-dark">{formatCurrency(alert.currentGMV)}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 break-words max-w-xs">
                {alert.action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GmvTable;