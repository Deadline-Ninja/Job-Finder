import { useState } from 'react';
import { JobMarker } from './JobMarker';
import { JobPopup } from './JobPopup';
import { Job } from '../data/mockData';

interface JobMapProps {
  jobs: Job[];
  center?: { lat: number; lng: number };
}

export function JobMap({ jobs, center = { lat: 37.7749, lng: -122.4194 } }: JobMapProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const selectedJobData = jobs.find(j => j.id === selectedJob);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] rounded-xl overflow-hidden">
      {/* Simulated map background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full opacity-20">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-[#000000]/10" />
          ))}
        </div>
        
        {/* Abstract roads */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <path d="M0,50 Q25,45 50,50 T100,50" stroke="#000000" strokeWidth="2" fill="none" />
          <path d="M30,0 Q35,25 30,50 T35,100" stroke="#000000" strokeWidth="1.5" fill="none" />
          <path d="M70,0 Q65,25 70,50 T65,100" stroke="#000000" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Job Markers */}
      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="absolute"
          style={{
            left: `${20 + (index % 5) * 15}%`,
            top: `${20 + Math.floor(index / 5) * 20}%`,
          }}
        >
          <JobMarker
            job={job}
            isActive={selectedJob === job.id}
            onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
          />
        </div>
      ))}

      {/* Job Popup */}
      {selectedJobData && (
        <JobPopup 
          job={selectedJobData} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-[#000000]/5 transition-colors">
          <span className="text-black font-bold">+</span>
        </button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-[#000000]/5 transition-colors">
          <span className="text-black font-bold">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white border border-[#E5E7EB] backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-[#6B7280]">
        <span className="font-medium">{jobs.length}</span> jobs in this area
      </div>
    </div>
  );
}
