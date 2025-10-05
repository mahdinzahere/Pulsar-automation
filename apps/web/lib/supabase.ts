import { createBrowserClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createClientServer(cookies: import("next/headers").ReadonlyRequestCookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookies.get(name)?.value,
        set: (name, value, options: CookieOptions) => {
          // Next App Router will handle via middleware if needed
        },
        remove: (name, options: CookieOptions) => {
          // noop
        },
      },
    }
  );
}

// Server-side cookie options for production
export const getCookieOptions = (): CookieOptions => ({
  sameSite: "lax",
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
});