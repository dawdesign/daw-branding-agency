const fs = require('fs');
const https = require('https');

const projects = [
  'orpheus-lodge',
  'starbooth-360',
  'sna-vernon-giverny-affiches-touristiques',
  'porc-pays',
  'doulux',
  'white-castle-rebranding',
  'super-u',
  'cafe-vito',
  'echo',
  'pimas-candy',
  'agapes'
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

const keywords = [
  'piment', 'chili', 'bottle', 'bouteille',
  'sac', 'bag', 'wood', 'bois', 'c\'est dans le sac',
  'newspaper', 'journal', 'se connaît', 'parle',
  'distillerie', 'chapuis', 'chapois', 'chapon',
  'woman', 'femme', 'rain', 'pluie', 'blue', 'bleu',
  'roll', 'rouleau', 'paper', 'papier', 'lettre', 'letter',
  'ferme', 'brasserie', 'rurale',
  'maple', 'syrup', 'sirop', 'erable', 'peaches', 'peche', 'pêche'
];

async function run() {
  for (const proj of projects) {
    const url = `https://dupuydawson.myportfolio.com/${proj}`;
    try {
      const html = await fetchUrl(url);
      console.log(`\n=== Project: ${proj} ===`);
      
      // Get title
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(html);
      console.log("Title:", titleMatch ? titleMatch[1].trim() : 'Unknown');
      
      // Look for matches
      const found = [];
      for (const kw of keywords) {
        if (html.toLowerCase().includes(kw)) {
          found.push(kw);
        }
      }
      console.log("Found keywords:", found.join(', '));
      
      // Print first 5 images that are not covers
      const imgRegex = /<img\s+[^>]*src="([^"]+)"/g;
      const images = [];
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const src = match[1];
        if (src.includes('cdn.myportfolio.com') && !images.includes(src)) {
          images.push(src);
        }
      }
      
      const dataSrcRegex = /data-src="([^"]+)"/g;
      while ((match = dataSrcRegex.exec(html)) !== null) {
        const src = match[1];
        if (src.includes('cdn.myportfolio.com') && !images.includes(src)) {
          images.push(src);
        }
      }
      
      console.log("Unique images (first 8):");
      images.slice(0, 8).forEach(img => console.log("  - " + img));
      
    } catch (e) {
      console.error(`Error on ${proj}:`, e.message);
    }
  }
}

run();
