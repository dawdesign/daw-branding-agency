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
  
  // Clean HTML to extract text
  // Let's strip script and style tags first
  let cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Find text content
  const text = cleanHtml.replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
  
  // Find all images in project-modules
  // In Adobe Portfolio, images are usually inside divs like class="image-container" or class="image-module"
  // Let's match all cdn.myportfolio.com image links
  const imgRegex = /https:\/\/cdn\.myportfolio\.com\/69ce0ed8-18f4-4c61-9573-8d8ef55a123c\/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?/g;
  const matches = cleanHtml.match(imgRegex) || [];
  const uniqueImgs = [...new Set(matches)];
  
  console.log(`\n==============================================`);
  console.log(`PROJECT: ${proj}`);
  console.log(`TITLE: ${html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim()}`);
  console.log(`TEXT EXCERPT: ${text.substring(0, 500)}...`);
  console.log(`UNIQUE IMAGES (${uniqueImgs.length}):`);
  uniqueImgs.slice(0, 10).forEach((img, i) => {
    console.log(`  ${i+1}: ${img}`);
  });
});
