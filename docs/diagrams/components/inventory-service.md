---
title: Inventory Service Component Diagram
description: Internal structure handling stock monitoring and threshold alerts
scenario: Inventory management
related_requirements: FR6, FR9, FR10
service: Inventory Monitoring Service
last_updated: 2026-02-21
---

# Inventory Service Component Diagram
## Sơ đồ Thành phần Dịch vụ Tồn kho

```mermaid
graph TB
    subgraph "Inventory Service"
        subgraph "Event Consumer"
            EventListener["📥 Event Listener<br/><br/>Subscribes:<br/>• WeightReadingEvent<br/>• OrderPlaced"]
        end

        subgraph "Application Layer"
            StockManager["📦 Stock Manager<br/><br/>• updateLevel()<br/>• checkThreshold()<br/>• predictStockout()"]
            
            ThresholdMonitor["⚠️ Threshold Monitor<br/><br/>• detectLowStock()<br/>• calculateSeverity()<br/>• triggerAlerts()"]
            
            UsageTracker["📊 Usage Tracker<br/><br/>• trackConsumption()<br/>• calculateAverage()<br/>• predictDemand()"]
        end

        subgraph "Domain"
            Ingredient["📦 Ingredient<br/>Entity<br/><br/>• ingredientId<br/>• currentLevel<br/>• threshold<br/>• supplier"]
            
            StockReading["📊 Reading<br/>Value Object"]
        end

        subgraph "Infrastructure"
            InventoryRepo["💾 Repository<br/>(PostgreSQL)"]
            TimeSeriesDB["📈 InfluxDB<br/>(Time-series)"]
            EventPub["📬 Event Publisher"]
        end
    end

    EventListener --> StockManager
    StockManager --> ThresholdMonitor
    ThresholdMonitor --> UsageTracker
    
    StockManager --> Ingredient
    UsageTracker --> StockReading
    
    Ingredient --> InventoryRepo
    StockReading --> TimeSeriesDB
    ThresholdMonitor --> EventPub

    style StockManager fill:#4CAF50,stroke:#2E7D32
    style Ingredient fill:#9C27B0,stroke:#6A1B9A
```

---

## Key Algorithms

### Threshold Detection
```java
public AlertSeverity detectLowStock(Ingredient ingredient) {
    double percentage = ingredient.getCurrentLevel() / ingredient.getMaxCapacity();
    
    if (percentage < 0.20) return AlertSeverity.CRITICAL;
    if (percentage < 0.30) return AlertSeverity.WARNING;
    return AlertSeverity.NORMAL;
}
```

### Stockout Prediction
```java
public int predictStockoutDays(String ingredientId) {
    double currentLevel = getCurrentLevel(ingredientId);
    double avgDailyUsage = calculateAverageDailyUsage(ingredientId, 7);  // 7 days
    double threshold = getThreshold(ingredientId);
    
    return (int) ((currentLevel - threshold) / avgDailyUsage);
}
```

---

**Last Updated**: 2026-02-21
