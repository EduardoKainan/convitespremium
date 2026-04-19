const fs = require('fs');
const image = fs.readFileSync('public/qr-pix.jpg');
const base64Image = Buffer.from(image).toString('base64');
console.log(`data:image/jpeg;base64,${base64Image.substring(0, 100)}...`);
fs.writeFileSync('src/qr-base64.txt', `data:image/jpeg;base64,${base64Image}`);
