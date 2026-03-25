import axiosInstance from './axiosInstance';
import { JobResponse } from './jobsAPI';
import { UserResponse } from './authAPI';

export interface ApplicationResponse {
  _id: string;
  jobId: string | JobResponse;
  userId: string | UserResponse;
  resume?: string;
  coverLetter?: string;
  status: 'Applied' | 'Viewed' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  notes?: string;
  timeline?: Array<{
    status: string;
    note?: string;
    date: string;
  }>;
  appliedAt: string;
  updatedAt: string;
}

export interface ApplicationsListResponse {
  success: boolean;
  count: number;
  applications: ApplicationResponse[];
}

export const applyJob = (data: any): Promise<{ data: { success: boolean, application: ApplicationResponse } }> => 
  axiosInstance.post('/applications', data);

export const getMyApplications = (params = {}): Promise<{ data: ApplicationsListResponse }> => 
  axiosInstance.get('/applications/my', { params });

export const getApplicationById = (id: string): Promise<{ data: { success: boolean, application: ApplicationResponse } }> => 
  axiosInstance.get(`/applications/${id}`);

export const updateApplicationStatus = (id: string, data: any): Promise<{ data: { success: boolean, application: ApplicationResponse } }> => 
  axiosInstance.put(`/applications/${id}`, data);

export const withdrawApplication = (id: string): Promise<{ data: { success: boolean, message: string } }> => 
  axiosInstance.delete(`/applications/${id}`);

export const getJobApplications = (jobId: string, params = {}): Promise<{ data: ApplicationsListResponse }> => 
  axiosInstance.get(`/applications/job/${jobId}`, { params });

export const getAllEmployerApplications = (params = {}): Promise<{ data: ApplicationsListResponse }> => 
  axiosInstance.get('/applications/employer/all', { params });

export default {
  applyJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications,
  getAllEmployerApplications
};
