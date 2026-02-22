---
title: Non-Functional Requirements
title_vi: Yêu cầu Phi Chức năng
description: Detailed specifications for all non-functional requirements (NFR1-NFR8) with measurable criteria
related_requirements: FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14
related_diagrams: ../architecture/02-architecture-characteristics.md
last_updated: 2026-02-21
---

# Non-Functional Requirements / Yêu cầu Phi Chức năng

## Overview / Tổng quan

This document specifies all non-functional requirements (NFRs) for the Intelligent Restaurant Management System (IRMS). Each NFR includes measurable criteria, testing approaches, and architecture tactics to ensure the system meets quality attribute goals.

Tài liệu này đặc tả tất cả các yêu cầu phi chức năng (NFR) cho Hệ thống Quản lý Nhà hàng Thông minh (IRMS). Mỗi NFR bao gồm tiêu chí đo lường, phương pháp kiểm thử và chiến thuật kiến trúc để đảm bảo hệ thống đáp ứng mục tiêu chất lượng.

---

## Requirements Prioritization / Ưu tiên Yêu cầu

NFRs are prioritized based on business value and technical risk using the **Quality Attribute Workshop (QAW)** approach:

| Priority | Requirement | Architecture Characteristic | Business Impact |
|----------|-------------|---------------------------|-----------------|
| **1 (Critical)** | NFR2 | Real-Time Responsiveness | HIGH - Customer experience |
| **2 (Critical)** | NFR1 | Performance & Throughput | HIGH - Peak hour operations |
| **3 (High)** | NFR4 | Reliability & Fault Tolerance | HIGH - No lost orders |
| **4 (High)** | NFR3 | Availability | HIGH - Business hours uptime |
| **5 (Medium)** | NFR6 | Scalability | MEDIUM - Future growth |
| **6 (Medium)** | NFR7 | Maintainability | MEDIUM - Long-term cost |
| **7 (Medium)** | NFR5 | Security | MEDIUM - Data protection |
| **8 (Medium)** | NFR8 | Observability | MEDIUM - Operations support |

---

## NFR1: Performance - High Throughput
### Hiệu năng - Thông lượng Cao

**Category**: Performance / Hiệu năng
**Priority**: P0 (Critical)
**Related Architecture Characteristic**: Performance, Scalability
**Related FRs**: FR4, FR5, FR12
**Related Architecture Decisions**: ADR-001 (Microservices), ADR-002 (Event-Driven), ADR-006 (Kubernetes HPA)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Hệ thống phải xử lý được vài trăm đơn hàng đồng thời vào giờ cao điểm mà không bị suy giảm hiệu năng. Dashboard cập nhật theo thời gian thực ngay cả dưới tải cao.

**English**: The system must handle several hundred concurrent orders during peak hours without performance degradation. Dashboard updates in real-time even under high load.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Sustained Throughput** | 100 orders/minute | Load testing with JMeter |
| **Peak Throughput** | 200 orders/minute for 30 minutes | Stress testing |
| **Request Processing** | P95 < 500ms for order placement API | Prometheus metrics |
| **Database Writes** | P95 < 100ms | PostgreSQL slow query log |
| **Event Publishing** | P95 < 50ms to Kafka | Kafka producer metrics |
| **Concurrent Users** | 150+ customers ordering simultaneously | Load testing simulation |

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Horizontal Scaling**: Kubernetes HPA auto-scales Ordering Service based on CPU (> 70%) and request rate (> 100 req/s)
2. **Asynchronous Processing**: Kafka event bus decouples services for non-blocking operations
3. **Caching**: Redis caches menu data, reducing database queries
4. **Database Optimization**:
   - Connection pooling (max 50 connections per service)
   - Read replicas for query distribution
   - Indexed columns for fast lookups
5. **Load Balancing**: NGINX Ingress distributes traffic across service replicas

### Testing Approach / Phương pháp Kiểm thử

**Load Testing Scenario**:
```
Tool: Apache JMeter
Virtual Users: 100 concurrent users
Ramp-up: 5 minutes
Duration: 30 minutes sustained + 15 minutes peak (200 orders/min)
Operations: Browse menu, add items, place order, check status

Success Criteria:
✅ Sustained: 100 orders/min for 30 min without errors
✅ Peak: 200 orders/min for 15 min with < 1% error rate
✅ P95 latency < 500ms throughout test
✅ No service crashes or restarts
✅ Database connections < 80% utilization
```

**Monitoring**:
- Prometheus + Grafana dashboard showing real-time throughput
- Alert triggers if throughput drops below 80 orders/min during peak
- Kafka consumer lag monitoring (alert if > 100 messages)

### Related Services / Dịch vụ Liên quan

- **PRIMARY**: Ordering Service, Kitchen Service, Event Bus
- **SECONDARY**: API Gateway, Auth Service, Database

