# IRMS - Intelligent Restaurant Management System
## Documentation Hub / Trung tâm Tài liệu

> **Hệ thống quản lý nhà hàng thông minh tích hợp IoT**
> Intelligent Restaurant Management System with IoT Integration

---

## 📋 Tổng quan / Overview

IRMS là hệ thống quản lý nhà hàng thông minh được thiết kế theo kiến trúc **Microservices + Event-Driven + IoT Gateway**, nhằm tự động hóa quy trình đặt món, chế biến và quản lý vận hành nhà hàng.

IRMS is an intelligent restaurant management system designed with **Microservices + Event-Driven + IoT Gateway** architecture to automate ordering, kitchen operations, and restaurant management.

### Đặc điểm chính / Key Features

- 🍽️ **Đặt món trực tiếp tại bàn** qua tablet/QR menu (Order directly at table)
- 🍳 **Quản lý bếp thời gian thực** với Kitchen Display System (Real-time kitchen management)
- 📦 **Giám sát tồn kho thông minh** bằng cảm biến IoT (Smart inventory monitoring with IoT sensors)
- 📊 **Dashboard phân tích** cho quản lý (Analytics dashboard for managers)
- ⚡ **Xử lý đơn hàng < 1 giây** (Order processing < 1 second)

---

## 🏗️ Kiến trúc Hệ thống / System Architecture

### Architectural Style

**Microservices + Event-Driven Architecture + IoT Gateway Layer**

### 7 Microservices chính / Core Microservices

1. **Customer Ordering Service** - Nhận và xác thực đơn hàng
2. **Kitchen Management Service** - Điều phối bếp và hàng đợi
3. **Inventory Monitoring Service** - Theo dõi tồn kho IoT
4. **Notification & Alert Service** - Gửi thông báo và cảnh báo
5. **Analytics & Forecasting Service** - Phân tích và dự đoán
6. **User & Access Management Service** - Xác thực và phân quyền
7. **IoT Gateway Service** - Quản lý thiết bị IoT

---

## 📊 Sơ đồ Kiến trúc / Architecture Diagrams

### 🎯 Phase 1: Foundation Diagrams (P0 - Critical)

| Diagram | Description | File |
|---------|-------------|------|
| **System Context** | Tổng quan hệ thống và actors / System boundary and actors | [📄 system-context.md](diagrams/context/system-context.md) |
| **Microservices Overview** | Kiến trúc 7 microservices / 7 microservices architecture | [📄 microservices-overview.md](diagrams/architecture/microservices-overview.md) |
| **Event-Driven Architecture** | Luồng sự kiện và pub/sub / Event flows and pub/sub | [📄 event-driven-architecture.md](diagrams/architecture/event-driven-architecture.md) |
| **Order Placement Flow** | Kịch bản đặt món (S1) / Order placement scenario | [📄 order-placement-flow.md](diagrams/sequences/order-placement-flow.md) |

### 🔧 Phase 2: Detailed Architecture (P1 - High Priority)

| Diagram | Description | File |
|---------|-------------|------|
| **Kubernetes Deployment** | Triển khai cloud / Cloud deployment | [📄 kubernetes-deployment.md](diagrams/deployment/kubernetes-deployment.md) |
| **Ordering Service Component** | Cấu trúc service đặt món / Ordering service internals | [📄 ordering-service.md](diagrams/components/ordering-service.md) |
| **Kitchen Service Component** | Cấu trúc service bếp / Kitchen service internals | [📄 kitchen-service.md](diagrams/components/kitchen-service.md) |
| **IoT Gateway Component** | Cấu trúc IoT Gateway / IoT Gateway internals | [📄 iot-gateway.md](diagrams/components/iot-gateway.md) |
| **Domain Model** | Mô hình domain / Domain entities | [📄 domain-model.md](diagrams/data/domain-model.md) |

### 📖 Phase 3: Complete Coverage (P2 - Medium Priority)

#### Sequence Diagrams / Sơ đồ Trình tự

- [📄 Kitchen Overload Scenario](diagrams/sequences/kitchen-overload-scenario.md) - Xử lý khi bếp quá tải
- [📄 Inventory Alert Flow](diagrams/sequences/inventory-alert-flow.md) - Cảnh báo tồn kho
- [📄 Sensor Failure Handling](diagrams/sequences/sensor-failure-handling.md) - Xử lý lỗi cảm biến
- [📄 Analytics Dashboard Update](diagrams/sequences/analytics-dashboard-update.md) - Cập nhật dashboard

