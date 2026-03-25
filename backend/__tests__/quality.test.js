import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// We need to mock Mongoose to avoid connection timeouts
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'mockhost' } }),
  };
});

// Mock the User model
jest.spyOn(User, 'findOne').mockImplementation(() => ({
  select: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(null)
}));

describe('Manual Quality Checks', () => {
  test('NoSQL Injection Protection: Email with $gt operator should be sanitized', async () => {
    // Attempting injection
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: { '$gt': '' }, password: 'password123' });
    
    // The sanitizer should remove the $ key, making email an empty object or string
    // This should result in a 401 (Invalid credentials) for login or 400 for register
    expect(response.status).not.toBe(500);
    expect(response.status).toBe(401); 
  });

  test('Centralized Error Handling: 404 response format', async () => {
    const response = await request(app).get('/api/v1/invalid-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Route not found'
    });
  });
});
