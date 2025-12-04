# Deployment Guide

This guide will help you deploy the PayTM App to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- Domain names for frontend and backend (optional but recommended)

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/paytm-app
# For production (MongoDB Atlas): mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Secret (IMPORTANT: Use a strong, random secret in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
# For development: http://localhost:5173

# Environment
NODE_ENV=production
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Base URL
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
# For development: http://localhost:3001/api/v1
```

## Deployment Steps

### Option 1: Traditional Deployment

#### Backend Deployment

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   - Create `.env` file with the variables listed above

3. **Start the server:**
   ```bash
   npm start
   ```
   Or use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start index.js --name paytm-backend
   ```

#### Frontend Deployment

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   - Create `.env` file with `VITE_API_BASE_URL`

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Deploy the `dist/` folder:**
   - Upload to Vercel, Netlify, or any static hosting service
   - Or serve with nginx/apache

### Option 2: Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Or build individually:**
   ```bash
   # Backend
   docker build -f Dockerfile.backend -t paytm-backend .
   docker run -p 3001:3001 --env-file backend/.env paytm-backend

   # Frontend
   docker build -f Dockerfile.frontend -t paytm-frontend .
   docker run -p 80:80 paytm-frontend
   ```

## Platform-Specific Deployment

### Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `frontend/` directory
3. Run `vercel`
4. Set environment variable `VITE_API_BASE_URL` in Vercel dashboard

### Netlify (Frontend)

1. Connect your repository to Netlify
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`
4. Set environment variable `VITE_API_BASE_URL` in Netlify dashboard

### Railway / Render (Backend)

1. Connect your repository
2. Set root directory to `backend/`
3. Add all environment variables
4. Build command: `npm install`
5. Start command: `npm start`

### Heroku (Backend)

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   heroku config:set FRONTEND_URL=https://your-frontend.com
   ```
4. Deploy: `git push heroku main`

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use HTTPS for both frontend and backend
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting (recommended)
- [ ] Set up logging and monitoring
- [ ] Regular backups of MongoDB database

## Post-Deployment

1. Test all endpoints
2. Verify CORS is working correctly
3. Check error handling
4. Monitor logs for any issues
5. Set up SSL certificates (Let's Encrypt)

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend matches your actual frontend URL
- Check that frontend is using the correct `VITE_API_BASE_URL`

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check network/firewall settings
- Ensure MongoDB is accessible from your server

### Build Issues
- Ensure all dependencies are installed
- Check Node.js version (18+)
- Verify environment variables are set correctly

