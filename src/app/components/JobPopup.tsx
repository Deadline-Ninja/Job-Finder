import { Link } from 'react-router';
import { MapPin, Briefcase, Clock, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface JobPopupProps {
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    salary: string;
    postedDate: string;
  };
  onClose: () => void;
}

export function JobPopup({ job, onClose }: JobPopupProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-4 animate-slide-up z-20">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-[#000000]/10 transition-colors"
      >
        <X className="w-4 h-4 text-[#6B7280]" />
      </button>

      <div className="flex items-start gap-4">
        <img 
          src={job.companyLogo}
          alt={job.company}
          className="w-12 h-12 rounded-xl object-cover shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold tracking-tight text-black truncate">
            {job.title}
          </h3>
          <p className="text-sm text-[#6B7280] truncate">{job.company}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm text-[#6B7280]">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {job.type}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {job.postedDate}
        </span>
      </div>

      <div className="mt-3">
        <Badge className="bg-[#2563EB]/10 text-[#2563EB]">
          {job.salary}
        </Badge>
      </div>

      <div className="flex gap-2 mt-4">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button size="sm" className="w-full bg-[#000000] hover:bg-[#1E293B] text-white">
            View Details
          </Button>
        </Link>
        <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}
