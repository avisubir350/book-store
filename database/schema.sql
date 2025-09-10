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
('The God of Small Things', 'Arundhati Roy', 15.50, 'https://placehold.co/400x600/b84149/ffffff?text=The+God+of+Small+Things', 'A story about two children, Estha and Rahel, whose lives are shattered by a family tragedy in Kerala, India.'),
('A Suitable Boy', 'Vikram Seth', 25.00, 'https://placehold.co/400x600/3e6396/ffffff?text=A+Suitable+Boy', 'A sweeping saga of four families and the search for a suitable husband for a young woman named Lata.'),
('The White Tiger', 'Aravind Adiga', 14.75, 'https://placehold.co/400x600/1e2a4a/ffffff?text=The+White+Tiger', 'A satirical novel about a man from a poor Indian village who makes his way to the top of the social ladder.'),
('The Immortals of Meluha', 'Amish Tripathi', 11.20, 'https://placehold.co/400x600/9b59b6/ffffff?text=The+Immortals+of+Meluha', 'The first book in the Shiva Trilogy, a mythological fantasy series reimagining the Hindu god Shiva.'),
('The Palace of Illusions', 'Chitra Banerjee Divakaruni', 16.00, 'https://placehold.co/400x600/5a917c/ffffff?text=The+Palace+of+Illusions', 'A compelling retelling of the Indian epic Mahabharata from the point of view of Panchaali, the wife of the five Pandava brothers.'),
('Train to Pakistan', 'Khushwant Singh', 9.99, 'https://placehold.co/400x600/f39c12/ffffff?text=Train+to+Pakistan', 'A novel about the partition of India in 1947, and the tragic train journeys between the two new nations.'),
('Midnight''s Children', 'Salman Rushdie', 18.50, 'https://placehold.co/400x600/e67e22/ffffff?text=Midnight%27s+Children', 'A story of a child born at the stroke of midnight on the day of India''s independence, with telepathic powers.'),
('Interpreter of Maladies', 'Jhumpa Lahiri', 13.00, 'https://placehold.co/400x600/34495e/ffffff?text=Interpreter+of+Maladies', 'A collection of short stories exploring the lives of Indians and Indian-Americans caught between two cultures.'),
('The Ministry of Utmost Happiness', 'Arundhati Roy', 17.25, 'https://placehold.co/400x600/7f8c8d/ffffff?text=The+Ministry+of+Utmost+Happiness', 'A sprawling novel that tells the story of an intersex woman and a woman named Tilo who live in a graveyard.'),
('The Namesake', 'Jhumpa Lahiri', 14.50, 'https://placehold.co/400x600/c0392b/ffffff?text=The+Namesake', 'A poignant novel about the Ganguli family''s struggles and triumphs as they move from Calcutta to Massachusetts.');
