import { useState, useEffect } from 'react';
import * as jobsAPI from '../api/jobsAPI';

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsAPI.getJobs(filters);
      setJobs(res.data.jobs || res.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters)]);

  return { jobs, loading, error, pagination, refetch: fetchJobs };
};

export const useJob = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobsAPI.getJobById(id);
        setJob(res.data.job || res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  return { job, loading, error };
};

export const useFeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getFeaturedJobs()
      .then(res => setJobs(res.data.jobs || res.data))
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
};
