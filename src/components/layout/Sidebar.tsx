'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, BrainCircuit, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: 'Triage Terminal', icon: Activity },
  { href: '/dashboard', label: 'ER Operations', icon: LayoutDashboard },
  { href: '/intelligence', label: 'AI Protocols', icon: BrainCircuit },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <h1 className="text-xl font-black tracking-widest text-white flex items-center gap-3">
          <Activity className="w-6 h-6 text-red-500" />
          MEDIBRIDGE
        </h1>
      </div>
      <nav className="flex-1 py-8 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block relative">
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute inset-0 bg-red-950/30 border border-red-900/50 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-colors",
                isActive ? "text-white font-bold" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
              )}>
                <Icon className={cn("w-4 h-4", isActive ? "text-red-500" : "")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5 text-xs text-neutral-600 font-mono text-center">
        SECTOR 7 // V2.0.0
      </div>
    </aside>
  );
}
