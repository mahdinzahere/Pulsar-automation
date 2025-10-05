"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in</h1>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user.email?.split('@')[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's what's happening with your listings today.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Membership Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Pro Plan - 1,000 listings/month
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Used this month</span>
                  <span>47 / 1,000</span>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '4.7%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* eBay Integration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">eBay Integration</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Not Connected</div>
              <p className="text-xs text-muted-foreground">
                Connect your eBay account to start automating
              </p>
              <Button size="sm" className="mt-4">
                Connect eBay
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Windows 11 Pro DVD</p>
                    <p className="text-xs text-muted-foreground">Published 2 hours ago</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Windows 10 Pro DVD</p>
                    <p className="text-xs text-muted-foreground">Draft created 5 hours ago</p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Windows Server 2022</p>
                    <p className="text-xs text-muted-foreground">Pending review 1 day ago</p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Start New Listing</span>
                </CardTitle>
                <CardDescription>
                  Upload photos and let AI create your listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/chat">
                    <Plus className="mr-2 h-4 w-4" />
                    Open Chat Agent
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>
                  View your listing performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}