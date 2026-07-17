const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('project_pages/doulux.html', 'utf8');

// Find all elements with class containing 'module' or find image/text elements inside project content
// Usually project content is inside <div class="project-content"> or <div class="container"> or <main>
// Let's print out all divs and their classes
const divRegex = /<div\s+class="([^"]*)"/g;
let match;
const classes = new Set();
while ((match = divRegex.exec(html)) !== null) {
  classes.add(match[1]);
}
console.log("Classes found in doulux.html:", Array.from(classes).slice(0, 30));

// Let's search for the images and see if there are any surrounding divs or captions
const imageModules = html.match(/<div[^>]*class="[^"]*image[^"]*"[\s\S]*?<\/div>/gi) || [];
console.log(`Found ${imageModules.length} image modules/divs`);
if (imageModules.length > 0) {
  console.log("First image module sample:", imageModules[0].substring(0, 400));
}
