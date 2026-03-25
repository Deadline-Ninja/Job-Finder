import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, Users, Globe, Briefcase, ArrowLeft, Loader2, Plus, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { JobCard } from '../components/JobCard';
import { getCompanyById } from '../api/companiesAPI';
import { getCompanyJobs } from '../api/jobsAPI';
import { mockCompanies, mockJobs, Job, Company } from '../data/mockData';

export function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'jobs'>('home');

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    setLoading(true);
    setError('');
    try {
      let companyData: Company;
      try {
        const companyResponse = await getCompanyById(id);
        companyData = companyResponse.data.company;
      } catch (err) {
        companyData = mockCompanies.find(c => c.id === id) || mockCompanies[0];
      }
      
      setCompany(companyData);

      let jobs: Job[] = [];
      try {
        const jobsResponse = await getCompanyJobs(companyData.name);
        jobs = jobsResponse.data.jobs || [];
      } catch (err) {
        jobs = mockJobs.filter(j => j.company === companyData.name);
      }
      
      setCompanyJobs(jobs.map((job: any) => ({
        ...job,
        id: job._id || job.id,
        type: job.jobType || job.type,
        postedDate: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : job.postedDate,
      })));

    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Company not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-[#F4F2EE]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0A66C2]" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-[#F4F2EE]">
        <div className="text-center bg-white p-8 rounded-lg border border-[#00000014]">
          <h2 className="text-2xl font-semibold text-[#000000E0] mb-4">Company not found</h2>
          <Link to="/companies">
            <Button className="bg-[#0A66C2] text-white rounded-full">Back to Companies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE] pb-12">
      {/* Banner & Header Section */}
      <div className="bg-white border-b border-[#00000014]">
        <div className="max-w-[1128px] mx-auto overflow-hidden rounded-b-lg">
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-blue-100 to-blue-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop" 
              alt="Banner" 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          
          {/* Header Content */}
          <div className="px-6 pb-6 relative">
            {/* Logo Overlap */}
            <div className="absolute -top-16 left-6 p-1 bg-white rounded-sm border border-[#00000014] shadow-sm">
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-32 h-32 object-cover rounded-none"
              />
            </div>
            
            <div className="pt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-semibold text-[#000000E0] mb-1">{company.name}</h1>
                  <p className="text-sm text-[#000000E0] mb-2">{company.industry} • {company.location} • 1,234 followers</p>
                  <p className="text-sm text-[#00000099] mb-4">{company.size} employees on JOBfinder</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full font-semibold px-6">
                      <Plus className="w-4 h-4 mr-2" /> Follow
                    </Button>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-[#0A66C2] text-[#0A66C2] hover:bg-[#F3F2EF] rounded-full font-semibold px-6">
                          Visit website <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="px-6 border-t border-[#00000014]">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('home')}
                className={`py-4 text-sm font-semibold transition-all border-b-2 ${activeTab === 'home' ? 'border-[#057642] text-[#057642]' : 'border-transparent text-[#00000099] hover:text-[#000000E0]'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`py-4 text-sm font-semibold transition-all border-b-2 ${activeTab === 'about' ? 'border-[#057642] text-[#057642]' : 'border-transparent text-[#00000099] hover:text-[#000000E0]'}`}
              >
                About
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`py-4 text-sm font-semibold transition-all border-b-2 ${activeTab === 'jobs' ? 'border-[#057642] text-[#057642]' : 'border-transparent text-[#00000099] hover:text-[#000000E0]'}`}
              >
                Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1128px] mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {activeTab === 'home' && (
              <>
                <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#000000E0] mb-4">Overview</h2>
                  <p className="text-sm text-[#000000E0] leading-relaxed mb-6">
                    {company.description}
                  </p>
                  <Button variant="ghost" className="text-[#0A66C2] hover:bg-blue-50 font-semibold p-0 h-auto">
                    See more
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#000000E0]">Recent Jobs</h2>
                    <button onClick={() => setActiveTab('jobs')} className="text-[#0A66C2] font-semibold hover:underline">See all jobs</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companyJobs.slice(0, 4).map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#000000E0] mb-4">About</h2>
                <div className="space-y-6">
                  <p className="text-sm text-[#000000E0] leading-relaxed">
                    {company.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#00000014]">
                    <div>
                      <h4 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Industry</h4>
                      <p className="text-sm text-[#000000E0]">{company.industry}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Company size</h4>
                      <p className="text-sm text-[#000000E0]">{company.size} employees</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Headquarters</h4>
                      <p className="text-sm text-[#000000E0]">{company.location}</p>
                    </div>
                    {company.website && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#00000099] uppercase tracking-wider mb-2">Website</h4>
                        <a href={company.website} target="_blank" className="text-sm text-[#0A66C2] hover:underline">{company.website}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#000000E0]">All Jobs at {company.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyJobs.length > 0 ? (
                    companyJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-lg border border-[#00000014] p-12 text-center">
                      <Briefcase className="w-12 h-12 text-[#00000024] mx-auto mb-4" />
                      <p className="text-[#00000099]">No open positions at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#000000E0] mb-4">People also viewed</h3>
              <div className="space-y-6">
                {mockCompanies.filter(c => c.id !== id).slice(0, 3).map(c => (
                  <div key={c.id} className="flex gap-3 h-14">
                    <img src={c.logo} alt={c.name} className="w-12 h-12 object-cover border border-[#00000014]" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/companies/${c.id}`} className="text-sm font-semibold text-[#000000E0] hover:text-[#0A66C2] hover:underline truncate block">
                        {c.name}
                      </Link>
                      <p className="text-xs text-[#00000099] truncate">{c.industry}</p>
                      <Button variant="outline" size="sm" className="h-7 rounded-full text-xs border-[#00000099] text-[#00000099] px-4 mt-1">
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
