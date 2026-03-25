import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import * as jobsAPI from '../../api/jobsAPI';

export function PostJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    jobType: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: '',
    experienceLevel: '',
    skills: '',
    isRemote: false,
    workplaceType: 'on-site'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        jobType: formData.jobType,
        location: formData.location,
        salaryMin: 0,
        salaryMax: 0,
        salary: 'Negotiable',
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.requirements.split('\n').filter(r => r.trim()),
        benefits: formData.benefits.split('\n').filter(b => b.trim()),
        experienceLevel: formData.experienceLevel,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        isRemote: formData.isRemote || formData.workplaceType === 'remote',
        status: 'Active'
      };

      await jobsAPI.createJob(jobData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.title && formData.jobType && formData.location && formData.workplaceType;

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[800px] mx-auto pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#00000099]" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-[#000000E0]">Post a job</h1>
          </div>
          <div className="text-sm text-[#00000099]">Step {step} of 2</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-[#00000014] p-8 shadow-sm">
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#000000E0] mb-1">Job basics</h2>
                  <p className="text-sm text-[#00000099] mb-6">Tell us about the role you're hiring for.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-[#000000E0]">Job title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="rounded-md border-[#00000099] h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="workplaceType" className="text-sm font-semibold text-[#000000E0]">Workplace type</Label>
                    <Select 
                      value={formData.workplaceType} 
                      onValueChange={(val) => handleSelectChange('workplaceType', val)}
                    >
                      <SelectTrigger className="rounded-md border-[#00000099] h-11">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-[#000000E0]">Job location</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="rounded-md border-[#00000099] h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-sm font-semibold text-[#000000E0]">Job type</Label>
                  <Select 
                    value={formData.jobType} 
                    onValueChange={(val) => handleSelectChange('jobType', val)}
                  >
                    <SelectTrigger className="rounded-md border-[#00000099] h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#000000E0] mb-1">Job details</h2>
                  <p className="text-sm text-[#00000099] mb-6">Describe the role and the person you're looking for.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-[#000000E0]">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the job, impact, and daily tasks..."
                    className="rounded-md border-[#00000099] min-h-[200px] resize-none focus:border-[#0A66C2] focus:ring-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-semibold text-[#000000E0]">Skills (comma separated)</Label>
                  <Input 
                    id="skills" 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Project Management..."
                    className="rounded-md border-[#00000099] h-11"
                  />
                  <p className="text-[11px] text-[#00000099]">Adding skills helps us match your job with the right candidates.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-sm font-semibold text-[#000000E0]">Requirements (one per line)</Label>
                  <Textarea 
                    id="requirements" 
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="3+ years experience&#10;BS in Computer Science..."
                    className="rounded-md border-[#00000099] min-h-[120px] resize-none focus:border-[#0A66C2] focus:ring-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center bg-white rounded-lg border border-[#00000014] p-4 shadow-sm">
            <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate('/employer/dashboard')}
                className="text-[#00000099] font-semibold hover:bg-black/5 rounded-full px-6"
            >
                Cancel
            </Button>
            
            <div className="flex gap-3">
                {step === 1 ? (
                    <Button 
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid}
                        className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 font-semibold shadow-none"
                    >
                        Next
                    </Button>
                ) : (
                    <Button 
                        type="submit"
                        disabled={loading}
                        className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 font-semibold shadow-none"
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Post job
                    </Button>
                )}
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Your job has been posted successfully! Redirecting...</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
