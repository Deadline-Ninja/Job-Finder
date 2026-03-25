import { useState, useEffect } from 'react';
import * as companiesAPI from '../api/companiesAPI';

export const useCompanies = (filters = {}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await companiesAPI.getCompanies(filters);
      setCompanies(res.data.companies || res.data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [JSON.stringify(filters)]);

  return { companies, loading, error, refetch: fetchCompanies };
};

export const useCompany = (id) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    companiesAPI.getCompanyById(id)
      .then(res => setCompany(res.data.company || res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { company, loading };
};

export const useFeaturedCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companiesAPI.getFeaturedCompanies()
      .then(res => setCompanies(res.data.companies || res.data))
      .finally(() => setLoading(false));
  }, []);

  return { companies, loading };
};
