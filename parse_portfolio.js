const fs = require('fs');
const html = fs.readFileSync('portfolio.html', 'utf8');

const coverRegex = /<a\s+class="project-cover[^"]*"[^>]*href="([^"]+)"([\s\S]*?)<\/a>/g;
let match;
const projects = [];

while ((match = coverRegex.exec(html)) !== null) {
  const href = match[1];
  const innerHtml = match[2];
  
  // Find background-image URL
  // Background images can be inside inline style: style="background-image:url('...')" or style="background-image:url(...)"
  const bgMatch = /background-image\s*:\s*url\(([^)]+)\)/.exec(innerHtml);
  let bgUrl = bgMatch ? bgMatch[1] : null;
  if (bgUrl) {
    // Clean up quotes around URL
    bgUrl = bgUrl.replace(/^['"]|['"]$/g, '');
  }
  
  // Also search for img src in the cover
  const imgMatch = /<img\s+[^>]*src="([^"]+)"/.exec(innerHtml);
  const imgUrl = imgMatch ? imgMatch[1] : null;
  
  // Title
  const titleMatch = /<div\s+class="cover-title[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(innerHtml);
  const title = titleMatch ? titleMatch[1].trim().replace(/<[^>]+>/g, '') : '';
  
  projects.push({ href, bgUrl, imgUrl, title });
}

console.log("Found " + projects.length + " projects:");
projects.forEach((p, idx) => {
  console.log(`\n--- Project ${idx + 1} ---`);
  console.log("Title:", p.title);
  console.log("Link:", p.href);
  console.log("BgUrl:", p.bgUrl);
  console.log("ImgUrl:", p.imgUrl);
});
