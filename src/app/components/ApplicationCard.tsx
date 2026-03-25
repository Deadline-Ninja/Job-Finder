import { Link } from 'react-router';
import { MapPin, Briefcase, Clock, CheckCircle, XCircle, Hourglass, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Application } from '../data/mockData';

interface ApplicationCardProps {
  application: Application;
  showActions?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Hourglass,
    className: 'bg-yellow-100 text-yellow-700',
  },
  reviewing: {
    label: 'Reviewing',
    icon: Clock,
    className: 'bg-blue-100 text-blue-700',
  },
  interview: {
    label: 'Interview',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  shortlisted: {
    label: 'Shortlisted',
    icon: CheckCircle,
    className: 'bg-blue-50 text-blue-700',
  },
};

export function ApplicationCard({ application, showActions = true }: ApplicationCardProps) {
  const status = (statusConfig as any)[application.status];
  const StatusIcon = status.icon;

  return (
    <div className="group bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img 
            src={application.companyLogo} 
            alt={application.company}
            className="w-14 h-14 rounded-xl object-cover shadow-md"
          />
          <div>
            <Link to={`/jobs/${application.jobId}`}>
              <h3 className="font-bold tracking-tight text-black hover:text-[#2563EB] transition-colors">
                {application.jobTitle}
              </h3>
            </Link>
            <p className="text-[#6B7280]">{application.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Applied {new Date(application.appliedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge className={status.className}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#000000]/10">
          <Link to={`/jobs/${application.jobId}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-black">
              View Job
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-black">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
