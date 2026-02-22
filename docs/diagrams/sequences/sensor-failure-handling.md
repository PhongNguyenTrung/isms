---
title: Sensor Failure Handling (S4)
description: Fault tolerance when IoT devices disconnect or malfunction
scenario: S4 - Sensor Failure Handling
related_requirements: NFR4 (Fault Tolerance), FR9, FR11
last_updated: 2026-02-21
---

# Sensor Failure Handling (S4)
## Xử lý Lỗi Cảm biến (S4)

## Purpose / Mục đích
Demonstrates how IRMS maintains operation when IoT sensors fail, using edge buffering, retry mechanisms, and graceful degradation.

---

```mermaid
sequenceDiagram
    participant TS as 🌡️ Temp Sensor
    participant IoTGW as 🌐 IoT Gateway
    participant CB as ⚡ Circuit Breaker
    participant LB as 💾 Local Buffer
    participant EB as 📬 Event Bus
    participant IS as 📦 Inventory Service
    participant NS as 🔔 Notification Service
    participant M as 👔 Manager

    Note over TS,M: Normal Operation

    loop Every 60 seconds
        TS->>IoTGW: MQTT: Temperature reading
        IoTGW->>CB: Check cloud connection
        CB-->>IoTGW: CLOSED (OK)
        IoTGW->>EB: Publish event
        EB->>IS: Process reading
    end

    Note over TS,M: ⚠️ Network Failure Occurs

    TS-XTS: Network disconnected
    Note over TS: Sensor buffers readings<br/>to local SD card

    IoTGW-XEB: Cannot reach cloud
    CB->>CB: Failure count: 5<br/>State: OPEN
    
    IoTGW->>LB: Buffer events locally<br/>(10GB capacity)
    
    IoTGW->>NS: DeviceOffline alert
    NS->>M: 🚨 "Temp sensor offline"

    Note over TS,M: 5 minutes later - Network Restored

    TS->>IoTGW: Reconnect + replay buffer
    IoTGW->>CB: Test connection
    CB->>EB: Test publish
    EB-->>CB: Success
    CB->>CB: State: HALF_OPEN → CLOSED

    IoTGW->>EB: Replay buffered events
    EB->>IS: Process backlog
    
    IoTGW->>NS: DeviceOnline event
    NS->>M: ✅ "Sensor reconnected"

    Note over TS,M: ✅ System recovered - No data lost
```

---

## Circuit Breaker States

```java
public enum CircuitState {
    CLOSED,      // Normal operation
    OPEN,        // Cloud unavailable, buffer locally
    HALF_OPEN    // Testing if cloud recovered
}

public class CircuitBreaker {
    private CircuitState state = CircuitState.CLOSED;
    private int failureCount = 0;
    private static final int FAILURE_THRESHOLD = 5;
    private LocalDateTime openedAt;
    private static final Duration RETRY_TIMEOUT = Duration.ofMinutes(1);

    public void callCloud(Runnable action) {
        if (state == CircuitState.OPEN) {
            if (Duration.between(openedAt, LocalDateTime.now()).compareTo(RETRY_TIMEOUT) > 0) {
                state = CircuitState.HALF_OPEN;
            } else {
                edgeBuffer.buffer(action);
                return;
            }
        }

        try {
            action.run();
            if (state == CircuitState.HALF_OPEN) {
                state = CircuitState.CLOSED;
                failureCount = 0;
            }
        } catch (Exception e) {
            failureCount++;
            if (failureCount >= FAILURE_THRESHOLD) {
                state = CircuitState.OPEN;
                openedAt = LocalDateTime.now();
            }
            edgeBuffer.buffer(action);
        }
    }
}
```

---

## Edge Buffering Capacity

- **Buffer Size**: 10GB
- **Retention**: 7 days
- **Compression**: gzip (3x compression ratio)
- **Capacity**: ~1 million events

---

**Last Updated**: 2026-02-21
**Status**: Production-Ready
