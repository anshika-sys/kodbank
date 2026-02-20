# 🚀 Deployment Guide - KodNest Secure Bank

## Option 1: Deploy to Render (Recommended - Free)

### Step 1: Prepare for Deployment

No additional commands needed! Your project is already configured.

### Step 2: Deploy to Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect GitHub** and select repository: `anshika-sys/kodbank`
5. **Configure the service**:
   - **Name**: `kodnest-secure-bank` (or any name you like)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   DB_HOST = your-aiven-mysql-host.aivencloud.com
   DB_PORT = your-port
   DB_NAME = defaultdb
   DB_USER = avnadmin
   DB_PASSWORD = your-aiven-password
   JWT_SECRET = kodnest_secure_bank_secret_key_2024_super_secure
   JWT_EXPIRY = 1h
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASSWORD = your-gmail-app-password
   PORT = 10000
   CLIENT_URL = https://your-app-name.onrender.com
   ```
   
   **Note**: Use your actual Aiven MySQL credentials from the `.env` file

7. **Click "Create Web Service"**

8. **Wait 2-3 minutes** for deployment

9. **Your app will be live at**: `https://kodnest-secure-bank.onrender.com`

---

## Option 2: Deploy to Railway (Alternative - Free)

### Step 1: Install Railway CLI (Optional)

```bash
npm install -g @railway/cli
```

### Step 2: Deploy via Railway Dashboard

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select**: `anshika-sys/kodbank`
5. **Add Environment Variables** (same as above)
6. **Deploy!**

Your app will be live at: `https://your-app.up.railway.app`

---

## Option 3: Deploy to Vercel (Requires Serverless Setup)

Vercel requires converting to serverless functions. Not recommended for this project.

---

## Post-Deployment Steps

### 1. Update CLIENT_URL

After deployment, update the `CLIENT_URL` environment variable with your actual deployed URL:

**On Render:**
- Go to your service → Environment
- Update `CLIENT_URL` to your deployed URL (e.g., `https://kodnest-secure-bank.onrender.com`)
- Save changes (service will redeploy automatically)

### 2. Test Your Application

1. Visit your deployed URL
2. Register a new account
3. Login
4. Check balance and enjoy the celebration! 🎉

### 3. Custom Domain (Optional)

**On Render:**
- Go to Settings → Custom Domain
- Add your domain
- Update DNS records as instructed

---

## Troubleshooting

### Database Connection Issues
- Verify Aiven MySQL service is running
- Check environment variables are correct
- Ensure Aiven allows connections from Render's IP

### Port Issues
- Render automatically assigns port 10000
- Make sure `PORT` environment variable is set

### Email Not Working
- Email verification is disabled by default
- To enable: Update Gmail credentials in environment variables

---

## Important Notes

⚠️ **Free Tier Limitations:**
- Render free tier spins down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Upgrade to paid tier for always-on service

🔒 **Security:**
- Never commit `.env` file to GitHub
- Rotate your database password periodically
- Use strong JWT secret in production

---

## Quick Deploy Commands (If using CLI)

### Render CLI
```bash
# Not available - use dashboard
```

### Railway CLI
```bash
railway login
railway link
railway up
railway variables set DB_HOST=your-aiven-host.aivencloud.com
railway variables set DB_PORT=your-port
railway variables set DB_NAME=defaultdb
railway variables set DB_USER=avnadmin
railway variables set DB_PASSWORD=your-password
railway variables set JWT_SECRET=kodnest_secure_bank_secret_key_2024_super_secure
railway variables set PORT=10000
```

---

## 🎉 Your Bank is Live!

Once deployed, share your link:
`https://your-app-name.onrender.com`

Enjoy your professional banking application! 💙
