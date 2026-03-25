import { Link } from 'react-router';
import { MapPin, Users, Briefcase } from 'lucide-react';
import { Company } from '../data/mockData';
import { Button } from './ui/button';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="group bg-white border border-[#00000014] rounded-lg p-4 hover:shadow-md transition-all text-center flex flex-col items-center">
      <img 
        src={company.logo} 
        alt={company.name}
        className="w-16 h-16 rounded-none object-cover border border-[#00000014] mb-3"
      />
      
      <Link to={`/companies/${company.id}`} className="hover:underline">
        <h3 className="text-base font-semibold text-[#000000E0] mb-1 truncate w-full">
          {company.name}
        </h3>
      </Link>
      
      <p className="text-xs text-[#00000099] mb-3 line-clamp-1">{company.industry}</p>
      
      <div className="text-xs text-[#00000099] mb-4 space-y-1">
        <div className="flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{company.location}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Users className="w-3 h-3" />
          <span>{company.size} employees</span>
        </div>
      </div>

      <div className="mt-auto w-full pt-3 border-t border-[#0000000D]">
        <Link to={`/companies/${company.id}`}>
          <Button variant="outline" size="sm" className="w-full rounded-full border-[#0A66C2] text-[#0A66C2] hover:bg-[#F3F2EF] h-8 text-xs font-semibold">
            Follow
          </Button>
        </Link>
      </div>
    </div>
  );
}
