import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";

export async function GET(request: NextRequest) {
  try {
    // Check for admin bypass
    const adminHeader = request.headers.get("x-admin");
    if (adminHeader === "1") {
      console.warn("⚠️  ADMIN BYPASS: Playbook export allowed. Remove this header for production!");
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
    const format = searchParams.get("format") || "json";
    const activeOnly = searchParams.get("activeOnly") === "true";

    // Get playbooks
    const playbooks = await prisma.playbook.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "json") {
      const exportData = {
        items: playbooks.map(playbook => ({
          sku: playbook.sku,
          skuPrefix: playbook.skuPrefix,
          category: playbook.category?.name,
          tags: playbook.tags,
          isActive: playbook.isActive,
          titleTemplate: playbook.titleTemplate,
          subtitle: playbook.subtitle,
          bullets: playbook.bullets,
          itemSpecifics: playbook.itemSpecifics,
          forbiddenPhrases: playbook.forbiddenPhrases,
          priceMin: playbook.priceMin,
          priceMax: playbook.priceMax,
          shippingProfile: playbook.shippingProfile,
          returnsProfile: playbook.returnsProfile,
          imageRules: playbook.imageRules,
          policyGate: playbook.policyGate,
          version: playbook.version,
          createdAt: playbook.createdAt,
          updatedAt: playbook.updatedAt,
        })),
      };

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=playbooks.json",
        },
      });
    } else if (format === "csv") {
      const csvData = playbooks.map(playbook => ({
        sku: playbook.sku,
        skuPrefix: playbook.skuPrefix,
        category: playbook.category?.name,
        tags: playbook.tags.join(","),
        isActive: playbook.isActive,
        titleTemplate: playbook.titleTemplate,
        subtitle: playbook.subtitle,
        bullets: Array.isArray(playbook.bullets) ? playbook.bullets.join("|") : "",
        itemSpecifics: JSON.stringify(playbook.itemSpecifics),
        forbiddenPhrases: Array.isArray(playbook.forbiddenPhrases) ? playbook.forbiddenPhrases.join(",") : "",
        priceMin: playbook.priceMin,
        priceMax: playbook.priceMax,
        shippingProfile: playbook.shippingProfile,
        returnsProfile: playbook.returnsProfile,
        imageRules: JSON.stringify(playbook.imageRules),
        policyGate: JSON.stringify(playbook.policyGate),
        version: playbook.version,
        createdAt: playbook.createdAt.toISOString(),
        updatedAt: playbook.updatedAt.toISOString(),
      }));

      const csv = stringify(csvData, {
        header: true,
        columns: [
          "sku", "skuPrefix", "category", "tags", "isActive", "titleTemplate", "subtitle",
          "bullets", "itemSpecifics", "forbiddenPhrases", "priceMin", "priceMax",
          "shippingProfile", "returnsProfile", "imageRules", "policyGate", "version",
          "createdAt", "updatedAt"
        ],
      });

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=playbooks.csv",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid format. Use 'json' or 'csv'" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Playbook export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
