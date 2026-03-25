import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerUser, loginUser, getCurrentUser, updatePassword, forgotPassword, resetPassword } from '../../app/api/authAPI.js';

// Mock axios instance
vi.mock('../../app/api/axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

import axiosInstance from '../../app/api/axiosInstance.js';

describe('Auth API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==================== REGISTER USER ====================
  describe('registerUser', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'job-seeker'
      };
      
      const mockResponse = {
        data: {
          success: true,
          token: 'jwt-token',
          user: { id: '1', email: userData.email, firstName: userData.firstName }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await registerUser(userData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result.data.success).toBe(true);
      expect(result.data.token).toBe('jwt-token');
    });

    it('should handle registration error with invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: 'Doe'
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(registerUser(invalidData)).rejects.toEqual(mockError);
    });

    it('should handle duplicate email registration', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockError = {
        response: {
          status: 409,
          data: { message: 'Email already registered' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(registerUser(userData)).rejects.toEqual(mockError);
    });

    it('should handle missing required fields', async () => {
      const incompleteData = {
        email: 'test@example.com'
        // missing password, firstName, lastName
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'All fields are required' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(registerUser(incompleteData)).rejects.toEqual(mockError);
    });
  });

  // ==================== LOGIN USER ====================
  describe('loginUser', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'jwt-token',
          user: { id: '1', email: credentials.email, role: 'job-seeker' }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await loginUser(credentials);

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result.data.success).toBe(true);
      expect(result.data.token).toBe('jwt-token');
    });

    it('should reject login with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid password' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(loginUser(credentials)).rejects.toEqual(mockError);
    });

    it('should reject login with non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const mockError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(loginUser(credentials)).rejects.toEqual(mockError);
    });

    it('should handle empty credentials', async () => {
      const credentials = {};

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Email and password are required' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(loginUser(credentials)).rejects.toEqual(mockError);
    });
  });

  // ==================== GET CURRENT USER ====================
  describe('getCurrentUser', () => {
    it('should get current user profile with valid token', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'job-seeker'
          }
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/me');
      expect(result.data.success).toBe(true);
      expect(result.data.user.email).toBe('test@example.com');
    });

    it('should handle unauthorized request without token', async () => {
      localStorage.getItem.mockReturnValue(null);

      const mockError = {
        response: {
          status: 401,
          data: { message: 'No token provided' }
        }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCurrentUser()).rejects.toEqual(mockError);
    });

    it('should handle expired token', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Token expired' }
        }
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getCurrentUser()).rejects.toEqual(mockError);
    });
  });

  // ==================== UPDATE PASSWORD ====================
  describe('updatePassword', () => {
    it('should update password with correct current password', async () => {
      const passwordData = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456'
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Password updated successfully'
        }
      };

      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await updatePassword(passwordData);

      expect(axiosInstance.put).toHaveBeenCalledWith('/auth/password', passwordData);
      expect(result.data.success).toBe(true);
    });

    it('should reject password update with incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456'
      };

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Current password is incorrect' }
        }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updatePassword(passwordData)).rejects.toEqual(mockError);
    });

    it('should reject password update when passwords do not match', async () => {
      const passwordData = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        confirmPassword: 'differentPassword'
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Passwords do not match' }
        }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updatePassword(passwordData)).rejects.toEqual(mockError);
    });

    it('should reject weak new password', async () => {
      const passwordData = {
        currentPassword: 'oldPassword123',
        newPassword: '123',
        confirmPassword: '123'
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Password must be at least 6 characters' }
        }
      };

      axiosInstance.put.mockRejectedValue(mockError);

      await expect(updatePassword(passwordData)).rejects.toEqual(mockError);
    });
  });

  // ==================== FORGOT PASSWORD ====================
  describe('forgotPassword', () => {
    it('should send reset password email with valid email', async () => {
      const email = 'test@example.com';

      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset email sent'
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await forgotPassword(email);

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
      expect(result.data.success).toBe(true);
    });

    it('should handle non-existent email for forgot password', async () => {
      const email = 'nonexistent@example.com';

      const mockError = {
        response: {
          status: 404,
          data: { message: 'Email not found' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(forgotPassword(email)).rejects.toEqual(mockError);
    });

    it('should handle invalid email format', async () => {
      const email = 'invalid-email';

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(forgotPassword(email)).rejects.toEqual(mockError);
    });
  });

  // ==================== RESET PASSWORD ====================
  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const resetData = {
        token: 'valid-reset-token',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset successfully'
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await resetPassword(resetData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', resetData);
      expect(result.data.success).toBe(true);
    });

    it('should reject reset with expired token', async () => {
      const resetData = {
        token: 'expired-reset-token',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Reset token expired' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(resetPassword(resetData)).rejects.toEqual(mockError);
    });

    it('should reject reset with invalid token', async () => {
      const resetData = {
        token: 'invalid-token',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid reset token' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(resetPassword(resetData)).rejects.toEqual(mockError);
    });
  });
});
