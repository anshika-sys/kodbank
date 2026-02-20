require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Initialize database
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create KodUser table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('customer', 'manager', 'admin') DEFAULT 'customer',
        balance DECIMAL(15, 2) DEFAULT 100000.00,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create UserToken table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(500) NOT NULL,
        uid INT NOT NULL,
        expiry DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('⚠️  Server will continue running. Please check your Aiven MySQL service.');
    console.log('⚠️  Visit https://console.aiven.io/ to verify your service is running.');
  }
}

// Try to initialize database, but don't block server startup
initDatabase();

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const connection = await pool.getConnection();
    
    // Check if token exists and is not expired
    const [tokens] = await connection.query(
      'SELECT * FROM UserToken WHERE token = ? AND expiry > NOW()',
      [token]
    );

    connection.release();

    if (tokens.length === 0) {
      return res.status(401).json({ success: false, message: 'Token expired or invalid' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
  let connection;
  const { uid, username, email, password, phone, role, balance } = req.body;

  if (!uid || !username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Validate role
  if (!['customer', 'manager', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role. Must be customer, manager, or admin' });
  }

  try {
    connection = await pool.getConnection();
    
    // Check if user exists
    const [existing] = await connection.query(
      'SELECT * FROM KodUser WHERE uid = ? OR username = ? OR email = ?',
      [uid, username, email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ success: false, message: 'User ID, Username or Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with custom uid - auto-verified
    const [result] = await connection.query(
      'INSERT INTO KodUser (uid, username, email, password, phone, role, balance, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uid, username, email, hashedPassword, phone, role, balance || 100000.00, true]
    );

    connection.release();

    res.json({ 
      success: true, 
      message: 'Registration successful! You can now login.',
      uid,
      role,
      balance: balance || 100000
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  let connection;
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token required' });
  }

  try {
    connection = await pool.getConnection();
    
    // Check token validity
    const [tokens] = await connection.query(
      'SELECT * FROM UserToken WHERE token = ? AND expiry > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const { uid } = tokens[0];

    // Update user verification status
    await connection.query(
      'UPDATE KodUser SET is_verified = true WHERE uid = ?',
      [uid]
    );

    // Delete verification token
    await connection.query('DELETE FROM UserToken WHERE token = ?', [token]);

    connection.release();

    res.json({ success: true, message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    if (connection) connection.release();
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  let connection;
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  try {
    connection = await pool.getConnection();
    
    // Find user
    const [users] = await connection.query(
      'SELECT * FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { uid: user.uid, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    await connection.query(
      'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiry]
    );

    connection.release();

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({ 
      success: true, 
      message: 'Login successful!',
      user: { 
        uid: user.uid,
        username: user.username, 
        role: user.role 
      }
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check balance endpoint
app.get('/api/balance', verifyToken, async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    
    const [users] = await connection.query(
      'SELECT balance, username, role FROM KodUser WHERE uid = ?',
      [req.user.uid]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    res.json({ 
      success: true, 
      balance: user.balance,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Balance check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout endpoint
app.post('/api/logout', verifyToken, async (req, res) => {
  let connection;
  const token = req.cookies.authToken;

  try {
    connection = await pool.getConnection();
    
    // Delete token from database
    await connection.query('DELETE FROM UserToken WHERE token = ?', [token]);

    connection.release();

    // Clear cookie
    res.clearCookie('authToken');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    if (connection) connection.release();
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 KodNest Secure Bank server running on http://localhost:${PORT}`);
});
