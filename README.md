# E-commerce Bookstore Application

A full-stack bookstore application with microservices architecture.

## Architecture

- **Frontend**: React SPA with responsive design
- **Backend**: Two Node.js microservices
- **Database**: MySQL with shared schema

## Setup Instructions

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Start Catalog Service
```bash
cd catalog-service
npm install
npm start
# Runs on http://localhost:3001
```

### 3. Start Order Service
```bash
cd order-service
npm install
npm start
# Runs on http://localhost:3002
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## API Endpoints

### Catalog Service (Port 3001)
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books/search` - Search books

### Order Service (Port 3002)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /cart` - Create order from cart
- `GET /orders` - Get user orders

## Features

- Responsive book grid with cover images
- Search and filter functionality
- User authentication and registration
- Shopping cart with quantity management
- Order history in user profile
- Secure JWT-based authentication
