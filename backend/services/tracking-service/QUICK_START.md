# Tracking Service - Setup & Quick Start Guide

## ✅ Current Status
- **API Server**: Running on http://localhost:5000
- **Database**: MongoDB connected
- **All Endpoints**: Tested and Working

---

## Quick Start

### 1. Start the Server
```bash
cd c:\Smartbus\backend\services\tracking-service
npm start
# or use nodemon for development
npm run dev
```

### 2. Test the API
```bash
node test-api.js
```

### 3. API Endpoints Ready to Use

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Welcome & API info |
| POST | `/api/location/update` | Update bus location |
| GET | `/api/location/latest/:busId` | Get latest location by bus |

---

## Example Requests

### Health Check
```bash
curl http://localhost:5000/health
```

### Update Location (using curl)
```bash
curl -X POST http://localhost:5000/api/location/update \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "507f1f77bcf86cd799439011",
    "lat": 28.7041,
    "lng": 77.1025,
    "speed": 55
  }'
```

### Get Latest Location
```bash
curl http://localhost:5000/api/location/latest/507f1f77bcf86cd799439011
```

---

## Project Structure

```
tracking-service/
├── server.js                 # Entry point
├── src/
│   └── app.js               # Express app setup
├── config/
│   ├── db.js                # MongoDB connection
│   └── env.js               # Environment config
├── models/
│   ├── LiveLocation.js      # Location schema
│   ├── Bus.js
│   ├── Driver.js
│   └── TripLog.js
├── controllers/
│   ├── locationController.js
│   ├── driverController.js
│   ├── sosController.js
│   └── tripController.js
├── routes/
│   ├── locationRoutes.js
│   ├── driverRoutes.js
│   ├── sosRoutes.js
│   └── tripRoutes.js
├── middleware/
│   ├── asyncHandler.js
│   └── errorHandler.js
├── utils/
│   ├── ApiError.js
│   └── ApiResponse.js
├── .env                     # Environment variables
├── test-api.js              # API tests
└── API_DOCUMENTATION.md     # Full documentation
```

---

## Environment Setup

`.env` file is already configured with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tracking-service
NODE_ENV=development
```

---

## Dependencies Installed

✅ All dependencies are installed:
- express ^5.2.1
- mongoose ^9.2.1
- cors ^2.8.6
- morgan ^1.10.1
- socket.io ^4.8.3
- dotenv ^17.3.1
- axios ^1.13.5

---

## Features Implemented

✅ **Core API Features**:
- Express server setup with middleware
- CORS enabled
- Morgan logging
- MongoDB integration with Mongoose
- Error handling middleware
- 404 route handler
- Request body parsing (JSON & URL-encoded)

✅ **Location Tracking Features**:
- Update bus live location
- Retrieve latest location by bus ID
- Timestamp tracking
- Speed recording
- Indexed queries for performance

✅ **Error Handling**:
- Validation for required fields
- Proper HTTP status codes
- Consistent error responses
- Development-mode error details

---

## Test Results

All 5 test scenarios passed:
1. ✅ Health Check
2. ✅ Welcome Endpoint
3. ✅ Location Update
4. ✅ Get Latest Location
5. ✅ 404 Error Handling

---

## Next Features to Add

- [ ] WebSocket support for real-time location streaming
- [ ] Driver authentication
- [ ] Trip management
- [ ] SOS emergency alerts
- [ ] Route optimization
- [ ] Student pickup tracking
- [ ] Admin dashboard integration

---

## Troubleshooting

### MongoDB Connection Failed
```bash
# Ensure MongoDB is running
# On Windows: mongod.exe
# Default connection: mongodb://localhost:27017/tracking-service
```

### Port Already in Use
```bash
# Change port in .env or use different port
PORT=5001 node server.js
```

### Dependencies Issue
```bash
npm install --force
# or
npm audit fix --force
```

---

## Support

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

For test examples, see [test-api.js](./test-api.js)
