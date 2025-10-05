import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { 
        playbook: {
          select: {
            sku: true,
            titleTemplate: true,
            subtitle: true,
            bullets: true,
            itemSpecifics: true,
            priceMin: true,
            priceMax: true,
            shippingProfile: true,
            returnsProfile: true,
            imageRules: true,
            isActive: true,
            version: true,
          }
        }
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
