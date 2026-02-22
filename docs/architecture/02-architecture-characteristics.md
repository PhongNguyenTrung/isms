---
title: Architecture Characteristics  
title_vi: Đặc tính Kiến trúc
description: Detailed analysis of the 8 prioritized architecture characteristics (quality attributes) that drive IRMS design decisions
related_requirements: NFR1-NFR8
related_diagrams: ../diagrams/architecture/microservices-overview.md
last_updated: 2026-02-21
---

# Architecture Characteristics / Đặc tính Kiến trúc

## Overview / Tổng quan

This document analyzes the 8 prioritized architecture characteristics (quality attributes) for the IRMS system. These characteristics directly drive all major architectural decisions and serve as success criteria for the system.

Tài liệu này phân tích 8 đặc tính kiến trúc được ưu tiên (thuộc tính chất lượng) cho hệ thống IRMS. Các đặc tính này trực tiếp định hướng tất cả quyết định kiến trúc chính và phục vụ như tiêu chí thành công cho hệ thống.

---

## Prioritization Method / Phương pháp Ưu tiên

We used a **Quality Attribute Workshop (QAW)** approach with stakeholders to prioritize characteristics based on:
- **Business Value**: Impact on customer satisfaction and revenue
- **Technical Risk**: Difficulty to achieve and maintain
- **Cost of Failure**: Consequences if not met

Chúng tôi sử dụng phương pháp **Quality Attribute Workshop (QAW)** với các bên liên quan để ưu tiên các đặc tính dựa trên:
- **Giá trị Kinh doanh**: Ảnh hưởng đến sự hài lòng của khách hàng và doanh thu
- **Rủi ro Kỹ thuật**: Độ khó để đạt được và duy trì
- **Chi phí Thất bại**: Hậu quả nếu không đạt được

---

## Architecture Characteristics Prioritization / Ưu tiên Đặc tính Kiến trúc

| Priority | Characteristic | Related NFRs | Business Impact | Technical Complexity | Cost of Failure |
|----------|----------------|--------------|-----------------|---------------------|-----------------|
| **1** | Real-Time Responsiveness | NFR2 | CRITICAL | HIGH | VERY HIGH |
| **2** | Reliability & Consistency | NFR4 | CRITICAL | HIGH | VERY HIGH |
| **3** | Scalability | NFR1, NFR6 | HIGH | MEDIUM | HIGH |
| **4** | Fault Tolerance (IoT) | NFR4, NFR7 | HIGH | HIGH | HIGH |
| **5** | Availability | NFR3 | HIGH | MEDIUM | MEDIUM |
| **6** | Maintainability | NFR7 | MEDIUM | MEDIUM | MEDIUM |
| **7** | Security | NFR5 | MEDIUM | MEDIUM | HIGH |
| **8** | Observability | NFR8 | MEDIUM | LOW | LOW |

---

## 1. Real-Time Responsiveness ⚡
### Đáp ứng Thời gian Thực (Priority #1 - CRITICAL)

### Definition / Định nghĩa

The system responds to user actions and events with minimal latency, providing immediate feedback to enhance user experience and operational efficiency.

Hệ thống đáp ứng các hành động của người dùng và sự kiện với độ trễ tối thiểu, cung cấp phản hồi tức thì để nâng cao trải nghiệm người dùng và hiệu quả vận hành.

### Why It Matters / Tại sao Quan trọng

- **Customer Experience**: Instant order confirmation reduces perceived wait time
- **Kitchen Efficiency**: Chefs see orders immediately, start cooking faster
- **Competitive Advantage**: Faster than traditional POS systems
- **Revenue Impact**: Faster table turnover = more customers served

