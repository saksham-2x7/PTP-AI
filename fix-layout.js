const fs = require('fs');
let file = fs.readFileSync('src/app/layout.tsx', 'utf8');

if (!file.includes('ErrorBoundary')) {
    file = file.replace(
        /import \{ Sidebar \} from '@\/components\/layout\/Sidebar';/,
        "import { Sidebar } from '@/components/layout/Sidebar';\nimport { ErrorBoundary } from '@/components/ErrorBoundary';"
    );
    file = file.replace(
        /<AnimatedBackground \/>\n\s*<Sidebar \/>\n\s*\{children\}/,
        "<AnimatedBackground />\n        <Sidebar />\n        <ErrorBoundary>\n          {children}\n        </ErrorBoundary>"
    );
    fs.writeFileSync('src/app/layout.tsx', file);
}
