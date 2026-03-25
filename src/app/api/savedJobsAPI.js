import axiosInstance from './axiosInstance';

export const getSavedJobs = () => axiosInstance.get('/saved-jobs');
export const saveJob = (jobId) => axiosInstance.post('/saved-jobs', { jobId });
export const removeSavedJob = (id) => axiosInstance.delete(`/saved-jobs/${id}`);
export const checkIfSaved = (jobId) => axiosInstance.get(`/saved-jobs/check/${jobId}`);

// For backwards compatibility
export default {
  getSavedJobs,
  saveJob,
  removeSavedJob,
  checkIfSaved
};
