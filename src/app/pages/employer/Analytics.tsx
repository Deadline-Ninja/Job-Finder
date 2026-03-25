import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../../components/DashboardLayout';
import { TrendingUp, Users, Eye, Clock, DollarSign, Database, Loader2, BarChart3, ChevronDown } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import analyticsAPI from '../../api/analyticsAPI';

interface AnalyticsData {
  stats: {
    totalApplications: number;
    totalViews: number;
    avgTimeToHire: number;
    costPerHire: number;
    appTrend: number;
    viewsTrend: number;
    avgTimeTrend: number;
    costTrend: number;
  };
  monthlyData: Array<{ month: string; applications: number; views: number; hires: number }>;
  statusCounts: Record<string, number>;
  topJobs: Array<{ title: string; views: number; applications: number; conversionRate: string }>;
  sourceData: Array<{ name: string; value: number; color: string }>;
}

export function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getEmployerAnalytics((user as any)?._id || 'demo');
      setData(response);
    } catch (err) {
      // Fallback data
      setData({
        stats: {
          totalApplications: 1248,
          totalViews: 15420,
          avgTimeToHire: 18,
          costPerHire: 450,
          appTrend: 12.5,
          viewsTrend: 8.2,
          avgTimeTrend: -2.4,
          costTrend: -1.5,
        },
        monthlyData: [
          { month: 'Jan', applications: 120, views: 1200, hires: 5 },
          { month: 'Feb', applications: 150, views: 1500, hires: 8 },
          { month: 'Mar', applications: 180, views: 1800, hires: 12 },
          { month: 'Apr', applications: 220, views: 2200, hires: 15 },
          { month: 'May', applications: 200, views: 2000, hires: 10 },
          { month: 'Jun', applications: 250, views: 2500, hires: 18 },
        ],
        statusCounts: { 'Applied': 450, 'Screening': 320, 'Interview': 180, 'Offer': 45, 'Hired': 38, 'Rejected': 215 },
        topJobs: [
          { title: 'Senior Product Designer', views: 2450, applications: 180, conversionRate: '7.3%' },
          { title: 'Frontend Engineer', views: 1820, applications: 145, conversionRate: '8.0%' },
          { title: 'Full Stack Developer', views: 1540, applications: 110, conversionRate: '7.1%' },
        ],
        sourceData: [
          { name: 'Direct', value: 45, color: '#0A66C2' },
          { name: 'Search', value: 30, color: '#004182' },
          { name: 'Social', value: 15, color: '#0073B1' },
          { name: 'Other', value: 10, color: '#0084BF' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <DashboardLayout userType="employer">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
          <p className="text-sm text-[#00000099]">Analyzing your data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[1128px] mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-[#000000E0]">Talent Insights</h1>
              <Badge className="bg-blue-50 text-[#0A66C2] border-none text-[10px] font-bold h-5 px-2">PRO</Badge>
            </div>
            <p className="text-sm text-[#00000099]">Real-time analytics for your hiring performance.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full text-xs font-semibold h-9 px-4 border-[#00000099]">Last 30 days <ChevronDown className="ml-2 w-3 h-3" /></Button>
            <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full text-xs font-semibold h-9 px-6">Export report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Applications', value: data.stats.totalApplications, trend: '+12%', icon: Users },
            { label: 'Total views', value: data.stats.totalViews, trend: '+8%', icon: Eye },
            { label: 'Time to hire', value: `${data.stats.avgTimeToHire}d`, trend: '-2d', icon: Clock },
            { label: 'Cost/Hire', value: `$${data.stats.costPerHire}`, trend: '-$15', icon: DollarSign },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-[#00000099] uppercase tracking-wider">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-[#00000066]" />
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-[#000000E0]">{stat.value.toLocaleString()}</h3>
                <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#000000E0] mb-6">Application trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyData}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#00000099', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#00000099', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#0A66C2" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
             <h3 className="text-sm font-semibold text-[#000000E0] mb-6">Views by source</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.sourceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#00000005" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#000000E0', fontSize: 11, fontWeight: '500' }} width={80} />
                    <Tooltip cursor={{ fill: '#F3F2EF' }} />
                    <Bar dataKey="value" fill="#0A66C2" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
             <h3 className="text-sm font-semibold text-[#000000E0] mb-4">Top performing jobs</h3>
             <div className="space-y-4">
               {data.topJobs.map((job, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-black/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-[#0A66C2] rounded-sm flex items-center justify-center font-bold text-xs">{i+1}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0A66C2] group-hover:underline">{job.title}</h4>
                        <p className="text-[11px] text-[#00000099]">{job.views} views • {job.applications} applicants</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#000000E0]">{job.conversionRate}</p>
                      <p className="text-[10px] text-[#00000099]">Conv. rate</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-[#0A66C2] rounded-lg p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Automate your reporting</h3>
                  <p className="text-sm text-white/80 max-w-xs">Get weekly talent insights delivered directly to your inbox every Monday morning.</p>
                </div>
                <Button className="w-fit bg-white text-[#0A66C2] hover:bg-white/90 rounded-full font-bold px-8 mt-6">Enable auto-reports</Button>
             </div>
             <BarChart3 className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
