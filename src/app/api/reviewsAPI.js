import axiosInstance from './axiosInstance';

export const getCompanyReviews = (companyId, params = {}) => axiosInstance.get(`/reviews/company/${companyId}`, { params });
export const createReview = (data) => axiosInstance.post('/reviews', data);
export const updateReview = (id, data) => axiosInstance.put(`/reviews/${id}`, data);
export const deleteReview = (id) => axiosInstance.delete(`/reviews/${id}`);
export const getMyReviews = () => axiosInstance.get('/reviews/my');

// For backwards compatibility
export default {
  getCompanyReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
};
