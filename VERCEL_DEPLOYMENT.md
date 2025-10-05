# Pulsar Automation - Vercel Deployment Guide

## 🚀 Deploy to Vercel (Much Easier than Render!)

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub** (use your GitHub account)
3. **Click "New Project"**
4. **Import Git Repository:**
   - Repository: `https://github.com/mahdinzahere/Pulsar-automation`
   - Framework Preset: **Next.js**
   - Root Directory: **`apps/web`**
   - Build Command: **`npm run build`**
   - Output Directory: **`.next`**

### Step 2: Environment Variables

**In Vercel Dashboard → Project Settings → Environment Variables, add:**

```
NEXT_PUBLIC_SUPABASE_URL=https://rjpsqllckjnqblweymyn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHNxbGxja2pucWJsd2V5bXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTEyMjQsImV4cCI6MjA3NTE4NzIyNH0.9v9jhxGQDL_aL0bb8aRAqrLmIJ1PJ9uEau0MDGwK620
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHNxbGxja2pucWJsd2V5bXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTYxMTIyNCwiZXhwIjoyMDc1MTg3MjI0fQ.MG2VyTmJFeXhHuOGfWjoPDPySErTvwNhYrGNWCBQTt8
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.rjpsqllckjnqblweymyn.supabase.co:5432/postgres
NEXT_PUBLIC_BASE_URL=https://pulsarinstitute.com
NODE_ENV=production
```

### Step 3: Connect Custom Domain

1. **In Vercel Dashboard → Your Project → Settings → Domains**
2. **Add Domain:** `pulsarinstitute.com`
3. **Add Domain:** `www.pulsarinstitute.com`
4. **Vercel will give you DNS records to add in GoDaddy**

### Step 4: Update GoDaddy DNS

**Go to GoDaddy DNS management and add these records:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### Step 5: Update Supabase Auth URLs

1. **Go to Supabase Dashboard → Authentication → URL Configuration**
2. **Set Site URL:** `https://pulsarinstitute.com`
3. **Add Redirect URLs:**
   - `https://pulsarinstitute.com`
   - `https://www.pulsarinstitute.com`
   - `https://pulsarinstitute.com/dashboard`
   - `https://pulsarinstitute.com/signin`

## ✅ Benefits of Vercel:

- ✅ **Automatic HTTPS** (SSL certificates)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Automatic deployments** (when you push to GitHub)
- ✅ **Easy domain management**
- ✅ **Better performance** than Render
- ✅ **Free tier** with generous limits

## 🎯 Result:

Your app will be live at:
- **https://pulsarinstitute.com** (main site)
- **https://www.pulsarinstitute.com** (www redirect)
- **https://pulsarinstitute.com/dashboard** (dashboard)
- **https://pulsarinstitute.com/signin** (login)

## 📋 Quick Checklist:

- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Connect custom domain
- [ ] Update GoDaddy DNS
- [ ] Update Supabase Auth URLs
- [ ] Test everything works
