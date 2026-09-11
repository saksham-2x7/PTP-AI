'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const CyberScanner = React.memo(function CyberScanner() {
  return (
    <div className="relative w-full h-48 bg-black/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Radar circles */}
      <div className="absolute w-32 h-32 border border-red-500/20 rounded-full" />
      <div className="absolute w-24 h-24 border border-red-500/30 rounded-full" />
      <div className="absolute w-16 h-16 border border-red-500/40 rounded-full" />
      <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />

      {/* Spinning scanner sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(239, 68, 68, 0.4) 360deg)"
        }}
      />
      
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-red-500/50">
        SCANNING SECTOR 7...
      </div>
    </div>
  );
});
