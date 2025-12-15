import React from 'react';
import { OpsData } from '../types';
import { Activity, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  data: OpsData | null;
}

const OpsMetrics: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  // Determine status color for fulfillment rate
  const fulfillmentColor = data.fulfillmentRate >= 95 
    ? 'text-emerald-600' 
    : data.fulfillmentRate >= 90 
      ? 'text-yellow-600' 
      : 'text-red-600';
      
  const fulfillmentBg = data.fulfillmentRate >= 95 
    ? 'bg-emerald-50' 
    : data.fulfillmentRate >= 90 
      ? 'bg-yellow-50' 
      : 'bg-red-50';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-xl font-bold text-gray-900">Operations Pulse</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <Activity className="w-4 h-4 mr-1.5" />
                <span>Status for: {data.date}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Fulfillment Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-2 h-full ${fulfillmentBg.replace('bg-', 'bg-')}-400`}></div> 
             <div className="flex justify-between items-start mb-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fulfillment Rate</h3>
                 <div className={`p-2 rounded-full ${fulfillmentBg}`}>
                     <CheckCircle className={`w-5 h-5 ${fulfillmentColor}`} />
                 </div>
             </div>
             <div>
                 <div className="flex items-baseline">
                    <span className={`text-4xl font-extrabold ${fulfillmentColor}`}>{data.fulfillmentRate}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                    <div 
                        className={`h-2.5 rounded-full ${fulfillmentBg.replace('bg-', 'bg-slate-').replace('50', '500') === 'bg-slate-500' ? 'bg-emerald-500' : fulfillmentBg.replace('bg-', 'bg-').replace('50', '500')}`} 
                        style={{ width: `${Math.min(data.fulfillmentRate, 100)}%` }}
                    ></div>
                 </div>
                 <p className="text-xs text-gray-400 mt-2">Target: >95%</p>
             </div>
          </div>

          {/* Missed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between border-l-4 border-l-red-500">
             <div className="flex justify-between items-start mb-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Missed Orders</h3>
                 <div className="p-2 rounded-full bg-red-50">
                     <XCircle className="w-5 h-5 text-red-600" />
                 </div>
             </div>
             <div>
                 <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-red-600">{data.missedOrders}</span>
                    <span className="ml-2 text-sm text-gray-500 font-medium">orders</span>
                 </div>
                 <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 inline-block px-2 py-1 rounded">
                    Requires Investigation
                 </p>
             </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between border-l-4 border-l-purple-600">
             <div className="flex justify-between items-start mb-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Orders</h3>
                 <div className="p-2 rounded-full bg-purple-50">
                     <Clock className="w-5 h-5 text-purple-600" />
                 </div>
             </div>
             <div>
                 <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-purple-600">{data.pendingOrders}</span>
                    <span className="ml-2 text-sm text-gray-500 font-medium">orders</span>
                 </div>
                 <p className="text-xs text-purple-500 mt-2 font-medium">
                    Today's Pipeline
                 </p>
             </div>
          </div>

      </div>
    </div>
  );
};

export default OpsMetrics;