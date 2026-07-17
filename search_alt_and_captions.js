const fs = require('fs');
const path = require('path');

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

projects.forEach(proj => {
  const file = path.join('project_pages', `${proj}.html`);
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8');
  
  console.log(`\n==============================================`);
  console.log(`PROJECT: ${proj}`);
  
  // Search for alt attributes
  const altRegex = /alt="([^"]*)"/gi;
  let match;
  const alts = [];
  while ((match = altRegex.exec(html)) !== null) {
    if (match[1].trim() && !alts.includes(match[1])) {
      alts.push(match[1].trim());
    }
  }
  console.log("ALTs:", alts);

  // Search for any captions or text in modules
  // In Adobe Portfolio, text modules are divs with class "project-description" or similar
  const descriptionRegex = /<div class="[^"]*description[^"]*">([\s\S]*?)<\/div>/gi;
  const descs = [];
  while ((match = descriptionRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text && !descs.includes(text)) {
      descs.push(text);
    }
  }
  console.log("Descriptions:", descs);
});
