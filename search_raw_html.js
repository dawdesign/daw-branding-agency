const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('project_pages');
const queries = ['ferme', 'chapuis', 'piment', 'sirop', 'maple', 'connaît', 'parle', 'sac', 'doulux', 'vito', 'agapes', 'echo'];

files.forEach(file => {
  const content = fs.readFileSync(path.join('project_pages', file), 'utf8');
  const found = [];
  queries.forEach(q => {
    if (content.toLowerCase().includes(q.toLowerCase())) {
      found.push(q);
    }
  });
  if (found.length > 0) {
    console.log(`${file}: found ${found.join(', ')}`);
  }
});
