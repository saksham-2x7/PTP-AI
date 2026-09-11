const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

// Semantic sections and aria labels
text = text.replace(/<main className="(.*?)">/, '<main className="$1" aria-label="ER Triage Application">');
text = text.replace(/<div className="space-y-4">/, '<section className="space-y-4" aria-label="Field Transmissions">');
text = text.replace(/<Card className="bg-neutral-950\/40/, '<Card aria-label="Terminal Output" className="bg-neutral-950/40');
text = text.replace(/<div className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10 overflow-y-auto">/, '<div className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10 overflow-y-auto" aria-live="polite">');

fs.writeFileSync('src/app/page.tsx', text);
