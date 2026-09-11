import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediBridge | ER Orchestration",
  description: "AI-powered emergency response and mass casualty orchestration platform.",
  manifest: "/manifest.json",
  openGraph: {
    title: "MediBridge ER Orchestration",
    description: "Universal bridge between human intent and complex emergency systems.",
    url: "https://medibridge.live",
    siteName: "MediBridge",
    images: [{ url: "https://medibridge.live/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediBridge ER Orchestration",
    description: "AI-powered emergency response platform.",
    images: ["https://medibridge.live/og.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white overflow-hidden selection:bg-red-900/50`}>
        <AnimatedBackground />
        <div className="flex h-screen w-full relative z-10">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
