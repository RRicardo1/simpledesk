const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all knowledge base articles (public endpoint for customer portal)
router.get('/public/:organizationId', async (req, res) => {
  const { organizationId } = req.params;
  const { category, search } = req.query;

  try {
    let whereConditions = ['organization_id = $1', 'status = $2'];
    let queryParams = [organizationId, 'published'];
    let paramCount = 2;

    if (category) {
      paramCount++;
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(title ILIKE $${paramCount} OR body ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    const result = await db.query(
      `SELECT id, title, slug, category, tags, view_count, helpful_count, 
              unhelpful_count, published_at
       FROM kb_articles 
       WHERE ${whereClause}
       ORDER BY helpful_count DESC, view_count DESC`,
      queryParams
    );

    res.json({ articles: result.rows });
  } catch (error) {
    console.error('Get public KB articles error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// Get knowledge base articles for organization
router.get('/', authenticateToken, async (req, res) => {
  const { search, status, category } = req.query;

  try {
    let whereConditions = ['kb.organization_id = $1'];
    let queryParams = [req.user.organization_id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereConditions.push(`kb.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (category) {
      paramCount++;
      whereConditions.push(`kb.category = $${paramCount}`);
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(kb.title ILIKE $${paramCount} OR kb.body ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    const result = await db.query(
      `SELECT kb.*, u.first_name as author_first_name, u.last_name as author_last_name
       FROM kb_articles kb
       LEFT JOIN users u ON kb.author_id = u.id
       WHERE ${whereClause}
       ORDER BY kb.updated_at DESC`,
      queryParams
    );

    res.json({ articles: result.rows });
  } catch (error) {
    console.error('Get KB articles error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// Get single article
router.get('/:articleId', async (req, res) => {
  const { articleId } = req.params;

  try {
    const result = await db.query(
      `SELECT kb.*, u.first_name as author_first_name, u.last_name as author_last_name
       FROM kb_articles kb
       LEFT JOIN users u ON kb.author_id = u.id
       WHERE kb.id = $1`,
      [articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await db.query(
      'UPDATE kb_articles SET view_count = view_count + 1 WHERE id = $1',
      [articleId]
    );

    res.json({ article: result.rows[0] });
  } catch (error) {
    console.error('Get KB article error:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});

// Create new article
router.post('/', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  const { title, body, htmlBody, category, tags = [], status = 'draft' } = req.body;

  try {
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const articleId = uuidv4();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await db.query(
      `INSERT INTO kb_articles (
        id, organization_id, title, slug, body, html_body, 
        author_id, category, tags, status, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        articleId, req.user.organization_id, title, slug, body, htmlBody,
        req.user.id, category, tags, status,
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json({
      message: 'Article created successfully',
      article: result.rows[0]
    });
  } catch (error) {
    console.error('Create KB article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.put('/:articleId', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  const { articleId } = req.params;
  const { title, body, htmlBody, category, tags, status } = req.body;

  try {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      updateValues.push(title);
      
      // Update slug when title changes
      paramCount++;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      updateFields.push(`slug = $${paramCount}`);
      updateValues.push(slug);
    }

    if (body !== undefined) {
      paramCount++;
      updateFields.push(`body = $${paramCount}`);
      updateValues.push(body);
    }

    if (htmlBody !== undefined) {
      paramCount++;
      updateFields.push(`html_body = $${paramCount}`);
      updateValues.push(htmlBody);
    }

    if (category !== undefined) {
      paramCount++;
      updateFields.push(`category = $${paramCount}`);
      updateValues.push(category);
    }

    if (tags !== undefined) {
      paramCount++;
      updateFields.push(`tags = $${paramCount}`);
      updateValues.push(tags);
    }

    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      updateValues.push(status);
      
      if (status === 'published') {
        paramCount++;
        updateFields.push(`published_at = $${paramCount}`);
        updateValues.push(new Date());
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    updateValues.push(new Date());

    paramCount++;
    updateValues.push(articleId);
    paramCount++;
    updateValues.push(req.user.organization_id);

    const result = await db.query(
      `UPDATE kb_articles 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramCount - 1} AND organization_id = $${paramCount}
       RETURNING *`,
      updateValues
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({
      message: 'Article updated successfully',
      article: result.rows[0]
    });
  } catch (error) {
    console.error('Update KB article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/:articleId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { articleId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM kb_articles WHERE id = $1 AND organization_id = $2 RETURNING title',
      [articleId, req.user.organization_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete KB article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;