import axiosInstance from './axiosInstance';

/**
 * Types for Auth API
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer';
  profilePhoto?: string;
  profileCompleted?: number;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    title: string;
    years?: number;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field?: string;
    year?: number;
  }>;
  portfolio?: string[];
  resume?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserResponse;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

/**
 * Auth API Services
 */
// Mock Auth API with LocalStorage Persistence
export const registerUser = async (data: any): Promise<{ data: AuthResponse }> => {
  const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
  if (users.find((u: any) => u.email === data.email)) {
    throw { response: { data: { message: "User already signed up. Please login." } } };
  }
  const newUser = { ...data, id: `USR-${Math.floor(Math.random() * 10000)}`, verified: false, kycVerified: false };
  users.push(newUser);
  localStorage.setItem('jobfinder_users', JSON.stringify(users));
  localStorage.setItem('jobfinder_current_user', JSON.stringify(newUser));
  return { data: { success: true, token: 'mock-jwt-token', user: newUser } };
};

export const loginUser = async (data: any): Promise<{ data: AuthResponse }> => {
  const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
  const user = users.find((u: any) => u.email === data.email && u.password === data.password);
  if (!user) {
    throw { response: { data: { message: "Matrix authentication failed: Invalid credentials." } } };
  }
  localStorage.setItem('jobfinder_current_user', JSON.stringify(user));
  return { data: { success: true, token: 'mock-jwt-token', user: user } };
};

export const getCurrentUser = async (): Promise<{ data: { success: boolean, user: UserResponse } }> => {
  const user = JSON.parse(localStorage.getItem('jobfinder_current_user') || 'null');
  return { data: { success: !!user, user: user } };
};

export const updatePassword = async (data: any) => ({ data: { success: true, message: "Password synchronized." } });
export const forgotPassword = async (email: string) => ({ data: { success: true, message: "OTP transmitted." } });
export const resetPassword = async (data: any) => ({ data: { success: true, message: "Node reset successful." } });

