import React from 'react';
import { StopperAlert } from '../types';
import { AlertOctagon, ArrowRight } from 'lucide-react';

interface StopperTableProps {
  data: StopperAlert[];
}

const StopperTable: React.FC<StopperTableProps> = ({ data }) => {
  if (data.length === 0) return <div className="p-4 text-gray-500 italic">No stoppers detected.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Impact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Required</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((alert) => (
            <tr key={alert.id} className="hover:bg-red-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="font-bold text-red-700 text-xs">{alert.brandName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{alert.brandName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{alert.previousOrders}</span>
                    <ArrowRight className="mx-2 w-3 h-3 text-gray-400" />
                    <span className="font-bold text-red-600">0</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  <AlertOctagon className="w-3 h-3 mr-1 self-center" /> STOPPER
                </span>
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

export default StopperTable;