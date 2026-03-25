import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../../app/hooks/useAuth.js';

// Mock auth API
vi.mock('../../app/api/authAPI.js', () => ({
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

import * as authAPI from '../../app/api/authAPI.js';

describe('useAuth Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== INITIALIZATION ====================
  describe('Initialization', () => {
    it('should initialize with no user and loading state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBe(null);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should check for existing token on mount', async () => {
      localStorage.getItem.mockReturnValue('existing-token');
      authAPI.getCurrentUser.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' } }
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => expect(result.current.loading).toBe(false));
      
      expect(authAPI.getCurrentUser).toHaveBeenCalled();
    });

    it('should not call API when no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(authAPI.getCurrentUser).not.toHaveBeenCalled();
    });
  });

  // ==================== LOGIN ====================
  describe('login', () => {
    it('should login successfully and set user', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: '1', email: credentials.email };
      
      authAPI.loginUser.mockResolvedValue({
        data: { token: 'jwt-token', user: mockUser }
      });

      const { result } = renderHook(() => useAuth());

      await result.current.login(credentials);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token');
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle login error', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      
      authAPI.loginUser.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } }
      });

      const { result } = renderHook(() => useAuth());

      try {
        await result.current.login(credentials);
      } catch (e) {
        // Expected to throw
      }

      expect(result.current.error).toBe('Invalid credentials');
    });

    it('should set loading during login', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      authAPI.loginUser.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { token: 'token', user: {} } }), 100))
      );

      const { result } = renderHook(() => useAuth());
      
      const loginPromise = result.current.login(credentials);
      
      // Loading should be true during login
      expect(result.current.loading).toBe(true);
      
      await loginPromise;
    });
  });

  // ==================== REGISTER ====================
  describe('register', () => {
    it('should register successfully and set user', async () => {
      const userData = { 
        email: 'new@example.com', 
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      const mockUser = { id: '1', email: userData.email };
      
      authAPI.registerUser.mockResolvedValue({
        data: { token: 'jwt-token', user: mockUser }
      });

      const { result } = renderHook(() => useAuth());

      await result.current.register(userData);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token');
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle registration error', async () => {
      const userData = { 
        email: 'existing@example.com', 
        password: 'password123' 
      };
      
      authAPI.registerUser.mockRejectedValue({
        response: { data: { message: 'Email already exists' } }
      });

      const { result } = renderHook(() => useAuth());

      try {
        await result.current.register(userData);
      } catch (e) {
        // Expected to throw
      }

      expect(result.current.error).toBe('Email already exists');
    });
  });

  // ==================== LOGOUT ====================
  describe('logout', () => {
    it('should clear user and token on logout', () => {
      localStorage.getItem.mockReturnValue('token');
      
      const { result } = renderHook(() => useAuth());
      
      // Set user first
      result.current.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(result.current.user).toBe(null);
    });
  });
});
