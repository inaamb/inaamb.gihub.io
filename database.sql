-- ============================================
-- FarmConnect Database Schema
-- Simple SQL structure for student project
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS farmconnect;
USE farmconnect;

-- ============================================
-- 1. USERS TABLE (Base User class)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('farmer', 'buyer', 'admin') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- ============================================
-- 2. FARMERS TABLE (Farmer class - extends User)
-- ============================================
CREATE TABLE farmers (
    farmer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    farm_type ENUM('crop', 'livestock', 'mixed', 'orchard') NOT NULL,
    location VARCHAR(255) NOT NULL,
    farm_size DECIMAL(10, 2),
    years_experience INT,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_farm_type (farm_type),
    INDEX idx_location (location)
);

-- ============================================
-- 3. PRODUCTS TABLE (Product class)
-- ============================================
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category ENUM('vegetable', 'fruit', 'grain', 'dairy', 'meat') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit ENUM('kg', 'g', 'liter', 'piece') NOT NULL DEFAULT 'kg',
    organic_certified BOOLEAN DEFAULT FALSE,
    harvest_date DATE,
    status ENUM('available', 'sold_out', 'harvesting') DEFAULT 'available',
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_farmer_product (farmer_id, product_name)
);

-- ============================================
-- 4. WEATHER ALERTS TABLE
-- ============================================
CREATE TABLE weather_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    alert_type ENUM('rain', 'storm', 'heat', 'frost', 'wind') NOT NULL,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    message TEXT NOT NULL,
    alert_date DATE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_farmer_date (farmer_id, alert_date),
    INDEX idx_severity (severity)
);

-- ============================================
-- 5. MARKET PRICES TABLE
-- ============================================
CREATE TABLE market_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_date DATE NOT NULL,
    trend ENUM('increasing', 'decreasing', 'stable') DEFAULT 'stable',
    
    INDEX idx_product_date (product_name, recorded_date),
    INDEX idx_market (market_name)
);

-- ============================================
-- 6. ORDERS TABLE (Order class)
-- ============================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATE,
    
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- ============================================
-- 7. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    INDEX idx_order (order_id)
);

-- ============================================
-- 8. MEAL KITS TABLE
-- ============================================
CREATE TABLE meal_kits (
    kit_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('vegetarian', 'protein', 'family', 'low_carb') NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    serves INT NOT NULL,
    prep_time INT,
    
    INDEX idx_category (category),
    INDEX idx_price (base_price)
);

-- ============================================
-- 9. FORUM TOPICS TABLE
-- ============================================
CREATE TABLE forum_topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('crops', 'livestock', 'market', 'weather', 'general') NOT NULL,
    is_expert_question BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 10. SAMPLE DATA INSERTION
-- ============================================

-- Insert sample users
INSERT INTO users (user_type, full_name, email, phone, password_hash) VALUES
('farmer', 'John Farmer', 'john@greenvalley.com', '555-0101', 'hashed_password_1'),
('farmer', 'Sarah Grower', 'sarah@sunnyacres.com', '555-0102', 'hashed_password_2'),
('buyer', 'Mike Customer', 'mike@email.com', '555-0201', 'hashed_password_3'),
('buyer', 'Lisa Shopper', 'lisa@email.com', '555-0202', 'hashed_password_4');

-- Insert farmers
INSERT INTO farmers (user_id, farm_name, farm_type, location, farm_size, years_experience) VALUES
(1, 'Green Valley Farm', 'crop', 'North Region', 50.5, 15),
(2, 'Sunny Acres', 'mixed', 'South Region', 120.0, 25);

-- Insert products
INSERT INTO products (farmer_id, product_name, category, quantity, price_per_unit, unit, organic_certified) VALUES
(1, 'Organic Tomatoes', 'vegetable', 50.0, 2.75, 'kg', TRUE),
(1, 'Fresh Lettuce', 'vegetable', 30.0, 3.00, 'kg', TRUE),
(2, 'Carrots', 'vegetable', 100.0, 1.90, 'kg', FALSE),
(2, 'Potatoes', 'vegetable', 200.0, 1.40, 'kg', FALSE);

-- Insert market prices
INSERT INTO market_prices (product_name, market_name, price, unit, recorded_date, trend) VALUES
('Tomatoes', 'Central Market', 2.75, 'kg', CURDATE(), 'increasing'),
('Potatoes', 'Central Market', 1.40, 'kg', CURDATE(), 'stable'),
('Carrots', 'Central Market', 1.90, 'kg', CURDATE(), 'increasing'),
('Lettuce', 'Central Market', 3.00, 'kg', CURDATE(), 'increasing');

-- Insert meal kits
INSERT INTO meal_kits (kit_name, description, category, base_price, serves, prep_time) VALUES
('Vegetarian Delight', '3 plant-based meals with fresh vegetables', 'vegetarian', 34.99, 2, 30),
('Protein Power Pack', 'High-protein meals for active lifestyles', 'protein', 42.99, 2, 25),
('Family Feast', 'Hearty meals perfect for family dinners', 'family', 58.99, 4, 40);

-- ============================================
-- 11. USEFUL VIEWS FOR REPORTING
-- ============================================

-- View for farmer overview
CREATE VIEW farmer_overview AS
SELECT 
    f.farmer_id,
    u.full_name,
    f.farm_name,
    f.farm_type,
    f.location,
    COUNT(p.product_id) as total_products,
    SUM(p.quantity) as total_inventory,
    COALESCE(SUM(o.total_amount), 0) as total_sales
FROM farmers f
JOIN users u ON f.user_id = u.user_id
LEFT JOIN products p ON f.farmer_id = p.farmer_id
LEFT JOIN orders o ON f.farmer_id = o.farmer_id
GROUP BY f.farmer_id;

-- View for popular products
CREATE VIEW popular_products AS
SELECT 
    p.product_name,
    p.category,
    f.farm_name,
    COUNT(oi.item_id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold
FROM products p
JOIN farmers f ON p.farmer_id = f.farmer_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id
ORDER BY times_ordered DESC;

-- ============================================
-- 12. SAMPLE QUERIES FOR DEMONSTRATION
-- ============================================

-- Query 1: Get all products from a specific farmer
-- SELECT p.* FROM products p 
-- JOIN farmers f ON p.farmer_id = f.farmer_id 
-- WHERE f.farm_name = 'Green Valley Farm';

-- Query 2: Get current market prices
-- SELECT * FROM market_prices 
-- WHERE recorded_date = CURDATE() 
-- ORDER BY product_name;

-- Query 3: Get farmer's weather alerts
-- SELECT * FROM weather_alerts 
-- WHERE farmer_id = 1 AND is_read = FALSE 
-- ORDER BY alert_date DESC;

-- Query 4: Get buyer's order history
-- SELECT o.*, f.farm_name 
-- FROM orders o 
-- JOIN farmers f ON o.farmer_id = f.farmer_id 
-- WHERE o.buyer_id = 3 
-- ORDER BY o.order_date DESC;

-- ============================================
-- 13. DATABASE COMMENTS
-- ============================================

-- This database supports the FarmConnect prototype
-- Created for student project demonstration
-- Tables represent the main classes in the system:
-- 1. users -> User class
-- 2. farmers -> Farmer class (extends User)
-- 3. products -> Product class
-- 4. orders -> Order class
-- 5. meal_kits -> MealKit functionality

-- Note: In the actual prototype, LocalStorage is used
-- This SQL file shows the database structure that would
-- be used in a production version

-- End of SQL Schema