---
title: Auth Service Component Diagram
description: Authentication and authorization with JWT and RBAC
scenario: User authentication and access control
related_requirements: NFR5 (Security)
service: User & Access Management Service
last_updated: 2026-02-21
---

# Auth Service Component Diagram
## Sơ đồ Thành phần Dịch vụ Xác thực

```mermaid
graph TB
    subgraph "Auth Service"
        subgraph "API Layer"
            AuthController["🔐 Auth Controller<br/><br/>POST /auth/login<br/>POST /auth/logout<br/>POST /auth/refresh<br/>GET /auth/validate"]
        end

        subgraph "Application Layer"
            AuthService["🔑 Auth Service<br/><br/>• login()<br/>• logout()<br/>• refreshToken()<br/>• validateToken()"]
            
            TokenManager["🎫 Token Manager<br/><br/>• generateJWT()<br/>• verifyJWT()<br/>• revokeToken()"]
            
            RBACService["👥 RBAC Service<br/><br/>• checkPermission()<br/>• getUserRoles()<br/>• assignRole()"]
        end

        subgraph "Domain"
            User["👤 User<br/>Entity<br/><br/>• userId<br/>• username<br/>• passwordHash<br/>• roles[]"]
            
            Role["👔 Role<br/>Entity<br/><br/>• roleId<br/>• roleName<br/>• permissions[]"]
            
            JWT["🎫 JWT Token<br/>Value Object<br/><br/>• userId<br/>• roles<br/>• expiration"]
        end

        subgraph "Infrastructure"
            UserRepo["💾 User Repository<br/>(PostgreSQL)"]
            Redis["⚡ Redis<br/>(Token blacklist)"]
            PasswordHasher["🔒 BCrypt Hasher"]
        end
    end

    AuthController --> AuthService
    AuthService --> TokenManager
    AuthService --> RBACService
    
    AuthService --> User
    RBACService --> Role
    TokenManager --> JWT
    
    User --> UserRepo
    AuthService --> PasswordHasher
    TokenManager --> Redis

    style AuthService fill:#4CAF50,stroke:#2E7D32
    style User fill:#9C27B0,stroke:#6A1B9A
    style TokenManager fill:#FF9800,stroke:#E65100
```

---

## JWT Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid-123",
    "username": "manager@irms.com",
    "roles": ["MANAGER", "STAFF"],
    "iat": 1708502400,
    "exp": 1708506000
  },
  "signature": "..."
}
```

## RBAC Matrix

| Role | Orders | Kitchen | Inventory | Analytics | Config |
|------|--------|---------|-----------|-----------|--------|
| **Customer** | Create own | - | - | - | - |
| **Waiter** | View all | View | - | View | - |
| **Chef** | View | Update | - | - | - |
| **Manager** | All | All | All | All | All |

---

## Password Security

```java
@Service
public class PasswordService {
    private final BCryptPasswordEncoder encoder = 
        new BCryptPasswordEncoder(12);  // Cost factor: 12
    
    public String hash(String password) {
        return encoder.encode(password);
    }
    
    public boolean verify(String password, String hash) {
        return encoder.matches(password, hash);
    }
}
```

---

**Last Updated**: 2026-02-21
