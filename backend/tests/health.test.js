const request = require('supertest');
const express = require('express');

// Simple health check test
describe('Health Check', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.get('/api/health', (req, res) => {
      res.status(200).json({ 
        status: 'ok', 
        message: 'SimpleDesk API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
  });

  test('should return 200 for health check', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'SimpleDesk API is running');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  test('should return JSON content type', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
  });
});

// Basic utility tests
describe('Basic Functionality', () => {
  test('should have process environment', () => {
    expect(process.env).toBeDefined();
  });

  test('should have Node.js version 16+', () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    expect(majorVersion).toBeGreaterThanOrEqual(16);
  });

  test('should be able to create Date objects', () => {
    const now = new Date();
    expect(now).toBeInstanceOf(Date);
    expect(now.getTime()).toBeGreaterThan(0);
  });
});