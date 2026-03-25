import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  applyJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications
} from '../../app/api/applicationsAPI.js';

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

describe('Applications API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== APPLY JOB ====================
  describe('applyJob', () => {
    it('should apply to a job with valid data', async () => {
      const applicationData = {
        jobId: '1',
        coverLetter: 'I am interested in this position',
        resumeId: 'resume-1'
      };

      const mockResponse = {
        data: {
          success: true,
          application: {
            id: 'app-1',
            jobId: applicationData.jobId,
            status: 'pending',
            appliedAt: new Date().toISOString()
          }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await applyJob(applicationData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/applications', applicationData);
      expect(result.data.success).toBe(true);
      expect(result.data.application.status).toBe('pending');
    });

    it('should reject duplicate application', async () => {
      const applicationData = { jobId: '1', coverLetter: 'Test' };

      const mockError = {
        response: { status: 409, data: { message: 'You have already applied to this job' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(applyJob(applicationData)).rejects.toEqual(mockError);
    });

    it('should reject application to expired job', async () => {
      const applicationData = { jobId: 'expired-job', coverLetter: 'Test' };

      const mockError = {
        response: { status: 400, data: { message: 'This job posting has expired' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(applyJob(applicationData)).rejects.toEqual(mockError);
    });

    it('should require authentication to apply', async () => {
      localStorage.getItem.mockReturnValue(null);

      const applicationData = { jobId: '1', coverLetter: 'Test' };

      const mockError = {
        response: { status: 401, data: { message: 'Please login to apply' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(applyJob(applicationData)).rejects.toEqual(mockError);
    });

    it('should reject application without cover letter', async () => {
      const applicationData = { jobId: '1' };

      const mockError = {
        response: { status: 400, data: { message: 'Cover letter is required' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(applyJob(applicationData)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET MY APPLICATIONS ====================
  describe('getMyApplications', () => {
    it('should fetch all my applications', async () => {
      const mockResponse = {
        data: {
          success: true,
          applications: [
            { id: 'app-1', jobId: '1', status: 'pending' },
            { id: 'app-2', jobId: '2', status: 'interview' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyApplications();

      expect(axiosInstance.get).toHaveBeenCalledWith('/applications/my', { params: {} });
      expect(result.data.applications).toHaveLength(2);
    });

    it('should filter applications by status', async () => {
      const params = { status: 'pending' };

      const mockResponse = {
        data: { success: true, applications: [{ id: 'app-1', status: 'pending' }], total: 1 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyApplications(params);

      expect(axiosInstance.get).toHaveBeenCalledWith('/applications/my', { params });
    });

    it('should handle pagination', async () => {
      const params = { page: 1, limit: 10 };

      const mockResponse = {
        data: { success: true, applications: [], total: 0, page: 1, pages: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyApplications(params);

      expect(result.data.page).toBe(1);
    });

    it('should require authentication', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: { status: 401, data: { message: 'Authentication required' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getMyApplications()).rejects.toEqual(mockError);
    });
  });

  // ==================== GET APPLICATION BY ID ====================
  describe('getApplicationById', () => {
    it('should fetch application by valid ID', async () => {
      const applicationId = 'app-1';

      const mockResponse = {
        data: {
          success: true,
          application: {
            id: applicationId,
            jobId: '1',
            jobTitle: 'Software Engineer',
            status: 'pending',
            appliedAt: new Date().toISOString()
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getApplicationById(applicationId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/${applicationId}`);
      expect(result.data.application.id).toBe(applicationId);
    });

    it('should handle application not found', async () => {
      const applicationId = 'nonexistent';

      const mockError = {
        response: { status: 404, data: { message: 'Application not found' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getApplicationById(applicationId)).rejects.toEqual(mockError);
    });

    it('should reject access to other user application', async () => {
      const applicationId = 'app-other';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to view this application' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getApplicationById(applicationId)).rejects.toEqual(mockError);
    });
  });

  // ==================== UPDATE APPLICATION STATUS ====================
  describe('updateApplicationStatus', () => {
    it('should update application status (employer)', async () => {
      const applicationId = 'app-1';
      const updateData = { status: 'interview', notes: 'Schedule interview' };

      const mockResponse = {
        data: { success: true, application: { id: applicationId, status: 'interview' } }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await updateApplicationStatus(applicationId, updateData);

      expect(axiosInstance.put).toHaveBeenCalledWith(`/applications/${applicationId}`, updateData);
      expect(result.data.success).toBe(true);
    });

    it('should reject invalid status', async () => {
      const applicationId = 'app-1';
      const updateData = { status: 'invalid-status' };

      const mockError = {
        response: { status: 400, data: { message: 'Invalid status value' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updateApplicationStatus(applicationId, updateData)).rejects.toEqual(mockError);
    });

    it('should require employer role to update status', async () => {
      const applicationId = 'app-1';
      const updateData = { status: 'rejected' };

      const mockError = {
        response: { status: 403, data: { message: 'Only employers can update application status' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updateApplicationStatus(applicationId, updateData)).rejects.toEqual(mockError);
    });
  });

  // ==================== WITHDRAW APPLICATION ====================
  describe('withdrawApplication', () => {
    it('should withdraw application successfully', async () => {
      const applicationId = 'app-1';

      const mockResponse = { data: { success: true, message: 'Application withdrawn' } };

      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await withdrawApplication(applicationId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/applications/${applicationId}`);
      expect(result.data.success).toBe(true);
    });

    it('should reject withdrawal of reviewed application', async () => {
      const applicationId = 'app-1';

      const mockError = {
        response: { status: 400, data: { message: 'Cannot withdraw application after review' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(withdrawApplication(applicationId)).rejects.toEqual(mockError);
    });

    it('should reject withdrawal of other user application', async () => {
      const applicationId = 'app-other';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(withdrawApplication(applicationId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET JOB APPLICATIONS ====================
  describe('getJobApplications', () => {
    it('should fetch applications for a job (employer)', async () => {
      const jobId = '1';

      const mockResponse = {
        data: {
          success: true,
          applications: [
            { id: 'app-1', applicantName: 'John Doe', status: 'pending' },
            { id: 'app-2', applicantName: 'Jane Smith', status: 'interview' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobApplications(jobId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/job/${jobId}`, { params: {} });
      expect(result.data.applications).toHaveLength(2);
    });

    it('should filter job applications by status', async () => {
      const jobId = '1';
      const params = { status: 'pending' };

      const mockResponse = {
        data: { success: true, applications: [{ id: 'app-1', status: 'pending' }], total: 1 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getJobApplications(jobId, params);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/job/${jobId}`, { params });
    });

    it('should require employer role to view job applications', async () => {
      const jobId = '1';

      const mockError = {
        response: { status: 403, data: { message: 'Only employers can view applications' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getJobApplications(jobId)).rejects.toEqual(mockError);
    });

    it('should reject access to other employer job applications', async () => {
      const jobId = 'other-job';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to view this job applications' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getJobApplications(jobId)).rejects.toEqual(mockError);
    });
  });
});
