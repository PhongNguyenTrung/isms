---
title: Analytics Dashboard Update (S5)
description: Real-time dashboard updates via event streaming
scenario: S5 - Manager Analytics Dashboard
related_requirements: FR12, FR13, FR14, NFR2 (Performance)
last_updated: 2026-02-21
---

# Analytics Dashboard Update (S5)
## Cập nhật Dashboard Phân tích (S5)

## Purpose / Mục đích
Demonstrates how manager dashboard receives real-time updates from all services via event streaming, providing live business insights.

---

```mermaid
sequenceDiagram
    participant M as 👔 Manager<br/>(Web Browser)
    participant WS as 🔌 WebSocket Server
    participant AS as 📊 Analytics Service
    participant EB as 📬 Event Bus
    participant Redis as ⚡ Redis Cache
    participant DW as 🏢 Data Warehouse

    Note over M,DW: Manager opens dashboard at 10:00 AM

    M->>WS: Connect WebSocket<br/>ws://dashboard.irms.local
    WS->>M: Connected (session-123)

    M->>AS: GET /api/dashboard/metrics
    AS->>Redis: Check cache
    alt Cache hit
        Redis-->>AS: Cached metrics (30s old)
    else Cache miss
        AS->>DW: Query aggregated data
        DW-->>AS: Result set
        AS->>Redis: Cache for 30s
    end
    AS-->>M: Dashboard data (JSON)

    M->>M: Render dashboard:<br/>• Orders today: 45<br/>• Revenue: $2,340<br/>• Avg wait: 12 min<br/>• Queue: 8 orders

    Note over M,DW: Real-time updates via events

    rect rgb(240, 255, 240)
    Note over EB,M: New Order Placed

    EB->>AS: OrderPlaced event
    AS->>AS: Update metrics:<br/>orders_today += 1<br/>revenue += order.amount
    
    AS->>Redis: Update cached metrics
    AS->>WS: Broadcast update
    WS->>M: Push: {orders: 46, revenue: 2490}
    M->>M: Update UI (no refresh!)
    end

    rect rgb(255, 245, 230)
    Note over EB,M: Order Completed

    EB->>AS: OrderCompleted event
    AS->>AS: Calculate metrics:<br/>avg_cook_time<br/>completed_orders += 1
    
    AS->>WS: Broadcast update
    WS->>M: Push: {completed: 46, avgTime: 13.2}
    M->>M: Update chart in real-time
    end

    Note over M,DW: ✅ Dashboard always current (< 1s latency)
```

---

## Dashboard Metrics

### Real-Time Metrics (via WebSocket)
- Orders per minute
- Current queue length
- Revenue counter
- Kitchen load status

### Aggregated Metrics (via API, cached 30s)
- Daily/weekly/monthly summaries
- Top menu items
- Peak hour analysis
- Table turnover rate

---

## WebSocket Protocol

```javascript
// Client-side
const ws = new WebSocket('ws://dashboard.irms.local/ws');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  
  switch(update.type) {
    case 'ORDER_METRIC':
      updateOrderCount(update.data.ordersToday);
      break;
    case 'REVENUE_METRIC':
      updateRevenue(update.data.totalRevenue);
      break;
    case 'QUEUE_METRIC':
      updateQueueLength(update.data.queueLength);
      break;
  }
};
```

---

**Last Updated**: 2026-02-21
**Status**: Production-Ready
