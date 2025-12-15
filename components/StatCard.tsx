import React from 'react';
import { TrendingDown, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: 'alert' | 'cart' | 'money' | 'chart';
  color?: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, icon, color = 'blue' }) => {
  
  // Mapping logic to Brand Colors
  const getColorClasses = (c: string) => {
      switch(c) {
          case 'red': 
            return { 
                icon: 'text-brand-darkOrange', 
                bg: 'bg-brand-darkOrange/10', 
                border: 'border-l-brand-darkOrange' 
            };
          case 'purple': 
            return { 
                icon: 'text-brand-purple', 
                bg: 'bg-brand-purple/10', 
                border: 'border-l-brand-purple' 
            };
          case 'orange': 
            return { 
                icon: 'text-brand-orange', 
                bg: 'bg-brand-orange/10', 
                border: 'border-l-brand-orange' 
            };
          case 'yellow': 
             return { 
                icon: 'text-yellow-600', 
                bg: 'bg-yellow-50', 
                border: 'border-l-yellow-500' 
            };
          case 'green':
             return { 
                icon: 'text-emerald-600', 
                bg: 'bg-emerald-50', 
                border: 'border-l-emerald-500' 
            };
          default: // blue fallback or generic
             return { 
                icon: 'text-brand-purple', 
                bg: 'bg-brand-purple/10', 
                border: 'border-l-brand-purple' 
            };
      }
  }

  const { icon: iconClass, bg: bgClass, border: borderClass } = getColorClasses(color);

  const getIcon = () => {
    switch (icon) {
      case 'alert': return <AlertCircle className={`w-5 h-5 ${iconClass}`} />;
      case 'cart': return <ShoppingCart className={`w-5 h-5 ${iconClass}`} />;
      case 'chart': return <TrendingUp className={`w-5 h-5 ${iconClass}`} />;
      case 'money': return <TrendingDown className={`w-5 h-5 ${iconClass}`} />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 ${borderClass} flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-brand-dark mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-full ${bgClass}`}>
          {getIcon()}
        </div>
      </div>
      {subValue && (
        <div className="flex items-center text-sm">
           <span className="text-gray-400 font-medium">{subValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;