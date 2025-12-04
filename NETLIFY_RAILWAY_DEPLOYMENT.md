# Deployment Guide: Netlify (Frontend) + Railway (Backend)

This guide provides step-by-step instructions for deploying the PayTM App using Netlify for the frontend and Railway for the backend.

## Prerequisites

- GitHub account (recommended for easy deployment)
- Netlify account (free tier available)
- Railway account (free tier available)
- MongoDB Atlas account (free tier available) or use Railway's MongoDB

---

## Part 1: Backend Deployment on Railway

### Step 1: Prepare Your Backend

1. **Ensure your backend is ready:**
   - Make sure `backend/package.json` has a `start` script
   - Verify all dependencies are listed in `package.json`

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended) or email
3. Complete the onboarding process

### Step 3: Create New Project on Railway

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"** (recommended) or **"Empty Project"**
3. If using GitHub:
   - Authorize Railway to access your repositories
   - Select your repository
   - Railway will auto-detect it's a Node.js project

### Step 4: Configure Backend Service

1. **Set Root Directory:**
   - Go to your service settings
   - Under **"Root Directory"**, set it to: `backend`
   - Save changes

2. **Set Build Command:**
   - Railway usually auto-detects, but verify:
   - Build Command: `npm install` (or leave empty)
   - Start Command: `npm start`

### Step 5: Set Environment Variables

Click on your service → **Variables** tab → Add these variables:

```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-random-key-change-this
FRONTEND_URL=https://your-netlify-app.netlify.app
NODE_ENV=production
```

**Important Notes:**
- `JWT_SECRET`: Generate a strong random string (you can use: `openssl rand -base64 32`)
- `MONGODB_URI`: See MongoDB setup below
- `FRONTEND_URL`: You'll update this after deploying frontend
- Railway will auto-generate a `PORT` variable, but you can set it explicitly

### Step 6: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: Add `0.0.0.0/0` (allows all IPs) or Railway's IP
5. Get connection string: Click "Connect" → "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
7. Replace `<password>` with your actual password
8. Add this as `MONGODB_URI` in Railway

**Option B: Railway MongoDB Plugin**

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will create a MongoDB instance
4. Click on the MongoDB service → **"Variables"** tab
5. Copy the `MONGO_URL` value
6. Use this as `MONGODB_URI` in your backend service

### Step 7: Deploy Backend

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** if you uploaded manually
3. Wait for deployment to complete
4. Check the **"Deployments"** tab for logs

### Step 8: Get Backend URL

1. Once deployed, Railway will provide a URL
2. Go to your service → **"Settings"** → **"Generate Domain"**
3. Copy the domain (e.g., `your-app.up.railway.app`)
4. Your API will be at: `https://your-app.up.railway.app/api/v1`

### Step 9: Update CORS Settings

