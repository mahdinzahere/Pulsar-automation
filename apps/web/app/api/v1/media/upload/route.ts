import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Check for dev bypass
    const devMember = request.headers.get("x-dev-member");
    if (devMember === "1") {
      console.warn("⚠️  DEV BYPASS: Media upload allowed. Remove this header for production!");
      const mediaId = uuidv4();
      return NextResponse.json({
        uploadUrl: "https://example.com/upload",
        publicUrl: "https://example.com/image.jpg",
        mediaId,
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
    // In real app, this would check the database
    const isMember = true; // For demo purposes

    if (!isMember) {
      return NextResponse.json(
        { error: "Membership required for media upload" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and content type required" },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Storage not configured. Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const mediaId = uuidv4();
    const filePath = `product-media/${user.id}/${mediaId}/${filename}`;

    // Create signed upload URL
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-media")
      .createSignedUploadUrl(filePath);

    if (uploadError) {
      console.error("Upload URL creation error:", uploadError);
      return NextResponse.json(
        { error: "Failed to create upload URL" },
        { status: 500 }
      );
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/${filePath}`;

    // Store media asset in database
    try {
      await prisma.mediaAsset.create({
        data: {
          id: mediaId,
          userId: user.id,
          url: publicUrl,
          contentType,
          metadata: {
            filename,
            uploadedAt: new Date().toISOString(),
          },
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue anyway, the upload URL is still valid
    }

    return NextResponse.json({
      uploadUrl: uploadData.signedUrl,
      publicUrl,
      mediaId,
    });

  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
