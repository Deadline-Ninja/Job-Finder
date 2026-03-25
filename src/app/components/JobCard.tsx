import { Link } from 'react-router';
import { MapPin, Clock, Briefcase, Bookmark, BookmarkCheck, Loader2, CheckCircle } from 'lucide-react';
import { Job } from '../data/mockData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import savedJobsAPI from '../api/savedJobsAPI';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [saved, setSaved] = useState(job.saved || false);
  const [loading, setLoading] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (saved) {
        setSaved(false);
        toast.info('Job removed from saved list');
      } else {
        setSaved(true);
        toast.success('Job saved successfully!');
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white border border-[#00000014] rounded-md p-4 hover:bg-[#F3F2EF] transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <img 
          src={job.companyLogo} 
          alt={job.company}
          className="w-12 h-12 rounded-none object-cover border border-[#00000014]"
        />
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-base font-semibold text-[#0A66C2] hover:underline truncate">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-[#000000E0] truncate">{job.company}</p>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-[#00000099]">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-[#057642] font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Actively hiring</span>
          </div>
          <div className="mt-2 text-xs text-[#00000099]">
            {job.postedDate}
          </div>
        </div>
        <button
          onClick={handleToggleSave}
          disabled={loading}
          className="text-[#00000099] hover:text-[#000000E0] p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 fill-[#0A66C2] text-[#0A66C2]" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
