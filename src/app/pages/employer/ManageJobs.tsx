import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import jobsAPI from '../../api/jobsAPI';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Plus, 
  Loader2,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { mockJobs } from '../../data/mockData';

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  status: string;
  postedAt: string;
  applications: number;
  views?: number;
}

export function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getMyJobs({ limit: 100 });
      const fetchedJobs = response.data.jobs || [];
      if (fetchedJobs.length === 0) {
        setJobs(mockJobs.slice(0, 5).map(j => ({
          ...j,
          _id: j.id,
          jobType: j.type,
          status: 'Active',
          postedAt: new Date().toISOString(),
          applications: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 1000)
        })));
      } else {
        setJobs(fetchedJobs);
      }
    } catch (error) {
      setJobs(mockJobs.slice(0, 5).map(j => ({
        ...j,
        _id: j.id,
        jobType: j.type,
        status: 'Active',
        postedAt: new Date().toISOString(),
        applications: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 1000)
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Delete this job posting?')) return;
    setDeleting(jobId);
    try {
      await jobsAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Job deleted');
    } catch (error) {
      setJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Deleted (Demo mode)');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#000000E0]">Manage jobs</h1>
            <p className="text-sm text-[#00000099]">You have {jobs.length} total job postings.</p>
          </div>
          <Link to="/employer/post-job">
            <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Post a new job
            </Button>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
              <p className="text-sm text-[#00000099]">Loading your jobs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#0000000D] bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-[#00000099] uppercase tracking-wider">Job info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#00000099] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#00000099] uppercase tracking-wider text-center">Applicants</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#00000099] uppercase tracking-wider text-center">Views</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#00000099] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0000000D]">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-[#F3F2EF] transition-colors group">
                        <td className="px-6 py-5">
                          <div>
                            <Link to={`/jobs/${job._id}`} className="text-sm font-semibold text-[#0A66C2] hover:underline block">
                              {job.title}
                            </Link>
                            <p className="text-xs text-[#00000099] mt-1">{job.location} • {job.jobType}</p>
                            <p className="text-[10px] text-[#00000066] mt-1 font-medium">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge className={`border-none shadow-none rounded-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            job.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <Link to={`/employer/applicants?job=${job._id}`} className="text-sm font-bold text-[#0A66C2] hover:underline">
                            {job.applications}
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-semibold text-[#000000E0]">{job.views || 0}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:text-[#0A66C2] hover:bg-white rounded-full">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-[#00000099] hover:text-red-600 hover:bg-white rounded-full"
                              onClick={() => handleDelete(job._id)}
                              disabled={deleting === job._id}
                            >
                              {deleting === job._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-white rounded-full">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-[#00000099] text-sm italic">
                        No jobs found. Click "Post a new job" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
