import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: Treating user as MEMBER. Remove this header for production!");
      return NextResponse.json({
        embeddedUrl: "https://whop.com/checkout/demo",
        sessionId: "dev-session-123"
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
    const { planId } = body;

    // Check if required environment variables are set
    if (!process.env.WHOP_API_KEY || !process.env.WHOP_PRODUCT_ID) {
      return NextResponse.json(
        { error: "Payment system not configured. Missing WHOP_API_KEY or WHOP_PRODUCT_ID" },
        { status: 500 }
      );
    }

    // Create Whop checkout session
    const whopResponse = await fetch("https://api.whop.com/api/v2/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHOP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: planId || process.env.WHOP_PRODUCT_ID,
        customer_email: user.email,
        metadata: {
          user_id: user.id,
          email: user.email,
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=cancelled`,
      }),
    });

    if (!whopResponse.ok) {
      const errorData = await whopResponse.json();
      console.error("Whop API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    const checkoutData = await whopResponse.json();

    return NextResponse.json({
      embeddedUrl: checkoutData.embedded_url,
      sessionId: checkoutData.id,
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