#### Component Diagrams / Sơ đồ Thành phần

- [📄 Inventory Service](diagrams/components/inventory-service.md)
- [📄 Notification Service](diagrams/components/notification-service.md)
- [📄 Analytics Service](diagrams/components/analytics-service.md)
- [📄 Auth Service](diagrams/components/auth-service.md)

#### Data Diagrams / Sơ đồ Dữ liệu

- [📄 Event Schema](diagrams/data/event-schema.md) - Cấu trúc sự kiện
- [📄 Database per Service](diagrams/data/database-per-service.md) - Cơ sở dữ liệu từng service

---

## 📚 Tài liệu Kiến trúc / Architecture Documentation

### Architecture Views

1. [**Overview**](architecture/01-overview.md) - Tổng quan kiến trúc / Architecture overview
2. [**Architecture Characteristics**](architecture/02-architecture-characteristics.md) - Đặc tính kiến trúc
3. [**Module View**](architecture/03-module-view.md) - Phân rã service / Service decomposition
4. [**Component & Connector View**](architecture/04-component-connector-view.md) - Giao tiếp runtime
5. [**Deployment View**](architecture/05-deployment-view.md) - Triển khai hạ tầng
6. [**Runtime Scenarios**](architecture/06-runtime-scenarios.md) - Các kịch bản quan trọng

### Main Report

📄 [**report.md**](report.md) - Báo cáo chính (Vietnamese) / Main architectural report

---

## 📋 Yêu cầu Hệ thống / System Requirements

### Functional Requirements / Yêu cầu Chức năng

📄 [**Functional Requirements (FR1-FR14)**](requirements/functional-requirements.md)

**Key requirements:**
- FR1: Khách đặt món qua tablet/QR menu
- FR2-FR4: Xử lý đơn hàng thời gian thực
- FR5-FR8: Quản lý bếp và hàng đợi
- FR9-FR11: Giám sát tồn kho IoT
- FR12-FR14: Dashboard và analytics

### Non-Functional Requirements / Yêu cầu Phi Chức năng

📄 [**Non-Functional Requirements (NFR1-NFR8)**](requirements/non-functional-requirements.md)

**Critical NFRs:**
- **NFR2**: Order latency < 1 second ⚡
- **NFR3**: High availability during business hours
- **NFR4**: Fault tolerance for IoT devices
- **NFR6**: Horizontal scalability

### Traceability

📄 [**Traceability Matrix**](requirements/traceability-matrix.md) - Requirements → Architecture → Services

---

## 🎭 Actors / Người dùng

| Actor | Role | Interface |
|-------|------|-----------|
| 👤 **Khách hàng / Customer** | Đặt món | Tablet, QR Menu |
| 👔 **Nhân viên phục vụ / Waitstaff** | Hỗ trợ khách | Mobile App |
| 👨‍🍳 **Nhân viên bếp / Kitchen Staff** | Chế biến món | Kitchen Display System (KDS) |
| 👔 **Quản lý / Manager** | Giám sát vận hành | Dashboard |
| 🌡️ **Thiết bị IoT / IoT Devices** | Thu thập dữ liệu | Load-cell, Temperature sensors |

---

## 🔑 Kiến trúc Characteristics / Architecture Characteristics

### Prioritized Success Criteria

| Priority | Characteristic | Ý nghĩa / Meaning |
|----------|----------------|-------------------|
| 1 | **Real-Time Responsiveness** | Xử lý nhanh, độ trễ thấp |
| 2 | **Reliability & Consistency** | Không mất đơn, trạng thái nhất quán |
| 3 | **Scalability** | Mở rộng theo lượng khách |
| 4 | **Fault Tolerance (IoT)** | Xử lý lỗi thiết bị IoT |
| 5 | **Availability** | Uptime cao trong giờ kinh doanh |
| 6 | **Maintainability** | Dễ bảo trì và mở rộng |
| 7 | **Security** | Xác thực và phân quyền |
| 8 | **Observability** | Giám sát và cảnh báo |

---