### Verification Evidence / Bằng chứng Xác minh

See: [Order Placement Flow Diagram](../diagrams/sequences/order-placement-flow.md) - Shows 450ms typical latency with capacity for 100+ concurrent requests

---

## NFR2: Real-Time Responsiveness - Low Latency
### Đáp ứng Thời gian Thực - Độ trễ Thấp

**Category**: Performance / Hiệu năng
**Priority**: P0 (CRITICAL) ⚡
**Related Architecture Characteristic**: Real-Time Responsiveness (Priority #1)
**Related FRs**: FR1, FR3, FR4
**Related Architecture Decisions**: ADR-002 (Event-Driven), ADR-003 (Database per Service)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Thời gian phản hồi khi đơn hàng được gửi từ bàn đến bếp phải dưới 1 giây (< 1s). Đây là yêu cầu QUAN TRỌNG NHẤT vì ảnh hưởng trực tiếp đến trải nghiệm khách hàng và hiệu quả vận hành bếp.

**English**: Response time from order submission at table to kitchen receipt must be under 1 second (< 1s). This is the MOST CRITICAL requirement as it directly impacts customer experience and kitchen operational efficiency.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **End-to-End Latency** | **P95 < 1000ms** (P50 < 500ms) | Distributed tracing (Jaeger) |
| **Ordering API** | P95 < 200ms | Prometheus API metrics |
| **Event Publication** | P95 < 80ms (publish + persist) | Kafka producer metrics |
| **Event Delivery** | P95 < 100ms (consume + process) | Kafka consumer lag |
| **KDS Update** | P95 < 50ms (WebSocket push) | Kitchen Service metrics |
| **Customer Confirmation** | P95 < 100ms (API response) | Frontend telemetry |

### Critical Path Breakdown / Phân tích Đường đi Quan trọng

From: Customer clicks "Đặt món" → To: Kitchen sees order on KDS

| Phase | Operation | Target Time | Cumulative |
|-------|-----------|-------------|------------|
| **1. API Request** | Tablet → API Gateway → Ordering Service | 20ms | 20ms |
| **2. Validation** | Check stock, validate table, calculate total | 50ms | 70ms |
| **3. Database Write** | Persist order to PostgreSQL | 80ms | 150ms |
| **4. HTTP Response** | Return 201 Created to customer | 10ms | 160ms |
| **5. Event Publish** | Publish OrderPlaced to Kafka | 50ms | 210ms |
| **6. Event Persist** | Kafka writes to disk (acks=1) | 30ms | 240ms |
| **7. Event Consume** | Kitchen Service receives event | 20ms | 260ms |
| **8. Queue Update** | Add to kitchen queue, calculate priority | 40ms | 300ms |
| **9. KDS Push** | WebSocket push to Kitchen Display | 20ms | 320ms |
| **10. UI Render** | KDS renders order card | 50ms | 370ms |

**TOTAL TYPICAL LATENCY: 370ms** ✅ (Well under 1s target)
**WORST CASE (P95): 800ms** ✅ (Still under 1s target)

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Asynchronous Event Processing**: Customer confirmation doesn't wait for kitchen receipt
2. **Write-Through Caching**: Redis caches menu data to avoid database lookups
3. **Database Optimization**:
   - Connection pooling to reduce connection overhead
   - Write-optimized indexes on orders table
   - Async replication to read replicas (don't wait for sync)
4. **Event Bus Optimization**:
   - Kafka `acks=1` (leader acknowledgment only, not all replicas)
   - Message compression disabled for low latency (trade size for speed)
5. **Service Co-location**: Deploy Ordering Service and Event Bus in same availability zone
6. **gRPC for Internal Calls**: Binary protocol faster than REST for service-to-service

### Testing Approach / Phương pháp Kiểm thử

**Latency Testing**:
```
Tool: Distributed Tracing (Jaeger)
Test: 100 order placements
Measurement: End-to-end span from API call to KDS update

Success Criteria:
✅ P50 latency < 500ms
✅ P95 latency < 1000ms
✅ P99 latency < 1500ms
✅ Max latency < 2000ms
✅ No timeouts or errors
```

**Continuous Monitoring**:
- Alert if P95 latency > 1s for 5 consecutive minutes
- Dashboard shows real-time latency distribution
- Trace IDs logged for debugging slow requests

### Related Services / Dịch vụ Liên quan

- **CRITICAL PATH**: Ordering Service, Event Bus (Kafka), Kitchen Service, KDS
- **SUPPORTING**: API Gateway, Auth Service (JWT validation), Redis Cache

### Verification Evidence / Bằng chứng Xác minh

See: [Order Placement Flow Diagram](../diagrams/sequences/order-placement-flow.md) - Detailed timeline shows 450ms typical, 800ms P95 latency

---

## NFR3: Availability - High Uptime During Business Hours
### Tính Sẵn sàng - Uptime Cao trong Giờ Kinh doanh

**Category**: Availability / Tính Sẵn sàng
**Priority**: P1 (High)
**Related Architecture Characteristic**: Availability (Priority #5)
**Related FRs**: All FRs (system-wide)
**Related Architecture Decisions**: ADR-006 (Kubernetes), ADR-007 (Circuit Breaker)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: IRMS phải hoạt động liên tục trong giờ kinh doanh của nhà hàng (11:00 - 23:00) với uptime tối thiểu 99%. Hệ thống phải tự phục hồi khi có lỗi và hạn chế downtime.

**English**: IRMS must operate continuously during restaurant business hours (11:00 - 23:00) with minimum 99% uptime. The system must self-recover from failures and minimize downtime.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **Uptime (Business Hours)** | ≥ 99% (11:00-23:00 daily) | Uptime monitoring (UptimeRobot, Pingdom) |
| **Downtime Allowance** | ≤ 7.2 minutes/day (during 12-hour window) | Incident tracking |
| **Mean Time to Recovery (MTTR)** | < 5 minutes | Kubernetes pod restart metrics |
| **Health Check Success Rate** | > 99.9% | Prometheus health endpoint monitoring |
| **Service Restart Time** | < 30 seconds | Kubernetes liveness probe logs |

### Availability Calculation / Tính toán Sẵn sàng

```
Target Uptime: 99%
Business Hours: 12 hours/day (11:00-23:00)
Downtime Allowance: 12 hours × 60 min × 0.01 = 7.2 minutes/day

Monthly:
Total Business Hours: 12 hours/day × 30 days = 360 hours
Max Downtime: 360 hours × 0.01 = 3.6 hours/month = 216 minutes/month
```

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Multi-Replica Deployment**: All services deployed with 2+ replicas
   - Ordering Service: 3 replicas (min)
   - Kitchen Service: 2 replicas
   - Other services: 2 replicas
2. **Health Checks**:
   - Liveness Probe: Restart unhealthy pods (checks every 10s)
   - Readiness Probe: Remove from load balancer if not ready (checks every 5s)
3. **Auto-Recovery**: Kubernetes automatically restarts failed pods
4. **Load Balancing**: Traffic distributed across healthy replicas
5. **Multi-AZ Deployment**: Pods spread across 3 availability zones
6. **Database High Availability**:
   - PostgreSQL with streaming replication (1 primary + 2 replicas)
   - Automatic failover using Patroni or pgpool
7. **Circuit Breaker**: Prevent cascade failures when dependencies unavailable

### Testing Approach / Phương pháp Kiểm thử

**Chaos Engineering Tests**:
```
Scenarios:
1. Kill Ordering Service pod → Verify auto-restart < 30s
2. Overload Kitchen Service → Verify HPA scales up
3. Disconnect database → Verify circuit breaker activates
4. Network partition → Verify service degradation (not full failure)

Success Criteria:
✅ No complete service outage
✅ Recovery time < 5 minutes for all scenarios
✅ Customer orders continue during pod restarts (other replicas handle traffic)
```

**Uptime Monitoring**:
- External monitoring service (UptimeRobot) checks every 1 minute
- Internal health checks via Prometheus every 15 seconds
- Alert if uptime drops below 99% in rolling 24-hour window

### Related Services / Dịch vụ Liên quan

- **CRITICAL**: All services (Ordering, Kitchen, Inventory, etc.)
- **INFRASTRUCTURE**: Kubernetes cluster, Load Balancer, Ingress Controller

### Verification Evidence / Bằng chứng Xác minh

See: [Kubernetes Deployment Diagram](../diagrams/deployment/kubernetes-deployment.md) - Shows multi-replica deployment and health check configuration

---

## NFR4: Reliability & Fault Tolerance
### Độ Tin cậy & Khả năng Chịu lỗi

**Category**: Reliability / Độ tin cậy
**Priority**: P1 (High)
**Related Architecture Characteristic**: Reliability & Consistency (Priority #2), Fault Tolerance - IoT (Priority #4)
**Related FRs**: FR4, FR9, FR11 (IoT scenarios)
**Related Architecture Decisions**: ADR-002 (Event-Driven), ADR-005 (IoT Gateway), ADR-007 (Circuit Breaker)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Hệ thống đảm bảo không làm gián đoạn quy trình đặt món và chế biến khi có lỗi cục bộ. Không được mất đơn hàng dưới mọi tình huống. Trạng thái đơn hàng phải nhất quán giữa tablet - bếp - dashboard. Nếu sensor IoT mất kết nối, hệ thống vẫn tiếp tục vận hành và event quan trọng được lưu trữ để retry.

**English**: The system ensures no disruption to ordering and cooking processes when local failures occur. No orders must be lost under any circumstances. Order status must be consistent across tablet - kitchen - dashboard. If IoT sensors lose connection, the system continues operating and critical events are stored for retry.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Order Loss Rate** | **0%** (Zero tolerance) | Order audit log comparison |
| **Data Consistency** | 100% eventual consistency within 5s | Integration tests |
| **Event Delivery Guarantee** | 100% (at-least-once delivery) | Kafka message persistence |
| **IoT Sensor Failure Tolerance** | System operational with up to 30% sensors offline | Chaos testing |
| **Event Retry Success Rate** | > 99% of buffered events delivered after recovery | Retry queue metrics |
| **Circuit Breaker Effectiveness** | 0 cascade failures during dependency outage | Circuit breaker metrics |

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Event Sourcing (Partial)**:
   - All order state changes emit events
   - Events persisted in Kafka (retention: 7 days)
   - Can rebuild order state from event log if needed
2. **At-Least-Once Delivery**:
   - Kafka guarantees message persistence (replication factor 3, min ISR 2)
   - Services use idempotent event handlers (check `eventId` to detect duplicates)
3. **Circuit Breaker Pattern**:
   - Open circuit if dependency fails 5 consecutive times
   - Half-open retry after 30 seconds
   - Prevents cascade failures
4. **Compensation Transactions**:
   - If order validation fails after event published → emit `OrderCancelled` event
   - Saga pattern for complex multi-service workflows
5. **IoT Edge Buffering**:
   - IoT Gateway buffers sensor data locally (SQLite, 10GB capacity)
   - Retry with exponential backoff (1s, 2s, 4s, 8s, ...)
   - Data retained for 7 days before overwriting
6. **Database Transactions**:
   - ACID transactions within single service
   - Eventual consistency across services (via events)

### Failure Scenarios & Handling / Kịch bản Lỗi & Xử lý

#### Scenario 1: Database Unavailable
```
Problem: Ordering Service can't write to PostgreSQL
Handling:
1. Return 503 Service Unavailable to customer
2. Customer sees error message: "Vui lòng thử lại sau vài giây"
3. Order NOT lost (customer can retry)
4. Alternative: Buffer order locally + sync when DB recovers (risk: data loss if pod crashes)
```

#### Scenario 2: Event Bus (Kafka) Unavailable
```
Problem: Can't publish OrderPlaced event
Handling:
1. Ordering Service buffers event to local disk
2. Returns success to customer (order accepted)
3. Retry publishing with exponential backoff
4. Kitchen receives order delayed (eventual consistency)
5. Fallback: Synchronous HTTP call to Kitchen Service if retry fails
```

#### Scenario 3: Kitchen Service Down
```
Problem: Kitchen Service pod crashed
Handling:
1. Kafka buffers OrderPlaced events (persistent queue)
2. Customer still receives order confirmation
3. When Kitchen Service restarts → processes buffered events
4. No orders lost ✅
```

#### Scenario 4: IoT Sensor Offline
```
Problem: Temperature sensor loses WiFi connection
Handling:
1. Last known temperature displayed with "stale" indicator
2. System continues operating (doesn't block orders)
3. Alert sent to manager: "Sensor offline"
4. When sensor reconnects → buffered readings uploaded
```

### Testing Approach / Phương pháp Kiểm thử

**Reliability Testing**:
```
Test 1: Database Failover
- Simulate primary database crash
- Verify automatic failover to replica < 5 minutes
- Verify no orders lost (check audit log)

Test 2: Event Bus Failure
- Stop Kafka cluster
- Place 10 orders → verify buffered locally
- Restart Kafka → verify all 10 orders delivered to Kitchen

Test 3: IoT Sensor Disconnect
- Disconnect temperature sensor during operation
- Verify system continues without sensor
- Verify buffered data uploaded when reconnected

Success Criteria:
✅ 0 orders lost in all scenarios
✅ Eventual consistency achieved within 5 seconds
✅ No cascade failures
```

### Related Services / Dịch vụ Liên quan

- **CRITICAL**: Event Bus (Kafka), All databases, IoT Gateway
- **ALL SERVICES**: Must implement idempotent event handlers

### Verification Evidence / Bằng chứng Xác minh

See:
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md) - Shows event persistence
- [Sensor Failure Handling](../diagrams/sequences/sensor-failure-handling.md) - Shows circuit breaker and edge buffering
- [IoT Gateway Component](../diagrams/components/iot-gateway.md) - Shows retry logic

---

## NFR5: Security - Data Protection & Authentication
### Bảo mật - Bảo vệ Dữ liệu & Xác thực

**Category**: Security / Bảo mật
**Priority**: P2 (Medium)
**Related Architecture Characteristic**: Security (Priority #7)
**Related FRs**: FR1, FR2 (customer data), FR9, FR11 (IoT devices)
**Related Architecture Decisions**: ADR-004 (API Gateway), ADR-005 (IoT Gateway)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Thiết bị IoT cần xác thực trước khi kết nối vào hệ thống. Dữ liệu đơn hàng và thanh toán phải được mã hóa và phân quyền. Hệ thống ngăn chặn truy cập trái phép và đảm bảo tính toàn vẹn dữ liệu.

**English**: IoT devices must authenticate before connecting to the system. Order and payment data must be encrypted and access-controlled. The system prevents unauthorized access and ensures data integrity.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **Authentication Success Rate** | 100% for valid credentials | Auth Service logs |
| **Unauthorized Access Attempts** | 0 successful breaches | Security audit log |
| **Data Encryption** | 100% of sensitive data encrypted at rest & in transit | Security scan |
| **IoT Device Registration** | 100% devices authenticated before operation | IoT Gateway logs |
| **Password Strength** | 100% passwords meet complexity requirements | Password policy enforcement |
| **JWT Token Validation** | 100% requests validated | API Gateway metrics |

### Security Requirements / Yêu cầu Bảo mật

#### 1. Authentication (Xác thực)
- **JWT Tokens**: Issued by Auth Service, valid for 24 hours
- **Token Contents**: userId, role, permissions, expiration
- **Refresh Tokens**: Secure long-lived tokens for renewal
- **Multi-Factor Authentication (Future)**: SMS/Email OTP for admin accounts

#### 2. Authorization (Phân quyền)
- **RBAC Model** (Role-Based Access Control):
  - **Customer**: View menu, place orders, view own orders
  - **Waiter**: View all orders, update order status
  - **Chef**: View kitchen queue, update cooking status
  - **Manager**: Full dashboard access, analytics, system configuration
  - **Admin**: User management, system settings
- **API Endpoint Protection**: Each endpoint checks user role before execution

#### 3. Data Encryption
- **In Transit**: TLS 1.3 for all API calls (HTTPS)
- **At Rest**:
  - Database encryption (PostgreSQL with pgcrypto)
  - Passwords hashed with BCrypt (cost factor 12)
  - Sensitive fields (payment info) encrypted with AES-256
- **Secrets Management**: Kubernetes Secrets or HashiCorp Vault (not in code)

#### 4. IoT Device Security
- **Device Registration**: Each sensor has unique certificate
- **mTLS**: Mutual TLS between IoT Gateway and devices
- **Device Whitelist**: Only registered MAC addresses allowed
- **Credential Rotation**: Device certificates rotated every 90 days

#### 5. Input Validation
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Input sanitization for all user inputs
- **CSRF Protection**: CSRF tokens for state-changing operations
- **Rate Limiting**: Max 100 requests/minute per IP

### Architecture Tactics / Chiến thuật Kiến trúc

1. **API Gateway as Security Perimeter**:
   - All external requests go through API Gateway
   - JWT validation before routing to services
   - Rate limiting and IP filtering
2. **Zero Trust Model**:
   - Services validate JWT even for internal calls
   - mTLS between services (using Istio service mesh)
3. **Secret Management**:
   - Database credentials stored in Kubernetes Secrets
   - Environment variables never contain secrets
4. **Audit Logging**:
   - All authentication attempts logged
   - All order placements logged with userId
   - Failed access attempts trigger alerts

### Testing Approach / Phương pháp Kiểm thử

**Security Testing**:
```
1. Penetration Testing:
   - OWASP Top 10 vulnerability scan
   - SQL injection tests
   - XSS attack tests
   - CSRF attack tests

2. Authentication Testing:
   - Invalid JWT → 401 Unauthorized
   - Expired JWT → 401 Unauthorized
   - Missing JWT → 401 Unauthorized
   - Valid JWT → 200 OK

3. Authorization Testing:
   - Customer role accessing manager endpoint → 403 Forbidden
   - Chef role updating user settings → 403 Forbidden

Success Criteria:
✅ 0 critical vulnerabilities (CVSS > 7.0)
✅ 100% authentication tests passed
✅ 100% authorization tests passed
```

### Related Services / Dịch vụ Liên quan

- **CRITICAL**: Auth Service, API Gateway
- **ALL SERVICES**: Must validate JWT and enforce RBAC

### Verification Evidence / Bằng chứng Xác minh

See:
- [Auth Service Component](../diagrams/components/auth-service.md) - Shows JWT validation and RBAC
- [IoT Gateway Component](../diagrams/components/iot-gateway.md) - Shows device authentication

---

## NFR6: Scalability - Horizontal Scaling Capability
### Khả năng Mở rộng - Mở rộng Theo chiều Ngang

**Category**: Scalability / Khả năng mở rộng
**Priority**: P2 (Medium)
**Related Architecture Characteristic**: Scalability (Priority #3)
**Related FRs**: All FRs (system-wide)
**Related Architecture Decisions**: ADR-001 (Microservices), ADR-006 (Kubernetes HPA)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Hệ thống phải mở rộng khi số lượng khách hàng, đơn hàng và thiết bị IoT tăng. Hệ thống có thể triển khai cho nhiều chi nhánh nhà hàng mà không cần thay đổi kiến trúc cốt lõi.

**English**: The system must scale when the number of customers, orders, and IoT devices increases. The system can be deployed across multiple restaurant branches without core architecture changes.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Horizontal Pod Autoscaling** | Auto-scale from 2 → 10 instances based on load | Kubernetes HPA metrics |
| **Scaling Trigger Time** | New pods ready < 60 seconds | HPA logs |
| **Scaling Down Time** | Scale down after 5 minutes of low load | HPA stabilization window |
| **Database Connection Scaling** | Support 500+ concurrent connections | PostgreSQL connection pool |
| **Multi-Branch Support** | Single deployment supports 10+ branches | Multi-tenancy testing |
| **IoT Device Scaling** | Support 200+ devices per branch | IoT Gateway capacity test |

### Scalability Dimensions / Chiều Mở rộng

#### 1. Request Scaling (Tải yêu cầu)
- **Current Capacity**: 100 orders/min sustained
- **Target Capacity**: 500 orders/min (5x growth)
- **Mechanism**: Horizontal Pod Autoscaling (HPA)
  - Ordering Service: 3 → 10 replicas
  - Kitchen Service: 2 → 5 replicas

#### 2. Data Scaling (Dữ liệu)
- **Current Data**: 10,000 orders/month
- **Target Data**: 100,000 orders/month (10x growth)
- **Mechanism**:
  - Database sharding by restaurant branch (future)
  - Archive old orders to cold storage (S3/GCS) after 6 months

#### 3. Geographic Scaling (Địa lý)
- **Current**: 1 restaurant location
- **Target**: 10+ restaurant branches
- **Mechanism**:
  - Multi-tenancy (tenant ID = branch ID)
  - Data isolation per branch
  - Shared infrastructure, isolated data

#### 4. IoT Device Scaling (Thiết bị IoT)
- **Current**: 20 sensors per restaurant
- **Target**: 200 sensors per restaurant (10x growth)
- **Mechanism**:
  - IoT Gateway scales independently
  - MQTT broker handles 1000+ concurrent connections

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Stateless Services**: All services are stateless (state in database/cache)
   - Enables horizontal scaling without session affinity
2. **Database Read Replicas**: Distribute read load across replicas
3. **Caching Strategy**: Redis reduces database load
4. **Event Bus Partitioning**: Kafka topics partitioned for parallel processing
5. **Container Orchestration**: Kubernetes manages scaling automatically

### Auto-Scaling Configuration / Cấu hình Auto-Scaling

**Ordering Service HPA**:
```yaml
minReplicas: 3
maxReplicas: 10
metrics:
  - type: CPU
    target: 70% utilization
  - type: Memory
    target: 80% utilization
  - type: Custom
    metric: http_requests_per_second
    target: 1000 req/s per pod
```

### Testing Approach / Phương pháp Kiểm thử

**Scalability Testing**:
```
Test 1: Load Increase
- Start with 50 orders/min
- Gradually increase to 300 orders/min over 10 minutes
- Verify HPA scales from 3 → 8 replicas
- Verify no performance degradation

Test 2: Load Decrease
- Reduce load from 300 → 50 orders/min
- Verify HPA scales down 8 → 3 replicas after 5 minutes
- Verify graceful pod termination (no abrupt connection drops)

Success Criteria:
✅ Scaling up completes < 60 seconds
✅ Scaling down completes gracefully
✅ Performance maintained during scaling events
```

### Related Services / Dịch vụ Liên quan

- **ALL SERVICES**: Must be designed for horizontal scaling (stateless)

### Verification Evidence / Bằng chứng Xác minh

See:
- [Kubernetes Deployment Diagram](../diagrams/deployment/kubernetes-deployment.md) - Shows HPA configuration
- [Kitchen Overload Scenario](../diagrams/sequences/kitchen-overload-scenario.md) - Shows auto-scaling in action

---

## NFR7: Maintainability - Modular & Evolvable Architecture
### Khả năng Bảo trì - Kiến trúc Modular & Dễ Phát triển

**Category**: Maintainability / Khả năng bảo trì
**Priority**: P2 (Medium)
**Related Architecture Characteristic**: Maintainability (Priority #6)
**Related FRs**: All FRs (affects all features)
**Related Architecture Decisions**: ADR-001 (Microservices), SOLID Principles

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Các module cần thiết kế độc lập, dễ bảo trì và mở rộng. Hệ thống dễ dàng thêm chức năng mới (AI forecasting, loyalty program) mà không ảnh hưởng đến các module hiện có.

**English**: Modules must be designed independently, easy to maintain and extend. The system easily accommodates new features (AI forecasting, loyalty program) without affecting existing modules.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **Code Maintainability Index** | > 70 (Good) | SonarQube analysis |
| **Service Coupling** | Loose coupling (dependency score < 20%) | Dependency analysis |
| **Code Duplication** | < 5% | SonarQube duplicate detection |
| **Test Coverage** | > 80% for business logic | JaCoCo / Istanbul |
| **Documentation Coverage** | 100% public APIs documented | API documentation check |
| **Time to Add New Feature** | < 2 weeks for typical feature | Development velocity tracking |

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Microservices Pattern**:
   - Services can be developed, deployed, and scaled independently
   - Teams can work on different services in parallel
2. **SOLID Principles**:
   - **S**ingle Responsibility: Each class/module has one responsibility
   - **O**pen/Closed: Open for extension, closed for modification
   - **L**iskov Substitution: Subclasses replace parent classes
   - **I**nterface Segregation: Small, focused interfaces
   - **D**ependency Inversion: Depend on abstractions, not concretions
3. **Clean Architecture** (Layered approach):
   ```
   Presentation Layer (API Controllers)
        ↓
   Application Layer (Use Cases)
        ↓
   Domain Layer (Business Logic)
        ↓
   Infrastructure Layer (Database, External APIs)
   ```
4. **Event-Driven Decoupling**: Services communicate via events (loose coupling)
5. **API Versioning**: Support multiple API versions simultaneously (e.g., `/api/v1`, `/api/v2`)

### Code Quality Standards / Tiêu chuẩn Chất lượng Code

1. **Naming Conventions**:
   - Classes: PascalCase (e.g., `OrderService`)
   - Methods: camelCase (e.g., `placeOrder()`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_QUEUE_LENGTH`)
2. **Comments & Documentation**:
   - All public APIs documented with JavaDoc/JSDoc
   - Complex algorithms explained with inline comments
3. **Error Handling**:
   - Consistent error format (RFC 7807 Problem Details)
   - Never swallow exceptions silently
4. **Logging**:
   - Structured logging (JSON format)
   - Log levels: TRACE, DEBUG, INFO, WARN, ERROR
   - Correlation IDs for distributed tracing

### Testing Approach / Phương pháp Kiểm thử

**Code Quality Checks**:
```
1. Static Analysis:
   - SonarQube scan before every merge
   - Block merge if critical issues detected

2. Unit Tests:
   - 80% coverage requirement
   - Mock external dependencies
   - Fast execution (< 5 minutes for full test suite)

3. Integration Tests:
   - Test service boundaries
   - Use test containers for database

4. Code Review:
   - Minimum 2 reviewers per PR
   - Automated linting (ESLint, Checkstyle)

Success Criteria:
✅ 0 critical SonarQube issues
✅ > 80% test coverage
✅ All tests pass
✅ Code review approved
```

### Related Services / Dịch vụ Liên quan

- **ALL SERVICES**: Must follow maintainability standards

---

## NFR8: Observability - Monitoring, Logging & Alerting
### Khả năng Quan sát - Giám sát, Logging & Cảnh báo

**Category**: Observability / Khả năng quan sát
**Priority**: P2 (Medium)
**Related Architecture Characteristic**: Observability (Priority #8)
**Related FRs**: FR8, FR12 (monitoring dashboards)
**Related Architecture Decisions**: ADR-006 (Kubernetes + Monitoring Stack)

### Requirement Statement / Phát biểu Yêu cầu

**Vietnamese**: Hệ thống cần logging đầy đủ, monitoring liên tục và alerting kịp thời. Quản lý có thể theo dõi nhanh sự cố trong vận hành và khắc phục trước khi ảnh hưởng đến khách hàng.

**English**: The system requires comprehensive logging, continuous monitoring, and timely alerting. Managers can quickly track operational issues and remediate before impacting customers.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **Log Retention** | 30 days in Elasticsearch | Elasticsearch index lifecycle |
| **Metric Collection Interval** | Every 15 seconds | Prometheus scrape interval |
| **Alert Response Time** | Critical alerts within 2 minutes | PagerDuty metrics |
| **Dashboard Load Time** | < 3 seconds | Grafana performance |
| **Trace Sampling Rate** | 10% of requests traced | Jaeger configuration |
| **Log Search Performance** | < 5 seconds for common queries | Kibana query performance |

### Three Pillars of Observability / Ba Trụ cột Quan sát

#### 1. Metrics (Đo lường)
**Tool**: Prometheus + Grafana

**Metrics Collected**:
- **Infrastructure**: CPU, Memory, Disk, Network per pod
- **Application**: Request rate, Error rate, Duration (RED metrics)
- **Business**: Orders/min, Revenue/hour, Table occupancy
- **Custom**: Queue length, Average wait time, Stock levels

**Dashboards**:
- Service Health Dashboard (CPU, memory, request latency)
- Business Metrics Dashboard (orders, revenue, popular dishes)
- Infrastructure Dashboard (node health, pod status)

#### 2. Logs (Nhật ký)
**Tool**: ELK Stack (Elasticsearch, Logstash, Kibana)

**Log Format** (Structured JSON):
```json
{
  "timestamp": "2026-02-21T10:30:45.123Z",
  "level": "INFO",
  "service": "ordering-service",
  "traceId": "abc-123-xyz",
  "message": "Order placed successfully",
  "orderId": "ORD-001234",
  "userId": "user-456"
}
```

**Log Levels**:
- **ERROR**: Critical issues requiring immediate attention
- **WARN**: Potential problems (e.g., high latency)
- **INFO**: Important business events (order placed, completed)
- **DEBUG**: Detailed troubleshooting information
- **TRACE**: Very verbose debugging (disabled in production)

#### 3. Traces (Truy vết)
**Tool**: Jaeger (Distributed Tracing)

**Trace Example**: Order Placement
```
Trace ID: abc-123-xyz (total: 450ms)
├── Tablet App (200ms)
├── API Gateway (30ms)
├── Ordering Service (190ms)
│   ├── Database Write (80ms)
│   └── Event Publish (50ms)
├── Event Bus (30ms)
└── Kitchen Service (170ms)
    └── WebSocket Push (20ms)
```

### Alerting Rules / Quy tắc Cảnh báo

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| **HighOrderLatency** | P95 > 2s for 5 min | WARNING | Investigate queue |
| **ServiceDown** | 0 healthy pods | CRITICAL | Page on-call engineer |
| **HighPodCrashRate** | > 5 crashes in 10 min | CRITICAL | Rollback deployment |
| **HighMemoryUsage** | > 90% for 5 min | WARNING | Scale up or investigate leak |
| **KafkaConsumerLag** | Lag > 1000 messages | WARNING | Scale consumers |

### Testing Approach / Phương pháp Kiểm thử

**Observability Testing**:
```
1. Logging Test:
   - Trigger error → Verify appears in Kibana < 10 seconds
   - Search for traceId → Verify all related logs retrieved

2. Metrics Test:
   - Place 100 orders → Verify "orders/min" metric updated
   - Kill pod → Verify alert triggered within 2 minutes

3. Tracing Test:
   - Place order → Verify complete trace in Jaeger
   - Identify slowest span in trace

Success Criteria:
✅ All critical events logged
✅ Alerts triggered within SLA
✅ Traces show end-to-end request path
```

### Related Services / Dịch vụ Liên quan

- **ALL SERVICES**: Must emit logs, metrics, and traces

### Verification Evidence / Bằng chứng Xác minh

See: [Kubernetes Deployment Diagram](../diagrams/deployment/kubernetes-deployment.md) - Shows monitoring stack (Prometheus, Grafana, ELK, Jaeger)

---

## NFR Summary Table / Bảng Tóm tắt NFR

| NFR | Category | Priority | Target Metric | Verification |
|-----|----------|----------|---------------|--------------|
| **NFR1** | Performance | P0 | 100 orders/min sustained | Load testing |
| **NFR2** | Real-Time | P0 | < 1s order latency | Distributed tracing |
| **NFR3** | Availability | P1 | 99% uptime (business hours) | Uptime monitoring |
| **NFR4** | Reliability | P1 | 0% order loss, 100% consistency | Audit logs, chaos testing |
| **NFR5** | Security | P2 | 100% authentication, 0 breaches | Penetration testing |
| **NFR6** | Scalability | P2 | Auto-scale 2 → 10 replicas | HPA metrics |
| **NFR7** | Maintainability | P2 | > 70 maintainability index | SonarQube |
| **NFR8** | Observability | P2 | 30-day logs, 15s metrics | ELK + Prometheus |

---

## Cross-Cutting Concerns / Vấn đề Xuyên suốt

These concerns apply to all NFRs and services:

1. **Configuration Management**: Externalized config via ConfigMaps/Environment Variables
2. **Secret Management**: Kubernetes Secrets or HashiCorp Vault
3. **API Versioning**: Support `/api/v1`, `/api/v2` simultaneously
4. **Backward Compatibility**: Old clients continue working after updates
5. **Graceful Degradation**: System degrades functionality (not fails completely) under extreme load

---

## Traceability / Truy vết

All NFRs mapped to:
- **Architecture Characteristics**: See [Architecture Characteristics](../architecture/02-architecture-characteristics.md)
- **Functional Requirements**: See [Functional Requirements](functional-requirements.md)
- **Architecture Decisions**: See [Traceability Matrix](traceability-matrix.md)
- **Diagrams**: See links in each NFR section

---

**Last Updated**: 2026-02-21
**Status**: Complete - Ready for Implementation
**Next Steps**: Create traceability matrix linking NFRs to architecture
