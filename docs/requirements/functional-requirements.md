---
title: Functional Requirements
title_vi: Yêu cầu Chức năng
description: Detailed specifications for all functional requirements (FR1-FR14) of the IRMS system
related_requirements: NFR1, NFR2, NFR3, NFR4, NFR5, NFR6, NFR7, NFR8
related_diagrams: ../diagrams/context/system-context.md, ../diagrams/architecture/microservices-overview.md
last_updated: 2026-02-21
---

# Functional Requirements / Yêu cầu Chức năng

## Overview / Tổng quan

This document provides detailed specifications for all 14 functional requirements of the Intelligent Restaurant Management System (IRMS). Each requirement includes Vietnamese and English descriptions, acceptance criteria, related NFRs, diagrams, and scenarios.

Tài liệu này cung cấp đặc tả chi tiết cho tất cả 14 yêu cầu chức năng của Hệ thống Quản lý Nhà hàng Thông minh (IRMS). Mỗi yêu cầu bao gồm mô tả bằng tiếng Việt và tiếng Anh, tiêu chí chấp nhận, các NFR liên quan, sơ đồ và kịch bản.

---

## Requirements Organization / Phân loại Yêu cầu

| Category | Requirements | Priority |
|----------|--------------|----------|
| **Customer Ordering** | FR1, FR2, FR3, FR4 | P0 (Critical) |
| **Kitchen Management** | FR5, FR6, FR7, FR8 | P0 (Critical) |
| **Inventory Monitoring** | FR9, FR10, FR11 | P1 (High) |
| **Analytics & Reporting** | FR12, FR13, FR14 | P2 (Medium) |

---

## FR1: Customer Ordering via Tablet/QR Menu
### Đặt món qua Tablet hoặc QR Menu

**Category**: Customer Interaction / Tương tác Khách hàng
**Priority**: P0 (Critical)
**Related NFRs**: NFR2 (< 1s latency), NFR6 (Scalability)
**Related Services**: Ordering Service, API Gateway
**Related Diagrams**:
- [System Context](../diagrams/context/system-context.md)
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md)
- [Ordering Service Component](../diagrams/components/ordering-service.md)

### Description (Vietnamese)
Khách hàng có thể đặt món trực tiếp thông qua tablet đặt tại bàn hoặc bằng cách quét mã QR menu trên điện thoại cá nhân. Hệ thống cho phép khách hàng tự phục vụ mà không cần gọi nhân viên, giúp tăng tốc độ phục vụ và giảm sai sót trong việc ghi nhận đơn hàng.

### Description (English)
Customers can place orders directly through tablets placed at tables or by scanning QR menu codes on their personal phones. The system enables customers to serve themselves without calling staff, increasing service speed and reducing errors in order recording.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Menu displays with photos, prices (VND), and descriptions (Vietnamese + English)
- [ ] Customers can add items to cart with quantity selection
- [ ] Customers can modify or remove items before submission
- [ ] Special instructions can be added to individual items (e.g., "No onions, extra chili")
- [ ] Order summary shows subtotal, tax, and total amount
- [ ] Submit button sends order to Ordering Service
- [ ] Confirmation message appears within 1 second (NFR2)
- [ ] Order status visible after submission

### User Story
```
As a Customer
I want to browse the menu and place orders directly from my table
So that I can order food quickly without waiting for staff
```

### Related Scenarios
- **S1**: Order Placement Flow - Happy path from menu browsing to order confirmation

---

## FR2: Digital Menu Display System
### Hiển thị Menu Điện tử

**Category**: Customer Interaction / Tương tác Khách hàng
**Priority**: P0 (Critical)
**Related NFRs**: NFR1 (Performance), NFR3 (Availability)
**Related Services**: Ordering Service
**Related Diagrams**:
- [Ordering Service Component](../diagrams/components/ordering-service.md)
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md)

### Description (Vietnamese)
Hệ thống hiển thị menu điện tử với thông tin chi tiết về món ăn bao gồm tên món (song ngữ), mô tả, hình ảnh, giá cả, và thông tin dinh dưỡng (nếu có). Menu được cập nhật theo thời gian thực khi có thay đổi từ quản lý hoặc khi món hết hàng.

