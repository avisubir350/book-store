USE bookstore;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM books;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO books (title, author, price, cover_image, description) VALUES
('Pather Panchali', 'Bibhutibhushan Bandyopadhyay', 12.99, 'https://covers.openlibrary.org/b/isbn/8129116227-L.jpg', 'The first novel in the Apu trilogy, depicting rural life in Bengal through the eyes of a young boy.'),
('Devdas', 'Sarat Chandra Chattopadhyay', 14.50, 'https://covers.openlibrary.org/b/isbn/8129116235-L.jpg', 'A tragic love story of Devdas and his childhood love Paro, one of the most famous Bengali novels.'),
('Chokher Bali', 'Rabindranath Tagore', 16.99, 'https://covers.openlibrary.org/b/isbn/8129116243-L.jpg', 'A complex tale of love, desire, and social constraints in early 20th century Bengal.'),
('Gora', 'Rabindranath Tagore', 18.75, 'https://covers.openlibrary.org/b/isbn/8129116251-L.jpg', 'Tagores longest novel exploring themes of nationalism, identity, and social reform in colonial India.'),
('Parineeta', 'Sarat Chandra Chattopadhyay', 13.25, 'https://covers.openlibrary.org/b/isbn/8129116269-L.jpg', 'A beautiful love story set in early 20th century Calcutta between Lalita and Shekhar.'),
('Aparajito', 'Bibhutibhushan Bandyopadhyay', 15.50, 'https://covers.openlibrary.org/b/isbn/8129116277-L.jpg', 'The second part of the Apu trilogy, following Apus journey from village to city.'),
('Ghare Baire', 'Rabindranath Tagore', 17.00, 'https://covers.openlibrary.org/b/isbn/8129116285-L.jpg', 'The Home and the World - a novel about the Swadeshi movement and its impact on personal relationships.'),
('Srikanta', 'Sarat Chandra Chattopadhyay', 19.99, 'https://covers.openlibrary.org/b/isbn/8129116293-L.jpg', 'A four-part autobiographical novel following the wandering life of Srikanta.'),
('Kapalkundala', 'Bankim Chandra Chattopadhyay', 11.75, 'https://covers.openlibrary.org/b/isbn/8129116301-L.jpg', 'A romantic novel set on the seashore of Odisha, blending love with supernatural elements.'),
('Anandamath', 'Bankim Chandra Chattopadhyay', 14.99, 'https://covers.openlibrary.org/b/isbn/8129116319-L.jpg', 'Historical novel about the Sannyasi Rebellion, featuring the famous song Vande Mataram.'),
('Durgeshnandini', 'Bankim Chandra Chattopadhyay', 13.50, 'https://covers.openlibrary.org/b/isbn/8129116327-L.jpg', 'The first Bengali novel, a historical romance set in medieval Bengal.'),
('Bipradas', 'Sarat Chandra Chattopadhyay', 12.25, 'https://covers.openlibrary.org/b/isbn/8129116335-L.jpg', 'A social novel dealing with the struggles of the lower middle class in Bengal.'),
('Nastanirh', 'Rabindranath Tagore', 15.75, 'https://covers.openlibrary.org/b/isbn/8129116343-L.jpg', 'The Broken Nest - a story of marital discord and emotional awakening.'),
('Grihadaha', 'Sarat Chandra Chattopadhyay', 16.50, 'https://covers.openlibrary.org/b/isbn/8129116351-L.jpg', 'A powerful novel about womens oppression and the burning issues of domestic life.'),
('Jogajog', 'Rabindranath Tagore', 14.25, 'https://covers.openlibrary.org/b/isbn/8129116369-L.jpg', 'Relationships - exploring the complex web of human connections and misunderstandings.'),
('Charitraheen', 'Sarat Chandra Chattopadhyay', 17.99, 'https://covers.openlibrary.org/b/isbn/8129116377-L.jpg', 'The Characterless - a controversial novel challenging social norms about womens character.'),
('Rajsingha', 'Bankim Chandra Chattopadhyay', 13.99, 'https://covers.openlibrary.org/b/isbn/8129116385-L.jpg', 'A historical novel set in medieval Rajasthan, depicting the conflict between Rajputs and Mughals.'),
('Datta', 'Sarat Chandra Chattopadhyay', 11.99, 'https://covers.openlibrary.org/b/isbn/8129116393-L.jpg', 'A social drama exploring themes of adoption, family bonds, and social prejudices.'),
('Malancha', 'Rabindranath Tagore', 16.25, 'https://covers.openlibrary.org/b/isbn/8129116401-L.jpg', 'A story of love and sacrifice set against the backdrop of rural Bengal.'),
('Krishnakanter Will', 'Bankim Chandra Chattopadhyay', 15.25, 'https://covers.openlibrary.org/b/isbn/8129116419-L.jpg', 'A complex family saga involving inheritance, love, and moral dilemmas in 19th century Bengal.');
