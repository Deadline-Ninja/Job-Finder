import analyticsAPI from '../api/analyticsAPI';
import { useAuth } from './useAuth';

export function useAnalytics(type = 'employer') {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const userId = user?._id;
      if (!userId && type !== 'admin') {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let response;
        if (type === 'employer') {
          response = await analyticsAPI.getEmployerAnalytics(userId);
        } else if (type === 'jobseeker') {
          response = await analyticsAPI.getJobSeekerAnalytics(userId);
        } else if (type === 'admin') {
          response = await analyticsAPI.getAdminAnalytics();
        }
        
        setData(response);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [type, user?._id]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    const fetchAnalytics = async () => {
      const userId = user?._id;
      if (!userId && type !== 'admin') return;
      
      try {
        let response;
        if (type === 'employer') {
          response = await analyticsAPI.getEmployerAnalytics(userId);
        } else if (type === 'jobseeker') {
          response = await analyticsAPI.getJobSeekerAnalytics(userId);
        } else if (type === 'admin') {
          response = await analyticsAPI.getAdminAnalytics();
        }
        
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  };

  return { data, loading, error, refetch };
}

export function useDatabaseTest() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsAPI.testDatabase();
      setStatus(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Database test failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, error, testConnection };
}

export default useAnalytics;
