---
title: Analytics Service Component Diagram
description: Data aggregation, reporting, and ML-based predictions
scenario: Business intelligence
related_requirements: FR12, FR13, FR14
service: Analytics & Forecasting Service
last_updated: 2026-02-21
---

# Analytics Service Component Diagram
## Sơ đồ Thành phần Dịch vụ Phân tích

```mermaid
graph TB
    subgraph "Analytics Service"
        subgraph "Event Consumer"
            EventListener["📥 Event Listener<br/><br/>Subscribes to:<br/>• ALL events<br/>(complete event log)"]
        end

        subgraph "Application Layer"
            MetricsAggregator["📊 Metrics Aggregator<br/><br/>• aggregateRealTime()<br/>• calculateKPIs()<br/>• updateDashboard()"]
            
            ReportGenerator["📄 Report Generator<br/><br/>• generateDaily()<br/>• generateWeekly()<br/>• exportPDF()"]
            
            ForecastEngine["🔮 Forecast Engine<br/><br/>• predictBusyPeriods()<br/>• forecastDemand()<br/>• optimizeSchedule()"]
        end

        subgraph "ML Models"
            DemandPredictor["🤖 Demand Predictor<br/>(RandomForest)"]
            PeakDetector["📈 Peak Detector<br/>(Time Series)"]
        end

        subgraph "Domain"
            OrderMetrics["📊 Order Metrics"]
            KitchenMetrics["🍳 Kitchen Metrics"]
            RevenueMetrics["💰 Revenue Metrics"]
        end

        subgraph "Infrastructure"
            DataWarehouse["🏢 Data Warehouse<br/>(Redshift/BigQuery)<br/><br/>OLAP queries"]
            Redis["⚡ Redis<br/>(Real-time cache)"]
            MLStore["🤖 ML Model Store"]
        end
    end

    EventListener --> MetricsAggregator
    MetricsAggregator --> ReportGenerator
    ReportGenerator --> ForecastEngine
    
    ForecastEngine --> DemandPredictor
    ForecastEngine --> PeakDetector
    
    MetricsAggregator --> OrderMetrics
    MetricsAggregator --> KitchenMetrics
    MetricsAggregator --> RevenueMetrics
    
    OrderMetrics --> DataWarehouse
    KitchenMetrics --> DataWarehouse
    RevenueMetrics --> DataWarehouse
    
    MetricsAggregator --> Redis
    DemandPredictor --> MLStore

    style MetricsAggregator fill:#4CAF50,stroke:#2E7D32
    style ForecastEngine fill:#FF9800,stroke:#E65100
```

---

## Key Metrics

### Real-Time (Updated every 10s)
- Orders per minute
- Current revenue
- Kitchen queue length
- Table occupancy

### Aggregated (Calculated hourly)
- Average order value
- Peak hours
- Table turnover rate
- Popular menu items

### Predictions (Updated daily)
- Tomorrow's expected orders
- Busy periods forecast
- Staffing recommendations

---

## ML Prediction Example

```python
from sklearn.ensemble import RandomForestRegressor

class DemandPredictor:
    def predict_orders(self, date, time_slot):
        features = [
            date.weekday(),           # 0-6 (Mon-Sun)
            time_slot,                # 0-23 (hour)
            is_holiday(date),         # 0 or 1
            weather_forecast(date),   # temperature
            recent_trend()            # 7-day average
        ]
        
        prediction = self.model.predict([features])
        return int(prediction[0])  # Expected orders
```

---

**Last Updated**: 2026-02-21
