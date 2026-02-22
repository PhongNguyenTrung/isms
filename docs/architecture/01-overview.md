# Architecture Overview
# Tổng quan Kiến trúc

**Project**: IRMS - Intelligent Restaurant Management System
**Last Updated**: 2026-02-21
**Status**: Design Complete, Implementation Pending

---

## Table of Contents / Mục lục

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [Architecture Vision](#architecture-vision)
4. [Key Architecture Decisions](#key-architecture-decisions)
5. [Architecture Characteristics](#architecture-characteristics)
6. [High-Level Architecture](#high-level-architecture)
7. [Service Decomposition](#service-decomposition)
8. [Communication Patterns](#communication-patterns)
9. [Data Architecture](#data-architecture)
10. [Deployment Strategy](#deployment-strategy)
11. [Security Architecture](#security-architecture)
12. [Quality Attributes](#quality-attributes)
13. [Risks & Mitigation](#risks--mitigation)
14. [Evolution & Roadmap](#evolution--roadmap)

---

## Executive Summary
## Tóm tắt Tổng quan

The Intelligent Restaurant Management System (IRMS) is designed as a **cloud-native, event-driven microservices platform** to modernize restaurant operations through IoT integration and real-time processing.

Hệ thống Quản lý Nhà hàng Thông minh (IRMS) được thiết kế như một **nền tảng microservices hướng sự kiện, cloud-native** để hiện đại hóa hoạt động nhà hàng thông qua tích hợp IoT và xử lý thời gian thực.

### Key Highlights / Điểm nổi bật

- **7 Microservices** for modularity and independent scaling
- **Event-Driven Architecture** for real-time responsiveness (< 1 second)
- **IoT Gateway Layer** for 100+ device management
- **Database per Service** for data autonomy and fault isolation
- **Cloud-Native Deployment** on Kubernetes for high availability

### Business Value / Giá trị Kinh doanh

| Benefit | Impact |
|---------|--------|
| **Faster Service** | Orders reach kitchen in < 1 second (vs. 5+ minutes manual) |
| **Reduced Errors** | Automated order routing eliminates human mistakes |
| **Better Inventory** | IoT sensors prevent stockouts and reduce waste by 30% |
| **Data-Driven Decisions** | Real-time analytics optimize staffing and menu |
| **Scalability** | Support multiple restaurant locations from single platform |

---

## Business Context
## Bối cảnh Kinh doanh

### Problem Statement / Vấn đề

Traditional restaurant operations face several challenges:

1. **Slow Order Processing**: Manual order taking → kitchen delays → long customer wait times
2. **High Error Rates**: Handwriting mistakes, lost order slips, wrong items delivered
3. **Poor Kitchen Coordination**: No visibility into order queue during peak hours
4. **Inventory Issues**: Manual stock tracking leads to waste or shortages
5. **Lack of Insights**: No data to optimize operations or predict demand

### Business Drivers / Động lực Kinh doanh

1. **Improve Customer Experience**: Reduce wait times, increase accuracy
2. **Increase Operational Efficiency**: Automate manual processes
3. **Reduce Costs**: Minimize food waste, optimize labor
4. **Enable Growth**: Scale to multiple locations without proportional staff increase
5. **Competitive Advantage**: Differentiate with technology-enabled service

### Target Users / Người dùng Mục tiêu

- **Customers**: 80% of diners prefer self-service ordering (market research)
- **Restaurant Owners**: 50-200 seat restaurants seeking to modernize
- **Geographic**: Vietnam market initially, expansion to Southeast Asia

---

## Architecture Vision
## Tầm nhìn Kiến trúc

### Vision Statement

*"Build a cloud-native, IoT-enabled restaurant management platform that delivers real-time ordering, intelligent kitchen coordination, and data-driven insights while maintaining high availability and security."*

*"Xây dựng nền tảng quản lý nhà hàng tích hợp IoT, cloud-native, cung cấp đặt món thời gian thực, điều phối bếp thông minh và phân tích dựa trên dữ liệu với độ sẵn sàng và bảo mật cao."*

### Design Philosophy / Triết lý Thiết kế

1. **Modularity over Monolith**: Decompose into independent services
2. **Async over Sync**: Prefer event-driven for loose coupling
3. **Resilience by Design**: Assume failures will happen
4. **Data Autonomy**: Each service owns its data
5. **Observability First**: Built-in monitoring and tracing
6. **Security by Default**: Authentication, authorization, encryption

---

## Key Architecture Decisions
## Các Quyết định Kiến trúc Chính

### ADR-001: Microservices Architecture

**Decision**: Decompose IRMS into 7 independent microservices

**Rationale**:
- ✅ **Independent Scaling**: Scale Ordering Service separately during lunch rush
- ✅ **Fault Isolation**: Kitchen Service failure doesn't crash Inventory Service
- ✅ **Technology Flexibility**: Use best tool per service (PostgreSQL, InfluxDB, etc.)
- ✅ **Team Autonomy**: Small teams own end-to-end services
- ✅ **Faster Deployment**: Deploy services independently without system downtime

**Alternatives Considered**:
- **Monolithic Architecture**: ❌ Hard to scale, single point of failure
- **Layered Architecture**: ❌ Doesn't support IoT integration well

**Consequences**:
- ⚠️ Increased operational complexity (more services to manage)
- ⚠️ Distributed system challenges (network latency, partial failures)
- ⚠️ Need for service discovery and API gateway

**Status**: ✅ Accepted

---

### ADR-002: Event-Driven Architecture

**Decision**: Use asynchronous event-driven communication via Kafka

**Rationale**:
- ✅ **Real-Time Updates**: Events propagate in milliseconds (meets NFR2)
- ✅ **Loose Coupling**: Publishers don't know subscribers (add features easily)
- ✅ **Fault Tolerance**: Events buffered when services unavailable
- ✅ **Scalability**: Add consumers without changing producers
- ✅ **Audit Trail**: Event log provides complete system history

**Alternatives Considered**:
- **Synchronous REST only**: ❌ Tight coupling, cascading failures
- **RabbitMQ**: ❌ Lower throughput than Kafka, no event replay

**Consequences**:
- ⚠️ Eventual consistency (not immediate)
- ⚠️ Complex debugging across services
- ⚠️ Need for event schema management

**Status**: ✅ Accepted

---

### ADR-003: Database per Service Pattern

**Decision**: Each microservice owns its database (no shared database)

**Rationale**:
- ✅ **Data Autonomy**: Services control their schema evolution
- ✅ **Independent Scaling**: Scale databases per service needs
- ✅ **Fault Isolation**: Database failure contained to one service
- ✅ **Technology Choice**: Use SQL for some, NoSQL for others

**Alternatives Considered**:
- **Shared Database**: ❌ Creates coupling, single point of failure
- **Database per Aggregate**: ❌ Too fine-grained for this system

**Consequences**:
- ⚠️ No ACID transactions across services
- ⚠️ Data duplication across services
- ⚠️ Complex queries spanning services

**Status**: ✅ Accepted

---

### ADR-004: IoT Gateway Layer

**Decision**: Create dedicated IoT Gateway Service for device management

**Rationale**:
- ✅ **Protocol Translation**: Handle MQTT, HTTP from diverse devices
- ✅ **Buffering**: Store data when cloud unavailable (edge resilience)
- ✅ **Security**: Authenticate devices before allowing access
- ✅ **Scalability**: Support 100+ devices per restaurant

**Alternatives Considered**:
- **Direct Device-to-Service**: ❌ Exposes services to insecure devices
- **Third-party IoT Platform**: ❌ Vendor lock-in, higher cost

**Consequences**:
- ⚠️ Additional infrastructure to manage
- ⚠️ Single point of failure for IoT (mitigated by edge buffering)

**Status**: ✅ Accepted

---

### ADR-005: API Gateway Pattern

**Decision**: Single entry point for all client requests

**Rationale**:
- ✅ **Centralized Auth**: Validate JWT tokens in one place
- ✅ **Routing**: Direct requests to appropriate services
- ✅ **Cross-Cutting Concerns**: Rate limiting, logging, caching
- ✅ **API Versioning**: Support multiple API versions

**Alternatives Considered**:
- **Direct Client-to-Service**: ❌ Exposes internal services, complex client logic
- **Backend for Frontend (BFF)**: ❌ Overkill for this system

**Consequences**:
- ⚠️ Potential bottleneck (mitigated by horizontal scaling)
- ⚠️ Single point of failure (mitigated by redundancy)

**Status**: ✅ Accepted

---

## Architecture Characteristics
## Đặc tính Kiến trúc

Following the Architecture Kata methodology, we identified critical success criteria:

### Priority 1: Real-Time Responsiveness ⚡
**Definition**: Order placement from customer to kitchen in < 1 second

**How Achieved**:
- Event-driven architecture for async processing
- Optimized database writes with connection pooling
- Kafka for high-throughput message delivery
- WebSocket for instant kitchen display updates

**Measurement**: P95 latency < 1000ms (target: 500ms)

---

### Priority 2: Reliability & Consistency 🛡️
**Definition**: Zero lost orders, consistent state across services

**How Achieved**:
- Persistent event log in Kafka (durability)
- Idempotent event handlers (handle duplicates)
- Database transactions with ACID guarantees
- Retry mechanisms with exponential backoff

**Measurement**: 99.9% order success rate

---

### Priority 3: Scalability 📈
**Definition**: Handle 10x load increase without redesign

**How Achieved**:
- Horizontal scaling of microservices
- Stateless services (scale by adding instances)
- Database read replicas for query load
- Kafka partitioning for parallel processing

**Measurement**: Support 1000+ concurrent orders

---

### Priority 4: Fault Tolerance (IoT) 🔧
**Definition**: System continues operating despite IoT device failures

**How Achieved**:
- IoT Gateway buffering at edge
- Retry logic with exponential backoff
- Circuit breakers to prevent cascade failures
- Graceful degradation (core features work without IoT)

**Measurement**: 99.5% uptime despite 10% device failure rate

---

### Priority 5: Availability 🌐
**Definition**: System operational 99.9% during business hours

**How Achieved**:
- Multi-instance deployment (no single point of failure)
- Kubernetes auto-restart failed pods
- Database failover to standby replicas
- Geographic redundancy (future)

**Measurement**: < 5 minutes downtime per month

---

### Priority 6: Maintainability 🔨
**Definition**: Easy to add features, fix bugs, update services

**How Achieved**:
- Small, focused services (< 2000 LOC each)
- Clear service boundaries (domain-driven design)
- Comprehensive documentation and diagrams
- Automated testing (unit, integration, E2E)

**Measurement**: New feature in < 2 weeks

---

### Priority 7: Security 🔐
**Definition**: Protect customer data, prevent unauthorized access

**How Achieved**:
- JWT authentication for all API requests
- Role-based access control (RBAC)
- TLS encryption in transit
- Secrets management (Vault, AWS Secrets Manager)
- Device certificates for IoT

**Measurement**: Zero security breaches

---

### Priority 8: Observability 👁️
**Definition**: Quickly diagnose and resolve production issues

**How Achieved**:
- Distributed tracing (Jaeger) with correlation IDs
- Centralized logging (ELK stack)
- Real-time metrics (Prometheus + Grafana)
- Alerting for critical issues (PagerDuty)

**Measurement**: Mean Time To Resolution (MTTR) < 15 minutes

---

## High-Level Architecture
## Kiến trúc Tổng thể

See visual diagram: [Microservices Overview](../diagrams/architecture/microservices-overview.md)

### Layered View

```
┌─────────────────────────────────────────────────────────────┐
│              Presentation Layer / Lớp Giao diện              │
│  Tablet App    Kitchen Display    Manager Dashboard   IoT   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  API Layer / Lớp API                         │
│                    API Gateway                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            Application Layer / Lớp Ứng dụng                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Ordering    │  │   Kitchen    │  │  Inventory   │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Notification │  │  Analytics   │  │    Auth      │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│          Infrastructure Layer / Lớp Hạ tầng                  │
│        Event Bus (Kafka)     IoT Gateway Service             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Data Layer / Lớp Dữ liệu                        │
│  Order DB  Kitchen DB  Inventory DB  User DB  Analytics DW  │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Decomposition
## Phân rã Dịch vụ

See visual diagram: [Microservices Overview](../diagrams/architecture/microservices-overview.md)

### 1. Customer Ordering Service 📝

**Responsibility**: Handle customer order placement and menu management

**Key Functions**:
- Display digital menu with photos, prices, descriptions
- Validate order items (availability, pricing)
- Categorize dishes (main, beverage, dessert)
- Persist order to database
- Publish `OrderPlaced` event

**Technology**:
- Language: Java/Spring Boot or Node.js
- Database: PostgreSQL (relational for ACID)
- Cache: Redis for menu caching

**Scaling**: High (5+ instances during lunch/dinner)

---

### 2. Kitchen Management Service 🍳

**Responsibility**: Coordinate kitchen operations and order queue

**Key Functions**:
- Receive `OrderPlaced` events
- Calculate order priority (complexity, wait time, load)
- Manage kitchen queue (FIFO with priority adjustments)
- Send orders to Kitchen Display System (WebSocket)
- Update order status (InProgress, Completed)
- Detect kitchen overload and alert

**Technology**:
- Language: Java/Spring Boot (for queue management)
- Database: PostgreSQL (order queue state)
- Cache: Redis for real-time queue

**Scaling**: High (3+ instances during peak)

---

### 3. Inventory Monitoring Service 📦

**Responsibility**: Track ingredient levels via IoT sensors

**Key Functions**:
- Receive sensor data from IoT Gateway
- Store time-series inventory data
- Calculate current stock levels
- Detect low inventory (threshold alerts)
- Publish `InventoryLow` event
- Deduct ingredients when orders placed (future)

**Technology**:
- Language: Python or Go
- Database: InfluxDB (time-series for sensor data)
- Cache: Redis for current levels

**Scaling**: Medium (2 instances)

---

### 4. Notification & Alert Service 🔔

**Responsibility**: Send multi-channel notifications

**Key Functions**:
- Subscribe to all alert events
- Send push notifications to tablets
- Send SMS alerts (Twilio)
- Send email alerts (SendGrid)
- Prioritize critical vs. informational alerts

**Technology**:
- Language: Node.js (async I/O for notifications)
- Database: None (stateless)
- Queue: Redis for retry queue

**Scaling**: Medium (2 instances)

---

### 5. Analytics & Forecasting Service 📊

**Responsibility**: Provide business intelligence and predictions

**Key Functions**:
- Subscribe to all events (data aggregation)
- Calculate real-time metrics (orders/hour, revenue)
- Generate reports (daily, weekly, monthly)
- Predict busy periods (ML model)
- Recommend menu optimizations
- Power manager dashboard

**Technology**:
- Language: Python (Pandas, Scikit-learn for ML)
- Database: Data Warehouse (Redshift or BigQuery)
- Cache: Redis for dashboard metrics

**Scaling**: Low (1-2 instances)

---

### 6. User & Access Management Service 🔐

**Responsibility**: Authentication and authorization

**Key Functions**:
- User login (staff, managers)
- Issue JWT tokens
- Validate tokens for API Gateway
- Role-based access control (RBAC)
- Manage user profiles

**Technology**:
- Language: Java/Spring Security or Node.js/Passport
- Database: PostgreSQL (user credentials, roles)
- Cache: Redis for token blacklist

**Scaling**: Medium (2 instances)

---

### 7. IoT Gateway Service 🌐

**Responsibility**: Manage IoT device connectivity

**Key Functions**:
- Handle MQTT/HTTP from devices
- Device authentication and registration
- Protocol translation (MQTT → Kafka events)
- Buffer data when cloud unavailable (edge resilience)
- Retry failed transmissions
- Monitor device health

**Technology**:
- Language: Go or Rust (high performance, low memory)
- Database: None (buffers to disk temporarily)
- Protocol: MQTT broker (Mosquitto)

**Scaling**: Medium (2 instances, edge deployment)

---

## Communication Patterns
## Mô hình Giao tiếp

See visual diagrams:
- [Event-Driven Architecture](../diagrams/architecture/event-driven-architecture.md)
- [Order Placement Sequence](../diagrams/sequences/order-placement-flow.md)

### Synchronous Communication (REST/gRPC)

**Use Cases**:
- Client queries (GET /api/menu)
- Commands requiring immediate response (POST /api/orders)
- Health checks and service discovery

**Pattern**:
```
Client → API Gateway → Service → Response
```

**Advantages**:
- Simple request-response
- Immediate feedback
- Easy error handling

**Disadvantages**:
- Tight coupling
- Cascading failures
- Blocking calls

---

### Asynchronous Communication (Events via Kafka)

**Use Cases**:
- State changes (OrderPlaced, OrderCompleted)
- Cross-service notifications
- Analytics and auditing

**Pattern**:
```
Service → Event Bus → Subscribed Service(s)
```

**Advantages**:
- Loose coupling (publishers don't know subscribers)
- Scalability (add subscribers without changing publisher)
- Fault tolerance (buffered messages)
- Audit trail (event log)

**Disadvantages**:
- Eventual consistency
- Complex debugging
- Message ordering challenges

---

### Key Events

| Event | Trigger | Payload | Subscribers |
|-------|---------|---------|-------------|
| `OrderPlaced` | Customer submits order | `{orderId, items[], tableId}` | Kitchen, Inventory, Analytics |
| `OrderInProgress` | Chef starts cooking | `{orderId, chefId, startTime}` | Notification, Analytics |
| `OrderCompleted` | Dish ready | `{orderId, completionTime}` | Notification, Analytics |
| `InventoryLow` | Stock below threshold | `{ingredientId, level}` | Notification, Analytics |
| `TemperatureAlert` | Sensor detects issue | `{sensorId, temp, location}` | Notification |

---

## Data Architecture
## Kiến trúc Dữ liệu

### Database per Service

Each microservice owns its database schema and data:

| Service | Database Type | Rationale |
|---------|---------------|-----------|
| **Ordering** | PostgreSQL | Relational for order integrity, ACID transactions |
| **Kitchen** | PostgreSQL | Queue state, relational queries |
| **Inventory** | InfluxDB | Time-series for sensor data, high write throughput |
| **User & Access** | PostgreSQL | User profiles, credentials, permissions |
| **Analytics** | Redshift/BigQuery | Data warehouse for OLAP queries |

### Data Consistency

**Approach**: Eventual consistency via events

**Example**:
```
1. Ordering Service creates order (consistent within service)
2. Publishes OrderPlaced event
3. Inventory Service eventually deducts stock (eventual consistency)
4. If order canceled, compensating transaction (IngredientRestored event)
```

**Trade-off**: Accept brief inconsistency for scalability and fault tolerance

---

### Data Replication

**Read Replicas**: For high-read services (menu queries)
**Cross-Region** (future): Replicate to other geographic regions
**Event Sourcing** (future): Rebuild state from event log

---

## Deployment Strategy
## Chiến lược Triển khai

See visual diagram: [Kubernetes Deployment](../diagrams/deployment/kubernetes-deployment.md) *(to be created in Phase 2)*

### Cloud-Native on Kubernetes

**Why Kubernetes**:
- ✅ Auto-scaling based on CPU/memory
- ✅ Self-healing (restart failed pods)
- ✅ Rolling updates (zero-downtime deployments)
- ✅ Service discovery and load balancing
- ✅ Secrets management

### Deployment Topology

```
┌─────────────────────────────────────────────────────────────┐
│                   Cloud (AWS/GCP/Azure)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Kubernetes Cluster                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │ Ordering    │  │  Kitchen    │  │ Inventory   │   │ │
│  │  │ Service x3  │  │ Service x2  │  │ Service x2  │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │       Kafka Cluster (3 brokers)                 │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────────────┐
│              Restaurant Edge Network                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tablets    │  │  IoT Gateway │  │ KDS Displays │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Environments

1. **Development**: Local Docker Compose
2. **Staging**: Kubernetes cluster (smaller instances)
3. **Production**: Kubernetes cluster (HA configuration)

---

## Security Architecture
## Kiến trúc Bảo mật

### 1. Authentication (Xác thực)

**JWT Tokens**:
- Issued by Auth Service after login
- Contains: userId, role, expiration (15 min)
- Validated by API Gateway on every request
- Refresh tokens for extended sessions (7 days)

### 2. Authorization (Phân quyền)

**RBAC Model**:
- **Customer**: View menu, place orders, track own orders
- **Waiter**: View all table orders, assist customers
- **Chef**: View kitchen queue, update order status
- **Manager**: All permissions + analytics + configuration

### 3. Service-to-Service Security

**Mutual TLS (mTLS)**:
- Services authenticate each other via certificates
- Encrypted communication between services
- Managed by service mesh (Istio/Linkerd)

### 4. IoT Device Security

**Device Certificates**:
- Each device has unique certificate
- Device authentication before data acceptance
- Revocation list for compromised devices

### 5. Data Security

**Encryption**:
- **In Transit**: TLS 1.3 for all external communication
- **At Rest**: Database encryption (AES-256)
- **Sensitive Fields**: Additional encryption for PII

### 6. API Security

**Rate Limiting**: 100 requests/minute per client
**IP Whitelisting**: Restrict admin endpoints
**Input Validation**: Prevent SQL injection, XSS
**CORS**: Restrict allowed origins

---

## Quality Attributes
## Thuộc tính Chất lượng

### Performance (Hiệu năng)

**Targets**:
- Order placement: < 1 second (P95)
- Menu loading: < 500ms
- Dashboard updates: < 2 seconds
- Database queries: < 200ms

**How Achieved**:
- Async processing via events
- Database indexing and connection pooling
- Redis caching for frequently accessed data
- CDN for static assets

---

### Scalability (Khả năng Mở rộng)

**Targets**:
- Support 1000+ concurrent customers
- Handle 500 orders/hour during peak
- 10x growth without redesign

**How Achieved**:
- Horizontal scaling (add more instances)
- Stateless services
- Database read replicas
- Kafka partitioning

---

### Availability (Tính Sẵn sàng)

**Target**: 99.9% uptime (< 45 minutes downtime/month)

**How Achieved**:
- Multi-instance deployment
- Health checks and auto-restart
- Database failover
- Geographic redundancy (future)

---

### Reliability (Độ Tin cậy)

**Target**: 99.9% order success rate

**How Achieved**:
- Persistent event log (Kafka)
- Idempotent event handlers
- Retry mechanisms
- Dead letter queue for failed events

---

## Risks & Mitigation
## Rủi ro & Giảm thiểu

### Risk 1: Kafka Cluster Failure
**Impact**: HIGH - No event processing, orders delayed
**Probability**: LOW
**Mitigation**:
- Deploy Kafka with 3+ brokers (quorum)
- Configure replication factor = 3
- Automatic leader election on broker failure
- Fallback to synchronous HTTP for critical paths

---

### Risk 2: API Gateway Bottleneck
**Impact**: HIGH - All client requests blocked
**Probability**: MEDIUM
**Mitigation**:
- Horizontal scaling (multiple gateway instances)
- Load balancer in front of gateway
- Cache frequent responses
- Circuit breaker to prevent overload

---

### Risk 3: Database Corruption
**Impact**: HIGH - Data loss
**Probability**: LOW
**Mitigation**:
- Automated backups (hourly incremental, daily full)
- Point-in-time recovery (PITR)
- Database replicas (primary + 2 replicas)
- Regular backup restoration tests

---

### Risk 4: IoT Device Compromise
**Impact**: MEDIUM - Fake sensor data, DDoS
**Probability**: MEDIUM
**Mitigation**:
- Device authentication (certificates)
- Rate limiting per device
- Anomaly detection (ML-based)
- Device whitelist/blacklist

---

### Risk 5: Slow Event Processing
**Impact**: MEDIUM - Delayed kitchen notifications
**Probability**: MEDIUM
**Mitigation**:
- Monitor Kafka consumer lag
- Auto-scale consumers based on lag
- Dedicated consumer groups per service
- Fallback to synchronous notification

---

## Evolution & Roadmap
## Tiến hóa & Lộ trình

### Phase 1: MVP (Months 1-3)
✅ Core ordering flow (Ordering, Kitchen services)
✅ Basic event-driven communication (Kafka)
✅ Authentication (Auth Service)
✅ Simple dashboard (Analytics basics)

### Phase 2: IoT Integration (Months 4-6)
- IoT Gateway Service
- Inventory Monitoring with sensors
- Temperature alerts
- Real-time inventory dashboard

### Phase 3: Advanced Features (Months 7-9)
- Notification Service (SMS, email)
- ML-based forecasting (Analytics)
- Customer loyalty program
- Multi-location support

### Phase 4: Optimization (Months 10-12)
- Performance tuning (< 500ms order placement)
- Geographic redundancy
- Advanced analytics (A/B testing)
- Mobile app for customers

### Future Enhancements
- AI chatbot for customer support
- Integration with delivery platforms
- Voice ordering (Alexa, Google)
- Blockchain for supply chain tracing

---

## Conclusion
## Kết luận

The IRMS architecture successfully balances multiple competing concerns:

✅ **Real-time performance** (< 1 second) via event-driven design
✅ **Scalability** via microservices and horizontal scaling
✅ **Reliability** via fault tolerance and retry mechanisms
✅ **Maintainability** via clear service boundaries and documentation
✅ **Security** via authentication, authorization, and encryption

By applying proven architectural patterns (microservices, event-driven, IoT gateway) and making deliberate trade-offs (eventual consistency for performance), IRMS provides a solid foundation for modern restaurant operations.

The architecture is designed to evolve:
- Add new services without disrupting existing ones
- Scale independently based on load
- Integrate new IoT devices easily
- Support multiple restaurant locations

This document should be read alongside the visual diagrams for complete understanding.

---

## References / Tham khảo

**Diagrams**:
- [System Context Diagram](../diagrams/context/system-context.md)
- [Microservices Overview](../diagrams/architecture/microservices-overview.md)
- [Event-Driven Architecture](../diagrams/architecture/event-driven-architecture.md)
- [Order Placement Sequence](../diagrams/sequences/order-placement-flow.md)

**Other Documentation**:
- [Main Report (Vietnamese)](../report.md)
- [Functional Requirements](../requirements/functional-requirements.md) *(to be created)*
- [Non-Functional Requirements](../requirements/non-functional-requirements.md) *(to be created)*

**External Resources**:
- Martin Fowler: Microservices Architecture
- Sam Newman: Building Microservices
- Chris Richardson: Microservices Patterns
- Apache Kafka Documentation

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Authors**: IRMS Architecture Team
**Status**: ✅ Complete
