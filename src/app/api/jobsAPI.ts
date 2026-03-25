import axiosInstance from './axiosInstance';

export interface JobResponse {
  _id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryMin?: number;
  salaryMax?: number;
  salary?: string;
  location: string;
  lat?: number;
  lng?: number;
  jobType: 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship' | 'Freelance';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive' | 'Intern';
  skills: string[];
  benefits: string[];
  postedBy: string;
  status: 'Active' | 'Closed' | 'Draft' | 'Pending';
  views: number;
  applications: number;
  isFeatured: boolean;
  isRemote: boolean;
  easyApply: boolean;
  postedAt: string;
  updatedAt: string;
}

export interface JobsListResponse {
  success: boolean;
  count: number;
  jobs: JobResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Mock Jobs API with LocalStorage Persistence
const getStorageJobs = () => JSON.parse(localStorage.getItem('jobfinder_jobs') || '[]');
const setStorageJobs = (jobs: any[]) => localStorage.setItem('jobfinder_jobs', JSON.stringify(jobs));

export const getJobs = async (params?: any): Promise<{ data: JobsListResponse }> => {
  const jobs = getStorageJobs();
  // Simple filtering for simulation
  let filtered = jobs.filter((j: any) => j.status === 'Active');
  if (params?.location) filtered = filtered.filter((j: any) => j.location.includes(params.location));
  return { data: { success: true, count: filtered.length, jobs: filtered } };
};

export const getJobById = async (id: string): Promise<{ data: { success: boolean, job: JobResponse } }> => {
  const job = getStorageJobs().find((j: any) => j._id === id);
  if (!job) throw { response: { data: { message: "Job node not found." } } };
  return { data: { success: true, job } };
};

export const createJob = async (data: any): Promise<{ data: { success: boolean, job: JobResponse } }> => {
  const jobs = getStorageJobs();
  const currentUser = JSON.parse(localStorage.getItem('jobfinder_current_user') || '{}');
  const newJob = {
    ...data,
    _id: `JOB-${Math.floor(Math.random() * 100000)}`,
    company: currentUser.name || 'Anonymous Corp',
    postedBy: currentUser.id,
    postedAt: new Date().toISOString(),
    views: 0,
    applications: 0,
    status: 'Active'
  };
  jobs.unshift(newJob);
  setStorageJobs(jobs);
  return { data: { success: true, job: newJob } };
};

export const getMyJobs = async (params?: any): Promise<{ data: JobsListResponse }> => {
  const currentUser = JSON.parse(localStorage.getItem('jobfinder_current_user') || '{}');
  const jobs = getStorageJobs().filter((j: any) => j.postedBy === currentUser.id);
  return { data: { success: true, count: jobs.length, jobs } };
};

export const deleteJob = async (id: string): Promise<{ data: { success: boolean, message: string } }> => {
  const jobs = getStorageJobs().filter((j: any) => j._id !== id);
  setStorageJobs(jobs);
  return { data: { success: true, message: "Job node terminated." } };
};

export const getCompanyJobs = async (companyId: string): Promise<{ data: JobsListResponse }> => {
  const jobs = getStorageJobs().filter((j: any) => j.companyId === companyId);
  return { data: { success: true, count: jobs.length, jobs } };
};

export default {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  deleteJob,
  getCompanyJobs
};
