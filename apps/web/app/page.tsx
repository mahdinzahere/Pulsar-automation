"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Camera, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Menu,
  X,
  Cpu,
  Database,
  Lock,
  Bot,
  Globe,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, text: string, delay: number}>>([]);

  useEffect(() => {
    // Create floating bubbles with text
    const bubbleTexts = [
      "AI Analysis", "Smart Pricing", "Auto Listings", "Compliance Check",
      "Photo Recognition", "Market Data", "SEO Optimized", "Real-time Processing"
    ];
    
    const newBubbles = bubbleTexts.map((text, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      text,
      delay: Math.random() * 5
    }));
    
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute animate-float opacity-20"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/10">
              {bubble.text}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Menu */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 backdrop-blur-lg border-r border-gray-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl">Pulsar</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-6 space-y-4">
          <Link href="#features" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
            <span>Features</span>
          </Link>
          <Link href="#how-it-works" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span>How It Works</span>
          </Link>
          <Link href="/pricing" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span>Pricing</span>
          </Link>
          <Link href="/dashboard" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <Database className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/signin" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <Lock className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-40 lg:hidden bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-2"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Pulsar Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-3xl">P</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Pulsar
              </span>
              <br />
              <span className="text-white">Automation</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered eBay listing automation for Microsoft Windows DVDs. 
              Upload photos, get perfect listings, boost your margins.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                <Link href="/signin">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg">
                <Link href="/dashboard/chat">Try the Agent</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-gray-900/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">100K+</div>
                <div className="text-gray-400">Listings Automated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">$50M+</div>
                <div className="text-gray-400">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">AI Processing</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Everything you need to automate eBay listings
              </h2>
              <p className="text-xl text-gray-300">
                Our AI-powered platform handles every aspect of listing creation, from photo analysis to compliance checking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Smart Photo Analysis",
                  description: "AI analyzes your product photos to extract titles, descriptions, and specifications automatically."
                },
                {
                  icon: Shield,
                  title: "Compliance First",
                  description: "Built-in policy checks ensure all listings meet eBay's requirements and Microsoft's licensing terms."
                },
                {
                  icon: Zap,
                  title: "Automated Publishing",
                  description: "Connect your eBay account and let AI create inventory, offers, and publish listings automatically."
                },
                {
                  icon: BarChart3,
                  title: "Price Optimization",
                  description: "AI suggests optimal pricing based on market data, competitor analysis, and demand forecasting."
                },
                {
                  icon: Target,
                  title: "Category Intelligence",
                  description: "Automatically selects the best eBay categories and adds relevant item specifics for maximum visibility."
                },
                {
                  icon: Sparkles,
                  title: "SEO Optimization",
                  description: "AI crafts compelling titles and descriptions that rank higher in eBay search results."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:bg-gray-900/70 transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 sm:py-32 bg-gray-900/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300">
                Get started in minutes with our simple 3-step process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "1",
                  title: "Upload Photos",
                  description: "Take photos of your Windows DVD box, COA, and disc. Our AI analyzes them automatically."
                },
                {
                  step: "2", 
                  title: "Connect eBay",
                  description: "Authorize Pulsar to access your eBay seller account with secure OAuth integration."
                },
                {
                  step: "3",
                  title: "Auto-Publish", 
                  description: "AI creates and publishes your listing on eBay with perfect optimization and compliance."
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8 shadow-2xl">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to automate your listings?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of sellers who are already saving hours with AI-powered eBay automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                <Link href="/signin">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <span className="font-bold text-xl text-white">Pulsar Automation</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  AI-powered eBay listing automation for Microsoft Windows DVDs.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Pulsar Automation. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}