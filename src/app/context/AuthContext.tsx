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
  mobile?: string;
  preferredJobType?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const mockUser = localStorage.getItem('mockUser');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    if (mockUser && token.startsWith('dummy-')) {
      setUser(JSON.parse(mockUser));
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getCurrentUser();
      setUser(res.data.user as User);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('mockUser');
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
          name: `${credentials.provider.charAt(0).toUpperCase() + credentials.provider.slice(1)} User`,
          email: `user@${credentials.provider}.com`,
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
        localStorage.setItem('token', 'dummy-admin-token');
        localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
      }
      // Generic login fallback
      else {
        loggedInUser = {
          id: `user-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'seeker',
          profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${credentials.email}&backgroundColor=0A66C2`,
          kycVerified: false,
          mobile: credentials.email.includes('user') ? '9812345678' : '',
          preferredJobType: 'Hybrid'
        };
        localStorage.setItem('token', `dummy-generic-token`);
        localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
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
        mobile: '',
        preferredJobType: 'Onsite'
      };
      
      localStorage.setItem('token', `dummy-reg-token-${Date.now()}`);
      localStorage.setItem('mockUser', JSON.stringify(newProfile));
      setUser(newProfile);
      return { user: newProfile };
    } catch (err) {
      setError('Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
