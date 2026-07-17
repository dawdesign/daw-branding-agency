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
  
  // Find all image urls containing cdn.myportfolio.com
  const imgRegex = /https:\/\/cdn\.myportfolio\.com\/69ce0ed8-18f4-4c61-9573-8d8ef55a123c\/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?/g;
  const matches = html.match(imgRegex) || [];
  const uniqueImgs = [...new Set(matches)];
  
  console.log(`\n=== Images for ${proj} ===`);
  uniqueImgs.forEach(url => {
    // If url contains some interesting naming patterns
    console.log("  " + url);
  });
});
