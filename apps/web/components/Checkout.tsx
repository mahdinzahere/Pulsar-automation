"use client";

import { useState } from "react";

interface CheckoutProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function Checkout({ onSuccess, onClose }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/payments/whop/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      setEmbeddedUrl(data.embeddedUrl);
      
      // Listen for success message from iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://whop.com") return;
        
        if (event.data.type === "whop:checkout:success") {
          onSuccess?.();
          window.removeEventListener("message", handleMessage);
        }
      };
      
      window.addEventListener("message", handleMessage);
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (embeddedUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Complete Your Subscription</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <iframe
              src={embeddedUrl}
              className="w-full h-full border-0"
              title="Whop Checkout"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upgrade to Member
          </h2>
          <p className="text-gray-600 mb-6">
            Get access to AI-powered eBay listing automation, bulk playbooks, and advanced features.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI-powered listing generation
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              eBay OAuth integration
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Bulk playbook management
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Priority support
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Loading..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
