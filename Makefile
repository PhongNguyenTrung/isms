.PHONY: dev dev-tablet dev-dashboard prod down logs

# Khởi động toàn bộ backend (postgres, kafka, microservices, api-gateway)
# Frontend chạy local riêng để có hot reload
dev:
	docker compose up -d

# Chạy tablet-app với hot reload (cần backend đang chạy)
dev-tablet:
	cd frontend/tablet-app && npm run dev

# Chạy manager-dashboard với hot reload (cần backend đang chạy)
dev-dashboard:
	cd frontend/manager-dashboard && npm run dev

# Deploy production (bao gồm cả frontend container)
prod:
	docker compose --profile frontend up -d --build

# Dừng tất cả services
down:
	docker compose --profile frontend down

# Xem logs backend
logs:
	docker compose logs -f
