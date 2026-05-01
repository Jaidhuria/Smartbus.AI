# Auth Service

Authentication service for Smartbus application with user registration, login, Google OAuth, and password reset functionality.

## Project Structure

```
auth-service/
├── backend/                    # Backend application
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database connection
│   │   └── mailer.js         # Email configuration
│   ├── controllers/           # Route controllers
│   │   └── authController.js # Authentication logic
│   ├── models/                # Database models
│   │   └── user.js           # User schema
│   ├── routes/                # API routes
│   │   └── authRoutes.js     # Authentication routes
│   ├── middleware/            # Custom middleware
│   │   └── authMiddleware.js # Authentication middleware
│   └── node_modules/          # Dependencies
├── build/                     # Frontend build files
├── .firebase/                 # Firebase configuration
├── firebase.json             # Firebase project config
├── .firebaserc              # Firebase project reference
└── .gitignore               # Git ignore rules
```

## Features

- User registration with email verification
- User login with JWT authentication
- Google OAuth integration
- Password reset with OTP via email
- reCAPTCHA verification
- MongoDB database integration

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /google` - Google OAuth authentication
- `POST /send-otp` - Send password reset OTP
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

## Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   RECAPTCHA_SECRET=your_recaptcha_secret
   EMAIL=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Development

For development with auto-restart:
```bash
npm run dev
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **OAuth**: Google Auth Library
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Zod
- **Frontend**: Firebase (build files)