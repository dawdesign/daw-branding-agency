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

async function run() {
  if (!fs.existsSync('project_pages')) {
    fs.mkdirSync('project_pages');
  }
  for (const proj of projects) {
    const url = `https://dupuydawson.myportfolio.com/${proj}`;
    try {
      console.log(`Downloading ${proj}...`);
      const html = await fetchUrl(url);
      fs.writeFileSync(`project_pages/${proj}.html`, html);
    } catch (e) {
      console.error(`Error ${proj}:`, e.message);
    }
  }
  console.log("Done!");
}

run();
