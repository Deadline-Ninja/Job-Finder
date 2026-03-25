import axiosInstance from './axiosInstance';

export const getCompanies = (params = {}) => axiosInstance.get('/companies', { params });
export const getCompanyById = (id) => axiosInstance.get(`/companies/${id}`);
export const getFeaturedCompanies = () => axiosInstance.get('/companies/featured');
export const createCompany = (data) => axiosInstance.post('/companies', data);
export const updateCompany = (id, data) => axiosInstance.put(`/companies/${id}`, data);
export const getCompanyReviews = (id, params = {}) => axiosInstance.get(`/companies/${id}/reviews`, { params });

// For backwards compatibility
export default {
  getCompanies,
  getCompanyById,
  getFeaturedCompanies,
  createCompany,
  updateCompany,
  getCompanyReviews
};
