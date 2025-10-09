# Vercel Deployment Checklist - Authentication Issues

## 🔍 Key Issues Found & Fixed

### 1. **Duplicate Cookie Domain Settings** ✅ FIXED
- **Problem**: Domain was set in multiple places (`crossSubDomainCookies.domain`, `defaultCookieAttributes.domain`, and `session_token.attributes.domain`)
- **Impact**: Caused cookie conflicts and prevented cookies from being set correctly
- **Fix**: Removed duplicate domain settings; now only set in `crossSubDomainCookies.domain`

### 2. **Wildcard in trustedOrigins** ✅ FIXED
- **Problem**: Used `https://*.dschulz.dev` wildcard pattern
- **Impact**: Better Auth doesn't support wildcards in trustedOrigins
- **Fix**: Removed wildcard, now listing only specific subdomains

## 📋 Vercel Environment Variables to Check

### Backend (`promptpipe-backend`)

Open your backend project in Vercel and verify these environment variables:

```bash
# Required - Auth Configuration
BETTER_AUTH_URL=https://promptpipe-backend.dschulz.dev
BETTER_AUTH_SECRET=<your-secret-here>
NODE_ENV=production

# Required - GitHub OAuth
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# Required - URLs
FRONTEND_URL=https://promptpipe.dschulz.dev

# Required - Database & Cache
DATABASE_URL=<your-production-postgres-url>
REDIS_URL=<your-production-redis-url>

# Required - Analytics
POSTHOG_API_KEY=<your-posthog-key>

# Optional - AI Services (if used)
OPENAI_API_KEY=<your-openai-key>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-key>
OPENROUTER_KEY=<your-openrouter-key>
```

### Frontend (`promptpipe`)

Open your frontend project in Vercel and verify these environment variables:

```bash
VITE_SERVER_URL=https://promptpipe-backend.dschulz.dev
VITE_BASE_URL=https://promptpipe.dschulz.dev
```

## ⚠️ Critical Checks

### 1. GitHub OAuth App Configuration
1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Verify **Authorization callback URL**:
   ```
   https://promptpipe-backend.dschulz.dev/api/auth/callback/github
   ```
4. Make sure it's **exactly** this URL (no trailing slash)

### 2. Trailing Slashes
Check that **NONE** of your URLs have trailing slashes:
- ❌ `https://promptpipe-backend.dschulz.dev/`
- ✅ `https://promptpipe-backend.dschulz.dev`

### 3. HTTPS Verification
All production URLs MUST use HTTPS:
- Both frontend and backend URLs
- GitHub OAuth callback URL

## 🧪 Testing After Deployment

### 1. Deploy Backend First
```bash
# From your project root
git add .
git commit -m "Fix auth configuration for Vercel"
git push origin dev
```

Wait for Vercel to deploy the backend.

### 2. Test Backend Health
Visit: `https://promptpipe-backend.dschulz.dev/health` (or your health endpoint)

### 3. Deploy Frontend
After backend is deployed, deploy frontend (if auto-deploy is disabled).

### 4. Test Authentication Flow
1. Open: `https://promptpipe.dschulz.dev`
2. Click "Sign in with GitHub"
3. Authorize the app
4. Check browser DevTools:
   - **Console**: Should be no CORS errors
   - **Application > Cookies**: Look for cookies with:
     - Domain: `.dschulz.dev`
     - Secure: ✓
     - HttpOnly: ✓
     - SameSite: `None`

## 🐛 Common Issues & Solutions

### Issue: "CORS policy error"
**Check:**
- Backend `NODE_ENV=production` is set
- Frontend URL is in backend's allowed origins
- Cookie header is in CORS `allowedHeaders`

### Issue: "Cookies not being set"
**Check:**
- `BETTER_AUTH_URL` is set correctly
- Both domains use HTTPS
- Domain is set to `.dschulz.dev` (with the leading dot)
- `SameSite=None` and `Secure=true` for production

### Issue: "Redirect to GitHub works but callback fails"
**Check:**
- GitHub OAuth callback URL matches exactly
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Backend is accessible at the callback URL

### Issue: "Session not persisting across page refreshes"
**Check:**
- Cookies are being set with correct domain
- Cookie is not being blocked by browser (check Application > Cookies)
- `credentials: 'include'` is set in frontend fetch options

## 📊 Debugging Tools

### Browser DevTools
1. **Network Tab**: Check request/response headers
   - Look for `Set-Cookie` in response headers
   - Look for `Cookie` in request headers
   
2. **Application Tab**: Check stored cookies
   - Verify domain, secure, httpOnly, sameSite attributes

3. **Console Tab**: Check for JavaScript errors

### Vercel Function Logs
1. Go to your Vercel project
2. Click on the deployment
3. Click "Functions" tab
4. Check logs for errors

### Check Cookie Headers
In browser DevTools > Network tab:
- Click on any request to your backend
- Check Response Headers for `Set-Cookie`
- Check Request Headers for `Cookie`

## 🎯 Expected Cookie Attributes in Production

```
Name: better-auth.session_token (or similar)
Value: <token-value>
Domain: .dschulz.dev
Path: /
Expires: <future-date>
Size: <varies>
HttpOnly: ✓
Secure: ✓
SameSite: None
Priority: Medium
```

## 🔄 If Still Not Working

1. **Clear all cookies** for both domains
2. **Hard refresh** browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. **Try in incognito/private mode** to rule out browser extensions
4. **Check Vercel logs** for backend errors during OAuth flow
5. **Verify database connection** - check if users are being created
6. **Check trust proxy setting** - ensure it's set to `true` in backend

## ✅ Success Indicators

When everything is working correctly, you should see:

1. ✅ Sign in redirects to GitHub
2. ✅ GitHub authorization completes
3. ✅ Redirects back to your app
4. ✅ User is logged in
5. ✅ Cookie is visible in DevTools with correct attributes
6. ✅ Page refresh maintains logged-in state
7. ✅ No CORS errors in console
8. ✅ API requests include authentication cookie
