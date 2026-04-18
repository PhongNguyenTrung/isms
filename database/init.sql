CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed users (password: password123)
INSERT INTO users (username, password, role) VALUES
  ('manager01', '$2b$10$8XQdl57er/P7YUo0xG.Wc.gakwviFRAX6Tkr9k7vmtcjKwWtfR5Ra', 'MANAGER'),
  ('chef01',    '$2b$10$kPiBdtwYyUZav6Nw9CAXP.0P2DImqDIeCgx9Axb6qJizQI0diXuou', 'CHEF'),
  ('waiter01',  '$2b$10$eQJ73SCRq/rwoWmcLSLRRuvwZZM/lXI6JWYgL9bEbH52QtVuifdqi', 'WAITER'),
  ('cashier01', '$2b$10$YkzgE/hK0OxfdXbfQtn6.O6nghx4tx6Iciwj5j/kEsVB5SATKq.Zu', 'CASHIER')
ON CONFLICT (username) DO NOTHING;

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
('Lẩu Cay Tứ Xuyên', 'Sichuan Spicy Broth', 'Nước lẩu cay đặc trưng Tứ Xuyên với ớt khô và hạt tiêu', 199000, 'MAIN_DISH', true, 'https://comichefhome.vn/wp-content/uploads/2023/05/Lau-Tu-Xuyen-Trung-Quoc-la-mon-gi.jpg'),
('Lẩu Cà Chua', 'Tomato Broth', 'Nước lẩu cà chua tươi chua ngọt, thanh mát', 159000, 'MAIN_DISH', true, 'https://m.media-amazon.com/images/I/612-uc2ycIL.jpg'),
('Lẩu Nấm', 'Mushroom Broth', 'Nước lẩu nấm thơm ngon, thanh đạm bổ dưỡng', 169000, 'MAIN_DISH', true, 'https://thesmartlocal.com/wp-content/uploads/2019/07/Hai-Di-Lao-style-steamboat-soup-base-4.jpg'),
('Lẩu Cay Không Cay', 'Dual Flavor Broth', 'Nồi lẩu chia đôi: một nửa cay Tứ Xuyên, một nửa nước xương hầm', 219000, 'MAIN_DISH', true, 'https://bepnuongthanhoa.vn/wp-content/uploads/2023/10/noi-lau-vuong-inox-2-ngan-8.jpg'),
('Lẩu Xương Hầm', 'Bone Broth', 'Nước xương heo hầm 24 giờ, béo ngậy đậm đà', 179000, 'MAIN_DISH', true, 'https://cdn.shopify.com/s/files/1/0617/2497/files/nuoc-cot-lau-xuong-ham-cay-haidilao.jpg?v=1761982172'),
-- NGUYÊN LIỆU NHÚNG (APPETIZER)
('Thịt Bò Hoa Cải', 'Premium Wagyu Beef', 'Thịt bò Mỹ thái mỏng, hoa văn mỡ đẹp, tan chảy khi nhúng', 189000, 'APPETIZER', true, 'https://wagyubeefaustralia.com.au/wp-content/uploads/2020/09/YAKINIKU-SET-PREMIUM-1-scaled.jpg'),
('Thịt Bò Ba Chỉ', 'Beef Belly Slices', 'Thịt bò ba chỉ thái lát mỏng, béo ngậy', 149000, 'APPETIZER', true, 'https://www.kkmeatco.com/cdn/shop/products/u_1812668129_466450185_fm_26_gp_0_1_456x.jpg?v=1597338695'),
('Thịt Heo Ba Chỉ', 'Pork Belly', 'Thịt heo ba chỉ cuộn, mềm thơm khi nhúng lẩu', 109000, 'APPETIZER', true, 'https://mydailymoo.wordpress.com/wp-content/uploads/2014/05/hai-di-lao-3.jpg'),
('Tôm Hùm Đất', 'Crayfish', 'Tôm hùm đất tươi sống, ngọt thịt chắc', 169000, 'APPETIZER', true, 'https://s.yimg.com/ny/api/res/1.2/ibqUq_Rh8hdFlux5B_nDqg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTY3NjtjZj13ZWJw/https://media.zenfs.com/en/sethlui.com/cf5378c546b4ba4b763fd5b4ca1b2fe9'),
('Mực Ống Tươi', 'Fresh Squid', 'Mực ống tươi làm sạch, thịt giòn dai', 129000, 'APPETIZER', true, 'https://i.vietgiaitri.com/2022/1/3/huong-dan-cach-lam-mon-muc-hap-gung-don-gian-tai-nha-370-6247965.png'),
('Bạch Tuộc', 'Octopus', 'Bạch tuộc tươi, giòn sần sật đậm vị biển', 139000, 'APPETIZER', true, 'https://media-cdn.tripadvisor.com/media/photo-m/1280/19/bd/7e/83/squid-set.jpg'),
('Đậu Phụ Haidilao', 'Haidilao Tofu', 'Đậu phụ tự làm của Haidilao, mềm mịn thấm vị', 49000, 'APPETIZER', true, 'https://abcfood.vn/wp-content/uploads/2024/04/giapchau_54642_a_plate_of_soft_smooth_white_tofu_next_to_a_bowl_43cb53c2-f974-462c-81fb-15b801bbe6d7.png'),
('Nấm Hương Nhật', 'Shiitake Mushroom', 'Nấm hương Nhật Bản tươi, thơm đậm đà', 59000, 'APPETIZER', true, 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_14_638408734191592231_nam-huong-01.jpg'),
('Rau Muống', 'Morning Glory', 'Rau muống tươi giòn, thanh mát', 39000, 'APPETIZER', true, 'https://cdn.eva.vn/upload/4-2021/images/2021-11-26/xao-rau-muong-bao-nam-van-tham-den-dau-bep-mat-20-giay-lam-them-dieu-nay-rau-xanh-muot-bfedc514763bb9aa1e4c44770c43b7e4-1637900310-152-width640height398.jpg'),
('Mì Tươi Haidilao', 'Fresh Noodles', 'Mì tươi kéo tay truyền thống, dai mềm', 45000, 'APPETIZER', true, 'https://shopazmart.com/wp-content/uploads/2022/04/mi1A.jpg'),
-- ĐỒ UỐNG (BEVERAGE)
('Trà Đặc Biệt Haidilao', 'Haidilao Signature Tea', 'Trà thảo mộc đặc chế riêng của Haidilao, thanh nhiệt giải độc', 45000, 'BEVERAGE', true, 'https://i.ytimg.com/vi/omQtZdq0puw/maxresdefault.jpg'),
('Nước Trái Cây Tươi', 'Fresh Fruit Juice', 'Ép từ trái cây tươi theo mùa', 59000, 'BEVERAGE', true, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8I_jJHSxOGyqLRpdWJsG4FumNjvY8X5MCsg&s'),
('Sữa Đậu Nành', 'Soy Milk', 'Sữa đậu nành nguyên chất, nóng hoặc lạnh', 35000, 'BEVERAGE', true, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQyaKK6eVFOqGRkcoNHjayoELSkZ7zW7H2yQ&s'),
('Bia Tiger', 'Tiger Beer', 'Bia Tiger lon 330ml', 35000, 'BEVERAGE', true, 'https://product.hstatic.net/1000281508/product/bia-tiger-crystal-330ml-202003281744005842_e860da0afe044ff0a63c705bed4bf424_master.jpg'),
('Nước Khoáng', 'Mineral Water', 'Nước khoáng Voss 375ml', 25000, 'BEVERAGE', true, 'https://storage.sudospaces.com/sudo-mutosi/uploads/media/cac-loai-nuoc-bu-khoang-dong-chai_1725021094jpg'),
-- TRÁNG MIỆNG (DESSERT)
('Kem Tự Phục Vụ', 'Self-service Ice Cream', 'Kem mềm Haidilao phục vụ tự do, miễn phí không giới hạn', 0, 'DESSERT', true, 'https://vinatechgroup.vn/wp-content/uploads/2020/06/tim-doi-tac-kinh-doanh-kem-tuoi.jpg'),
('Bánh Bao Chiên', 'Fried Sesame Buns', 'Bánh bao chiên vàng giòn rắc mè, nhân nhuyễn ngọt', 49000, 'DESSERT', true, 'https://www.huongnghiepaau.com/wp-content/uploads/2019/03/banh-bao-chien.jpg'),
('Đậu Phụ Hoa', 'Tofu Pudding', 'Đậu phụ hoa mịn mát rưới đường phèn gừng', 39000, 'DESSERT', true, 'https://cdnphoto.dantri.com.vn/EIk9J-aAK90YLfzOBpoB3Cxp_Zg=/thumb_w/1020/2022/07/10/mon-dau-phu-phai-cat-3docx-1657448817208.jpeg'),
('Chè Trôi Nước', 'Sweet Dumpling Soup', 'Bánh trôi nhân vừng đen trong nước đường gừng ấm', 45000, 'DESSERT', true, 'https://cdn.tgdd.vn/Files/2021/09/08/1381061/cach-lam-che-troi-nuoc-ngu-sac-mem-deo-dai-ngon-khong-bi-cung-202109081319439786.jpg')
ON CONFLICT DO NOTHING;

-- QR session tokens: mỗi bàn có 1 token random, không lộ tableId trên URL
CREATE TABLE IF NOT EXISTS table_sessions (
    id SERIAL PRIMARY KEY,
    table_id VARCHAR(50) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    invalidated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_table_sessions_token ON table_sessions(token);

CREATE TABLE IF NOT EXISTS kitchen_tasks (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    table_id VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority_score NUMERIC(4,1) DEFAULT 0,
    station VARCHAR(50) DEFAULT 'Bếp chính',
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
