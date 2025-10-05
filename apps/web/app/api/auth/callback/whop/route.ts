import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("whop-signature");

    // Verify webhook signature
    if (!process.env.WHOP_WEBHOOK_SECRET || !signature) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.WHOP_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const { type, data } = event;

    // Handle different webhook events
    switch (type) {
      case "checkout.completed":
      case "subscription.created":
      case "subscription.activated":
        await handleSubscriptionActivated(data);
        break;
        
      case "subscription.cancelled":
      case "subscription.expired":
        await handleSubscriptionCancelled(data);
        break;
        
      case "subscription.updated":
        await handleSubscriptionUpdated(data);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(data: any) {
  const { customer_email, metadata } = data;
  
  if (!customer_email || !metadata?.user_id) {
    console.error("Missing required data in webhook");
    return;
  }

  try {
    // Update user role to MEMBER
    await prisma.user.upsert({
      where: { email: customer_email },
      update: { role: "MEMBER" },
      create: {
        email: customer_email,
        role: "MEMBER",
      },
    });

    // Log the activity
    await prisma.auditLog.create({
      data: {
        userId: metadata.user_id,
        action: "SUBSCRIPTION_ACTIVATED",
        details: {
          email: customer_email,
          subscriptionId: data.id,
          planId: data.product_id,
        },
      },
    });

    console.log(`User ${customer_email} upgraded to MEMBER`);
  } catch (error) {
    console.error("Error handling subscription activation:", error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  const { customer_email, metadata } = data;
  
  if (!customer_email || !metadata?.user_id) {
    console.error("Missing required data in webhook");
    return;
  }

  try {
    // Update user role to USER
    await prisma.user.upsert({
      where: { email: customer_email },
      update: { role: "USER" },
      create: {
        email: customer_email,
        role: "USER",
      },
    });

    // Log the activity
    await prisma.auditLog.create({
      data: {
        userId: metadata.user_id,
        action: "SUBSCRIPTION_CANCELLED",
        details: {
          email: customer_email,
          subscriptionId: data.id,
        },
      },
    });

    console.log(`User ${customer_email} downgraded to USER`);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  const { customer_email, metadata } = data;
  
  if (!customer_email || !metadata?.user_id) {
    console.error("Missing required data in webhook");
    return;
  }

  try {
    // Log the activity
    await prisma.auditLog.create({
      data: {
        userId: metadata.user_id,
        action: "SUBSCRIPTION_UPDATED",
        details: {
          email: customer_email,
          subscriptionId: data.id,
          changes: data,
        },
      },
    });

    console.log(`User ${customer_email} subscription updated`);
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}
