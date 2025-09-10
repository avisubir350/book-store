const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bookstore'
});

app.get('/books', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/books/search', async (req, res) => {
  try {
    const { query } = req.body;
    const [rows] = await db.execute(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Catalog service running on port 3001'));