### Description (English)
The system displays a digital menu with detailed dish information including bilingual names, descriptions, images, prices, and nutritional information (if available). The menu updates in real-time when changes are made by management or when items become unavailable.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Menu loads within 2 seconds on tablet/mobile
- [ ] All items display with high-quality images (minimum 800x600px)
- [ ] Prices shown in VND with proper formatting (e.g., "75,000 VND")
- [ ] Bilingual display (Vietnamese primary, English secondary)
- [ ] Category filtering (Appetizers, Main Dishes, Beverages, Desserts)
- [ ] Search functionality by dish name
- [ ] "Out of Stock" items clearly marked and un-orderable
- [ ] Real-time updates when menu changes (via WebSocket or polling)

### User Story
```
As a Customer
I want to see an attractive menu with photos and detailed information
So that I can make informed ordering decisions
```

### Related Scenarios
- **S1**: Order Placement Flow - Menu browsing phase

---

## FR3: Automatic Order Validation and Categorization
### Xác thực và Phân loại Đơn hàng Tự động

**Category**: Order Processing / Xử lý Đơn hàng
**Priority**: P0 (Critical)
**Related NFRs**: NFR4 (Reliability), NFR5 (Data Accuracy)
**Related Services**: Ordering Service
**Related Diagrams**:
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md)
- [Ordering Service Component](../diagrams/components/ordering-service.md)

### Description (Vietnamese)
Hệ thống tự động xác thực đơn hàng (kiểm tra món còn hàng, bàn hợp lệ, số lượng hợp lý) và tự động phân loại món ăn theo danh mục (đồ uống, món phụ, món chính) để định tuyến đến đúng trạm bếp.

### Description (English)
The system automatically validates orders (checking item availability, valid table, reasonable quantity) and categorizes dishes by type (beverages, side dishes, main courses) to route to the correct kitchen station.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Validate table ID exists and is active
- [ ] Check all ordered items are available (not out of stock)
- [ ] Verify quantity is within reasonable limits (1-10 per item)
- [ ] Calculate total price accurately (subtotal + tax)
- [ ] Categorize items: Main Dish, Beverage, Appetizer, Dessert
- [ ] Assign correct kitchen station per category
- [ ] Return clear error messages for validation failures
- [ ] Validation completes within 50ms (part of NFR2 1s total)

### Business Rules
1. **Stock Validation**: If item is out of stock → Return `400 Bad Request` with message "Món [name] hiện hết. Vui lòng chọn món khác"
2. **Table Validation**: Table must be in `ACTIVE` status
3. **Quantity Limits**: Min 1, Max 10 per item (to prevent data entry errors)
4. **Category Mapping**:
   - Main Dish → Main Kitchen Station
   - Beverage → Beverage Station
   - Appetizer/Dessert → Appetizer Station

### User Story
```
As the System
I want to automatically validate and categorize orders
So that invalid orders are rejected and orders are routed to the correct kitchen station
```

### Related Scenarios
- **S1**: Order Placement Flow - Validation phase

---

## FR4: Real-Time Order Routing to Kitchen Stations
### Định tuyến Đơn hàng Thời gian Thực đến Trạm Bếp

**Category**: Order Processing / Xử lý Đơn hàng
**Priority**: P0 (Critical)
**Related NFRs**: NFR2 (< 1s latency), NFR4 (Fault Tolerance)
**Related Services**: Ordering Service, Event Bus (Kafka), Kitchen Service
**Related Diagrams**:
- [Event-Driven Architecture](../diagrams/architecture/event-driven-architecture.md)
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md)
- [Kitchen Service Component](../diagrams/components/kitchen-service.md)

### Description (Vietnamese)
Đơn hàng được gửi theo thời gian thực đến đúng trạm bếp tương ứng (bếp chính, quầy đồ uống, v.v.) ngay sau khi khách đặt món. Hệ thống sử dụng Event Bus (Kafka) để truyền sự kiện `OrderPlaced` bất đồng bộ, đảm bảo độ trễ < 1 giây từ khi khách nhấn "Đặt món" đến khi bếp nhận được thông tin.

