---
title: Notification Service Component Diagram
description: Multi-channel notification delivery system
scenario: Alert distribution
related_requirements: FR5, FR8, FR10
service: Notification & Alert Service
last_updated: 2026-02-21
---

# Notification Service Component Diagram
## Sơ đồ Thành phần Dịch vụ Thông báo

```mermaid
graph TB
    subgraph "Notification Service"
        subgraph "Event Consumer"
            EventListener["📥 Event Listener<br/><br/>Subscribes to:<br/>• OrderCompleted<br/>• InventoryLow<br/>• TemperatureAlert<br/>• KitchenOverload"]
        end

        subgraph "Application Layer"
            NotificationManager["🔔 Notification Manager<br/><br/>• createNotification()<br/>• determineRecipients()<br/>• selectChannels()<br/>• prioritize()"]
            
            TemplateEngine["📝 Template Engine<br/><br/>• loadTemplate()<br/>• substituteVariables()<br/>• formatMessage()"]
            
            DeliveryRouter["🚦 Delivery Router<br/><br/>• routeByChannel()<br/>• batchMessages()<br/>• handleFailures()"]
        end

        subgraph "Channel Adapters"
            PushAdapter["📱 Push Notification<br/>(FCM/APNS)"]
            EmailAdapter["📧 Email<br/>(SendGrid)"]
            SMSAdapter["📱 SMS<br/>(Twilio)"]
            WebSocketAdapter["🔌 WebSocket<br/>(Dashboard)"]
        end

        subgraph "Domain"
            Notification["🔔 Notification<br/>Entity<br/><br/>• notificationId<br/>• recipientId<br/>• message<br/>• channel<br/>• status"]
        end

        subgraph "Infrastructure"
            NotifRepo["💾 Repository"]
            Redis["⚡ Redis<br/>(Retry Queue)"]
        end
    end

    EventListener --> NotificationManager
    NotificationManager --> TemplateEngine
    TemplateEngine --> DeliveryRouter
    
    DeliveryRouter --> PushAdapter
    DeliveryRouter --> EmailAdapter
    DeliveryRouter --> SMSAdapter
    DeliveryRouter --> WebSocketAdapter
    
    NotificationManager --> Notification
    Notification --> NotifRepo
    DeliveryRouter --> Redis

    style NotificationManager fill:#4CAF50,stroke:#2E7D32
    style Notification fill:#9C27B0,stroke:#6A1B9A
```

---

## Channel Selection Logic

```java
public List<Channel> selectChannels(AlertSeverity severity) {
    return switch (severity) {
        case CRITICAL -> List.of(PUSH, SMS, EMAIL, DASHBOARD);
        case HIGH -> List.of(PUSH, EMAIL, DASHBOARD);
        case MEDIUM -> List.of(PUSH, DASHBOARD);
        case LOW -> List.of(DASHBOARD);
    };
}
```

## Retry Logic

```java
@Retryable(
    value = {SendException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 1000, multiplier = 2)
)
public void send(Notification notification) {
    channelAdapter.send(notification);
}
```

---

**Last Updated**: 2026-02-21