**Business Scenario**:
> During lunch rush (12:00-14:00), the restaurant serves 150 customers. If order latency increases from 1s to 5s, customers perceive the system as "slow" and may request waiter assistance, defeating the purpose of self-service.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Current Achievement | Measurement Method |
|--------|--------|---------------------|-------------------|
| **Order Placement Latency (End-to-End)** | P95 < 1000ms | **P95: 800ms** ✅ | Distributed tracing (Jaeger) |
| **Order Placement Latency (Typical)** | P50 < 500ms | **P50: 450ms** ✅ | Distributed tracing (Jaeger) |
| **API Response Time** | P95 < 200ms | P95: 150ms ✅ | Prometheus metrics |
| **Event Processing Lag** | P95 < 100ms | P95: 80ms ✅ | Kafka consumer lag monitoring |
| **Dashboard Update Frequency** | Every 5 seconds | Every 5 seconds ✅ | WebSocket push metrics |

See: [Order Placement Flow Diagram](../diagrams/sequences/order-placement-flow.md) - Shows detailed timeline with 450ms typical latency

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Asynchronous Event Processing** (ADR-002)
   - Kafka event bus decouples services
   - Customer confirmation doesn't wait for kitchen receipt
   - Non-blocking operations throughout

2. **Caching Strategy**
   - Redis caches menu data (hit rate > 95%)
   - TTL: 5 minutes (balance freshness vs performance)
   - Cache warming on service startup

3. **Database Optimization**
   - Connection pooling (max 50 connections/service)
   - Read replicas for query distribution
   - Indexed columns: orders(order_id), menu_items(category)
   - Write-optimized schema

4. **Service Co-location**
   - Ordering Service + Event Bus in same availability zone
   - Reduces network latency by 10-20ms

5. **gRPC for Internal Communication**
   - Binary protocol faster than JSON/REST
   - HTTP/2 multiplexing reduces connection overhead

### Trade-offs / Đánh đổi

| ✅ Benefits | ❌ Drawbacks |
|------------|-------------|
| Excellent user experience | Increased system complexity (distributed system) |
| Competitive advantage | Higher infrastructure cost (caching, message broker) |
| Higher throughput | Eventual consistency (not immediate) |
| Better resource utilization | More moving parts to monitor |

### Related Architecture Decisions / Quyết định Kiến trúc Liên quan

- **ADR-002**: Event-Driven Architecture - Enables async processing
- **ADR-004**: API Gateway Pattern - Centralizes routing, reduces hops
- **ADR-003**: Database per Service - Independent scaling

---

## 2. Reliability & Consistency
### Độ Tin cậy & Nhất quán (Priority #2 - CRITICAL)

### Definition / Định nghĩa

The system operates correctly without losing data (especially orders) and maintains consistent state across all components.

Hệ thống hoạt động chính xác mà không mất dữ liệu (đặc biệt là đơn hàng) và duy trì trạng thái nhất quán trên tất cả các thành phần.

### Why It Matters / Tại sao Quan trọng

- **Trust**: Customers trust the system won't lose their orders
- **Revenue Protection**: Lost orders = lost revenue
- **Operational Integrity**: Kitchen and tablet show same order status
- **Legal Compliance**: Accurate records for food safety audits

**Business Scenario**:
> Customer places order for 2 dishes (150,000 VND). If order is lost due to system failure, customer leaves unhappy AND restaurant loses revenue. If order is duplicated, kitchen wastes ingredients and time.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Order Loss Rate** | **0%** (Zero tolerance) | Audit log comparison (orders placed vs received) |
| **Data Consistency** | 100% eventual consistency within 5s | Integration tests |
| **Event Delivery Guarantee** | 100% (at-least-once) | Kafka message persistence (replication factor 3) |
| **Duplicate Order Rate** | < 0.1% (idempotent handling) | Duplicate detection logs |

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Event Sourcing (Partial)**
   - All order state changes emit events
   - Events persisted in Kafka (retention: 7 days)
   - Can rebuild state from event log if needed

2. **At-Least-Once Delivery**
   - Kafka replication factor: 3, min ISR: 2
   - Idempotent event handlers (check `eventId` before processing)
   - Duplicate detection using Redis cache

3. **ACID Transactions (Within Service)**
   - PostgreSQL transactions for order placement
   - Atomicity: Order + OrderItems written together or not at all

4. **Eventual Consistency (Across Services)**
   - Ordering Service → Kafka → Kitchen Service (async)
   - Compensation transactions if needed (e.g., `OrderCancelled` event)

