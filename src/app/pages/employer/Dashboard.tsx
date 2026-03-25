import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { TrendingUp, Briefcase, Users, Eye, Loader2, Plus, MapPin, Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCurrentUser } from '../../api/authAPI';
import jobsAPI from '../../api/jobsAPI';
import { getAllEmployerApplications } from '../../api/applicationsAPI';
import { mockJobs, mockApplications } from '../../data/mockData';

export function EmployerDashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    jobViews: 0,
    newApplicants: 0
  });
  const [userName, setUserName] = useState('Employer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demo consistency with LinkedIn UI
      setUserName('Global Tech Solutions');
      setStats({
        activeJobs: 8,
        totalApplicants: 156,
        jobViews: 3240,
        newApplicants: 14
      });

      setRecentJobs(mockJobs.slice(0, 3).map(j => ({
        id: j.id,
        title: j.title,
        location: j.location,
        type: j.type,
        postedDate: j.postedDate,
        applicantCount: Math.floor(Math.random() * 25) + 5
      })));

      setRecentApplicants(mockApplications.slice(0, 5).map(app => ({
        id: app.id,
        candidateName: app.candidateName,
        jobTitle: app.jobTitle,
        status: app.status,
        appliedDate: app.appliedDate
      })));

      setChartData([
        { name: 'Mon', applications: 4 },
        { name: 'Tue', applications: 7 },
        { name: 'Wed', applications: 5 },
        { name: 'Thu', applications: 12 },
        { name: 'Fri', applications: 9 },
        { name: 'Sat', applications: 3 },
        { name: 'Sun', applications: 2 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[1128px] mx-auto space-y-6 pb-12">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#000000E0]">Good morning, {userName}</h1>
              <p className="text-sm text-[#00000099]">Here's what's happening with your hiring process today.</p>
            </div>
            <Link to="/employer/post-job">
              <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold">
                <Plus className="w-4 h-4 mr-2" /> Post a new job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-[#0A66C2]' },
            { label: 'Total applicants', value: stats.totalApplicants, icon: Users, color: 'text-green-600' },
            { label: 'Job views', value: stats.jobViews, icon: Eye, color: 'text-purple-600' },
            { label: 'New this week', value: stats.newApplicants, icon: TrendingUp, color: 'text-orange-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-[#00000099] uppercase tracking-wider">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-[#000000E0]">
                {loading ? '...' : stat.value}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                <TrendingUp className="w-3 h-3" /> +12% from last month
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Analytics Chart */}
            <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#000000E0]">Application trends</h2>
                <button className="text-sm font-semibold text-[#0A66C2] hover:underline">Full report</button>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#00000099' }} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#00000099' }} />
                    <Tooltip cursor={{ fill: '#f3f2ef' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="applications" fill="#0A66C2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#0000000D] flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#000000E0]">Active jobs</h2>
                <Link to="/employer/manage-jobs" className="text-sm font-semibold text-[#0A66C2] hover:underline">Manage all</Link>
              </div>
              <div className="divide-y divide-[#0000000D]">
                {recentJobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-[#F3F2EF] transition-colors cursor-pointer flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#000000E0] hover:text-[#0A66C2] hover:underline">{job.title}</h4>
                      <p className="text-xs text-[#00000099]">{job.location} • Posted {job.postedDate}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#0A66C2]">{job.applicantCount}</p>
                        <p className="text-[10px] text-[#00000099] uppercase font-semibold">Applicants</p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-none shadow-none rounded-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Recent Applicants */}
            <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#0000000D]">
                <h3 className="text-sm font-semibold text-[#000000E0]">Recent applicants</h3>
              </div>
              <div className="divide-y divide-[#0000000D]">
                {recentApplicants.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-[#F3F2EF] transition-colors cursor-pointer flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0A66C2]/10 rounded-sm flex items-center justify-center text-[#0A66C2] font-bold text-sm">
                      {app.candidateName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#000000E0] truncate">{app.candidateName}</p>
                      <p className="text-xs text-[#00000099] truncate">{app.jobTitle}</p>
                      <p className="text-[10px] text-[#0A66C2] font-semibold mt-1">Review applicant</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/employer/applicants" className="block p-3 text-center text-sm font-semibold text-[#00000099] hover:text-[#000000E0] bg-gray-50/50 hover:bg-[#F3F2EF] transition-colors border-t border-[#0000000D]">
                View all applicants
              </Link>
            </div>

            {/* Helpful Links/Tips */}
            <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#000000E0] mb-4">Hiring tips</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#0A66C2] hover:underline cursor-pointer mb-1">How to write effective job descriptions</h4>
                  <p className="text-[11px] text-[#00000099]">Learn how to attract top talent with clear and compelling job postings.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0A66C2] hover:underline cursor-pointer mb-1">Interview best practices</h4>
                  <p className="text-[11px] text-[#00000099]">Tips for conducting meaningful interviews and selecting the best candidates.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
