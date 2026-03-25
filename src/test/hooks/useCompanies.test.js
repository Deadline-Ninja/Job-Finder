import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCompanies, useCompany, useFeaturedCompanies } from '../../app/hooks/useCompanies.js';

// Mock companies API
vi.mock('../../app/api/companiesAPI.js', () => ({
  getCompanies: vi.fn(),
  getCompanyById: vi.fn(),
  getFeaturedCompanies: vi.fn(),
}));

import * as companiesAPI from '../../app/api/companiesAPI.js';

describe('useCompanies Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== USECOMPANIES ====================
  describe('useCompanies', () => {
    it('should fetch companies on mount', async () => {
      const mockCompanies = [
        { id: '1', name: 'Company 1' },
        { id: '2', name: 'Company 2' }
      ];

      companiesAPI.getCompanies.mockResolvedValue({
        data: { companies: mockCompanies }
      });

      const { result } = renderHook(() => useCompanies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.companies).toEqual(mockCompanies);
    });

    it('should handle fetch error', async () => {
      companiesAPI.getCompanies.mockRejectedValue({
        response: { data: { message: 'Failed to fetch companies' } }
      });

      const { result } = renderHook(() => useCompanies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Failed to fetch companies');
    });

    it('should refetch when filters change', async () => {
      companiesAPI.getCompanies.mockResolvedValue({ data: { companies: [] } });

      const { rerender } = renderHook(({ filters }) => useCompanies(filters), {
        initialProps: { filters: { industry: 'IT' } }
      });

      rerender({ filters: { industry: 'Finance' } });

      expect(companiesAPI.getCompanies).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== USECOMPANY ====================
  describe('useCompany', () => {
    it('should fetch company by ID', async () => {
      const mockCompany = { id: '1', name: 'Tech Corp' };

      companiesAPI.getCompanyById.mockResolvedValue({
        data: { company: mockCompany }
      });

      const { result } = renderHook(() => useCompany('1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.company).toEqual(mockCompany);
    });

    it('should not fetch when ID is null', () => {
      const { result } = renderHook(() => useCompany(null));

      expect(result.current.loading).toBe(false);
      expect(companiesAPI.getCompanyById).not.toHaveBeenCalled();
    });
  });

  // ==================== USEFEATUREDCOMPANIES ====================
  describe('useFeaturedCompanies', () => {
    it('should fetch featured companies on mount', async () => {
      const mockCompanies = [
        { id: '1', name: 'Featured Corp', isFeatured: true }
      ];

      companiesAPI.getFeaturedCompanies.mockResolvedValue({
        data: { companies: mockCompanies }
      });

      const { result } = renderHook(() => useFeaturedCompanies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.companies).toEqual(mockCompanies);
    });
  });
});
