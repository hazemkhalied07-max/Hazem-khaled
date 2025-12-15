import React from 'react';
import { DailyComparisonData } from '../types';
import { Lightbulb, AlertTriangle, ArrowUpRight, Clock } from 'lucide-react';

interface Props {
  data: DailyComparisonData | null;
}

const DailyComparison: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-purple/20 pb-4">
        <div>
            <h2 className="text-xl font-bold text-brand-orange">Overall Performance (Days Comparison)</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>Generated: {data.generatedAt}</span>
            </div>
        </div>
      </div>

      {/* Headline Banner - Koinz Gradient */}
      <div className="bg-gradient-to-r from-brand-orange to-brand-purple rounded-lg p-6 shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
              <ArrowUpRight className="w-48 h-48 -mr-10 -mt-10" />
          </div>
          <div className="relative z-10">
              <span className="inline-block px-2 py-1 rounded bg-white bg-opacity-20 text-xs font-bold uppercase tracking-wider mb-2">Headline</span>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
                  {data.headline}
              </h3>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Insights Column */}
          <div className="bg-white rounded-xl border border-brand-purple/20 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-brand-purple/10 px-6 py-4 border-b border-brand-purple/10 flex items-center">
                  <Lightbulb className="w-5 h-5 text-brand-purple mr-2" />
                  <h4 className="font-bold text-brand-purple">Key Performance Insights</h4>
              </div>
              <div className="p-6 flex-1">
                  <ul className="space-y-4">
                      {data.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">
                                  {idx + 1}
                              </span>
                              <span className="text-brand-dark leading-relaxed text-sm">
                                  {insight}
                              </span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* Anomalies Column */}
          <div className="bg-white rounded-xl border border-brand-darkOrange/20 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-brand-darkOrange/10 px-6 py-4 border-b border-brand-darkOrange/10 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-brand-darkOrange mr-2" />
                  <h4 className="font-bold text-brand-darkOrange">Detected Anomalies</h4>
              </div>
              <div className="p-6 flex-1">
                  {data.anomalies.length > 0 ? (
                      <ul className="space-y-4">
                          {data.anomalies.map((anomaly) => (
                              <li key={anomaly.id} className="bg-brand-darkOrange/5 rounded-lg p-4 border border-brand-darkOrange/10">
                                  <div className="flex items-center mb-1">
                                      <span className="bg-brand-darkOrange/20 text-brand-darkOrange text-xs font-mono px-2 py-0.5 rounded font-bold uppercase">
                                          {anomaly.metric}
                                      </span>
                                  </div>
                                  <p className="text-sm text-brand-dark mt-2">
                                      {anomaly.description}
                                  </p>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                          <p className="text-sm italic">No anomalies detected in this window.</p>
                      </div>
                  )}
              </div>
          </div>

      </div>

    </div>
  );
};

export default DailyComparison;