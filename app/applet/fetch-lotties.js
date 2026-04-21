const https = require('https');
const fs = require('fs');
const path = require('path');

const fetchJson = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, data);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function run() {
  const flowerUrl = 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/flower.json';
  const waterColorUrl = 'https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/lotties/water-melon.json'; 
  
  // Let's try grabbing some known json files. 
  // We can just query github api for something if we want.
}

run();
