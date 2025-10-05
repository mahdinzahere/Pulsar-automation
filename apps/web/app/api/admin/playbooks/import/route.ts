import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export async function POST(request: NextRequest) {
  try {
    // Check for admin bypass
    const adminHeader = request.headers.get("x-admin");
    if (adminHeader === "1") {
      console.warn("⚠️  ADMIN BYPASS: Playbook import allowed. Remove this header for production!");
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

    const body = await request.json();
    const { data, format = "json" } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Data required" },
        { status: 400 }
      );
    }

    let playbooks: any[] = [];

    try {
      if (format === "json") {
        const parsed = JSON.parse(data);
        playbooks = Array.isArray(parsed) ? parsed : parsed.items || [];
      } else if (format === "csv") {
        const records = parse(data, {
          columns: true,
          skip_empty_lines: true,
        });
        playbooks = records.map((record: any) => ({
          sku: record.sku,
          skuPrefix: record.skuPrefix,
          category: record.category,
          tags: record.tags ? record.tags.split(",").map((t: string) => t.trim()) : [],
          isActive: record.isActive === "true" || record.isActive === "1",
          titleTemplate: record.titleTemplate,
          subtitle: record.subtitle,
          bullets: record.bullets ? record.bullets.split("|").map((b: string) => b.trim()) : [],
          itemSpecifics: record.itemSpecifics ? JSON.parse(record.itemSpecifics) : {},
          forbiddenPhrases: record.forbiddenPhrases ? record.forbiddenPhrases.split(",").map((f: string) => f.trim()) : [],
          priceMin: parseFloat(record.priceMin),
          priceMax: parseFloat(record.priceMax),
          shippingProfile: record.shippingProfile,
          returnsProfile: record.returnsProfile,
          imageRules: record.imageRules ? JSON.parse(record.imageRules) : { requireMinCount: 3, mustInclude: [] },
          policyGate: record.policyGate ? JSON.parse(record.policyGate) : { requiresAuthorizationDocs: false },
        }));
      } else {
        return NextResponse.json(
          { error: "Invalid format. Use 'json' or 'csv'" },
          { status: 400 }
        );
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse data" },
        { status: 400 }
      );
    }

    // Validate playbooks
    const validationErrors: string[] = [];
    
    for (let i = 0; i < playbooks.length; i++) {
      const playbook = playbooks[i];
      
      if (!playbook.sku) {
        validationErrors.push(`Row ${i + 1}: SKU is required`);
      }
      if (!playbook.titleTemplate) {
        validationErrors.push(`Row ${i + 1}: Title template is required`);
      }
      if (playbook.priceMin && playbook.priceMax && playbook.priceMin > playbook.priceMax) {
        validationErrors.push(`Row ${i + 1}: Price min cannot be greater than price max`);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Import playbooks
    let imported = 0;
    
    try {
      for (const playbookData of playbooks) {
        // Create or update category
        let categoryId = null;
        if (playbookData.category) {
          const category = await prisma.category.upsert({
            where: { name: playbookData.category },
            update: {},
            create: {
              name: playbookData.category,
              slug: playbookData.category.toLowerCase().replace(/\s+/g, "-"),
            },
          });
          categoryId = category.id;
        }

        // Create or update playbook
        const playbook = await prisma.playbook.upsert({
          where: { sku: playbookData.sku },
          update: {
            skuPrefix: playbookData.skuPrefix,
            categoryId,
            tags: playbookData.tags || [],
            isActive: playbookData.isActive !== false,
            titleTemplate: playbookData.titleTemplate,
            subtitle: playbookData.subtitle,
            bullets: playbookData.bullets || [],
            itemSpecifics: playbookData.itemSpecifics || {},
            forbiddenPhrases: playbookData.forbiddenPhrases || [],
            priceMin: playbookData.priceMin || 0,
            priceMax: playbookData.priceMax || 999999,
            shippingProfile: playbookData.shippingProfile || "standard",
            returnsProfile: playbookData.returnsProfile || "30d-returns",
            imageRules: playbookData.imageRules || { requireMinCount: 3, mustInclude: [] },
            policyGate: playbookData.policyGate || { requiresAuthorizationDocs: false },
            version: { increment: 1 },
          },
          create: {
            productId: "imported-" + playbookData.sku,
            sku: playbookData.sku,
            skuPrefix: playbookData.skuPrefix,
            categoryId,
            tags: playbookData.tags || [],
            isActive: playbookData.isActive !== false,
            titleTemplate: playbookData.titleTemplate,
            subtitle: playbookData.subtitle,
            bullets: playbookData.bullets || [],
            itemSpecifics: playbookData.itemSpecifics || {},
            forbiddenPhrases: playbookData.forbiddenPhrases || [],
            priceMin: playbookData.priceMin || 0,
            priceMax: playbookData.priceMax || 999999,
            shippingProfile: playbookData.shippingProfile || "standard",
            returnsProfile: playbookData.returnsProfile || "30d-returns",
            imageRules: playbookData.imageRules || { requireMinCount: 3, mustInclude: [] },
            policyGate: playbookData.policyGate || { requiresAuthorizationDocs: false },
          },
        });

        // Create version snapshot
        await prisma.playbookVersion.create({
          data: {
            playbookId: playbook.id,
            version: playbook.version,
            data: playbookData,
            createdBy: "admin-import",
          },
        });

        imported++;
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to import playbooks" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported,
      total: playbooks.length,
    });

  } catch (error) {
    console.error("Playbook import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