### Description (English)
Orders are sent in real-time to the correct kitchen station (main kitchen, beverage counter, etc.) immediately after the customer places the order. The system uses an Event Bus (Kafka) to transmit `OrderPlaced` events asynchronously, ensuring latency < 1 second from when the customer clicks "Order" until the kitchen receives the information.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Order published to Kafka `orders` topic within 50ms
- [ ] Event includes: orderId, tableId, items (with category), priority
- [ ] Kitchen Service subscribes and processes event within 20ms
- [ ] Items routed to correct station based on category
- [ ] **Total latency < 1 second** (NFR2) ✅
- [ ] If Kafka unavailable, order buffered locally and retried
- [ ] No orders lost during temporary Kafka outage (NFR4)

### Technical Implementation
```
Flow:
1. Ordering Service validates order (50ms)
2. Ordering Service writes to database (80ms)
3. Ordering Service publishes OrderPlaced event to Kafka (50ms)
4. Kafka persists event (30ms)
5. Kitchen Service receives event (20ms)
6. Kitchen Service adds to queue (30ms)
7. Kitchen Service pushes to KDS via WebSocket (20ms)

Total: ~280ms (well under 1s requirement)
```

### User Story
```
As a Kitchen Staff member
I want to receive orders immediately after they are placed
So that I can start preparing dishes without delay
```

### Related Scenarios
- **S1**: Order Placement Flow - Event publication and delivery

---

## FR5: Kitchen Display System (KDS) Order List
### Danh sách Đơn hàng trên Kitchen Display System

**Category**: Kitchen Management / Quản lý Bếp
**Priority**: P0 (Critical)
**Related NFRs**: NFR2 (Real-time), NFR3 (Availability)
**Related Services**: Kitchen Service
**Related Diagrams**:
- [Kitchen Service Component](../diagrams/components/kitchen-service.md)
- [System Context](../diagrams/context/system-context.md)

### Description (Vietnamese)
Kitchen Display System (KDS) hiển thị danh sách đơn hàng liên tục và cập nhật theo thời gian thực. Màn hình KDS cho phép nhân viên bếp xem các đơn hàng đang chờ, đang chế biến và hoàn thành, giúp tối ưu hóa quy trình làm việc.

### Description (English)
Kitchen Display System (KDS) displays a continuously updated list of orders in real-time. The KDS screen allows kitchen staff to view pending, in-progress, and completed orders, optimizing workflow.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Display shows all orders in queue sorted by priority
- [ ] Each order card shows: Order ID, Table, Items, Special instructions, Time waiting
- [ ] Color coding: Pending (White), In Progress (Yellow), Urgent (Red)
- [ ] Auto-refresh every 2 seconds or via WebSocket push
- [ ] Touch interface to change order status
- [ ] Orders move between columns: Pending → In Progress → Completed
- [ ] Completed orders disappear after 5 minutes
- [ ] KDS connects to Kitchen Service via WebSocket for live updates

### Display Layout
```
┌──────────────────┬──────────────────┬──────────────────┐
│   Pending        │  In Progress     │   Completed      │
│   (12 orders)    │  (5 orders)      │   (3 orders)     │
├──────────────────┼──────────────────┼──────────────────┤
│ ORD-001 │ TBL-5  │ ORD-003 │ TBL-2 │ ORD-008 │ TBL-7 │
│ • Phở Bò x2     │ • Cơm Gà x1     │ • Bún Bò x1     │
│ • Cà phê x1     │ [Chef: John]     │ [Completed 2m]  │
│ ⏱ 2m ago        │ ⏱ 8m cooking    │                  │
│ [Priority: 7/10]│ [Priority: 8/10]│                  │
└──────────────────┴──────────────────┴──────────────────┘
```

### User Story
```
As a Kitchen Staff member
I want to see all pending and in-progress orders on a display
So that I can prioritize my work and track cooking status
```

### Related Scenarios
- **S1**: Order Placement Flow - KDS display update
- **S2**: Kitchen Overload - Managing high order volume

---

## FR6: Chef Status Update Functionality
### Chức năng Cập nhật Trạng thái của Bếp trưởng

**Category**: Kitchen Management / Quản lý Bếp
**Priority**: P0 (Critical)
**Related NFRs**: NFR4 (Reliability), NFR5 (Data Accuracy)
**Related Services**: Kitchen Service
**Related Diagrams**:
- [Kitchen Service Component](../diagrams/components/kitchen-service.md)
- [Order Placement Flow](../diagrams/sequences/order-placement-flow.md)

