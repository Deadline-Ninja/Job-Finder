import axiosInstance from './axiosInstance';

export interface CompanyResponse {
  _id: string;
  name: string;
  logo?: string;
  coverImage?: string;
  industry: string;
  location: string;
  website?: string;
  description?: string;
  employees?: string;
  size?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  photos?: string[];
  isVerified: boolean;
  openPositions?: number;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesListResponse {
  success: boolean;
  count: number;
  companies: CompanyResponse[];
}

export const getCompanies = (params = {}): Promise<{ data: CompaniesListResponse }> => 
  axiosInstance.get('/companies', { params });

export const getCompanyById = (id: string): Promise<{ data: { success: boolean, company: CompanyResponse } }> => 
  axiosInstance.get(`/companies/${id}`);

export const getFeaturedCompanies = (): Promise<{ data: { success: boolean, companies: CompanyResponse[] } }> => 
  axiosInstance.get('/companies/featured');

export const createCompany = (data: any): Promise<{ data: { success: boolean, company: CompanyResponse } }> => 
  axiosInstance.post('/companies', data);

export const updateCompany = (id: string, data: any): Promise<{ data: { success: boolean, company: CompanyResponse } }> => 
  axiosInstance.put(`/companies/${id}`, data);

export const getCompanyReviews = (id: string, params = {}): Promise<{ data: any }> => 
  axiosInstance.get(`/companies/${id}/reviews`, { params });

export default {
  getCompanies,
  getCompanyById,
  getFeaturedCompanies,
  createCompany,
  updateCompany,
  getCompanyReviews
};
