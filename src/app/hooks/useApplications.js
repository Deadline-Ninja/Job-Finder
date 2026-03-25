import { useState, useEffect } from 'react';
import * as applicationsAPI from '../api/applicationsAPI';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(res => setApplications(res.data.applications || res.data))
      .finally(() => setLoading(false));
  }, []);

  return { applications, loading };
};

export const useJobApplications = (jobId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    applicationsAPI.getJobApplications(jobId)
      .then(res => setApplications(res.data.applications || res.data))
      .finally(() => setLoading(false));
  }, [jobId]);

  return { applications, loading };
};