### Description (Vietnamese)
Nhân viên bếp có thể cập nhật trạng thái chế biến món ăn trực tiếp trên KDS (đang chế biến, hoàn thành). Các cập nhật này được đồng bộ ngay lập tức với dashboard quản lý và tablet khách hàng.

### Description (English)
Kitchen staff can update cooking status directly on the KDS (in progress, completed). These updates are immediately synchronized with the management dashboard and customer tablets.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Chef can tap order card to change status
- [ ] Status transitions: PLACED → IN_PROGRESS → COMPLETED
- [ ] Status change publishes `OrderInProgress` or `OrderCompleted` event
- [ ] Event delivered to Notification Service within 100ms
- [ ] Customer tablet updates order status in real-time
- [ ] Dashboard reflects updated kitchen load immediately
- [ ] Chef ID and timestamp recorded for each status change
- [ ] Undo functionality available for 30 seconds after change

### State Machine
```
PLACED → [Chef starts cooking] → IN_PROGRESS → [Dish ready] → COMPLETED
                                       ↓
                            [Can update estimated time]
```

### User Story
```
As a Chef
I want to update the status of orders as I work on them
So that the system knows cooking progress and customers are informed
```

### Related Scenarios
- **S1**: Order Placement Flow - Status update phase

---

## FR7: Queue Management and Auto-Prioritization
### Quản lý Hàng đợi và Tự động Ưu tiên

**Category**: Kitchen Management / Quản lý Bếp
**Priority**: P0 (Critical)
**Related NFRs**: NFR1 (Performance), NFR6 (Scalability)
**Related Services**: Kitchen Service
**Related Diagrams**:
- [Kitchen Service Component](../diagrams/components/kitchen-service.md)
- [Kitchen Overload Scenario](../diagrams/sequences/kitchen-overload-scenario.md)

### Description (Vietnamese)
Hệ thống tự động quản lý hàng đợi chế biến và ưu tiên đơn hàng dựa trên các yếu tố: mức độ phức tạp món ăn, tải hiện tại của bếp, thời gian chờ, và loại khách hàng (VIP). Thuật toán ưu tiên đảm bảo phục vụ công bằng và tối ưu thời gian chờ tổng thể.

### Description (English)
The system automatically manages the cooking queue and prioritizes orders based on factors: dish complexity, current kitchen load, waiting time, and customer type (VIP). The prioritization algorithm ensures fair service and optimizes overall wait time.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Priority score calculated for each order (0-10 scale)
- [ ] Factors considered: Dish complexity (30%), Wait time (40%), Customer type (20%), Kitchen load (10%)
- [ ] Queue re-sorted when new order arrives or priority changes
- [ ] VIP orders jump to higher priority automatically
- [ ] Orders waiting > 20 minutes get priority boost
- [ ] Complex dishes (>30 min cook time) scheduled early
- [ ] Queue length displayed on KDS
- [ ] Priority algorithm runs in < 40ms

### Prioritization Formula
```
Priority Score =
  (Wait Time Minutes × 0.4) +
  (Dish Complexity Score × 0.3) +
  (Customer VIP Level × 0.2) +
  (Inverse Kitchen Load × 0.1)

Where:
- Wait Time: 0-30 minutes → 0-10 score
- Complexity: Simple (2), Medium (5), Complex (8)
- VIP Level: Regular (0), VIP (5), Premium (10)
- Kitchen Load: 0% → 10, 100% → 0
```

### User Story
```
As the Kitchen Service
I want to automatically prioritize orders intelligently
So that customers are served efficiently and wait times are minimized
```

### Related Scenarios
- **S2**: Kitchen Overload - Priority rebalancing under high load

---

## FR8: Kitchen Overload and Priority Alerts
### Cảnh báo Quá tải Bếp và Ưu tiên

**Category**: Kitchen Management / Quản lý Bếp
**Priority**: P1 (High)
**Related NFRs**: NFR3 (Availability), NFR8 (Observability)
**Related Services**: Kitchen Service, Notification Service
**Related Diagrams**:
- [Kitchen Overload Scenario](../diagrams/sequences/kitchen-overload-scenario.md)
- [Notification Service Component](../diagrams/components/notification-service.md)

