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
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            AI-Powered eBay Listing
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Automation
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Upload photos of your Windows DVDs and let our AI create perfect, compliant eBay listings automatically. 
            Boost your margins and scale your business with intelligent automation.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/signin">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/dashboard/chat">Try the Agent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground">Listings Automated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">$50M+</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">AI Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to automate eBay listings
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our AI-powered platform handles every aspect of listing creation, from photo analysis to compliance checking.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Camera className="h-5 w-5 flex-none text-blue-600" />
                  Smart Photo Analysis
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">AI analyzes your product photos to extract titles, descriptions, and specifications automatically.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Shield className="h-5 w-5 flex-none text-blue-600" />
                  Compliance First
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Built-in policy checks ensure all listings meet eBay's requirements and Microsoft's licensing terms.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Zap className="h-5 w-5 flex-none text-blue-600" />
                  Automated Publishing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Connect your eBay account and let AI create inventory, offers, and publish listings automatically.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <BarChart3 className="h-5 w-5 flex-none text-blue-600" />
                  Price Optimization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">AI suggests optimal pricing based on market data, competitor analysis, and demand forecasting.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Target className="h-5 w-5 flex-none text-blue-600" />
                  Category Intelligence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Automatically selects the best eBay categories and adds relevant item specifics for maximum visibility.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Sparkles className="h-5 w-5 flex-none text-blue-600" />
                  SEO Optimization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">AI crafts compelling titles and descriptions that rank higher in eBay search results.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Get started in minutes with our simple 3-step process
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-semibold">1</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">Upload Photos</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Take photos of your Windows DVD box, COA, and disc. Our AI analyzes them automatically.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-semibold">2</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">Connect eBay</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Authorize Pulsar to access your eBay seller account with secure OAuth integration.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-semibold">3</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">Auto-Publish</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  AI creates and publishes your listing on eBay with perfect optimization and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to automate your listings?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join thousands of sellers who are already saving hours with AI-powered eBay automation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/signin">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Everything you need to know about Pulsar Automation
            </p>
          </div>
          <div className="mt-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground">How accurate is the AI analysis?</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Our AI achieves 95% accuracy in product identification and listing creation. It's trained specifically on Windows DVD products and eBay's listing requirements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Is my eBay account secure?</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Yes, we use OAuth 2.0 for secure, read-only access to your eBay account. We never store your eBay credentials and you can revoke access anytime.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">What types of products are supported?</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Currently optimized for Microsoft Windows DVDs (Windows 10, 11, Server editions) with physical COA stickers. We're expanding to other software products soon.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Can I customize the AI-generated listings?</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Absolutely! You can review and edit all AI-generated content before publishing. You can also set custom templates and rules for your listings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-bold">Pulsar Automation</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered eBay listing automation for Microsoft Windows DVDs.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pulsar Automation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}