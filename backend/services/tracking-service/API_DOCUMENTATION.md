# Tracking Service API Documentation

## Overview
The Tracking Service is a Node.js/Express API that manages real-time bus location tracking with WebSocket support and MongoDB persistence.

## Server Status
✅ **Server Running**: http://localhost:5000

## Base Configuration
- **Port**: 5000
- **Database**: MongoDB (mongodb://localhost:27017/tracking-service)
- **Environment**: Development

---

## API Endpoints

### 1. Health Check
**Endpoint**: `GET /health`

**Response**:
```json
{
  "success": true,
  "message": "Tracking Service is running",
  "timestamp": "2026-02-19T08:30:14.572Z"
}
```

---

### 2. Welcome / API Info
**Endpoint**: `GET /`

**Response**:
```json
{
  "success": true,
  "message": "Welcome to Tracking Service API",
  "endpoints": {
    "health": "/health",
    "location": "/api/location/update (POST)",
    "getLocation": "/api/location/latest/:busId (GET)"
  }
}
```

---

### 3. Update Bus Location
**Endpoint**: `POST /api/location/update`

**Request Body**:
```json
{
  "busId": "507f1f77bcf86cd799439011",
  "lat": 28.7041,
  "lng": 77.1025,
  "speed": 55
}
```

**Query Parameters**:
- `busId` (required): MongoDB ObjectId of the bus
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `speed` (optional): Current speed of the bus (default: 0)

**Response**:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "location": {
    "busId": "507f1f77bcf86cd799439011",
    "lat": 28.7041,
    "lng": 77.1025,
    "speed": 55,
    "_id": "6996ca16e21de2d7cb3ba344",
    "timestamp": "2026-02-19T08:30:14.598Z",
    "createdAt": "2026-02-19T08:30:14.601Z",
    "updatedAt": "2026-02-19T08:30:14.601Z"
  }
}
```

**Error Response** (Missing required fields):
```json
{
  "success": false,
  "message": "busId, lat, lng are required"
}
```

---

### 4. Get Latest Bus Location
**Endpoint**: `GET /api/location/latest/:busId`

**Path Parameters**:
- `busId` (required): MongoDB ObjectId of the bus

**Response**:
```json
{
  "success": true,
  "latest": {
    "_id": "6996ca16e21de2d7cb3ba344",
    "busId": "507f1f77bcf86cd799439011",
    "lat": 28.7041,
    "lng": 77.1025,
    "speed": 55,
    "timestamp": "2026-02-19T08:30:14.598Z",
    "createdAt": "2026-02-19T08:30:14.601Z",
    "updatedAt": "2026-02-19T08:30:14.601Z"
  }
}
```

**Error Response** (No location found):
```json
{
  "success": false,
  "message": "No location found for this bus"
}
```

---

## Testing the API

### Using PowerShell
```powershell
# Health Check
Invoke-WebRequest -Uri http://localhost:5000/health -Method GET -UseBasicParsing

# Update Location
$body = @{
    busId = "507f1f77bcf86cd799439011"
    lat = 28.7041
    lng = 77.1025
    speed = 55
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/location/update `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

# Get Latest Location
Invoke-WebRequest -Uri "http://localhost:5000/api/location/latest/507f1f77bcf86cd799439011" `
  -Method GET `
  -UseBasicParsing
```

### Using Node.js Test Script
```bash
npm test
# or
node test-api.js
```

---

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start with nodemon (auto-restart on changes)
- `node test-api.js` - Run comprehensive API tests

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tracking-service
NODE_ENV=development
```

---

## Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-Origin Resource Sharing
- **morgan**: HTTP request logger
- **socket.io**: Real-time communication
- **dotenv**: Environment variable management
- **axios**: HTTP client for testing

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": {} // Only in development mode
}
```

Common Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (missing/invalid fields)
- `404`: Not Found
- `500`: Internal Server Error

---

## Database Schema

### LiveLocation Collection
```javascript
{
  busId: ObjectId (indexed),
  lat: Number,
  lng: Number,
  speed: Number,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `busId` (ascending)
- `busId` + `timestamp` (descending) - for quick latest location queries

---

## Testing Results

✅ All endpoints tested and working:
1. Health Check - ✅ Passed
2. Welcome Endpoint - ✅ Passed
3. Location Update - ✅ Passed
4. Get Latest Location - ✅ Passed
5. Error Handling (404) - ✅ Passed

---

## Next Steps

1. Integrate authentication service
2. Add WebSocket support for real-time updates
3. Implement SOS (emergency) features
4. Add batch location updates
5. Create admin dashboard for monitoring
