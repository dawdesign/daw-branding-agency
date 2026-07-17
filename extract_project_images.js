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

const results = {};

projects.forEach(proj => {
  const file = path.join('project_pages', `${proj}.html`);
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8');
  
  // Find all elements with class 'project-module module image project-module-image'
  // and extract their img src.
  // We can search for the class and then grab the img src.
  const moduleRegex = /project-module-image[\s\S]*?<img\s+[^>]*src="([^"]+)"/g;
  let match;
  const images = [];
  while ((match = moduleRegex.exec(html)) !== null) {
    const src = match[1];
    if (!images.includes(src)) {
      images.push(src);
    }
  }

  // Let's also check for data-src
  const moduleDataSrcRegex = /project-module-image[\s\S]*?data-src="([^"]+)"/g;
  while ((match = moduleDataSrcRegex.exec(html)) !== null) {
    const src = match[1];
    if (!images.includes(src)) {
      images.push(src);
    }
  }
  
  results[proj] = images;
  console.log(`\n=== Project: ${proj} (${images.length} images) ===`);
  images.forEach((img, i) => {
    console.log(`  ${i + 1}: ${img}`);
  });
});

fs.writeFileSync('project_module_images.json', JSON.stringify(results, null, 2));