1. Go back to **Variables** in Railway
2. Update `FRONTEND_URL` with your Netlify URL (you'll get this after frontend deployment)
3. Or temporarily set it to: `https://your-netlify-app.netlify.app`

---

## Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Your Frontend

1. **Ensure build works locally:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - Verify `dist/` folder is created without errors

2. **Check vite.config.js:**
   - Should have React plugin configured
   - No special build configurations needed

### Step 2: Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with GitHub (recommended) or email
3. Complete the onboarding

### Step 3: Deploy via GitHub (Recommended)

1. **Connect Repository:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect to GitHub
   - Authorize Netlify
   - Select your repository

2. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `frontend/dist`
   - Click **"Deploy site"**

### Step 4: Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-app.up.railway.app/api/v1
   ```
   (Use the Railway backend URL from Step 8 above)

4. **Important:** After adding environment variables, trigger a new deployment:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

### Step 5: Configure Site Settings

1. **Site Name:**
   - Go to **Site settings** → **Change site name**
   - Choose a unique name (e.g., `paytm-app-2024`)
   - Your site will be at: `https://paytm-app-2024.netlify.app`

2. **Update Backend CORS:**
   - Go back to Railway
   - Update `FRONTEND_URL` variable to: `https://your-site-name.netlify.app`

### Step 6: Verify Deployment

1. Visit your Netlify site URL
2. Open browser console (F12)
3. Check for any CORS errors
4. Test login/signup functionality

---

## Part 3: Final Configuration

### Update Environment Variables

**Railway (Backend):**
```env
FRONTEND_URL=https://your-netlify-site.netlify.app
```

**Netlify (Frontend):**
```env
VITE_API_BASE_URL=https://your-railway-app.up.railway.app/api/v1
```

### Test the Application

1. **Frontend:** Visit your Netlify URL
2. **Backend Health Check:** Visit `https://your-railway-app.up.railway.app/health`
3. **Test Features:**
   - Sign up a new user
   - Sign in
   - View dashboard
   - Transfer money

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptom:** Browser console shows CORS errors

**Solution:**
- Verify `FRONTEND_URL` in Railway matches your Netlify URL exactly
- Check that URL doesn't have trailing slash
- Redeploy backend after changing CORS settings

#### 2. API Not Found (404)
**Symptom:** Frontend can't reach backend API

**Solution:**
- Verify `VITE_API_BASE_URL` in Netlify is correct
- Check Railway deployment logs for errors
- Ensure backend is running (check Railway dashboard)

#### 3. Environment Variables Not Working
**Symptom:** Frontend still uses localhost API

**Solution:**
- Netlify: After adding env vars, trigger a new deployment
- Clear browser cache
- Check build logs in Netlify to verify env vars are included

#### 4. MongoDB Connection Failed
**Symptom:** Backend logs show MongoDB connection errors

**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (should include Railway IPs)
- Verify database user credentials
- Check MongoDB Atlas cluster is running

#### 5. Build Fails on Netlify
**Symptom:** Netlify deployment fails

**Solution:**
- Check build logs for specific errors
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible (Netlify uses Node 18 by default)
- Check that `frontend/dist` directory is created after build

### Checking Logs

**Railway:**
- Go to your service → **"Deployments"** tab
- Click on latest deployment → View logs

**Netlify:**
- Go to **"Deploys"** tab
- Click on deployment → View build logs

---

## Quick Reference

### Railway Backend URLs
- **Dashboard:** [railway.app](https://railway.app)
- **Your API:** `https://your-app.up.railway.app/api/v1`
- **Health Check:** `https://your-app.up.railway.app/health`

### Netlify Frontend URLs
- **Dashboard:** [app.netlify.com](https://app.netlify.com)
- **Your Site:** `https://your-site-name.netlify.app`

### Environment Variables Checklist

**Railway (Backend):**
- ✅ `PORT=3001`
- ✅ `MONGODB_URI=mongodb+srv://...`
- ✅ `JWT_SECRET=strong-random-secret`
- ✅ `FRONTEND_URL=https://your-site.netlify.app`
- ✅ `NODE_ENV=production`

**Netlify (Frontend):**
- ✅ `VITE_API_BASE_URL=https://your-app.up.railway.app/api/v1`

---

## Next Steps After Deployment

1. **Set up Custom Domain** (Optional):
   - Netlify: Site settings → Domain management
   - Railway: Service settings → Generate custom domain

2. **Enable HTTPS:**
   - Both platforms provide HTTPS automatically
   - Verify SSL certificates are active

3. **Set up Monitoring:**
   - Railway: Built-in metrics dashboard
   - Netlify: Built-in analytics (paid feature)

4. **Backup Strategy:**
   - Set up MongoDB Atlas backups
   - Regular database exports

5. **Performance Optimization:**
   - Enable Netlify CDN caching
   - Optimize images and assets
   - Monitor Railway resource usage

---

## Cost Estimation

**Free Tier Limits:**

- **Railway:** $5 free credit/month (usually enough for small apps)
- **Netlify:** 100GB bandwidth, 300 build minutes/month (free)
- **MongoDB Atlas:** 512MB storage (free)

**Typical Monthly Cost:** $0 (if within free tier limits)

---

## Support Resources

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## Deployment Checklist

- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] MongoDB configured and connected
- [ ] Backend environment variables set
- [ ] Backend URL obtained
- [ ] Netlify account created
- [ ] Frontend deployed on Netlify
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Application tested end-to-end
- [ ] Custom domains configured (optional)
- [ ] Monitoring set up (optional)

---

**Congratulations! Your PayTM App is now live! 🚀**

