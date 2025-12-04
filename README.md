# Transfer-It

A simplified Paytm clone built with a focus on core features such as user sign-up, account creation, and money transfers between users. The app maintains basic account management functionality, allowing users to transfer money, with the deducted amount reflected in the account balance.

## Features

- **User Sign-Up**: New users can sign up and create their accounts with basic information.
- **User Authentication**: Secure authentication process for account access.
- **Money Transfer**: Users can transfer money to other users within the app.
- **Account Balance Management**: After a successful transfer, the sender’s balance is updated, and the transaction is reflected in their account.

## Tech Stack

- **Frontend**: React.js, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or any preferred database for user and transaction data)
  
## Installation and Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `backend/` directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/paytm-app
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev  # (requires nodemon)
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `frontend/` directory (optional, defaults to localhost):
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

### Quick Start: Netlify + Railway

**For step-by-step instructions on deploying to Netlify (Frontend) and Railway (Backend), see:**
👉 **[NETLIFY_RAILWAY_DEPLOYMENT.md](./NETLIFY_RAILWAY_DEPLOYMENT.md)**

### Other Deployment Options

For general deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick deployment options:
- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Backend**: Deploy to Railway, Render, Heroku, or any Node.js hosting
- **Full Stack**: Use Docker Compose (see `docker-compose.yml`)


![alt text](./Screenshot%202024-10-05%20at%203.49.46 PM.png)
![alt text](./Screenshot%202024-10-05%20at%203.50.05 PM.png)
![alt text](./Screenshot%202024-10-05%20at%203.50.34 PM.png)
![alt text](./Screenshot%202024-10-05%20at%203.58.51 PM.png)