import { useState, useEffect } from 'react';
import * as savedJobsAPI from '../api/savedJobsAPI';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = () => {
    savedJobsAPI.getSavedJobs()
      .then(res => setSavedJobs(res.data.jobs || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const saveJob = async (jobId) => {
    await savedJobsAPI.saveJob(jobId);
    fetchSavedJobs();
  };

  const removeSavedJob = async (jobId) => {
    await savedJobsAPI.removeSavedJob(jobId);
    setSavedJobs(prev => prev.filter(j => j._id !== jobId));
  };

  const isJobSaved = (jobId) => savedJobs.some(j => j._id === jobId);

  return { savedJobs, loading, saveJob, removeSavedJob, isJobSaved, refetch: fetchSavedJobs };
};
