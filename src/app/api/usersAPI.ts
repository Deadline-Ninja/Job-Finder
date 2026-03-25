import axiosInstance from './axiosInstance';
import { UserResponse } from './authAPI';

export interface ProfileResponse {
  success: boolean;
  user: UserResponse;
}

// Mock Users API with LocalStorage Persistence
export const getProfile = async (): Promise<{ data: ProfileResponse }> => {
  const user = JSON.parse(localStorage.getItem('jobfinder_current_user') || 'null');
  return { data: { success: !!user, user: user } };
};

export const updateProfile = async (data: any): Promise<{ data: ProfileResponse }> => {
  const user = JSON.parse(localStorage.getItem('jobfinder_current_user') || '{}');
  const updatedUser = { ...user, ...data };
  localStorage.setItem('jobfinder_current_user', JSON.stringify(updatedUser));
  
  // Also update in the main users list
  const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
  const updatedUsers = users.map((u: any) => u.email === updatedUser.email ? updatedUser : u);
  localStorage.setItem('jobfinder_users', JSON.stringify(updatedUsers));
  
  return { data: { success: true, user: updatedUser } };
};

export const uploadResume = async (formData: FormData) => ({ data: { success: true, resumeUrl: 'mock-resume.pdf' } });
export const updateResume = async (formData: FormData) => ({ data: { success: true, resumeUrl: 'mock-resume.pdf' } });

export default {
  getProfile,
  updateProfile,
  uploadResume,
  updateResume
};

