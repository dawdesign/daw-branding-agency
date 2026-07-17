const fs = require('fs');
const data = JSON.parse(fs.readFileSync('parsed_full_details.json', 'utf8'));

let output = '';
data.forEach((p, index) => {
  output += `\n==============================================\n`;
  output += `[${index + 1}] TITLE: ${p.title} (${p.slug})\n`;
  output += `    Cover Image: ${p.coverUrl}\n`;
  output += `    Page Images:\n`;
  p.pageImages.forEach((img, i) => {
    output += `      ${i + 1}: ${img}\n`;
  });
});

fs.writeFileSync('details_output_utf8.txt', output, 'utf8');
console.log("Written details_output_utf8.txt!");
