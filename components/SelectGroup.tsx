import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: LucideIcon;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  value,
  onChange,
  options,
  icon: Icon
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      <label className="text-xs font-bold text-gray-900 uppercase tracking-wider transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 py-3 ${
            Icon ? 'pl-11' : 'px-4'
          } pr-10 shadow-sm hover:border-gray-300 cursor-pointer outline-none`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};