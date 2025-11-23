// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Import your database connection
// const db = require('../config/database');
// For MySQL: const mysql = require('mysql2/promise');
// For MongoDB: const User = require('../models/User');
// For PostgreSQL: const { Pool } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// ==========================================
// LOGIN WITH USERNAME & PASSWORD
// ==========================================
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username harus diisi'),
  body('password').notEmpty().withMessage('Password harus diisi'),
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // ==== FOR MySQL ====
    /*
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    const user = rows[0];
    */

    // ==== FOR MongoDB ====
    /*
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    */

    // ==== FOR PostgreSQL ====
    /*
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    const user = result.rows[0];
    */

    // DEMO: Mock user for testing
    const user = {
      id: 1,
      username: 'admin',
      password: '$2a$10$xQXSaRZZ8vJq.cQJ9xT8eeGF5nYZZLZ9qKZvYKZvYKZvYKZvYK', // hashed 'admin123'
      name: 'Administrator',
      email: 'admin@foodkasir.com',
      role: 'admin'
    };

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Update last login (optional)
    /*
    await db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    */

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data without password
    const userResponse = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    };

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// ==========================================
// SOCIAL LOGIN (Google, Facebook, Twitter)
// ==========================================
router.post('/social/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token tidak ditemukan' });
    }

    let userData;

    // Verify token with OAuth provider
    switch (provider) {
      case 'google':
        // Use Google OAuth2 API
        // const { OAuth2Client } = require('google-auth-library');
        // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // const ticket = await client.verifyIdToken({
        //   idToken: token,
        //   audience: process.env.GOOGLE_CLIENT_ID,
        // });
        // userData = ticket.getPayload();
        
        // DEMO: Mock Google user
        userData = {
          sub: 'google-123456',
          name: 'Google User',
          email: 'user@gmail.com',
          picture: 'https://via.placeholder.com/150'
        };
        break;

      case 'facebook':
        // Use Facebook Graph API
        // const fbResponse = await fetch(
        //   `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`
        // );
        // userData = await fbResponse.json();
        
        // DEMO: Mock Facebook user
        userData = {
          id: 'fb-123456',
          name: 'Facebook User',
          email: 'user@facebook.com',
          picture: { data: { url: 'https://via.placeholder.com/150' } }
        };
        break;

      case 'twitter':
        // Use Twitter API v2
        // DEMO: Mock Twitter user
        userData = {
          id: 'twitter-123456',
          name: 'Twitter User',
          email: 'user@twitter.com',
          profile_image_url: 'https://via.placeholder.com/150'
        };
        break;

      default:
        return res.status(400).json({ message: 'Provider tidak valid' });
    }

    // Check if user exists in database
    /*
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR social_id = ? LIMIT 1',
      [userData.email, userData.sub || userData.id]
    );
    */

    let user;
    
    // If user doesn't exist, create new account
    /*
    if (existingUser.length === 0) {
      const [result] = await db.execute(
        `INSERT INTO users (username, email, name, role, social_provider, social_id, avatar, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userData.email.split('@')[0], // username from email
          userData.email,
          userData.name,
          'staff', // default role
          provider,
          userData.sub || userData.id,
          userData.picture?.data?.url || userData.picture || userData.profile_image_url
        ]
      );
      
      user = {
        id: result.insertId,
        username: userData.email.split('@')[0],
        email: userData.email,
        name: userData.name,
        role: 'staff',
        avatar: userData.picture?.data?.url || userData.picture || userData.profile_image_url
      };
    } else {
      user = existingUser[0];
    }
    */

    // DEMO: Mock created user
    user = {
      id: Date.now(),
      username: userData.email?.split('@')[0] || `${provider}_user`,
      email: userData.email,
      name: userData.name,
      role: 'staff',
      avatar: userData.picture?.data?.url || userData.picture || userData.profile_image_url
    };

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Social login berhasil',
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat social login' });
  }
});

// ==========================================
// VERIFY TOKEN
// ==========================================
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // Get user from database
    /*
    const [rows] = await db.execute(
      'SELECT id, username, name, email, role, avatar FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const user = rows[0];
    */

    // DEMO: Mock user
    const user = {
      id: req.user.id,
      username: req.user.username,
      name: 'Administrator',
      email: 'admin@foodkasir.com',
      role: req.user.role,
      avatar: null
    };

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// ==========================================
// LOGOUT
// ==========================================
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Optional: Add token to blacklist in database
    // or implement token refresh mechanism
    
    res.json({
      success: true,
      message: 'Logout berhasil',
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;