#!/usr/bin/env node
/**
 * generate-icons.mjs
 * Creates minimal SVG-based PNG icons for the Wisp PWA.
 * Run: node tools/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons");
mkdirSync(outDir, { recursive: true });

// SVG source — "w" lettermark on dark background
function makeSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0a0a0a"/>
  <text
    x="${size / 2}" y="${size * 0.68}"
    font-family="monospace"
    font-size="${size * 0.52}"
    font-weight="400"
    fill="#7fff7f"
    text-anchor="middle"
    letter-spacing="-1"
  >w</text>
</svg>`;
}

writeFileSync(join(outDir, "icon-192.svg"), makeSVG(192));
writeFileSync(join(outDir, "icon-512.svg"), makeSVG(512));

// Also write a simple apple-touch-icon SVG
writeFileSync(
  join(__dirname, "../public/apple-touch-icon.svg"),
  makeSVG(180),
);

console.log("Icons written to public/icons/ and public/apple-touch-icon.svg");
console.log("Convert to PNG with: npx sharp-cli ...");
