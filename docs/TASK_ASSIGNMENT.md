# Phân công công việc — Flow "Đặt món & Hiển thị bếp"

## Flow: Order-to-Kitchen Display

```
[Tablet App] ──(1)──► ordering-service ──(3) Kafka(orders)──► kitchen-service ──(5) Socket.io──► [KDS Dashboard]
                            (2) DB                (4) priority score          (7) chef update
                                                                                    (8) Kafka(kitchen_completed)
                                                                                          ↓
                                                                               analytics-service ──(10) Socket.io──► [Dashboard]
                                                                                    (9) Redis
```

---

## Phân công

| TV | Module | Bước trong flow | Implement | Báo cáo |
|----|--------|----------------|-----------|---------|
| **TV1** | Infrastructure + Auth | Supporting prerequisite | `docker-compose.yml` · `api-gateway/nginx.conf` · `manager-dashboard/nginx.conf` · `auth-service/` | Ch1 Giới thiệu · Ch4 Kiến trúc tổng thể · Ch9 Deployment |
| **TV2** | Ordering Service | Bước 2–3 | `orderRoutes.js` · `orderRepository.js` · `kafka.js` (publish) · `menuRoutes.js` | Ch2 Phân tích yêu cầu · Ch5 ADRs · Ch7.1 Ordering detail (FR3–FR4) |
| **TV3** | Kitchen Service | Bước 4–5 · 7–8 | `KitchenQueueManager.js` · `PriorityCalculator.js` · `kdsSocket.js` · `kitchenRoutes.js` · `kafka.js` (consumer + producer) | Ch3 Architecture Characteristics & Kata · Ch7.3 Kitchen detail (FR5–FR8) |
| **TV4** | Frontend (Tablet + KDS) | Bước 1 · 6–7 | `MenuPage.jsx` · `CheckoutPage.jsx` · `OrderSuccess.jsx` · `KitchenDisplay.jsx` · `App.jsx` | Ch7.2 Frontend detail (FR1–FR2) · Ch10 Traceability · Phụ lục |
| **TV5** | Analytics Service | Bước 9–10 | `MetricsAggregator.js` · `MetricsRepository.js` · `analyticsSocket.js` · `LiveMetrics.jsx` | Ch6 Design Principles · Ch8 Performance · Ch7.4 Analytics detail (FR12) |

---

## Cấu trúc báo cáo

| Chương | Nội dung | TV |
|--------|----------|----|
| 1 | Giới thiệu, phạm vi | TV1 |
| 2 | Phân tích yêu cầu (FR, NFR, Actor) | TV2 |
| 3 | Architecture Characteristics & Kata | TV3 |
| 4 | Thiết kế kiến trúc tổng thể | TV1 |
| 5 | Architecture Decision Records (7 ADRs) | TV2 |
| 6 | Design Principles (SOLID, DRY) | TV5 |
| 7.1 | Chi tiết Ordering Service (FR3–FR4) | TV2 |
| 7.2 | Chi tiết Frontend — Tablet + KDS (FR1–FR2) | TV4 |
| 7.3 | Chi tiết Kitchen Service (FR5–FR8) | TV3 |
| 7.4 | Chi tiết Analytics Service (FR12) | TV5 |
| 8 | Performance & Quality Attributes | TV5 |
| 9 | Infrastructure & Deployment | TV1 |
| 10 | Traceability & Verification | TV4 |
| Phụ lục | Tài liệu tham khảo | TV4 |

---

## Demo Checklist

- [ ] `docker-compose up --build` — tất cả containers healthy
- [ ] `http://localhost:3000` → chọn món → đặt hàng
- [ ] `http://localhost:3001` → tab **Nhà bếp (KDS)** → task xuất hiện realtime
- [ ] KDS: **Đang chế biến →** → **Sẵn sàng →** → **Hoàn thành →**
- [ ] Tab **Phân tích** → `active_orders` giảm, `avg_prep_time` cập nhật
