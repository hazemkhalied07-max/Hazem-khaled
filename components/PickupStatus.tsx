import React from 'react';
import { PickupStatusData } from '../types';
import { Store, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  data: PickupStatusData | null;
}

const PickupStatus: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const hasIssues = data.brands.length > 0;
  const statusColor = hasIssues ? 'red' : 'emerald';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full ${hasIssues ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-emerald-500'}`}>
      <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50`}>
        <div className="flex items-center space-x-2">
            <Store className={`w-5 h-5 text-gray-600`} />
            <h3 className="text-lg font-bold text-gray-900">Pickup Availability</h3>
        </div>
        <div className="text-xs text-gray-500">
           {data.generatedAt}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
         {hasIssues ? (
             <>
                <div className="p-3 bg-red-100 rounded-full mb-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-red-700 mb-1">Pickup Closures Detected</h4>
                <p className="text-sm text-gray-600 mb-4">The following brands are closed during working hours:</p>
                <div className="w-full text-left bg-red-50 p-3 rounded-lg border border-red-100">
                    <ul className="list-disc list-inside text-sm text-red-800 font-medium">
                        {data.brands.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>
             </>
         ) : (
             <>
                <div className="p-3 bg-emerald-100 rounded-full mb-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-emerald-700 mb-1">All Systems Operational</h4>
                <p className="text-sm text-gray-500">
                    No brands detected with pickup_closed status during working hours.
                </p>
             </>
         )}
      </div>
    </div>
  );
};

export default PickupStatus;