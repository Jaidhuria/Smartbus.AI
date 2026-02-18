# Smartbus.AI — AI-Powered Smart School Bus Routing & Live Tracking

## Overview

Smartbus.AI is an AI-driven school bus routing and tracking platform designed to reduce transportation costs, improve safety, and provide real-time visibility to parents and administrators.

### Supported Roles
- **Admin**: Route generation, fleet management, analytics
- **Parent**: Live tracking, ETA alerts, attendance monitoring
- **Student**: Stop information, bus ETA, attendance history
- **Driver**: Trip management, location sharing, stop navigation

## Problem Statement & Solution

**Challenges:**
- Fixed routes persist even when students are absent
- No real-time tracking or ETA updates
- Manual, error-prone attendance systems
- Inefficient fuel usage and longer travel times
- Lack of analytics and route optimization

**Smartbus.AI Solution:**
- AI-optimized morning routes using clustering & OSRM
- RFID-based automated attendance logging
- Dynamic evening rerouting based on attendance
- Real-time GPS tracking via Socket.io
- Parent portal with live map & ETA alerts
- Admin analytics and exportable reports

## Key Features

### Admin Dashboard
- CSV student dataset upload & management
- Static morning route generation (AI-optimized)
- Dynamic evening route rerouting
- Fleet live map with real-time bus locations
- Attendance monitoring dashboard
- Analytics & report export (CSV/PDF)

### Parent Portal
- Select and track assigned child
- Live bus tracking map with ETA
- Route & arrival alerts
- Attendance notification history

### Student Portal
- Assigned bus stop information
- Real-time bus ETA
- Attendance history & status
- Student profile management

### Driver Portal
- Trip start/end management
- Stop list & optimized route view
- Real-time GPS location sharing
- RFID tap simulation (MVP)
- Emergency SOS button (optional)

## Architecture

Smartbus.AI is architected as a modular monolith with microservice patterns prepared for future scaling.

### System Workflows

**Morning Route Generation (Static Optimization)**
```
Load Students → Cluster (KMeans/DBSCAN) → Assign to Buses → OSRM Trip API → Store Route + ETA
```

**Evening Dynamic Rerouting**
```
Mark Absent Students → Remove Stops → Recompute via OSRM → Update ETA → Notify Parents
```

**Real-Time Tracking**
```
Driver GPS → Server Broadcast → Parent Map Update → ETA Recalculation → Admin Fleet View
```

**RFID Attendance**
```
Student RFID Tap → Backend Logs Event → Mark Present/Absent → Update Bus Roster → Trigger Reroute
```

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Leaflet/Mapbox** - Map integration
- **Tailwind CSS** - Styling
- **Socket.io-client** - Real-time updates

### Backend
- **Node.js + Express.js** - Server framework
- **Socket.io** - Real-time communication
- **BullMQ** - Job queue processing
- **Redis** - Caching & session management

### Database & Services
- **MongoDB Atlas** - Primary database
- **OSRM Trip API** - Route optimization engine
- **OpenStreetMap** - Geographic data

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: MongoDB Atlas
- **Cache**: Upstash Redis

## Backend Services

- **Auth Service**: JWT tokens, bcrypt hashing, role-based access control
- **Student Service**: CRUD operations, geo-queries, CSV import/validation
- **Routing Service**: KMeans clustering, bus assignment, OSRM route generation, evening rerouting
- **Attendance Service**: RFID tap events, present/absent tracking, trip roster updates
- **Tracking Service**: Live GPS storage, Socket.io broadcast, trip state management
- **Analytics Service**: Route efficiency, fuel/km savings, daily/monthly reports

## Project Structure

```
smartbus-ai/
├── backend/
│   ├── services/
│   │   ├── attendance-service/
│   │   ├── auth-service/
│   │   ├── routing-service/
│   │   └── tracking-service/
│   ├── ngnix/
│   │   └── ngnix.conf
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── admin/
│   ├── parent/
│   ├── driver/
│   └── student/
├── datasets/
│   ├── students.csv
│   └── buses.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Redis instance (Upstash or local)
- OSRM API access

### Quick Start (Bash)

```bash
# Clone repository
git clone https://github.com/your-username/smartbus-ai.git
cd smartbus-ai

# Backend setup
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials:
# - MONGO_URI (MongoDB connection string)
# - REDIS_URL (Redis connection string)
# - JWT_SECRET (random string for JWT)
# - OSRM_BASE_URL (OSRM API endpoint)
# - PORT (default: 5000)

# Start development server
npm run dev
```

### Environment Configuration (.env)

```bash
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartbusAI

# JWT Secrets
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_key_here

# Redis
REDIS_URL=redis://default:<password>@<host>:<port>

# OSRM Routing
OSRM_BASE_URL=https://router.project-osrm.org

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Seed Initial Data (Optional)

```bash
# Seed students dataset
curl -X POST http://localhost:5000/api/seed/students

# Seed buses dataset
curl -X POST http://localhost:5000/api/seed/buses
```

## Core API Endpoints

### Authentication
```
POST   /auth/login              # User login
POST   /auth/refresh            # Refresh JWT token
POST   /auth/logout             # User logout
```

### Students
```
GET    /api/students            # Get all students
GET    /api/students/:id        # Get student by ID
POST   /api/students            # Create new student
PUT    /api/students/:id        # Update student
DELETE /api/students/:id        # Delete student
POST   /api/students/import-csv # Bulk import from CSV
```

