# 🏗️ KodNest Secure Bank - Architecture Overview

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Application Flow](#application-flow)
5. [API Endpoints](#api-endpoints)
6. [Security Implementation](#security-implementation)
7. [Frontend Architecture](#frontend-architecture)

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Registration │  │    Login     │  │  Dashboard   │          │
│  │   Page       │  │    Page      │  │    Page      │          │
│  │ (index.html) │  │ (login.html) │  │(dashboard.   │          │
│  │              │  │              │  │   html)      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         └─────────────────┼──────────────────┘                   │
│                           │                                      │
│                    ┌──────▼──────┐                              │
│                    │  JavaScript  │                              │
│                    │   (Fetch     │                              │
│                    │    API)      │                              │
│                    └──────┬───────┘                              │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   HTTP/HTTPS   │
                    │   (REST API)   │
                    └───────┬────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                       SERVER SIDE                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Express.js Server                        │  │
│  │                      (server.js)                            │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │   Middleware │  │     JWT      │  │    Bcrypt    │    │  │
│  │  │   - CORS     │  │  Verification│  │   Password   │    │  │
│  │  │   - JSON     │  │              │  │   Hashing    │    │  │
│  │  │   - Cookies  │  │              │  │              │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │              API Route Handlers                       │ │  │
│  │  │  • POST /api/register                                │ │  │
│  │  │  • POST /api/login                                   │ │  │
│  │  │  • GET  /api/balance (Protected)                     │ │  │
│  │  │  • POST /api/logout (Protected)                      │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            │                                      │
│                    ┌───────▼────────┐                            │
│                    │  MySQL2 Driver │                            │
│                    │  (Connection   │                            │
│                    │     Pool)      │                            │
│                    └───────┬────────┘                            │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   SSL/TLS        │
                    │   Connection     │
                    └────────┬─────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    DATABASE LAYER                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Aiven MySQL Cloud Database                    │  │
│  │                                                             │  │
│  │  ┌──────────────┐              ┌──────────────┐           │  │
│  │  │   KodUser    │              │  UserToken   │           │  │
│  │  │   Table      │              │    Table     │           │  │
│  │  │              │              │              │           │  │
│  │  │ • uid (PK)   │              │ • tid (PK)   │           │  │
│  │  │ • username   │              │ • token      │           │  │
│  │  │ • email      │              │ • uid (FK)   │           │  │
│  │  │ • password   │◄─────────────┤ • expiry     │           │  │
│  │  │ • phone      │   Foreign    │ • created_at │           │  │
│  │  │ • role       │     Key      │              │           │  │
│  │  │ • balance    │              │              │           │  │
│  │  │ • is_verified│              │              │           │  │
│  │  │ • created_at │              │              │           │  │
│  │  └──────────────┘              └──────────────┘           │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend**
```
┌─────────────────────────────────────┐
│         Frontend Stack              │
├─────────────────────────────────────┤
│ • HTML5                             │
│ • CSS3 (Glassmorphism Design)      │
│ • Vanilla JavaScript (ES6+)        │
│ • Fetch API (AJAX Requests)        │
│ • Canvas Confetti (Animations)     │
│ • Web Speech API (Text-to-Speech)  │
│ • Google Fonts (Poppins)           │
└─────────────────────────────────────┘
```

### **Backend**
```
┌─────────────────────────────────────┐
│         Backend Stack               │
├─────────────────────────────────────┤
│ • Node.js (v18+)                    │
│ • Express.js (Web Framework)        │
│ • MySQL2 (Database Driver)          │
│ • Bcrypt (Password Hashing)         │
│ • JWT (Authentication)              │
│ • Cookie-Parser (Session Mgmt)      │
│ • CORS (Cross-Origin)               │
│ • Dotenv (Environment Config)       │
│ • Nodemailer (Email - Optional)     │
└─────────────────────────────────────┘
```

### **Database**
```
┌─────────────────────────────────────┐
│       Database Stack                │
├─────────────────────────────────────┤
│ • MySQL 8.0.45 (Aiven Cloud)        │
│ • SSL/TLS Encryption                │
│ • Connection Pooling                │
│ • Foreign Key Constraints           │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### **KodUser Table**
```sql
CREATE TABLE KodUser (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,        -- Bcrypt hashed
    phone VARCHAR(20),
    role ENUM('customer', 'manager', 'admin') DEFAULT 'customer',
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **UserToken Table**
```sql
CREATE TABLE UserToken (
    tid INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,           -- JWT token
    uid INT NOT NULL,
    expiry DATETIME NOT NULL,              -- Token expiration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
);
```

### **Relationships**
```
KodUser (1) ──────< (Many) UserToken
   uid                      uid (FK)
```

---

## 🔄 Application Flow

### **1. Registration Flow**

```
┌─────────────┐
│   User      │
│  Visits     │
│ index.html  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  User Fills Registration Form       │
│  • User ID                          │
│  • Username                         │
│  • Email                            │
│  • Phone                            │
│  • Password                         │
│  • Role (Customer/Manager/Admin)    │
│  • Balance (Default: 100000)        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  JavaScript Validation              │
│  • Check all fields filled          │
│  • Password length >= 8             │
│  • Valid email format               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  POST /api/register                 │
│  Fetch API sends JSON data          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Server: Express Route Handler      │
│  1. Validate input                  │
│  2. Check if user exists (DB query) │
│  3. Hash password with bcrypt       │
│  4. Insert into KodUser table       │
│  5. Set is_verified = true          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Database: MySQL (Aiven)            │
│  INSERT INTO KodUser VALUES(...)    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Response: Success                  │
│  { success: true, message: "..." }  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Show Success Message     │
│  Redirect to login.html             │
└─────────────────────────────────────┘
```

### **2. Login Flow**

```
┌─────────────┐
│   User      │
│  Visits     │
│ login.html  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  User Enters Credentials            │
│  • Username                         │
│  • Password                         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  POST /api/login                    │
│  Fetch API sends credentials        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Server: Login Handler              │
│  1. Find user by username           │
│  2. Compare password with bcrypt    │
│  3. Generate JWT token              │
│     - Payload: uid, username, role  │
│     - Expiry: 1 hour                │
│  4. Store token in UserToken table  │
│  5. Set HTTP-only cookie            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Database Operations                │
│  1. SELECT * FROM KodUser           │
│  2. INSERT INTO UserToken           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Response: Success + Cookie         │
│  Set-Cookie: authToken=JWT          │
│  { success: true, user: {...} }     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Store Cookie             │
│  Redirect to dashboard.html         │
└─────────────────────────────────────┘
```

### **3. Dashboard & Balance Check Flow**

```
┌─────────────┐
│   User      │
│  Visits     │
│ dashboard   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Page Load: init()                  │
│  GET /api/balance (with cookie)     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Server: verifyToken Middleware     │
│  1. Extract JWT from cookie         │
│  2. Check token in UserToken table  │
│  3. Verify token not expired        │
│  4. Decode JWT payload              │
└──────┬──────────────────────────────┘
       │
       ├─── Invalid/Expired ───┐
       │                       ▼
       │              ┌─────────────────┐
       │              │ Redirect to     │
       │              │ login.html      │
       │              └─────────────────┘
       │
       ▼ Valid Token
┌─────────────────────────────────────┐
│  Balance Handler                    │
│  1. Extract uid from JWT            │
│  2. Query balance from KodUser      │
│  3. Return user data                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Database Query                     │
│  SELECT balance, username, role     │
│  FROM KodUser WHERE uid = ?         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Response: User Data                │
│  { success: true,                   │
│    balance: 100000,                 │
│    username: "...",                 │
│    role: "customer" }               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Display Welcome          │
│  Show "Welcome [username]!"         │
│  Show "Check Balance" button        │
└──────┬──────────────────────────────┘
       │
       │ User Clicks "Check Balance"
       ▼
┌─────────────────────────────────────┐
│  Show Balance Screen                │
│  1. Hide welcome screen             │
│  2. Show banker animation           │
│  3. Trigger confetti                │
│  4. Convert balance to words        │
│  5. Speak with Text-to-Speech       │
│  6. Display balance with glow       │
└─────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### **Public Endpoints**

#### **POST /api/register**
```javascript
Request:
{
  "uid": "1",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "customer",
  "balance": 100000
}

Response (Success):
{
  "success": true,
  "message": "Registration successful! You can now login.",
  "uid": "1",
  "role": "customer",
  "balance": 100000
}

Response (Error):
{
  "success": false,
  "message": "Username or Email already exists"
}
```

#### **POST /api/login**
```javascript
Request:
{
  "username": "john_doe",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful!",
  "user": {
    "uid": 1,
    "username": "john_doe",
    "role": "customer"
  }
}
+ Set-Cookie: authToken=eyJhbGc...

Response (Error):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### **Protected Endpoints** (Require JWT Cookie)

#### **GET /api/balance**
```javascript
Request Headers:
Cookie: authToken=eyJhbGc...

Response (Success):
{
  "success": true,
  "balance": 100000.00,
  "username": "john_doe",
  "role": "customer"
}

Response (Unauthorized):
{
  "success": false,
  "message": "No token provided"
}
```

#### **POST /api/logout**
```javascript
Request Headers:
Cookie: authToken=eyJhbGc...

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
+ Clear-Cookie: authToken
```

---

## 🔒 Security Implementation

### **1. Password Security**
```javascript
// Registration: Hash password
const hashedPassword = await bcrypt.hash(password, 10);
// 10 rounds of salting

// Login: Compare password
const passwordMatch = await bcrypt.compare(password, user.password);
```

### **2. JWT Authentication**
```javascript
// Generate JWT
const token = jwt.sign(
  { uid: user.uid, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### **3. HTTP-Only Cookies**
```javascript
res.cookie('authToken', token, {
  httpOnly: true,           // Cannot be accessed by JavaScript
  secure: true,             // HTTPS only in production
  maxAge: 60 * 60 * 1000,  // 1 hour
  sameSite: 'lax'          // CSRF protection
});
```

### **4. Database Security**
```javascript
// SSL/TLS Connection
ssl: {
  rejectUnauthorized: false
}

// Prepared Statements (SQL Injection Prevention)
await connection.query(
  'SELECT * FROM KodUser WHERE username = ?',
  [username]
);
```

### **5. Token Management**
```
┌─────────────────────────────────────┐
│  Token Lifecycle                    │
├─────────────────────────────────────┤
│  1. Generate JWT on login           │
│  2. Store in UserToken table        │
│  3. Set expiry (1 hour)             │
│  4. Verify on each protected route  │
│  5. Delete on logout                │
│  6. Auto-expire after 1 hour        │
└─────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture

### **File Structure**
```
public/
├── index.html          # Registration page
├── login.html          # Login page
├── dashboard.html      # Dashboard page
├── verify-email.html   # Email verification (unused)
├── styles-new.css      # Main stylesheet
├── register.js         # Registration logic
├── login.js            # Login logic
├── dashboard.js        # Dashboard logic
└── verify-email.js     # Verification logic
```

### **Component Breakdown**

#### **Registration Page**
```
┌─────────────────────────────────────┐
│  index.html                         │
├─────────────────────────────────────┤
│  • Bank Header (Logo + Name)        │
│  • Glass Card Container             │
│  • 2-Column Form Grid               │
│    - User ID                        │
│    - Username                       │
│    - Email                          │
│    - Phone                          │
│    - Password (with toggle)         │
│    - Role (dropdown)                │
│    - Balance                        │
│  • Submit Button                    │
│  • Switch to Login Link             │
│  • Floating Credit Cards (BG)       │
└─────────────────────────────────────┘
```

#### **Dashboard Page**
```
┌─────────────────────────────────────┐
│  dashboard.html                     │
├─────────────────────────────────────┤
│  Screen 1: Welcome                  │
│  • Bank Header                      │
│  • Welcome Message                  │
│  • Check Balance Button             │
│  • Logout Button                    │
│                                     │
│  Screen 2: Balance (Hidden)         │
│  • Bank Header                      │
│  • Cute Banker Animation            │
│  • Speech Bubble                    │
│  • Balance Display (Glowing)        │
│  • Floating Coins                   │
│  • Confetti Animation               │
│  • Back Button                      │
└─────────────────────────────────────┘
```

### **Animation Features**

#### **1. Cute Banker Girl**
```
Components:
• Face (circle with pink background)
• Hair (brown semicircle)
• Eyes (blinking animation)
• Smile (curved border)
• Body (gradient rectangle)
• Hands (waving animation)
• Speech Bubble (with message)
```

#### **2. Balance Celebration**
```
Sequence:
1. Confetti explosion (3 bursts)
2. Floating coins animation
3. Balance text glow effect
4. Text-to-Speech announcement
5. Sound effect (oscillator)
```

#### **3. Credit Card Decorations**
```
Cards:
• Card 1: Gold gradient (top-right)
• Card 2: Purple gradient (bottom-left)
• Card 3: Pink gradient (right-side)

Features:
• Chip simulation
• Card number dots
• Floating animation
• Rotation effects
```

---

## 📊 Data Flow Summary

```
User Action → Frontend JS → Fetch API → Express Server
                                            ↓
                                    Middleware (CORS, JSON, Cookies)
                                            ↓
                                    Route Handler
                                            ↓
                                    Business Logic
                                            ↓
                                    MySQL2 Driver
                                            ↓
                                    Aiven MySQL (SSL)
                                            ↓
                                    Response ← Server ← Database
                                            ↓
                                    Frontend Update
```

---

## 🎯 Key Design Decisions

### **1. Stateless Authentication**
- JWT tokens instead of sessions
- Tokens stored in database for validation
- HTTP-only cookies for security

### **2. No Email Verification**
- Simplified user flow
- Instant account activation
- Can be enabled later if needed

### **3. Client-Side Rendering**
- Vanilla JavaScript (no framework)
- Fast page loads
- Simple deployment

### **4. Professional UI**
- Dark theme for modern look
- Glassmorphism for depth
- Credit card decorations for context
- Smooth animations for engagement

### **5. Indian Currency Support**
- Number to words conversion
- Lakh/thousand formatting
- Indian English voice (en-IN)

---

## 🚀 Performance Optimizations

1. **Connection Pooling**: Reuse database connections
2. **Prepared Statements**: Prevent SQL injection + faster queries
3. **HTTP-Only Cookies**: Reduce XSS attack surface
4. **CSS Animations**: Hardware-accelerated transforms
5. **Lazy Loading**: Balance screen loads on demand

---

## 📈 Future Enhancements

- [ ] Transaction history
- [ ] Money transfer between users
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Admin dashboard
- [ ] Account statements
- [ ] Mobile app (React Native)

---

**Built with ❤️ for KodNest Secure Bank**
