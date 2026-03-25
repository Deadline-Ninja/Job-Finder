import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Search, Loader2, SlidersHorizontal, ChevronDown, MapPin, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { JobCard } from '../components/JobCard';
import { JobDetailView } from '../components/JobDetailView';
import jobsAPI from '../api/jobsAPI';
import { mockJobs, Job } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

export function JobsListing() {
  const { user, loading: authLoading } = useAuth() as any;
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'Nepal');
  const [jobType, setJobType] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('jobSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchJobs();
    }
  }, [page, searchParams, user, authLoading, navigate]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let fetchedJobs: Job[] = [];
      try {
        const response = await jobsAPI.getJobs({
          page,
          limit: 20,
          search: searchParams.get('search') || '',
          location: searchParams.get('location') || '',
        });
        const apiJobs = response.data.jobs || [];
        fetchedJobs = apiJobs.map((job: any) => ({
          ...job,
          id: job._id || job.id,
          type: job.jobType || job.type || 'Full-time',
          postedDate: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : (job.postedDate || '1 day ago'),
        }));
      } catch (err) {
        fetchedJobs = mockJobs;
      }
      
      setJobs(fetchedJobs);
      setTotalJobs(fetchedJobs.length);
      
      // Select first job by default on desktop if none selected or if selected job not in new list
      if (fetchedJobs.length > 0) {
        if (!selectedJob || !fetchedJobs.find(j => j.id === selectedJob.id)) {
          setSelectedJob(fetchedJobs[0]);
        }
      } else {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs(mockJobs);
      setSelectedJob(mockJobs[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (search) {
      params.search = search;
      // Update history
      const newHistory = [search, ...searchHistory.filter(s => s !== search)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('jobSearchHistory', JSON.stringify(newHistory));
    }
    if (location) params.location = location;
    setSearchParams(params);
    setPage(1);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('jobSearchHistory');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col pt-14">
      {/* Search Header */}
      <div className="bg-white border-b border-[#00000014] py-3 sticky top-16 z-30">
        <div className="max-w-[1128px] mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099] group-focus-within:text-[#000000E0]" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-10 h-10 border-[#00000099] rounded-md focus:border-black focus:ring-0 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099] group-focus-within:text-[#000000E0]" />
              <Input 
                placeholder="Location (e.g. Kathmandu)"
                className="pl-10 h-10 border-[#00000099] rounded-md focus:border-black focus:ring-0 transition-all text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 h-10 font-semibold w-full md:w-auto">
              Search
            </Button>
          </form>

          {/* Recent Searches Dropdown/Section */}
          {searchHistory.length > 0 && (search === '' || showHistory) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#00000099]">Recent searches:</span>
              {searchHistory.map((term, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="bg-[#F3F2EF] border-transparent hover:border-[#0000004D] text-[#000000E0] cursor-pointer rounded-full px-3 py-1 font-medium transition-all"
                  onClick={() => {
                    setSearch(term);
                    const params: any = { search: term };
                    if (location) params.location = location;
                    setSearchParams(params);
                  }}
                >
                  {term}
                </Badge>
              ))}
              <button 
                onClick={clearHistory}
                className="text-[10px] uppercase font-bold text-[#00000099] hover:text-[#0A66C2] ml-2 tracking-wider"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Pill Section */}
      <div className="bg-white border-b border-[#00000014] py-2">
        <div className="max-w-[1128px] mx-auto px-4 flex flex-wrap items-center gap-2">
          <Button 
            variant={jobType ? "default" : "outline"} 
            size="sm" 
            className={`rounded-full border-[#00000099] font-semibold h-8 text-xs ${jobType ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-[#F3F2EF]'}`}
            onClick={() => setJobType(jobType ? null : 'Full-time')}
          >
            {jobType || 'Job type'} <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          <Button 
            variant={experienceLevel ? "default" : "outline"} 
            size="sm" 
            className={`rounded-full border-[#00000099] font-semibold h-8 text-xs ${experienceLevel ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-[#F3F2EF]'}`}
            onClick={() => setExperienceLevel(experienceLevel ? null : 'Mid-Senior')}
          >
            {experienceLevel || 'Experience level'} <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          <Button 
            variant={isRemote ? "default" : "outline"} 
            size="sm" 
            className={`rounded-full border-[#00000099] font-semibold h-8 text-xs ${isRemote ? 'bg-[#0A66C2] text-white' : 'text-[#00000099] hover:bg-[#F3F2EF]'}`}
            onClick={() => setIsRemote(!isRemote)}
          >
            {isRemote ? 'Remote ON' : 'Remote'}
          </Button>
          
          {(jobType || experienceLevel || isRemote) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setJobType(null);
                setExperienceLevel(null);
                setIsRemote(false);
              }}
              className="text-[#0A66C2] hover:bg-blue-50 font-bold h-8 text-xs flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </Button>
          )}

          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="rounded-full text-[#00000099] hover:bg-black/5 font-semibold h-8 text-xs">
            All filters <SlidersHorizontal className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Main Content: Split Screen Layout */}
      <div className="flex-1 max-w-[1128px] mx-auto w-full px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 h-[calc(100vh-14rem)]">
        
        {/* Left: Job List Column */}
        <div className="md:col-span-5 h-full flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-[#000000E0]">
              {totalJobs} results found
            </h2>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-[#00000014]">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar pb-8">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className={`transition-all rounded-md ${selectedJob?.id === job.id ? 'ring-2 ring-[#0A66C2] shadow-md' : ''}`}
                  >
                    <JobCard job={job} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-[#00000014] p-8 text-center">
                  <p className="text-[#00000099]">No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Job Detail Column */}
        <div className="hidden md:block md:col-span-7 h-full sticky top-[calc(64px+64px)] overflow-hidden">
          <JobDetailView job={selectedJob} loading={loading} />
        </div>

      </div>
    </div>
  );
}
