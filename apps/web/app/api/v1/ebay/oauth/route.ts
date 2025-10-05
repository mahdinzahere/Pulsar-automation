import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: eBay OAuth URL generated. Remove this header for production!");
      return NextResponse.json({
        authUrl: "https://auth.ebay.com/oauth2/authorize?client_id=dev&response_type=code&redirect_uri=dev&scope=dev",
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

    // Check if user is MEMBER
    const isMember = true; // For demo purposes

    if (!isMember) {
      return NextResponse.json(
        { error: "Membership required for eBay integration" },
        { status: 403 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.EBAY_CLIENT_ID || !process.env.EBAY_REDIRECT_URI || !process.env.EBAY_SCOPES) {
      return NextResponse.json(
        { error: "eBay integration not configured. Missing EBAY_CLIENT_ID, EBAY_REDIRECT_URI, or EBAY_SCOPES" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { code } = body;

    // If no code provided, generate auth URL
    if (!code) {
      const authUrl = new URL("https://auth.ebay.com/oauth2/authorize");
      authUrl.searchParams.set("client_id", process.env.EBAY_CLIENT_ID);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", process.env.EBAY_REDIRECT_URI);
      authUrl.searchParams.set("scope", process.env.EBAY_SCOPES);
      authUrl.searchParams.set("state", user.id); // Use user ID as state for security

      return NextResponse.json({
        authUrl: authUrl.toString(),
      });
    }

    // If code provided, exchange for tokens
    try {
      const tokenResponse = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.EBAY_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error("eBay token exchange error:", errorData);
        return NextResponse.json(
          { error: "Failed to exchange code for tokens" },
          { status: 400 }
        );
      }

      const tokenData = await tokenResponse.json();
      
      // Store tokens in database
      await prisma.ebayToken.upsert({
        where: { userId: user.id },
        update: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          accountId: tokenData.account_id || "unknown",
        },
        create: {
          userId: user.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          accountId: tokenData.account_id || "unknown",
        },
      });

      // Log the activity
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "EBAY_CONNECTED",
          details: {
            accountId: tokenData.account_id,
            scopes: process.env.EBAY_SCOPES,
          },
        },
      });

      return NextResponse.json({
        status: "connected",
        accountId: tokenData.account_id,
      });

    } catch (error) {
      console.error("eBay token exchange error:", error);
      return NextResponse.json(
        { error: "Failed to exchange code for tokens" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("eBay OAuth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
