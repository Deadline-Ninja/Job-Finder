import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getJobs,
  getJobById,
  getFeaturedJobs,
  getRecommendedJobs,
  getNearbyJobs,
  getJobStats,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} from '../../app/api/jobsAPI.js';

vi.mock('../../app/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

import axiosInstance from '../../app/api/axiosInstance.js';

describe('Jobs API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== GET JOBS ====================
  describe('getJobs', () => {
    it('should fetch all jobs with default filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          jobs: [
            { id: '1', title: 'Frontend Developer', company: 'Tech Corp' },
            { id: '2', title: 'Backend Developer', company: 'Dev Inc' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs', { params: {} });
      expect(result.data.success).toBe(true);
      expect(result.data.jobs).toHaveLength(2);
    });

    it('should fetch jobs with filters', async () => {
      const filters = {
        search: 'developer',
        location: 'New York',
        type: 'full-time',
        category: 'IT'
      };

      const mockResponse = {
        data: {
          success: true,
          jobs: [{ id: '1', title: 'Frontend Developer' }],
          total: 1
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobs(filters);

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs', { params: filters });
      expect(result.data.jobs).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      const filters = { page: 1, limit: 10 };

      const mockResponse = {
        data: {
          success: true,
          jobs: [],
          total: 0,
          page: 1,
          pages: 0
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobs(filters);

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs', { params: filters });
      expect(result.data.page).toBe(1);
    });

    it('should handle server error', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getJobs()).rejects.toEqual(mockError);
    });
  });

  // ==================== GET JOB BY ID ====================
  describe('getJobById', () => {
    it('should fetch job by valid ID', async () => {
      const jobId = '1';

      const mockResponse = {
        data: {
          success: true,
          job: {
            id: jobId,
            title: 'Frontend Developer',
            company: 'Tech Corp',
            description: 'Job description',
            requirements: ['React', 'TypeScript']
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobById(jobId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${jobId}`);
      expect(result.data.job.id).toBe(jobId);
    });

    it('should handle job not found', async () => {
      const jobId = 'nonexistent';

      const mockError = {
        response: { status: 404, data: { message: 'Job not found' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getJobById(jobId)).rejects.toEqual(mockError);
    });

    it('should handle invalid job ID format', async () => {
      const jobId = 'invalid-id';

      const mockError = {
        response: { status: 400, data: { message: 'Invalid job ID' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getJobById(jobId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET FEATURED JOBS ====================
  describe('getFeaturedJobs', () => {
    it('should fetch featured jobs', async () => {
      const mockResponse = {
        data: {
          success: true,
          jobs: [
            { id: '1', title: 'Featured Job 1', isFeatured: true },
            { id: '2', title: 'Featured Job 2', isFeatured: true }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getFeaturedJobs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/featured');
      expect(result.data.jobs).toHaveLength(2);
    });

    it('should handle no featured jobs', async () => {
      const mockResponse = {
        data: { success: true, jobs: [] }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getFeaturedJobs();

      expect(result.data.jobs).toHaveLength(0);
    });
  });

  // ==================== GET RECOMMENDED JOBS ====================
  describe('getRecommendedJobs', () => {
    it('should fetch recommended jobs for user', async () => {
      const mockResponse = {
        data: {
          success: true,
          jobs: [
            { id: '1', title: 'Recommended Job 1' },
            { id: '2', title: 'Recommended Job 2' }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getRecommendedJobs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/recommended');
      expect(result.data.jobs).toHaveLength(2);
    });

    it('should require authentication for recommendations', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getRecommendedJobs()).rejects.toEqual(mockError);
    });
  });

  // ==================== GET NEARBY JOBS ====================
  describe('getNearbyJobs', () => {
    it('should fetch jobs near location', async () => {
      const params = { lat: 40.7128, lng: -74.0060, radius: 50 };

      const mockResponse = {
        data: {
          success: true,
          jobs: [{ id: '1', title: 'Nearby Job' }]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getNearbyJobs(params);

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/nearby', { params });
      expect(result.data.jobs).toHaveLength(1);
    });

    it('should handle missing coordinates', async () => {
      const params = { radius: 50 };

      const mockError = {
        response: { status: 400, data: { message: 'Coordinates required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getNearbyJobs(params)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET JOB STATS ====================
  describe('getJobStats', () => {
    it('should fetch job statistics', async () => {
      const mockResponse = {
        data: {
          success: true,
          stats: {
            totalJobs: 100,
            activeJobs: 50,
            newJobsThisWeek: 10
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobStats();

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/stats');
      expect(result.data.stats.totalJobs).toBe(100);
    });
  });

  // ==================== CREATE JOB ====================
  describe('createJob', () => {
    it('should create a new job with valid data', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'Job description',
        requirements: ['React', 'Node.js'],
        location: 'Remote',
        type: 'full-time',
        salary: { min: 50000, max: 80000 }
      };

      const mockResponse = {
        data: {
          success: true,
          job: { id: '1', ...jobData }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await createJob(jobData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/jobs', jobData);
      expect(result.data.success).toBe(true);
    });

    it('should reject job creation with missing required fields', async () => {
      const jobData = { title: 'Incomplete Job' };

      const mockError = {
        response: { status: 400, data: { message: 'Description is required' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(createJob(jobData)).rejects.toEqual(mockError);
    });

    it('should require employer role to create job', async () => {
      const jobData = {
        title: 'New Job',
        description: 'Description',
        location: 'NYC',
        type: 'full-time'
      };

      const mockError = {
        response: { status: 403, data: { message: 'Only employers can post jobs' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(createJob(jobData)).rejects.toEqual(mockError);
    });
  });

  // ==================== UPDATE JOB ====================
  describe('updateJob', () => {
    it('should update job with valid data', async () => {
      const jobId = '1';
      const updateData = { title: 'Updated Title', salary: { min: 60000 } };

      const mockResponse = {
        data: { success: true, job: { id: jobId, ...updateData } }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await updateJob(jobId, updateData);

      expect(axiosInstance.put).toHaveBeenCalledWith(`/jobs/${jobId}`, updateData);
      expect(result.data.success).toBe(true);
    });

    it('should reject update for non-owned job', async () => {
      const jobId = '1';
      const updateData = { title: 'Hacked Title' };

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to update this job' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updateJob(jobId, updateData)).rejects.toEqual(mockError);
    });
  });

  // ==================== DELETE JOB ====================
  describe('deleteJob', () => {
    it('should delete job successfully', async () => {
      const jobId = '1';

      const mockResponse = { data: { success: true, message: 'Job deleted' } };

      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await deleteJob(jobId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/jobs/${jobId}`);
      expect(result.data.success).toBe(true);
    });

    it('should reject delete for non-owned job', async () => {
      const jobId = '1';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to delete this job' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(deleteJob(jobId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET MY JOBS ====================
  describe('getMyJobs', () => {
    it('should fetch employer own jobs', async () => {
      const mockResponse = {
        data: {
          success: true,
          jobs: [
            { id: '1', title: 'My Job 1' },
            { id: '2', title: 'My Job 2' }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyJobs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/employer/my-jobs', { params: {} });
      expect(result.data.jobs).toHaveLength(2);
    });

    it('should filter my jobs by status', async () => {
      const params = { status: 'active' };

      const mockResponse = {
        data: { success: true, jobs: [{ id: '1', status: 'active' }] }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyJobs(params);

      expect(axiosInstance.get).toHaveBeenCalledWith('/jobs/employer/my-jobs', { params });
    });
  });
});
