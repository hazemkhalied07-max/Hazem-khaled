import React from 'react';
import { PromoConcentrationData } from '../types';
import { Layers, Flame, Store, PieChart, Info } from 'lucide-react';

interface Props {
  data: PromoConcentrationData | null;
}

const PromoConcentrationTable: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-purple-50">
        <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-purple-900">{data.title}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-white text-purple-800 rounded border border-purple-200 mt-2 sm:mt-0">
             {data.summary}
        </span>
      </div>

      <div className="divide-y divide-gray-200">
          {data.promos.map((promo) => (
              <div key={promo.id} className="p-6">
                  {/* Promo Header */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-gray-100 rounded text-lg font-mono font-bold text-gray-800 border border-gray-300">
                          {promo.promoCode}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>Total Burn: <strong>{formatCurrency(promo.totalBurn)}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          <PieChart className="w-4 h-4 text-purple-500" />
                          <span>Top 5 Share: <strong>{promo.top5Share}%</strong></span>
                      </div>
                  </div>

                  {/* Stores Table */}
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Burn $</th>
                                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                              {promo.stores.map((store, idx) => (
                                  <tr key={store.id} className="hover:bg-purple-50/50 transition-colors">
                                      <td className="px-4 py-3 whitespace-nowrap">
                                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                              {store.action}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="flex flex-col">
                                              <span className="text-sm font-medium text-gray-900">{store.storeName}</span>
                                              <span className="text-[10px] text-gray-400 font-mono">{store.storeId}</span>
                                          </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-right">
                                          <div className="text-sm font-medium text-gray-900">
                                              {formatCurrency(store.burnAmount)}
                                          </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-right">
                                          <div className="flex items-center justify-end">
                                              <span className="text-sm text-gray-600 mr-2">{store.share.toFixed(2)}%</span>
                                              <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                                  <div 
                                                      className="bg-purple-500 h-1.5 rounded-full" 
                                                      style={{ width: `${Math.min(store.share, 100)}%` }}
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
          ))}
      </div>
    </div>
  );
};

export default PromoConcentrationTable;