import React from 'react';
import { PendingOrdersData } from '../types';
import { Clock, ListOrdered } from 'lucide-react';

interface Props {
  data: PendingOrdersData | null;
}

const PendingOrdersTable: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-purple-50">
        <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-purple-900">Pending Orders (Today)</h3>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-1 bg-white text-purple-700 rounded border border-purple-200">
                {data.totalPending} Total
            </span>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.topBrands.map((brand, idx) => {
              const percentage = (brand.pendingOrders / data.totalPending) * 100;
              return (
                <tr key={idx} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{brand.brandName}</div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold bg-purple-100 text-purple-800">
                        {brand.pendingOrders}
                     </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap align-middle">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div 
                              className="bg-purple-600 h-1.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                          ></div>
                      </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrdersTable;