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
  const summary = {};
  for (const proj of projects) {
    const url = `https://dupuydawson.myportfolio.com/${proj}`;
    try {
      const html = await fetchUrl(url);
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(html);
      const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
      
      const found = [];
      for (const kw of keywords) {
        if (html.toLowerCase().includes(kw)) {
          found.push(kw);
        }
      }
      
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
      
      summary[proj] = {
        title,
        foundKeywords: found,
        imagesCount: images.length,
        firstImages: images.slice(0, 5)
      };
    } catch (e) {
      summary[proj] = { error: e.message };
    }
  }
  fs.writeFileSync('summary.json', JSON.stringify(summary, null, 2));
  console.log("Written summary.json!");
}

run();
