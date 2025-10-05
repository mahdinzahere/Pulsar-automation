import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const playbooks = await prisma.playbook.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          }
        }
      }
    });
    
    // Redact sensitive information for public API
    const redacted = playbooks.map(p => ({
      id: p.id,
      sku: p.sku,
      skuPrefix: p.skuPrefix,
      category: p.category?.name,
      tags: p.tags,
      titleTemplate: p.titleTemplate,
      subtitle: p.subtitle,
      bullets: p.bullets,
      itemSpecifics: p.itemSpecifics,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      shippingProfile: p.shippingProfile,
      returnsProfile: p.returnsProfile,
      imageRules: p.imageRules,
      version: p.version,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      // Note: forbiddenPhrases and policyGate are intentionally excluded for security
    }));
    
    return NextResponse.json(redacted);
  } catch (error) {
    console.error("Playbooks API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playbooks" },
      { status: 500 }
    );
  }
}
