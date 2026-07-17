const fs = require('fs');
const html = fs.readFileSync('portfolio.html', 'utf8');

// Parse using simpler regexes
const aBlocks = html.match(/<a class="project-cover[\s\S]*?<\/a>/g) || [];
console.log("Found aBlocks count:", aBlocks.length);

aBlocks.forEach((block, idx) => {
  const hrefMatch = /href="\/([^"]+)"/.exec(block);
  const slug = hrefMatch ? hrefMatch[1] : '';
  
  const titleMatch = /class="title preserve-whitespace">([\s\S]*?)<\/div>/.exec(block);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const dataSrcMatch = /data-src="([^"]+)"/.exec(block);
  const coverUrl = dataSrcMatch ? dataSrcMatch[1] : '';
  
  console.log(`[${idx+1}] Title: "${title}", Slug: "${slug}"`);
  console.log(`    Cover URL: ${coverUrl}`);
});
