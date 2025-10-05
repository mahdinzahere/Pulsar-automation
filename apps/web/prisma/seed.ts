import { prisma } from "../lib/prisma";

async function main() {
  // Create categories
  const osCategory = await prisma.category.upsert({
    where: { name: "Operating Systems" },
    update: {},
    create: {
      name: "Operating Systems",
      slug: "operating-systems",
    }
  });

  // Create products
  const p1 = await prisma.product.upsert({
    where: { sku: "WIN10PRO-DVD" },
    update: {},
    create: {
      sku: "WIN10PRO-DVD",
      title: "Microsoft Windows 10 Pro DVD",
      brand: "Microsoft",
      cost: 49.99,
      stock: 100,
      images: [
        "https://example.com/win10/box_front.jpg",
        "https://example.com/win10/coa_closeup.jpg",
        "https://example.com/win10/disc_top.jpg"
      ],
      categoryId: osCategory.id
    }
  });

  const p2 = await prisma.product.upsert({
    where: { sku: "WIN11PRO-DVD" },
    update: {},
    create: {
      sku: "WIN11PRO-DVD",
      title: "Microsoft Windows 11 Pro DVD",
      brand: "Microsoft",
      cost: 69.99,
      stock: 80,
      images: [
        "https://example.com/win11/box_front.jpg",
        "https://example.com/win11/coa_closeup.jpg",
        "https://example.com/win11/disc_top.jpg"
      ],
      categoryId: osCategory.id
    }
  });

  // Create playbooks
  await prisma.playbook.upsert({
    where: { sku: "WIN10PRO-DVD" },
    update: {},
    create: {
      productId: p1.id,
      sku: "WIN10PRO-DVD",
      skuPrefix: "WIN10",
      categoryId: osCategory.id,
      tags: ["software", "windows", "dvd"],
      isActive: true,
      titleTemplate: "Microsoft Windows 10 Pro DVD | Physical COA | Genuine Retail Media",
      subtitle: "Includes disc + certificate of authenticity | Ships fast",
      bullets: [
        "Genuine Microsoft Windows 10 Pro retail DVD",
        "Includes COA (Certificate of Authenticity) sticker",
        "One PC, lifetime activation",
        "Physical delivery only — no digital keys",
        "64-bit, English, USA region"
      ],
      forbiddenPhrases: ["global key","instant email delivery","OEM key","digital-only","lifetime digital"],
      itemSpecifics: { 
        Brand: "Microsoft", 
        Format: "DVD", 
        "License Category": "Retail", 
        Type: "Operating System", 
        Delivery: "Physical Mail" 
      },
      priceMin: 49.99,
      priceMax: 129.99,
      shippingProfile: "Standard-USA-3day",
      returnsProfile: "30d-returns",
      policyGate: { requiresAuthorizationDocs: true },
      imageRules: { 
        requireMinCount: 3, 
        mustInclude: ["box_front.jpg","coa_closeup.jpg","disc_top.jpg"] 
      }
    }
  });

  await prisma.playbook.upsert({
    where: { sku: "WIN11PRO-DVD" },
    update: {},
    create: {
      productId: p2.id,
      sku: "WIN11PRO-DVD",
      skuPrefix: "WIN11",
      categoryId: osCategory.id,
      tags: ["software", "windows", "dvd"],
      isActive: true,
      titleTemplate: "Microsoft Windows 11 Pro DVD | Retail | COA Sticker | Ships Fast",
      subtitle: "Genuine Microsoft retail media — no digital delivery",
      bullets: [
        "Official Microsoft Windows 11 Pro retail media",
        "Disc + COA included, sealed packaging",
        "Lifetime activation on one device",
        "Physical shipment only, no email keys",
        "Compatible with 64-bit systems"
      ],
      forbiddenPhrases: ["online activation key","instant delivery","OEM","global key"],
      itemSpecifics: { 
        Brand: "Microsoft", 
        Format: "DVD", 
        "License Category": "Retail", 
        Type: "Operating System", 
        Delivery: "Physical Mail" 
      },
      priceMin: 69.99,
      priceMax: 149.99,
      shippingProfile: "Standard-USA-3day",
      returnsProfile: "30d-returns",
      policyGate: { requiresAuthorizationDocs: true },
      imageRules: { 
        requireMinCount: 3, 
        mustInclude: ["box_front.jpg","coa_closeup.jpg","disc_top.jpg"] 
      }
    }
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
