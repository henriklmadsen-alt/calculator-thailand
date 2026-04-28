/**
 * PWA Assets Generator for Calculator Thailand
 * 
 * Generates maskable icons and splash screen configurations
 * Run with: node generate-pwa-assets.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = __dirname;
const THEME_COLOR = '#2563eb'; // Blue
const BG_COLOR = '#ffffff';     // White
const APP_NAME = 'คำนวณเลข';

// SVG Icon definition (calculator icon)
const iconSVG = (size, viewBox = `0 0 ${size} ${size}`) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
  <!-- Blue background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="${THEME_COLOR}"/>
  <!-- Calculator display (white) -->
  <rect x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.15)}" 
        width="${Math.round(size * 0.6)}" height="${Math.round(size * 0.25)}" 
        rx="${Math.round(size * 0.05)}" fill="white"/>
  <!-- Button grid -->
  <g fill="white">
    <rect x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.5)}" 
          width="${Math.round(size * 0.13)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}"/>
    <rect x="${Math.round(size * 0.41)}" y="${Math.round(size * 0.5)}" 
          width="${Math.round(size * 0.13)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}"/>
    <rect x="${Math.round(size * 0.62)}" y="${Math.round(size * 0.5)}" 
          width="${Math.round(size * 0.13)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}"/>
    <rect x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.72)}" 
          width="${Math.round(size * 0.13)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}"/>
    <rect x="${Math.round(size * 0.41)}" y="${Math.round(size * 0.72)}" 
          width="${Math.round(size * 0.13)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}"/>
    <!-- Accent button (light blue) -->
    <rect x="${Math.round(size * 0.62)}" y="${Math.round(size * 0.72)}" 
          width="${Math.round(size * 0.18)}" height="${Math.round(size * 0.17)}" 
          rx="${Math.round(size * 0.03)}" fill="#60a5fa"/>
  </g>
</svg>
`;

// Generate maskable icons (PNG would require a library; for now, keep SVG as primary)
const generateManifestConfig = () => {
  return {
    icons: [
      // Maskable SVG icons (primary, adaptive display)
      {
        src: "/icons/icon-192-maskable.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      // Fallback regular icons (any size, not adaptive)
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      }
    ],
    // Android splash screens (multiple display densities)
    screenshots: [
      // Portrait screenshots
      {
        src: "/splash/splash-narrow-540-720.svg",
        sizes: "540x720",
        form_factor: "narrow",
        type: "image/svg+xml"
      },
      {
        src: "/splash/splash-narrow-750-1280.svg",
        sizes: "750x1280",
        form_factor: "narrow",
        type: "image/svg+xml"
      },
      // Wide screenshots (for tablets/landscape)
      {
        src: "/splash/splash-wide-1280-720.svg",
        sizes: "1280x720",
        form_factor: "wide",
        type: "image/svg+xml"
      }
    ]
  };
};

// Generate splash screens
const generateSplashScreen = (width, height, formFactor = 'narrow') => {
  const isPortrait = height > width;
  const padding = Math.round(width * 0.1);
  
  // Center the icon and text
  const iconSize = Math.round(Math.min(width, height) * 0.3);
  const iconX = (width - iconSize) / 2;
  const iconY = Math.round(height * 0.2);
  const textY = iconY + iconSize + Math.round(height * 0.1);
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${BG_COLOR}"/>
  
  <!-- Gradient overlay (subtle) -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  
  <!-- Icon -->
  <svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="102" fill="${THEME_COLOR}"/>
    <rect x="100" y="77" width="312" height="128" rx="26" fill="white"/>
    <rect x="100" y="256" width="88" height="88" rx="16" fill="white"/>
    <rect x="212" y="256" width="88" height="88" rx="16" fill="white"/>
    <rect x="324" y="256" width="88" height="88" rx="16" fill="white"/>
    <rect x="100" y="368" width="88" height="88" rx="16" fill="white"/>
    <rect x="212" y="368" width="88" height="88" rx="16" fill="white"/>
    <rect x="324" y="368" width="196" height="88" rx="16" fill="#60a5fa"/>
  </svg>
  
  <!-- App name text -->
  <text x="${width / 2}" y="${textY}" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.round(width * 0.08)}" 
        font-weight="600"
        text-anchor="middle" 
        fill="${THEME_COLOR}"
        dominant-baseline="middle">คำนวณเลข</text>
  
  <!-- Subtitle (optional, only on larger screens) -->
  ${width >= 750 ? `
  <text x="${width / 2}" y="${textY + Math.round(height * 0.08)}" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.round(width * 0.04)}" 
        text-anchor="middle" 
        fill="#6b7280"
        dominant-baseline="middle">เครื่องคำนวณออนไลน์ฟรี</text>
  ` : ''}
</svg>
  `.trim();
};

// Write files
const writeFile = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, content);
  console.log(`✓ Generated: ${path.relative(process.cwd(), filepath)}`);
};

// Generate icons directory
const iconsDir = path.join(OUTPUT_DIR, 'icons');
const splashDir = path.join(OUTPUT_DIR, 'splash');

// Create icon SVGs
writeFile(path.join(iconsDir, 'icon-192-maskable.svg'), iconSVG(192));
writeFile(path.join(iconsDir, 'icon-192.svg'), iconSVG(192));
writeFile(path.join(iconsDir, 'icon-512-maskable.svg'), iconSVG(512));
writeFile(path.join(iconsDir, 'icon-512.svg'), iconSVG(512));

// Create splash screens
writeFile(path.join(splashDir, 'splash-narrow-540-720.svg'), generateSplashScreen(540, 720, 'narrow'));
writeFile(path.join(splashDir, 'splash-narrow-750-1280.svg'), generateSplashScreen(750, 1280, 'narrow'));
writeFile(path.join(splashDir, 'splash-wide-1280-720.svg'), generateSplashScreen(1280, 720, 'wide'));

// Output manifest configuration
const manifestConfig = generateManifestConfig();
console.log('\n✓ Manifest configuration ready:');
console.log(JSON.stringify(manifestConfig, null, 2));

console.log('\n✓ PWA Assets generation complete!');
