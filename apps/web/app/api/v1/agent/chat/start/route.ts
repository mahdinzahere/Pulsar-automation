import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: Chat session started. Remove this header for production!");
      return NextResponse.json({
        sessionId: "dev-session-" + uuidv4(),
      });
    }

    // Get authenticated user
    const cookieStore = cookies();
    const supabase = createClientServer(cookieStore);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is MEMBER (simplified check)
    const isMember = true; // For demo purposes

    if (!isMember) {
      return NextResponse.json(
        { error: "Membership required for AI chat" },
        { status: 403 }
      );
    }

    const sessionId = uuidv4();

    // In a real app, you might store the session in a database or cache
    // For now, we'll just return the session ID

    return NextResponse.json({
      sessionId,
    });

  } catch (error) {
    console.error("Chat start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
