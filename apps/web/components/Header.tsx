"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    const supabase = createClientBrowser();
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
  };

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Pulsar Automation</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold">Pulsar Automation</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-muted rounded"></div>
            ) : user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/chat">Try the Agent</Link>
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signin">Get Started</Link>
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/chat" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Try the Agent
                  </Link>
                  <button onClick={handleSignOut} className="text-left text-sm font-medium">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/signin" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}