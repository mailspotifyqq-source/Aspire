import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const publicDir = path.resolve(process.cwd(), 'public');
const sourcePath = path.join(publicDir, 'assets', 'aistudio', 'Screenshot_2026-10-28_233354_405b2b1c.png');

if (!fs.existsSync(sourcePath)) {
  console.error('Source logo file not found at:', sourcePath);
  process.exit(1);
}

console.log('Loading source Aspire Travels logo from:', sourcePath);
const rawBuffer = fs.readFileSync(sourcePath);
const srcPng = PNG.sync.read(rawBuffer);

// Strip the 1px left window-border artifact if present (x=0 is grey)
const cropLeft = srcPng.data[0] > 180 ? 1 : 0;
const srcW = srcPng.width - cropLeft;
const srcH = srcPng.height;

console.log(`Source dimensions: ${srcPng.width}x${srcPng.height} (cropped to ${srcW}x${srcH})`);

// Sample background color from top edge and bottom edge to provide seamless padding
function getTopBgColor() {
  const y = 2;
  let r = 0, g = 0, b = 0, count = 0;
  for (let x = cropLeft + 10; x < srcPng.width - 10; x += 10) {
    const idx = (y * srcPng.width + x) * 4;
    r += srcPng.data[idx];
    g += srcPng.data[idx + 1];
    b += srcPng.data[idx + 2];
    count++;
  }
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count), 255];
}

function getBottomBgColor() {
  const y = srcPng.height - 3;
  let r = 0, g = 0, b = 0, count = 0;
  for (let x = cropLeft + 10; x < srcPng.width - 10; x += 10) {
    const idx = (y * srcPng.width + x) * 4;
    r += srcPng.data[idx];
    g += srcPng.data[idx + 1];
    b += srcPng.data[idx + 2];
    count++;
  }
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count), 255];
}

const topBg = getTopBgColor();
const bottomBg = getBottomBgColor();

/**
 * Resamples the source image into a square S x S canvas with aspect ratio preserved.
 * Uses area-averaging / supersampling so high-frequency details (gold airplane, arcs, lettering) remain sharp.
 */
function createSquareFavicon(size) {
  const out = new PNG({ width: size, height: size });

  // Calculate target image dimensions preserving aspect ratio
  // Logo aspect ratio is srcW / srcH (~1.31)
  const destW = size;
  const destH = Math.round(size * (srcH / srcW));
  const yOffset = Math.floor((size - destH) / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const outIdx = (y * size + x) * 4;

      // Top padding
      if (y < yOffset) {
        out.data[outIdx] = topBg[0];
        out.data[outIdx + 1] = topBg[1];
        out.data[outIdx + 2] = topBg[2];
        out.data[outIdx + 3] = topBg[3];
        continue;
      }

      // Bottom padding
      if (y >= yOffset + destH) {
        out.data[outIdx] = bottomBg[0];
        out.data[outIdx + 1] = bottomBg[1];
        out.data[outIdx + 2] = bottomBg[2];
        out.data[outIdx + 3] = bottomBg[3];
        continue;
      }

      // Area in source image corresponding to this destination pixel
      const destYRel = y - yOffset;
      const srcY1 = (destYRel / destH) * srcH;
      const srcY2 = ((destYRel + 1) / destH) * srcH;

      const srcX1 = cropLeft + (x / destW) * srcW;
      const srcX2 = cropLeft + ((x + 1) / destW) * srcW;

      let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
      let totalWeight = 0;

      const yStart = Math.max(0, Math.floor(srcY1));
      const yEnd = Math.min(srcPng.height - 1, Math.floor(srcY2));
      const xStart = Math.max(cropLeft, Math.floor(srcX1));
      const xEnd = Math.min(srcPng.width - 1, Math.floor(srcX2));

      for (let sy = yStart; sy <= yEnd; sy++) {
        const yWeight = Math.max(0, Math.min(sy + 1, srcY2) - Math.max(sy, srcY1));
        if (yWeight <= 0) continue;

        for (let sx = xStart; sx <= xEnd; sx++) {
          const xWeight = Math.max(0, Math.min(sx + 1, srcX2) - Math.max(sx, srcX1));
          if (xWeight <= 0) continue;

          const weight = yWeight * xWeight;
          const srcIdx = (sy * srcPng.width + sx) * 4;

          rSum += srcPng.data[srcIdx] * weight;
          gSum += srcPng.data[srcIdx + 1] * weight;
          bSum += srcPng.data[srcIdx + 2] * weight;
          aSum += srcPng.data[srcIdx + 3] * weight;
          totalWeight += weight;
        }
      }

      if (totalWeight > 0) {
        out.data[outIdx] = Math.round(rSum / totalWeight);
        out.data[outIdx + 1] = Math.round(gSum / totalWeight);
        out.data[outIdx + 2] = Math.round(bSum / totalWeight);
        out.data[outIdx + 3] = Math.round(aSum / totalWeight);
      } else {
        out.data[outIdx] = topBg[0];
        out.data[outIdx + 1] = topBg[1];
        out.data[outIdx + 2] = topBg[2];
        out.data[outIdx + 3] = topBg[3];
      }
    }
  }

  return out;
}

// Generate valid multi-image ICO binary
function generateICO(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(images.length, 4); // Number of images

  const directoryEntries = [];
  const imageDataBuffers = [];
  let currentOffset = 6 + images.length * 16;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.pngBuffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);

    directoryEntries.push(entry);
    imageDataBuffers.push(img.pngBuffer);
    currentOffset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...imageDataBuffers]);
}

console.log('Generating favicon assets...');

// 1. 48x48 PNG (Google Search baseline)
const png48 = createSquareFavicon(48);
const buf48 = PNG.sync.write(png48);
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), buf48);
console.log('✓ /public/favicon-48x48.png (48x48)');

// 2. 96x96 PNG (Google Search HD + standard desktop)
const png96 = createSquareFavicon(96);
const buf96 = PNG.sync.write(png96);
fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), buf96);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), buf96); // Also save as favicon.png
console.log('✓ /public/favicon-96x96.png (96x96)');
console.log('✓ /public/favicon.png (96x96)');

// 3. 180x180 PNG (Apple Touch Icon)
const png180 = createSquareFavicon(180);
const buf180 = PNG.sync.write(png180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
console.log('✓ /public/apple-touch-icon.png (180x180)');

// 4. 192x192 PNG (PWA / Android standard)
const png192 = createSquareFavicon(192);
const buf192 = PNG.sync.write(png192);
fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), buf192);
console.log('✓ /public/favicon-192x192.png (192x192)');

// 5. 512x512 PNG (High-resolution PWA & Social)
const png512 = createSquareFavicon(512);
const buf512 = PNG.sync.write(png512);
fs.writeFileSync(path.join(publicDir, 'favicon-512x512.png'), buf512);
console.log('✓ /public/favicon-512x512.png (512x512)');

// 6. Multi-resolution favicon.ico (16, 32, 48)
const png16 = createSquareFavicon(16);
const buf16 = PNG.sync.write(png16);

const png32 = createSquareFavicon(32);
const buf32 = PNG.sync.write(png32);

const icoBuffer = generateICO([
  { width: 16, height: 16, pngBuffer: buf16 },
  { width: 32, height: 32, pngBuffer: buf32 },
  { width: 48, height: 48, pngBuffer: buf48 },
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('✓ /public/favicon.ico (multi-resolution 16x16, 32x32, 48x48)');

console.log('All favicon files generated from the uploaded logo successfully!');
