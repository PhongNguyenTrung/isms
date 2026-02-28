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

---

## 🧩 Khởi chạy Đồng thời / Running Concurrently

Để khởi chạy tất cả dịch vụ cùng một lúc trong quá trình phát triển, bạn nên mở các **terminal/tab riêng biệt** cho mỗi dịch vụ và chạy lệnh khởi động tương ứng.
