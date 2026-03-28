CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL, -- MAIN_DISH, BEVERAGE, APPETIZER, DESSERT
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    table_id VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLACED', -- PLACED, CONFIRMED, IN_PROGRESS, READY, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO menu_items (name_vi, name_en, description, price, category, is_available) VALUES
-- MAIN_DISH
('Phở Bò', 'Beef Noodle Soup', 'Traditional Vietnamese noodle soup with beef', 75000, 'MAIN_DISH', true),
('Cơm Gà', 'Chicken Rice', 'Hainanese style chicken rice', 65000, 'MAIN_DISH', true),
('Bún Bò Huế', 'Spicy Beef Noodle', 'Spicy central Vietnamese noodle soup', 70000, 'MAIN_DISH', true),
('Cơm Sườn Nướng', 'Grilled Pork Ribs Rice', 'Grilled pork ribs with steamed rice', 80000, 'MAIN_DISH', true),
-- BEVERAGE
('Cà phê đá', 'Iced Coffee', 'Vietnamese iced coffee with condensed milk', 35000, 'BEVERAGE', true),
('Trà đào', 'Peach Tea', 'Fresh peach iced tea', 30000, 'BEVERAGE', true),
('Nước cam', 'Orange Juice', 'Fresh squeezed orange juice', 40000, 'BEVERAGE', true),
-- APPETIZER
('Chả Giò', 'Spring Rolls', 'Crispy fried spring rolls with dipping sauce', 45000, 'APPETIZER', true),
('Gỏi Cuốn', 'Fresh Spring Rolls', 'Fresh shrimp and pork spring rolls', 40000, 'APPETIZER', true),
-- DESSERT
('Chè Ba Màu', 'Three Color Dessert', 'Vietnamese three-color sweet dessert soup', 25000, 'DESSERT', true),
('Bánh Flan', 'Crème Caramel', 'Vietnamese style crème caramel', 30000, 'DESSERT', true)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS kitchen_tasks (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    table_id VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority_score NUMERIC(4,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS analytics_summary (
    id SERIAL PRIMARY KEY,
    hour_bucket TIMESTAMP WITH TIME ZONE UNIQUE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    revenue DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
