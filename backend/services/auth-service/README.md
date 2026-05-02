<div align="center">

#  Smartbus — Auth Service

**Production-ready authentication & role-based access control backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

A standalone authentication microservice for the Smartbus platform. Handles user registration, JWT login, Google OAuth, OTP-based password reset, and full Firebase RBAC with custom claims and Firestore security rules.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime & Framework | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs, Google Auth Library |
| Cloud | Firebase Admin SDK, Cloud Functions, Firestore |
| Email | Nodemailer |
| Security | Helmet, CORS, Express Rate Limit, Zod, reCAPTCHA |

---

## Project Structure

```
auth-service/
├── backend/
│   ├── server.js                   # Entry point
│   ├── config/                     # DB & mailer setup
│   ├── controllers/authController.js
│   ├── models/user.js              # Mongoose schema
│   ├── routes/authRoutes.js
│   └── middleware/authMiddleware.js # JWT + role guard
├── functions/
│   ├── index.js                    # Cloud Functions: onUserCreated, setUserRole
│   └── serviceAccountKey.json     
├── middleware/auth.js              # Firebase verifyToken + requireRole
├── scripts/setFirstAdmin.js        # One-time admin bootstrap
├── firestore.rules                 # Role-based DB security
└── firebase.json
```

---

## User Roles

| Role | Access Level |
|---|---|
| `user` | Default — standard access |
| `driver` | Driver-specific routes |
| `manager` | Management routes |
| `admin` | Full access + user management |

> Firebase Cloud Functions use `viewer / editor / admin` as custom JWT claims. Map to application roles as needed.

---

## API Reference

**Base URL:** `/api/auth`

### Public

| Method | Route | Description |
|---|---|---|
| `POST` | `/register` | Create account |
| `POST` | `/login` | Login → JWT |
| `POST` | `/google` | Google OAuth |
| `POST` | `/send-otp` | Email OTP for reset |
| `POST` | `/verify-otp` | Verify OTP |
| `POST` | `/reset-password` | Set new password |

### Authenticated

| Method | Route | Description |
|---|---|---|
| `GET` | `/profile` | Get own profile |
| `PUT` | `/profile` | Update own profile |

### Admin Only

| Method | Route | Description |
|---|---|---|
| `GET` | `/users` | List all users |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id/role` | Change user role |
| `PUT` | `/users/:id/status` | Activate / deactivate |
| `DELETE` | `/users/:id` | Delete user |

<details>
<summary><strong>Example requests</strong></summary>

```jsonc
// POST /register
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword",
  "captchaToken": "recaptcha_token",
  "role": "manager"          // optional, defaults to "user"
}

// POST /login — response
{
  "_id": "64f1a...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "manager",
  "token": "eyJhbGci..."
}

// PUT /users/:id/role
// Authorization: Bearer <admin_token>
{ "role": "driver" }
```

</details>

---

## Quick Start

```bash
# 1. Install
cd backend && npm install

# 2. Configure — create backend/.env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
RECAPTCHA_SECRET=your_recaptcha_secret
EMAIL=your@gmail.com
EMAIL_PASS=your_app_password
PORT=5000

# 3. Run
npm run dev       # development (nodemon)
npm start         # production
```

---

## Firebase RBAC Setup

<details>
<summary><strong>Step-by-step guide (expand)</strong></summary>

### 1 — Install & initialise

```bash
npm install firebase-admin firebase-functions
npm install -g firebase-tools
firebase login && firebase init functions
```

### 2 — Service Account key

Firebase Console → Project Settings → **Service accounts** → **Generate new private key**

Save as `functions/serviceAccountKey.json` — already in `.gitignore`, never commit it.

### 3 — Admin SDK init (`functions/index.js`)

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
});

const db = admin.firestore();
```

### 4 — Auto-create user doc on signup

```javascript
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  await db.collection('users').doc(user.uid).set({
    email: user.email,
    role: 'viewer',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

### 5 — `setUserRole` callable function

```javascript
exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin')
    throw new functions.https.HttpsError('permission-denied', 'Admins only.');

  const { uid, role } = data;
  if (!['admin', 'editor', 'viewer'].includes(role))
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role.');

  await admin.auth().setCustomUserClaims(uid, { role });
  await db.collection('users').doc(uid).update({ role });
  return { success: true, uid, role };
});
```

### 6 — Bootstrap first admin

Find your UID in Firebase Console → Authentication → Users, then:

```bash
node scripts/setFirstAdmin.js   # paste UID inside the script, run once
```

### 7 — Firestore security rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function role() { return request.auth.token.role; }
    function isAdmin() { return isSignedIn() && role() == 'admin'; }
    function isEditor() { return isSignedIn() && role() in ['admin','editor']; }

    match /users/{userId} {
      allow read:  if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
    match /posts/{postId} {
      allow read:           if isSignedIn();
      allow create, update: if isEditor();
      allow delete:         if isAdmin();
    }
    match /settings/{docId} {
      allow read, write: if isAdmin();
    }
  }
}
```

### 8 — Deploy

```bash
firebase deploy --only functions        # functions only
firebase deploy --only firestore:rules  # rules only
firebase deploy                         # everything
```

</details>

---

## Middleware Usage

```javascript
const { protect, authorize } = require('./middleware/authMiddleware');

router.get('/profile',  protect,                              handler); // any logged-in user
router.get('/admin',    protect, authorize('admin'),           handler); // admin only
router.get('/fleet',    protect, authorize('manager','driver'), handler); // multiple roles
```

```javascript
const { verifyToken, requireRole } = require('../middleware/auth'); // Firebase variant

app.get('/api/profile',      verifyToken,                             handler);
app.post('/api/posts',       verifyToken, requireRole('admin','editor'), handler);
app.delete('/api/posts/:id', verifyToken, requireRole('admin'),          handler);
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `RECAPTCHA_SECRET` | reCAPTCHA server secret |
| `EMAIL` | Sender Gmail address |
| `EMAIL_PASS` | Gmail app password |
| `PORT` | Server port (default `5000`) |

---

<div align="center">
<sub>Part of the Smartbus platform</sub>
</div>
