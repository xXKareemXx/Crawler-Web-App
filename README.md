# Crawler Web Application

A modern web crawler application built with Go (Gin) backend and React (TypeScript) frontend. This tool allows you to analyze websites for SEO and technical insights including link analysis, heading structure, HTML version detection, and broken link identification.

## Features

- **URL Analysis**: Crawl websites to extract technical information
- **Link Analysis**: Count internal and external links, detect broken links
- **Heading Structure**: Analyze H1-H6 heading distribution
- **HTML Version Detection**: Identify HTML version (HTML5, HTML 4.01, XHTML)
- **Login Form Detection**: Detect presence of login forms
- **Bulk Operations**: Process multiple URLs simultaneously
- **Real-time Status Updates**: Monitor crawling progress
- **Responsive UI**: Modern, clean interface with detailed analytics

## Tech Stack

### Backend
- **Go** with Gin framework
- **MySQL** database with GORM ORM
- **Docker** containerization
- **RESTful API** design
- **UUID** - Unique identifier generation

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** icons
- **Vite** for fast development and building

## Project Structure

```
crawler-web-app/
├── backend/
│   ├── database/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── main.go
│   └── go.mod
│   └── go.sum
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   │   └── index.css
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── init.sql
├── .gitignore
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── Makefile
├── nginx.conf
└── README.md
```

## Prerequisites

- Go 1.19+
- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (Optional)

## Quick Start

### Using Docker (Recommended)

```bash
  # Clone the repository
  git clone https://github.com/xXKareemXx/Crawler-app.git
  cd crawler-web-app

  # Start the entire application**
  docker-compose up --build
```

**Access the application**
- Frontend: http://localhost:80
- Backend API: http://localhost:8080
- MySQL: localhost:3306

### Manual Setup

#### Backend Setup

```bash
  # Navigate to backend directory
  cd backend

  # Install dependencies
  go mod download

  # Set up environment variables
  cp .env.example .env # Edit .env with your database credentials

  # Run database
  go run main.go
```

#### Frontend Setup

```bash
  # Navigate to frontend directory
  cd frontend

  # Install dependencies
  npm install

  # Start the development server
  npm run dev
```

## Testing

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Endpoints

### Crawl Results
- `GET /api/crawl-results` - Get paginated crawl results
- `POST /api/crawl-results` - Create new crawl result
- `GET /api/crawl-results/:id` - Get specific crawl result
- `PUT /api/crawl-results/:id` - Update crawl result
- `DELETE /api/crawl-results/:id` - Delete crawl result

### Bulk Operations
- `POST /api/crawl-results/start-crawling` - Start crawling for multiple URLs
- `POST /api/crawl-results/bulk-delete` - Delete multiple crawl results

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 100)
- `status`: Filter by status (queued, running, completed, error)

## Configuration

### Environment Variables

#### Backend
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=crawler_user
DB_PASSWORD=crawler_password
DB_NAME=crawler_db
PORT=8080
```

#### Frontend
```env
VITE_API_URL=http://localhost:8080/api
```

### Status Values
- `queued`: Crawl request created, waiting to be processed
- `running`: Crawl is currently in progress
- `completed`: Crawl finished successfully
- `error`: Crawl failed with an error

## Deployment

### Docker Production Build
```bash
make build
make up-prod
```

### Manual Deployment
1. Build backend binary
2. Build frontend static files
3. Configure Nginx
4. Set up MySQL database
5. Configure environment variables

## Common Issues

### Status Not Updating
The crawl status may appear stuck in "running" state. This is because the frontend doesn't automatically refresh. Click the "Refresh" button or implement polling for real-time updates.

### Database Connection Issues
Ensure MySQL is running and connection parameters are correct in the environment variables.

### CORS Issues
Make sure the backend CORS configuration allows requests from your frontend domain.