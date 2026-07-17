const fs = require('fs');
const scraped = JSON.parse(fs.readFileSync('scraped_images.json', 'utf8'));

// Cover images from portfolio.html
const covers = [
  "cd36c3e8-44bc-4a2c-89d9-ebb48778f588",
  "1cf0cfc3-ecfb-4a41-a5b6-5f1bf87e817e",
  "1dee455c-c306-4388-b729-49dde0a67440",
  "58c13b92-b341-49ff-8f42-37dafa53ea82",
  "95dacd4a-88d3-43dd-bde2-7bd784a76bcb",
  "6672b5b7-13a1-45bf-b5eb-c704c5501bef",
  "0060042e-2f32-49b4-beba-b1f2e9ddebd7",
  "b6a5c9c6-5916-4989-8ad5-b0ea17dbb0f1",
  "bc7e7cd1-f3bc-4820-8e58-f2f757903e58",
  "23be04d5-e106-4a94-a57e-a3a7021e58a2",
  "e94e92eb-ee06-4303-adc4-87a74e81cc40"
];

// Dawson logo
const siteLogo = "2bd65b20-c8cb-413e-81f2-f83043a24b05";

const results = {};

for (const [proj, imgs] of Object.entries(scraped)) {
  const filtered = imgs.filter(url => {
    // Should not contain site logo
    if (url.includes(siteLogo)) return false;
    // Should not contain any of the covers (unless it's the cover of the project itself, which actually might be useful!)
    // Wait, let's check which covers it matches
    for (const c of covers) {
      if (url.includes(c)) {
        return false; // let's filter out all covers for now to find internal page images
      }
    }
    return true;
  });
  
  results[proj] = filtered;
  console.log(`\n--- ${proj} (${filtered.length} unique images) ---`);
  filtered.slice(0, 5).forEach((url, i) => {
    console.log(`  ${i + 1}: ${url}`);
  });
}
