const fs = require('fs');
const https = require('https');
const path = require('path');

const projects = [
  { slug: 'orpheus-lodge', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/cd36c3e8-44bc-4a2c-89d9-ebb48778f588_rwc_310x183x3108x2331x3108.jpg?h=acb19e9f482ce4c2fe48492e3b2b5418' },
  { slug: 'starbooth-360', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/1cf0cfc3-ecfb-4a41-a5b6-5f1bf87e817e_car_4x3.jpg?h=d8f5bdb2ad8f03b798e4649a690eae65' },
  { slug: 'sna-vernon-giverny-affiches-touristiques', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/1dee455c-c306-4388-b729-49dde0a67440_rwc_433x216x2980x2235x2980.jpg?h=b21d35b864a2aec3fe951a33a93729d4' },
  { slug: 'porc-pays', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/58c13b92-b341-49ff-8f42-37dafa53ea82_rwc_0x348x1598x1198x1598.png?h=72305b18bea1ec64aae3c027a30719ac' },
  { slug: 'doulux', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/95dacd4a-88d3-43dd-bde2-7bd784a76bcb_rwc_0x398x1826x1369x1826.png?h=312d2a172dafcb83f6e976803a48211f' },
  { slug: 'white-castle-rebranding', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/6672b5b7-13a1-45bf-b5eb-c704c5501bef_rwc_332x183x1262x947x1262.png?h=986d507c2f440f8076b3571f621903b1' },
  { slug: 'super-u', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/0060042e-2f32-49b4-beba-b1f2e9ddebd7_rwc_273x451x1397x1048x1397.png?h=1729713d3ddd1e56194e228e26027d5d' },
  { slug: 'cafe-vito', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/b6a5c9c6-5916-4989-8ad5-b0ea17dbb0f1_rwc_437x234x1147x860x1147.png?h=2b0ae0c80700f4d41a5d4c55b1b1870f' },
  { slug: 'echo', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/bc7e7cd1-f3bc-4820-8e58-f2f757903e58_rwc_1261x175x2569x1927x2569.jpg?h=8f4f40423c824671e422a9f5e5611447' },
  { slug: 'pimas-candy', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/23be04d5-e106-4a94-a57e-a3a7021e58a2_rwc_1163x622x2976x2232x2976.png?h=4d22cb559b0b7b70bd51062e486fb4a8' },
  { slug: 'agapes', url: 'https://cdn.myportfolio.com/69ce0ed8-18f4-4c61-9573-8d8ef55a123c/e94e92eb-ee06-4303-adc4-87a74e81cc40_rwc_106x0x3333x2500x3333.jpg?h=e5a1a468afd2d91c707e16cd0215ead0' }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${res.statusCode})`));
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
  if (!fs.existsSync('project_covers')) {
    fs.mkdirSync('project_covers');
  }
  for (const p of projects) {
    const ext = p.url.includes('.png') ? 'png' : 'jpg';
    const dest = path.join('project_covers', `${p.slug}.${ext}`);
    console.log(`Downloading cover for ${p.slug}...`);
    try {
      await downloadImage(p.url, dest);
    } catch (e) {
      console.error(`Error ${p.slug}:`, e.message);
    }
  }
  console.log("Done!");
}

run();
