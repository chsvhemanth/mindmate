# CORS Configuration for Render Deployment

This guide explains how to configure CORS origins in Render for your backend, including how to set your frontend URL **before** deploying the frontend.

## Understanding CORS in Render

The `CORS_ORIGIN` environment variable in Render controls which frontend URLs can make requests to your backend. You can set this **before** deploying your frontend as long as you know what the URL will be.

## Step-by-Step Guide

### Option 1: Set CORS Before Frontend Deployment (Recommended)

If you know your frontend deployment URL (e.g., from Vercel, Netlify, or another platform):

1. **Deploy your backend to Render first**
   - Follow the main deployment guide in `DEPLOYMENT.md`
   - Your backend will be available at: `https://your-backend-name.onrender.com`

2. **Set CORS_ORIGIN in Render Dashboard**
   - Go to your Render service dashboard
   - Click on **"Environment"** tab
   - Find or add the `CORS_ORIGIN` environment variable
   - Set it to your frontend URL:
     ```
     https://your-frontend-app.vercel.app
     ```
   - **For multiple origins** (e.g., localhost for testing + production):
     ```
     https://your-frontend-app.vercel.app,http://localhost:5173
     ```
   - Click **"Save Changes"**
   - Render will automatically redeploy your service

3. **Deploy your frontend** (e.g., to Vercel)
   - Your frontend will now be able to make requests to the backend

### Option 2: Set CORS After Frontend Deployment

If you don't know your frontend URL yet:

1. **Deploy your backend to Render**
   - Initially, you can leave `CORS_ORIGIN` empty or set it to localhost for testing

2. **Deploy your frontend** (e.g., to Vercel)
   - Note the URL you get: `https://your-app-name.vercel.app`

3. **Update CORS_ORIGIN in Render**
   - Go to Render dashboard → **Environment** tab
   - Update `CORS_ORIGIN` to:
     ```
     https://your-app-name.vercel.app
     ```
   - Save changes (Render will auto-redeploy)

## Common Frontend URLs

### Vercel
- Format: `https://your-app-name.vercel.app`
- You can also use custom domains: `https://yourdomain.com`

### Netlify
- Format: `https://your-app-name.netlify.app`
- Or custom domain: `https://yourdomain.com`

### Render (if deploying frontend to Render)
- Format: `https://your-frontend-service.onrender.com`

## Example Configuration

### Single Frontend URL
```env
CORS_ORIGIN=https://mindmate-app.vercel.app
```

### Multiple Origins (Development + Production)
```env
CORS_ORIGIN=https://mindmate-app.vercel.app,http://localhost:5173,http://localhost:8080
```

### Important Notes:
- **No trailing slashes**: Use `https://example.com` NOT `https://example.com/`
- **Include protocol**: Always include `https://` or `http://`
- **Comma-separated**: For multiple origins, separate with commas (no spaces around commas)
- **Case-sensitive**: URLs are case-sensitive, so match exactly

## Verifying CORS Configuration

After setting `CORS_ORIGIN`:

1. **Check Render Logs**
   - Go to Render dashboard → **Logs** tab
   - Look for: `CORS Origins: https://your-frontend-app.vercel.app`
   - This confirms the backend is using your CORS settings

2. **Test from Frontend**
   - Open your frontend in a browser
   - Open browser DevTools (F12) → **Console** tab
   - Try making an API request
   - If CORS is configured correctly, you won't see CORS errors

3. **Common CORS Errors**
   - `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
   - **Solution**: Double-check that your frontend URL exactly matches what's in `CORS_ORIGIN`
   - Make sure there are no typos, trailing slashes, or missing protocols

## Troubleshooting

### Problem: CORS errors after deployment

**Check:**
1. Is `CORS_ORIGIN` set correctly in Render?
2. Does the URL in `CORS_ORIGIN` exactly match your frontend URL?
3. Did Render redeploy after you changed the environment variable?
4. Check Render logs for the actual CORS origins being used

**Solution:**
- Update `CORS_ORIGIN` in Render dashboard
- Wait for auto-redeploy (or manually trigger redeploy)
- Clear browser cache and try again

### Problem: Don't know frontend URL yet

**Solution:**
- Deploy frontend first to get the URL
- Then update `CORS_ORIGIN` in Render
- Or use a placeholder and update later (backend will work, just CORS will block requests until updated)

### Problem: Need to test locally while deployed

**Solution:**
- Set `CORS_ORIGIN` to include localhost:
  ```
  https://your-app.vercel.app,http://localhost:5173
  ```
- This allows both production and local development

## Quick Reference

**Render Dashboard Path:**
```
Your Service → Environment Tab → CORS_ORIGIN variable
```

**Format:**
```
https://frontend-url.com,http://localhost:5173
```

**After changing:**
- Render automatically redeploys
- Wait 1-2 minutes for redeploy
- Check logs to verify new CORS settings

---

## Need Help?

If you're still having CORS issues:
1. Check Render logs for the exact CORS origins being used
2. Verify your frontend URL matches exactly (including https://)
3. Make sure Render has redeployed after changing environment variables
4. Check browser console for specific CORS error messages

