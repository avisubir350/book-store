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
    if (token && userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
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
          <Link to="/" className="logo">Indian Bookstore</Link>
          <div className="nav-links">
            <Link to="/search">Search</Link>
            {user ? (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/cart">Cart ({cart.length})</Link>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/search" element={<Search addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register onLogin={login} />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
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
      <h1>Featured Indian Books</h1>
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img 
              src={book.cover_image || 'https://via.placeholder.com/160x220?text=No+Image'} 
              alt={book.title}
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/160x220?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/160x220?text=No+Image';
                }
              }}
            />
            <h3>{book.title}</h3>
            <p className="author">by {book.author}</p>
            <p className="description">{book.description}</p>
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
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    try {
      const res = await axios.post(`${API_CATALOG}/books/search`, { query });
      setResults(res.data);
      setSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSearched(true);
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
      
      {searched && results.length === 0 && (
        <p className="no-results">No books available matching your search.</p>
      )}
      
      <div className="book-grid">
        {results.map(book => (
          <div key={book.id} className="book-card">
            <img 
              src={book.cover_image || 'https://via.placeholder.com/160x220?text=No+Image'} 
              alt={book.title}
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/160x220?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/160x220?text=No+Image';
                }
              }}
            />
            <h3>{book.title}</h3>
            <p className="author">by {book.author}</p>
            <p className="description">{book.description}</p>
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

function Register({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_ORDER}/auth/register`, formData);
      alert('Registration successful! Please login with your credentials.');
      window.location.href = '/login';
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_ORDER}/auth/login`, formData);
      onLogin(res.data.user, res.data.token);
      window.location.href = '/';
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="auth">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get(`${API_ORDER}/orders`).then(res => setOrders(res.data));
  }, []);

  const groupedOrders = orders.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        id: item.id,
        total: item.total,
        status: item.status,
        created_at: item.created_at,
        items: []
      };
    }
    if (item.book_id) {
      acc[item.id].items.push({
        title: item.title,
        author: item.author,
        quantity: item.quantity,
        price: item.item_price
      });
    }
    return acc;
  }, {});

  if (selectedOrder) {
    return (
      <div className="cart">
        <button onClick={() => setSelectedOrder(null)} className="add-to-cart">← Back to Orders</button>
        <h1>Order Details #{selectedOrder.id}</h1>
        <p><strong>Status:</strong> {selectedOrder.status}</p>
        <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${selectedOrder.total}</p>
        
        <h3>Items:</h3>
        {selectedOrder.items.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.title}</h4>
              <p>by {item.author}</p>
              <p>Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>My Orders</h1>
      {Object.values(groupedOrders).length === 0 ? (
        <p>No orders yet</p>
      ) : (
        Object.values(groupedOrders).map(order => (
          <div key={order.id} className="cart-item">
            <div className="cart-item-info">
              <h4>Order #{order.id}</h4>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
            </div>
            <button onClick={() => setSelectedOrder(order)} className="add-to-cart">
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function Profile({ user }) {
  return (
    <div className="cart">
      <h1>My Profile</h1>
      
      <div className="cart-item" style={{marginBottom: '30px', backgroundColor: '#f8f9fa'}}>
        <div className="cart-item-info">
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      </div>
    </div>
  );
}

function Cart({ cart, setCart, user }) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    setShowAddressForm(true);
  };

  const placeOrder = async () => {
    try {
      const items = cart.map(item => ({
        book_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Sending checkout request:', { items });
      const response = await axios.post(`${API_ORDER}/cart`, { items });
      console.log('Checkout response:', response.data);
      setCart([]);
      setShowAddressForm(false);
      setAddress({ name: '', street: '', city: '', state: '', zipCode: '', country: '' });
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (showAddressForm) {
    return (
      <div className="cart">
        <h1>Shipping Address</h1>
        <div className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={address.name}
            onChange={(e) => setAddress({...address, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={address.zipCode}
            onChange={(e) => setAddress({...address, zipCode: e.target.value})}
          />
          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({...address, country: e.target.value})}
          />
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button onClick={() => setShowAddressForm(false)}>Back to Cart</button>
            <button onClick={placeOrder} className="checkout-btn">Place Order - ${total.toFixed(2)}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.cover_image || 'https://via.placeholder.com/80x110?text=No+Image'} 
                alt={item.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x110?text=No+Image';
                }}
              />
              <div className="cart-item-info">
                <h4>{item.title}</h4>
                <p>by {item.author}</p>
                <p>${item.price}</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: ${total.toFixed(2)}</h2>
            <button onClick={handleCheckout} className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
