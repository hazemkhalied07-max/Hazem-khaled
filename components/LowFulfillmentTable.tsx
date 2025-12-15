import React from 'react';
import { LowFulfillmentStore } from '../types';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface Props {
  data: LowFulfillmentStore[];
}

const LowFulfillmentTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-red-50">
        <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Highest Missed Orders (Today)</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-white text-red-700 rounded border border-red-200">
            Top 10
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Rank</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Missed Orders</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((store) => (
              <tr key={store.id} className="hover:bg-red-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-800 text-sm">
                    {store.rank}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{store.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {store.missedOrders}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="w-full max-w-xs">
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm font-bold ${store.fulfillmentRate < 50 ? 'text-red-600' : store.fulfillmentRate < 90 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                {store.fulfillmentRate.toFixed(2)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${store.fulfillmentRate < 50 ? 'bg-red-500' : store.fulfillmentRate < 90 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${store.fulfillmentRate}%` }}
                            ></div>
                        </div>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowFulfillmentTable;