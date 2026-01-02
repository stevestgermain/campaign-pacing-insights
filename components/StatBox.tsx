import React from "react";

interface StatBoxProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  subValue,
  highlight
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors ${
        highlight ? "ring-1 ring-blue-100 dark:ring-blue-500/20" : ""
      }`}
    >
      <div className="flex flex-col h-full justify-between">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
          {label}
        </span>
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {value}
          </div>
          {subValue && (
            <div className="text-xs text-gray-500 dark:text-gray-300 font-medium mt-1">
              {subValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
