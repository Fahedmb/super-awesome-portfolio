const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`MISSING: ${filePath}`);
    return;
  }
  const stats = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  const isRiff = buf.slice(0, 4).toString() === 'RIFF';
  const isWebp = buf.slice(8, 12).toString() === 'WEBP';
  console.log(`${path.basename(filePath)} | Size: ${stats.size} bytes | Valid WebP Header: ${isRiff && isWebp}`);
}

console.log("Checking Scene 1 frames:");
checkFile('public/assets/scene_1/0001.webp');
checkFile('public/assets/scene_1/0010.webp');
checkFile('public/assets/scene_1/0050.webp');
checkFile('public/assets/scene_1/0100.webp');
checkFile('public/assets/scene_1/0220.webp');

console.log("\nChecking Scene 2 frames:");
checkFile('public/assets/scene_2/0001.webp');
checkFile('public/assets/scene_2/0100.webp');
checkFile('public/assets/scene_2/0186.webp');

console.log("\nChecking Scene 3 frames:");
checkFile('public/assets/scene_3/0001.webp');
checkFile('public/assets/scene_3/0100.webp');
checkFile('public/assets/scene_3/0191.webp');
