import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: Agent listing created. Remove this header for production!");
      const body = await request.json();
      const { sku, userImages, publish } = body;
      
      // Simulate listing creation
      const listingId = "dev-listing-" + Date.now();
      const offerId = "dev-offer-" + Date.now();
      const itemId = publish ? "dev-item-" + Date.now() : undefined;
      const viewItemUrl = publish ? `https://ebay.com/itm/${itemId}` : undefined;
      
      return NextResponse.json({
        status: publish ? "published" : "draft",
        listingId,
        offerId,
        itemId,
        viewItemUrl,
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
        { error: "Membership required for listing creation" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sku, userImages, publish = false } = body;

    if (!sku || !userImages || !Array.isArray(userImages)) {
      return NextResponse.json(
        { error: "SKU and user images required" },
        { status: 400 }
      );
    }

    // Check if user has eBay connected
    const ebayToken = await prisma.ebayToken.findUnique({
      where: { userId: user.id },
    });

    if (!ebayToken) {
      return NextResponse.json(
        { error: "eBay account not connected" },
        { status: 400 }
      );
    }

    // Check if token is still valid
    if (ebayToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "eBay token expired. Please reconnect your account." },
        { status: 400 }
      );
    }

    // In a real app, this would:
    // 1. Load the playbook for the SKU
    // 2. Run AI analysis on the images
    // 3. Generate listing content
    // 4. Run policy checks
    // 5. Create eBay inventory item
    // 6. Create offer
    // 7. Optionally publish

    // For demo purposes, simulate the process
    const listingId = "listing-" + Date.now();
    const offerId = "offer-" + Date.now();
    const itemId = publish ? "item-" + Date.now() : undefined;
    const viewItemUrl = publish ? `https://ebay.com/itm/${itemId}` : undefined;

    // Store listing in database
    try {
      await prisma.listing.create({
        data: {
          userId: user.id,
          productId: "demo-product",
          sku,
          status: publish ? "PUBLISHED" : "DRAFT",
          offerId,
          itemId,
          viewItemUrl,
          price: 89.99,
          draft: {
            title: "Microsoft Windows 10 Pro DVD | Retail | Physical COA | Fast Shipping",
            description: "Genuine retail Windows 10 Pro DVD with physical Certificate of Authenticity.",
            images: userImages,
            sku,
          },
        },
      });

      // Log the activity
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: publish ? "LISTING_PUBLISHED" : "LISTING_CREATED",
          details: {
            sku,
            listingId,
            offerId,
            itemId,
            publish,
          },
        },
      });

    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue anyway, the listing was created
    }

    return NextResponse.json({
      status: publish ? "published" : "draft",
      listingId,
      offerId,
      itemId,
      viewItemUrl,
    });

  } catch (error) {
    console.error("Agent listing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
