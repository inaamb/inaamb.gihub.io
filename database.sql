-- ============================================
-- FarmConnect Database Schema
-- MySQL 8.0 / PostgreSQL compatible
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS farmconnect;
USE farmconnect;

-- ============================================
-- 1. USERS TABLE (for both farmers and buyers)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('farmer', 'buyer', 'admin') NOT NULL DEFAULT 'buyer',
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 2. FARMERS TABLE (extends users)
-- ============================================
CREATE TABLE farmers (
    farmer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    farm_type ENUM('crop', 'livestock', 'mixed', 'orchard', 'poultry', 'dairy') NOT NULL,
    farm_size DECIMAL(10, 2) COMMENT 'in acres/hectares',
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    certification ENUM('organic', 'non_organic', 'in_transition') DEFAULT 'non_organic',
    farm_description TEXT,
    years_experience INT,
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_farm_type (farm_type),
    INDEX idx_location (location),
    INDEX idx_certification (certification)
);

-- ============================================
-- 3. FARM PRODUCTS / INVENTORY
-- ============================================
CREATE TABLE farm_products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category ENUM('vegetable', 'fruit', 'grain', 'dairy', 'meat', 'poultry', 'herbs', 'other') NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    harvest_date DATE,
    expected_yield DECIMAL(10, 2),
    actual_yield DECIMAL(10, 2),
    unit ENUM('kg', 'ton', 'liter', 'piece', 'dozen', 'box') NOT NULL,
    status ENUM('planted', 'growing', 'ready', 'harvested', 'in_storage', 'sold_out') DEFAULT 'planted',
    organic_certified BOOLEAN DEFAULT FALSE,
    price_per_unit DECIMAL(10, 2),
    min_order_quantity INT DEFAULT 1,
    available_quantity DECIMAL(10, 2),
    product_description TEXT,
    product_image VARCHAR(255),
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_farmer_product (farmer_id, product_name),
    FULLTEXT idx_product_search (product_name, product_description)
);

-- ============================================
-- 4. WEATHER ALERTS SYSTEM
-- ============================================
CREATE TABLE weather_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    alert_type ENUM('rain', 'storm', 'heat', 'frost', 'drought', 'flood', 'wind', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_date DATE NOT NULL,
    effective_from DATETIME,
    effective_to DATETIME,
    location VARCHAR(255),
    recommended_action TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_email BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_farmer_date (farmer_id, alert_date),
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity)
);

-- ============================================
-- 5. MARKET PRICES DATABASE
-- ============================================
CREATE TABLE market_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_date DATE NOT NULL,
    trend ENUM('increasing', 'decreasing', 'stable') DEFAULT 'stable',
    price_change_percent DECIMAL(5, 2),
    source VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT,
    
    FOREIGN KEY (verified_by) REFERENCES users(user_id),
    INDEX idx_product_date (product_name, recorded_date),
    INDEX idx_region (region),
    INDEX idx_market (market_name),
    UNIQUE KEY unique_market_price (product_name, market_name, recorded_date)
);

-- ============================================
-- 6. SELLING SUGGESTIONS (AI Recommendations)
-- ============================================
CREATE TABLE selling_suggestions (
    suggestion_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    product_id INT NOT NULL,
    suggested_action ENUM('sell_now', 'wait', 'store', 'process') NOT NULL,
    suggested_price DECIMAL(10, 2),
    reason TEXT NOT NULL,
    confidence_score DECIMAL(5, 2) COMMENT '0-100 confidence percentage',
    expected_price_in_week DECIMAL(10, 2),
    expected_price_in_month DECIMAL(10, 2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_viewed BOOLEAN DEFAULT FALSE,
    action_taken ENUM('followed', 'ignored', 'delayed') DEFAULT NULL,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id),
    FOREIGN KEY (product_id) REFERENCES farm_products(product_id),
    INDEX idx_farmer_product (farmer_id, product_id),
    INDEX idx_generated_at (generated_at)
);

