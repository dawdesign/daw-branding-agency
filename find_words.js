const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('project_pages');
const query = 'ferme';

files.forEach(file => {
  const content = fs.readFileSync(path.join('project_pages', file), 'utf8');
  if (content.toLowerCase().includes(query.toLowerCase())) {
    console.log(`Found "${query}" in ${file}`);
  }
});
