const db = require('./database');

async function initializeDatabase() {
  try {
    console.log('🗄️ Initializing database tables...');

    // Create UUID extension
    await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension created');

    // Create organizations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        plan VARCHAR(50) DEFAULT 'starter',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Organizations table created');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'agent', 'customer')),
        avatar_url VARCHAR(500),
        phone VARCHAR(50),
        timezone VARCHAR(100) DEFAULT 'UTC',
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
        last_login_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Users table created');

    // Create tickets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        ticket_number SERIAL UNIQUE,
        subject VARCHAR(500) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'solved', 'closed')),
        priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        source VARCHAR(50) DEFAULT 'web' CHECK (source IN ('email', 'chat', 'phone', 'web', 'api')),
        requester_id UUID REFERENCES users(id),
        requester_email VARCHAR(255),
        requester_name VARCHAR(255),
        assignee_id UUID REFERENCES users(id),
        tags TEXT[],
        custom_fields JSONB DEFAULT '{}',
        due_at TIMESTAMP WITH TIME ZONE,
        solved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tickets table created');

    // Create ticket_comments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ticket_comments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        author_email VARCHAR(255),
        author_name VARCHAR(255),
        body TEXT NOT NULL,
        html_body TEXT,
        is_public BOOLEAN DEFAULT true,
        is_automated BOOLEAN DEFAULT false,
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Ticket comments table created');

    // Create kb_articles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS kb_articles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        html_body TEXT,
        author_id UUID REFERENCES users(id),
        category VARCHAR(255),
        tags TEXT[],
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        view_count INTEGER DEFAULT 0,
        helpful_count INTEGER DEFAULT 0,
        unhelpful_count INTEGER DEFAULT 0,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(organization_id, slug)
      )
    `);
    console.log('✅ Knowledge base articles table created');

    // Add missing columns to existing users table (if they don't exist)
    try {
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT \'UTC\'');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE');
      console.log('✅ Missing user columns added');
    } catch (error) {
      console.log('⚠️ Column addition skipped (likely already exist):', error.message);
    }

    console.log('🎉 Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

module.exports = { initializeDatabase };