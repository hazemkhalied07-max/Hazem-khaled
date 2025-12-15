import React from 'react';
import { MissedOrdersData } from '../types';
import { Ban, CheckCircle, Clock, ShoppingCart, AlertCircle } from 'lucide-react';

interface Props {
  data: MissedOrdersData | null;
}

const MissedOrdersBreakdown: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const totalMissed = data.reasons.reduce((acc, curr) => acc + curr.count, 0);
  const missedRate = data.totalPlaced > 0 ? (totalMissed / data.totalPlaced) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50">
        <div className="flex items-center space-x-2">
            <Ban className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Missed Orders Breakdown</h3>
        </div>
        <span className="text-xs text-gray-500 mt-2 sm:mt-0">
             Date: {data.date}
        </span>
      </div>
      
      <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                  <span className="text-gray-500 text-xs font-bold uppercase mb-1">Total Placed</span>
                  <div className="flex items-center text-gray-900 font-extrabold text-2xl">
                      <ShoppingCart className="w-5 h-5 mr-2 text-gray-400" />
                      {data.totalPlaced.toLocaleString()}
                  </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <span className="text-emerald-700 text-xs font-bold uppercase mb-1">Picked</span>
                  <div className="flex items-center text-emerald-700 font-extrabold text-2xl">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {data.picked.toLocaleString()}
                  </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex flex-col items-center justify-center text-center">
                  <span className="text-purple-700 text-xs font-bold uppercase mb-1">Pending</span>
                  <div className="flex items-center text-purple-700 font-extrabold text-2xl">
                      <Clock className="w-5 h-5 mr-2" />
                      {data.pending.toLocaleString()}
                  </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1">
                      <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-bold">{missedRate.toFixed(1)}%</span>
                  </div>
                  <span className="text-red-700 text-xs font-bold uppercase mb-1">Total Missed</span>
                  <div className="flex items-center text-red-700 font-extrabold text-2xl">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {totalMissed.toLocaleString()}
                  </div>
              </div>
          </div>

          {/* Breakdown List */}
          <div>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
                  Missed Reasons Analysis
              </h4>
              <div className="space-y-4">
                  {data.reasons.sort((a,b) => b.count - a.count).map((item, idx) => {
                      const percentage = totalMissed > 0 ? (item.count / totalMissed) * 100 : 0;
                      return (
                          <div key={idx} className="relative">
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">{item.reason}</span>
                                  <span className="font-bold text-gray-900">{item.count} <span className="text-gray-400 font-normal text-xs ml-1">({percentage.toFixed(1)}%)</span></span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div 
                                      className="bg-red-500 h-2.5 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                  ></div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default MissedOrdersBreakdown;