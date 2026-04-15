const fs = require('fs');

const logPath = '/.gemini/antigravity/brain/8a4f6d82-355c-417d-8a0a-ef73e28d16ff/.system_generated/logs/overview.txt';
const logContent = fs.readFileSync(logPath, 'utf8');

const files = [];
let currentIndex = 0;

while (true) {
  const startIndex = logContent.indexOf('<!DOCTYPE html>', currentIndex);
  if (startIndex === -1) break;
  
  const endIndex = logContent.indexOf('</html>', startIndex);
  if (endIndex === -1) break;
  
  files.push(logContent.substring(startIndex, endIndex + 7));
  currentIndex = endIndex + 7;
}

console.log('Found ' + files.length + ' HTML files');

if (files.length >= 4) {
  fs.writeFileSync('/app/applet/public/tests/16pf.html', files[0]);
  fs.writeFileSync('/app/applet/public/tests/cleaver.html', files[1]);
  fs.writeFileSync('/app/applet/public/tests/integra.html', files[2]);
  fs.writeFileSync('/app/applet/public/tests/moss.html', files[3]);
  console.log('Files written successfully');
}
