# Troubleshooting Guide

## Sign-In Issues

### Frontend Running on Port 8080

If your frontend is running on `localhost:8080` instead of the default `5173`, make sure:

1. **Backend CORS Configuration**
   - Update `backend/.env` file:
     ```
     CORS_ORIGIN=http://localhost:5173,http://localhost:8080
     ```
   - Or set it to allow all origins in development:
     ```
     CORS_ORIGIN=*
     ```
   - Restart the backend server after changing

2. **Frontend API URL**
   - Check `frontend/.env` file:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Make sure the backend is running on port 5000

### Google Sign-In Not Working

1. **Check Environment Variables**
   - Frontend `.env`: `VITE_GOOGLE_CLIENT_ID` must be set
   - Backend `.env`: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be set
   - Both should use the same Client ID

2. **Google Cloud Console Configuration**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your OAuth 2.0 Client ID
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:8080`
     - `http://localhost:5173`
   - Under "Authorized redirect URIs", add:
     - `http://localhost:5000/api/auth/google/callback`

3. **Browser Console Errors**
   - Open browser DevTools (F12)
   - Check the Console tab for errors
   - Check the Network tab for failed requests
   - Look for CORS errors or 401/403 errors

4. **Common Issues**
   - **"Google OAuth not configured"**: Set `VITE_GOOGLE_CLIENT_ID` in frontend `.env`
   - **CORS errors**: Check backend CORS_ORIGIN includes your frontend URL
   - **"Failed to load Google script"**: Check internet connection, firewall, or ad blockers
   - **Popup blocked**: Allow popups for localhost in your browser

### Email/Password Sign-In Not Working

1. **Check Backend Connection**
   - Open browser DevTools → Network tab
   - Try to sign in
   - Check if requests to `/api/users/login` are being made
   - Check response status codes

2. **Backend Logs**
   - Check backend console for errors
   - Verify MongoDB is connected
   - Check JWT_SECRET is set in backend `.env`

3. **Database Issues**
   - Verify MongoDB is running
   - Check MONGODB_URI in backend `.env` is correct
   - Try creating a new user account

### General Debugging Steps

1. **Check Browser Console**
   ```javascript
   // In browser console, check:
   localStorage.getItem('authToken')  // Should return token if logged in
   localStorage.getItem('user')        // Should return user object if logged in
   ```

2. **Check Network Requests**
   - Open DevTools → Network tab
   - Filter by "Fetch/XHR"
   - Try signing in and check:
     - Request URL (should be `http://localhost:5000/api/...`)
     - Request status (should be 200)
     - Response data

3. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"success":true,"message":"Server is running",...}`

4. **Clear Browser Data**
   - Clear localStorage: `localStorage.clear()`
   - Clear cookies
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### API Connection Issues

1. **Verify Backend is Running**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `Server is running on port 5000`

2. **Verify Frontend API URL**
   - Check `frontend/.env` has: `VITE_API_URL=http://localhost:5000/api`
   - Restart frontend after changing `.env` file

3. **Test API Connection**
   ```bash
   # From frontend directory or browser console
   fetch('http://localhost:5000/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

### Common Error Messages

- **"API request failed"**: Backend not running or wrong API URL
- **"CORS policy"**: Backend CORS_ORIGIN doesn't include frontend URL
- **"Token is not valid"**: JWT token expired or invalid, try logging out and back in
- **"User not found"**: User doesn't exist in database, try registering
- **"Network error"**: Backend not accessible, check if it's running

### Still Having Issues?

1. Check all environment variables are set correctly
2. Verify both frontend and backend are running
3. Check browser console and network tab for specific errors
4. Verify MongoDB connection
5. Check Google OAuth credentials are correct
6. Try clearing browser cache and localStorage

For more help, check the main setup guides:
- `AUTHENTICATION_SETUP.md`
- `SETUP.md`
- `QUICKSTART.md`





