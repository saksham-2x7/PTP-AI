'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Globe, Shield, Cpu } from 'lucide-react';

const MCP_NODES = [
  { name: "mcp://fema.gov/disaster-db", icon: Globe, color: "text-blue-500" },
  { name: "mcp://epic-systems/patient-records", icon: Database, color: "text-green-500" },
  { name: "mcp://nhtsa/live-traffic-cams", icon: Globe, color: "text-yellow-500" },
  { name: "mcp://weather.gov/storm-radar", icon: Globe, color: "text-blue-400" },
  { name: "mcp://interpol/threat-intel", icon: Shield, color: "text-red-500" },
  { name: "mcp://cdc/hazmat-guidelines", icon: Database, color: "text-purple-500" },
  { name: "mcp://faa/airspace-medevac", icon: Globe, color: "text-blue-300" },
  { name: "mcp://local-pd/dispatch-radio", icon: Server, color: "text-neutral-400" },
  { name: "mcp://redcross/blood-supply-db", icon: Database, color: "text-red-400" },
  { name: "mcp://cerner/er-bed-telemetry", icon: Server, color: "text-green-400" },
  { name: "mcp://who/global-health-alerts", icon: Globe, color: "text-blue-500" },
  { name: "mcp://dhs/homeland-security-feed", icon: Shield, color: "text-red-600" },
  { name: "mcp://usgs/seismic-sensors", icon: Globe, color: "text-orange-500" },
  { name: "mcp://dot/highway-infrastructure", icon: Server, color: "text-yellow-600" },
  { name: "mcp://national-grid/power-status", icon: Cpu, color: "text-yellow-400" }
];

export function MCPMatrix({ isProcessing }: { isProcessing: boolean }) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  useEffect(() => {
    if (!isProcessing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveNodes([]);
      return;
    }

    const interval = setInterval(() => {
      setActiveNodes(prev => {
        const next = [...prev];
        if (next.length > 8) next.shift();
        next.push(Math.floor(Math.random() * MCP_NODES.length));
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="w-full h-40 bg-black/60 border border-white/10 rounded-lg overflow-hidden flex flex-col mt-6 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      <div className="absolute top-0 left-0 w-full h-6 bg-blue-950/40 border-b border-blue-900/50 flex items-center px-3 z-10">
        <Cpu className="w-3 h-3 text-blue-500 mr-2" />
        <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">Live MCP Context Resolution</span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
        </div>
      </div>
      
      <div className="flex-1 p-3 pt-8 flex flex-col gap-1 overflow-hidden relative">
        {!isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-neutral-600">
            [ MCP NETWORK IDLE - AWAITING INGEST ]
          </div>
        )}
        
        <AnimatePresence>
          {activeNodes.map((nodeIdx, i) => {
            const node = MCP_NODES[nodeIdx];
            const Icon = node.icon;
            return (
              <motion.div 
                key={`${i}-${nodeIdx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 font-mono text-[10px]"
              >
                <Icon className={`w-3 h-3 ${node.color}`} />
                <span className="text-neutral-300">Establishing context bridge...</span>
                <span className="text-white font-bold">{node.name}</span>
                <span className="text-green-500 ml-auto">[ 200 OK ]</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
