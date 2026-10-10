// Turns dist/index.html into dist/mech1-lab.html for publishing as a claude.ai artifact.
// The artifact host wraps the page in its own <!doctype>/<html>/<head>/<body>, so we keep only
// the title, icon, stylesheet/script tags and the mount point. Assets are published from dist/assets.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]);
const parts = [
  ...pick(/<title>[^<]*<\/title>/g),
  ...pick(/<link rel="icon"[^>]*>/g),
  ...pick(/<link rel="stylesheet"[^>]*>/g),
  ...pick(/<link rel="modulepreload"[^>]*>/g),
  '<div id="root"></div>',
  ...pick(/<script type="module"[^>]*><\/script>/g),
];
writeFileSync('dist/mech1-lab.html', parts.join('\n') + '\n');
const assets = readdirSync('dist/assets');
writeFileSync('dist/artifact-files.json', JSON.stringify(Object.fromEntries(assets.map((f) => [`assets/${f}`, `dist/assets/${f}`])), null, 1));
console.log(`dist/mech1-lab.html + ${assets.length} assets`);
