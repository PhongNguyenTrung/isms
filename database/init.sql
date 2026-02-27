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
    category VARCHAR(50) NOT NULL, -- e.g., MAIN_DISH, BEVERAGE
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    table_id VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLACED', -- PLACED, IN_PROGRESS, COMPLETED
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
('Phở Bò', 'Beef Noodle Soup', 'Traditional Vietnamese noodle soup with beef', 75000, 'MAIN_DISH', true),
('Cơm Gà', 'Chicken Rice', 'Hainanese style chicken rice', 65000, 'MAIN_DISH', true),
('Cà phê đá', 'Iced Coffee', 'Vietnamese iced coffee with condensed milk', 35000, 'BEVERAGE', true)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS kitchen_tasks (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    table_id VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