### Description (Vietnamese)
Hệ thống tự động phát cảnh báo khi bếp quá tải (số đơn hàng trong hàng đợi vượt ngưỡng) hoặc khi có món ưu tiên cao cần chú ý đặc biệt. Cảnh báo được gửi qua dashboard, push notification, và KDS.

### Description (English)
The system automatically sends alerts when the kitchen is overloaded (order queue exceeds threshold) or when there are high-priority dishes requiring special attention. Alerts are sent via dashboard, push notifications, and KDS.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Alert triggered when queue length > 30 orders
- [ ] Alert triggered when average wait time > 25 minutes
- [ ] Alert triggered when priority order (VIP, urgent) added
- [ ] `KitchenOverload` event published to Event Bus
- [ ] Manager receives push notification on dashboard
- [ ] KDS displays alert banner at top of screen
- [ ] Alert includes: Queue length, Avg wait time, Recommended action
- [ ] Alert auto-resolves when queue < 20 orders
- [ ] Alert history logged for analytics

### Alert Severity Levels
- **INFO** (Yellow): Queue 20-30 orders
- **WARNING** (Orange): Queue 30-45 orders
- **CRITICAL** (Red): Queue > 45 orders or Wait time > 30 min

### User Story
```
As a Restaurant Manager
I want to be alerted when the kitchen is overloaded
So that I can take action (add staff, pause new orders, etc.)
```

### Related Scenarios
- **S2**: Kitchen Overload - Alert triggered and HPA scaling

---

## FR9: IoT-based Inventory Tracking with Load-Cell Sensors
### Theo dõi Tồn kho bằng Cảm biến Load-cell IoT

**Category**: Inventory Monitoring / Giám sát Tồn kho
**Priority**: P1 (High)
**Related NFRs**: NFR4 (Fault Tolerance), NFR7 (IoT Resilience)
**Related Services**: IoT Gateway, Inventory Service
**Related Diagrams**:
- [IoT Gateway Component](../diagrams/components/iot-gateway.md)
- [Inventory Alert Flow](../diagrams/sequences/inventory-alert-flow.md)

### Description (Vietnamese)
Hệ thống theo dõi tồn kho nguyên liệu tự động bằng cảm biến load-cell (cảm biến trọng lượng). Cảm biến liên tục gửi dữ liệu về trọng lượng nguyên liệu trong kho, giúp cập nhật tồn kho theo thời gian thực mà không cần kiểm kê thủ công.

### Description (English)
The system automatically tracks ingredient inventory using load-cell sensors (weight sensors). Sensors continuously send data about ingredient weight in storage, enabling real-time inventory updates without manual counting.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Load-cell sensors report weight every 10 seconds via MQTT
- [ ] IoT Gateway receives sensor data and validates format
- [ ] Data converted from kg to inventory units (e.g., kg → servings)
- [ ] Inventory Service updates stock levels in InfluxDB
- [ ] Dashboard displays current stock levels in real-time
- [ ] Historical stock data retained for 90 days
- [ ] Sensor calibration handled automatically
- [ ] If sensor fails, last known value retained with "stale" flag

### Data Flow
```
Load-cell Sensor → [MQTT] → IoT Gateway → [HTTP/Kafka] → Inventory Service → InfluxDB
                                                ↓
                                         Analytics Service
```

### User Story
```
As a Restaurant Manager
I want to automatically track ingredient levels using sensors
So that I know inventory status without manual counting
```

### Related Scenarios
- **S3**: Inventory Alert Flow - IoT sensor data triggers alert

---

## FR10: Low Stock Alert System
### Hệ thống Cảnh báo Tồn kho Thấp

**Category**: Inventory Monitoring / Giám sát Tồn kho
**Priority**: P1 (High)
**Related NFRs**: NFR8 (Observability)
**Related Services**: Inventory Service, Notification Service
**Related Diagrams**:
- [Inventory Alert Flow](../diagrams/sequences/inventory-alert-flow.md)
- [Inventory Service Component](../diagrams/components/inventory-service.md)

### Description (Vietnamese)
Hệ thống tự động cảnh báo khi nguyên liệu xuống dưới mức an toàn (threshold). Cảnh báo được gửi ngay lập tức đến quản lý qua dashboard, email, và SMS để đảm bảo bổ sung nguyên liệu kịp thời.

