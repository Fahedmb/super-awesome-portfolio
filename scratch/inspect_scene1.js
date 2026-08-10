const fs = require('fs');

function inspectHeader(filePath) {
  if (!fs.existsSync(filePath)) return;
  const buf = fs.readFileSync(filePath);
  console.log(`${filePath}: size ${buf.length} bytes`);
}

for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(4, '0');
  inspectHeader(`public/assets/scene_1/${num}.webp`);
}
