const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG with "SC" - black S, red C, Inter font (font-weight 900 = Black)
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="white"/>
  <text x="256" y="380" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="380">
    <tspan fill="#0A0A0A">S</tspan><tspan fill="#EF4444">C</tspan>
  </text>
</svg>`;

async function generate() {
  const outDir = path.join(__dirname, '..', 'src', 'app');
  const publicDir = path.join(__dirname, '..', 'public');

  // Save source SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon);
  console.log('✅ favicon.svg saved');

  // Generate PNG sizes
  const sizes = [
    { size: 16, name: 'favicon-16x16.png', dir: publicDir },
    { size: 32, name: 'favicon-32x32.png', dir: publicDir },
    { size: 180, name: 'apple-icon.png', dir: outDir },
    { size: 192, name: 'android-chrome-192x192.png', dir: publicDir },
    { size: 512, name: 'android-chrome-512x512.png', dir: publicDir },
    { size: 32, name: 'icon.png', dir: outDir },
  ];

  const svgBuffer = Buffer.from(svgFavicon);

  for (const { size, name, dir } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, name));
    console.log(`✅ ${name} (${size}x${size})`);
  }

  // Generate ICO (use 32x32 PNG as base for .ico)
  // Simple ICO format: just embed a 32x32 PNG
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  
  // ICO file format
  const icoBuffer = createIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);
  console.log('✅ favicon.ico');

  console.log('\nAll favicons generated!');
}

function createIco(images) {
  // ICO header: 6 bytes
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  
  let dataOffset = headerSize + (dirEntrySize * numImages);
  const entries = [];
  
  for (const img of images) {
    entries.push({
      width: img.size === 256 ? 0 : img.size,
      height: img.size === 256 ? 0 : img.size,
      offset: dataOffset,
      size: img.data.length,
      data: img.data,
    });
    dataOffset += img.data.length;
  }
  
  const totalSize = dataOffset;
  const buffer = Buffer.alloc(totalSize);
  
  // Header
  buffer.writeUInt16LE(0, 0);      // Reserved
  buffer.writeUInt16LE(1, 2);      // ICO type
  buffer.writeUInt16LE(numImages, 4); // Number of images
  
  // Directory entries
  let entryOffset = headerSize;
  for (const entry of entries) {
    buffer.writeUInt8(entry.width, entryOffset);
    buffer.writeUInt8(entry.height, entryOffset + 1);
    buffer.writeUInt8(0, entryOffset + 2);  // Color palette
    buffer.writeUInt8(0, entryOffset + 3);  // Reserved
    buffer.writeUInt16LE(1, entryOffset + 4);  // Color planes
    buffer.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    buffer.writeUInt32LE(entry.size, entryOffset + 8);
    buffer.writeUInt32LE(entry.offset, entryOffset + 12);
    entryOffset += dirEntrySize;
  }
  
  // Image data
  for (const entry of entries) {
    entry.data.copy(buffer, entry.offset);
  }
  
  return buffer;
}

generate().catch(console.error);
