# Pulsar Automation AI

AI-powered eBay listing automation for Microsoft Windows DVDs.

## Supabase Auth URL Configuration

To enable authentication from any origin (localhost, LAN IP, tunnels, production):

1. Go to your Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to the public origin users will use (e.g., `http://192.168.1.100:3000` for LAN access or `https://your-tunnel-domain.com` for tunnels)
3. Add **Additional Redirect URLs**:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `http://<LAN-IP>:3000` (replace with your actual LAN IP)
   - `https://<tunnel-domain>` (if using ngrok, Cloudflare Tunnel, etc.)
   - `https://<prod-domain>` (for production deployment)

This allows users to authenticate from any device on your network or through tunnels.

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (optional - will use runtime origin if empty)
- `LOG_LEVEL=info`

## Deployment

See `VERCEL_DEPLOYMENT.md` for complete deployment instructions to Vercel with custom domain setup.
