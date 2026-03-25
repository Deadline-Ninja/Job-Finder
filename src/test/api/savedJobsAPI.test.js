import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSavedJobs, saveJob, removeSavedJob } from '../../app/api/savedJobsAPI.js';

vi.mock('../../app/api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

import axiosInstance from '../../app/api/axiosInstance.js';

describe('SavedJobs API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== GET SAVED JOBS ====================
  describe('getSavedJobs', () => {
    it('should fetch all saved jobs', async () => {
      const mockResponse = {
        data: {
          success: true,
          savedJobs: [
            { id: 'save-1', jobId: 'job-1', job: { title: 'Frontend Developer' }, savedAt: '2024-01-01' },
            { id: 'save-2', jobId: 'job-2', job: { title: 'Backend Developer' }, savedAt: '2024-01-02' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getSavedJobs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/saved-jobs');
      expect(result.data.savedJobs).toHaveLength(2);
    });

    it('should return empty array when no saved jobs', async () => {
      const mockResponse = {
        data: { success: true, savedJobs: [], total: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getSavedJobs();

      expect(result.data.savedJobs).toHaveLength(0);
    });

    it('should require authentication', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getSavedJobs()).rejects.toEqual(mockError);
    });

    it('should handle server error', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getSavedJobs()).rejects.toEqual(mockError);
    });
  });

  // ==================== SAVE JOB ====================
  describe('saveJob', () => {
    it('should save a job successfully', async () => {
      const jobId = 'job-1';

      const mockResponse = {
        data: {
          success: true,
          savedJob: {
            id: 'save-1',
            jobId: jobId,
            savedAt: new Date().toISOString()
          }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await saveJob(jobId);

      expect(axiosInstance.post).toHaveBeenCalledWith('/saved-jobs', { jobId });
      expect(result.data.success).toBe(true);
    });

    it('should reject duplicate save', async () => {
      const jobId = 'job-1';

      const mockError = {
        response: { status: 409, data: { message: 'Job already saved' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(saveJob(jobId)).rejects.toEqual(mockError);
    });

    it('should reject saving non-existent job', async () => {
      const jobId = 'nonexistent-job';

      const mockError = {
        response: { status: 404, data: { message: 'Job not found' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(saveJob(jobId)).rejects.toEqual(mockError);
    });

    it('should reject saving own job posting (employer)', async () => {
      const jobId = 'own-job';

      const mockError = {
        response: { status: 400, data: { message: 'Cannot save your own job posting' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(saveJob(jobId)).rejects.toEqual(mockError);
    });

    it('should require authentication to save job', async () => {
      localStorage.getItem.mockReturnValue(null);

      const jobId = 'job-1';

      const mockError = {
        response: { status: 401, data: { message: 'Please login to save jobs' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(saveJob(jobId)).rejects.toEqual(mockError);
    });
  });

  // ==================== REMOVE SAVED JOB ====================
  describe('removeSavedJob', () => {
    it('should remove a saved job successfully', async () => {
      const jobId = 'job-1';

      const mockResponse = { data: { success: true, message: 'Job removed from saved list' } };

      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await removeSavedJob(jobId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/saved-jobs/${jobId}`);
      expect(result.data.success).toBe(true);
    });

    it('should handle job not in saved list', async () => {
      const jobId = 'not-saved-job';

      const mockError = {
        response: { status: 404, data: { message: 'Job not found in saved list' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(removeSavedJob(jobId)).rejects.toEqual(mockError);
    });

    it('should reject removing other user saved job', async () => {
      const jobId = 'other-saved-job';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(removeSavedJob(jobId)).rejects.toEqual(mockError);
    });

    it('should require authentication to remove saved job', async () => {
      localStorage.getItem.mockReturnValue(null);

      const jobId = 'job-1';

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(removeSavedJob(jobId)).rejects.toEqual(mockError);
    });
  });
});
