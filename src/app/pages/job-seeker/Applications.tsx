import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, Trash2, Loader2, Search, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import applicationsAPI from '../../api/applicationsAPI';
import { mockApplications } from '../../data/mockData';

export function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationsAPI.getMyApplications();
      const apps = response.data.applications || [];
      if (apps.length === 0) {
        setApplications(mockApplications.map(app => ({
          ...app,
          _id: app.id,
          jobId: {
              title: app.jobTitle,
              company: app.company,
              companyLogo: app.companyLogo,
              location: 'Remote'
          },
          appliedAt: app.appliedDate
        })));
      } else {
        setApplications(apps);
      }
    } catch (err) {
      setApplications(mockApplications.map(app => ({
        ...app,
        _id: app.id,
        jobId: {
            title: app.jobTitle,
            company: app.company,
            companyLogo: app.companyLogo,
            location: 'Remote'
        },
        appliedAt: app.appliedDate
      })));
    } finally {
      setLoading(false);
    }
  };

  const deleteApplicationFromHistory = (id: string) => {
    if (!window.confirm('Remove from history?')) return;
    setApplications(applications.filter(app => app._id !== id));
    toast.success('Removed from history');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview': return <Badge className="bg-green-50 text-green-700 border-none rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase">Interview</Badge>;
      case 'shortlisted': return <Badge className="bg-blue-50 text-blue-700 border-none rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase">Shortlisted</Badge>;
      case 'rejected': return <Badge className="bg-red-50 text-red-700 border-none rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase">Rejected</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-none rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase">Applied</Badge>;
    }
  };

  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => {
        if (activeTab === 'pending') return ['Applied', 'Viewed', 'pending'].includes(app.status.toLowerCase());
        if (activeTab === 'reviewing') return app.status.toLowerCase() === 'shortlisted';
        if (activeTab === 'interview') return app.status.toLowerCase() === 'interview';
        return true;
      });

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-[#000000E0]">My applications</h1>
          <p className="text-sm text-[#00000099] mt-1">Track the status of jobs you've applied to.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="bg-white p-1 rounded-md border border-[#00000014] flex gap-1">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'all' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>All</button>
            <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'pending' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Pending</button>
            <button onClick={() => setActiveTab('reviewing')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'reviewing' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Reviewing</button>
            <button onClick={() => setActiveTab('interview')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'interview' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Interview</button>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
              <p className="text-sm text-[#00000099]">Loading your applications...</p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="divide-y divide-[#0000000D]">
              {filteredApplications.map((app) => (
                <div key={app._id} className="p-6 hover:bg-[#F3F2EF] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-sm border border-[#00000014] flex items-center justify-center text-[#0A66C2] overflow-hidden">
                      {app.jobId?.companyLogo ? (
                        <img src={app.jobId.companyLogo} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="font-bold text-lg">{app.jobId?.company?.charAt(0) || 'J'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A66C2] hover:underline cursor-pointer">
                        {app.jobId?.title || 'Job Title'}
                      </h4>
                      <p className="text-xs text-[#000000E0]">{app.jobId?.company || 'Company'}</p>
                      <p className="text-xs text-[#00000099] mt-1">{app.jobId?.location || 'Remote'}</p>
                      <div className="mt-2">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:text-right">
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-[#00000099] uppercase font-bold tracking-wider">Applied</p>
                      <p className="text-xs font-semibold text-[#00000099]">{new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-white rounded-full">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#00000099] hover:text-red-500 hover:bg-white rounded-full"
                        onClick={() => deleteApplicationFromHistory(app._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-white rounded-full">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Search className="w-16 h-16 text-[#0000000D] mx-auto mb-4" />
              <p className="text-sm text-[#00000099]">No applications found here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