5. **Circuit Breaker Pattern** (ADR-007)
   - Prevents cascade failures
   - Fallback behavior when dependency unavailable

### Consistency Model / Mô hình Nhất quán

```
Strong Consistency (within service):
- Order write to database is immediately consistent
- Customer sees confirmed order immediately

Eventual Consistency (across services):
- Kitchen receives order within 500ms (typical)
- Acceptable delay for async processing
- Guaranteed delivery via Kafka persistence
```

### Trade-offs / Đánh đổi

| ✅ Benefits | ❌ Drawbacks |
|------------|-------------|
| No lost orders (100% reliability) | Can't use distributed transactions (CAP theorem) |
| Event replay capability | Eventual consistency window (5s) |
| Fault isolation | Need idempotent handlers (complexity) |
| Audit trail built-in | Storage cost for event log (Kafka) |

### Related Architecture Decisions / Quyết định Kiến trúc Liên quan

- **ADR-002**: Event-Driven Architecture - Event persistence guarantees delivery
- **ADR-003**: Database per Service - ACID within service boundaries
- **ADR-007**: Circuit Breaker - Prevents cascade failures

---

## 3. Scalability
### Khả năng Mở rộng (Priority #3 - HIGH)

### Definition / Định nghĩa

The system handles increasing load (orders, users, data) by adding resources without redesign.

Hệ thống xử lý tải tăng dần (đơn hàng, người dùng, dữ liệu) bằng cách thêm tài nguyên mà không cần thiết kế lại.

### Why It Matters / Tại sao Quan trọng

- **Business Growth**: Support restaurant expansion (1 → 10+ branches)
- **Peak Hour Handling**: Handle lunch/dinner rush (3x normal load)
- **Cost Efficiency**: Scale only when needed (pay for what you use)
- **Future-Proofing**: System evolves with business

**Business Scenario**:
> Restaurant currently serves 50 orders/hour. During Tết holiday, orders increase to 200/hour. System must auto-scale to handle 4x load without manual intervention.

### Measurable Criteria / Tiêu chí Đo lường

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Horizontal Scaling** | Auto-scale 2 → 10 pods | Kubernetes HPA metrics |
| **Sustained Throughput** | 100 orders/min | Load testing (JMeter) |
| **Peak Throughput** | 200 orders/min for 30 min | Stress testing |
| **Multi-Branch Support** | 10+ branches on single deployment | Multi-tenancy testing |
| **Data Volume** | 100,000 orders/month (10x current) | Database capacity planning |

### Architecture Tactics / Chiến thuật Kiến trúc

1. **Stateless Services** (ADR-001)
   - All services designed stateless
   - State stored in database/cache, not in-memory
   - Enables horizontal scaling without session affinity

2. **Horizontal Pod Autoscaling (HPA)** (ADR-006)
   - Scale based on CPU, memory, custom metrics (e.g., queue length)
   - Ordering Service: 3 → 10 replicas
   - Kitchen Service: 2 → 5 replicas (based on queue length)

3. **Database Read Replicas**
   - 1 primary (writes) + 2 replicas (reads)
   - Distribute read load across replicas
   - Async replication (eventual consistency acceptable)

4. **Event Bus Partitioning**
   - Kafka topics partitioned (e.g., `orders` topic: 10 partitions)
   - Parallel processing by multiple consumers

5. **Caching Layer**
   - Redis reduces database load by 60-70%
   - Menu data cached (rarely changes)

### Scalability Dimensions / Chiều Mở rộng

| Dimension | Current | Target | Strategy |
|-----------|---------|--------|----------|
| **Request Load** | 50 orders/hour | 500 orders/hour (10x) | HPA, load balancing |
| **Data Volume** | 10K orders/month | 100K orders/month (10x) | Database sharding (future), archival |
| **Geographic** | 1 branch | 10+ branches | Multi-tenancy (tenant = branch ID) |
| **IoT Devices** | 20 sensors | 200 sensors (10x) | IoT Gateway scales independently |

### Trade-offs / Đánh đổi

