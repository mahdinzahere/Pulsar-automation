"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientBrowser();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const tiers = [
    {
      name: "Starter",
      id: "starter",
      href: user ? "/dashboard" : "/signin",
      price: { monthly: "$29", annually: "$290" },
      description: "Perfect for individual sellers getting started with automation.",
      features: [
        "Up to 100 listings per month",
        "AI photo analysis",
        "Basic compliance checking",
        "Email support",
        "Standard templates",
      ],
      notIncluded: [
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Bulk operations",
      ],
      popular: false,
    },
    {
      name: "Pro",
      id: "pro",
      href: user ? "/dashboard" : "/signin",
      price: { monthly: "$99", annually: "$990" },
      description: "For serious sellers who need advanced features and higher limits.",
      features: [
        "Up to 1,000 listings per month",
        "Advanced AI analysis",
        "Full compliance suite",
        "Priority support",
        "Custom templates",
        "Advanced analytics",
        "Bulk operations",
        "API access",
      ],
      notIncluded: [
        "White-label solution",
        "Custom AI training",
      ],
      popular: true,
    },
  ];

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that fits your business needs. No hidden fees, no surprises.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:max-w-none sm:grid-cols-2 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.popular
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-border bg-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {tier.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or {tier.price.annually}/year (save 17%)
                </p>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-foreground">What's included:</h4>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                      <span className="ml-3 text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {tier.notIncluded.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-foreground">Not included:</h4>
                    <ul className="mt-2 space-y-2">
                      {tier.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <X className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
                          <span className="ml-3 text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                {loading ? (
                  <Button disabled className="w-full">
                    Loading...
                  </Button>
                ) : user ? (
                  <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                    <Link href="/signin">Sign in to Subscribe</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
