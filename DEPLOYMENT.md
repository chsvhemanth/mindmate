# Deployment Guide: MindMate on Render & Vercel

This guide will help you deploy the MindMate backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account with your MindMate repository
- MongoDB Atlas account (free tier works)
- Google Cloud Console account (for OAuth)
- Groq API account (for AI chat)
- Render account (free tier available)
- Vercel account (free tier available)

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository

1. Ensure your backend code is in the `backend/` directory
2. Make sure `package.json` has a `start` script: `"start": "node src/server.js"`
3. Commit and push your code to GitHub

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository
5. Configure the service:
   - **Name**: `mindmate-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade for better performance)

### Step 3: Configure Environment Variables

In the Render dashboard, go to **Environment** tab and add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmate?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-generate-a-strong-random-string
CORS_ORIGIN=https://your-frontend-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-name.onrender.com/api/auth/google/callback
GROQ_API_KEY=your-groq-api-key
```

**Important Notes:**
- Replace `your-backend-name.onrender.com` with your actual Render service URL
- For `CORS_ORIGIN`: You can set your frontend URL **before** deploying it if you know what it will be (e.g., `https://your-app-name.vercel.app`). If you don't know it yet, you can:
  - Leave it empty or set to localhost for now
  - Update it after deploying the frontend (Render will auto-redeploy when you change environment variables)
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)
- **See `CORS_SETUP_RENDER.md` for detailed CORS configuration guide**

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your backend will be available at: `https://your-backend-name.onrender.com`
5. Test the health endpoint: `https://your-backend-name.onrender.com/api/health`

### Step 5: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `https://your-frontend-app.vercel.app`
5. Add to **Authorized redirect URIs**:
   - `https://your-backend-name.onrender.com/api/auth/google/callback`
6. Save changes

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Your Repository

1. Ensure your frontend code is in the `frontend/` directory
2. Make sure `package.json` has a `build` script: `"build": "vite build"`
3. Commit and push your code to GitHub

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite (or auto-detect)
   - **Root Directory**: `frontend` (important: set this to the frontend folder)
   - **Build Command**: `npm run build` (Vercel will auto-detect from `vercel.json` in frontend folder)
   - **Output Directory**: `dist` (Vercel will auto-detect from `vercel.json`)
   - **Install Command**: `npm install` (or leave default)
   
   **Note:** The `vercel.json` file in the `frontend/` directory will automatically configure these settings.

### Step 3: Configure Environment Variables

In Vercel project settings, go to **Settings** → **Environment Variables** and add:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Important Notes:**
- Replace `your-backend-name.onrender.com` with your actual Render backend URL
- Use the same `GOOGLE_CLIENT_ID` as in your backend

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will automatically build and deploy your frontend
3. Wait for deployment to complete (usually 1-3 minutes)
4. Your frontend will be available at: `https://your-app-name.vercel.app`
5. Vercel will also provide a custom domain option

### Step 5: Update Backend CORS (if not set earlier)

**Note:** If you already set `CORS_ORIGIN` in Step 3 with your frontend URL, you can skip this step.

1. Go back to Render dashboard
2. Update the `CORS_ORIGIN` environment variable to include your Vercel URL:
   ```
   https://your-app-name.vercel.app
   ```
3. Save changes (Render will automatically redeploy on environment variable changes)
4. Wait for redeploy to complete (1-2 minutes)

**Tip:** You can set `CORS_ORIGIN` before deploying the frontend if you know the URL. See `CORS_SETUP_RENDER.md` for more details.

---

## Part 3: Post-Deployment Checklist

### Backend Verification

- [ ] Health check endpoint works: `https://your-backend.onrender.com/api/health`
- [ ] MongoDB connection is successful (check Render logs)
- [ ] All environment variables are set correctly
- [ ] CORS is configured to allow your Vercel frontend

### Frontend Verification

- [ ] Frontend loads at your Vercel URL
- [ ] API calls are going to the correct backend URL
- [ ] Google OAuth sign-in works
- [ ] All features are functional

### Security Checklist

- [ ] `JWT_SECRET` is a strong random string
- [ ] MongoDB connection string uses strong credentials
- [ ] Google OAuth credentials are properly configured
- [ ] CORS only allows your frontend domain
- [ ] All sensitive data is in environment variables (not in code)

---

## Part 4: Troubleshooting

### Backend Issues

**Problem: Build fails on Render**
- Check that `package.json` has correct `start` script
- Verify Node.js version compatibility
- Check Render build logs for specific errors

**Problem: MongoDB connection fails**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
- Ensure database user has correct permissions

**Problem: CORS errors**
- Verify `CORS_ORIGIN` includes your exact Vercel URL (with https://)
- Check that backend is redeployed after changing CORS_ORIGIN
- Ensure no trailing slashes in CORS_ORIGIN

**Problem: Service goes to sleep (Free Plan)**
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading to paid plan for always-on service

### Frontend Issues

**Problem: Build fails on Vercel**
- Check that all dependencies are in `package.json`
- Verify `vite.config.ts` is correct
- Check Vercel build logs for specific errors

**Problem: API calls fail**
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Problem: Environment variables not working**
- Vercel requires rebuild after adding environment variables
- Ensure variables start with `VITE_` prefix
- Check that variables are set for correct environment (Production/Preview/Development)

---

## Part 5: Custom Domains (Optional)

### Vercel Custom Domain

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `CORS_ORIGIN` in Render to include your custom domain

### Render Custom Domain

1. Go to Render service → **Settings** → **Custom Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `GOOGLE_REDIRECT_URI` to use custom domain

---

## Part 6: Monitoring & Maintenance

### Render Monitoring

- Check **Logs** tab for application logs
- Monitor **Metrics** for CPU, memory, and request metrics
- Set up alerts for service downtime

### Vercel Monitoring

- Check **Deployments** tab for build status
- Monitor **Analytics** for performance metrics
- Review **Logs** for runtime errors

### Database Maintenance

- Regularly backup MongoDB Atlas database
- Monitor database usage and upgrade if needed
- Review and optimize slow queries

---

## Quick Reference

### Backend URLs
- **Render Service**: `https://your-backend-name.onrender.com`
- **Health Check**: `https://your-backend-name.onrender.com/api/health`
- **API Base**: `https://your-backend-name.onrender.com/api`

### Frontend URLs
- **Vercel App**: `https://your-app-name.vercel.app`
- **Custom Domain**: (if configured)

### Environment Variables Summary

**Backend (Render):**
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GROQ_API_KEY`

**Frontend (Vercel):**
- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

---

## Support

If you encounter issues:
1. Check the logs in Render and Vercel dashboards
2. Verify all environment variables are set correctly
3. Test endpoints individually using tools like Postman or curl
4. Review the troubleshooting section above

For Render-specific issues: [Render Documentation](https://render.com/docs)
For Vercel-specific issues: [Vercel Documentation](https://vercel.com/docs)

