import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? null,
  });
}
