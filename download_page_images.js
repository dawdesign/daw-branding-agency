const fs = require('fs');
const https = require('https');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync('parsed_full_details.json', 'utf8'));

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => reject(err));
  });
}

async function run() {
  if (!fs.existsSync('project_images')) {
    fs.mkdirSync('project_images');
  }
  
  for (const p of parsed) {
    const projDir = path.join('project_images', p.slug);
    if (!fs.existsSync(projDir)) {
      fs.mkdirSync(projDir);
    }
    
    // Download first 4 page images
    const imagesToDownload = p.pageImages.slice(0, 4);
    for (let i = 0; i < imagesToDownload.length; i++) {
      const url = imagesToDownload[i];
      // Extract clean filename from url
      const cleanUrl = url.split('?')[0];
      const ext = cleanUrl.endsWith('.png') ? 'png' : 'jpg';
      const dest = path.join(projDir, `img_${i + 1}.${ext}`);
      
      console.log(`Downloading ${p.slug} img ${i + 1}...`);
      try {
        await downloadImage(url, dest);
      } catch (e) {
        console.error(`Failed ${p.slug} img ${i + 1}: ${e.message}`);
      }
    }
  }
  console.log("Done!");
}

run();
