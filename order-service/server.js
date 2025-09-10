const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bookstore'
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
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET);
    res.json({ token, user: { id: result.insertId, email, name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0 || !await bcrypt.compare(password, rows[0].password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cart', auth, async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [req.user.id, total]
    );
    
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.book_id, item.quantity, item.price]
      );
    }
    
    res.json({ orderId: orderResult.insertId, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders', auth, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, oi.book_id, oi.quantity, oi.price, b.title, b.author 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       LEFT JOIN books b ON oi.book_id = b.id 
       WHERE o.user_id = ?`,
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => console.log('Order service running on port 3002'));
