---
title: Deployment View - Infrastructure Architecture
title_vi: Góc nhìn Triển khai - Kiến trúc Hạ tầng
description: Physical deployment, cloud infrastructure, Kubernetes architecture, and operational concerns for IRMS
related_requirements: NFR3, NFR4, NFR6, NFR8, ADR-006
related_diagrams: ../diagrams/deployment/kubernetes-deployment.md
last_updated: 2026-02-21
---

# Deployment View - Infrastructure Architecture
# Góc nhìn Triển khai - Kiến trúc Hạ tầng

**Project**: IRMS - Intelligent Restaurant Management System
**Last Updated**: 2026-02-21
**Status**: Design Complete

---

## Table of Contents / Mục lục

1. [Introduction](#introduction)
2. [Deployment Strategy](#deployment-strategy)
3. [Cloud Architecture](#cloud-architecture)
4. [Kubernetes Cluster Design](#kubernetes-cluster-design)
5. [Networking Architecture](#networking-architecture)
6. [Storage Architecture](#storage-architecture)
7. [High Availability & Disaster Recovery](#high-availability--disaster-recovery)
8. [Security Infrastructure](#security-infrastructure)
9. [Observability Stack](#observability-stack)
10. [Resource Allocation](#resource-allocation)
11. [Cost Optimization](#cost-optimization)
12. [Deployment Pipeline](#deployment-pipeline)

---

## Introduction
## Giới thiệu

### Purpose / Mục đích

The **Deployment View** (Allocation View) describes the physical infrastructure and deployment architecture of IRMS, focusing on:

Góc nhìn Triển khai mô tả hạ tầng vật lý và kiến trúc triển khai của IRMS, tập trung vào:

- **Hardware/Cloud Resources**: Servers, clusters, edge devices
- **Software Allocation**: Which services run on which nodes
- **Networking**: VPCs, subnets, load balancers, firewalls
- **Storage**: Databases, object storage, persistent volumes
- **Operational Concerns**: Monitoring, logging, backups, scaling

### Deployment Philosophy / Triết lý Triển khai

**Cloud-Native on Kubernetes** with the following principles:

- **Infrastructure as Code (IaC)**: All infrastructure defined in Git (Terraform/Pulumi)
- **Declarative Configuration**: Kubernetes manifests for all services
- **Auto-Scaling**: HPA (Horizontal Pod Autoscaler) based on CPU/memory
- **Self-Healing**: Automatic restart of failed pods
- **Rolling Updates**: Zero-downtime deployments
- **Observability**: Built-in monitoring, logging, tracing

See visual diagram: [Kubernetes Deployment](../diagrams/deployment/kubernetes-deployment.md)

---

## Deployment Strategy
## Chiến lược Triển khai

### Deployment Model / Mô hình Triển khai

**Hybrid Cloud + Edge Architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Cloud (AWS/GCP/Azure)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Kubernetes Cluster                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  Ordering    │  │   Kitchen    │  │  Inventory   │    │ │
│  │  │  Service     │  │   Service    │  │  Service     │    │ │
│  │  │  (5 pods)    │  │  (3 pods)    │  │  (2 pods)    │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Notification │  │  Analytics   │  │    Auth      │    │ │
│  │  │  Service     │  │   Service    │  │   Service    │    │ │
│  │  │  (2 pods)    │  │  (2 pods)    │  │  (2 pods)    │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         Kafka Cluster (3 brokers)                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │   Databases (PostgreSQL, InfluxDB, Redis)            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ Internet / VPN
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    Restaurant Edge Network                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │   Tablets    │  │  IoT Gateway │  │ KDS Displays │    │ │
│  │  │  (10-20)     │  │  (2 pods)    │  │  (5-10)      │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │  IoT Sensors (Temperature, Load-Cell)              │   │ │
│  │  │  (50-100 devices)                                  │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Deployment Layers / Các Lớp Triển khai

| Layer | Location | Components | Rationale |
|-------|----------|------------|-----------|
| **Cloud Layer** | AWS/GCP/Azure | Core microservices, Kafka, databases | Scalability, managed services, high availability |
| **Edge Layer** | On-Premise (Restaurant) | IoT Gateway, local cache | Low latency, offline resilience, protocol translation |
| **Client Layer** | On-Premise (Restaurant) | Tablets, KDS, IoT sensors | User interfaces, data collection |

---

## Cloud Architecture
## Kiến trúc Cloud

### Cloud Provider Selection / Lựa chọn Cloud Provider

**Primary Option**: **AWS** (Amazon Web Services)

**Rationale**:
- ✅ Mature Kubernetes service (EKS - Elastic Kubernetes Service)
- ✅ Comprehensive managed services (RDS, MSK for Kafka, ElastiCache for Redis)
- ✅ Strong networking (VPC, ALB, NLB)
- ✅ Global presence (multiple regions)
- ✅ Competitive pricing for startups

**Alternative**: GCP (Google Kubernetes Engine) or Azure (AKS)

### AWS Services Used / Dịch vụ AWS Sử dụng

| AWS Service | IRMS Component | Purpose |
|-------------|----------------|---------|
| **EKS** | Kubernetes cluster | Managed Kubernetes control plane |
| **EC2** | Worker nodes | Compute instances for pods |
| **RDS for PostgreSQL** | Ordering, Kitchen, Auth databases | Managed relational database |
| **MSK** (Managed Streaming for Kafka) | Event Bus | Managed Kafka cluster |
| **ElastiCache for Redis** | Cache layer | In-memory caching |
| **ALB** (Application Load Balancer) | Ingress | HTTPS load balancing, SSL termination |
| **Route 53** | DNS | Domain name management |
| **S3** | Object storage | Backups, logs, static assets |
| **CloudWatch** | Monitoring | Metrics, logs, alarms |
| **IAM** | Identity & Access | Service accounts, roles |
| **VPC** | Networking | Isolated network, subnets |
| **Secrets Manager** | Secrets | Database passwords, API keys |

### Cloud Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          AWS Region (us-east-1)                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                       VPC (10.0.0.0/16)                     │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │       Public Subnet (10.0.1.0/24)                   │   │  │
│  │  │  ┌────────────────┐  ┌────────────────┐            │   │  │
│  │  │  │  Application   │  │  NAT Gateway   │            │   │  │
│  │  │  │  Load Balancer │  │                │            │   │  │
│  │  │  └────────────────┘  └────────────────┘            │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                         │                                   │  │
│  │  ┌──────────────────────┴──────────────────────────────┐   │  │
│  │  │       Private Subnet 1 (10.0.10.0/24)               │   │  │
│  │  │  ┌────────────────────────────────────────────────┐ │   │  │
│  │  │  │       EKS Cluster (Control Plane)              │ │   │  │
│  │  │  │  ┌──────────────┐  ┌──────────────┐           │ │   │  │
│  │  │  │  │ Worker Node 1│  │ Worker Node 2│           │ │   │  │
│  │  │  │  │  (m5.xlarge) │  │  (m5.xlarge) │  ...      │ │   │  │
│  │  │  │  │              │  │              │           │ │   │  │
│  │  │  │  │ - Ordering   │  │ - Kitchen    │           │ │   │  │
│  │  │  │  │ - Inventory  │  │ - Analytics  │           │ │   │  │
│  │  │  │  └──────────────┘  └──────────────┘           │ │   │  │
│  │  │  └────────────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │       Private Subnet 2 (10.0.20.0/24)               │   │  │
│  │  │  ┌────────────────────────────────────────────────┐ │   │  │
│  │  │  │         Data Layer                             │ │   │  │
│  │  │  │  ┌──────────────┐  ┌──────────────┐           │ │   │  │
│  │  │  │  │ RDS Postgres │  │  MSK Kafka   │           │ │   │  │
│  │  │  │  │ (Multi-AZ)   │  │  (3 brokers) │           │ │   │  │
│  │  │  │  └──────────────┘  └──────────────┘           │ │   │  │
│  │  │  │                                                │ │   │  │
│  │  │  │  ┌──────────────┐                             │ │   │  │
│  │  │  │  │ ElastiCache  │                             │ │   │  │
│  │  │  │  │ Redis        │                             │ │   │  │
│  │  │  │  └──────────────┘                             │ │   │  │
│  │  │  └────────────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ Internet Gateway
                            │
                            ▼
                      [Internet]
```

---

## Kubernetes Cluster Design
## Thiết kế Kubernetes Cluster

### Cluster Specifications / Thông số Cluster

| Component | Specification | Rationale |
|-----------|---------------|-----------|
| **Kubernetes Version** | 1.28+ | Latest stable, long-term support |
| **Control Plane** | Managed by EKS | AWS handles control plane (HA, upgrades) |
| **Worker Nodes** | 3-10 nodes (auto-scaling) | Scale based on load |
| **Node Type** | m5.xlarge (4 vCPU, 16 GB RAM) | Balanced compute/memory |
| **Node OS** | Amazon Linux 2 | Optimized for AWS |
| **Container Runtime** | containerd | CRI-compliant, lightweight |
| **CNI Plugin** | AWS VPC CNI | Native AWS networking |

### Node Pools / Nhóm Node

| Node Pool | Type | Min | Max | Use Case |
|-----------|------|-----|-----|----------|
| **General Purpose** | m5.xlarge | 3 | 10 | Most microservices |
| **Memory Optimized** (future) | r5.large | 0 | 3 | Analytics Service (ML workloads) |
| **Spot Instances** (future) | m5.xlarge (spot) | 0 | 5 | Non-critical workloads (cost saving) |

### Pod Placement / Phân bổ Pod

**Strategy**: **Anti-Affinity** for high availability

```yaml
# Example: Ordering Service anti-affinity
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - ordering-service
        topologyKey: kubernetes.io/hostname
```

**Result**: Pods of same service spread across different nodes (avoid single point of failure)

### Resource Requests & Limits / Yêu cầu & Giới hạn Tài nguyên

| Service | CPU Request | CPU Limit | Memory Request | Memory Limit | Replicas |
|---------|-------------|-----------|----------------|--------------|----------|
| **Ordering** | 500m | 2000m | 512 Mi | 2 Gi | 2-5 (HPA) |
| **Kitchen** | 500m | 1500m | 512 Mi | 1 Gi | 2-3 (HPA) |
| **Inventory** | 250m | 1000m | 256 Mi | 1 Gi | 2 (static) |
| **Notification** | 100m | 500m | 128 Mi | 512 Mi | 2 (static) |
| **Analytics** | 1000m | 3000m | 1 Gi | 4 Gi | 1-2 (HPA) |
| **Auth** | 250m | 1000m | 256 Mi | 1 Gi | 2 (static) |
| **IoT Gateway** | 500m | 1500m | 512 Mi | 1 Gi | 2 (static) |

**Units**:
- `m` = milliCPU (1000m = 1 vCPU)
- `Mi` = Mebibyte, `Gi` = Gibibyte

### Horizontal Pod Autoscaling (HPA)

**Metrics**: CPU utilization, custom metrics (requests/sec)

```yaml
# Example: Ordering Service HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ordering-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ordering-service
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
```

**Scaling Behavior**:
- **Scale Up**: When CPU > 70% for 30 seconds
- **Scale Down**: When CPU < 50% for 5 minutes (avoid flapping)

---

## Networking Architecture
## Kiến trúc Mạng

### Network Topology / Cấu trúc Mạng

#### VPC Design / Thiết kế VPC

| Subnet Type | CIDR Block | Purpose | Internet Access |
|-------------|------------|---------|-----------------|
| **Public Subnet** | 10.0.1.0/24 | Load Balancer, NAT Gateway | ✅ Yes (Internet Gateway) |
| **Private Subnet 1** | 10.0.10.0/24 | EKS worker nodes (services) | ⚠️ Via NAT Gateway |
| **Private Subnet 2** | 10.0.20.0/24 | Databases, Kafka, Redis | ❌ No (isolated) |

#### Load Balancer Architecture

```
                    [Internet]
                        │
                        ▼
          ┌─────────────────────────┐
          │  Application            │
          │  Load Balancer (ALB)    │
          │  - HTTPS (443)          │
          │  - SSL Termination      │
          └────────────┬────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Ingress     │ │ Ingress     │ │ Ingress     │
│ Controller  │ │ Controller  │ │ Controller  │
│ (NGINX)     │ │ (NGINX)     │ │ (NGINX)     │
│ Pod 1       │ │ Pod 2       │ │ Pod 3       │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       └───────────────┼───────────────┘
                       │ Route by path/host
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Ordering   │ │  Kitchen    │ │  Analytics  │
│  Service    │ │  Service    │ │  Service    │
│  (ClusterIP)│ │  (ClusterIP)│ │  (ClusterIP)│
└─────────────┘ └─────────────┘ └─────────────┘
```

#### Service Types / Các Loại Service

| Service | Kubernetes Type | Exposure | Access |
|---------|-----------------|----------|--------|
| **Ingress Controller** | LoadBalancer | External | ALB → Internet |
| **Microservices** | ClusterIP | Internal | Within cluster only |
| **Kafka** | ClusterIP | Internal | Services only |
| **Databases** | External (AWS RDS) | Internal | VPC private subnet |

#### DNS & Service Discovery

**Internal DNS**: CoreDNS (Kubernetes default)

**Service Discovery**:
```
# Services accessible via DNS:
ordering-service.default.svc.cluster.local:8080
kitchen-service.default.svc.cluster.local:8080
auth-service.default.svc.cluster.local:8080
```

**External DNS**: Route 53
```
api.irms.example.com  →  ALB  →  Ingress Controller
```

#### Network Policies / Chính sách Mạng

**Principle**: **Zero Trust Network** (deny by default, allow explicitly)

```yaml
# Example: Allow Ordering Service to call Auth Service only
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ordering-to-auth
spec:
  podSelector:
    matchLabels:
      app: ordering-service
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: auth-service
    ports:
    - protocol: TCP
      port: 8080
```

**Benefits**:
- ✅ Prevent lateral movement (if one service compromised)
- ✅ Reduce attack surface
- ✅ Compliance (PCI DSS, GDPR)

---

## Storage Architecture
## Kiến trúc Lưu trữ

### Database Deployment / Triển khai Database

| Database | Deployment Model | Hosting | Backup Strategy |
|----------|------------------|---------|-----------------|
| **PostgreSQL** (Ordering, Kitchen, Auth) | RDS Multi-AZ | AWS RDS | Automated daily snapshots, 7-day retention |
| **InfluxDB** (Inventory) | Self-hosted in K8s | Kubernetes StatefulSet | S3 backups every 6 hours |
| **Redis** (Cache) | ElastiCache | AWS ElastiCache | No backups (cache only, can be rebuilt) |
| **BigQuery** (Analytics) | Managed | Google Cloud | Automatic (managed by GCP) |

### Persistent Volume Claims (PVCs)

**Use Cases**: Stateful applications (databases, Kafka, logging)

| Application | Storage Class | Size | IOPS | Backup |
|-------------|---------------|------|------|--------|
| **Kafka (MSK)** | gp3 (SSD) | 500 GB per broker | 3000 | Managed by AWS |
| **InfluxDB** | gp3 (SSD) | 300 GB | 3000 | S3 snapshots |
| **Prometheus** | gp3 (SSD) | 100 GB | 1000 | S3 snapshots |
| **Elasticsearch** | gp3 (SSD) | 200 GB | 3000 | S3 snapshots |

**Storage Classes** (AWS EBS):
- **gp3**: General Purpose SSD (balanced price/performance)
- **io2**: Provisioned IOPS SSD (high performance, expensive)
- **sc1**: Cold HDD (infrequent access, cheap)

### Object Storage (S3)

| Bucket | Purpose | Lifecycle Policy |
|--------|---------|------------------|
| **irms-backups** | Database backups | Glacier after 30 days, delete after 1 year |
| **irms-logs** | Archived logs | Glacier after 90 days, delete after 2 years |
| **irms-static** | Menu images, assets | Standard storage, CDN (CloudFront) |

---

## High Availability & Disaster Recovery
## Tính Sẵn sàng Cao & Khôi phục Thảm họa

### High Availability Design / Thiết kế Tính Sẵn sàng Cao

**Target**: **99.9% uptime** (< 45 minutes downtime per month)

#### Multi-AZ Deployment

```
AWS Region: us-east-1
├── Availability Zone A (us-east-1a)
│   ├── EKS Worker Node 1
│   ├── RDS Primary Instance
│   └── MSK Broker 1
│
├── Availability Zone B (us-east-1b)
│   ├── EKS Worker Node 2
│   ├── RDS Standby Replica
│   └── MSK Broker 2
│
└── Availability Zone C (us-east-1c)
    ├── EKS Worker Node 3
    └── MSK Broker 3
```

**Benefit**: If one AZ fails, services continue in other AZs

#### Service Redundancy

| Component | Redundancy Strategy | Failover Time |
|-----------|---------------------|---------------|
| **Microservices** | 2-5 replicas per service, spread across AZs | < 30 seconds (K8s auto-restart) |
| **Databases** | RDS Multi-AZ (primary + standby) | < 1 minute (automatic failover) |
| **Kafka** | 3 brokers, replication factor 3 | < 30 seconds (leader election) |
| **Load Balancer** | ALB with 2+ targets per AZ | Instant (health checks) |
| **Redis** | ElastiCache with Read Replica | < 1 minute (manual promotion) |

### Disaster Recovery Strategy / Chiến lược Khôi phục Thảm họa

**Disaster Scenario**: Entire AWS region goes down (rare, but possible)

**RPO** (Recovery Point Objective): **1 hour** (max data loss)
**RTO** (Recovery Time Objective): **4 hours** (max downtime)

#### Backup Strategy

| Component | Backup Frequency | Retention | Storage Location |
|-----------|------------------|-----------|------------------|
| **Databases** | Daily (automated) | 7 days | S3 (cross-region replication) |
| **Kafka Topics** | Continuous (replication) | 7 days | MSK managed |
| **Infrastructure Config** | Every commit | Forever | GitHub (GitOps) |
| **Container Images** | Every build | 30 days | ECR (cross-region replication) |

#### Disaster Recovery Process

1. **Detection**: CloudWatch alarm triggers PagerDuty alert (< 5 minutes)
2. **Decision**: Ops team declares disaster (30 minutes)
3. **Failover**: Switch DNS (Route 53) to secondary region (1 hour)
4. **Restore**: Deploy services in secondary region from backups (2 hours)
5. **Verification**: Run smoke tests, gradual traffic shift (1 hour)

**Total RTO**: **4 hours** ✅

---

## Security Infrastructure
## Hạ tầng Bảo mật

### Security Layers / Các Lớp Bảo mật

#### 1. Network Security / Bảo mật Mạng

| Security Control | Implementation | Purpose |
|------------------|----------------|---------|
| **VPC Isolation** | Private subnets, no public IPs | Services not directly accessible from Internet |
| **Security Groups** | Firewall rules per component | Allow only necessary ports (e.g., 8080 for services) |
| **Network Policies** | Kubernetes NetworkPolicy | Pod-to-pod access control |
| **DDoS Protection** | AWS Shield Standard | Protect against volumetric attacks |
| **WAF** (future) | AWS WAF on ALB | Block SQL injection, XSS |

#### 2. Identity & Access Management / Quản lý Truy cập

| Control | Implementation | Purpose |
|---------|----------------|---------|
| **Service Accounts** | Kubernetes ServiceAccount + IAM Roles | Least privilege access for pods |
| **RBAC** | Kubernetes Role-Based Access Control | Restrict kubectl access |
| **Secrets Management** | AWS Secrets Manager + External Secrets Operator | Secure storage of passwords, API keys |
| **Image Signing** | Cosign (Sigstore) | Verify container image authenticity |

#### 3. Encryption / Mã hóa

| Data State | Encryption Method | Key Management |
|------------|-------------------|----------------|
| **In Transit** | TLS 1.3 (ALB, services) | AWS Certificate Manager (ACM) |
| **At Rest** | EBS encryption, RDS encryption | AWS KMS (Key Management Service) |
| **Application Secrets** | AES-256 encryption | AWS Secrets Manager |

#### 4. Vulnerability Management / Quản lý Lỗ hổng

| Control | Tool | Frequency |
|---------|------|-----------|
| **Container Scanning** | Trivy, Snyk | Every build |
| **Dependency Scanning** | Dependabot, Snyk | Weekly |
| **Kubernetes Config Audit** | kube-bench, Polaris | Monthly |
| **Penetration Testing** | Third-party audit | Annually |

---

## Observability Stack
## Stack Giám sát

### Monitoring Architecture / Kiến trúc Giám sát

```
┌──────────────────────────────────────────────────────────────┐
│                    Observability Stack                        │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Prometheus   │  │  Elasticsearch │  │     Jaeger     │ │
│  │   (Metrics)    │  │    (Logs)      │  │   (Traces)     │ │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘ │
│           │                   │                   │          │
│           └───────────────────┼───────────────────┘          │
│                               │                              │
│                               ▼                              │
│                      ┌────────────────┐                      │
│                      │    Grafana     │                      │
│                      │  (Dashboards)  │                      │
│                      └────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
                               ▲
                               │ Collect metrics/logs/traces
                               │
┌──────────────────────────────┼────────────────────────────────┐
│                Kubernetes Cluster                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Ordering │  │ Kitchen │  │ Inventory│  │Analytics│  ...     │
│  │Service  │  │ Service │  │ Service  │  │ Service │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└───────────────────────────────────────────────────────────────┘
```

### Observability Components / Các Thành phần Giám sát

| Component | Purpose | Deployment | Storage |
|-----------|---------|------------|---------|
| **Prometheus** | Collect metrics (CPU, memory, custom) | K8s StatefulSet (3 replicas) | Local PVC (100 GB) |
| **Grafana** | Visualize metrics, dashboards | K8s Deployment (2 replicas) | PostgreSQL (config) |
| **Elasticsearch** | Store logs (centralized logging) | AWS OpenSearch Service | Managed (200 GB) |
| **Logstash/Fluentd** | Ship logs to Elasticsearch | K8s DaemonSet (on every node) | None (stateless) |
| **Jaeger** | Distributed tracing | K8s Deployment (2 replicas) | Elasticsearch backend |
| **AlertManager** | Alert routing (PagerDuty, Slack) | K8s Deployment (2 replicas) | None (stateless) |

### Key Dashboards / Dashboard Chính

| Dashboard | Metrics | Audience |
|-----------|---------|----------|
| **System Health** | CPU, memory, disk, network per service | Ops team |
| **Business Metrics** | Orders/min, revenue, avg order value | Managers |
| **SLA Compliance** | API latency P50/P95/P99, error rate | Ops + Product |
| **Kafka Health** | Broker lag, partition count, throughput | Ops team |
| **Database Performance** | Query time, connection pool, deadlocks | DBAs |

### Alerting Rules / Quy tắc Cảnh báo

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| **Service Down** | 0 healthy pods for 2 minutes | Critical | PagerDuty (wake up on-call) |
| **High Latency** | P95 > 2 seconds for 5 minutes | High | Slack notification |
| **High Error Rate** | 5xx errors > 5% for 5 minutes | High | Slack + Email |
| **Disk Full** | Disk usage > 85% | Medium | Slack notification |
| **Certificate Expiry** | SSL cert expires in 7 days | Medium | Email to ops team |

---

## Resource Allocation
## Phân bổ Tài nguyên

### Total Resource Requirements / Tổng Tài nguyên Yêu cầu

**Peak Load** (lunch/dinner rush, 100+ orders/minute):

| Category | CPU (vCPU) | Memory (GB) | Storage (GB) |
|----------|------------|-------------|--------------|
| **Microservices** | 16 vCPU | 32 GB | 50 GB (ephemeral) |
| **Databases** | 8 vCPU | 32 GB | 1500 GB (persistent) |
| **Kafka** | 6 vCPU | 24 GB | 1500 GB (persistent) |
| **Redis** | 2 vCPU | 8 GB | 50 GB (persistent) |
| **Observability** | 6 vCPU | 16 GB | 400 GB (persistent) |
| **Total** | **38 vCPU** | **112 GB** | **3500 GB** |

**Kubernetes Cluster Size**:
- **Worker Nodes**: 5 x m5.xlarge (4 vCPU, 16 GB each) = 20 vCPU, 80 GB
- **Overhead**: K8s system pods (kubelet, kube-proxy, CNI) = 2 vCPU, 4 GB
- **Available**: 18 vCPU, 76 GB (sufficient with auto-scaling to 10 nodes)

### Cost Estimate / Ước tính Chi phí

**Monthly AWS Cost** (us-east-1 region, reserved instances):

| Component | Specification | Monthly Cost (USD) |
|-----------|---------------|--------------------|
| **EKS Cluster** | Control plane | $73 |
| **EC2 Instances** | 5 x m5.xlarge (on-demand) | $600 |
| **RDS PostgreSQL** | db.m5.large Multi-AZ | $350 |
| **MSK Kafka** | 3 x kafka.m5.large | $900 |
| **ElastiCache Redis** | cache.m5.large | $150 |
| **ALB** | Application Load Balancer | $20 |
| **Data Transfer** | 1 TB/month outbound | $90 |
| **S3 Storage** | 500 GB backups | $12 |
| **CloudWatch** | Logs, metrics | $50 |
| **Route 53** | DNS queries | $5 |
| **Total** | | **~$2,250/month** |

**Cost Optimization** (future):
- **Reserved Instances**: 40% savings on EC2 ($240/month saved)
- **Savings Plans**: 20% savings on EKS, RDS ($60/month saved)
- **Spot Instances**: 70% savings on non-critical workloads ($150/month saved)
- **Right-Sizing**: Adjust instance types based on actual usage ($100/month saved)

**Optimized Monthly Cost**: **~$1,700/month**

---

## Deployment Pipeline
## Pipeline Triển khai

### CI/CD Workflow / Quy trình CI/CD

**Tool**: GitHub Actions (or GitLab CI, Jenkins)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CI/CD Pipeline                           │
│                                                                  │
│  1. Developer pushes code to GitHub                             │
│                    │                                            │
│                    ▼                                            │
│  2. GitHub Actions triggered                                    │
│     ├─ Run unit tests (JUnit, pytest)                          │
│     ├─ Run integration tests (Testcontainers)                  │
│     ├─ Code quality check (SonarQube)                          │
│     ├─ Security scan (Trivy, Snyk)                             │
│     └─ Build Docker image                                      │
│                    │                                            │
│                    ▼                                            │
│  3. Push image to ECR (Elastic Container Registry)             │
│     - Tag: <service>:<git-sha>                                 │
│                    │                                            │
│                    ▼                                            │
│  4. Update Kubernetes manifest (GitOps - ArgoCD)               │
│     - Update image tag in deployment.yaml                      │
│     - Commit to infra repo                                     │
│                    │                                            │
│                    ▼                                            │
│  5. ArgoCD detects change                                      │
│     - Sync Kubernetes cluster with Git                         │
│     - Rolling update (zero-downtime)                           │
│                    │                                            │
│                    ▼                                            │
│  6. Post-deployment checks                                     │
│     ├─ Smoke tests (Postman/Newman)                            │
│     ├─ Health check (readiness probe)                          │
│     └─ Rollback if tests fail                                  │
│                    │                                            │
│                    ▼                                            │
│  7. Deployment complete ✅                                      │
│     - Slack notification to team                               │
│     - Update status dashboard                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Deployment Strategies / Chiến lược Triển khai

| Strategy | Description | Use Case | Rollback Time |
|----------|-------------|----------|---------------|
| **Rolling Update** | Gradually replace pods (default K8s) | Most services | < 2 minutes |
| **Blue-Green** | Deploy new version alongside old, switch traffic | Critical services (Auth, Ordering) | Instant (DNS switch) |
| **Canary** | Route 10% traffic to new version, gradually increase | High-risk changes | < 5 minutes |

### Environment Promotion / Phát triển Môi trường

```
Dev → Staging → Production

1. Dev Environment (Local)
   - Developer laptop (Docker Compose)
   - Fast iteration, no CI/CD

2. Staging Environment (K8s)
   - Smaller cluster (2 nodes)
   - Auto-deployed on PR merge
   - Integration tests run here

3. Production Environment (K8s)
   - Full cluster (5-10 nodes)
   - Manual approval required (GitHub workflow)
   - Blue-green deployment
```

---

## Conclusion / Kết luận

The Deployment View demonstrates how IRMS is deployed with:

- ✅ **Cloud-Native**: Kubernetes on AWS EKS for scalability and automation
- ✅ **High Availability**: Multi-AZ deployment, service redundancy (99.9% uptime)
- ✅ **Disaster Recovery**: Cross-region backups, 4-hour RTO, 1-hour RPO
- ✅ **Security**: Network isolation, encryption, secrets management, vulnerability scanning
- ✅ **Observability**: Prometheus + Grafana + ELK + Jaeger for full visibility
- ✅ **Cost-Effective**: ~$1,700/month with optimization (scalable to multi-location)

Key infrastructure decisions:
- **Managed Services**: RDS, MSK, ElastiCache reduce operational burden
- **Kubernetes**: Auto-scaling, self-healing, rolling updates
- **GitOps**: Infrastructure as Code (IaC) with Terraform, ArgoCD for deployments
- **Multi-AZ**: High availability within region, cross-region backup for DR

See related views:
- [Module View](03-module-view.md) - Service decomposition
- [Component & Connector View](04-component-connector-view.md) - Runtime interactions
- [Runtime Scenarios](06-runtime-scenarios.md) - End-to-end workflows

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Authors**: IRMS Architecture Team
**Status**: ✅ Complete
