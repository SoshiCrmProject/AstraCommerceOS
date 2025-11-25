# Vercel Deployment Guide

## Environment Variables Required

Add these environment variables in your Vercel project settings:

### Database (Required)
```bash
DATABASE_URL="postgresql://postgres.lbajitoudsvjhiihanra:Ibtesam.asif118@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:Ibtesam.asif118@db.lbajitoudsvjhiihanra.supabase.co:5432/postgres"
```

### Supabase Auth (Required)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://lbajitoudsvjhiihanra.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWppdG91ZHN2amhpaWhhbnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzE4MDIsImV4cCI6MjA3OTEwNzgwMn0.-hyh43jsK3QMyfAuBHtbXxsh6vrj6UxncbwG9UQdGSU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWppdG91ZHN2amhpaWhhbnJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMTgwMiwiZXhwIjoyMDc5MTA3ODAyfQ.ohvgi6g4enly0BH0uEarCqhJmlZYB2RQK_ELXhzfRSo
```

### App Settings (Required)
```bash
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key-change-in-production
```

### Site URL (Important - Update this!)
```bash
NEXT_PUBLIC_SITE_URL=https://astra-commerce-os-2yq5.vercel.app
```
⚠️ **Update this to your actual Vercel domain!**

### Optional API Keys
```bash
OPENAI_API_KEY=
REDIS_URL=
AMAZON_SP_API_CLIENT_ID=
AMAZON_SP_API_CLIENT_SECRET=
AMAZON_SP_API_REFRESH_TOKEN=
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
EBAY_APP_ID=
EBAY_CERT_ID=
RAKUTEN_API_KEY=
WALMART_CLIENT_ID=
WALMART_CLIENT_SECRET=
```

## Deployment Steps

### 1. Set Environment Variables
Go to your Vercel project dashboard:
- Navigate to **Settings** → **Environment Variables**
- Add all the required variables listed above
- Make sure to add them for **Production**, **Preview**, and **Development** environments

### 2. Database Setup
Before deploying, ensure your database is migrated:

```bash
# Run migrations locally first
npx prisma migrate deploy

# Or push schema directly (for development)
npx prisma db push
```

### 3. Seed Data (Optional)
If you need demo data in production:

```bash
npm run db:seed
```

### 4. Deploy
Push your code to the connected Git repository, or use Vercel CLI:

```bash
vercel --prod
```

## Troubleshooting

### Issue: "Application error: a server-side exception has occurred"

**Possible Causes:**
1. Missing environment variables in Vercel
2. Database connection issues
3. Prisma client not generated during build

**Solutions:**
- ✅ Check all required env vars are set in Vercel dashboard
- ✅ Verify `DATABASE_URL` and `DIRECT_URL` are correct
- ✅ The build script now includes `prisma generate` automatically
- ✅ Check Vercel build logs for specific errors

### Issue: "Not authenticated" or redirect loops

**Solutions:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that `NEXT_PUBLIC_SITE_URL` matches your Vercel domain
- Ensure user exists in database (check Supabase Auth dashboard)

### Issue: Database connection timeout

**Solutions:**
- Use the pooled connection (`DATABASE_URL`) with `pgbouncer=true`
- Verify your Supabase project is active
- Check Supabase database settings allow external connections

## Post-Deployment

### 1. Create Super Admin User
Run this once after first deployment:

```bash
# Set these environment variables in Vercel first:
SUPER_ADMIN_EMAIL=your-email@example.com
SUPER_ADMIN_PASSWORD=your-secure-password

# Then trigger the seed script (you may need to do this via a one-time script or locally)
```

### 2. Verify Authentication
1. Go to `/en/sign-in`
2. Sign in with your Supabase user credentials
3. You should be redirected to `/en/app` dashboard

### 3. Monitor Logs
Check Vercel logs for any errors:
- Go to your project → **Deployments** → Select deployment → **View Function Logs**

## Important Notes

- **Database URLs**: The `DATABASE_URL` uses connection pooling for serverless functions. The `DIRECT_URL` is for migrations and schema operations.
- **Build Time**: First build may take longer as Prisma generates the client.
- **Error Handling**: The app now has proper error boundaries and will redirect to sign-in if authentication fails.
- **Debugging**: Check Vercel function logs for detailed error messages.

## Changes Made to Fix Production Issues

1. ✅ Updated `package.json` build script to include `prisma generate`
2. ✅ Improved error handling in `getUserWithOrg()` function
3. ✅ Added error boundary for `/app` routes
4. ✅ Added redirect to sign-in on authentication failures
5. ✅ Enhanced error logging for production debugging
