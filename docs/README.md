# IRMS Documentation

Architectural reference, requirements, and diagrams for the **Intelligent Restaurant Management System**.

> Looking for setup or quick start? See the [root README](../README.md).

---

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Architecture Views](#architecture-views)
- [Diagrams](#diagrams)
- [Full Report](#full-report)
- [Reading Guide](#reading-guide)
- [Conventions](#conventions)

---

## Overview

IRMS is structured as **Microservices + Event-Driven + IoT Gateway**. The seven backend services communicate asynchronously through Apache Kafka and synchronously through an Nginx API gateway. IoT devices ingress through Mosquitto (MQTT) and are normalized into Kafka by the iot-gateway service.

The companion documentation in this directory is organized into three layers:

1. **Requirements** — what the system must do (FR) and how well (NFR), with traceability back to architecture.
2. **Architecture views** — six perspectives following the IEEE 1471 view-and-viewpoint model.
3. **Diagrams** — Mermaid sources for context, components, sequences, data, and deployment.

---

## Requirements

| Document | Description |
| --- | --- |
| [Functional Requirements](requirements/functional-requirements.md) | FR1–FR14 — ordering, kitchen, inventory, dashboard |
| [Non-Functional Requirements](requirements/non-functional-requirements.md) | NFR1–NFR8 — latency, availability, scalability, security |
| [Traceability Matrix](requirements/traceability-matrix.md) | Requirements → architecture decisions → services |

**Critical NFRs:** order latency < 1 s · high availability during service hours · fault tolerance for IoT devices · horizontal scalability.

---

## Architecture Views

| # | View | Focus |
| --- | --- | --- |
| 1 | [Overview](architecture/01-overview.md) | Style selection, top-level decisions |
| 2 | [Architecture Characteristics](architecture/02-architecture-characteristics.md) | Prioritized success criteria |
| 3 | [Module View](architecture/03-module-view.md) | Service decomposition and ownership |
| 4 | [Component & Connector View](architecture/04-component-connector-view.md) | Runtime structure, ports, protocols |
| 5 | [Deployment View](architecture/05-deployment-view.md) | Containers, networks, scaling |
| 6 | [Runtime Scenarios](architecture/06-runtime-scenarios.md) | End-to-end flows for key use cases |

### Prioritized Architecture Characteristics

| Priority | Characteristic | Rationale |
| --- | --- | --- |
| 1 | Real-Time Responsiveness | Sub-second order propagation |
| 2 | Reliability & Consistency | No lost orders, consistent ticket state |
| 3 | Scalability | Handle peak service hours |
| 4 | Fault Tolerance (IoT) | Tolerate sensor and connectivity failures |
| 5 | Availability | High uptime during business hours |
| 6 | Maintainability | Independent service evolution |
| 7 | Security | JWT auth, role-based authorization |
| 8 | Observability | Health probes, structured logs, alerts |

---

## Diagrams

All diagrams are written in Mermaid and render natively on GitHub.

### Context

- [System Context](diagrams/context/system-context.md)

### Architecture

- [Microservices Overview](diagrams/architecture/microservices-overview.md)
- [Event-Driven Architecture](diagrams/architecture/event-driven-architecture.md)

### Components

- [Ordering Service](diagrams/components/ordering-service.md)
- [Kitchen Service](diagrams/components/kitchen-service.md)
- [IoT Gateway](diagrams/components/iot-gateway.md)
- [Inventory Service](diagrams/components/inventory-service.md)
- [Notification Service](diagrams/components/notification-service.md)
- [Analytics Service](diagrams/components/analytics-service.md)
- [Auth Service](diagrams/components/auth-service.md)

### Sequences

- [Order Placement Flow](diagrams/sequences/order-placement-flow.md)
- [Kitchen Overload Scenario](diagrams/sequences/kitchen-overload-scenario.md)
- [Inventory Alert Flow](diagrams/sequences/inventory-alert-flow.md)
- [Sensor Failure Handling](diagrams/sequences/sensor-failure-handling.md)
- [Analytics Dashboard Update](diagrams/sequences/analytics-dashboard-update.md)

### Data

- [Domain Model](diagrams/data/domain-model.md)
- [Event Schema](diagrams/data/event-schema.md)
- [Database per Service](diagrams/data/database-per-service.md)

### Deployment

- [Kubernetes Deployment](diagrams/deployment/kubernetes-deployment.md)

---

## Full Report

The complete architectural narrative — including ADRs, SOLID application, and a reflection — is in [`report.md`](report.md).

---

## Reading Guide

**New to the project**

1. [System Context Diagram](diagrams/context/system-context.md) — actors and boundaries.
2. [Architecture Overview](architecture/01-overview.md) — why microservices + event-driven.
3. [Microservices Overview](diagrams/architecture/microservices-overview.md) — the seven services at a glance.
4. [Order Placement Flow](diagrams/sequences/order-placement-flow.md) — a representative end-to-end path.

**Engineers implementing or extending a service**

1. The corresponding service README under [`services/`](../services/).
2. The relevant [component diagram](diagrams/components/).
3. [Component & Connector View](architecture/04-component-connector-view.md) for runtime contracts.
4. [Event Schema](diagrams/data/event-schema.md) when touching Kafka.

**Stakeholders evaluating the design**

1. [`report.md`](report.md).
2. [Architecture Characteristics](architecture/02-architecture-characteristics.md).
3. [Traceability Matrix](requirements/traceability-matrix.md).

---

## Conventions

- **Diagrams:** Mermaid `.md` files; renders on GitHub or with the VS Code "Mermaid Preview" extension.
- **File naming:** lowercase with hyphens; `NN-title.md` for ordered architecture views, `category-description.md` for diagrams.
- **Language:** documents authored in English. Course-context discussion in [`report.md`](report.md) may include Vietnamese annotations.

---

<sub>Document set maintained alongside source code. See the root [`README.md`](../README.md) for the runtime quick start.</sub>
