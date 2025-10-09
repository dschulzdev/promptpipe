# Vercel Deployment Configuration

## Environment Variables Setup

### Backend (https://promptpipe-backend.dschulz.dev)

Set the following environment variables in Vercel for the backend deployment:

1. **BETTER_AUTH_URL**
   - Value: `https://promptpipe-backend.dschulz.dev`
   - Description: The base URL of your backend authentication service

2. **BETTER_AUTH_SECRET**
   - Value: `AcF7q7NEkgcEZTBxgSLjf1JqFRi0flJc` (or generate a new secure secret)
   - Description: Secret key for Better Auth

3. **GITHUB_CLIENT_ID**
   - Value: Your GitHub OAuth App Client ID
   - Description: GitHub OAuth application client ID

4. **GITHUB_CLIENT_SECRET**
   - Value: Your GitHub OAuth App Client Secret
   - Description: GitHub OAuth application client secret

5. **NODE_ENV**
   - Value: `production`
   - Description: Sets the environment to production mode

6. **DATABASE_URL**
   - Value: Your production PostgreSQL connection string
   - Description: PostgreSQL database connection string

7. **REDIS_URL**
   - Value: Your production Redis connection string
   - Description: Redis connection string for queue management

8. **FRONTEND_URL**
   - Value: `https://promptpipe.dschulz.dev`
   - Description: Your frontend application URL

9. **POSTHOG_API_KEY**
   - Value: Your PostHog API key
   - Description: Analytics service API key

10. **OPENAI_API_KEY** (if used)
    - Value: Your OpenAI API key

11. **GOOGLE_GENERATIVE_AI_API_KEY** (if used)
    - Value: Your Google AI API key

12. **OPENROUTER_KEY** (if used)
    - Value: Your OpenRouter API key

### Frontend (https://promptpipe.dschulz.dev)

Set the following environment variables in Vercel for the frontend deployment:

1. **VITE_SERVER_URL**
   - Value: `https://promptpipe-backend.dschulz.dev`
   - Description: Backend API base URL

2. **VITE_BASE_URL**
   - Value: `https://promptpipe.dschulz.dev`
   - Description: Frontend base URL

## GitHub OAuth Configuration

Make sure your GitHub OAuth App is configured with the correct callback URL:

- **Authorization callback URL**: `https://promptpipe-backend.dschulz.dev/api/auth/callback/github`

You can update this in your GitHub OAuth App settings at:
https://github.com/settings/developers

## Cookie Configuration

The authentication flow uses cookies with the following settings for production:

- **Domain**: `.dschulz.dev` (set via `crossSubDomainCookies.domain` - allows cookies to be shared across subdomains)
- **SameSite**: `none` (required for cross-origin requests)
- **Secure**: `true` (HTTPS only)
- **HttpOnly**: `true` (prevents JavaScript access)

**Important**: The domain should ONLY be set in `crossSubDomainCookies.domain`, not in individual cookie attributes. Better Auth will handle cookie domain inheritance automatically.

## CORS Configuration

The backend is configured to accept requests from:
- `https://promptpipe.dschulz.dev`
- `https://promptpipe-backend.dschulz.dev`

**Note**: Better Auth `trustedOrigins` does not support wildcard patterns like `https://*.dschulz.dev`. Each subdomain must be listed explicitly.

## Deployment Steps

1. **Backend Deployment**:
   - Connect your repository to Vercel
   - Set the root directory to `apps/backend`
   - Add all environment variables listed above
   - Deploy

2. **Frontend Deployment**:
   - Connect your repository to Vercel (or add as a separate project)
   - Set the root directory to `apps/web`
   - Add all environment variables listed above
   - Deploy

3. **Verify Authentication**:
   - Visit https://promptpipe.dschulz.dev
   - Try to sign in with GitHub
   - Check browser DevTools for any CORS or cookie errors
   - Verify that the session cookie is being set with the correct domain

## Troubleshooting

### Authentication Not Working

1. **Check Browser Console**: Look for CORS errors or cookie warnings
2. **Verify Environment Variables**: Ensure all URLs are correct and don't have trailing slashes
3. **Check Cookie Settings**: In browser DevTools > Application > Cookies, verify:
   - Cookie domain is `.dschulz.dev`
   - Cookie has `Secure` and `HttpOnly` flags
   - Cookie `SameSite` is set to `None`
4. **Verify GitHub OAuth**: Ensure callback URL matches exactly
5. **Check Logs**: Review Vercel function logs for any errors

### CORS Errors

If you see CORS errors:
1. Verify `NODE_ENV=production` is set in backend
2. Check that frontend URL is in the allowed origins list
3. Ensure credentials are included in fetch requests (`credentials: 'include'`)

### Cookie Not Being Set

1. Verify `BETTER_AUTH_URL` matches your backend domain
2. Check that both domains use HTTPS
3. Ensure `SameSite=None` and `Secure=true` for cross-domain cookies
