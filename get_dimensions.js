const fs = require('fs');
const path = require('path');

function getPngSize(buffer) {
  if (buffer.toString('ascii', 12, 16) === 'IHDR') {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }
  return null;
}

function getJpgSize(buffer) {
  let i = 2;
  while (i < buffer.length - 8) {
    const byte = buffer[i];
    if (byte === 0xFF) {
      const marker = buffer[i + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        // Found SOF0 or SOF2
        const height = buffer.readUInt16BE(i + 5);
        const width = buffer.readUInt16BE(i + 7);
        return { width, height };
      }
    }
    i++;
  }
  return null;
}

function getImageSize(filePath) {
  try {
    // Read first 256KB to make sure we hit the SOF marker after EXIF data
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(256 * 1024);
    const bytesRead = fs.readSync(fd, buffer, 0, 256 * 1024, 0);
    fs.closeSync(fd);
    
    const slice = buffer.slice(0, bytesRead);
    if (slice[0] === 0x89 && slice[1] === 0x50 && slice[2] === 0x4E && slice[3] === 0x47) {
      return getPngSize(slice);
    } else if (slice[0] === 0xFF && slice[1] === 0xD8) {
      return getJpgSize(slice);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
  return null;
}

// Check covers
console.log("=== Cover Dimensions ===");
const covers = fs.readdirSync('project_covers');
covers.forEach(c => {
  const p = path.join('project_covers', c);
  const size = getImageSize(p);
  console.log(`${c}: ${size ? `${size.width}x${size.height}` : 'unknown'}`);
});

// Check page images
console.log("\n=== Page Image Dimensions ===");
const dirs = fs.readdirSync('project_images');
dirs.forEach(d => {
  const p = path.join('project_images', d);
  if (fs.statSync(p).isDirectory()) {
    const imgs = fs.readdirSync(p);
    imgs.forEach(img => {
      const imgPath = path.join(p, img);
      const size = getImageSize(imgPath);
      console.log(`${d}/${img}: ${size ? `${size.width}x${size.height}` : 'unknown'}`);
    });
  }
});
