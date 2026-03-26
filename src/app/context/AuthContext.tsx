import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as authAPI from '../api/authAPI';
import { AuthResponse, UserResponse } from '../api/authAPI';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
  profilePhoto?: string;
  companyName?: string;
  kycVerified?: boolean;
  isVerified?: boolean; // OTP verification
  kycDocument?: string; // Filename or path
  mobile?: string;
  preferredJobType?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  uploadKyc: (file: File) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('jobfinder_token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const res = await authAPI.getCurrentUser();
      if (res.data.success && res.data.user) {
        setUser(res.data.user as User);
      } else {
        localStorage.removeItem('jobfinder_token');
        localStorage.removeItem('jobfinder_current_user');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('jobfinder_token');
      localStorage.removeItem('jobfinder_current_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      let loggedInUser: User;
      
      // Social login simulation
      if (credentials.provider) {
        loggedInUser = {
          id: `user-${credentials.provider}`,
          name: credentials.name || `${credentials.provider.charAt(0).toUpperCase() + credentials.provider.slice(1)} User`,
          email: credentials.email || `user@${credentials.provider}.com`,
          role: 'seeker',
          kycVerified: false,
          mobile: '',
          preferredJobType: 'Remote'
        };
        localStorage.setItem('token', `dummy-${credentials.provider}-token`);
        localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
      } 
      // Admin Bypass
      else if (credentials.email === 'admin@jobfinder.com' && credentials.password === 'admin123') {
        loggedInUser = {
          id: 'admin-id',
          name: 'System Administrator',
          email: 'admin@jobfinder.com',
          role: 'admin',
          kycVerified: true
        };
      }
      // Demo Employer Login
      else if (credentials.email === 'employer@demo.com') {
        loggedInUser = {
          id: 'demo-employer-id',
          name: 'Demo Employer',
          email: 'employer@demo.com',
          role: 'employer',
          companyName: 'Demo Corp',
          kycVerified: true,
          isVerified: true,
          mobile: '9812345678',
          preferredJobType: 'Hybrid'
        };
      }
      // Demo Seeker Login
      else if (credentials.email === 'seeker@demo.com') {
        loggedInUser = {
          id: 'demo-seeker-id',
          name: 'Demo Seeker',
          email: 'seeker@demo.com',
          role: 'seeker',
          kycVerified: true,
          isVerified: true,
          mobile: '9812345678',
          preferredJobType: 'Onsite'
        };
      }
      // Actual user login lookup
      else {
        const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
        const existingUser = users.find((u: any) => u.email === credentials.email);
        
        if (existingUser) {
          loggedInUser = existingUser;
        } else {
          throw new Error('User not found. Please register.');
        }
      }

      localStorage.setItem('jobfinder_token', `dummy-token-${Date.now()}`);
      localStorage.setItem('jobfinder_current_user', JSON.stringify(loggedInUser));

      // Also ensure it's in the users list for retrieval
      const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
      if (!users.find((u: any) => u.email === loggedInUser.email)) {
        users.push(loggedInUser);
        localStorage.setItem('jobfinder_users', JSON.stringify(users));
      }


      setUser(loggedInUser);
      return { user: loggedInUser };
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (data: any) => {
    setLoading(true);
    setError(null);
    try {

      const newProfile: User = {
        id: `newuser-${Date.now()}`,
        name: data.name || 'New User',
        email: data.email,
        role: data.role || 'seeker',
        profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${data.email}&backgroundColor=0A66C2`,
        kycVerified: false,
        isVerified: true,
        mobile: '',
        preferredJobType: 'Onsite'
      };
      
      // Store pending user in localStorage (simulating DB)
      const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
      if (users.find((u: any) => u.email === data.email)) {
        throw new Error('User already exists');
      }
      
      users.push(newProfile);
      localStorage.setItem('jobfinder_users', JSON.stringify(users));
      
      return { success: true, email: data.email };
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const storedOtp = localStorage.getItem(`otp_${email}`);
      if (otp === storedOtp || otp === '123456') { // Allow 123456 for demo
        const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === email);
        
        if (userIndex !== -1) {
          users[userIndex].isVerified = true;
          localStorage.setItem('jobfinder_users', JSON.stringify(users));
          
          // Log them in automatically after verification
          const verifiedUser = users[userIndex];
          localStorage.setItem('jobfinder_token', `token-${Date.now()}`);
          localStorage.setItem('jobfinder_current_user', JSON.stringify(verifiedUser));
          setUser(verifiedUser);
          localStorage.removeItem(`otp_${email}`);
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    console.log(`[JOBfinder Security] OTP bypassed for ${email}`);
  };

  const uploadKyc = async (file: File) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = { ...user, kycDocument: file.name, kycVerified: false };
      setUser(updatedUser);
      localStorage.setItem('jobfinder_current_user', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem('jobfinder_users', JSON.stringify(users));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jobfinder_token');
    localStorage.removeItem('jobfinder_current_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, verifyOTP, resendOTP, uploadKyc, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
