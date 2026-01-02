import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 ${className}`}>
      <Icon className="w-4 h-4 text-blue-600" />
      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
};