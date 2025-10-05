import { Header } from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "Pulsar Automation AI",
  description: "AI-powered eBay listing automation for Microsoft Windows DVDs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}