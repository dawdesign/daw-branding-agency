const fs = require('fs');
const https = require('https');

const projects = [
  { name: 'orpheus-lodge', url: 'https://dupuydawson.myportfolio.com/orpheus-lodge' },
  { name: 'starbooth-360', url: 'https://dupuydawson.myportfolio.com/starbooth-360' },
  { name: 'sna-vernon-giverny-affiches-touristiques', url: 'https://dupuydawson.myportfolio.com/sna-vernon-giverny-affiches-touristiques' },
  { name: 'porc-pays', url: 'https://dupuydawson.myportfolio.com/porc-pays' },
  { name: 'doulux', url: 'https://dupuydawson.myportfolio.com/doulux' },
  { name: 'white-castle-rebranding', url: 'https://dupuydawson.myportfolio.com/white-castle-rebranding' },
  { name: 'super-u', url: 'https://dupuydawson.myportfolio.com/super-u' },
  { name: 'cafe-vito', url: 'https://dupuydawson.myportfolio.com/cafe-vito' },
  { name: 'echo', url: 'https://dupuydawson.myportfolio.com/echo' },
  { name: 'pimas-candy', url: 'https://dupuydawson.myportfolio.com/pimas-candy' },
  { name: 'agapes', url: 'https://dupuydawson.myportfolio.com/agapes' }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function run() {
  const results = {};
  for (const proj of projects) {
    console.log(`Fetching ${proj.name}...`);
    try {
      const html = await fetchUrl(proj.url);
      
      // Look for images in the HTML
      // Images in Adobe Portfolio are usually inside .project-module, .image-module, or img tags.
      const imgRegex = /<img\s+[^>]*src="([^"]+)"/g;
      const images = [];
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const src = match[1];
        if (src.includes('cdn.myportfolio.com') && !images.includes(src)) {
          images.push(src);
        }
      }
      
      // Let's also look for data-src
      const dataSrcRegex = /data-src="([^"]+)"/g;
      while ((match = dataSrcRegex.exec(html)) !== null) {
        const src = match[1];
        if (src.includes('cdn.myportfolio.com') && !images.includes(src)) {
          images.push(src);
        }
      }
      
      results[proj.name] = images;
      console.log(`Found ${images.length} images for ${proj.name}`);
    } catch (e) {
      console.error(`Error fetching ${proj.name}:`, e.message);
    }
  }
  
  fs.writeFileSync('scraped_images.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

run();
