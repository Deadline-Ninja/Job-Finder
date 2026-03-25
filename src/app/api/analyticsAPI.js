import axiosInstance from './axiosInstance';

export const analyticsAPI = {
  // Get employer analytics
  getEmployerAnalytics: async (employerId) => {
    const response = await axiosInstance.get(`/analytics/employer?employerId=${employerId}`);
    return response.data;
  },

  // Get job seeker analytics
  getJobSeekerAnalytics: async (userId) => {
    const response = await axiosInstance.get(`/analytics/jobseeker?userId=${userId}`);
    return response.data;
  },

  // Get admin analytics
  getAdminAnalytics: async () => {
    const response = await axiosInstance.get('/analytics/admin');
    return response.data;
  },

  // Test database connection
  testDatabase: async () => {
    const response = await axiosInstance.get('/analytics/test');
    return response.data;
  }
};

export default analyticsAPI;
