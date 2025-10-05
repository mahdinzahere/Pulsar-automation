import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: Chat message processed. Remove this header for production!");
      const body = await request.json();
      const { text, mediaIds } = body;
      
      // Simulate AI response based on input
      if (text?.toLowerCase().includes("upload") || mediaIds?.length > 0) {
        return NextResponse.json({
          message: "Great! I can see you've uploaded photos. Let me analyze them and help you create a listing.",
          next_actions: ["choose_sku"],
        });
      }
      
      if (text?.toLowerCase().includes("windows 10")) {
        return NextResponse.json({
          message: "Perfect! I've identified this as a Windows 10 Pro DVD. Let me check if you have eBay connected.",
          next_actions: ["connect_ebay"],
        });
      }
      
      if (text?.toLowerCase().includes("ebay")) {
        return NextResponse.json({
          message: "I'll help you connect your eBay account. This will allow me to create and publish listings for you.",
          next_actions: ["connect_ebay"],
        });
      }
      
      return NextResponse.json({
        message: "I'm here to help you create eBay listings for Windows DVDs. Upload some photos to get started!",
        next_actions: [],
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

    const body = await request.json();
    const { sessionId, text, mediaIds } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // Check if user is MEMBER
    const isMember = true; // For demo purposes

    if (!isMember) {
      return NextResponse.json(
        { error: "Membership required for AI chat" },
        { status: 403 }
      );
    }

    // In a real app, this would:
    // 1. Load the user's session state
    // 2. Process the message with OpenAI
    // 3. Determine next actions based on context
    // 4. Return appropriate response

    // For demo purposes, return a simple response
    let message = "I'm here to help you create eBay listings for Windows DVDs.";
    let nextActions: string[] = [];
    let status = "waiting";

    if (text?.toLowerCase().includes("upload") || mediaIds?.length > 0) {
      message = "Great! I can see you've uploaded photos. Let me analyze them and help you create a listing.";
      nextActions = ["choose_sku"];
    } else if (text?.toLowerCase().includes("windows 10")) {
      message = "Perfect! I've identified this as a Windows 10 Pro DVD. Let me check if you have eBay connected.";
      nextActions = ["connect_ebay"];
    } else if (text?.toLowerCase().includes("ebay")) {
      message = "I'll help you connect your eBay account. This will allow me to create and publish listings for you.";
      nextActions = ["connect_ebay"];
    }

    const response: any = {
      message,
      next_actions: nextActions,
    };

    // If we have a complete setup, return ready to list status
    if (text?.toLowerCase().includes("ready") || text?.toLowerCase().includes("list")) {
      response.status = "ready_to_list";
      response.draft = {
        sku: "WIN10PRO-DVD",
        title: "Microsoft Windows 10 Pro DVD | Retail | Physical COA | Fast Shipping",
        price: 89.99,
        description: "Genuine retail Windows 10 Pro DVD with physical Certificate of Authenticity.",
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
