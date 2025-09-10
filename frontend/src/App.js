import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_CATALOG = 'http://localhost:3001';
const API_ORDER = 'http://localhost:3002';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const addToCart = (book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">Bookstore</Link>
          <div className="nav-links">
            <Link to="/search">Search</Link>
            {user ? (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/cart">Cart ({cart.length})</Link>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/search" element={<Search addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ addToCart }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`${API_CATALOG}/books`).then(res => setBooks(res.data));
  }, []);

  return (
    <div className="home">
      <h1>Featured Books</h1>
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.cover_image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p className="price">${book.price}</p>
            <button onClick={() => addToCart(book)} className="add-to-cart">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Search({ addToCart }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    try {
      const res = await axios.post(`${API_CATALOG}/books/search`, { query });
      setResults(res.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="search">
      <h1>Search Books</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author..."
        />
        <button type="submit">Search</button>
      </form>
      
      <div className="book-grid">
        {results.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.cover_image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p className="price">${book.price}</p>
            <button onClick={() => addToCart(book)} className="add-to-cart">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_ORDER}${endpoint}`, formData);
      onLogin(res.data.user, res.data.token);
    } catch (error) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="auth">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

function Profile() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_ORDER}/orders`).then(res => setOrders(res.data));
  }, []);

  return (
    <div className="profile">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders">
          {orders.map(order => (
            <div key={order.id} className="order">
              <p>Order #{order.id} - ${order.total} - {order.status}</p>
              <p>{order.title} by {order.author} (Qty: {order.quantity})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Cart({ cart, setCart, user }) {
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const checkout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    try {
      const items = cart.map(item => ({
        book_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      await axios.post(`${API_ORDER}/cart`, { items });
      setCart([]);
      alert('Order placed successfully!');
    } catch (error) {
      alert('Checkout failed');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.cover_image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.author}</p>
                <p>${item.price}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => updateQuantity(item.id, 0)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: ${total.toFixed(2)}</h2>
            <button onClick={checkout} className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
