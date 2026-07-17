const fs = require('fs');
const path = require('path');

const portfolioHtml = fs.readFileSync('portfolio.html', 'utf8');

// Parse projects from portfolioHtml
// The project cover links look like:
// <a class="project-cover js-project-cover-touch hold-space" href="/orpheus-lodge" ...>
// inside it, there is <img class="cover__img js-lazy" src="..." data-src="..." data-srcset="..." data-sizes="...">
// and details-inner -> title

const coverRegex = /<a[^>]+href="\/([^"]+)"[\s\S]*?<img[^>]+data-src="([^"]+)"[\s\S]*?<div class="title preserve-whitespace">([\s\S]*?)<\/div>/g;
let match;
const projects = [];
while ((match = coverRegex.exec(portfolioHtml)) !== null) {
  projects.push({
    slug: match[1],
    coverUrl: match[2],
    title: match[3].trim()
  });
}

console.log("Parsed portfolio projects:", projects.length);

const results = [];

projects.forEach(p => {
  const file = path.join('project_pages', `${p.slug}.html`);
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8');
  
  // Find all project-module-image images
  const moduleRegex = /project-module-image[\s\S]*?data-src="([^"]+)"/g;
  let imgMatch;
  const pageImages = [];
  while ((imgMatch = moduleRegex.exec(html)) !== null) {
    const src = imgMatch[1];
    if (!pageImages.includes(src)) {
      pageImages.push(src);
    }
  }

  // Fallback to any images in the project-modules if project-module-image regex missed some
  const fallbackRegex = /<div class="[^"]*image[^"]*"[\s\S]*?data-src="([^"]+)"/g;
  while ((imgMatch = fallbackRegex.exec(html)) !== null) {
    const src = imgMatch[1];
    if (!pageImages.includes(src)) {
      pageImages.push(src);
    }
  }

  results.push({
    slug: p.slug,
    title: p.title,
    coverUrl: p.coverUrl,
    pageImages: pageImages
  });
});

fs.writeFileSync('parsed_full_details.json', JSON.stringify(results, null, 2));
console.log("Written parsed_full_details.json!");
results.forEach(r => {
  console.log(`\n${r.title} (${r.slug}):`);
  console.log("  Cover:", r.coverUrl);
  console.log("  Page Images (first 3):");
  r.pageImages.slice(0, 3).forEach((img, i) => {
    console.log(`    ${i+1}: ${img}`);
  });
});