## 🔄 Key Events / Sự kiện chính

| Event | Publisher | Subscribers | Purpose |
|-------|-----------|-------------|---------|
| **OrderPlaced** | Ordering Service | Kitchen Service, Analytics | Đơn hàng mới |
| **OrderInProgress** | Kitchen Service | Dashboard, Notification | Đang chế biến |
| **OrderCompleted** | Kitchen Service | Notification, Analytics | Hoàn thành |
| **InventoryLow** | Inventory Service | Manager Dashboard, Notification | Tồn kho thấp |
| **TemperatureAlert** | IoT Gateway | Notification Service | Cảnh báo nhiệt độ |

---

## 🛠️ Technology Stack

### Backend
- **Architecture**: Microservices + Event-Driven
- **Communication**: REST/gRPC (sync), Event Bus (async)
- **Message Broker**: Kafka / RabbitMQ
- **API Gateway**: Centralized entry point
- **Databases**: Database per service pattern

### Infrastructure
- **Container Orchestration**: Kubernetes
- **Cloud Platform**: Cloud-native deployment
- **IoT Protocol**: MQTT, HTTP

### Observability
- **Monitoring**: Prometheus + Grafana
- **Logging**: Centralized logging
- **Alerting**: Real-time alerts

---

## 📖 Hướng dẫn Đọc / Reading Guide

### Cho người mới / For Beginners

1. Start with [System Context Diagram](diagrams/context/system-context.md) - Hiểu tổng quan
2. Read [Architecture Overview](architecture/01-overview.md) - Hiểu quyết định kiến trúc
3. View [Microservices Diagram](diagrams/architecture/microservices-overview.md) - Hiểu cấu trúc
4. View [Order Flow Sequence](diagrams/sequences/order-placement-flow.md) - Hiểu luồng xử lý

### Cho kỹ sư / For Engineers

1. Review all [Architecture Views](architecture/) - Chi tiết thiết kế
2. Study [Component Diagrams](diagrams/components/) - Cấu trúc service
3. Examine [Deployment Diagram](diagrams/deployment/kubernetes-deployment.md) - Hạ tầng
4. Review [Requirements Traceability](requirements/traceability-matrix.md) - Ánh xạ yêu cầu

### Cho quản lý / For Managers

1. Read [Main Report](report.md) - Báo cáo tổng thể
2. Review [Architecture Characteristics](architecture/02-architecture-characteristics.md) - Success criteria
3. View [System Context](diagrams/context/system-context.md) - Business context
4. Review [Functional Requirements](requirements/functional-requirements.md) - Chức năng

---

## 🎯 Project Status

| Phase | Status | Completion |
|-------|--------|------------|
| **Requirements Analysis** | ✅ Complete | 100% |
| **Architecture Design** | ✅ Complete | 100% |
| **Documentation & Diagrams** | 🚧 In Progress | 25% |
| **Implementation** | ⏳ Not Started | 0% |
| **Testing** | ⏳ Not Started | 0% |
| **Deployment** | ⏳ Not Started | 0% |

---

## 📝 Document Conventions

### Diagram Format
- **Tool**: Mermaid (`.md` files)
- **Preview**: VS Code with "Mermaid Preview" extension
- **Rendering**: Native GitHub rendering
- **Export**: PNG/SVG for presentations

### Language
- **Primary**: Vietnamese (for academic context)
- **Technical terms**: English with Vietnamese translation
- **Code/Labels**: Bilingual format

### File Naming
- `{category}-{description}.md` for diagrams
- `{number}-{title}.md` for documentation
- Lowercase with hyphens

---

## 🤝 Contributing

This is an academic project for the Software Architecture course (Kiến trúc phần mềm).

### To add diagrams:
1. Create `.md` file in appropriate `diagrams/` subdirectory
2. Follow Mermaid syntax standards (see plan document)
3. Add bilingual labels (Vietnamese + English)
4. Include metadata header
5. Update this README with link

---

## 📞 Contact & Support

**Project**: IRMS - Intelligent Restaurant Management System
**Course**: Kiến trúc phần mềm (Software Architecture)
**Year**: 2026

---

## 📄 License

Academic Project - For Educational Purposes

---

**Last Updated**: 2026-02-21
**Version**: 0.1.0 (Documentation Phase)
