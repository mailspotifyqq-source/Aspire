import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to encode raw RGBA buffer into a valid PNG file buffer
function encodePNG(width, height, rgbaBuffer) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to create CRC32
  function crc32(buf) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // Compression method (deflate)
  ihdr.writeUInt8(0, 11); // Filter method (standard)
  ihdr.writeUInt8(0, 12); // Interlace method (none)

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte (0 = None) at beginning of each scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = rowOffset + 1 + x * 4;
      rawData[dstIdx] = rgbaBuffer[srcIdx];       // R
      rawData[dstIdx + 1] = rgbaBuffer[srcIdx + 1]; // G
      rawData[dstIdx + 2] = rgbaBuffer[srcIdx + 2]; // B
      rawData[dstIdx + 3] = rgbaBuffer[srcIdx + 3]; // A
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Function to render the Aspire Travels Brand Logo Icon Mark to RGBA buffer
function renderAspireIcon(size, isCircle = false) {
  const buffer = Buffer.alloc(size * size * 4);

  // Helper color interpolator
  function lerp(a, b, t) {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.47;
  const cornerRadius = size * 0.22; // For squircle

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Normalized coordinates [-1, 1] relative to center
      const nx = (x - cx) / (size / 2);
      const ny = (y - cy) / (size / 2);
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Squircle distance check
      let inBase = false;
      let alphaBase = 1.0;

      if (isCircle) {
        if (dist <= 0.96) {
          inBase = true;
          alphaBase = dist > 0.94 ? (0.96 - dist) / 0.02 : 1.0;
        }
      } else {
        // Rounded rectangle / squircle
        const dx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
        const cornerDist = Math.sqrt(dx * dx + dy * dy);
        if (cornerDist <= cornerRadius) {
          inBase = true;
          alphaBase = cornerDist > cornerRadius - 1 ? cornerRadius - cornerDist : 1.0;
        }
      }

      if (!inBase) {
        // Transparent outside
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Background Gradient: Deep Midnight Navy to Slate Blue (#0b192c to #0f2744)
      const gradT = (nx + ny + 2) / 4;
      let r = lerp(11, 15, gradT);
      let g = lerp(25, 39, gradT);
      let b = lerp(44, 68, gradT);

      // Gold Outer Rim Border
      if (isCircle) {
        if (dist >= 0.90 && dist <= 0.96) {
          const rimT = Math.sin(gradT * Math.PI);
          r = lerp(r, 212, rimT * 0.85);
          g = lerp(g, 175, rimT * 0.85);
          b = lerp(b, 55, rimT * 0.85);
        }
      } else {
        const dx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
        const cornerDist = Math.sqrt(dx * dx + dy * dy);
        if (cornerDist >= cornerRadius - 3.5 && cornerDist <= cornerRadius) {
          r = 212;
          g = 175;
          b = 55;
        }
      }

      // Latitude / Globe Arc lines (subtle cyan/sky glow)
      const globeDist = Math.sqrt(nx * nx + (ny - 0.05) * (ny - 0.05));
      if (globeDist <= 0.65) {
        // Latitude circles
        const lat1 = Math.abs((ny - 0.05) - 0.0);
        const lat2 = Math.abs((ny - 0.05) - 0.25);
        const lat3 = Math.abs((ny - 0.05) + 0.25);
        const lon1 = Math.abs(nx);
        const lon2 = Math.abs(nx * nx * 2 + (ny - 0.05) * (ny - 0.05) - 0.25);

        if (Math.abs(globeDist - 0.62) < 0.02 || lat1 < 0.02 || lat2 < 0.02 || lat3 < 0.02 || lon1 < 0.02) {
          r = lerp(r, 56, 0.25);
          g = lerp(g, 189, 0.25);
          b = lerp(b, 248, 0.25);
        }
      }

      // Orbital Flight Path Arc (Curving from bottom left up to upper right)
      // Path approx: y = 0.5 * x^2 - 0.3 * x - 0.1
      const orbitY = 0.4 * (nx * nx) - 0.35 * nx - 0.1;
      const orbitDist = Math.abs((ny - 0.05) - orbitY);
      if (orbitDist < 0.025 && nx > -0.65 && nx < 0.65) {
        r = lerp(r, 56, 0.6);
        g = lerp(g, 189, 0.6);
        b = lerp(b, 248, 0.6);
      }

      // --- Central Brand Emblem "A" (Delta Jet / Spire) ---
      // Apex at (0, -0.6), Left base at (-0.5, 0.5), Right base at (0.5, 0.5)
      const apexX = 0;
      const apexY = -0.62;
      const leftBaseX = -0.45;
      const leftBaseY = 0.50;
      const rightBaseX = 0.45;
      const rightBaseY = 0.50;

      // Check if inside Left Wing of "A"
      // Triangle (apex, leftBase, centerMid)
      const isLeftWing = (nx <= 0 && ny >= apexY && ny <= leftBaseY &&
        nx >= (leftBaseX / (leftBaseY - apexY)) * (ny - apexY) &&
        nx <= ((-0.15) / (leftBaseY - apexY)) * (ny - apexY) + 0.05);

      // Check if inside Right Wing of "A"
      const isRightWing = (nx >= 0 && ny >= apexY && ny <= rightBaseY &&
        nx <= (rightBaseX / (rightBaseY - apexY)) * (ny - apexY) &&
        nx >= ((0.15) / (rightBaseY - apexY)) * (ny - apexY) - 0.05);

      // Check if inside Golden Horizon Crossbar
      const isCrossbar = (ny >= 0.12 && ny <= 0.24 && Math.abs(nx) <= 0.32);

      if (isLeftWing) {
        // Sky Blue / Royal Cyan wing
        const wingT = (nx + 0.45) / 0.45;
        r = lerp(2, 56, wingT);
        g = lerp(132, 189, wingT);
        b = lerp(199, 248, wingT);
      } else if (isRightWing) {
        // Luminous Metallic Gold wing (#d4af37 to #fef08a to #b45309)
        const goldT = (nx) / 0.45;
        r = lerp(254, 212, goldT);
        g = lerp(240, 175, goldT);
        b = lerp(138, 55, goldT);
      } else if (isCrossbar) {
        // Golden Crossbar
        r = 245;
        g = 180;
        b = 35;
      }

      // Compass Guidance Star at (0.5, -0.48)
      const starX = 0.48;
      const starY = -0.48;
      const sDistX = Math.abs(nx - starX);
      const sDistY = Math.abs(ny - starY);
      const starDist = Math.sqrt(sDistX * sDistX + sDistY * sDistY);

      if (starDist <= 0.12) {
        // 4-point star formula: |x| + |y| <= r or cross shape
        const cross = (sDistX < 0.02 && sDistY < 0.11) || (sDistY < 0.02 && sDistX < 0.11) ||
                      (sDistX + sDistY < 0.07);
        if (cross) {
          r = 255;
          g = 255;
          b = 255;
        } else if (starDist < 0.04) {
          r = 251;
          g = 191;
          b = 36;
        }
      }

      // Golden Apex Spark at (apexX, apexY)
      const apexDist = Math.sqrt((nx - apexX) * (nx - apexX) + (ny - apexY) * (ny - apexY));
      if (apexDist < 0.035) {
        r = 255;
        g = 255;
        b = 255;
      }

      buffer[idx] = Math.round(r);
      buffer[idx + 1] = Math.round(g);
      buffer[idx + 2] = Math.round(b);
      buffer[idx + 3] = Math.round(alphaBase * 255);
    }
  }

  return buffer;
}

// Generate ICO file containing 16x16, 32x32, 48x48 images
function generateICO(images) {
  // ICO Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved (must be 0)
  header.writeUInt16LE(1, 2); // Type (1 for icon .ico)
  header.writeUInt16LE(images.length, 4); // Number of images

  const directoryEntries = [];
  const imageDataBuffers = [];
  let currentOffset = 6 + images.length * 16;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);   // Width
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1); // Height
    entry.writeUInt8(0, 2); // Color palette count (0 for >= 8bpp)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4);  // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(img.pngBuffer.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12);       // Offset of image data

    directoryEntries.push(entry);
    imageDataBuffers.push(img.pngBuffer);
    currentOffset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...imageDataBuffers]);
}

