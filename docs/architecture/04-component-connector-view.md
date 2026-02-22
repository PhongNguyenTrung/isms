---
title: Component & Connector View - Runtime Architecture
title_vi: Góc nhìn Component & Connector - Kiến trúc Runtime
description: Runtime interactions, communication patterns, and data flows between IRMS components
related_requirements: FR1-FR14, NFR2, NFR4, ADR-002, ADR-004, ADR-005
related_diagrams: ../diagrams/architecture/event-driven-architecture.md, ../diagrams/sequences/*.md
last_updated: 2026-02-21
---

# Component & Connector View - Runtime Architecture
# Góc nhìn Component & Connector - Kiến trúc Runtime

**Project**: IRMS - Intelligent Restaurant Management System
**Last Updated**: 2026-02-21
**Status**: Design Complete

---

## Table of Contents / Mục lục

1. [Introduction](#introduction)
2. [Component Catalog](#component-catalog)
3. [Connector Types](#connector-types)
4. [Communication Patterns](#communication-patterns)
5. [Synchronous Interactions](#synchronous-interactions)
6. [Asynchronous Event Flows](#asynchronous-event-flows)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Runtime Constraints](#runtime-constraints)
9. [Performance Characteristics](#performance-characteristics)
10. [Failure Scenarios](#failure-scenarios)

---

## Introduction
## Giới thiệu

### Purpose / Mục đích

The **Component & Connector (C&C) View** describes the runtime architecture of IRMS, focusing on:

Góc nhìn Component & Connector mô tả kiến trúc runtime của IRMS, tập trung vào:

- **Components**: Runtime elements (services, brokers, gateways, clients)
- **Connectors**: Communication mechanisms (REST, events, WebSocket, MQTT)
- **Data Flows**: How information moves through the system
- **Interactions**: Request-response, pub-sub, streaming patterns
- **Quality Attributes**: How communication supports real-time responsiveness, reliability, scalability

### Architectural Style / Phong cách Kiến trúc

**Event-Driven Microservices Architecture** with:

- **Synchronous Communication**: REST/gRPC for request-response interactions
- **Asynchronous Communication**: Kafka event bus for pub-sub messaging
- **Real-Time Updates**: WebSocket for live kitchen displays and dashboards
- **IoT Protocol**: MQTT for lightweight device communication

See also:
- [Event-Driven Architecture Diagram](../diagrams/architecture/event-driven-architecture.md)
- [Module View](03-module-view.md) for static service decomposition

---

## Component Catalog
## Danh mục Component

### Runtime Components / Các Component Runtime

IRMS runtime architecture consists of the following component types:

#### 1. Client Components / Client Components

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| **Tablet App** | Web/Mobile | React Native | Customer ordering interface |
| **Kitchen Display System (KDS)** | Web | React + WebSocket | Real-time order display for chefs |
| **Manager Dashboard** | Web | React + REST API | Analytics and operational monitoring |
| **IoT Sensors** | Hardware | MQTT client | Temperature, weight sensors |

#### 2. Gateway Components / Gateway Components

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| **API Gateway** | Infrastructure | Kong/Nginx | Single entry point, routing, auth validation |
| **IoT Gateway** | Edge Service | Go + Mosquitto MQTT | Device connectivity, protocol translation |

#### 3. Backend Service Components / Backend Service Components

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| **Ordering Service** | Microservice | Java/Spring Boot | Order placement and validation |
| **Kitchen Service** | Microservice | Java/Spring Boot | Kitchen queue management |
| **Inventory Service** | Microservice | Python/FastAPI | Stock monitoring from sensors |
| **Notification Service** | Microservice | Node.js/Express | Multi-channel notifications |
| **Analytics Service** | Microservice | Python/FastAPI | Business intelligence and ML |
| **Auth Service** | Microservice | Java/Spring Security | Authentication and authorization |

#### 4. Infrastructure Components / Infrastructure Components

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| **Event Bus** | Message Broker | Apache Kafka | Event distribution and buffering |
| **Cache Layer** | In-Memory DB | Redis | Session storage, menu caching |
| **Service Mesh** (future) | Infrastructure | Istio/Linkerd | Service-to-service security, observability |

#### 5. Data Store Components / Data Store Components

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| **Ordering DB** | RDBMS | PostgreSQL | Order and menu data |
| **Kitchen DB** | RDBMS | PostgreSQL | Kitchen queue state |
| **Inventory DB** | Time-Series DB | InfluxDB | Sensor readings |
| **Auth DB** | RDBMS | PostgreSQL | User credentials, roles |
| **Analytics DW** | Data Warehouse | BigQuery/Redshift | Aggregated analytics data |

---

## Connector Types
## Các Loại Connector

### Overview / Tổng quan

IRMS uses **5 types of connectors** for component communication:

| Connector Type | Protocol | Pattern | Use Case | Latency |
|----------------|----------|---------|----------|---------|
| **REST API** | HTTP/HTTPS | Request-Response | Synchronous queries/commands | 50-200ms |
| **Event Stream** | Kafka | Pub-Sub | Asynchronous state changes | 10-100ms |
| **WebSocket** | WS/WSS | Streaming | Real-time UI updates | < 10ms |
| **MQTT** | MQTT/TLS | Pub-Sub | IoT device telemetry | 5-50ms |
| **gRPC** (future) | HTTP/2 | Request-Response | High-performance service-to-service | 10-50ms |

---

### Connector 1: REST API Connector

**Protocol**: HTTP/1.1 or HTTP/2 over TLS

**Pattern**: Synchronous Request-Response

**Characteristics**:
- **Stateless**: Each request is independent
- **Cacheable**: Responses can be cached (menu queries)
- **Idempotent**: GET, PUT, DELETE operations
- **Timeout**: 30 seconds default

**Example Interaction**:
```
Client → API Gateway → Ordering Service

Request:
POST /api/v1/orders
Authorization: Bearer <JWT>
{
  "tableId": "TBL-05",
  "items": [{"itemId": "MENU-001", "quantity": 2}]
}

Response:
201 Created
{
  "orderId": "ORD-2026-001234",
  "status": "PLACED",
  "total": 165000
}
```

**Used Between**:
- Tablet App ↔ API Gateway ↔ Ordering Service
- Manager Dashboard ↔ API Gateway ↔ Analytics Service
- API Gateway ↔ Auth Service (token validation)

**Advantages**:
- ✅ Simple, well-understood
- ✅ Immediate feedback to client
- ✅ Easy error handling

**Disadvantages**:
- ❌ Tight coupling (client waits for response)
- ❌ Cascading failures if service slow/down
- ❌ Not suitable for long-running operations

---

### Connector 2: Event Stream Connector (Kafka)

**Protocol**: Kafka binary protocol over TCP

**Pattern**: Publish-Subscribe (Pub-Sub)

**Characteristics**:
- **Asynchronous**: Fire-and-forget, no immediate response
- **Durable**: Events persisted to disk (configurable retention)
- **Ordered**: Events in same partition delivered in order
- **Replay**: Consumers can replay events from any offset
- **At-Least-Once Delivery**: Events delivered at least once (idempotent consumers required)

**Example Interaction**:
```
Ordering Service → Event Bus → Kitchen Service

Event: OrderPlaced
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "OrderPlaced",
  "timestamp": "2026-02-21T10:30:45.123Z",
  "source": "ordering-service",
  "data": {
    "orderId": "ORD-2026-001234",
    "tableId": "TBL-05",
    "items": [...]
  }
}
```

**Used Between**:
- Ordering Service → Event Bus → Kitchen, Inventory, Analytics Services
- Kitchen Service → Event Bus → Notification, Analytics Services
- Inventory Service → Event Bus → Notification Service
- IoT Gateway → Event Bus → Inventory Service

**Advantages**:
- ✅ Loose coupling (services don't know each other)
- ✅ Scalable (add subscribers without changing publisher)
- ✅ Fault tolerant (events buffered if consumer down)
- ✅ Audit trail (event log provides complete history)

**Disadvantages**:
- ❌ Eventual consistency (state changes not immediate)
- ❌ Complex debugging (trace events across services)
- ❌ Message ordering challenges (across partitions)

**Kafka Configuration**:
- **Topics**: `orders`, `kitchen`, `inventory`, `notifications`
- **Partitions**: 3-6 per topic (for parallelism)
- **Replication Factor**: 3 (for durability)
- **Retention**: 7 days (configurable per topic)

---

### Connector 3: WebSocket Connector

**Protocol**: WebSocket (WS) over TLS (WSS)

**Pattern**: Bidirectional Streaming

**Characteristics**:
- **Full-Duplex**: Server can push updates to client without polling
- **Low Latency**: < 10ms for message delivery
- **Persistent Connection**: Single long-lived connection per client
- **Stateful**: Connection maintains session state

**Example Interaction**:
```
Kitchen Display ←WebSocket→ Kitchen Service

Server Push:
{
  "type": "NEW_ORDER",
  "orderId": "ORD-2026-001234",
  "items": [...],
  "priority": "HIGH"
}

Client Ack:
{
  "type": "ORDER_RECEIVED",
  "orderId": "ORD-2026-001234"
}
```

**Used Between**:
- Kitchen Display System ↔ Kitchen Service (real-time order updates)
- Manager Dashboard ↔ Analytics Service (live metrics)
- Tablet App ↔ Ordering Service (order status tracking)

**Advantages**:
- ✅ Real-time updates (no polling overhead)
- ✅ Efficient (single connection, low overhead)
- ✅ Bidirectional (server and client can initiate messages)

**Disadvantages**:
- ❌ Stateful (harder to scale, sticky sessions required)
- ❌ Connection management complexity
- ❌ Fallback needed for firewall/proxy issues

---

### Connector 4: MQTT Connector

**Protocol**: MQTT 3.1.1 or 5.0 over TLS

**Pattern**: Publish-Subscribe (Pub-Sub)

**Characteristics**:
- **Lightweight**: Minimal overhead (ideal for IoT devices)
- **QoS Levels**: 0 (at most once), 1 (at least once), 2 (exactly once)
- **Retained Messages**: Last message cached for new subscribers
- **Last Will & Testament**: Detect disconnected devices

**Example Interaction**:
```
IoT Sensor → MQTT Broker (IoT Gateway) → Kafka Event Bus

MQTT Publish:
Topic: sensors/fridge-01/temperature
Payload: {"value": 4.5, "unit": "celsius", "timestamp": "2026-02-21T10:30:45.123Z"}

Gateway Translation → Kafka Event:
{
  "eventType": "TemperatureReading",
  "source": "iot-gateway",
  "data": {
    "sensorId": "fridge-01",
    "temperature": 4.5,
    "unit": "celsius",
    "timestamp": "2026-02-21T10:30:45.123Z"
  }
}
```

**Used Between**:
- IoT Sensors → IoT Gateway (temperature, weight readings)
- IoT Gateway → Cloud Event Bus (translated events)

**Advantages**:
- ✅ Efficient for constrained devices (low bandwidth, battery)
- ✅ Reliable (QoS levels ensure delivery)
- ✅ Scalable (support 1000+ devices per broker)

**Disadvantages**:
- ❌ Not designed for large payloads (< 256 KB recommended)
- ❌ Security complexity (certificate management per device)

**MQTT Configuration**:
- **Broker**: Mosquitto (open-source, lightweight)
- **QoS**: Level 1 (at least once) for sensor data
- **Security**: TLS + device certificates
- **Retained**: Temperature readings (so new subscribers get latest value)

---

## Communication Patterns
## Mô hình Giao tiếp

### Pattern 1: Synchronous Request-Response

**Use Case**: Client needs immediate feedback

**Diagram**:
```
┌────────┐                ┌─────────────┐                ┌──────────────┐
│ Client │                │ API Gateway │                │   Service    │
└───┬────┘                └──────┬──────┘                └──────┬───────┘
    │                            │                              │
    │ 1. POST /api/v1/orders     │                              │
    ├───────────────────────────>│                              │
    │                            │ 2. Validate JWT              │
    │                            │                              │
    │                            │ 3. Route to Ordering Service │
    │                            ├─────────────────────────────>│
    │                            │                              │
    │                            │                              │ 4. Process
    │                            │                              │    Order
    │                            │                              │
    │                            │ 5. Response: 201 Created     │
    │                            │<─────────────────────────────┤
    │ 6. Return to client        │                              │
    │<───────────────────────────┤                              │
    │                            │                              │
```

**Characteristics**:
- **Latency**: 50-200ms (depends on service processing)
- **Error Handling**: Immediate error response (4xx, 5xx)
- **Retry**: Client-side retry with exponential backoff

**Examples in IRMS**:
- Customer places order via tablet (needs order confirmation)
- Manager queries analytics dashboard (needs immediate data)
- Auth service validates JWT token (blocking, must be fast)

---

### Pattern 2: Asynchronous Publish-Subscribe

**Use Case**: Notify multiple services about state changes

**Diagram**:
```
┌─────────────┐
│  Ordering   │
│  Service    │
└──────┬──────┘
       │
       │ 1. Publish OrderPlaced event
       │
       ▼
┌─────────────────────┐
│    Event Bus        │
│     (Kafka)         │
└──────┬──────────────┘
       │
       ├──────────────────────────────┬────────────────────────────┐
       │                              │                            │
       ▼                              ▼                            ▼
┌──────────────┐              ┌──────────────┐           ┌──────────────┐
│   Kitchen    │              │  Inventory   │           │  Analytics   │
│   Service    │              │   Service    │           │   Service    │
│              │              │              │           │              │
│ 2. Add to    │              │ 3. Deduct    │           │ 4. Update    │
│    queue     │              │    stock     │           │    metrics   │
└──────────────┘              └──────────────┘           └──────────────┘
```

**Characteristics**:
- **Latency**: 10-100ms (event delivery + processing)
- **Eventual Consistency**: State changes propagate asynchronously
- **Decoupling**: Ordering Service doesn't know about subscribers
- **Scalability**: Add new subscribers without changing publisher

**Examples in IRMS**:
- Order placed → notifies kitchen, inventory, analytics
- Order completed → notifies customer, waiter, analytics
- Inventory low → notifies manager, analytics

---

### Pattern 3: Real-Time Streaming

**Use Case**: Push live updates to UI

**Diagram**:
```
┌────────────────┐                        ┌────────────────┐
│  Kitchen       │                        │  Kitchen       │
│  Service       │                        │  Display (KDS) │
└────────┬───────┘                        └────────┬───────┘
         │                                         │
         │  WebSocket connection established       │
         │<───────────────────────────────────────>│
         │                                         │
         │ 1. OrderPlaced event received from Kafka│
         │                                         │
         │ 2. Push order to KDS                    │
         ├────────────────────────────────────────>│
         │    (WebSocket message)                  │
         │                                         │
         │                                         │
         │ 3. Chef marks order complete (UI action)│
         │<────────────────────────────────────────┤
         │                                         │
         │ 4. Update database + publish event      │
         │                                         │
```

**Characteristics**:
- **Latency**: < 10ms (instant UI updates)
- **Connection**: Long-lived, bidirectional
- **Statefulness**: Server maintains client connection state

**Examples in IRMS**:
- Kitchen Display receives new orders instantly
- Manager Dashboard shows live order metrics
- Tablet shows order status updates (cooking → ready)

---

### Pattern 4: Protocol Translation (IoT Gateway)

**Use Case**: Translate IoT protocols to cloud events

**Diagram**:
```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Temperature  │         │     IoT      │         │  Event Bus   │
│   Sensor     │  MQTT   │   Gateway    │  Kafka  │   (Kafka)    │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Publish             │                        │
       │    MQTT message        │                        │
       ├───────────────────────>│                        │
       │                        │                        │
       │                        │ 2. Translate           │
       │                        │    MQTT → Kafka event  │
       │                        │                        │
       │                        │ 3. Publish event       │
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │                        │
```

**Characteristics**:
- **Protocol Adaptation**: MQTT → Kafka, HTTP → Kafka
- **Buffering**: Store events when cloud unavailable
- **Enrichment**: Add metadata (location, device type)

**Examples in IRMS**:
- Temperature sensor (MQTT) → IoT Gateway → Kafka event → Inventory Service
- Load-cell sensor (HTTP) → IoT Gateway → Kafka event → Inventory Service

---

## Synchronous Interactions
## Tương tác Đồng bộ

### Use Cases for Synchronous Communication

| Scenario | Components | Connector | Rationale |
|----------|-----------|-----------|-----------|
| **Token Validation** | API Gateway → Auth Service | REST | Must validate before allowing request |
| **Order Placement** | Tablet → API Gateway → Ordering Service | REST | Customer needs immediate confirmation |
| **Menu Query** | Tablet → API Gateway → Ordering Service | REST | Must display menu before ordering |
| **Dashboard Query** | Manager → API Gateway → Analytics Service | REST | Real-time data retrieval |

### Synchronous Interaction Example: Order Placement

**Sequence**:
1. Customer submits order from tablet
2. API Gateway validates JWT token (synchronous call to Auth Service)
3. API Gateway routes request to Ordering Service
4. Ordering Service validates order (items exist, prices correct)
5. Ordering Service saves order to database
6. Ordering Service publishes `OrderPlaced` event (async, fire-and-forget)
7. Ordering Service returns order confirmation to client (sync response)

**Latency Breakdown**:
```
Total: 450ms
├─ API Gateway (routing, auth): 50ms
├─ Auth Service (token validation): 20ms
├─ Ordering Service (validation): 30ms
├─ Database write: 200ms
├─ Kafka publish: 100ms (async, doesn't block response)
└─ Network overhead: 50ms
```

**Error Handling**:
- **Auth failure**: 401 Unauthorized (client must re-authenticate)
- **Validation error**: 400 Bad Request (invalid item, out of stock)
- **Database error**: 500 Internal Server Error (retry with backoff)
- **Timeout**: 504 Gateway Timeout (after 30 seconds)

---

## Asynchronous Event Flows
## Luồng Sự kiện Bất đồng bộ

### Key Events in IRMS

See detailed event schemas: [Event Schema](../diagrams/data/event-schema.md)

| Event | Publisher | Subscribers | Trigger | Payload |
|-------|-----------|-------------|---------|---------|
| **OrderPlaced** | Ordering Service | Kitchen, Inventory, Analytics | Customer submits order | orderId, items[], tableId, total |
| **OrderInProgress** | Kitchen Service | Notification, Analytics | Chef starts cooking | orderId, chefId, startTime |
| **OrderCompleted** | Kitchen Service | Notification, Analytics | Dish ready | orderId, completionTime, prepDuration |
| **InventoryLow** | Inventory Service | Notification, Analytics | Stock below threshold | ingredientId, currentLevel, threshold |
| **TemperatureAlert** | IoT Gateway | Notification, Inventory | Temp out of range | sensorId, temperature, location |
| **KitchenOverload** | Kitchen Service | Notification, Analytics | Queue length > 10 | queueLength, activeOrders, stations[] |

### Event Flow Example 1: Order Placement to Completion

**Visual**: See [Order Placement Sequence Diagram](../diagrams/sequences/order-placement-flow.md)

```
Time: 0ms
┌─────────────┐
│  Ordering   │ Publish: OrderPlaced
│  Service    ├──────────────────────────────┐
└─────────────┘                              │
                                             │
Time: 10ms                                   ▼
┌─────────────┐                     ┌────────────────┐
│  Kitchen    │  Subscribe          │   Event Bus    │
│  Service    │<────────────────────┤     (Kafka)    │
└──────┬──────┘                     └────────────────┘
       │                                     │
       │                                     │
Time: 20ms                                   │
┌──────▼──────┐                             │
│   Kitchen   │  Add to queue               │
│   Queue     │                             │
└──────┬──────┘                             │
       │                                     │
Time: 50ms                                   │
┌──────▼──────┐                             │
│  Kitchen    │  Send order                 │
│  Display    │  (WebSocket push)           │
└─────────────┘                             │
                                             │
Time: 5 minutes (chef cooks)                │
┌─────────────┐                             │
│   Kitchen   │ Publish: OrderCompleted     │
│   Service   ├────────────────────────────>│
└─────────────┘                             │
                                             │
Time: 5min + 10ms                            ▼
┌─────────────┐                     ┌────────────────┐
│ Notification│  Subscribe          │   Event Bus    │
│  Service    │<────────────────────┤                │
└──────┬──────┘                     └────────────────┘
       │
Time: 5min + 20ms
┌──────▼──────┐
│   Tablet    │  Push notification:
│   (Customer)│  "Your order is ready!"
└─────────────┘
```

**Total Latency**:
- Order → Kitchen Display: **50ms** (meets NFR2 < 1 second) ✅
- Order → Completion notification: **5 minutes** (cooking time, not system latency)

---

### Event Flow Example 2: Inventory Low Alert

**Trigger**: Stock level falls below safety threshold

```
Time: 0ms
┌─────────────┐
│ Temperature │  MQTT publish
│  Sensor     ├─────────────────────────┐
└─────────────┘                         │
                                        ▼
Time: 5ms                        ┌──────────────┐
┌─────────────┐                  │  IoT Gateway │
│  Inventory  │  Subscribe       │              │
│  Service    │<─────────────────┤ Translate to │
└──────┬──────┘   Kafka event    │ Kafka event  │
       │                         └──────────────┘
       │
Time: 20ms
┌──────▼──────┐
│  Calculate  │  Current stock = 15kg
│  Stock      │  Threshold = 20kg
│  Level      │  → LOW INVENTORY DETECTED
└──────┬──────┘
       │
Time: 30ms
┌──────▼──────┐
│  Inventory  │  Publish: InventoryLow
│  Service    ├──────────────────────────────┐
└─────────────┘                              │
                                             ▼
Time: 40ms                            ┌────────────────┐
┌─────────────┐                       │   Event Bus    │
│ Notification│  Subscribe            │                │
│  Service    │<──────────────────────┤                │
└──────┬──────┘                       └────────────────┘
       │
Time: 50ms
┌──────▼──────┐
│   Manager   │  SMS + Push:
│             │  "Low stock alert: Rice (15kg remaining)"
└─────────────┘
```

**Total Latency**: Sensor reading → Manager alert = **50ms** ✅

---

## Data Flow Diagrams
## Sơ đồ Luồng Dữ liệu

### Data Flow 1: Order Placement

```
┌─────────┐
│ Customer│
└────┬────┘
     │ Order data: {tableId, items[]}
     ▼
┌─────────────────┐
│   Tablet App    │ (Client)
└────┬────────────┘
     │ HTTP POST /api/v1/orders + JWT
     ▼
┌─────────────────┐
│  API Gateway    │ Validate JWT, route request
└────┬────────────┘
     │ HTTP → Ordering Service
     ▼
┌─────────────────────┐
│  Ordering Service   │
│  1. Validate order  │
│  2. Save to DB      │
│  3. Publish event   │
└────┬───────┬────────┘
     │       │
     │       │ OrderPlaced event → Event Bus
     │       ▼
     │  ┌─────────────────┐
     │  │   Event Bus     │
     │  │    (Kafka)      │
     │  └────┬────┬───┬───┘
     │       │    │   │
     │       │    │   └──> Analytics Service (metrics)
     │       │    └──────> Inventory Service (deduct stock)
     │       └───────────> Kitchen Service (add to queue)
     │
     │ Order confirmation response
     ▼
┌─────────────────┐
│   Tablet App    │ Display: "Order confirmed! #ORD-001234"
└─────────────────┘
```

### Data Flow 2: Kitchen Order Processing

```
┌─────────────────┐
│   Event Bus     │
│   OrderPlaced   │
└────┬────────────┘
     │ Event: {orderId, items[], tableId}
     ▼
┌─────────────────────────┐
│   Kitchen Service       │
│  1. Receive event       │
│  2. Calculate priority  │
│  3. Add to queue        │
│  4. Update KDS          │
└────┬───────────┬────────┘
     │           │
     │           │ WebSocket push
     │           ▼
     │     ┌────────────────┐
     │     │  Kitchen       │
     │     │  Display (KDS) │
     │     └────────────────┘
     │           │
     │           │ Chef marks complete (WebSocket)
     │           ▼
     │     ┌────────────────┐
     │     │  Kitchen       │
     │     │  Service       │
     │     └────┬───────────┘
     │          │ Publish: OrderCompleted
     │          ▼
     │     ┌────────────────┐
     │     │   Event Bus    │
     │     └────┬───────────┘
     │          │
     │          └──> Notification Service → Customer/Waiter
     │
     └──> Analytics Service (track prep time)
```

### Data Flow 3: IoT Sensor to Inventory Alert

```
┌──────────────────┐
│ Temperature      │
│ Sensor (IoT)     │
└────┬─────────────┘
     │ MQTT: {sensorId, temperature, timestamp}
     ▼
┌──────────────────────┐
│   IoT Gateway        │
│  1. Receive MQTT     │
│  2. Validate device  │
│  3. Translate to     │
│     Kafka event      │
└────┬─────────────────┘
     │ TemperatureReading event
     ▼
┌──────────────────────┐
│   Event Bus          │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────────┐
│  Inventory Service       │
│  1. Store reading (DB)   │
│  2. Check thresholds     │
│  3. If abnormal,         │
│     publish alert        │
└────┬─────────────────────┘
     │ TemperatureAlert event (if needed)
     ▼
┌──────────────────────┐
│   Event Bus          │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────────┐
│  Notification Service    │
│  Send SMS/Push to Manager│
└──────────────────────────┘
```

---

## Runtime Constraints
## Ràng buộc Runtime

### 1. Latency Constraints / Ràng buộc Độ trễ

| Interaction | Max Latency (P95) | Typical | Critical? |
|-------------|-------------------|---------|-----------|
| Order placement (end-to-end) | 1000ms | 450ms | ✅ Yes (NFR2) |
| Token validation | 100ms | 20ms | ✅ Yes (blocks all requests) |
| Menu query | 500ms | 100ms | ⚠️ Moderate (cached) |
| Event delivery (Kafka) | 100ms | 10ms | ⚠️ Moderate |
| WebSocket push to KDS | 50ms | 10ms | ✅ Yes (real-time display) |
| Dashboard metrics | 2000ms | 500ms | ❌ No (analytics) |

### 2. Throughput Constraints / Ràng buộc Thông lượng

| Component | Peak Load | Sustained | Scaling Strategy |
|-----------|-----------|-----------|------------------|
| API Gateway | 1000 req/sec | 300 req/sec | Horizontal scaling (5+ instances) |
| Ordering Service | 500 req/sec | 100 req/sec | Horizontal scaling (5+ instances) |
| Event Bus (Kafka) | 10,000 events/sec | 1,000 events/sec | Partitioning (6 partitions/topic) |
| Kitchen Service | 200 events/sec | 50 events/sec | Horizontal scaling (3+ instances) |
| IoT Gateway | 1,000 sensor readings/sec | 200 readings/sec | Edge deployment (2 gateways) |

### 3. Connection Limits / Giới hạn Kết nối

| Component | Max Connections | Connection Type | Mitigation |
|-----------|-----------------|-----------------|------------|
| API Gateway | 10,000 | HTTP (short-lived) | Connection pooling, keep-alive |
| Kitchen Service | 100 | WebSocket (long-lived) | Connection limits per KDS |
| IoT Gateway | 500 | MQTT (persistent) | Multiple gateway instances |
| Database (PostgreSQL) | 100 | TCP (pooled) | Connection pooling (HikariCP) |
| Redis | 10,000 | TCP (pooled) | Efficient for caching |

### 4. Data Size Constraints / Giới hạn Kích thước Dữ liệu

| Data Type | Max Size | Typical | Rationale |
|-----------|----------|---------|-----------|
| REST request body | 1 MB | 5 KB | Prevent large payloads |
| Kafka event payload | 1 MB | 10 KB | Default Kafka limit |
| WebSocket message | 100 KB | 2 KB | Real-time, small updates |
| MQTT message | 256 KB | 500 bytes | IoT sensors, minimal data |

---

## Performance Characteristics
## Đặc tính Hiệu năng

### End-to-End Latency Analysis

**Scenario**: Customer places order via tablet

| Step | Component | Operation | Latency | Cumulative |
|------|-----------|-----------|---------|------------|
| 1 | Tablet App | Validate input, build request | 10ms | 10ms |
| 2 | Network | Tablet → API Gateway | 20ms | 30ms |
| 3 | API Gateway | Route, validate JWT | 30ms | 60ms |
| 4 | Network | Gateway → Ordering Service | 10ms | 70ms |
| 5 | Ordering Service | Validate order items | 50ms | 120ms |
| 6 | Database | Write order to PostgreSQL | 150ms | 270ms |
| 7 | Kafka | Publish OrderPlaced event | 80ms | 350ms |
| 8 | Ordering Service | Build response | 20ms | 370ms |
| 9 | Network | Ordering Service → Gateway | 10ms | 380ms |
| 10 | API Gateway | Return response | 10ms | 390ms |
| 11 | Network | Gateway → Tablet | 20ms | 410ms |
| 12 | Tablet App | Render confirmation | 40ms | **450ms** ✅ |

**Result**: P95 latency = **450ms** (well below 1 second NFR2 target) ✅

### Bottleneck Analysis

| Bottleneck | Impact | Mitigation |
|------------|--------|------------|
| **Database Write** (150ms) | Highest latency step | Connection pooling, write optimization, read replicas |
| **Kafka Publish** (80ms) | Second highest | Async (fire-and-forget), batch writes |
| **Network Hops** (60ms total) | Cumulative delay | Service co-location, edge caching |
| **JWT Validation** (30ms) | Blocks all requests | Redis caching, token validation at edge |

---

## Failure Scenarios
## Kịch bản Lỗi

### Failure Scenario 1: Kafka Event Bus Down

**Impact**: HIGH - No event propagation, order stuck in Ordering Service

**Detection**:
- Producer fails to publish event (timeout after 30s)
- Consumer lag increases (Kafka monitoring)

**Mitigation**:
1. **Retry Logic**: Ordering Service retries event publish (3 attempts, exponential backoff)
2. **Fallback**: If Kafka unavailable, save event to local DB ("outbox pattern")
3. **Background Job**: Periodically check outbox, republish events when Kafka recovers
4. **Degraded Mode**: Order placement still succeeds (local DB write), events sent later

**Recovery Time**: < 5 minutes (automatic)

**User Impact**: None (order confirmed, kitchen receives order when Kafka recovers)

See sequence diagram: [Kafka Failure Handling](../diagrams/sequences/sensor-failure-handling.md)

---

### Failure Scenario 2: Kitchen Service Down

**Impact**: MEDIUM - Orders not displayed on KDS, chefs unaware of new orders

**Detection**:
- Health check fails (Kubernetes liveness probe)
- WebSocket connections dropped (KDS shows "disconnected")

**Mitigation**:
1. **Kubernetes Auto-Restart**: Failed pod restarted automatically (< 30 seconds)
2. **Event Replay**: New instance replays unprocessed events from Kafka (consumer offset)
3. **WebSocket Reconnect**: KDS automatically reconnects to new instance
4. **Manual Fallback**: Staff can view orders via Manager Dashboard (REST API to Ordering Service)

**Recovery Time**: < 1 minute (automatic)

**User Impact**: Brief interruption (orders delayed 1-2 minutes)

---

### Failure Scenario 3: IoT Sensor Offline

**Impact**: LOW - Inventory data stale, but system continues operating

**Detection**:
- No sensor readings for 5 minutes (IoT Gateway monitors heartbeat)
- Publish `SensorOffline` event

**Mitigation**:
1. **Graceful Degradation**: Use last known inventory level
2. **Alert Manager**: Notification sent via Notification Service
3. **Manual Override**: Staff can manually update inventory via dashboard
4. **Buffering**: If sensor comes back online, buffered readings replayed

**Recovery Time**: Depends on physical repair (hours)

**User Impact**: None (inventory monitoring is non-critical for order placement)

See sequence diagram: [Sensor Failure Handling](../diagrams/sequences/sensor-failure-handling.md)

---

### Failure Scenario 4: Database Connection Pool Exhausted

**Impact**: HIGH - Service cannot process requests (all connections busy)

**Detection**:
- Requests timeout (30 seconds)
- Connection pool metrics spike (100% utilization)

**Mitigation**:
1. **Circuit Breaker**: After 5 failures, stop accepting new requests (fail fast)
2. **Backpressure**: Return 503 Service Unavailable to clients
3. **Auto-Scaling**: Kubernetes HPA scales service instances (increase pool size)
4. **Connection Tuning**: Increase pool size, reduce connection timeout

**Recovery Time**: 1-2 minutes (auto-scaling)

**User Impact**: Orders temporarily rejected (client should retry)

---

## Conclusion / Kết luận

The Component & Connector View demonstrates how IRMS achieves:

- ✅ **Real-Time Responsiveness**: 450ms order placement (NFR2 < 1 second) via async events, WebSocket
- ✅ **Loose Coupling**: Event-driven pub-sub pattern, services don't know each other
- ✅ **Scalability**: Horizontal scaling of services, Kafka partitioning for parallel processing
- ✅ **Fault Tolerance**: Retry logic, circuit breakers, graceful degradation
- ✅ **Multi-Protocol Support**: REST (sync), Kafka (async), WebSocket (streaming), MQTT (IoT)

Key design decisions:
- **Hybrid Communication**: Sync for immediate feedback, async for state changes
- **Event Bus as Backbone**: Kafka provides durability, replay, and scalability
- **WebSocket for Real-Time**: Instant kitchen display updates without polling
- **IoT Gateway Pattern**: Protocol translation, buffering, device management

See related views:
- [Module View](03-module-view.md) - Static service structure
- [Deployment View](05-deployment-view.md) - Infrastructure allocation
- [Runtime Scenarios](06-runtime-scenarios.md) - End-to-end workflows

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Authors**: IRMS Architecture Team
**Status**: ✅ Complete
