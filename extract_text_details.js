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
  let cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Look for page headers or project descriptions
  // Often it is in class="project-description" or header
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || '';
  
  // Let's find some main headings
  const h1s = [...cleanHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h2s = [...cleanHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const ps = [...cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 20);

  console.log(`\n==============================================`);
  console.log(`PROJ: ${proj}`);
  console.log(`TITLE: ${titleMatch}`);
  console.log(`H1s:`, h1s);
  console.log(`H2s:`, h2s);
  console.log(`PARAGRAPHS (first 3):`);
  ps.slice(0, 3).forEach(p => console.log("  - " + p.substring(0, 300)));
});
