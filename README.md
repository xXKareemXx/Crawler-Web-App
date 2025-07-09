# Web Crawler Application

A full-stack web application that crawls websites and analyzes their content, providing insights about HTML structure, links, and accessibility.

## 🚀 Features

- **URL Management**: Add and manage URLs for analysis
- **Web Crawling**: Automated analysis of website content
- **Results Dashboard**: Paginated, sortable table with filtering
- **Details View**: Detailed analysis with charts and broken links
- **Real-time Updates**: Live crawl status updates
- **Bulk Actions**: Process multiple URLs simultaneously

## 🛠️ Tech Stack

### Backend
- **Go** (Golang) with Gin framework
- **MySQL** for data storage
- **JWT** authentication
- **WebSocket** for real-time updates

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Jest** + React Testing Library for testing

## 📋 Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Docker & Docker Compose (optional)

## 🏃‍♂️ Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/web-crawler-app.git
cd web-crawler-app
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

4. Run the backend:
```bash
go run main.go
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
go test ./...
```

## 📊 API Documentation

### Authentication
All API endpoints require JWT authentication. Get a token by calling:
```
POST /api/auth/login
```

### Endpoints

- `POST /api/urls` - Add URL for analysis
- `GET /api/urls` - List all URLs (paginated, sortable)
- `GET /api/urls/:id` - Get URL details
- `PUT /api/urls/:id/crawl` - Start/stop crawling
- `DELETE /api/urls/:id` - Delete URL
- `POST /api/urls/bulk` - Bulk actions

### WebSocket
Real-time updates available at: `ws://localhost:8080/ws`

## 🏗️ Project Structure

```
web-crawler-app/
├── backend/           # Go backend application
│   ├── handlers/      # HTTP handlers
│   ├── models/        # Database models
│   ├── services/      # Business logic
│   └── middleware/    # Authentication middleware
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom hooks
│   │   └── types/      # TypeScript types
└── docker-compose.yml # Docker configuration
```

## 🚀 Deployment

### Production Build

1. Build the application:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

2. The application will be available at your configured domain.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Development Team

Built as a technical assessment for Sykell Full-Stack Developer position.

---

⚠️ **Note**: This is a demonstration project. Do not use in production without proper security review and hardening.