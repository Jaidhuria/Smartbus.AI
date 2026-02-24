# 🚌 Smartbus.AI

> **AI-Powered Smart School Bus Routing & Live Tracking**  
> 🚀 Revolutionizing school bus management with intelligent routing, real-time tracking, and automated attendance.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)  
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Deployment](#-deployment)
- [License](#-license)

---

## 📌 Overview

Smartbus.AI is an intelligent school bus management platform that helps schools **reduce costs**, **improve safety**, and provide **real-time visibility** to parents, drivers, and administrators.

### 👥 Four Role-Based Portals

```bash
Admin      → Route management, fleet tracking, analytics
Parent     → Live tracking, ETA alerts, attendance status  
Student    → Bus info, pickup/drop points, ETA countdown
Driver     → Route navigation, attendance logging, trip management
```

### 💡 Why Smartbus.AI?

| Challenge | Solution |
|-----------|----------|
| ❌ Fixed routes with empty seats | ✅ AI clustering + dynamic rerouting |
| ❌ No parent visibility | ✅ Real-time GPS + ETA notifications |
| ❌ Manual attendance errors | ✅ RFID/NFC auto-logging |
| ❌ High fuel costs | ✅ Route optimization with OSRM |
| ❌ Zero analytics | ✅ Comprehensive admin dashboard |

---

## ✨ Features

### 🎯 Admin Dashboard
- 📤 CSV bulk import for students  
- 🗺️ AI-optimized morning routes & evening rerouting
- 📊 Live fleet dashboard with real-time tracking  
- 📋 Attendance monitoring & reporting
- 📈 Analytics & exportable reports (CSV/PDF)

### 🟢 Parent Portal
- 📍 Live bus location on interactive map
- ⏱️ Real-time ETA & push notifications
- 👁️ Child attendance status & history
- 🔔 Notification hub & alerts

### 🟡 Student Portal
- 📍 Assigned pickup/drop locations
- 🚌 Bus details, driver info, capacity
- ⏱️ Live ETA countdown timer
- 📜 Monthly attendance records

### 🔴 Driver Portal
- 🗺️ Turn-by-turn route navigation
- 🎟️ RFID attendance terminal
- ▶️ Trip start/end controls
- 📍 Real-time GPS location sharing

---

## 🔥 Tech Stack

```
Backend        → Node.js + Express.js + Socket.io
Database       → MongoDB Atlas
Real-time      → Socket.io + Redis  
Routing Engine → OSRM Trip API
Frontend       → React.js + Leaflet/Mapbox + Tailwind CSS
Deployment     → Docker + Railway/Render
```

---

## 🚀 Quick Start

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Jaidhuria/Smartbus.AI.git
cd Smartbus.AI
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 3️⃣ Environment Configuration

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartbusAI

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRY=7d

# Redis
REDIS_URL=redis://default:<password>@<host>:<port>

# OSRM Routing
OSRM_BASE_URL=https://router.project-osrm.org

# Server
LOG_LEVEL=debug
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

**Server runs on:** `http://localhost:5000`

### 5️⃣ Seed Sample Data

```bash
# Seed students
curl -X POST http://localhost:5000/api/seed/students

# Seed buses  
curl -X POST http://localhost:5000/api/seed/buses
```

---

## 📁 Project Structure

```
Smartbus.AI/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment config
│   │
│   ├── middleware/
│   │   ├── asyncHandler.js    # Async middleware wrapper
│   │   └── errorHandler.js    # Global error handler
│   │
│   ├── controllers/
│   │   ├── driverController.js
│   │   ├── locationController.js
│   │   ├── sosController.js
│   │   └── tripController.js
│   │
│   ├── models/
│   │   ├── Bus.js
│   │   ├── Driver.js
│   │   ├── LiveLocation.js
│   │   └── TripLog.js
│   │
│   ├── routes/
│   │   ├── driverRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── sosRoutes.js
│   │   └── tripRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── routeService.js
│   │
│   ├── sockets/
│   │   └── sockets.js         # WebSocket handlers
│   │
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   └── ApiResponse.js     # Response formatter
│   │
│   ├── server.js              # Entry point
│   ├── app.js                 # Express app
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🔌 API Endpoints

### 🔐 Authentication
```bash
POST   /auth/login           # User login
POST   /auth/refresh         # Refresh JWT token
POST   /auth/logout          # Logout
```

### 🧑‍🎓 Students
```bash
GET    /students             # List all students
GET    /students/:id         # Get student by ID
POST   /students             # Create student
PUT    /students/:id         # Update student
DELETE /students/:id         # Delete student
POST   /students/import-csv  # Bulk import from CSV
```

### 🚌 Buses & Drivers
```bash
GET    /buses                # List all buses
GET    /drivers              # List all drivers
GET    /drivers/:id          # Get driver by ID
```

### 🧭 Routing
```bash
POST   /routes/morning              # Generate morning routes
POST   /routes/evening?busId=BUS12  # Generate evening reroute
GET    /routes/active?busId=BUS12   # Get active route
GET    /routes/:routeId             # Get specific route
```

### 📍 Live Tracking
```bash
POST   /tracking/location     # Update bus GPS location
GET    /tracking/live?busId=BUS12  # Get live locations
```

### 🎟️ Attendance
```bash
POST   /attendance/tap                 # Log RFID tap
GET    /attendance/history             # Get attendance records
GET    /attendance/bus/:busId          # Get bus attendance
```

### ▶️ Trip Management
```bash
POST   /trip/start            # Start trip
POST   /trip/end              # End trip
GET    /trip/:tripId          # Get trip details
GET    /trip/active           # Get active trips
```

### 📊 Analytics
```bash
GET    /analytics/summary     # Get summary stats
GET    /analytics/export/csv  # Export CSV report
GET    /analytics/export/pdf  # Export PDF report
```

---

## 🧪 Testing API Endpoints

### Test Authentication

```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbus.ai","password":"password123"}'

# Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
# }
```

### Test Route Generation

```bash
# Generate morning routes
curl -X POST http://localhost:5000/routes/morning \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Live Tracking

```bash
# Update bus location
curl -X POST http://localhost:5000/tracking/location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "BUS001",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "speed": 45
  }'
```

### Test Attendance

```bash
# Log student tap
curl -X POST http://localhost:5000/attendance/tap \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "ST101",
    "busId": "BUS001",
    "eventType": "boarding"
  }'
```

---

## 🔒 Security Features

```
✅ JWT authentication (access + refresh tokens)
✅ bcrypt password hashing (12 salt rounds)
✅ Role-based access control (RBAC)
✅ Input validation & sanitization
✅ Rate limiting on auth endpoints
✅ Socket.io JWT verification
✅ HTTPS/TLS enforcement
✅ NoSQL injection prevention
✅ Audit logging for admin actions
```

---

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Production Build

```bash
npm run start
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

---

## 📦 Dependencies

```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "socket.io": "^4.5.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "redis": "^4.6.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "axios": "^1.3.0"
}
```

---

## 🚢 Deployment

### Docker Setup

```bash
# Build Docker image
docker build -t smartbus:latest .

# Run container
docker run -p 5000:5000 \
  --env-file .env \
  -e MONGO_URI=$MONGO_URI \
  smartbus:latest
```

### Docker Compose

```bash
docker-compose up -d
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up

# View logs
railway logs
```

### Deploy to Render

```bash
# Connect your GitHub repo to Render
# Create new Web Service
# Set environment variables in dashboard
# Deploy
```

---

## 📊 Git Workflow

### Clone & Setup

```bash
git clone https://github.com/Jaidhuria/Smartbus.AI.git
cd Smartbus.AI
npm install
```

### Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### Push to Remote

```bash
git push origin feature/your-feature-name
```

### Create Pull Request

```bash
# Open PR on GitHub for code review
```

### Merge to Main

```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```

### Deployment Push

```bash
# For production deployment
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 🗓️ Project Roadmap

| Phase | Status | Milestones |
|-------|--------|-----------|
| **0-1** | ✅ | MVP setup & dataset preparation |
| **2-3** | ✅ | Backend core & OSRM integration |
| **4-5** | 🚀 | Parent & Admin portals |
| **6-8** | 🚀 | Attendance & real-time tracking |
| **9-13** | 📋 | Analytics, deployment & polish |

---

## 🤝 Contributing

We welcome contributions! Follow this process:

```bash
# 1. Fork the repo
# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes & commit
git add .
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open Pull Request on GitHub
```

### Code Standards

- Use ESLint for JavaScript
- Follow REST API conventions
- Add JSDoc comments for functions
- Write tests for new features
- Update README if adding features

---

## 📄 License

MIT License © 2026 Smartbus.AI

See [LICENSE](LICENSE) for details.

---

## 👥 Support & Contact

**Project Lead:** Jai Dhuria  
**Repository:** [Jaidhuria/Smartbus.AI](https://github.com/Jaidhuria/Smartbus.AI)  
**Issues:** [GitHub Issues](https://github.com/Jaidhuria/Smartbus.AI/issues)  

---

## 🎯 Getting Started Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Copy `.env.example` to `.env`
- [ ] Configure MongoDB URI
- [ ] Configure JWT secrets
- [ ] Configure Redis URL
- [ ] Run `npm run dev`
- [ ] Seed data (`curl -X POST http://localhost:5000/api/seed/students`)
- [ ] Test endpoints with curl or Postman
- [ ] Read API documentation
- [ ] Start building!

---

**Happy coding! 🚀**