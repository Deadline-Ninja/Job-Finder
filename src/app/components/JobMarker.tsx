import { MapPin } from 'lucide-react';

interface JobMarkerProps {
  job: {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export function JobMarker({ job, isActive, onClick }: JobMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center transition-all duration-300
        ${isActive ? 'scale-125 z-10' : 'scale-100 hover:scale-110'}
      `}
    >
      {/* Pulse animation for active marker */}
      {isActive && (
        <span className="absolute w-12 h-12 bg-[#2563EB]/30 rounded-full animate-ping" />
      )}
      
      {/* Marker pin */}
      <div 
        className={`
          w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
          ${isActive 
            ? 'bg-[#2563EB] text-white' 
            : 'bg-white text-black hover:bg-[#2563EB] hover:text-white'
          }
        `}
      >
        <MapPin className="w-5 h-5" />
      </div>
      
      {/* Salary label on hover */}
      <div 
        className={`
          absolute -bottom-8 left-1/2 transform -translate-x-1/2 
          px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap
          bg-[#000000] text-white opacity-0 transition-opacity duration-200
          ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}
        `}
      >
        {job.salary}
      </div>
    </button>
  );
}
