-- Then proceed with dropping and creating the database
DROP DATABASE IF EXISTS e_commerce_database;

-- Create database
CREATE DATABASE e_commerce_database;

-- Connect to the newly created database
\c "e_commerce_database"

-- -- Drop tables in correct order (respecting foreign key constraints)
-- DROP TABLE IF EXISTS cart_items CASCADE;
-- DROP TABLE IF EXISTS carts CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. Users:
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    cart_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories:
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Products:
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT REFERENCES Categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders:
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    total_price DECIMAL(10,2) NOT NULL,
    shipping_address JSON NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'canceled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order_Items:
CREATE TABLE Order_Items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(id),
    product_id INT REFERENCES Products(id),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 6. Reviews:
CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(id),
    user_id INT REFERENCES Users(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Carts:
CREATE TABLE Carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cart_items:
CREATE TABLE Cart_items (
  cart_id INTEGER REFERENCES Carts(id),
  product_id INTEGER REFERENCES Products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cart_id, product_id)
);

-- Create missing dependencies
ALTER TABLE Users ADD FOREIGN KEY (cart_id) REFERENCES Carts(id);


-- Populate database with sample data

INSERT INTO Users (name, username, email, password, role) VALUES
('Alice Johnson', 'alice', 'alice@example.com', '$2a$10$vOtFoR7tksV/JTu/u9TioevrO4BIiZsA.sp34ewFIZJKsqm8TONiW', 'customer'),
('Bob Smith', 'bob', 'bob@example.com', '$2a$10$jlHr2OeNbP5Q/xx1TyP7K.rgVf9xLlacuujqfriPmzvXUOxxK8LmG', 'customer'),
('Admin User', 'admin', 'admin@example.com', '$2a$10$bXQyoEx4/Te5EfP7Lsx5be8WiKBXFkoBQiGsR0MdwpxeGvR7a6MaK', 'admin');

-- The passwords are the result of encrypting the name of the user 
-- in lowercase (alice, bob, or admin) using bcrypt and 10 rounds of salt.

INSERT INTO Categories (name) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home Appliances'),
('Furniture');


INSERT INTO Products (name, description, price, stock, category_id) VALUES
('Laptop', 'A powerful laptop with 16GB RAM.', 999.99, 10, 1), -- Electronics
('Smartphone', 'A smartphone with a great camera.', 699.99, 20, 1), -- Electronics
('Fiction Book', 'An engaging fictional story.', 14.99, 50, 2), -- Books
('T-shirt', 'Cotton t-shirt in various sizes.', 9.99, 100, 3), -- Clothing
('Blender', 'A high-speed blender.', 59.99, 15, 4), -- Home Appliances
('Chair', 'A comfortable chair.', 199.99, 25, 5), -- Furniture
('Table', 'A sturdy table.', 299.99, 10, 5), -- Furniture
('Bed', 'A comfortable bed.', 399.99, 15, 5); -- Furniture


INSERT INTO Orders (user_id, total_price, shipping_address, status) VALUES
(1, 1014.98, '{"address": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345"}', 'pending'), -- Alice's order
(2, 79.98, '{"address": "456 Elm St", "city": "Othertown", "state": "NY", "zip": "67890"}', 'shipped'); -- Bob's order


INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 999.99), -- 1 Laptop for Alice
(1, 3, 1, 14.99), -- 1 Fiction Book for Alice
(2, 5, 2, 59.99); -- 2 Blenders for Bob


INSERT INTO Reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Amazing laptop, very fast!'),
(3, 1, 4, 'The book was great, but shipping was slow.'),
(5, 2, 5, 'The blender works perfectly. Great product!');

INSERT INTO Carts (user_id) VALUES
(1),
(2);

-- Assign cart_id to users
UPDATE Users SET cart_id = 1 WHERE id = 1;
UPDATE Users SET cart_id = 2 WHERE id = 2;

INSERT INTO Cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),
(2, 2, 1),
(1, 2, 2);


