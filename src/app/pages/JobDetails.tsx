import { useParams, Link, useNavigate } from 'react-router';
import { MapPin, Briefcase, Clock, DollarSign, Bookmark, Share2, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import jobsAPI from '../api/jobsAPI';
import applicationsAPI from '../api/applicationsAPI';
import savedJobsAPI from '../api/savedJobsAPI';
import { toast } from 'sonner';

import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

import { mockJobs } from '../data/mockData';

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState('1');
  const [coverLetter, setCoverLetter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchJob();
    checkIfApplied();
    checkIfSaved();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      try {
        const response = await jobsAPI.getJobById(id!);
        setJob(response.data.job);
      } catch (err: any) {
        console.warn('Backend API failed, searching in mock data for job', id);
        const mockJob = mockJobs.find(j => j.id === id);
        if (mockJob) {
          setJob({
            ...mockJob,
            _id: mockJob.id,
            jobType: mockJob.type,
            postedAt: new Date().toISOString()
          });
        } else {
          setError('Job not found in our records.');
        }
      }
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      const hasApplied = response.data.applications?.some(
        (app: any) => app.jobId?._id === id || app.jobId === id
      );
      setApplied(hasApplied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await savedJobsAPI.getSavedJobs();
      const isSaved = response.data.savedJobs?.some(
        (sj: any) => sj.jobId?._id === id || sj.jobId === id
      );
      setSaved(isSaved);
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setError('');
    try {
      await applicationsAPI.applyJob({ 
        jobId: id,
        resumeId: selectedResume,
        coverLetter: coverLetter
      });
      setApplied(true);
      setShowApplyModal(false);
      toast.success('Successfully applied to this job!');
    } catch (err: any) {
      console.error('Error applying:', err);
      const errorMsg = err.response?.data?.message || 'Failed to apply. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (saved) {
        // Find and remove the saved job
        const response = await savedJobsAPI.getSavedJobs();
        const savedJob = response.data.savedJobs?.find(
          (sj: any) => sj.jobId?._id === id || sj.jobId === id
        );
        if (savedJob) {
          await savedJobsAPI.removeSavedJob(savedJob._id);
        }
        setSaved(false);
        toast.info('Job removed from saved list');
      } else {
        await savedJobsAPI.saveJob(id!);
        setSaved(true);
        toast.success('Job saved successfully!');
      }
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error('Failed to update saved status');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
            Job not found
          </h2>
          <Link to="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const postedDate = new Date(job.postedAt).toLocaleDateString();

  return (
    <div className="min-h-screen py-12 bg-white">
      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Link to="/jobs" className="inline-flex items-center text-[#6B7280] hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                <img 
                  src={job.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'} 
                  alt={job.company}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100"
                />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-black mb-2 flex flex-wrap items-center gap-3" id="job-details-title">
                    {job.title}
                    {job.isVerified && (
                      <Badge className="bg-blue-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        Verified Job
                      </Badge>
                    )}
                  </h1>
                  <p className="text-xl text-[#6B7280] mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                      {job.branch && (
                        <Badge variant="outline" className="text-[10px] ml-1 border-[#2563EB]/20 text-[#2563EB] font-bold uppercase tracking-widest px-1 py-0">
                          {job.branch} Branch
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Posted {postedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary || 'Salary not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  disabled={saving}
                  className={saved ? 'border-[#2563EB] text-[#2563EB]' : 'border-[#E5E7EB] text-gray-400 hover:text-black'}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#2563EB]' : ''}`} />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white border-none shadow-lg shadow-blue-500/20"
                onClick={() => setShowApplyModal(true)}
                disabled={applied || applying}
              >
                {applying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : applied ? (
                  'Application Submitted ✓'
                ) : (
                  'Apply Now'
                )}
              </Button>
              {job.companyId && (
                <Link to={`/companies/${job.companyId._id || job.companyId}`}>
                  <Button size="lg" variant="outline" className="text-black border-[#E5E7EB] hover:bg-gray-50">
                    View Company
                  </Button>
                </Link>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                {error}
              </div>
            )}

            {applied && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
                ✓ Your application has been submitted successfully! We'll notify you of any updates.
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                  Job Description
                </h2>
                <p className="text-[#6B7280] leading-relaxed">
                  {job.description}
                </p>
              </GlassCard>
            </motion.div>

            {job.requirements && job.requirements.length > 0 && (
              <motion.div variants={itemVariants}>
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full mt-2" />
                        <span className="text-[#6B7280]">{req}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <motion.div variants={itemVariants}>
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                    Benefits
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-[#2563EB] border-none font-medium px-4 py-2 text-sm">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6">
                <h3 className="font-bold tracking-tight text-black mb-4">
                  Quick Apply
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Submit your application with one click if you have a profile.
                </p>
                <Button 
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/10"
                  onClick={handleApply}
                  disabled={applied || applying}
                >
                  {applied ? 'Applied ✓' : 'Quick Apply'}
                </Button>
              </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <GlassCard className="p-6">
                <h3 className="font-bold tracking-tight text-black mb-4">
                  Job Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[#6B7280] mb-1">Applicants</div>
                    <div className="text-lg font-semibold text-black">{job.applications || 0} people</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6B7280] mb-1">Posted</div>
                    <div className="text-lg font-semibold text-black">{postedDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6B7280] mb-1">Experience Level</div>
                    <div className="text-lg font-semibold text-black">{job.experienceLevel || 'Not specified'}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <GlassCard className="p-6">
                <h3 className="font-bold tracking-tight text-black mb-2">
                  Not the right fit?
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Explore similar opportunities
                </p>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-[#E5E7EB] text-black hover:bg-gray-50">
                    View Similar Jobs
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              at {job.company} • {job.location}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {!user?.kycVerified && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">KYC Verification Recommended</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Verified profiles are 3x more likely to get shortlisted. You can still apply, but we recommend completing your KYC first.
                  </p>
                  <Link to="/seeker/profile" className="text-xs font-bold text-amber-900 underline mt-2 block">
                    Verify Now →
                  </Link>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Select Resume</Label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
              >
                <option value="1">Resume_2024_ProductDesign.pdf (Default)</option>
                <option value="2">Resume_Frontend_Developer.pdf</option>
                <option value="new">+ Upload New Resume</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <textarea 
                id="coverLetter"
                className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Briefly explain why you are a good fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyModal(false)} className="rounded-full">Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
