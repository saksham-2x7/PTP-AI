const fs = require('fs');

let mcp = fs.readFileSync('src/components/ui/MCPMatrix.tsx', 'utf8');
mcp = mcp.replace(/import \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect } from 'react';");
mcp = mcp.replace(/export function MCPMatrix\(\{ isProcessing \}: \{ isProcessing: boolean \}\) \{/, "export const MCPMatrix = React.memo(function MCPMatrix({ isProcessing }: { isProcessing: boolean }) {");
mcp = mcp.replace(/  \);\n\}/, "  );\n});");
fs.writeFileSync('src/components/ui/MCPMatrix.tsx', mcp);

let scanner = fs.readFileSync('src/components/ui/CyberScanner.tsx', 'utf8');
scanner = scanner.replace(/import \{ motion \} from 'framer-motion';/, "import React from 'react';\nimport { motion } from 'framer-motion';");
scanner = scanner.replace(/export function CyberScanner\(\) \{/, "export const CyberScanner = React.memo(function CyberScanner() {");
scanner = scanner.replace(/  \);\n\}/, "  );\n});");
fs.writeFileSync('src/components/ui/CyberScanner.tsx', scanner);