// Main execution
const publicDir = path.resolve(process.cwd(), 'public');

console.log('Generating Aspire Travels Brand Favicons & Icons...');

// 1. Generate 48x48 (Google Search Favicon specification)
const buf48 = renderAspireIcon(48, false);
const png48 = encodePNG(48, 48, buf48);
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
console.log('✓ Created /public/favicon-48x48.png');

// 2. Generate 96x96
const buf96 = renderAspireIcon(96, false);
const png96 = encodePNG(96, 96, buf96);
fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), png96);
console.log('✓ Created /public/favicon-96x96.png');

// 3. Generate 192x192 (Android / PWA icon)
const buf192 = renderAspireIcon(192, false);
const png192 = encodePNG(192, 192, buf192);
fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), png192);
console.log('✓ Created /public/favicon-192x192.png');

// 4. Generate 512x512 (PWA Splash / High-res)
const buf512 = renderAspireIcon(512, false);
const png512 = encodePNG(512, 512, buf512);
fs.writeFileSync(path.join(publicDir, 'favicon-512x512.png'), png512);
console.log('✓ Created /public/favicon-512x512.png');

// 5. Generate 180x180 (Apple Touch Icon)
const buf180 = renderAspireIcon(180, false);
const png180 = encodePNG(180, 180, buf180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
console.log('✓ Created /public/apple-touch-icon.png');

// 6. Generate multi-resolution favicon.ico (16, 32, 48)
const buf16 = renderAspireIcon(16, false);
const png16 = encodePNG(16, 16, buf16);

const buf32 = renderAspireIcon(32, false);
const png32 = encodePNG(32, 32, buf32);

const icoBuffer = generateICO([
  { width: 16, height: 16, pngBuffer: png16 },
  { width: 32, height: 32, pngBuffer: png32 },
  { width: 48, height: 48, pngBuffer: png48 },
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('✓ Created /public/favicon.ico');

console.log('All favicon and icon assets generated successfully!');