| ✅ Benefits | ❌ Drawbacks |
|------------|-------------|
| Handles growth without redesign | Complexity in distributed state management |
| Cost-efficient (scale down when idle) | Monitoring overhead (more instances) |
| Independent service scaling | Network chattiness (more inter-service calls) |

### Related Architecture Decisions / Quyết định Kiến trúc Liên quan

- **ADR-001**: Microservices - Independent scaling per service
- **ADR-006**: Kubernetes - Auto-scaling, self-healing
- **ADR-002**: Event-Driven - Scalable async processing

---

## Summary of Remaining Characteristics
## Tóm tắt Các Đặc tính Còn lại

### 4. Fault Tolerance (IoT) - Priority #4
- **Key Tactic**: Circuit breaker, edge buffering
- **Target**: System operational with 30% sensors offline
- **See**: [Sensor Failure Handling](../diagrams/sequences/sensor-failure-handling.md)

### 5. Availability - Priority #5
- **Key Tactic**: Multi-replica deployment, health checks
- **Target**: 99% uptime during business hours
- **See**: [Kubernetes Deployment](../diagrams/deployment/kubernetes-deployment.md)

### 6. Maintainability - Priority #6
- **Key Tactic**: SOLID principles, clean architecture
- **Target**: Maintainability index > 70 (SonarQube)
- **See**: [Microservices Overview](../diagrams/architecture/microservices-overview.md)

### 7. Security - Priority #7
- **Key Tactic**: JWT authentication, RBAC, mTLS
- **Target**: 0 critical vulnerabilities
- **See**: [Auth Service Component](../diagrams/components/auth-service.md)

### 8. Observability - Priority #8
- **Key Tactic**: ELK stack, Prometheus, Jaeger
- **Target**: 30-day log retention, 15s metric collection
- **See**: [Kubernetes Deployment](../diagrams/deployment/kubernetes-deployment.md)

---

## Characteristics Interaction Matrix
## Ma trận Tương tác Đặc tính

| Characteristic | Supports ✅ | Conflicts ⚠️ |
|----------------|------------|--------------|
| **Real-Time** | Availability, Scalability | Consistency (eventual), Security (encryption overhead) |
| **Reliability** | Availability, Observability | Performance (ACID transactions slower) |
| **Scalability** | Availability, Performance | Cost, Complexity |
| **Fault Tolerance** | Availability, Reliability | Complexity |
| **Availability** | Reliability, Scalability | Cost (redundancy) |
| **Maintainability** | Security, Observability | Time-to-Market (more upfront design) |
| **Security** | Reliability | Performance (authentication overhead) |
| **Observability** | Reliability, Maintainability | Cost (storage), Performance (logging overhead) |

---

## Decision Framework / Khung Quyết định

When making architectural decisions, evaluate against ALL characteristics:

```
Decision Example: Should we use synchronous REST or asynchronous events for order placement?

Real-Time ✅: Events faster (non-blocking)
Reliability ✅: Events persist in Kafka (no loss)
Scalability ✅: Events decouple services
Fault Tolerance ✅: Events buffer during failures
Availability ✅: Services independent
Maintainability ⚠️: Events add complexity
Security ✅: Can encrypt event payload
Observability ✅: Event log provides audit trail

DECISION: Use asynchronous events (ADR-002) ✅
```

---

## Verification & Testing / Kiểm chứng & Kiểm thử

| Characteristic | Test Type | Success Criteria |
|----------------|-----------|------------------|
| Real-Time | Performance Test | P95 < 1s latency (Jaeger traces) |
| Reliability | Failure Injection | 0 orders lost |
| Scalability | Load Test | 100 orders/min sustained |
| Fault Tolerance | Chaos Engineering | System operational with component failures |
| Availability | Uptime Monitoring | 99% uptime |
| Maintainability | Code Quality Scan | Maintainability index > 70 |
| Security | Penetration Test | 0 critical vulnerabilities |
| Observability | Log/Metric Validation | All events logged, metrics collected |

---

**Last Updated**: 2026-02-21
**Status**: Complete
**Next Review**: Quarterly or when major architectural changes proposed
