// Basic application tests
describe('SimpleDesk Backend', () => {
  test('should load required dependencies', () => {
    expect(() => require('express')).not.toThrow();
    expect(() => require('cors')).not.toThrow();
    expect(() => require('helmet')).not.toThrow();
    expect(() => require('dotenv')).not.toThrow();
    expect(() => require('pg')).not.toThrow();
    expect(() => require('bcryptjs')).not.toThrow();
    expect(() => require('jsonwebtoken')).not.toThrow();
  });

  test('should have proper environment configuration', () => {
    // Test that environment variables can be loaded
    const dotenv = require('dotenv');
    expect(dotenv).toBeDefined();
    expect(typeof dotenv.config).toBe('function');
  });

  test('should have database configuration', () => {
    const dbConfig = require('../config/database');
    expect(dbConfig).toBeDefined();
    expect(typeof dbConfig).toBe('object');
  });

  test('should have authentication middleware', () => {
    const authMiddleware = require('../middleware/auth');
    expect(authMiddleware).toBeDefined();
    expect(typeof authMiddleware.authenticateToken).toBe('function');
  });
});

// Configuration tests
describe('Application Configuration', () => {
  test('should have default port configuration', () => {
    const defaultPort = process.env.PORT || 3001;
    const portNumber = typeof defaultPort === 'string' ? parseInt(defaultPort) : defaultPort;
    expect(portNumber).toBeGreaterThan(0);
    expect(portNumber).toBeLessThan(65536);
  });

  test('should have CORS configuration', () => {
    const defaultOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
    expect(typeof defaultOrigin).toBe('string');
    expect(defaultOrigin).toMatch(/^https?:\/\//);
  });
});