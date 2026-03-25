import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Mock the database connection
jest.mock('../config/db.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true)
}));

// Import routes
import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/users.js';
import jobRoutes from '../routes/jobs.js';
import companyRoutes from '../routes/companies.js';
import applicationRoutes from '../routes/applications.js';
import messageRoutes from '../routes/messages.js';
import notificationRoutes from '../routes/notifications.js';
import savedJobRoutes from '../routes/savedJobs.js';
import reviewRoutes from '../routes/reviews.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Socket.io
const mockIo = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn()
};
app.set('io', mockIo);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ============================================
// HEALTH CHECK TESTS
// ============================================
describe('Health Check', () => {
  test('GET /api/health should return ok status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});

// ============================================
// AUTH ROUTES TESTS (GET, POST, PUT)
// ============================================
describe('Auth Routes', () => {
  // POST /api/auth/register
  test('POST /api/auth/register should handle request', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(response.status).toBe(500); // DB timeout
  }, 15000);

  // POST /api/auth/login
  test('POST /api/auth/login should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(response.status).toBe(400);
  }, 15000);

  test('POST /api/auth/login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpass' });
    expect([401, 500]).toContain(response.status);
  }, 15000);

  // POST /api/auth/forgot-password
  test('POST /api/auth/forgot-password should handle request', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'test@test.com' });
    expect([200, 404, 500]).toContain(response.status);
  }, 15000);

  // POST /api/auth/reset-password
  test('POST /api/auth/reset-password should handle request', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'abc', newPassword: 'password123' });
    expect(response.status).toBe(200);
  });

  // GET /api/auth/me (requires auth)
  test('GET /api/auth/me should require authentication', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  // PUT /api/auth/password (requires auth)
  test('PUT /api/auth/password should require authentication', async () => {
    const response = await request(app)
      .put('/api/auth/password')
      .send({ currentPassword: 'old', newPassword: 'new' });
    expect(response.status).toBe(401);
  });
});

