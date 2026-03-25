import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: 'up' | 'down';
  gradient?: 'gold' | 'dark';
}

export function StatsCard({ icon: Icon, value, label, gradient = 'gold' }: StatsCardProps) {
  const gradientClass = gradient === 'gold' 
    ? 'from-[#2563EB] to-[#B89220]' 
    : 'from-[#000000] to-[#1E293B]';

  return (
    <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight text-black mb-1">
        {value}
      </div>
      <div className="text-sm text-[#6B7280]">{label}</div>
    </div>
  );
}
