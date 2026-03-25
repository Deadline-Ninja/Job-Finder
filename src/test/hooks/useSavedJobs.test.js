import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSavedJobs } from '../../app/hooks/useSavedJobs.js';

// Mock savedJobs API
vi.mock('../../app/api/savedJobsAPI.js', () => ({
  getSavedJobs: vi.fn(),
  saveJob: vi.fn(),
  removeSavedJob: vi.fn(),
}));

import * as savedJobsAPI from '../../app/api/savedJobsAPI.js';

describe('useSavedJobs Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== INITIALIZATION ====================
  describe('Initialization', () => {
    it('should fetch saved jobs on mount', async () => {
      const mockSavedJobs = [
        { _id: 'save-1', jobId: 'job-1', job: { title: 'Job 1' } },
        { _id: 'save-2', jobId: 'job-2', job: { title: 'Job 2' } }
      ];

      savedJobsAPI.getSavedJobs.mockResolvedValue({
        data: { jobs: mockSavedJobs }
      });

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.savedJobs).toEqual(mockSavedJobs);
    });

    it('should handle fetch error', async () => {
      savedJobsAPI.getSavedJobs.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.savedJobs).toEqual([]);
    });
  });

  // ==================== SAVE JOB ====================
  describe('saveJob', () => {
    it('should save a job', async () => {
      savedJobsAPI.getSavedJobs.mockResolvedValue({ data: { jobs: [] } });
      savedJobsAPI.saveJob.mockResolvedValue({ data: { success: true } });
      savedJobsAPI.getSavedJobs
        .mockResolvedValueOnce({ data: { jobs: [] } })
        .mockResolvedValueOnce({ data: { jobs: [{ _id: 'new-save', jobId: 'job-1' }] } });

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.saveJob('job-1');

      expect(savedJobsAPI.saveJob).toHaveBeenCalledWith('job-1');
    });

    it('should handle save error', async () => {
      savedJobsAPI.getSavedJobs.mockResolvedValue({ data: { jobs: [] } });
      savedJobsAPI.saveJob.mockRejectedValue(new Error('Already saved'));

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      try {
        await result.current.saveJob('job-1');
      } catch (e) {
        // Expected
      }

      expect(savedJobsAPI.saveJob).toHaveBeenCalled();
    });
  });

  // ==================== REMOVE SAVED JOB ====================
  describe('removeSavedJob', () => {
    it('should remove a saved job', async () => {
      const initialJobs = [{ _id: 'save-1', jobId: 'job-1' }];
      
      savedJobsAPI.getSavedJobs.mockResolvedValue({ data: { jobs: initialJobs } });
      savedJobsAPI.removeSavedJob.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.removeSavedJob('job-1');

      expect(savedJobsAPI.removeSavedJob).toHaveBeenCalledWith('job-1');
    });
  });

  // ==================== IS JOB SAVED ====================
  describe('isJobSaved', () => {
    it('should return true if job is saved', async () => {
      const savedJobs = [
        { _id: 'save-1', jobId: 'job-1' },
        { _id: 'save-2', jobId: 'job-2' }
      ];

      savedJobsAPI.getSavedJobs.mockResolvedValue({ data: { jobs: savedJobs } });

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.isJobSaved('job-1')).toBe(true);
    });

    it('should return false if job is not saved', async () => {
      savedJobsAPI.getSavedJobs.mockResolvedValue({ data: { jobs: [] } });

      const { result } = renderHook(() => useSavedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.isJobSaved('job-1')).toBe(false);
    });
  });
});
