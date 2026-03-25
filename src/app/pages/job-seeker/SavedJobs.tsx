import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/button';
import savedJobsAPI from '../../api/savedJobsAPI';
import { Bookmark, Loader2, Search } from 'lucide-react';
import { mockJobs } from '../../data/mockData';

interface SavedJob {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    jobType: string;
    salary?: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    postedAt: string;
  };
  savedAt: string;
}

export function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await savedJobsAPI.getSavedJobs();
      const sj = response.data.savedJobs || [];
      if (sj.length === 0) {
        setSavedJobs(mockJobs.filter(j => j.saved).map(j => ({
          _id: j.id,
          jobId: {
              ...j,
              _id: j.id,
              jobType: j.type,
              postedAt: new Date().toISOString()
          },
          savedAt: new Date().toISOString()
        })) as any);
      } else {
        setSavedJobs(sj);
      }
    } catch (err) {
      setSavedJobs(mockJobs.filter(j => j.saved).map(j => ({
        _id: j.id,
        jobId: {
            ...j,
            _id: j.id,
            jobType: j.type,
            postedAt: new Date().toISOString()
        },
        savedAt: new Date().toISOString()
      })) as any);
    } finally {
      setLoading(false);
    }
  };

  const convertToJobCard = (savedJob: SavedJob) => ({
    id: savedJob.jobId._id,
    title: savedJob.jobId.title,
    company: savedJob.jobId.company,
    companyLogo: savedJob.jobId.companyLogo,
    location: savedJob.jobId.location,
    type: savedJob.jobId.jobType,
    salary: savedJob.jobId.salary || 'Salary not specified',
    description: savedJob.jobId.description,
    requirements: savedJob.jobId.requirements || [],
    benefits: savedJob.jobId.benefits || [],
    postedDate: new Date(savedJob.jobId.postedAt).toLocaleDateString(),
    saved: true
  });

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-[#000000E0]">Saved jobs</h1>
          <p className="text-sm text-[#00000099] mt-1">Keep track of the opportunities you're interested in.</p>
        </div>

        {/* Jobs Grid */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
              <p className="text-sm text-[#00000099]">Loading saved jobs...</p>
            </div>
          ) : savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {savedJobs.map(job => (
                <JobCard key={job._id} job={convertToJobCard(job)} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Bookmark className="w-16 h-16 text-[#0000000D] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#000000E0]">No saved jobs yet</h3>
              <p className="text-sm text-[#00000099] max-w-xs mx-auto mb-8">Save jobs while browsing to keep them here and apply later.</p>
              <Link to="/jobs">
                <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 font-semibold">
                  Browse jobs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
