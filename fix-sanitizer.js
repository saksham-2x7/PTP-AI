const fs = require('fs');
let file = fs.readFileSync('src/lib/ai/triage.ts', 'utf8');

file = file.replace(
    /const textNotes = formData.get\('notes'\) as string \|\| '';/,
    `const rawText = formData.get('notes') as string || '';\n    const textNotes = rawText.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, ''); // XSS Sanitizer`
);
fs.writeFileSync('src/lib/ai/triage.ts', file);