### Description (English)
The system automatically alerts when ingredients fall below safe levels (threshold). Alerts are sent immediately to managers via dashboard, email, and SMS to ensure timely restocking.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Each ingredient has configurable threshold (e.g., "Beef: 10kg minimum")
- [ ] Alert triggered when current level < threshold
- [ ] `InventoryLow` event published to Event Bus
- [ ] Manager receives alert on dashboard (real-time)
- [ ] Email sent to manager and supplier
- [ ] SMS sent for critical ingredients
- [ ] Alert shows: Ingredient name, Current level, Threshold, Suggested order quantity
- [ ] Alert history logged for compliance
- [ ] Auto-resolve when stock replenished above threshold

### Alert Example
```
🚨 Low Stock Alert

Ingredient: Thịt bò (Beef)
Current Level: 5.2 kg
Threshold: 10.0 kg
Status: CRITICAL
Recommended Order: 20 kg

Action Required:
- Contact supplier: ABC Meat Co. (090-123-4567)
- Expected delivery: Next day
```

### User Story
```
As a Restaurant Manager
I want to be alerted when ingredients are running low
So that I can restock before running out
```

### Related Scenarios
- **S3**: Inventory Alert Flow - Complete alert lifecycle

---

## FR11: Temperature Monitoring for Food Storage Equipment
### Giám sát Nhiệt độ Thiết bị Bảo quản Thực phẩm

**Category**: Inventory Monitoring / Giám sát Tồn kho
**Priority**: P1 (High)
**Related NFRs**: NFR4 (Fault Tolerance), NFR7 (IoT Resilience)
**Related Services**: IoT Gateway, Inventory Service, Notification Service
**Related Diagrams**:
- [IoT Gateway Component](../diagrams/components/iot-gateway.md)
- [Sensor Failure Handling](../diagrams/sequences/sensor-failure-handling.md)

### Description (Vietnamese)
Hệ thống giám sát nhiệt độ của các thiết bị bảo quản thực phẩm (tủ lạnh, tủ đông) bằng cảm biến nhiệt độ IoT. Nếu nhiệt độ vượt ngưỡng an toàn, hệ thống phát cảnh báo khẩn cấp để tránh hỏng thực phẩm.

### Description (English)
The system monitors the temperature of food storage equipment (refrigerators, freezers) using IoT temperature sensors. If temperature exceeds safe thresholds, the system sends urgent alerts to prevent food spoilage.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Temperature sensors report every 30 seconds via MQTT
- [ ] Each equipment has safe temperature range (e.g., "Walk-in Cooler: 2-4°C")
- [ ] Alert triggered if temperature outside range for > 2 minutes
- [ ] `TemperatureAlert` event published with severity (Warning, Critical)
- [ ] CRITICAL alert sent to manager via dashboard, email, SMS
- [ ] Alert includes: Equipment ID, Location, Current temp, Threshold, Trend
- [ ] Alert logged for health compliance audit
- [ ] Auto-resolve when temperature returns to normal

### Temperature Thresholds
| Equipment | Normal Range | Warning | Critical |
|-----------|--------------|---------|----------|
| Walk-in Cooler | 2-4°C | 4-6°C | > 6°C |
| Freezer | -18 to -20°C | -15 to -18°C | > -15°C |
| Beverage Cooler | 3-5°C | 5-7°C | > 7°C |

### User Story
```
As a Restaurant Manager
I want to monitor food storage temperatures in real-time
So that I can prevent food spoilage and ensure food safety
```

### Related Scenarios
- **S4**: Sensor Failure Handling - Temperature sensor offline

---

## FR12: Real-Time Dashboard for Operations Monitoring
### Dashboard Thời gian Thực cho Giám sát Vận hành

**Category**: Analytics & Reporting / Phân tích & Báo cáo
**Priority**: P2 (Medium)
**Related NFRs**: NFR1 (Performance), NFR8 (Observability)
**Related Services**: Analytics Service
**Related Diagrams**:
- [Analytics Dashboard Update](../diagrams/sequences/analytics-dashboard-update.md)
- [Analytics Service Component](../diagrams/components/analytics-service.md)

### Description (Vietnamese)
Dashboard thời gian thực hiển thị trạng thái tổng thể của nhà hàng bao gồm: số đơn hàng hiện tại, tải bếp, trạng thái thiết bị IoT, doanh thu trong ngày. Dashboard cập nhật liên tục mà không cần refresh thủ công.

