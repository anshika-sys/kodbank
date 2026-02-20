# 🏦 KodNest Secure Bank

**Keep Your Money Safe With Us 💙**

A full-stack banking application with JWT authentication, email verification, and a cute banker assistant!

## ✨ Features

- 🔐 Secure JWT-based authentication
- 📧 Email verification system
- 💰 Balance checking with celebration animation
- 👩‍💼 Cute animated banker girl assistant
- 🎉 Confetti and sound effects
- 🗣️ Text-to-speech banker messages
- 🎨 Beautiful glassmorphism UI
- 📱 Fully responsive design

## 🗄️ Database Schema

### KodUser Table
- uid (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed with bcrypt)
- phone
- role (customer/manager/admin)
- balance (Default: 100000)
- is_verified (Boolean)
- created_at

### UserToken Table
- tid (Primary Key)
- token (JWT)
- uid (Foreign Key)
- expiry
- created_at

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd bank
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your Aiven MySQL credentials.

For email verification to work, update these in `.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

To get Gmail app password:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new password

### 3. Run the Application

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 4. Access the Application

Open your browser:
```
http://localhost:5000
```

## 🎯 User Flow

1. **Register** → Fill form → Receive verification email
2. **Verify Email** → Click link in email → Account activated
3. **Login** → Enter credentials → See cute banker welcome
4. **Check Balance** → Click button → 🎉 Celebration with confetti!
5. **Logout** → Secure session termination

## 🔒 Security Features

- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT with 1-hour expiry
- ✅ HTTP-only cookies
- ✅ Email verification required
- ✅ Token stored in database
- ✅ SSL/TLS database connection
- ✅ Role-based access control ready

## 🎨 UI Features

- Glassmorphism design
- Animated gradient background
- Floating banker animation
- Speech bubbles
- Confetti celebration
- Text-to-speech
- Responsive layout

## 📦 Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL (Aiven)
- JWT
- Bcrypt
- Nodemailer

**Frontend:**
- Vanilla JavaScript
- CSS3 Animations
- Canvas Confetti
- Web Speech API

## 🎉 Special Features

### Cute Banker Girl
- Animated character
- Waving hand
- Blinking eyes
- Speech bubbles
- Voice messages

### Balance Celebration
- Confetti animation
- Sound effects
- Floating coins
- Glowing text
- Voice announcement

## 🌐 API Endpoints

- `POST /api/register` - Register new user
- `GET /api/verify-email` - Verify email token
- `POST /api/login` - Login user
- `GET /api/balance` - Get user balance (protected)
- `POST /api/logout` - Logout user (protected)

## 💡 Default Settings

- Initial balance: ₹100,000
- Role: customer
- Token expiry: 1 hour
- Email verification: 15 minutes

## 🎊 Enjoy your secure banking experience!
