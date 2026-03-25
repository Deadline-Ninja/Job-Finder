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

// Mock Applications API with LocalStorage Persistence
const getStorageApps = () => JSON.parse(localStorage.getItem('jobfinder_applications') || '[]');
const setStorageApps = (apps: any[]) => localStorage.setItem('jobfinder_applications', JSON.stringify(apps));

export const applyJob = async (data: any): Promise<{ data: { success: boolean, application: ApplicationResponse } }> => {
  const apps = getStorageApps();
  const currentUser = JSON.parse(localStorage.getItem('jobfinder_current_user') || '{}');
  const jobs = JSON.parse(localStorage.getItem('jobfinder_jobs') || '[]');
  const job = jobs.find((j: any) => j._id === data.jobId);
  
  const newApplication = {
    ...data,
    _id: `APP-${Math.floor(Math.random() * 100000)}`,
    userId: {
      _id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.mobile || currentUser.phone,
      profilePhoto: currentUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'U')}&background=0A66C2&color=fff`,
      skills: currentUser.skills || [],
      experience: currentUser.experience || [],
      education: currentUser.education || []
    },
    jobId: {
      _id: job?._id || data.jobId,
      title: job?.title || 'Unknown Position'
    },
    status: 'Applied',
    appliedAt: new Date().toISOString(),
    resume: currentUser.resume || 'mock-resume.pdf',
    updatedAt: new Date().toISOString()
  };
  
  apps.unshift(newApplication);
  setStorageApps(apps);
  return { data: { success: true, application: newApplication as any } };
};

export const getJobApplications = async (jobId: string, params = {}): Promise<{ data: ApplicationsListResponse }> => {
  const apps = getStorageApps().filter((a: any) => a.jobId._id === jobId || a.jobId === jobId);
  return { data: { success: true, count: apps.length, applications: apps } };
};

export const updateApplicationStatus = async (id: string, data: any): Promise<{ data: { success: boolean, application: ApplicationResponse } }> => {
  const apps = getStorageApps();
  const appIndex = apps.findIndex((a: any) => a._id === id);
  if (appIndex === -1) throw { response: { data: { message: "Application node not found." } } };
  
  apps[appIndex] = { 
    ...apps[appIndex], 
    status: data.status, 
    updatedAt: new Date().toISOString() 
  };
  
  setStorageApps(apps);
  return { data: { success: true, application: apps[appIndex] } };
};

export default {
  applyJob,
  getJobApplications,
  updateApplicationStatus
};