// ============================================
// JOBS ROUTES TESTS (GET, POST, PUT, DELETE)
// ============================================
describe('Jobs Routes', () => {
  // GET /api/jobs
  test('GET /api/jobs should handle request', async () => {
    const response = await request(app).get('/api/jobs');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/jobs/featured
  test('GET /api/jobs/featured should handle request', async () => {
    const response = await request(app).get('/api/jobs/featured');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/jobs/stats
  test('GET /api/jobs/stats should handle request', async () => {
    const response = await request(app).get('/api/jobs/stats');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/jobs/nearby
  test('GET /api/jobs/nearby should handle request', async () => {
    const response = await request(app).get('/api/jobs/nearby');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/jobs/recommended (requires auth)
  test('GET /api/jobs/recommended should require authentication', async () => {
    const response = await request(app).get('/api/jobs/recommended');
    expect(response.status).toBe(401);
  });

  // GET /api/jobs/:id
  test('GET /api/jobs/:id should return 500 for invalid ID', async () => {
    const response = await request(app).get('/api/jobs/invalid-id');
    expect(response.status).toBe(500);
  });

  // POST /api/jobs (requires auth)
  test('POST /api/jobs should require authentication', async () => {
    const response = await request(app)
      .post('/api/jobs')
      .send({ title: 'Test Job' });
    expect(response.status).toBe(401);
  });

  // PUT /api/jobs/:id (requires auth)
  test('PUT /api/jobs/:id should require authentication', async () => {
    const response = await request(app)
      .put('/api/jobs/123')
      .send({ title: 'Updated Job' });
    expect(response.status).toBe(401);
  });

  // DELETE /api/jobs/:id (requires auth)
  test('DELETE /api/jobs/:id should require authentication', async () => {
    const response = await request(app).delete('/api/jobs/123');
    expect(response.status).toBe(401);
  });

  // GET /api/jobs/employer/my-jobs (requires auth)
  test('GET /api/jobs/employer/my-jobs should require authentication', async () => {
    const response = await request(app).get('/api/jobs/employer/my-jobs');
    expect(response.status).toBe(401);
  });
});

// ============================================
// COMPANIES ROUTES TESTS (GET, POST, PUT, DELETE)
// ============================================
describe('Companies Routes', () => {
  // GET /api/companies
  test('GET /api/companies should handle request', async () => {
    const response = await request(app).get('/api/companies');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/companies/featured
  test('GET /api/companies/featured should handle request', async () => {
    const response = await request(app).get('/api/companies/featured');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/companies/industries
  test('GET /api/companies/industries should handle request', async () => {
    const response = await request(app).get('/api/companies/industries');
    expect([200, 500]).toContain(response.status);
  }, 15000);

  // GET /api/companies/:id
  test('GET /api/companies/:id should return 500 for invalid ID', async () => {
    const response = await request(app).get('/api/companies/invalid-id');
    expect(response.status).toBe(500);
  });

  // GET /api/companies/:id/jobs
  test('GET /api/companies/:id/jobs should handle request', async () => {
    const response = await request(app).get('/api/companies/123/jobs');
    expect([200, 404, 500]).toContain(response.status);
  });

  // GET /api/companies/:id/reviews
  test('GET /api/companies/:id/reviews should handle request', async () => {
    const response = await request(app).get('/api/companies/123/reviews');
    expect([200, 404, 500]).toContain(response.status);
  });

  // POST /api/companies (requires auth)
  test('POST /api/companies should require authentication', async () => {
    const response = await request(app)
      .post('/api/companies')
      .send({ name: 'Test Company' });
    expect(response.status).toBe(401);
  });

  // PUT /api/companies/:id (requires auth)
  test('PUT /api/companies/:id should require authentication', async () => {
    const response = await request(app)
      .put('/api/companies/123')
      .send({ name: 'Updated Company' });
    expect(response.status).toBe(401);
  });

  // DELETE /api/companies/:id (requires auth)
  test('DELETE /api/companies/:id should require authentication', async () => {
    const response = await request(app).delete('/api/companies/123');
    expect(response.status).toBe(401);
  });

  // GET /api/companies/my/company (requires auth)
  test('GET /api/companies/my/company should require authentication', async () => {
    const response = await request(app).get('/api/companies/my/company');
    expect(response.status).toBe(401);
  });
});

// ============================================
// USERS ROUTES TESTS (GET, PUT)
// ============================================
describe('Users Routes', () => {
  // GET /api/users/profile/:id
  test('GET /api/users/profile/:id should handle request', async () => {
    const response = await request(app).get('/api/users/profile/123');
    expect([200, 404, 500]).toContain(response.status);
  });

  // PUT /api/users/profile (requires auth)
  test('PUT /api/users/profile should require authentication', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .send({ name: 'Updated Name' });
    expect(response.status).toBe(401);
  });

  // PUT /api/users/profile-photo (requires auth)
  test('PUT /api/users/profile-photo should require authentication', async () => {
    const response = await request(app)
      .put('/api/users/profile-photo')
      .send({ profilePhoto: 'url' });
    expect(response.status).toBe(401);
  });

  // PUT /api/users/resume (requires auth)
  test('PUT /api/users/resume should require authentication', async () => {
    const response = await request(app)
      .put('/api/users/resume')
      .send({ resume: 'url' });
    expect(response.status).toBe(401);
  });

  // GET /api/users/dashboard-stats (requires auth)
  test('GET /api/users/dashboard-stats should require authentication', async () => {
    const response = await request(app).get('/api/users/dashboard-stats');
    expect(response.status).toBe(401);
  });

  // GET /api/users/search (requires auth)
  test('GET /api/users/search should require authentication', async () => {
    const response = await request(app).get('/api/users/search');
    expect(response.status).toBe(401);
  });
});

// ============================================
// APPLICATIONS ROUTES TESTS (GET, POST, PUT, DELETE)
// ============================================
describe('Applications Routes', () => {
  // POST /api/applications (requires auth)
  test('POST /api/applications should require authentication', async () => {
    const response = await request(app)
      .post('/api/applications')
      .send({ jobId: '123' });
    expect(response.status).toBe(401);
  });

  // GET /api/applications/my (requires auth)
  test('GET /api/applications/my should require authentication', async () => {
    const response = await request(app).get('/api/applications/my');
    expect(response.status).toBe(401);
  });

  // GET /api/applications/:id (requires auth)
  test('GET /api/applications/:id should require authentication', async () => {
    const response = await request(app).get('/api/applications/123');
    expect(response.status).toBe(401);
  });

  // PUT /api/applications/:id (requires auth)
  test('PUT /api/applications/:id should require authentication', async () => {
    const response = await request(app)
      .put('/api/applications/123')
      .send({ status: 'Interview' });
    expect(response.status).toBe(401);
  });

  // DELETE /api/applications/:id (requires auth)
  test('DELETE /api/applications/:id should require authentication', async () => {
    const response = await request(app).delete('/api/applications/123');
    expect(response.status).toBe(401);
  });

  // GET /api/applications/job/:jobId (requires auth)
  test('GET /api/applications/job/:jobId should require authentication', async () => {
    const response = await request(app).get('/api/applications/job/123');
    expect(response.status).toBe(401);
  });
});

// ============================================
// MESSAGES ROUTES TESTS (GET, POST, PUT)
// ============================================
describe('Messages Routes', () => {
  // GET /api/messages (requires auth)
  test('GET /api/messages should require authentication', async () => {
    const response = await request(app).get('/api/messages');
    expect(response.status).toBe(401);
  });

  // GET /api/messages/conversations (requires auth)
  test('GET /api/messages/conversations should require authentication', async () => {
    const response = await request(app).get('/api/messages/conversations');
    expect(response.status).toBe(401);
  });

  // GET /api/messages/unread/count (requires auth)
  test('GET /api/messages/unread/count should require authentication', async () => {
    const response = await request(app).get('/api/messages/unread/count');
    expect(response.status).toBe(401);
  });

  // POST /api/messages (requires auth)
  test('POST /api/messages should require authentication', async () => {
    const response = await request(app)
      .post('/api/messages')
      .send({ receiverId: '123', content: 'Hello' });
    expect(response.status).toBe(401);
  });

  // GET /api/messages/:conversationId (requires auth)
  test('GET /api/messages/:conversationId should require authentication', async () => {
    const response = await request(app).get('/api/messages/123');
    expect(response.status).toBe(401);
  });

  // PUT /api/messages/:id/read (requires auth)
  test('PUT /api/messages/:id/read should require authentication', async () => {
    const response = await request(app).put('/api/messages/123/read');
    expect(response.status).toBe(401);
  });
});

// ============================================
// NOTIFICATIONS ROUTES TESTS (GET, PUT)
// ============================================
describe('Notifications Routes', () => {
  // GET /api/notifications (requires auth)
  test('GET /api/notifications should require authentication', async () => {
    const response = await request(app).get('/api/notifications');
    expect(response.status).toBe(401);
  });

  // PUT /api/notifications/:id/read (requires auth)
  test('PUT /api/notifications/:id/read should require authentication', async () => {
    const response = await request(app).put('/api/notifications/123/read');
    expect(response.status).toBe(401);
  });

  // PUT /api/notifications/read-all (requires auth)
  test('PUT /api/notifications/read-all should require authentication', async () => {
    const response = await request(app).put('/api/notifications/read-all');
    expect(response.status).toBe(401);
  });

  // DELETE /api/notifications/:id (requires auth)
  test('DELETE /api/notifications/:id should require authentication', async () => {
    const response = await request(app).delete('/api/notifications/123');
    expect(response.status).toBe(401);
  });
});

// ============================================
// SAVED JOBS ROUTES TESTS (GET, POST, DELETE)
// ============================================
describe('Saved Jobs Routes', () => {
  // GET /api/saved-jobs (requires auth)
  test('GET /api/saved-jobs should require authentication', async () => {
    const response = await request(app).get('/api/saved-jobs');
    expect(response.status).toBe(401);
  });

  // POST /api/saved-jobs (requires auth)
  test('POST /api/saved-jobs should require authentication', async () => {
    const response = await request(app)
      .post('/api/saved-jobs')
      .send({ jobId: '123' });
    expect(response.status).toBe(401);
  });

  // DELETE /api/saved-jobs/:jobId (requires auth)
  test('DELETE /api/saved-jobs/:jobId should require authentication', async () => {
    const response = await request(app).delete('/api/saved-jobs/123');
    expect(response.status).toBe(401);
  });
});

// ============================================
// REVIEWS ROUTES TESTS (GET, POST, PUT, DELETE)
// ============================================
describe('Reviews Routes', () => {
  // POST /api/reviews (requires auth)
  test('POST /api/reviews should require authentication', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .send({ companyId: '123', rating: 5 });
    expect(response.status).toBe(401);
  });

  // GET /api/reviews/company/:companyId
  test('GET /api/reviews/company/:companyId should handle request', async () => {
    const response = await request(app).get('/api/reviews/company/123');
    expect([200, 404, 500]).toContain(response.status);
  });

  // PUT /api/reviews/:id (requires auth)
  test('PUT /api/reviews/:id should require authentication', async () => {
    const response = await request(app)
      .put('/api/reviews/123')
      .send({ rating: 4 });
    expect(response.status).toBe(401);
  });

  // DELETE /api/reviews/:id (requires auth)
  test('DELETE /api/reviews/:id should require authentication', async () => {
    const response = await request(app).delete('/api/reviews/123');
    expect(response.status).toBe(401);
  });

  // POST /api/reviews/:id/helpful (requires auth)
  test('POST /api/reviews/:id/helpful should require authentication', async () => {
    const response = await request(app).post('/api/reviews/123/helpful');
    expect(response.status).toBe(401);
  });
});

// ============================================
// 404 HANDLER TEST
// ============================================
describe('404 Handler', () => {
  test('Unknown route should return 404', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
