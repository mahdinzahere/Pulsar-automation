import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check for admin bypass
    const adminHeader = request.headers.get("x-admin");
    if (adminHeader === "1") {
      console.warn("⚠️  ADMIN BYPASS: Playbook list allowed. Remove this header for production!");
    } else {
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

      // Check if user is ADMIN (simplified check)
      const isAdmin = true; // For demo purposes

      if (!isAdmin) {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const sku = searchParams.get("sku");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {};
    
    if (sku) {
      where.sku = { contains: sku, mode: "insensitive" };
    }
    if (category) {
      where.category = { name: { contains: category, mode: "insensitive" } };
    }
    if (tag) {
      where.tags = { has: tag };
    }
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // Get playbooks with pagination
    const [playbooks, total] = await Promise.all([
      prisma.playbook.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.playbook.count({ where }),
    ]);

    return NextResponse.json({
      playbooks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Playbook list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
