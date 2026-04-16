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
    image_url VARCHAR(500),
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

-- Haidilao menu seed data
INSERT INTO menu_items (name_vi, name_en, description, price, category, is_available, image_url) VALUES
-- LẨU (MAIN_DISH)
('Lẩu Cay Tứ Xuyên', 'Sichuan Spicy Broth', 'Nước lẩu cay đặc trưng Tứ Xuyên với ớt khô và hạt tiêu', 199000, 'MAIN_DISH', true, 'https://loremflickr.com/400/300/hotpot,spicy?lock=101'),
('Lẩu Cà Chua', 'Tomato Broth', 'Nước lẩu cà chua tươi chua ngọt, thanh mát', 159000, 'MAIN_DISH', true, 'https://loremflickr.com/400/300/tomato,soup?lock=102'),
('Lẩu Nấm', 'Mushroom Broth', 'Nước lẩu nấm thơm ngon, thanh đạm bổ dưỡng', 169000, 'MAIN_DISH', true, 'https://loremflickr.com/400/300/mushroom,soup?lock=103'),
('Lẩu Cay Không Cay', 'Dual Flavor Broth', 'Nồi lẩu chia đôi: một nửa cay Tứ Xuyên, một nửa nước xương hầm', 219000, 'MAIN_DISH', true, 'https://loremflickr.com/400/300/hotpot,broth?lock=104'),
('Lẩu Xương Hầm', 'Bone Broth', 'Nước xương heo hầm 24 giờ, béo ngậy đậm đà', 179000, 'MAIN_DISH', true, 'https://loremflickr.com/400/300/bone,broth?lock=105'),
-- NGUYÊN LIỆU NHÚNG (APPETIZER)
('Thịt Bò Hoa Cải', 'Premium Wagyu Beef', 'Thịt bò Mỹ thái mỏng, hoa văn mỡ đẹp, tan chảy khi nhúng', 189000, 'APPETIZER', true, 'https://loremflickr.com/400/300/wagyu,beef?lock=201'),
('Thịt Bò Ba Chỉ', 'Beef Belly Slices', 'Thịt bò ba chỉ thái lát mỏng, béo ngậy', 149000, 'APPETIZER', true, 'https://loremflickr.com/400/300/beef,sliced?lock=202'),
('Thịt Heo Ba Chỉ', 'Pork Belly', 'Thịt heo ba chỉ cuộn, mềm thơm khi nhúng lẩu', 109000, 'APPETIZER', true, 'https://loremflickr.com/400/300/pork,belly?lock=203'),
('Tôm Hùm Đất', 'Crayfish', 'Tôm hùm đất tươi sống, ngọt thịt chắc', 169000, 'APPETIZER', true, 'https://loremflickr.com/400/300/crayfish,seafood?lock=204'),
('Mực Ống Tươi', 'Fresh Squid', 'Mực ống tươi làm sạch, thịt giòn dai', 129000, 'APPETIZER', true, 'https://loremflickr.com/400/300/squid,seafood?lock=205'),
('Bạch Tuộc', 'Octopus', 'Bạch tuộc tươi, giòn sần sật đậm vị biển', 139000, 'APPETIZER', true, 'https://loremflickr.com/400/300/octopus,seafood?lock=206'),
('Đậu Phụ Haidilao', 'Haidilao Tofu', 'Đậu phụ tự làm của Haidilao, mềm mịn thấm vị', 49000, 'APPETIZER', true, 'https://loremflickr.com/400/300/tofu,silken?lock=207'),
('Nấm Hương Nhật', 'Shiitake Mushroom', 'Nấm hương Nhật Bản tươi, thơm đậm đà', 59000, 'APPETIZER', true, 'https://loremflickr.com/400/300/shiitake,mushroom?lock=208'),
('Rau Muống', 'Morning Glory', 'Rau muống tươi giòn, thanh mát', 39000, 'APPETIZER', true, 'https://loremflickr.com/400/300/vegetable,greens?lock=209'),
('Mì Tươi Haidilao', 'Fresh Noodles', 'Mì tươi kéo tay truyền thống, dai mềm', 45000, 'APPETIZER', true, 'https://loremflickr.com/400/300/noodles,fresh?lock=210'),
-- ĐỒ UỐNG (BEVERAGE)
('Trà Đặc Biệt Haidilao', 'Haidilao Signature Tea', 'Trà thảo mộc đặc chế riêng của Haidilao, thanh nhiệt giải độc', 45000, 'BEVERAGE', true, 'https://loremflickr.com/400/300/tea,herbal?lock=301'),
('Nước Trái Cây Tươi', 'Fresh Fruit Juice', 'Ép từ trái cây tươi theo mùa', 59000, 'BEVERAGE', true, 'https://loremflickr.com/400/300/fruit,juice?lock=302'),
('Sữa Đậu Nành', 'Soy Milk', 'Sữa đậu nành nguyên chất, nóng hoặc lạnh', 35000, 'BEVERAGE', true, 'https://loremflickr.com/400/300/soy,milk?lock=303'),
('Bia Tiger', 'Tiger Beer', 'Bia Tiger lon 330ml', 35000, 'BEVERAGE', true, 'https://loremflickr.com/400/300/beer,cold?lock=304'),
('Nước Khoáng', 'Mineral Water', 'Nước khoáng Voss 375ml', 25000, 'BEVERAGE', true, 'https://loremflickr.com/400/300/water,bottle?lock=305'),
-- TRÁNG MIỆNG (DESSERT)
('Kem Tự Phục Vụ', 'Self-service Ice Cream', 'Kem mềm Haidilao phục vụ tự do, miễn phí không giới hạn', 0, 'DESSERT', true, 'https://loremflickr.com/400/300/ice,cream?lock=401'),
('Bánh Bao Chiên', 'Fried Sesame Buns', 'Bánh bao chiên vàng giòn rắc mè, nhân nhuyễn ngọt', 49000, 'DESSERT', true, 'https://loremflickr.com/400/300/fried,bun?lock=402'),
('Đậu Phụ Hoa', 'Tofu Pudding', 'Đậu phụ hoa mịn mát rưới đường phèn gừng', 39000, 'DESSERT', true, 'https://loremflickr.com/400/300/tofu,pudding?lock=403'),
('Chè Trôi Nước', 'Sweet Dumpling Soup', 'Bánh trôi nhân vừng đen trong nước đường gừng ấm', 45000, 'DESSERT', true, 'https://loremflickr.com/400/300/dumpling,sweet?lock=404')
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
