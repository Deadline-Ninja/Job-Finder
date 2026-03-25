import { MapPin, Briefcase, Clock, DollarSign, Bookmark, Share2, Loader2, CheckCircle, Globe, Building2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Job } from '../data/mockData';
import { toast } from 'sonner';

interface JobDetailViewProps {
  job: Job | null;
  loading?: boolean;
}

export function JobDetailView({ job, loading }: JobDetailViewProps) {
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-[#00000014]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg border border-[#00000014] text-center p-8">
        <Briefcase className="w-16 h-16 text-[#00000024] mb-4" />
        <h2 className="text-2xl font-semibold text-[#000000E0] mb-2">Select a job to view details</h2>
        <p className="text-[#00000099]">Search and select a job from the list to see the full description and apply.</p>
      </div>
    );
  }

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      toast.success('Application submitted!');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="p-6 border-b border-[#0000000D] sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex items-start gap-4">
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-14 h-14 rounded-none object-cover border border-[#00000014]"
              />
              <div>
                <h1 className="text-xl font-semibold text-[#000000E0] hover:underline cursor-pointer">
                  {job.title}
                </h1>
                <div className="flex flex-col gap-0.5 mt-1">
                  <div className="text-sm text-[#000000E0] hover:underline cursor-pointer">{job.company}</div>
                  <div className="text-sm text-[#00000099]">{job.location} • {job.postedDate}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-[#00000099] hover:text-[#000000E0] hover:bg-black/5">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-[#00000099] hover:text-[#000000E0] hover:bg-black/5"
                onClick={() => setSaved(!saved)}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-[#0A66C2] text-[#0A66C2]' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#00000099] mb-6">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>101-200 employees</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold"
              onClick={handleApply}
              disabled={applied || applying}
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {applied ? 'Applied' : 'Easy Apply'}
            </Button>
            <Button variant="outline" className="border-[#0A66C2] text-[#0A66C2] hover:bg-[#F3F2EF] rounded-full px-6 font-semibold">
              Save
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-[#000000E0] mb-4">About the job</h2>
            <div className="text-sm text-[#000000E0] leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-[#000000E0] mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#000000E0]">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-[#000000E0] mb-3">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, i) => (
                  <Badge key={i} variant="secondary" className="bg-[#F3F2EF] text-[#00000099] border-none font-medium px-3 py-1">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company Section */}
          <div className="pt-8 border-t border-[#0000000D]">
            <h2 className="text-lg font-semibold text-[#000000E0] mb-4">About the company</h2>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-16 h-16 rounded-none object-cover border border-[#00000014]"
              />
              <div>
                <h3 className="text-base font-semibold text-[#000000E0] hover:underline cursor-pointer">{job.company}</h3>
                <div className="text-sm text-[#00000099]">Technology • San Francisco, CA</div>
                <div className="text-sm text-[#00000099]">1,234 followers</div>
              </div>
            </div>
            <p className="text-sm text-[#000000E0] mb-4 line-clamp-3">
              {job.company} is a leading innovator in their field, dedicated to creating world-class solutions for professionals across the globe.
            </p>
            <Button variant="outline" className="text-[#00000099] hover:bg-[#F3F2EF] rounded-full border-[#00000099]">
              Follow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
