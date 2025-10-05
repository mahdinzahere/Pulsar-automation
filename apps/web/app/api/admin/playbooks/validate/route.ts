import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { parse } from "csv-parse/sync";

export async function POST(request: NextRequest) {
  try {
    // Check for admin bypass
    const adminHeader = request.headers.get("x-admin");
    if (adminHeader === "1") {
      console.warn("⚠️  ADMIN BYPASS: Playbook validation allowed. Remove this header for production!");
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
    const errors: string[] = [];
    const warnings: string[] = [];

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
        { error: "Failed to parse data", details: parseError.message },
        { status: 400 }
      );
    }

    // Validate each playbook
    for (let i = 0; i < playbooks.length; i++) {
      const playbook = playbooks[i];
      const rowNum = i + 1;
      
      // Required fields
      if (!playbook.sku) {
        errors.push(`Row ${rowNum}: SKU is required`);
      }
      if (!playbook.titleTemplate) {
        errors.push(`Row ${rowNum}: Title template is required`);
      }
      
      // Price validation
      if (playbook.priceMin && playbook.priceMax && playbook.priceMin > playbook.priceMax) {
        errors.push(`Row ${rowNum}: Price min (${playbook.priceMin}) cannot be greater than price max (${playbook.priceMax})`);
      }
      
      // Bullets validation
      if (playbook.bullets && !Array.isArray(playbook.bullets)) {
        errors.push(`Row ${rowNum}: Bullets must be an array`);
      }
      
      // Tags validation
      if (playbook.tags && !Array.isArray(playbook.tags)) {
        errors.push(`Row ${rowNum}: Tags must be an array`);
      }
      
      // Image rules validation
      if (playbook.imageRules) {
        if (!playbook.imageRules.requireMinCount || playbook.imageRules.requireMinCount < 1) {
          warnings.push(`Row ${rowNum}: Image rules should require at least 1 image`);
        }
      }
      
      // Policy gate validation
      if (playbook.policyGate && typeof playbook.policyGate.requiresAuthorizationDocs !== "boolean") {
        warnings.push(`Row ${rowNum}: Policy gate requiresAuthorizationDocs should be boolean`);
      }
    }

    // Check for duplicate SKUs
    const skus = playbooks.map(p => p.sku).filter(Boolean);
    const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicateSkus.length > 0) {
      errors.push(`Duplicate SKUs found: ${[...new Set(duplicateSkus)].join(", ")}`);
    }

    return NextResponse.json({
      valid: errors.length === 0,
      total: playbooks.length,
      errors,
      warnings,
      summary: {
        valid: playbooks.length - errors.length,
        invalid: errors.length,
        warnings: warnings.length,
      },
    });

  } catch (error) {
    console.error("Playbook validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