### Description (English)
Real-time dashboard displays overall restaurant status including: current orders, kitchen load, IoT device status, daily revenue. Dashboard updates continuously without manual refresh.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Dashboard shows metrics updated every 5 seconds
- [ ] Metrics displayed: Active orders, Kitchen queue length, Average wait time, Revenue today, Equipment status
- [ ] Charts: Orders per hour (bar chart), Revenue trend (line chart), Table occupancy (pie chart)
- [ ] WebSocket connection for live updates (no polling)
- [ ] Color-coded status indicators (Green: Normal, Yellow: Warning, Red: Critical)
- [ ] Mobile-responsive design
- [ ] Export functionality (PDF report)
- [ ] Historical data toggle (Today, This Week, This Month)

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ 📊 IRMS Dashboard - 2026-02-21 14:30:15               │
├─────────────────────────────────────────────────────────┤
│ Active Orders: 23    Kitchen Queue: 12    Wait: 8m    │
│ Revenue Today: 15,450,000 VND   Tables: 18/25         │
├─────────────────────────────────────────────────────────┤
│ [Orders per Hour Chart]    [Equipment Status]          │
│ [Revenue Trend Chart]      [Top Dishes Today]          │
└─────────────────────────────────────────────────────────┘
```

### User Story
```
As a Restaurant Manager
I want to see real-time operations status on a dashboard
So that I can monitor performance and make quick decisions
```

### Related Scenarios
- **S5**: Analytics Dashboard Update - WebSocket real-time updates

---

## FR13: Analytics Reports (Order Flow, Table Turnover)
### Báo cáo Phân tích (Luồng Đơn hàng, Tốc độ Xoay vòng Bàn)

**Category**: Analytics & Reporting / Phân tích & Báo cáo
**Priority**: P2 (Medium)
**Related NFRs**: NFR6 (Scalability), NFR8 (Observability)
**Related Services**: Analytics Service
**Related Diagrams**:
- [Analytics Service Component](../diagrams/components/analytics-service.md)

### Description (Vietnamese)
Hệ thống cung cấp báo cáo phân tích chi tiết về luồng đơn hàng (order flow) và tốc độ xoay vòng bàn (table turnover). Báo cáo có thể xem theo ngày, tuần, tháng hoặc khoảng thời gian tùy chỉnh.

### Description (English)
The system provides detailed analytics reports on order flow and table turnover rate. Reports can be viewed by day, week, month, or custom date range.

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Order Flow Report shows: Total orders, Average order value, Peak hours, Popular dishes, Order completion time distribution
- [ ] Table Turnover Report shows: Average table occupancy time, Turnover rate per table, Revenue per table, Table utilization %
- [ ] Date range selector (Today, Last 7 days, Last 30 days, Custom range)
- [ ] Export to CSV, PDF, Excel
- [ ] Drill-down capability (click on chart to see details)
- [ ] Comparison with previous period (e.g., "This week vs Last week")
- [ ] Saved report templates
- [ ] Scheduled email reports (daily/weekly summary)

### Report Metrics
**Order Flow Metrics:**
- Orders per hour/day/week
- Average order completion time (from placed to completed)
- Order value distribution
- Peak hour identification
- Category breakdown (Main dishes 60%, Beverages 25%, Desserts 15%)

**Table Turnover Metrics:**
- Average table stay duration
- Turnover rate = (Total served tables) / (Available tables × Hours open)
- Revenue per table per day
- Table utilization % = (Occupied time) / (Total time)

### User Story
```
As a Restaurant Manager
I want to analyze order flow and table turnover patterns
So that I can optimize operations and increase revenue
```

---

## FR14: Predictive Insights for Staff Scheduling and Menu Optimization
### Dự đoán Insights để Lên lịch Nhân viên và Tối ưu Menu

**Category**: Analytics & Reporting / Phân tích & Báo cáo
**Priority**: P2 (Medium)
**Related NFRs**: NFR6 (Scalability)
**Related Services**: Analytics Service
**Related Diagrams**:
- [Analytics Service Component](../diagrams/components/analytics-service.md)

### Description (Vietnamese)
Hệ thống sử dụng dữ liệu lịch sử để dự đoán các busy periods (giờ cao điểm), giúp quản lý lên lịch nhân viên hợp lý và tối ưu menu (đề xuất món phổ biến, loại bỏ món ít người chọn).

### Description (English)
The system uses historical data to predict busy periods (peak hours), helping managers schedule staff appropriately and optimize the menu (recommend popular dishes, remove unpopular items).

### Acceptance Criteria / Tiêu chí Chấp nhận
- [ ] Predict busy hours for next week based on historical data (last 4 weeks)
- [ ] Identify patterns: Day of week effect, Holiday impact, Weather correlation
- [ ] Recommend staff count per shift based on predicted load
- [ ] Suggest menu items to promote (high margin + popular)
- [ ] Identify underperforming dishes (low orders + high cost)
- [ ] Forecast daily revenue with 80% accuracy
- [ ] Weekly insights email sent to manager every Monday
- [ ] ML model retrains monthly with new data

### Prediction Algorithms
1. **Busy Period Prediction**:
   - Time series forecasting (ARIMA or Prophet model)
   - Input features: Day of week, Month, Weather, Public holidays, Events
   - Output: Predicted orders per hour

2. **Menu Optimization**:
   - Popularity score = (Order count × Average rating) / Cost ratio
   - Recommend: High popularity score items
   - Deprecate: Low popularity + High cost items

### Insights Example
```
📊 Weekly Insights - Week of Feb 22, 2026