### Routing
```
POST   /api/routes/morning      # Generate morning route
POST   /api/routes/evening      # Generate evening route (with dynamic rerouting)
GET    /api/routes/active       # Get active route (query: ?busId=BUS12)
```

### Attendance
```
POST   /api/attendance/tap      # Log RFID attendance tap
GET    /api/attendance/history  # Get attendance history (query: ?studentId=ST101)
GET    /api/attendance/daily    # Get daily attendance report
```

### Tracking
```
POST   /api/tracking/location   # Log GPS location
GET    /api/tracking/live       # Get live locations (query: ?busId=BUS12)
POST   /api/trip/start          # Start trip
POST   /api/trip/end            # End trip
GET    /api/trip/history        # Get trip history
```

### Analytics
```
GET    /api/analytics/summary   # Summary stats
GET    /api/analytics/daily     # Daily report
GET    /api/analytics/monthly   # Monthly report
GET    /api/analytics/export/csv  # Export analytics as CSV
GET    /api/analytics/export/pdf  # Export analytics as PDF
```

## Security Features

- **HTTPS/TLS** encrypted communication
- **JWT** with short-lived access tokens & refresh tokens
- **bcrypt** password hashing (salt rounds: 10-12)
- **Role-Based Access Control (RBAC)** for each user role
- **Input Validation** using Joi/Zod
- **Rate Limiting** on auth & critical endpoints
- **NoSQL Injection Prevention** for all queries
- **Socket.io JWT Authentication** for real-time connections
- **Audit Logging** for admin actions

## Performance & Scaling

### Optimization Strategies
- **Redis Caching** for active routes & latest GPS positions
- **MongoDB Indexing** on: `studentId`, `busId`, `date`, geo-spatial indexes
- **Socket.io Rooms** organized by `busId` for efficient broadcasting
- **GPS Throttling** (1 update per 2 seconds) to reduce load
- **BullMQ Job Queue** for heavy operations:
  - Route generation & clustering
  - Analytics report generation
  - Batch email notifications
- **TTL Indexes** for automatic live location data cleanup

### Scaling Path
1. **Phase 1** (Current): Modular monolith on single Node.js instance
2. **Phase 2**: Horizontal scaling with load balancer
3. **Phase 3**: Extract services to separate microservices
4. **Phase 4**: Kafka for event streaming, distributed caching

## Database Schema

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | email, passwordHash, role, linkedEntityId | User authentication & authorization |
| `students` | studentId, name, point [lat, lng], parentIds, busId | Student records & assignment |
| `parents` | parentId, name, phone, childrenIds | Parent contact & child mapping |
| `drivers` | driverId, name, busId, licenseNumber | Driver assignment to buses |
| `buses` | busId, capacity, mileageKmpl, location, status | Fleet management |
| `routes` | routeId, busId, type, stops[], geometry, createdAt | Route definitions & optimization results |
| `attendanceLogs` | studentId, busId, boardingTime, droppingTime, status | Attendance tracking |
| `liveLocations` | busId, lat, lng, speed, heading, updatedAt | Real-time GPS data (TTL: 1 hour) |
| `tripLogs` | tripId, busId, driverId, startTime, endTime, status, distance | Trip analytics |

## Demo Workflow

### Morning Scenario
1. Admin uploads `students.csv` via dashboard
2. System generates optimized morning routes using KMeans clustering
3. Parent receives assigned bus stop & ETA
4. Driver starts trip - location begins broadcasting
5. Students board - RFID taps logged for attendance
6. Real-time map updates all parent portals

### Evening Scenario
1. System identifies absent students from attendance logs
2. Generates optimized evening route (skipping absent stops)
3. Parents receive updated ETA notifications instantly
4. Driver follows new optimal route
5. Admin dashboard shows route changes & fuel savings

### Analytics View
- Admin sees daily: students transported, fuel consumed, routes optimized, SOS events
- Export reports in CSV/PDF format for school administration
- Month-over-month trends and cost comparisons

## Getting Started

### For Developers
1. Fork & clone the repository
2. Set up backend with `npm install` and `.env` configuration
3. Run `npm run dev` to start the development server
4. Reference API documentation for integration points
5. Frontend teams work in parallel on React portals (admin, parent, driver, student)

### For Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Using Docker (if available)
docker build -t smartbus-ai .
docker run -p 5000:5000 --env-file .env smartbus-ai
```

### For Contributing
- Create feature branch: `git checkout -b feature/your-feature`
- Commit changes: `git commit -m "Add your feature"`
- Push to branch: `git push origin feature/your-feature`
- Open pull request for review

## Troubleshooting

**OSRM Connection Failed**
- Verify OSRM_BASE_URL is correct and accessible
- Check network connectivity to OSRM service
- Use fallback static routes if OSRM is unavailable

**MongoDB Connection Issues**
- Verify MONGO_URI credentials and IP whitelist
- Ensure MongoDB Atlas cluster is running
- Check network firewall settings

**Redis Connection Issues**
- Verify REDIS_URL format and credentials
- Ensure Redis instance is running and accessible
- Check connection timeout settings

**Socket.io Real-Time Updates Not Working**
- Verify JWT token is being sent in Socket.io handshake
- Check CORS_ORIGIN configuration matches client URL
- Ensure client has Socket.io-client library installed

## License

MIT License - See LICENSE file for details

## Contributors

- **Jai Dhuria** — Project Lead & Developer

Open for contributions! Please fork, create a feature branch, and submit pull requests.