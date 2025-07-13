.PHONY: help build up down logs clean dev-backend dev-frontend test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

logs-mysql: ## View MySQL logs
	docker-compose logs -f mysql

clean: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f

dev-backend: ## Run backend in development mode
	cd backend && go run main.go

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

test-backend: ## Run backend tests
	cd backend && go test ./...

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend service
	docker-compose restart backend

restart-frontend: ## Restart frontend service
	docker-compose restart frontend

mysql-shell: ## Connect to MySQL shell
	docker-compose exec mysql mysql -u crawler_user -p crawler_db

backend-shell: ## Connect to backend container shell
	docker-compose exec backend sh

# Development targets
install-backend: ## Install backend dependencies
	cd backend && go mod tidy

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

setup: install-backend install-frontend ## Setup development environment

# Production targets
prod-up: ## Start production environment
	docker-compose -f docker-compose.yml up -d

prod-build: ## Build production images
	docker-compose -f docker-compose.yml build --no-cache