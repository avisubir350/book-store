const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bookstore'
});

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, password, name]
    );
    
    const userId = result.insertId;
    const token = jwt.sign({ userId }, JWT_SECRET);
    
    res.status(201).json({ 
      token, 
      user: { id: userId, email, name },
      message: 'User registered successfully' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cart', auth, async (req, res) => {
  try {
    console.log('Cart request received:', req.body);
    console.log('User:', req.user);
    
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [req.user.userId, total]
    );
    
    const orderId = result.insertId;
    
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id || item.id, item.quantity, item.price]
      );
    }
    
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT o.id, o.user_id, o.total, o.status, o.created_at,
             oi.book_id, oi.quantity, oi.price as item_price,
             'Sample Book' as title, 'Sample Author' as author
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.userId]);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
