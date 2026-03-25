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

export const getJobs = (params?: any): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs', { params });

export const getJobById = (id: string): Promise<{ data: { success: boolean, job: JobResponse } }> => 
  axiosInstance.get(`/jobs/${id}`);

export const getFeaturedJobs = (): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs/featured');

export const getRecommendedJobs = (): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs/recommended');

export const getNearbyJobs = (params?: any): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs/nearby', { params });

export const getJobStats = (): Promise<{ data: { success: boolean, stats: any } }> => 
  axiosInstance.get('/jobs/stats');

export const createJob = (data: any): Promise<{ data: { success: boolean, job: JobResponse } }> => 
  axiosInstance.post('/jobs', data);

export const updateJob = (id: string, data: any): Promise<{ data: { success: boolean, job: JobResponse } }> => 
  axiosInstance.put(`/jobs/${id}`, data);

export const deleteJob = (id: string): Promise<{ data: { success: boolean, message: string } }> => 
  axiosInstance.delete(`/jobs/${id}`);

export const getMyJobs = (params?: any): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs/employer/my-jobs', { params });

export const getCompanyJobs = (companyName: string): Promise<{ data: JobsListResponse }> => 
  axiosInstance.get('/jobs', { params: { company: companyName } });

export default {
  getJobs,
  getJobById,
  getFeaturedJobs,
  getRecommendedJobs,
  getNearbyJobs,
  getJobStats,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getCompanyJobs
};
