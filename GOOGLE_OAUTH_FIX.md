# Fix: Google OAuth "origin_mismatch" Error

## Error Message
```
Access blocked: Authorization Error
Error 400: origin_mismatch
```

## What This Means
Your frontend URL (`http://localhost:8080`) is not registered in Google Cloud Console as an authorized JavaScript origin.

## Quick Fix (Step-by-Step)

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project (or create a new one)

### 2. Navigate to OAuth 2.0 Client
- Go to **APIs & Services** → **Credentials**
- Find your OAuth 2.0 Client ID (or create a new one)
- Click **Edit** (pencil icon)

### 3. Add Your Frontend URL
In the **Authorized JavaScript origins** section, click **+ ADD URI** and add:
```
http://localhost:8080
```

**Also add these if not already present:**
```
http://localhost:5173
http://localhost:5000
```

### 4. Save Changes
- Click **SAVE** at the bottom
- Wait a few seconds for changes to propagate (can take up to 5 minutes)

### 5. Test Again
- Clear your browser cache or use incognito mode
- Try signing in again

## Visual Guide

1. **Credentials Page:**
   ```
   Google Cloud Console
   → APIs & Services
   → Credentials
   → [Your OAuth 2.0 Client ID]
   → Click Edit (pencil icon)
   ```

2. **Authorized JavaScript origins section:**
   ```
   Authorized JavaScript origins
   ┌─────────────────────────────┐
   │ http://localhost:5173       │
   │ http://localhost:5000       │
   │ http://localhost:8080  ← ADD THIS
   └─────────────────────────────┘
   [+ ADD URI]
   ```

3. **Authorized redirect URIs section:**
   ```
   Authorized redirect URIs
   ┌──────────────────────────────────────────────┐
   │ http://localhost:5000/api/auth/google/...    │
   └──────────────────────────────────────────────┘
   [+ ADD URI]
   ```

## Important Notes

1. **No trailing slashes:** Use `http://localhost:8080` NOT `http://localhost:8080/`

2. **HTTP vs HTTPS:** For local development, use `http://` (not `https://`)

3. **Port numbers matter:** Each port is a different origin:
   - `http://localhost:8080` ≠ `http://localhost:5173`
   - Add all ports you might use

4. **Changes take time:** After saving, wait 1-5 minutes before testing

5. **Clear browser cache:** Sometimes browsers cache OAuth errors

## Still Not Working?

### Check Your Current Frontend URL
1. Look at your browser's address bar
2. Copy the exact URL (e.g., `http://localhost:8080`)
3. Make sure this EXACT URL is in the authorized origins list

### Verify Environment Variables
Check your `frontend/.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

Make sure this matches the Client ID in Google Cloud Console.

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any additional error messages
4. Check Network tab for failed requests

### Test with Different Port
If you want to test with the default Vite port:
1. Change `frontend/vite.config.ts` port back to 5173
2. Or add both ports to authorized origins
3. Restart frontend

## Production Deployment

When deploying to production, you'll need to:
1. Add your production domain to authorized origins:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`
2. Update redirect URIs accordingly
3. Use HTTPS (not HTTP) for production

## Quick Checklist

- [ ] Added `http://localhost:8080` to authorized JavaScript origins
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 1-5 minutes for changes to propagate
- [ ] Cleared browser cache or using incognito mode
- [ ] Verified `VITE_GOOGLE_CLIENT_ID` in frontend `.env` matches Google Console
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 8080
- [ ] Tried signing in again

If you've done all of the above and it still doesn't work, check the browser console for more specific error messages.



