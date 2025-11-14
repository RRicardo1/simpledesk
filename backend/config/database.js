const { Pool } = require('pg');

// For local testing without database
const mockDB = {
  query: (text, params) => {
    console.log('🔧 Mock DB Query:', text.substring(0, 50));
    return Promise.resolve({ rows: [] });
  },
  pool: null
};

// Try to connect to database, fall back to mock if not available
let dbConfig;
if (process.env.DATABASE_URL && process.env.USE_MOCK_DB !== 'true') {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  dbConfig = {
    query: (text, params) => pool.query(text, params),
    pool
  };
} else {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('🔧 Using mock database (USE_MOCK_DB=true)');
  } else {
    console.log('🔧 Using mock database for local testing (no DATABASE_URL found)');
  }
  dbConfig = mockDB;
}

module.exports = dbConfig;