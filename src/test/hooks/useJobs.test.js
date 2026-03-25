import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useJobs, useJob, useFeaturedJobs } from '../../app/hooks/useJobs.js';

// Mock jobs API
vi.mock('../../app/api/jobsAPI.js', () => ({
  getJobs: vi.fn(),
  getJobById: vi.fn(),
  getFeaturedJobs: vi.fn(),
}));

import * as jobsAPI from '../../app/api/jobsAPI.js';

describe('useJobs Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== USEJOBS ====================
  describe('useJobs', () => {
    it('should fetch jobs on mount', async () => {
      const mockJobs = [
        { id: '1', title: 'Job 1' },
        { id: '2', title: 'Job 2' }
      ];

      jobsAPI.getJobs.mockResolvedValue({
        data: { jobs: mockJobs, pagination: { page: 1, total: 2 } }
      });

      const { result } = renderHook(() => useJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.jobs).toEqual(mockJobs);
      expect(result.current.error).toBe(null);
    });

    it('should handle fetch error', async () => {
      jobsAPI.getJobs.mockRejectedValue({
        response: { data: { message: 'Failed to fetch' } }
      });

      const { result } = renderHook(() => useJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.jobs).toEqual([]);
    });

    it('should refetch when filters change', async () => {
      jobsAPI.getJobs.mockResolvedValue({ data: { jobs: [] } });

      const { rerender } = renderHook(({ filters }) => useJobs(filters), {
        initialProps: { filters: { location: 'NYC' } }
      });

      rerender({ filters: { location: 'LA' } });

      expect(jobsAPI.getJobs).toHaveBeenCalledTimes(2);
    });

    it('should provide refetch function', async () => {
      jobsAPI.getJobs.mockResolvedValue({ data: { jobs: [{ id: '1' }] } });

      const { result } = renderHook(() => useJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      jobsAPI.getJobs.mockResolvedValue({ data: { jobs: [{ id: '2' }] } });

      await result.current.refetch();

      expect(jobsAPI.getJobs).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== USEJOB ====================
  describe('useJob', () => {
    it('should fetch job by ID', async () => {
      const mockJob = { id: '1', title: 'Software Engineer' };

      jobsAPI.getJobById.mockResolvedValue({
        data: { job: mockJob }
      });

      const { result } = renderHook(() => useJob('1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.job).toEqual(mockJob);
    });

    it('should not fetch when ID is null', () => {
      const { result } = renderHook(() => useJob(null));

      expect(result.current.loading).toBe(false);
      expect(jobsAPI.getJobById).not.toHaveBeenCalled();
    });

    it('should handle job not found', async () => {
      jobsAPI.getJobById.mockRejectedValue({
        response: { data: { message: 'Job not found' } }
      });

      const { result } = renderHook(() => useJob('invalid-id'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Job not found');
    });
  });

  // ==================== USEFEATUREDJOBS ====================
  describe('useFeaturedJobs', () => {
    it('should fetch featured jobs on mount', async () => {
      const mockJobs = [
        { id: '1', title: 'Featured Job 1' },
        { id: '2', title: 'Featured Job 2' }
      ];

      jobsAPI.getFeaturedJobs.mockResolvedValue({
        data: { jobs: mockJobs }
      });

      const { result } = renderHook(() => useFeaturedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.jobs).toEqual(mockJobs);
    });

    it('should handle error', async () => {
      jobsAPI.getFeaturedJobs.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useFeaturedJobs());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.jobs).toEqual([]);
    });
  });
});
