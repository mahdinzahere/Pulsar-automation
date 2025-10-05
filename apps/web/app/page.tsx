"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center space-y-10">
        <div className="flex justify-center">
          <Image src="/IMG_2013.jpg" alt="Pulsar Automation AI" width={260} height={80} priority />
        </div>
        <p className="text-gray-300">AI-powered eBay listing automation. Simple, fast, compliant.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="px-6 py-6 text-base">
            <Link href="/signin">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-6 text-base border-gray-700 text-white hover:bg-gray-900">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-6 text-base border-gray-700 text-white hover:bg-gray-900">
            <Link href="/dashboard/chat">Try the Agent</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}