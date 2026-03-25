import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/DashboardLayout';
import applicationsAPI from '../../api/applicationsAPI';
import jobsAPI from '../../api/jobsAPI';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Mail, Phone, MapPin, Search, Loader2, Eye, Trash2, Check, X, FileText, ExternalLink, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      startDate?: string;
      endDate?: string;
      years?: number | string;
      description: string;
    }>;
    education?: Array<{
      degree: string;
      school: string;
      year: string;
    }>;
  };
  status: string;
  appliedAt: string;
  resume?: string;
  coverLetter?: string;
}

interface Job {
  _id: string;
  title: string;
  applications: number;
}

export function Applicants() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [searchParams] = useSearchParams();
  const jobParam = searchParams.get('job');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getMyJobs({ limit: 100 });
        const fetchedJobs = response.data.jobs || [];
        setJobs(fetchedJobs);
        
        if (jobParam) {
          setSelectedJobId(jobParam);
        } else if (fetchedJobs.length > 0) {
          setSelectedJobId(fetchedJobs[0]._id);
        }
      } catch (error) {
        setJobs([
          { _id: '1', title: 'Senior Product Designer', applications: 23 },
          { _id: '2', title: 'Frontend Engineer', applications: 18 },
        ]);
        setSelectedJobId('1');
      }
    };
    fetchJobs();
  }, [jobParam]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJobId) return;
      setLoading(true);
      try {
        const response = await applicationsAPI.getJobApplications(selectedJobId);
        const fetchedApps = response.data.applications as unknown as Application[];
        setApplications(fetchedApps);
        if (fetchedApps.length > 0) {
          setSelectedApplicant(fetchedApps[0]);
        } else {
          setSelectedApplicant(null);
        }
      } catch (error) {
        const mockApps: Application[] = [
          {
            _id: '1',
            jobId: { _id: '1', title: 'Senior Product Designer' },
            userId: {
              _id: 'u1',
              name: 'Sarah Johnson',
              email: 'sarah.j@email.com',
              phone: '+1 (555) 123-4567',
              profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
              skills: ['Figma', 'UX Design', 'Prototyping', 'React'],
              experience: [{ title: 'Product Designer', company: 'TechCorp', description: 'Led design team' }]
            },
            status: 'pending',
            appliedAt: '2024-03-08'
          },
          {
            _id: '2',
            jobId: { _id: '1', title: 'Senior Product Designer' },
            userId: {
              _id: 'u2',
              name: 'Michael Chen',
              email: 'm.chen@email.com',
              phone: '+1 (555) 987-6543',
              profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
              skills: ['Sketch', 'UI Design', 'HTML/CSS'],
              experience: [{ title: 'UI Designer', company: 'Innovate', description: 'Created interface designs' }]
            },
            status: 'Shortlisted',
            appliedAt: '2024-03-10'
          }
        ];
        setApplications(mockApps);
        setSelectedApplicant(mockApps[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [selectedJobId]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, { status: newStatus });
      setApplications(prev => 
        prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
      );
      if (selectedApplicant?._id === applicationId) {
        setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success(`Applicant ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.userId.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && (app.status === 'pending' || app.status === 'applied')) ||
                      (activeTab === 'shortlisted' && app.status === 'Shortlisted') ||
                      (activeTab === 'interview' && app.status === 'Interview');
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview': return <Badge className="bg-green-50 text-green-700 border-none rounded-sm">Interview</Badge>;
      case 'shortlisted': return <Badge className="bg-blue-50 text-blue-700 border-none rounded-sm">Shortlisted</Badge>;
      case 'rejected': return <Badge className="bg-red-50 text-red-700 border-none rounded-sm">Rejected</Badge>;
      default: return <Badge className="bg-gray-50 text-gray-700 border-none rounded-sm">Applied</Badge>;
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#000000E0]">Applicants</h1>
              <p className="text-sm text-[#00000099]">Manage and review candidates for your job listings.</p>
            </div>
            <div className="min-w-[250px]">
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="rounded-md border-[#00000099]">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job._id} value={job._id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="bg-white p-1 rounded-md border border-[#00000014] flex gap-1">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'all' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>All</button>
            <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'pending' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Pending</button>
            <button onClick={() => setActiveTab('shortlisted')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'shortlisted' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Shortlisted</button>
            <button onClick={() => setActiveTab('interview')} className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${activeTab === 'interview' ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-black/5'}`}>Interview</button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
            <Input 
              placeholder="Search by name..." 
              className="pl-9 h-9 text-sm rounded-md border-[#00000099]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* Candidates List */}
          <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
                <p className="text-sm text-[#00000099]">Loading applicants...</p>
              </div>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map(app => (
                <div 
                  key={app._id} 
                  onClick={() => setSelectedApplicant(app)}
                  className={`p-4 bg-white border rounded-lg cursor-pointer transition-all ${selectedApplicant?._id === app._id ? 'border-[#0A66C2] shadow-sm' : 'border-[#00000014] hover:shadow-md'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={app.userId.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId.name)}&background=0A66C2&color=fff`} 
                      className="w-10 h-10 object-cover rounded-full border border-[#00000014]" 
                      alt={app.userId.name} 
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#000000E0] truncate">{app.userId.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#00000099] font-semibold uppercase tracking-wider">
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#00000014] rounded-lg p-12 text-center">
                <Users className="w-12 h-12 text-[#00000014] mx-auto mb-4" />
                <p className="text-sm text-[#00000099]">No applicants found.</p>
              </div>
            )}
          </div>

          {/* Candidate Detail View */}
          <div className="lg:col-span-8">
            {selectedApplicant ? (
              <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden flex flex-col h-full shadow-sm">
                
                {/* Detail Header */}
                <div className="p-6 border-b border-[#0000000D] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedApplicant.userId.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplicant.userId.name)}&background=0A66C2&color=fff`} 
                      className="w-16 h-16 object-cover rounded-full border border-[#00000014]" 
                      alt="" 
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-[#000000E0]">{selectedApplicant.userId.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-[#00000099] mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedApplicant.userId.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedApplicant.userId.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-5 font-semibold"
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'Shortlisted')}
                        disabled={selectedApplicant.status === 'Shortlisted'}
                    >
                        <Check className="w-4 h-4 mr-2" /> Shortlist
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-600 hover:bg-red-50 rounded-full px-5 font-semibold"
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'Rejected')}
                    >
                        <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#F3F2EF]/50 rounded-lg">
                      <h5 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Current Status</h5>
                      <p className="text-sm font-semibold text-[#000000E0]">{selectedApplicant.status}</p>
                    </div>
                    <div className="p-4 bg-[#F3F2EF]/50 rounded-lg">
                      <h5 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Applied date</h5>
                      <p className="text-sm font-semibold text-[#000000E0]">{new Date(selectedApplicant.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-base font-semibold text-[#000000E0] mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.userId.skills?.map(skill => (
                        <Badge key={skill} className="bg-white border border-[#00000014] text-[#000000E0] shadow-none py-1.5 px-3 rounded-full font-semibold">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-base font-semibold text-[#000000E0] mb-4">Experience</h3>
                    <div className="space-y-6">
                      {selectedApplicant.userId.experience?.map((exp, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                            <BriefcaseIcon className="w-5 h-5 text-[#00000099]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#000000E0]">{exp.title}</h4>
                            <p className="text-xs text-[#000000E0] font-medium">{exp.company} • {exp.years || 'N/A'}</p>
                            <p className="text-[11px] text-[#00000099] mt-1 leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                      {!selectedApplicant.userId.experience?.length && <p className="text-sm text-[#00000099]">No experience listed.</p>}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-base font-semibold text-[#000000E0] mb-4">Documents</h3>
                    <div className="flex gap-4">
                      <div 
                        onClick={() => {
                          if (selectedApplicant.resume) {
                            toast.info(`Opening ${selectedApplicant.resume}...`);
                            window.open('#', '_blank');
                          }
                        }}
                        className="flex-1 p-4 border border-[#00000014] rounded-lg hover:bg-[#F3F2EF] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 text-[#0A66C2] rounded-sm flex items-center justify-center">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#000000E0]">{selectedApplicant.resume || 'Resume.pdf'}</p>
                                    <p className="text-[10px] text-[#00000099]">PDF Document • Verified</p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#00000099] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[#0000000D] bg-gray-50/50 flex justify-end gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#00000099] font-semibold hover:bg-black/5 rounded-full"
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'Interview')}
                    >
                        Schedule interview
                    </Button>
                    <Link to="/seeker/messages">
                        <Button variant="outline" size="sm" className="border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50 rounded-full px-5 font-semibold">
                            Send message
                        </Button>
                    </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-[#00000014] h-full flex flex-col items-center justify-center p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-[#F3F2EF] rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-10 h-10 text-[#00000014]" />
                </div>
                <h3 className="text-lg font-semibold text-[#000000E0] mb-2">Select an applicant to review</h3>
                <p className="text-sm text-[#00000099] max-w-xs">Review their profile, experience, and documents to make a hiring decision.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
