import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediBridge | Emergency Orchestrator",
  description: "Universal Bridge between human intent and complex systems.",
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
