const fs = require('fs');
const file = '/home/tioks/Desktop/hotelhub/src/components/ClientDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replacements
content = content.replace(/bg-\[\#1c1714\]/g, 'bg-charcoal');
content = content.replace(/text-\[\#1c1714\]/g, 'text-background');

// Note: In ClientDashboard.tsx, we want to replace text-white with text-foreground
// EXCEPT in the header or specific spots if any. But typically all text-white inside bg-charcoal should be text-foreground.
// Let's blindly replace them and see if any need reverting.
content = content.replace(/text-white/g, 'text-foreground');
content = content.replace(/bg-white/g, 'bg-foreground');
content = content.replace(/border-white/g, 'border-foreground');

fs.writeFileSync(file, content);
console.log("Done");
