import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createClientServer(cookies());
    const { data: { session }, error } = await supabase.auth.getSession();
    
    return NextResponse.json({
      authenticated: !!session?.user?.id,
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      error: error?.message ?? null,
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      userId: null,
      email: null,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
