import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { TrendingUp, Briefcase, CheckCircle, Clock, Loader2, Bookmark, UserCircle, BriefcaseIcon, MapPin, Search } from 'lucide-react';
import { JobCard } from '../../components/JobCard';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getCurrentUser } from '../../api/authAPI';
import jobsAPI from '../../api/jobsAPI';
import applicationsAPI from '../../api/applicationsAPI';
import savedJobsAPI from '../../api/savedJobsAPI';
import { mockJobs, mockApplications, Job } from '../../data/mockData';

export function JobSeekerDashboard() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [userName, setUserName] = useState('Job Seeker');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      setUserName('John Doe');
      setProfileCompletion(85);
      setApplications(mockApplications.slice(0, 3));
      setSavedJobsCount(12);
      
      let fetchedJobs: Job[] = [];
      try {
        const response = await jobsAPI.getJobs({ limit: 4 });
        fetchedJobs = response.data.jobs || [];
      } catch (err) {
        fetchedJobs = mockJobs;
      }
      
      setRecommendedJobs(fetchedJobs.map((job: any) => ({
        ...job,
        id: job._id || job.id,
        type: job.jobType || job.type,
        postedDate: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : job.postedDate,
      })).slice(0, 3));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Content (Center/Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Activity Banner */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#000000E0]">Top Job Matches for you</h2>
                <Link to="/jobs" className="text-[#0A66C2] font-semibold hover:underline">See all</Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="pb-4 border-b border-[#0000000D] last:border-0 last:pb-0">
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications Activity */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#000000E0]">Recent applications</h2>
                <Link to="/seeker/applications" className="text-[#0A66C2] font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-white border border-[#0000000D] rounded-md hover:bg-[#F3F2EF] transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img src={app.companyLogo} className="w-12 h-12 object-cover border border-[#00000014]" alt={app.company} />
                      <div>
                        <h4 className="text-sm font-semibold text-[#000000E0]">{app.jobTitle}</h4>
                        <p className="text-xs text-[#00000099]">{app.company} • Applied 2 days ago</p>
                      </div>
                    </div>
                    <Badge className="bg-[#05764214] text-[#057642] text-xs px-3 py-1 rounded-sm border-none shadow-none font-semibold uppercase tracking-wider">
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Quick Stats */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-[#000000E0] mb-4">Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#000000E0] group-hover:text-[#0A66C2] group-hover:underline">142</span>
                    <span className="text-xs text-[#00000099]">Profile viewers</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center group cursor-pointer pt-4 border-t border-[#0000000D]">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#000000E0] group-hover:text-[#0A66C2] group-hover:underline">28</span>
                    <span className="text-xs text-[#00000099]">Job applications</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center group cursor-pointer pt-4 border-t border-[#0000000D]">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#000000E0] group-hover:text-[#0A66C2] group-hover:underline">12</span>
                    <span className="text-xs text-[#00000099]">Search appearances</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Suggestion */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-[#000000E0] mb-2">Profile strength: Advanced</h3>
              <Progress value={profileCompletion} className="h-2 mb-4 bg-gray-100" />
              <p className="text-xs text-[#00000099] mb-4">Add your education to improve your profile and visibility to recruiters.</p>
              <Button variant="outline" className="w-full text-sm font-semibold text-[#00000099] border-[#00000099] hover:bg-black/5 rounded-full h-8 px-4">
                Add Education
              </Button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#0000000D]">
              <h3 className="text-sm font-semibold text-[#000000E0]">My items</h3>
            </div>
            <div className="p-2">
              <Link to="/seeker/saved" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#00000099] hover:bg-[#F3F2EF] rounded-md">
                <Bookmark className="w-4 h-4" />
                <span>Saved jobs</span>
                <span className="ml-auto text-xs text-[#00000099]">{savedJobsCount}</span>
              </Link>
              <Link to="/seeker/applications" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#00000099] hover:bg-[#F3F2EF] rounded-md">
                <Briefcase className="w-4 h-4" />
                <span>Learning courses</span>
                <span className="ml-auto text-xs text-blue-600">New</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
