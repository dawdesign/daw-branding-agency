const fs = require('fs');
const https = require('https');
const path = require('path');

// From scraped_images.json, orpheus-lodge has these images:
const urls = [
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/7c3b937f-1318-4bcc-adf6-dd4fe9e801ca.jpg?h=eb6d5ff28d030314e850894301aad056",
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/3f3b1462-0a3e-4bf6-a0e4-0a39ec3a8d5b.jpg?h=ec3c42f071dddc5ffa0ae480b9d55831",
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/883995f6-2704-4f1a-b0be-4640fe9832bd.jpg?h=88c4f667a49612568288cb387a92c06e",
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/b8eac313-2b83-4bce-a9db-dea0377d3527.jpg?h=c06adc5f6a0a90b969467f737f9d2bab",
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/0e2704b7-90ff-44ea-8981-1d5c34fe605f.jpg?h=b090363116239e630a507b94d21ad3eb",
  "https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/7207a1a0-71b1-4367-a431-0382a1ac45ef.jpg?h=799b39f3eccbf3349c9d101084626619"
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => reject(err));
  });
}

async function run() {
  const dir = 'project_images/orpheus-lodge';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (let i = 0; i < urls.length; i++) {
    const dest = path.join(dir, `img_${i + 1}.jpg`);
    console.log(`Downloading orpheus-lodge img ${i + 1}...`);
    try {
      await downloadImage(urls[i], dest);
    } catch (e) {
      console.error(`Failed: ${e.message}`);
    }
  }
  console.log("Done!");
}

run();
