import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCompanies,
  getCompanyById,
  getFeaturedCompanies,
  getCompanyIndustries,
  getCompanyJobs,
  getCompanyReviews,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany
} from '../../app/api/companiesAPI.js';

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

describe('Companies API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== GET COMPANIES ====================
  describe('getCompanies', () => {
    it('should fetch all companies with default filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          companies: [
            { id: '1', name: 'Tech Corp', industry: 'IT' },
            { id: '2', name: 'Dev Inc', industry: 'Software' }
          ],
          total: 2
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanies();

      expect(axiosInstance.get).toHaveBeenCalledWith('/companies', { params: {} });
      expect(result.data.success).toBe(true);
      expect(result.data.companies).toHaveLength(2);
    });

    it('should fetch companies with filters', async () => {
      const filters = { industry: 'IT', location: 'NYC', search: 'tech' };

      const mockResponse = {
        data: { success: true, companies: [{ id: '1', name: 'Tech Corp' }], total: 1 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanies(filters);

      expect(axiosInstance.get).toHaveBeenCalledWith('/companies', { params: filters });
    });

    it('should handle pagination', async () => {
      const filters = { page: 1, limit: 10 };

      const mockResponse = {
        data: { success: true, companies: [], total: 0, page: 1, pages: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanies(filters);

      expect(result.data.page).toBe(1);
    });

    it('should handle server error', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCompanies()).rejects.toEqual(mockError);
    });
  });

  // ==================== GET COMPANY BY ID ====================
  describe('getCompanyById', () => {
    it('should fetch company by valid ID', async () => {
      const companyId = '1';

      const mockResponse = {
        data: {
          success: true,
          company: {
            id: companyId,
            name: 'Tech Corp',
            description: 'Leading tech company',
            founded: 2010,
            size: '100-500',
            website: 'https://techcorp.com'
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyById(companyId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/companies/${companyId}`);
      expect(result.data.company.id).toBe(companyId);
    });

    it('should handle company not found', async () => {
      const companyId = 'nonexistent';

      const mockError = {
        response: { status: 404, data: { message: 'Company not found' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCompanyById(companyId)).rejects.toEqual(mockError);
    });

    it('should handle invalid company ID format', async () => {
      const companyId = 'invalid-id';

      const mockError = {
        response: { status: 400, data: { message: 'Invalid company ID' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCompanyById(companyId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET FEATURED COMPANIES ====================
  describe('getFeaturedCompanies', () => {
    it('should fetch featured companies', async () => {
      const mockResponse = {
        data: {
          success: true,
          companies: [
            { id: '1', name: 'Featured Corp', isFeatured: true },
            { id: '2', name: 'Featured Inc', isFeatured: true }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getFeaturedCompanies();

      expect(axiosInstance.get).toHaveBeenCalledWith('/companies/featured');
      expect(result.data.companies).toHaveLength(2);
    });

    it('should handle no featured companies', async () => {
      const mockResponse = { data: { success: true, companies: [] } };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getFeaturedCompanies();

      expect(result.data.companies).toHaveLength(0);
    });
  });

  // ==================== GET COMPANY INDUSTRIES ====================
  describe('getCompanyIndustries', () => {
    it('should fetch all industries', async () => {
      const mockResponse = {
        data: {
          success: true,
          industries: ['IT', 'Healthcare', 'Finance', 'Education']
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyIndustries();

      expect(axiosInstance.get).toHaveBeenCalledWith('/companies/industries');
      expect(result.data.industries).toHaveLength(4);
    });
  });

  // ==================== GET COMPANY JOBS ====================
  describe('getCompanyJobs', () => {
    it('should fetch jobs for a company', async () => {
      const companyId = '1';

      const mockResponse = {
        data: {
          success: true,
          jobs: [
            { id: '1', title: 'Software Engineer' },
            { id: '2', title: 'Product Manager' }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyJobs(companyId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/companies/${companyId}/jobs`);
      expect(result.data.jobs).toHaveLength(2);
    });

    it('should handle company not found for jobs', async () => {
      const companyId = 'invalid';

      const mockError = {
        response: { status: 404, data: { message: 'Company not found' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCompanyJobs(companyId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET COMPANY REVIEWS ====================
  describe('getCompanyReviews', () => {
    it('should fetch reviews for a company', async () => {
      const companyId = '1';

      const mockResponse = {
        data: {
          success: true,
          reviews: [
            { id: '1', rating: 5, comment: 'Great company!' },
            { id: '2', rating: 4, comment: 'Good place to work' }
          ],
          total: 2,
          averageRating: 4.5
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyReviews(companyId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/companies/${companyId}/reviews`, { params: {} });
      expect(result.data.averageRating).toBe(4.5);
    });

    it('should handle pagination for reviews', async () => {
      const companyId = '1';
      const params = { page: 1, limit: 5 };

      const mockResponse = {
        data: { success: true, reviews: [], total: 0, page: 1 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyReviews(companyId, params);

      expect(result.data.page).toBe(1);
    });

    it('should handle no reviews', async () => {
      const companyId = '1';

      const mockResponse = {
        data: { success: true, reviews: [], total: 0, averageRating: 0 }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCompanyReviews(companyId);

      expect(result.data.reviews).toHaveLength(0);
    });
  });

  // ==================== CREATE COMPANY ====================
  describe('createCompany', () => {
    it('should create a new company with valid data', async () => {
      const companyData = {
        name: 'New Tech Corp',
        description: 'A new tech company',
        industry: 'IT',
        size: '50-100',
        location: 'San Francisco',
        founded: 2020
      };

      const mockResponse = {
        data: { success: true, company: { id: '1', ...companyData } }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await createCompany(companyData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/companies', companyData);
      expect(result.data.success).toBe(true);
    });

    it('should reject company creation with missing required fields', async () => {
      const companyData = { name: 'Incomplete' };

      const mockError = {
        response: { status: 400, data: { message: 'Description is required' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(createCompany(companyData)).rejects.toEqual(mockError);
    });

    it('should reject duplicate company name', async () => {
      const companyData = {
        name: 'Existing Company',
        description: 'Description',
        industry: 'IT'
      };

      const mockError = {
        response: { status: 409, data: { message: 'Company name already exists' } }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(createCompany(companyData)).rejects.toEqual(mockError);
    });
  });

  // ==================== UPDATE COMPANY ====================
  describe('updateCompany', () => {
    it('should update company with valid data', async () => {
      const companyId = '1';
      const updateData = { name: 'Updated Name', description: 'Updated description' };

      const mockResponse = {
        data: { success: true, company: { id: companyId, ...updateData } }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await updateCompany(companyId, updateData);

      expect(axiosInstance.put).toHaveBeenCalledWith(`/companies/${companyId}`, updateData);
      expect(result.data.success).toBe(true);
    });

    it('should reject update for non-owned company', async () => {
      const companyId = '1';
      const updateData = { name: 'Hacked Name' };

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to update this company' } }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updateCompany(companyId, updateData)).rejects.toEqual(mockError);
    });
  });

  // ==================== DELETE COMPANY ====================
  describe('deleteCompany', () => {
    it('should delete company successfully', async () => {
      const companyId = '1';

      const mockResponse = { data: { success: true, message: 'Company deleted' } };

      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await deleteCompany(companyId);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/companies/${companyId}`);
      expect(result.data.success).toBe(true);
    });

    it('should reject delete for non-owned company', async () => {
      const companyId = '1';

      const mockError = {
        response: { status: 403, data: { message: 'Not authorized to delete this company' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(deleteCompany(companyId)).rejects.toEqual(mockError);
    });

    it('should reject delete with active jobs', async () => {
      const companyId = '1';

      const mockError = {
        response: { status: 400, data: { message: 'Cannot delete company with active job postings' } }
      };

      axiosInstance.delete.mockRejectedValue(mockError);

      await expect(deleteCompany(companyId)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET MY COMPANY ====================
  describe('getMyCompany', () => {
    it('should fetch current user company', async () => {
      const mockResponse = {
        data: {
          success: true,
          company: {
            id: '1',
            name: 'My Company',
            description: 'My company description'
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getMyCompany();

      expect(axiosInstance.get).toHaveBeenCalledWith('/companies/my/company');
      expect(result.data.company.name).toBe('My Company');
    });

    it('should handle user without company', async () => {
      const mockError = {
        response: { status: 404, data: { message: 'You do not have a company profile' } }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getMyCompany()).rejects.toEqual(mockError);
    });
  });
});
