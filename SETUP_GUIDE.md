# 🚀 Quick Setup Guide - KodNest Secure Bank

## ✅ What's Already Done

Your KodNest Secure Bank application is ready! Here's what's included:

### Backend (Node.js + Express)
- ✅ JWT authentication system
- ✅ Email verification flow
- ✅ MySQL (Aiven) integration
- ✅ Bcrypt password hashing
- ✅ Secure HTTP-only cookies
- ✅ Role-based access control

### Frontend (Vanilla JS + CSS)
- ✅ Registration page
- ✅ Login page
- ✅ Email verification page
- ✅ Dashboard with cute banker
- ✅ Balance check with celebration
- ✅ Glassmorphism UI design
- ✅ Responsive layout

## 🎯 How to Run

### Step 1: Start the Server

```bash
cd bank
npm start
```

You should see:
```
🚀 KodNest Secure Bank server running on http://localhost:5000
✅ Database initialized successfully
```

### Step 2: Open in Browser

Navigate to: **http://localhost:5000**

## 📧 Email Configuration (Optional)

For email verification to work, update `.env`:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Get Gmail App Password:**
1. Google Account → Security
2. Enable 2-Step Verification
3. App passwords → Generate

**Note:** Without email config, you can still test by manually setting `is_verified=true` in database.

## 🎮 Testing the Application

### Test Flow 1: Full Registration
1. Go to http://localhost:5000
2. Fill registration form
3. Check email for verification link
4. Click verification link
5. Login with credentials
6. See cute banker welcome
7. Click "Check Balance"
8. Enjoy the celebration! 🎉

### Test Flow 2: Quick Test (Skip Email)
1. Register a user
2. Manually update database:
   ```sql
   UPDATE KodUser SET is_verified = true WHERE username = 'your_username';
   ```
3. Login and test

## 🗄️ Database Tables

The application automatically creates:

**KodUser** - User accounts
**UserToken** - JWT tokens

Check your Aiven MySQL dashboard to see the tables.

## 🎨 Features to Experience

### 1. Cute Banker Girl
- Animated character
- Waving hand
- Blinking eyes
- Speech bubbles
- Voice messages (Text-to-Speech)

### 2. Balance Celebration
- Confetti explosion 🎊
- Floating coins 💰
- Glowing balance text
- Sound effects
- Voice announcement

### 3. Security
- Passwords hashed with bcrypt
- JWT tokens with expiry
- HTTP-only cookies
- Email verification required

## 🔧 Troubleshooting

### Database Connection Error
- Check internet connection
- Verify Aiven credentials in `.env`
- Ensure Aiven MySQL service is running

### Email Not Sending
- Update EMAIL_USER and EMAIL_PASSWORD in `.env`
- Use Gmail app password (not regular password)
- Check spam folder

### Port Already in Use
Change PORT in `.env`:
```env
PORT=5001
```

## 📱 Pages Overview

- **/** - Registration page
- **/login.html** - Login page
- **/verify-email.html** - Email verification
- **/dashboard.html** - User dashboard

## 🎉 Default User Settings

- Initial Balance: ₹100,000
- Role: customer
- Token Expiry: 1 hour
- Verification Token: 15 minutes

## 💡 Next Steps

1. Test the registration flow
2. Experience the cute banker
3. Check balance celebration
4. Customize the UI colors
5. Add more features!

## 🌟 Enjoy Your Banking App!

Your money is safe with KodNest Secure Bank 💙
