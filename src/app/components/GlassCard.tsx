import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div 
      className={`
        relative bg-white border border-black/10 rounded-sm shadow-sm
        ${hover ? 'hover:shadow-xl hover:scale-[1.01] transition-all duration-300 hover:border-black/30' : ''}
        ${className}
      `}
    >
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
