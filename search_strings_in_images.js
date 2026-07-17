const fs = require('fs');
const path = require('path');

const dirs = ['project_covers', 'project_images'];
const keywords = ['ferme', 'chapuis', 'piment', 'sirop', 'maple', 'peaches', 'connaît', 'parle', 'sac', 'doulux', 'vito', 'agapes', 'echo', 'lodge', 'starbooth', 'vernon', 'porc', 'castle', 'candy'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(item => {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      const sublist = fs.readdirSync(p);
      sublist.forEach(subitem => {
        const subp = path.join(p, subitem);
        const buf = fs.readFileSync(subp);
        const found = [];
        keywords.forEach(kw => {
          if (buf.indexOf(Buffer.from(kw, 'utf8')) !== -1 || buf.indexOf(Buffer.from(kw.toLowerCase(), 'utf8')) !== -1) {
            found.push(kw);
          }
        });
        if (found.length > 0) {
          console.log(`${d}/${subitem}: found ${found.join(', ')}`);
        }
      });
    } else {
      const buf = fs.readFileSync(p);
      const found = [];
      keywords.forEach(kw => {
        if (buf.indexOf(Buffer.from(kw, 'utf8')) !== -1 || buf.indexOf(Buffer.from(kw.toLowerCase(), 'utf8')) !== -1) {
          found.push(kw);
        }
      });
      if (found.length > 0) {
        console.log(`${item}: found ${found.join(', ')}`);
      }
    }
  });
});
