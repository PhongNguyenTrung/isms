---
title: Module View - Service Decomposition
title_vi: Góc nhìn Module - Phân rã Dịch vụ
description: Detailed decomposition of IRMS into 7 microservices with responsibilities, dependencies, and internal structure
related_requirements: FR1-FR14, NFR6, NFR7, ADR-001, ADR-003
related_diagrams: ../diagrams/architecture/microservices-overview.md, ../diagrams/components/*.md
last_updated: 2026-02-21
---

# Module View - Service Decomposition
# Góc nhìn Module - Phân rã Dịch vụ

**Project**: IRMS - Intelligent Restaurant Management System
**Last Updated**: 2026-02-21
**Status**: Design Complete

---

## Table of Contents / Mục lục

1. [Introduction](#introduction)
2. [Decomposition Principles](#decomposition-principles)
3. [Service Catalog](#service-catalog)
4. [Service Dependencies](#service-dependencies)
5. [Layered Architecture within Services](#layered-architecture-within-services)
6. [Database per Service Pattern](#database-per-service-pattern)
7. [Module Interfaces](#module-interfaces)
8. [Service Responsibility Matrix](#service-responsibility-matrix)
9. [Cross-Cutting Concerns](#cross-cutting-concerns)
10. [Module Evolution Strategy](#module-evolution-strategy)

---

## Introduction
## Giới thiệu

### Purpose / Mục đích

The **Module View** describes the static decomposition of the IRMS system into modular units (microservices) to achieve:

Góc nhìn Module mô tả cách phân rã tĩnh của hệ thống IRMS thành các đơn vị module (microservices) để đạt được:

- **Modularity**: Independent development and deployment
- **Maintainability**: Clear boundaries reduce complexity
- **Scalability**: Scale services independently based on load
- **Fault Isolation**: Failures contained within service boundaries
- **Team Autonomy**: Small teams own entire services

### Architectural Style / Phong cách Kiến trúc

**Microservices Architecture** with the following principles:

- **Domain-Driven Design (DDD)**: Services aligned with business domains
- **Single Responsibility**: Each service has one cohesive purpose
- **Database per Service**: Data autonomy and independence
- **API-First**: Well-defined service interfaces
- **Loose Coupling**: Minimal dependencies between services

See also: [Architecture Overview](01-overview.md) for architectural decisions

---

## Decomposition Principles
## Nguyên tắc Phân rã

### 1. Business Capability Decomposition

IRMS is decomposed by **business capabilities**, not technical layers:

| Business Capability | Service | Rationale |
|---------------------|---------|-----------|
| **Order Management** | Ordering Service | Core capability: accepting customer orders |
| **Kitchen Operations** | Kitchen Service | Core capability: coordinating food preparation |
| **Inventory Tracking** | Inventory Service | Supporting capability: monitoring stock levels |
| **User Authentication** | Auth Service | Supporting capability: access control |
| **Notifications** | Notification Service | Supporting capability: alerting users |
| **Analytics & Reporting** | Analytics Service | Supporting capability: business intelligence |
| **IoT Device Management** | IoT Gateway Service | Technical capability: device connectivity |

### 2. Bounded Contexts (Domain-Driven Design)

Each service represents a **bounded context** with clear domain boundaries:

```
┌─────────────────────────────────────────────────────────────────┐
│                        IRMS System                               │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Ordering        │  │   Kitchen        │  │  Inventory    │ │
│  │  Context         │  │   Context        │  │  Context      │ │
│  │                  │  │                  │  │               │ │
│  │ - Order          │  │ - Queue          │  │ - Ingredient  │ │
│  │ - MenuItem       │  │ - Priority       │  │ - Stock Level │ │
│  │ - Table          │  │ - WorkStation    │  │ - Sensor      │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Analytics       │  │   Auth           │  │  Notification │ │
│  │  Context         │  │   Context        │  │  Context      │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Size and Complexity Guidelines

Each microservice follows the "**Two Pizza Team Rule**":

- **Team Size**: 5-7 developers can own the entire service
- **Codebase Size**: < 10,000 lines of code per service
- **Development Time**: New features in 1-2 weeks
- **Cognitive Load**: New team member productive in 1 week

---

## Service Catalog
## Danh mục Dịch vụ

### Overview / Tổng quan

IRMS consists of **7 core microservices**:

| # | Service | Type | Priority | Scaling |
|---|---------|------|----------|---------|
| 1 | Customer Ordering Service | Core | P0 | High (5x) |
| 2 | Kitchen Management Service | Core | P0 | High (3x) |
| 3 | Inventory Monitoring Service | Support | P1 | Medium (2x) |
| 4 | Notification & Alert Service | Support | P1 | Medium (2x) |
| 5 | Analytics & Forecasting Service | Support | P2 | Low (1-2x) |
| 6 | User & Access Management Service | Support | P1 | Medium (2x) |
| 7 | IoT Gateway Service | Technical | P0 | Medium (2x) |

**Legend**:
- **Type**: Core (business critical), Support (enabler), Technical (infrastructure)
- **Priority**: P0 (critical), P1 (high), P2 (medium)
- **Scaling**: Typical replica count during peak hours

---

### Service 1: Customer Ordering Service 📝

**Visual Diagram**: [Ordering Service Component](../diagrams/components/ordering-service.md)

#### Responsibility / Trách nhiệm

Accept, validate, and process customer orders from tablets/QR menus.

Nhận, xác thực và xử lý đơn hàng từ khách hàng qua tablet/QR menu.

#### Key Functions / Chức năng Chính

1. **Menu Management**:
   - Display digital menu with photos, prices, descriptions
   - Support bilingual menus (Vietnamese + English)
   - Mark items as available/unavailable based on inventory

2. **Order Placement**:
   - Accept orders from tablet apps
   - Validate order items (existence, availability, pricing)
   - Categorize dishes (main, beverage, dessert, appetizer)
   - Calculate order total (subtotal, tax, discounts)

3. **Order Validation**:
   - Check table existence and status
   - Validate item availability
   - Enforce business rules (minimum order, special instructions)

4. **Event Publishing**:
   - Publish `OrderPlaced` event to Kafka
   - Include all order details in event payload
   - Ensure idempotency (duplicate order prevention)

5. **Order Tracking**:
   - Query order status for customers
   - Provide real-time updates via WebSocket

#### Domain Model / Mô hình Domain

**Core Entities**:
- `Order`: Aggregate root (orderId, tableId, items[], status, total)
- `MenuItem`: Value object (itemId, name, price, category, available)
- `OrderItem`: Entity (itemId, quantity, unitPrice, specialInstructions)
- `Table`: Entity (tableId, capacity, status, location)

**Business Rules**:
- Order total must match sum of item prices + tax
- Order cannot be empty (min 1 item)
- Table must be "occupied" status to place order
- Price changes after order placed don't affect existing order

#### Technology Stack / Stack Công nghệ

- **Language**: Java 17 + Spring Boot 3.x
- **Framework**: Spring WebFlux (reactive)
- **Database**: PostgreSQL 15 (ACID transactions)
- **Cache**: Redis 7 (menu caching, < 5s TTL)
- **API**: REST (synchronous) + Kafka producer (async events)
- **Testing**: JUnit 5, Mockito, Testcontainers

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 100+ orders/minute during lunch/dinner
- **Replica Count**: 5-7 instances during peak, 2 instances off-peak
- **Bottlenecks**: Database writes (mitigated by connection pooling)
- **Cache Hit Rate**: 95% for menu queries

#### Related Requirements / Yêu cầu Liên quan

- **FR1**: Customer ordering via tablet/QR menu
- **FR2**: Digital menu display
- **FR3**: Order validation
- **NFR2**: Order latency < 1 second
- **NFR6**: Horizontal scalability

---

### Service 2: Kitchen Management Service 🍳

**Visual Diagram**: [Kitchen Service Component](../diagrams/components/kitchen-service.md)

#### Responsibility / Trách nhiệm

Coordinate kitchen operations, manage order queue, and prioritize food preparation.

Điều phối hoạt động bếp, quản lý hàng đợi đơn hàng và ưu tiên chế biến món ăn.

#### Key Functions / Chức năng Chính

1. **Order Queue Management**:
   - Receive `OrderPlaced` events from Kafka
   - Maintain priority queue for food preparation
   - Calculate priority score based on:
     - Order complexity (# items, difficulty)
     - Table wait time
     - Current kitchen load
     - VIP status (future)

2. **Kitchen Display System (KDS)**:
   - Send orders to kitchen displays via WebSocket
   - Group orders by workstation (grill, fry, wok, etc.)
   - Highlight urgent/overdue orders

3. **Order Status Tracking**:
   - Chef marks order as "InProgress" when starting
   - Chef marks order as "Completed" when ready
   - Publish status change events to Kafka

4. **Kitchen Load Monitoring**:
   - Track active orders per workstation
   - Detect overload conditions (queue length > threshold)
   - Publish `KitchenOverload` alert event
   - Suggest order throttling to Ordering Service

5. **Performance Metrics**:
   - Track average preparation time per dish
   - Identify bottleneck workstations
   - Provide feedback for menu optimization

#### Domain Model / Mô hình Domain

**Core Entities**:
- `KitchenOrder`: Aggregate root (orderId, items[], priority, status, assignedStation)
- `OrderQueue`: Entity (queue of orders, FIFO with priority)
- `WorkStation`: Entity (stationId, type, capacity, activeOrders)
- `PreparationTask`: Entity (taskId, orderId, itemId, status, startTime)

**Business Rules**:
- Orders prioritized by: urgency (wait time) > complexity > order time
- Workstation can handle max 5 concurrent orders
- Overload alert triggered when queue length > 10 orders
- Order cannot skip "InProgress" state (must go Pending → InProgress → Completed)

#### Technology Stack / Stack Công nghệ

- **Language**: Java 17 + Spring Boot 3.x
- **Framework**: Spring WebFlux (for WebSocket to KDS)
- **Database**: PostgreSQL 15 (order queue state)
- **Cache**: Redis 7 (real-time queue, kitchen load metrics)
- **API**: Kafka consumer (async) + WebSocket (KDS) + REST (queries)
- **Testing**: JUnit 5, Spring Test, WireMock

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 150+ orders/hour during peak
- **Replica Count**: 3-4 instances during peak, 1-2 off-peak
- **State**: Redis for shared queue state across replicas
- **Bottlenecks**: WebSocket connections to KDS (mitigated by connection pooling)

#### Related Requirements / Yêu cầu Liên quan

- **FR4**: Real-time kitchen display
- **FR5**: Kitchen Display System (KDS)
- **FR6**: Order status updates
- **FR7**: Queue management and prioritization
- **FR8**: Kitchen overload alerts
- **NFR1**: High throughput (100+ orders/min)
- **NFR2**: Real-time responsiveness

---

### Service 3: Inventory Monitoring Service 📦

**Visual Diagram**: [Inventory Service Component](../diagrams/components/inventory-service.md)

#### Responsibility / Trách nhiệm

Track ingredient stock levels via IoT sensors and generate low inventory alerts.

Theo dõi mức tồn kho nguyên liệu qua cảm biến IoT và tạo cảnh báo tồn kho thấp.

#### Key Functions / Chức năng Chính

1. **IoT Data Ingestion**:
   - Receive sensor readings from IoT Gateway
   - Parse load-cell data (weight measurements)
   - Parse temperature sensor data (fridge/freezer monitoring)
   - Store time-series data in InfluxDB

2. **Stock Level Calculation**:
   - Calculate current stock from sensor readings
   - Convert weight to units (kg → servings)
   - Track consumption rate per ingredient

3. **Threshold Monitoring**:
   - Compare current stock vs. safety threshold
   - Detect low inventory conditions
   - Publish `InventoryLow` event to Kafka

4. **Temperature Monitoring**:
   - Monitor fridge/freezer temperatures
   - Detect out-of-range conditions
   - Publish `TemperatureAlert` event

5. **Inventory Dashboard**:
   - Provide REST API for current stock levels
   - Historical trends and consumption patterns
   - Predictive alerts (stock will run out in X hours)

#### Domain Model / Mô hình Domain

**Core Entities**:
- `Ingredient`: Aggregate root (ingredientId, name, unit, currentStock, safetyThreshold)
- `SensorReading`: Value object (sensorId, value, timestamp, unit)
- `StockLevel`: Entity (ingredientId, level, unit, lastUpdated)
- `Sensor`: Entity (sensorId, type, location, status)

**Business Rules**:
- Low inventory alert when: `currentStock < safetyThreshold`
- Safety threshold typically: 20% of max capacity
- Temperature alert when: `temp < minTemp` OR `temp > maxTemp`
- Sensor failure detected when: no reading for 5 minutes

#### Technology Stack / Stack Công nghệ

- **Language**: Python 3.11 (excellent for data processing)
- **Framework**: FastAPI (REST API), asyncio (async processing)
- **Database**: InfluxDB 2.x (time-series for sensor data)
- **Cache**: Redis 7 (current stock levels for fast queries)
- **API**: Kafka consumer (sensor events) + REST (queries)
- **Testing**: pytest, pytest-asyncio, pytest-mock

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 1000+ sensor readings/minute
- **Replica Count**: 2 instances (high availability)
- **Write Throughput**: InfluxDB handles 100K+ writes/sec
- **Bottlenecks**: None expected (IoT data is write-heavy, InfluxDB optimized for this)

#### Related Requirements / Yêu cầu Liên quan

- **FR9**: IoT inventory monitoring
- **FR10**: Low inventory alerts
- **FR11**: Temperature monitoring
- **NFR4**: Fault tolerance (IoT device failures)
- **NFR8**: Observability

---

### Service 4: Notification & Alert Service 🔔

**Visual Diagram**: [Notification Service Component](../diagrams/components/notification-service.md)

#### Responsibility / Trách nhiệm

Send multi-channel notifications (push, SMS, email) to staff and managers.

Gửi thông báo đa kênh (push, SMS, email) cho nhân viên và quản lý.

#### Key Functions / Chức năng Chính

1. **Event Subscription**:
   - Subscribe to all alert events from Kafka:
     - `OrderCompleted` → notify customer/waiter
     - `InventoryLow` → notify manager
     - `TemperatureAlert` → critical alert to manager
     - `KitchenOverload` → notify manager

2. **Multi-Channel Delivery**:
   - **Push Notifications**: Send to tablets, mobile apps
   - **SMS**: Critical alerts via Twilio
   - **Email**: Reports and summaries via SendGrid
   - **In-App**: Real-time notifications via WebSocket

3. **Priority & Routing**:
   - **Critical**: SMS + Push (temperature alert, system failure)
   - **High**: Push + Email (inventory low, kitchen overload)
   - **Normal**: Push only (order completed)

4. **Retry Logic**:
   - Retry failed deliveries with exponential backoff
   - Dead letter queue for permanently failed notifications
   - Max 3 retries per notification

5. **Notification History**:
   - Log all sent notifications
   - Track delivery status (sent, delivered, failed)
   - Provide audit trail for compliance

#### Domain Model / Mô hình Domain

**Core Entities**:
- `Notification`: Aggregate root (notificationId, type, priority, recipient, message, status)
- `NotificationTemplate`: Value object (templateId, channel, subject, body)
- `Recipient`: Value object (userId, channels[], preferences)
- `DeliveryAttempt`: Entity (attemptId, notificationId, channel, status, timestamp)

**Business Rules**:
- Critical notifications sent via at least 2 channels
- Notifications deduplicated within 5-minute window
- Retry delays: 1s, 5s, 30s (exponential backoff)
- SMS only for alerts, not routine notifications (cost optimization)

#### Technology Stack / Stack Công nghệ

- **Language**: Node.js 20 (excellent for async I/O)
- **Framework**: Express.js + Socket.IO (WebSocket)
- **Database**: None (stateless service, logs to centralized logging)
- **Queue**: Redis 7 (retry queue for failed notifications)
- **External APIs**: Twilio (SMS), SendGrid (email), FCM (push)
- **Testing**: Jest, Supertest, nock (API mocking)

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 500+ notifications/minute during peak
- **Replica Count**: 2-3 instances
- **Stateless**: Easy horizontal scaling
- **Bottlenecks**: External API rate limits (mitigated by queueing)

#### Related Requirements / Yêu cầu Liên quan

- **FR8**: Kitchen overload alerts
- **FR10**: Inventory alerts
- **FR11**: Temperature alerts
- **NFR8**: Observability (notification delivery tracking)

---

### Service 5: Analytics & Forecasting Service 📊

**Visual Diagram**: [Analytics Service Component](../diagrams/components/analytics-service.md)

#### Responsibility / Trách nhiệm

Aggregate operational data, generate reports, and provide predictive insights.

Tổng hợp dữ liệu vận hành, tạo báo cáo và cung cấp dự đoán.

#### Key Functions / Chức năng Chính

1. **Data Aggregation**:
   - Subscribe to ALL events from Kafka (data lake)
   - Store events in Data Warehouse (Redshift/BigQuery)
   - ETL pipelines to transform raw events into analytics models

2. **Real-Time Metrics**:
   - Orders per hour
   - Revenue tracking
   - Average order value
   - Kitchen performance (avg prep time)
   - Table turnover rate

3. **Manager Dashboard**:
   - Real-time operational metrics
   - Today vs. yesterday comparisons
   - Peak hours identification
   - Top-selling dishes

4. **Reports**:
   - Daily summary report (email to manager)
   - Weekly performance report
   - Monthly business review
   - Custom date range queries

5. **Predictive Analytics (ML)**:
   - Forecast busy periods (lunch/dinner rush times)
   - Predict popular dishes for inventory planning
   - Recommend menu optimizations (remove low-selling items)
   - Staff scheduling recommendations

6. **Historical Analysis**:
   - Trend analysis (week-over-week, month-over-month)
   - Seasonality detection
   - Customer behavior patterns
   - Inventory consumption forecasting

#### Domain Model / Mô hình Domain

**Core Entities**:
- `OrderMetric`: Aggregate root (date, hour, orderCount, revenue, avgOrderValue)
- `DishPerformance`: Entity (dishId, orderCount, revenue, avgRating)
- `TableMetric`: Entity (tableId, turnoverCount, avgDiningTime, revenue)
- `Forecast`: Entity (forecastId, type, date, predictedValue, confidence)

**Business Rules**:
- Metrics aggregated every 5 minutes for real-time dashboard
- Reports generated at midnight for previous day
- ML models retrained weekly with latest data
- Data retention: 90 days hot, 1 year warm, 7 years cold

#### Technology Stack / Stack Công nghệ

- **Language**: Python 3.11 (excellent for ML/data science)
- **Framework**: FastAPI (REST API), Pandas (data processing), Scikit-learn (ML)
- **Database**: BigQuery or Redshift (data warehouse, OLAP)
- **Cache**: Redis 7 (dashboard metrics, 1-minute TTL)
- **API**: Kafka consumer (all events) + REST (queries)
- **ML**: Time series forecasting (ARIMA, Prophet), clustering
- **Testing**: pytest, pytest-mock, pandas testing

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 1000+ events/minute to process
- **Replica Count**: 1-2 instances (analytics is not time-critical)
- **Data Volume**: 10GB/month events, 1TB data warehouse
- **Bottlenecks**: BigQuery query costs (mitigated by caching and materialized views)

#### Related Requirements / Yêu cầu Liên quan

- **FR12**: Real-time dashboard
- **FR13**: Analytics reports
- **FR14**: Predictive forecasting
- **NFR8**: Observability (operational insights)

---

### Service 6: User & Access Management Service 🔐

**Visual Diagram**: [Auth Service Component](../diagrams/components/auth-service.md)

#### Responsibility / Trách nhiệm

Authenticate users and manage role-based access control (RBAC).

Xác thực người dùng và quản lý phân quyền dựa trên vai trò (RBAC).

#### Key Functions / Chức năng Chính

1. **User Authentication**:
   - Login with username/password
   - Issue JWT tokens (15-minute access token, 7-day refresh token)
   - Validate JWT tokens for API Gateway
   - Logout (token blacklist)

2. **Role-Based Access Control (RBAC)**:
   - Roles: Customer, Waiter, Chef, Manager, Admin
   - Permissions per role (view orders, modify menu, etc.)
   - Role assignment and management

3. **User Management**:
   - Create/update/delete user accounts
   - Manage user profiles (name, email, phone)
   - Password reset flow (email verification)

4. **Session Management**:
   - Track active sessions
   - Enforce max sessions per user
   - Session revocation (logout from all devices)

5. **Audit Logging**:
   - Log all authentication events
   - Track permission checks
   - Provide audit trail for compliance

#### Domain Model / Mô hình Domain

**Core Entities**:
- `User`: Aggregate root (userId, username, email, passwordHash, roles[])
- `Role`: Entity (roleId, name, permissions[])
- `Permission`: Value object (resource, action)
- `Session`: Entity (sessionId, userId, token, expiresAt, deviceInfo)
- `AuditLog`: Entity (logId, userId, action, timestamp, ipAddress)

**Business Rules**:
- Password must be >= 8 characters, include number and special char
- JWT tokens expire after 15 minutes (short-lived for security)
- Refresh tokens expire after 7 days (longer session)
- Failed login attempts: lock account after 5 consecutive failures
- Token blacklist: revoked tokens remain blacklisted until expiration

#### Technology Stack / Stack Công nghệ

- **Language**: Java 17 + Spring Boot 3.x
- **Framework**: Spring Security (authentication), JWT library (jose4j)
- **Database**: PostgreSQL 15 (user credentials, roles, permissions)
- **Cache**: Redis 7 (token blacklist, session cache)
- **API**: REST (synchronous)
- **Testing**: JUnit 5, Spring Security Test, Testcontainers

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 100+ login requests/minute
- **Replica Count**: 2 instances (high availability)
- **Stateless**: Tokens self-contained (no server-side session state)
- **Bottlenecks**: Database queries for user lookup (mitigated by caching)

#### Related Requirements / Yêu cầu Liên quan

- **NFR5**: Security (authentication, authorization)
- **All FR**: Access control applies to all functional requirements

---

### Service 7: IoT Gateway Service 🌐

**Visual Diagram**: [IoT Gateway Component](../diagrams/components/iot-gateway.md)

#### Responsibility / Trách nhiệm

Manage IoT device connectivity, protocol translation, and edge buffering.

Quản lý kết nối thiết bị IoT, chuyển đổi giao thức và buffering tại biên.

#### Key Functions / Chức năng Chính

1. **Device Connectivity**:
   - Accept connections from 100+ IoT devices
   - Support protocols: MQTT, HTTP, CoAP
   - Device authentication via certificates
   - Device registration and provisioning

2. **Protocol Translation**:
   - Convert MQTT messages to Kafka events
   - Normalize sensor data formats
   - Enrich events with metadata (location, device type)

3. **Edge Buffering**:
   - Buffer sensor data locally when cloud unavailable
   - Store up to 1 hour of data on disk
   - Replay buffered data when connection restored

4. **Retry Logic**:
   - Retry failed event publishes with exponential backoff
   - Dead letter queue for permanently failed events
   - Alert when DLQ threshold exceeded

5. **Device Management**:
   - Monitor device health (last seen, battery level)
   - Detect offline devices
   - Firmware update management (future)

6. **Security**:
   - Mutual TLS (mTLS) for device authentication
   - Certificate revocation list (CRL)
   - Rate limiting per device (prevent DDoS)

#### Domain Model / Mô hình Domain

**Core Entities**:
- `Device`: Aggregate root (deviceId, type, location, status, lastSeen, certificateId)
- `SensorReading`: Value object (deviceId, sensorType, value, unit, timestamp)
- `DeviceCertificate`: Entity (certificateId, deviceId, publicKey, expiresAt)
- `BufferedEvent`: Entity (eventId, deviceId, payload, timestamp, retryCount)

**Business Rules**:
- Devices must authenticate with valid certificate before sending data
- Sensor readings older than 5 minutes rejected (stale data)
- Buffered events replayed in chronological order
- Device marked "offline" if no heartbeat for 5 minutes
- Max retry: 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)

#### Technology Stack / Stack Công nghệ

- **Language**: Go 1.21 (high performance, low memory footprint)
- **Framework**: Gorilla WebSocket, Paho MQTT client
- **Database**: SQLite (edge buffering, lightweight)
- **Message Broker**: Mosquitto (MQTT broker) + Kafka producer
- **API**: MQTT (devices) + Kafka (cloud events)
- **Testing**: Go testing, testify (assertions), mock Kafka

#### Deployment / Triển khai

- **Location**: Edge (on-premise at restaurant) + Cloud (centralized)
- **Replica Count**: 2 instances (1 active, 1 standby)
- **Hardware**: Raspberry Pi 4 or equivalent (edge deployment)

#### Scaling Characteristics / Đặc tính Mở rộng

- **Peak Load**: 1000+ sensor readings/minute
- **Device Capacity**: 100-200 devices per gateway instance
- **Network**: Handles intermittent connectivity (buffering)
- **Bottlenecks**: Disk I/O for buffering (mitigated by sequential writes)

#### Related Requirements / Yêu cầu Liên quan

- **FR9**: IoT sensor integration
- **FR11**: Temperature sensor monitoring
- **NFR4**: Fault tolerance (IoT device failures)
- **NFR7**: Reliability (no data loss)

---

## Service Dependencies
## Phụ thuộc Dịch vụ

### Dependency Graph / Sơ đồ Phụ thuộc

```
                       ┌─────────────────┐
                       │   API Gateway   │
                       └────────┬────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │  Ordering    │ │   Kitchen    │ │ Auth Service │
        │  Service     │ │   Service    │ │              │
        └──────┬───────┘ └──────┬───────┘ └──────────────┘
               │                 │
               │    ┌────────────┴─────────────┐
               │    │        Event Bus         │
               │    │         (Kafka)          │
               └────┤                          ├─────┐
                    └────────────┬─────────────┘     │
                                 │                   │
          ┌──────────────────────┼───────────────────┼──────────┐
          │                      │                   │          │
          ▼                      ▼                   ▼          ▼
    ┌──────────────┐      ┌──────────────┐   ┌──────────────┐ ┌──────────────┐
    │  Inventory   │      │ Notification │   │  Analytics   │ │ IoT Gateway  │
    │  Service     │      │   Service    │   │  Service     │ │  Service     │
    └──────────────┘      └──────────────┘   └──────────────┘ └──────────────┘
```

### Dependency Matrix / Ma trận Phụ thuộc

| Service | Depends On | Dependency Type | Rationale |
|---------|------------|-----------------|-----------|
| **Ordering** | Auth Service | Sync (REST) | Validate user tokens |
| **Ordering** | Event Bus | Async (Kafka) | Publish OrderPlaced event |
| **Kitchen** | Event Bus | Async (Kafka) | Subscribe to OrderPlaced |
| **Inventory** | IoT Gateway | Async (Kafka) | Receive sensor readings |
| **Inventory** | Event Bus | Async (Kafka) | Publish InventoryLow event |
| **Notification** | Event Bus | Async (Kafka) | Subscribe to all alert events |
| **Analytics** | Event Bus | Async (Kafka) | Subscribe to ALL events |
| **IoT Gateway** | Event Bus | Async (Kafka) | Publish sensor events |
| **All Services** | API Gateway | Sync (REST) | External access routing |

### Dependency Principles / Nguyên tắc Phụ thuộc

1. **Minimize Synchronous Dependencies**: Prefer async events for loose coupling
2. **No Circular Dependencies**: Acyclic dependency graph enforced
3. **Stable Abstractions**: Depend on stable interfaces (Event Bus), not implementations
4. **Dependency Inversion**: Services depend on event schemas (abstractions), not other services directly

---

## Layered Architecture within Services
## Kiến trúc Phân lớp trong Dịch vụ

### Clean Architecture Pattern

Each microservice follows **Clean Architecture** (Hexagonal Architecture) principles:

```
┌─────────────────────────────────────────────────────────────────┐
│                    External Layer / Lớp Ngoài                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Adapters / Controllers (REST, Kafka, gRPC)         │ │
│  │  - REST Controllers     - Kafka Consumers/Producers        │ │
│  │  - WebSocket Handlers   - gRPC Services                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                Application Layer / Lớp Ứng dụng                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Use Cases / Services (Business Logic)         │ │
│  │  - PlaceOrderUseCase    - ValidateOrderUseCase             │ │
│  │  - UpdateOrderStatusUseCase                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Domain Layer / Lớp Domain                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │     Domain Entities, Value Objects, Business Rules         │ │
│  │  - Order (Aggregate Root)  - MenuItem (Entity)             │ │
│  │  - OrderValidator          - PricingCalculator             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               Infrastructure Layer / Lớp Hạ tầng                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │     Repositories, DB Access, External Services             │ │
│  │  - OrderRepository (PostgreSQL)                            │ │
│  │  - EventPublisher (Kafka)                                  │ │
│  │  - CacheService (Redis)                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities / Trách nhiệm Lớp

| Layer | Responsibility | Examples | Dependencies |
|-------|----------------|----------|--------------|
| **External** | Handle I/O, protocol conversion | REST controllers, Kafka listeners | Application Layer |
| **Application** | Orchestrate use cases, business workflows | PlaceOrderUseCase, UpdateInventoryUseCase | Domain Layer |
| **Domain** | Core business logic, domain rules | Order entity, PricingCalculator | None (pure business logic) |
| **Infrastructure** | Technical implementations, persistence | PostgreSQL repository, Kafka producer | Domain Layer (interfaces) |

### Dependency Rule / Quy tắc Phụ thuộc

**Dependency direction**: Outer layers → Inner layers
- Infrastructure depends on Domain (implements repository interfaces)
- Application depends on Domain (uses entities and business rules)
- External depends on Application (calls use cases)
- **Domain depends on NOTHING** (pure business logic)

This ensures:
- ✅ Domain logic testable without infrastructure
- ✅ Infrastructure changes don't affect business logic
- ✅ Easy to swap implementations (PostgreSQL → MongoDB)

---

## Database per Service Pattern
## Mô hình Database per Service

### Principle / Nguyên tắc

**Each microservice owns its database schema and data.**

Mỗi microservice sở hữu schema và dữ liệu của riêng nó.

See detailed schema diagrams: [Database per Service](../diagrams/data/database-per-service.md)

### Service Database Mapping / Ánh xạ Database

| Service | Database Type | Schema Tables | Size Estimate | Backup Frequency |
|---------|---------------|---------------|---------------|------------------|
| **Ordering** | PostgreSQL | orders, order_items, menu_items, tables | 500 GB | Hourly |
| **Kitchen** | PostgreSQL | kitchen_orders, order_queue, work_stations | 200 GB | Hourly |
| **Inventory** | InfluxDB | sensor_readings, stock_levels | 300 GB | Daily |
| **Auth** | PostgreSQL | users, roles, permissions, sessions | 100 GB | Daily |
| **Analytics** | BigQuery | order_metrics, dish_performance, forecasts | 1 TB | Weekly |
| **Notification** | None (stateless) | - | - | - |
| **IoT Gateway** | SQLite (edge) | buffered_events, devices | 10 GB | Daily |

### Cross-Service Data Access / Truy cập Dữ liệu Liên service

**Problem**: How does Kitchen Service get menu item details if Ordering Service owns menu data?

**Solution: Event-Driven Data Replication**

```
┌─────────────────┐                      ┌─────────────────┐
│  Ordering       │                      │   Kitchen       │
│  Service        │                      │   Service       │
│                 │                      │                 │
│ ┌─────────────┐ │                      │ ┌─────────────┐ │
│ │  Menu DB    │ │                      │ │ Kitchen DB  │ │
│ │ (Source of  │ │   OrderPlaced Event  │ │ (contains   │ │
│ │  Truth)     │ ├──────────────────────┤ │  order data │ │
│ └─────────────┘ │                      │ │  + menu     │ │
│                 │                      │ │  details)   │ │
└─────────────────┘                      │ └─────────────┘ │
                                         └─────────────────┘
```

**Patterns**:
1. **Event Carried State Transfer**: Include all necessary data in event payload
   - `OrderPlaced` event contains full menu item details (name, price)
   - Kitchen Service doesn't need to query Ordering Service

2. **Read Replica**: Analytics Service subscribes to all events and rebuilds denormalized views

3. **Compensating Transactions**: If order canceled, publish `OrderCanceled` event to revert changes

### Trade-offs / Đánh đổi

| Aspect | Benefit ✅ | Drawback ❌ |
|--------|-----------|-------------|
| **Data Autonomy** | Services independent, no coupling | Data duplication across services |
| **Scalability** | Scale databases independently | Complex joins across services |
| **Fault Isolation** | DB failure contained to one service | No ACID transactions across services |
| **Technology Choice** | Use best DB per service (SQL, NoSQL, time-series) | Increased operational complexity |

---

## Module Interfaces
## Giao diện Module

### API Standards / Tiêu chuẩn API

All microservices expose **REST APIs** following these standards:

#### 1. RESTful Design

```
GET    /api/v1/orders          - List orders (with pagination)
GET    /api/v1/orders/{id}     - Get order by ID
POST   /api/v1/orders          - Create new order
PATCH  /api/v1/orders/{id}     - Update order (partial)
DELETE /api/v1/orders/{id}     - Cancel order
```

#### 2. Request/Response Format

**Request**:
```json
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer <JWT token>

{
  "tableId": "TBL-05",
  "items": [
    {
      "itemId": "MENU-001",
      "quantity": 2,
      "specialInstructions": "No onions"
    }
  ]
}
```

**Response**:
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "orderId": "ORD-2026-001234",
  "status": "PLACED",
  "total": 165000,
  "estimatedTime": "15 minutes",
  "createdAt": "2026-02-21T10:30:45.123Z"
}
```

#### 3. Error Handling

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "INVALID_ORDER",
    "message": "Item MENU-999 not found",
    "details": {
      "itemId": "MENU-999"
    }
  }
}
```

#### 4. Pagination

```
GET /api/v1/orders?page=2&size=20&sort=createdAt,desc
```

#### 5. API Versioning

- URL versioning: `/api/v1/`, `/api/v2/`
- Maintain backward compatibility for 2 versions
- Deprecation notices 6 months before removal

### Event Interface Standards / Tiêu chuẩn Giao diện Event

All events follow **CloudEvents** specification:

See detailed event schemas: [Event Schema](../diagrams/data/event-schema.md)

```json
{
  "specversion": "1.0",
  "type": "com.irms.ordering.OrderPlaced",
  "source": "ordering-service",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "time": "2026-02-21T10:30:45.123Z",
  "datacontenttype": "application/json",
  "data": {
    "orderId": "ORD-2026-001234",
    "tableId": "TBL-05",
    "items": [...]
  }
}
```

---

## Service Responsibility Matrix
## Ma trận Trách nhiệm Dịch vụ

| Responsibility | Ordering | Kitchen | Inventory | Notification | Analytics | Auth | IoT Gateway |
|----------------|----------|---------|-----------|--------------|-----------|------|-------------|
| **Menu Management** | ✅ Primary | | | | | | |
| **Order Placement** | ✅ Primary | | | | 📊 Observes | 🔒 Validates | |
| **Order Validation** | ✅ Primary | | | | | | |
| **Kitchen Queue** | | ✅ Primary | | 📢 Alerts | 📊 Observes | | |
| **Order Status** | | ✅ Primary | | 📢 Notifies | 📊 Observes | | |
| **Inventory Tracking** | | | ✅ Primary | 📢 Alerts | 📊 Observes | | 📡 Ingests |
| **Temperature Monitoring** | | | ✅ Primary | 📢 Alerts | 📊 Observes | | 📡 Ingests |
| **Notifications** | | | | ✅ Primary | | | |
| **Dashboard** | | | | | ✅ Primary | | |
| **Reports** | | | | | ✅ Primary | | |
| **Forecasting** | | | | | ✅ Primary | | |
| **Authentication** | | | | | | ✅ Primary | |
| **Authorization** | | | | | | ✅ Primary | |
| **Device Management** | | | | | | | ✅ Primary |

**Legend**:
- ✅ **Primary**: Owns the responsibility
- 📊 **Observes**: Listens to events for analytics
- 📢 **Notifies/Alerts**: Sends notifications
- 🔒 **Validates**: Enforces security
- 📡 **Ingests**: Collects data

---

## Cross-Cutting Concerns
## Vấn đề Xuyên suốt

Cross-cutting concerns are handled consistently across all services:

### 1. Logging / Ghi log

**Standard**: Structured JSON logging (ELK stack)

```json
{
  "timestamp": "2026-02-21T10:30:45.123Z",
  "level": "INFO",
  "service": "ordering-service",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Order placed successfully",
  "orderId": "ORD-2026-001234",
  "userId": "USR-123",
  "duration": 45
}
```

**Log Levels**:
- **ERROR**: Unhandled exceptions, critical failures
- **WARN**: Recoverable errors, deprecated API usage
- **INFO**: Business events (order placed, inventory low)
- **DEBUG**: Detailed diagnostics (disabled in production)

### 2. Monitoring / Giám sát

**Standard**: Prometheus metrics + Grafana dashboards

**Standard Metrics per Service**:
- **Request Rate**: Requests/second
- **Error Rate**: Errors/second
- **Latency**: P50, P95, P99 response time
- **Throughput**: Events processed/second
- **Resource Usage**: CPU, memory, disk

**Custom Metrics**:
- Ordering Service: Orders placed/minute
- Kitchen Service: Queue length, avg prep time
- Inventory Service: Stock level, sensor failures

### 3. Distributed Tracing / Truy vết Phân tán

**Standard**: Jaeger with OpenTelemetry

**Trace Context Propagation**:
- **Trace ID**: Generated at API Gateway, propagated across all services
- **Span ID**: Unique per service operation
- **Baggage**: Contextual metadata (userId, tableId)

Example trace:
```
Trace ID: 550e8400-e29b-41d4-a716-446655440000
├─ Span: API Gateway (45ms)
│  ├─ Span: Auth Service - Validate Token (10ms)
│  └─ Span: Ordering Service - Place Order (30ms)
│     ├─ Span: Database Write (15ms)
│     └─ Span: Kafka Publish (10ms)
├─ Span: Kitchen Service - Process Order (20ms)
└─ Span: Notification Service - Send Push (5ms)
```

### 4. Security / Bảo mật

**Standard**: JWT authentication + RBAC authorization

- **Authentication**: Handled by Auth Service
- **Authorization**: Enforced at API Gateway and service level
- **Encryption**: TLS 1.3 for all external communication
- **Secrets**: Managed by Kubernetes Secrets or Vault

### 5. Configuration / Cấu hình

**Standard**: Environment variables + ConfigMaps (Kubernetes)

```yaml
# ConfigMap example
database:
  host: ${DB_HOST}
  port: ${DB_PORT}
  name: ${DB_NAME}
kafka:
  brokers: ${KAFKA_BROKERS}
  topic: ${KAFKA_TOPIC}
```

### 6. Error Handling / Xử lý Lỗi

**Standard**: Consistent error response format

```json
{
  "error": {
    "code": "INVALID_ORDER",
    "message": "Human-readable error message",
    "timestamp": "2026-02-21T10:30:45.123Z",
    "traceId": "550e8400-...",
    "details": {}
  }
}
```

**Retry Policy**: Exponential backoff with jitter
- Retry delays: 1s, 2s, 4s, 8s, 16s
- Max retries: 5 attempts
- Timeout: 30 seconds per request

### 7. Health Checks / Kiểm tra Sức khỏe

**Standard**: `/health` endpoint per service

```json
GET /health

{
  "status": "UP",
  "checks": [
    { "name": "database", "status": "UP", "responseTime": 5 },
    { "name": "kafka", "status": "UP", "responseTime": 10 },
    { "name": "redis", "status": "UP", "responseTime": 2 }
  ]
}
```

**Kubernetes Integration**:
- **Liveness Probe**: Restart pod if unhealthy
- **Readiness Probe**: Remove from load balancer if not ready

---

## Module Evolution Strategy
## Chiến lược Tiến hóa Module

### Adding New Services / Thêm Dịch vụ Mới

**Process**:
1. Identify new business capability (e.g., "Loyalty Program")
2. Define service boundaries and responsibilities
3. Create new repository and CI/CD pipeline
4. Define event schema and API contract
5. Implement service following Clean Architecture
6. Deploy to staging environment
7. Integration testing with existing services
8. Deploy to production with feature flag

### Service Versioning / Quản lý Phiên bản

**Strategy**: API versioning with backward compatibility

- **Version 1**: `/api/v1/orders`
- **Version 2**: `/api/v2/orders` (new features, breaking changes)
- **Support**: Maintain 2 versions simultaneously (6-month deprecation cycle)

### Service Retirement / Ngừng Dịch vụ

**Process**:
1. Announce deprecation (6 months notice)
2. Migrate consumers to new service/version
3. Stop accepting new traffic
4. Archive historical data
5. Decommission service and database

### Service Splitting / Phân tách Dịch vụ

**When to split a service**:
- Service exceeds 10,000 LOC
- Multiple teams working on same service
- Different scaling requirements for sub-domains
- Different deployment frequencies

**Example**: Split "Ordering Service" into:
- **Menu Service**: Manage menu items (low change frequency)
- **Order Service**: Handle order placement (high change frequency)

### Service Merging / Gộp Dịch vụ

**When to merge services**:
- Services always deployed together
- High inter-service communication overhead
- Shared database access patterns
- Team too small to manage separate services

**Example**: Merge "Notification Service" + "Alert Service" if responsibilities overlap

---

## Conclusion / Kết luận

The Module View demonstrates how IRMS is decomposed into **7 independent microservices**, each with:

- ✅ **Clear responsibilities** aligned with business capabilities
- ✅ **Minimal dependencies** via event-driven communication
- ✅ **Database per service** for data autonomy
- ✅ **Clean Architecture** for maintainability
- ✅ **Consistent interfaces** (REST APIs, CloudEvents)
- ✅ **Independent scalability** based on load

This modular design enables:
- **Parallel development** by multiple teams
- **Independent deployment** without system downtime
- **Fault isolation** (failures don't cascade)
- **Technology diversity** (best tool per service)
- **Evolution** (add/remove services without disruption)

See related views:
- [Component & Connector View](04-component-connector-view.md) - Runtime interactions
- [Deployment View](05-deployment-view.md) - Infrastructure topology
- [Runtime Scenarios](06-runtime-scenarios.md) - End-to-end flows

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Authors**: IRMS Architecture Team
**Status**: ✅ Complete