Busy Period Forecast:
- Friday 18:00-21:00: 120 orders expected (High)
- Saturday 12:00-14:00: 100 orders expected (High)
- Tuesday lunch: 40 orders expected (Low)

Staffing Recommendation:
- Friday dinner: 6 kitchen staff, 4 waiters
- Tuesday lunch: 2 kitchen staff, 2 waiters

Menu Insights:
🔥 Top Performers:
  1. Phở Bò - 250 orders, 4.8★, 65% margin
  2. Cơm Gà - 180 orders, 4.7★, 70% margin

⚠️ Consider Removing:
  1. Salad Nga - 12 orders, 3.9★, 30% margin
  2. Súp Hải Sản - 18 orders, 4.1★, 25% margin
```

### User Story
```
As a Restaurant Manager
I want predictive insights about busy periods and popular dishes
So that I can optimize staff scheduling and menu offerings
```

---

## Requirements Summary / Tóm tắt Yêu cầu

### By Priority / Theo Ưu tiên

| Priority | Count | Requirements |
|----------|-------|--------------|
| **P0 (Critical)** | 8 | FR1, FR2, FR3, FR4, FR5, FR6, FR7 |
| **P1 (High)** | 4 | FR8, FR9, FR10, FR11 |
| **P2 (Medium)** | 3 | FR12, FR13, FR14 |

### By Service / Theo Dịch vụ

| Service | Requirements | Primary/Secondary |
|---------|--------------|-------------------|
| **Ordering Service** | FR1, FR2, FR3, FR4 | Primary |
| **Kitchen Service** | FR4, FR5, FR6, FR7, FR8 | Primary |
| **Inventory Service** | FR9, FR10, FR11 | Primary |
| **Analytics Service** | FR12, FR13, FR14 | Primary |
| **IoT Gateway Service** | FR9, FR11 | Primary |
| **Notification Service** | FR8, FR10, FR11 | Secondary (subscriber) |

---

## Verification & Testing / Kiểm chứng & Kiểm thử

### Acceptance Testing Approach
Each functional requirement will be tested with:
1. **Unit Tests**: Individual component logic
2. **Integration Tests**: Service-to-service interactions
3. **End-to-End Tests**: Complete user scenarios
4. **Performance Tests**: Ensure NFR compliance (especially FR4 < 1s)

### Test Coverage Target
- **P0 requirements**: 100% test coverage
- **P1 requirements**: 90% test coverage
- **P2 requirements**: 80% test coverage

### Traceability
All functional requirements are mapped to:
- **NFRs**: See [Non-Functional Requirements](non-functional-requirements.md)
- **Architecture**: See [Traceability Matrix](traceability-matrix.md)
- **Diagrams**: See links in each requirement
- **Scenarios**: See [Runtime Scenarios](../architecture/06-runtime-scenarios.md)

---

**Last Updated**: 2026-02-21
**Status**: Complete - Ready for Implementation
**Next Steps**: Review NFRs and create traceability matrix
