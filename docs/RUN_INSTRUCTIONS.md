# IRMS - Môi trường Chạy Dịch vụ (Service Run Instructions)

Tài liệu này hướng dẫn cách cấu hình và khởi chạy các dịch vụ cốt lõi của hệ thống **Intelligent Restaurant Management System (IRMS)** ở môi trường phát triển cục bộ (Local Development).

---

## 🛠️ Yêu cầu Hệ thống / Prerequisites

Trước khi khởi chạy các dịch vụ, hãy đảm bảo hệ thống của bạn đã cài đặt các công cụ sau:
- **Node.js** (Phiên bản >= 20.x, khuyến nghị môi trường LTS)
- **npm** (Đi kèm với Node.js)
- **PostgreSQL** (Dùng cho Local Database)
- **Apache Kafka** (Nếu cần kiểm thử các event messages cục bộ)

---

## ⚙️ Cài đặt Chung / General Setup

Mỗi dịch vụ được đặt trong thư mục `services/`. Bạn cần cài đặt thư viện phụ thuộc (`node_modules`) cho từng dịch vụ trước khi khởi chạy.

Cách cài đặt phụ thuộc cho tất cả dịch vụ:

```bash
# Auth Service
cd services/auth-service
npm install

# Kitchen Service
cd services/kitchen-service
npm install

# Ordering Service
cd services/ordering-service
npm install

# IoT Gateway Service (Phase 2)
cd services/iot-gateway
npm install

# Inventory Service (Phase 2)
cd services/inventory-service
npm install

# Notification Service (Phase 3)
cd services/notification-service
npm install

# Analytics Service (Phase 3)
cd services/analytics-service
npm install
```

---

## 🏃‍♂️ Khởi chạy Dịch vụ / Running Services

Mỗi dịch vụ cần được cung cấp các biến môi trường nhất định thông qua file `.env`. Nếu thư mục của dịch vụ chưa có file `.env`, hãy tạo một file mới dựa trên các thông số bảo mật cần thiết.

### 1. Auth Service (Service Xác thực)
Dịch vụ cung cấp JWT token và xử lý phân quyền người dùng.

- **Vị trí**: `services/auth-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3001
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=your_password
  DB_NAME=isms_auth
  JWT_SECRET=your_jwt_secret
  ```
- **Lệnh khởi chạy**:
  - Chạy Development (sử dụng `nodemon` để tự khởi động lại khi có thay đổi):
    ```bash
    npm run dev
    ```
  - Chạy Production:
    ```bash
    npm start
    ```

### 2. Kitchen Service (Service Quản lý Bếp)
Dịch vụ điều phối nhà bếp thời gian thực sử dụng WebSockets và Kafka.

- **Vị trí**: `services/kitchen-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3002
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=your_password
  DB_NAME=isms_kitchen
  KAFKA_BROKER=localhost:9092
  ```
- **Lệnh khởi chạy**:
  - Do chưa có `dev` script, bạn có thể chạy file index:
    ```bash
    node src/index.js
    ```

### 3. Ordering Service (Service Đặt món)
Dịch vụ xử lý vòng đời của đơn hàng.

- **Vị trí**: `services/ordering-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3003
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=your_password
  DB_NAME=isms_ordering
  KAFKA_BROKER=localhost:9092
  JWT_SECRET=your_jwt_secret
  ```
- **Lệnh khởi chạy**:
  - Do chưa có `dev` script, bạn có thể chạy file index:
    ```bash
    node src/index.js
    ```

### 4. IoT Gateway Service (Service Tích hợp IoT)
Dịch vụ xử lý tín hiệu MQTT từ các thiết bị cảm biến phần cứng (nhiệt độ, load-cell). Thuộc Giai đoạn 2 (Phase 2). Cần khởi chạy backend MQTT Broker (`Mosquitto`) trước.

- **Vị trí**: `services/iot-gateway/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3004
  MQTT_BROKER=mqtt://localhost:1883
  KAFKA_BROKERS=localhost:9092
  ```
- **Lệnh khởi chạy**:
  ```bash
  node src/index.js
  ```

### 5. Inventory Service (Service Giám sát Tồn kho)
Dịch vụ xử lý dữ liệu viễn trắc theo thời gian thực để lưu vào InfluxDB và phát tín hiệu cảnh báo tồn kho. Cần Docker khởi chạy `InfluxDB` trước.

- **Vị trí**: `services/inventory-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3005
  INFLUXDB_URL=http://localhost:8086
  INFLUXDB_TOKEN=super_secret_influx_token_for_irms_development
  INFLUXDB_ORG=irms_org
  INFLUXDB_BUCKET=irms_bucket
  KAFKA_BROKERS=localhost:9092
  ```
- **Lệnh khởi chạy**:
  ```bash
  node src/index.js
  ```

### 6. Notification Service (Service Thông báo)
Dịch vụ xử lý các cảnh báo từ hệ thống và gửi thông báo đa kênh (Email, SMS, Push Notification). Thuộc Giai đoạn 3 (Phase 3).

- **Vị trí**: `services/notification-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3006
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=irms_user
  DB_PASSWORD=irms_password
  DB_NAME=irms_db
  KAFKA_BROKERS=localhost:9092
  ```
- **Lệnh khởi chạy**:
  ```bash
  node src/index.js
  ```

### 7. Analytics Service (Service Phân tích & Báo cáo)
Dịch vụ tính toán các chỉ số dashboard thời gian thực qua WebSockets và tạo báo cáo dự đoán. Cần Docker khởi chạy `Redis` trước.

- **Vị trí**: `services/analytics-service/`
- **Biến môi trường mẫu (`.env`)**:
  ```env
  PORT=3007
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=irms_user
  DB_PASSWORD=irms_password
  DB_NAME=irms_db
  REDIS_HOST=localhost
  REDIS_PORT=6379
  KAFKA_BROKERS=localhost:9092
  ```
- **Lệnh khởi chạy**:
  ```bash
  node src/index.js
  ```

---

## 🐳 Khởi chạy Bằng Docker Compose (Khuyến nghị) / Running via Docker Compose

Thay vì thiết lập thủ công từng service, bạn nên chạy toàn bộ bằng Docker Compose để tự động cấp phát API Gateway, Kafka, InfluxDB, Mosquitto và database:

```bash
# Ở thư mục gốc d:\isms
docker-compose up -d --build
```

## 🧩 Khởi chạy Đồng thời / Running Concurrently

Để khởi chạy tất cả dịch vụ cùng một lúc trong quá trình phát triển, bạn nên mở các **terminal/tab riêng biệt** cho mỗi dịch vụ và chạy lệnh khởi động tương ứng.
