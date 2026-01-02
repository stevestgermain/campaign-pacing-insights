import React from 'react';

interface StatBoxProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, subValue, highlight }) => {
  return (
    <div className={`bg-white p-3 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors ${highlight ? 'ring-1 ring-blue-100' : ''}`}>
      <div className="flex flex-col h-full justify-between">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
          {label}
        </span>
        <div>
          <div className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
            {value}
          </div>
          {subValue && (
            <div className="text-xs text-gray-500 font-medium mt-1">
              {subValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
