# Vercel Deployment Guide

## Issues Fixed

### 1. **Out of Memory (OOM) Error**
- **Problem:** Root `package.json` had a `postinstall` script that tried to install both frontend and backend dependencies, causing memory issues on Vercel
- **Solution:** 
  - Created `vercel.json` to set `rootDirectory` to `frontend`
  - Modified `install-deps.js` to skip backend installation on Vercel
  - Removed problematic dependency from `frontend/package.json`

### 2. **Build Configuration**
- **Problem:** Vercel was trying to build from root directory
- **Solution:** Configured `vercel.json` to build from `frontend` directory only

## Files Changed

1. **`vercel.json`** - Vercel build configuration
2. **`frontend/package.json`** - Removed `"valentine-gift-store": "file:.."` dependency
3. **`install-deps.js`** - Added Vercel detection to skip backend installation
4. **`.vercelignore`** - Excludes backend and unnecessary files

## Vercel Configuration Steps

### 1. Environment Variables
In your Vercel project settings, add:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

Replace with your actual backend API URL (where your Express server is hosted).

### 2. Build Settings
Vercel should automatically detect the `vercel.json` configuration:
- **Root Directory:** `frontend`
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 3. Project Settings
1. Go to your Vercel project settings
2. Under "General" → "Root Directory", it should be set to `frontend` (or leave empty if using vercel.json)
3. Make sure "Framework Preset" is set to "Next.js"

## Backend Deployment

The backend should be deployed separately:
- **Option 1:** Deploy to a service like Railway, Render, or Heroku
- **Option 2:** Deploy as a separate Vercel serverless function
- **Option 3:** Use Vercel's API routes (if you move backend code to `frontend/app/api`)

## Testing the Deployment

After deployment:
1. Check that the frontend builds successfully
2. Verify environment variable `NEXT_PUBLIC_API_URL` is set correctly
3. Test API calls from the deployed frontend
4. Check browser console for any CORS or API errors

## Troubleshooting

### If build still fails:
1. Check Vercel build logs for specific errors
2. Ensure `frontend/package.json` doesn't have any file: dependencies
3. Verify `vercel.json` is in the repository root
4. Make sure Node.js version is compatible (check `frontend/package.json` engines if specified)

### If API calls fail:
1. Verify `NEXT_PUBLIC_API_URL` environment variable is set
2. Check CORS settings on your backend
3. Ensure backend is accessible from the internet
4. Check browser console for specific error messages

