CREATE DATABASE bookstore;
USE bookstore;

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cover_image VARCHAR(500),
  description TEXT
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  book_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO books (title, author, price, cover_image, description) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 'https://covers.openlibrary.org/b/id/8225261-L.jpg', 'Classic American novel'),
('To Kill a Mockingbird', 'Harper Lee', 14.99, 'https://covers.openlibrary.org/b/id/8226374-L.jpg', 'Pulitzer Prize winner'),
('1984', 'George Orwell', 13.99, 'https://covers.openlibrary.org/b/id/7222246-L.jpg', 'Dystopian masterpiece');
