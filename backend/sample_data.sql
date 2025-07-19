-- Sample admin user (password: admin3690, bcrypt hash required)
INSERT INTO users (username, email, password, role, enabled, deleted, email_verified, account_non_locked)
VALUES ('admin', 'admin@rentreturn.com', '$2a$10$7QJ8Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q', 'ADMIN', true, false, true, true)
ON CONFLICT (email) DO NOTHING;

-- Sample regular user
INSERT INTO users (username, email, password, role, enabled, deleted, email_verified, account_non_locked)
VALUES ('johndoe', 'john@example.com', '$2a$10$7QJ8Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q', 'USER', true, false, true, true)
ON CONFLICT (email) DO NOTHING;

-- Sample products
INSERT INTO products (name, description, price_per_day, category, available, image_url)
VALUES
('Laptop', 'A powerful laptop for rent', 500, 'electronics', true, 'assets/products/1.jpg'),
('Bicycle', 'Mountain bike for city rides', 100, 'sports-fitness', true, 'assets/products/2.jpg'),
('Bookshelf', 'Wooden bookshelf', 50, 'furniture', true, 'assets/products/3.jpg')
ON CONFLICT (name) DO NOTHING;

-- Sample address for johndoe
INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
SELECT id, 'John Doe', '1234567890', '123 Main St', 'Apt 4B', 'Metropolis', 'State', '12345', 'Country', true FROM users WHERE email = 'john@example.com';

-- Sample wishlist for johndoe
INSERT INTO wishlist_items (user_id, product_id)
SELECT u.id, p.id FROM users u, products p WHERE u.email = 'john@example.com' AND p.name = 'Laptop'; 