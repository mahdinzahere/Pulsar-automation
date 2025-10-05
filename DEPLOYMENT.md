# Pulsar Automation - Render Deployment Guide

## 🚀 Quick Deployment to pulsarinstitute.com

### Step 1: Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect repository:** `https://github.com/mahdinzahere/Pulsar-automation`
5. **Configure:**
   - **Name:** `pulsar-automation`
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 2: Environment Variables

Add these environment variables in your Render dashboard:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://rjpsqllckjnqblweymyn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHNxbGxja2pucWJsd2V5bXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTEyMjQsImV4cCI6MjA3NTE4NzIyNH0.9v9jhxGQDL_aL0bb8aRAqrLmIJ1PJ9uEau0MDGwK620
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHNxbGxja2pucWJsd2V5bXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTYxMTIyNCwiZXhwIjoyMDc1MTg3MjI0fQ.MG2VyTmJFeXhHuOGfWjoPDPySErTvwNhYrGNWCBQTt8
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.rjpsqllckjnqblweymyn.supabase.co:5432/postgres
NEXT_PUBLIC_BASE_URL=https://pulsarinstitute.com
```

### Step 3: Connect Domain

1. **In Render dashboard → Settings → Custom Domains**
2. **Add domain:** `pulsarinstitute.com`
3. **Get DNS records from Render**

### Step 4: Update GoDaddy DNS

**Go to your GoDaddy DNS management and add these records:**

```
Type: CNAME
Name: www
Value: [your-render-app.onrender.com]

Type: A
Name: @
Value: [Render's IP address - get this from Render dashboard]
```

### Step 5: Update Supabase Auth URLs

1. **Go to Supabase Dashboard → Authentication → URL Configuration**
2. **Set Site URL:** `https://pulsarinstitute.com`
3. **Add Redirect URLs:**
   - `https://pulsarinstitute.com`
   - `https://www.pulsarinstitute.com`
   - `https://pulsarinstitute.com/dashboard`
   - `https://pulsarinstitute.com/signin`

## 🎯 Result

Your Pulsar Automation app will be live at:
- **https://pulsarinstitute.com**
- **https://www.pulsarinstitute.com**

## 📋 Checklist

- [ ] Deploy to Render
- [ ] Add environment variables
- [ ] Connect custom domain
- [ ] Update GoDaddy DNS
- [ ] Update Supabase Auth URLs
- [ ] Test login functionality
- [ ] Test all pages work
