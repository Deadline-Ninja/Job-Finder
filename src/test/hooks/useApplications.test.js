import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApplications, useApplyJob } from '../../app/hooks/useApplications.js';

// Mock applications API
vi.mock('../../app/api/applicationsAPI.js', () => ({
  getMyApplications: vi.fn(),
  applyJob: vi.fn(),
}));

import * as applicationsAPI from '../../app/api/applicationsAPI.js';

describe('useApplications Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== USEAPPLICATIONS ====================
  describe('useApplications', () => {
    it('should fetch applications on mount', async () => {
      const mockApplications = [
        { id: 'app-1', jobId: '1', status: 'pending' },
        { id: 'app-2', jobId: '2', status: 'interview' }
      ];

      applicationsAPI.getMyApplications.mockResolvedValue({
        data: { applications: mockApplications }
      });

      const { result } = renderHook(() => useApplications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.applications).toEqual(mockApplications);
    });

    it('should handle fetch error', async () => {
      applicationsAPI.getMyApplications.mockRejectedValue({
        response: { data: { message: 'Failed to fetch' } }
      });

      const { result } = renderHook(() => useApplications());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Failed to fetch');
    });

    it('should filter by status', async () => {
      applicationsAPI.getMyApplications.mockResolvedValue({
        data: { applications: [{ id: 'app-1', status: 'pending' }] }
      });

      const { result } = renderHook(() => useApplications({ status: 'pending' }));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(applicationsAPI.getMyApplications).toHaveBeenCalledWith({ status: 'pending' });
    });
  });

  // ==================== USEAPPLYJOB ====================
  describe('useApplyJob', () => {
    it('should apply to job successfully', async () => {
      const applicationData = { jobId: '1', coverLetter: 'I am interested' };

      applicationsAPI.applyJob.mockResolvedValue({
        data: { success: true, application: { id: 'app-1', ...applicationData } }
      });

      const { result } = renderHook(() => useApplyJob());

      const response = await result.current.applyJob(applicationData);

      expect(applicationsAPI.applyJob).toHaveBeenCalledWith(applicationData);
      expect(response.success).toBe(true);
    });

    it('should handle application error', async () => {
      applicationsAPI.applyJob.mockRejectedValue({
        response: { data: { message: 'Already applied' } }
      });

      const { result } = renderHook(() => useApplyJob());

      try {
        await result.current.applyJob({ jobId: '1' });
      } catch (e) {
        expect(result.current.error).toBe('Already applied');
      }
    });
  });
});