-- ============================================
-- 7. FORUM / DISCUSSION SYSTEM
-- ============================================
CREATE TABLE forum_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_name (category_name)
);

CREATE TABLE forum_topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    is_expert_question BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES forum_categories(category_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_category (category_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_topic_search (title, content)
);

CREATE TABLE forum_replies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    is_expert BOOLEAN DEFAULT FALSE,
    is_verified_answer BOOLEAN DEFAULT FALSE,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (topic_id) REFERENCES forum_topics(topic_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_topic (topic_id),
    INDEX idx_user (user_id)
);

-- ============================================
-- 8. EXPERTS TABLE
-- ============================================
CREATE TABLE experts (
    expert_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    specialization ENUM('crops', 'livestock', 'soil', 'irrigation', 'pest', 'market', 'organic') NOT NULL,
    qualifications TEXT,
    experience_years INT,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_answers INT DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_specialization (specialization),
    INDEX idx_verification (verification_status)
);

-- ============================================
-- 9. PRODUCT LISTINGS FOR SALE
-- ============================================
CREATE TABLE product_listings (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    product_id INT NOT NULL,
    listing_title VARCHAR(200) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    available_quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    min_order_quantity DECIMAL(10, 2) DEFAULT 1,
    max_order_quantity DECIMAL(10, 2),
    harvest_date DATE,
    expiry_date DATE,
    is_organic BOOLEAN DEFAULT FALSE,
    images JSON,
    status ENUM('draft', 'published', 'sold_out', 'expired', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id),
    FOREIGN KEY (product_id) REFERENCES farm_products(product_id),
    INDEX idx_farmer (farmer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_listing_search (listing_title, description)
);

-- ============================================
-- 10. ORDERS & TRANSACTIONS
-- ============================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    grand_total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_method ENUM('credit_card', 'debit_card', 'bank_transfer', 'cash_on_delivery', 'mobile_money'),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    delivery_instructions TEXT,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_farmer (farmer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_order_number (order_number)
);

CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    listing_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES product_listings(listing_id),
    INDEX idx_order (order_id)
);

-- ============================================
-- 11. MEAL KITS SYSTEM
-- ============================================
CREATE TABLE meal_kits (
    kit_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('vegetarian', 'protein', 'family', 'low_carb', 'quick', 'healthy', 'budget') NOT NULL,
    serves INT NOT NULL,
    prep_time INT COMMENT 'in minutes',
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    base_price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    calories_per_serving INT,
    ingredients_list TEXT,
    cooking_instructions TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    FULLTEXT idx_kit_search (kit_name, description)
);

CREATE TABLE meal_kit_ingredients (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    notes TEXT,
    
    FOREIGN KEY (kit_id) REFERENCES meal_kits(kit_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES farm_products(product_id),
    INDEX idx_kit (kit_id)
);

CREATE TABLE meal_kit_orders (
    meal_order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL,
    kit_id INT NOT NULL,
    customization JSON COMMENT 'Stores dietary preferences and modifications',
    portion_size ENUM('single', 'couple', 'family_4', 'family_6') NOT NULL,
    frequency ENUM('one_time', 'weekly', 'biweekly', 'monthly') DEFAULT 'one_time',
    delivery_address TEXT NOT NULL,
    delivery_schedule JSON,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    next_delivery_date DATE,
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (kit_id) REFERENCES meal_kits(kit_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_status (status)
);

-- ============================================
-- 12. NOTIFICATIONS SYSTEM
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type ENUM('weather', 'price_alert', 'discount', 'order_update', 'forum_reply', 'expert_answer', 'system', 'promotion') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(255),
    related_id INT COMMENT 'ID of related item (order_id, topic_id, etc.)',
    is_read BOOLEAN DEFAULT FALSE,
    is_sent_sms BOOLEAN DEFAULT FALSE,
    is_sent_email BOOLEAN DEFAULT FALSE,
    is_sent_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id, is_read),
    INDEX idx_type (notification_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 13. DISCOUNTS & PROMOTIONS
-- ============================================
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_code VARCHAR(50) UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed', 'bundle') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order DECIMAL(10, 2) DEFAULT 0,
    applicable_to ENUM('all', 'farmers', 'buyers', 'specific_product', 'specific_farmer') DEFAULT 'all',
    applicable_product_ids JSON COMMENT 'Array of product IDs if applicable',
    applicable_farmer_ids JSON COMMENT 'Array of farmer IDs if applicable',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INT DEFAULT 0,
    times_used INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_promo_code (promotion_code),
    INDEX idx_active_date (is_active, start_date, end_date),
    INDEX idx_discount_type (discount_type)
);

-- ============================================
-- 14. USER PREFERENCES
-- ============================================
CREATE TABLE user_preferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    sms_alerts BOOLEAN DEFAULT TRUE,
    email_alerts BOOLEAN DEFAULT TRUE,
    push_alerts BOOLEAN DEFAULT TRUE,
    discount_alerts BOOLEAN DEFAULT TRUE,
    weather_alerts BOOLEAN DEFAULT TRUE,
    price_alerts BOOLEAN DEFAULT TRUE,
    preferred_categories JSON COMMENT 'Array of preferred product categories',
    delivery_preferences JSON,
    notification_frequency ENUM('immediate', 'daily', 'weekly') DEFAULT 'immediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- 15. REVIEWS & RATINGS
-- ============================================
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_id INT NOT NULL COMMENT 'Could be farmer_id or product_id',
    review_type ENUM('farmer', 'product', 'meal_kit') NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSON,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id),
    INDEX idx_reviewed (reviewed_id, review_type),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 16. SAMPLE DATA INSERTION
-- ============================================

-- Insert forum categories
INSERT INTO forum_categories (category_name, description, icon) VALUES
('Crop Farming', 'Discussions about growing crops, best practices, and troubleshooting', 'fas fa-seedling'),
('Livestock & Animals', 'Animal husbandry, veterinary advice, and livestock management', 'fas fa-cow'),
('Market & Sales', 'Selling strategies, pricing, and market trends', 'fas fa-chart-line'),
('Weather & Climate', 'Weather patterns, climate adaptation, and seasonal planning', 'fas fa-cloud-sun'),
('Organic Farming', 'Sustainable and organic farming methods', 'fas fa-leaf'),
('Technology in Farming', 'Farm tech, automation, and digital tools', 'fas fa-robot'),
('Pest & Disease Control', 'Identifying and treating plant diseases and pests', 'fas fa-bug'),
('Irrigation & Water', 'Water management and irrigation systems', 'fas fa-tint'),
('Government Schemes', 'Information about government subsidies and schemes', 'fas fa-landmark');

-- Insert sample meal kits
INSERT INTO meal_kits (kit_name, description, category, serves, prep_time, difficulty, base_price) VALUES
('Vegetarian Delight', '3 plant-based meals featuring seasonal vegetables', 'vegetarian', 2, 30, 'easy', 34.99),
('Protein Power Pack', 'High-protein meals with lean meat and legumes', 'protein', 2, 25, 'medium', 42.99),
('Family Feast', '4 hearty meals perfect for family dinners', 'family', 4, 40, 'easy', 58.99),
('Low-Carb Choice', 'Keto-friendly meals with fresh ingredients', 'low_carb', 2, 20, 'easy', 38.99),
('Quick & Healthy', '30-minute meals for busy professionals', 'quick', 2, 30, 'easy', 32.99),
('Budget Friendly', 'Affordable meals using local ingredients', 'budget', 2, 35, 'easy', 28.99);

-- Insert sample market prices
INSERT INTO market_prices (product_name, market_name, region, price, unit, recorded_date, trend) VALUES
('Tomatoes', 'Central Market', 'North Region', 2.50, 'kg', CURDATE(), 'increasing'),
('Potatoes', 'Central Market', 'North Region', 1.20, 'kg', CURDATE(), 'stable'),
('Carrots', 'Central Market', 'North Region', 1.80, 'kg', CURDATE(), 'decreasing'),
('Lettuce', 'Central Market', 'North Region', 3.00, 'kg', CURDATE(), 'increasing'),
('Apples', 'Central Market', 'North Region', 2.20, 'kg', CURDATE(), 'increasing'),
('Corn', 'Central Market', 'North Region', 1.50, 'kg', CURDATE(), 'stable'),
('Onions', 'Central Market', 'North Region', 1.30, 'kg', CURDATE(), 'stable'),
('Garlic', 'Central Market', 'North Region', 4.50, 'kg', CURDATE(), 'decreasing');

-- Create views for reporting
CREATE VIEW farmer_overview AS
SELECT 
    f.farmer_id,
    u.full_name,
    f.farm_name,
    f.farm_type,
    f.location,
    COUNT(DISTINCT p.product_id) as total_products,
    SUM(p.available_quantity) as total_inventory,
    COUNT(DISTINCT o.order_id) as total_orders,
    COALESCE(SUM(o.grand_total), 0) as total_sales
FROM farmers f
JOIN users u ON f.user_id = u.user_id
LEFT JOIN farm_products p ON f.farmer_id = p.farmer_id
LEFT JOIN orders o ON f.farmer_id = o.farmer_id
GROUP BY f.farmer_id;

CREATE VIEW market_trends AS
SELECT 
    product_name,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price,
    COUNT(*) as records_count,
    MAX(recorded_date) as latest_date
FROM market_prices
WHERE recorded_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY product_name
ORDER BY avg_price DESC;

-- Create stored procedure for weather alerts
DELIMITER //
CREATE PROCEDURE GetWeatherAlertsForFarmer(IN p_farmer_id INT, IN p_days INT)
BEGIN
    SELECT 
        wa.*,
        f.farm_name,
        f.location
    FROM weather_alerts wa
    JOIN farmers f ON wa.farmer_id = f.farmer_id
    WHERE wa.farmer_id = p_farmer_id
        AND wa.alert_date >= CURDATE()
        AND wa.alert_date <= DATE_ADD(CURDATE(), INTERVAL p_days DAY)
        AND wa.is_read = FALSE
    ORDER BY wa.severity DESC, wa.alert_date ASC;
END //
DELIMITER ;

-- Create trigger for order status change notification
DELIMITER //
CREATE TRIGGER order_status_change_notification
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO notifications (user_id, notification_type, title, message, related_id)
        VALUES (
            NEW.buyer_id,
            'order_update',
            CONCAT('Order Status Updated: ', NEW.status),
            CONCAT('Your order #', NEW.order_number, ' status has been updated to ', NEW.status, '.'),
            NEW.order_id
        );
    END IF;
END //
DELIMITER ;

-- Create indexes for performance
CREATE INDEX idx_farm_products_status ON farm_products(status, harvest_date);
CREATE INDEX idx_product_listings_status ON product_listings(status, created_at);
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status, created_at);
CREATE INDEX idx_weather_alerts_farmer_date ON weather_alerts(farmer_id, alert_date, is_read);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_market_prices_trend ON market_prices(product_name, recorded_date, trend);

-- Add comments to tables
ALTER TABLE users COMMENT = 'Main users table for farmers and buyers';
ALTER TABLE farmers COMMENT = 'Extended farmer information';
ALTER TABLE farm_products COMMENT = 'Farm inventory and product details';
ALTER TABLE weather_alerts COMMENT = 'Weather and climate alerts for farmers';
ALTER TABLE market_prices COMMENT = 'Historical market price data';
ALTER TABLE orders COMMENT = 'Customer orders and transactions';
ALTER TABLE meal_kits COMMENT = 'Pre-packaged meal kits for buyers';

-- Grant permissions (example for MySQL)
-- CREATE USER 'farmconnect_app'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON farmconnect.* TO 'farmconnect_app'@'localhost';
-- FLUSH PRIVILEGES;

-- End of SQL Schema
