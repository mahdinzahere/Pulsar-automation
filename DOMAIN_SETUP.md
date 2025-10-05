# Domain Setup for pulsarinstitute.com

## 🌐 GoDaddy DNS Configuration

### DNS Records to Add in GoDaddy:

1. **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: [your-render-app.onrender.com]
   TTL: 3600
   ```

2. **A Record (Root Domain):**
   ```
   Type: A
   Name: @
   Value: [Render's IP address - get from Render dashboard]
   TTL: 3600
   ```

### How to Add DNS Records in GoDaddy:

1. **Log in to GoDaddy**
2. **Go to "My Products" → "All Products and Services"**
3. **Find your domain `pulsarinstitute.com`**
4. **Click "DNS" or "Manage DNS"**
5. **Add the records above**
6. **Save changes**

## 🔧 Supabase Auth Configuration

### Update Supabase Dashboard:

1. **Go to [supabase.com](https://supabase.com) → Your Project**
2. **Authentication → URL Configuration**
3. **Set Site URL:** `https://pulsarinstitute.com`
4. **Add Additional Redirect URLs:**
   - `https://pulsarinstitute.com`
   - `https://www.pulsarinstitute.com`
   - `https://pulsarinstitute.com/dashboard`
   - `https://pulsarinstitute.com/signin`
   - `https://pulsarinstitute.com/auth/callback`

## 🚀 Render Configuration

### Custom Domain Setup:

1. **In Render Dashboard → Your Service → Settings**
2. **Custom Domains → Add Domain**
3. **Add:** `pulsarinstitute.com`
4. **Add:** `www.pulsarinstitute.com`
5. **Get DNS records from Render**
6. **Use those records in GoDaddy**

## ✅ Testing Checklist

- [ ] Domain resolves to Render app
- [ ] HTTPS works (automatic with Render)
- [ ] Login works from domain
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] OAuth providers work

## 🎯 Final Result

Your app will be live at:
- **https://pulsarinstitute.com** (main site)
- **https://www.pulsarinstitute.com** (www redirect)
- **https://pulsarinstitute.com/dashboard** (dashboard)
- **https://pulsarinstitute.com/signin** (login)
