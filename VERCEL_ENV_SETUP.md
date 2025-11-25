# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables to your Vercel project settings:

### 1. Database (Supabase PostgreSQL)

```
DATABASE_URL=postgresql://postgres.lbajitoudsvjhiihanra:Ibtesam.asif118@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

DIRECT_URL=postgresql://postgres:Ibtesam.asif118@db.lbajitoudsvjhiihanra.supabase.co:5432/postgres
```

### 2. Supabase Authentication

```
NEXT_PUBLIC_SUPABASE_URL=https://lbajitoudsvjhiihanra.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWppdG91ZHN2amhpaWhhbnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzE4MDIsImV4cCI6MjA3OTEwNzgwMn0.-hyh43jsK3QMyfAuBHtbXxsh6vrj6UxncbwG9UQdGSU

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYWppdG91ZHN2amhpaWhhbnJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMTgwMiwiZXhwIjoyMDc5MTA3ODAyfQ.ohvgi6g4enly0BH0uEarCqhJmlZYB2RQK_ELXhzfRSo
```

### 3. Site Configuration

```
NEXT_PUBLIC_SITE_URL=https://astra-commerce-os-2yq5.vercel.app
```

## How to Add to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `AstraCommerceOS`
3. Go to **Settings** → **Environment Variables**
4. Add each variable above:
   - Name: `DATABASE_URL`
   - Value: (paste the value)
   - Environment: **Production, Preview, Development** (check all)
5. Click **Save**
6. Repeat for all variables above

## After Adding Variables

1. Redeploy your application:
   - Go to **Deployments** tab
   - Click the `...` menu on the latest deployment
   - Click **Redeploy**

OR trigger a new deployment by pushing to main:
```bash
git commit --allow-empty -m "Trigger redeploy after env vars"
git push origin main
```

## Verify Variables

After deployment, check the runtime logs to verify environment variables are loaded correctly.
