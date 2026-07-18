const fs = require('fs');
const path = require('path');

try {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // ແທນທີ່ Placeholders ດ້ວຍຄ່າແທ້ຈາກ Vercel Environment Variables
  html = html.replace(/__GOOGLE_MAPS_KEY__/g, process.env.GOOGLE_MAPS_KEY || '');
  html = html.replace(/__FIREBASE_API_KEY__/g, process.env.FIREBASE_API_KEY || '');
  html = html.replace(/__FIREBASE_AUTH_DOMAIN__/g, process.env.FIREBASE_AUTH_DOMAIN || '');
  html = html.replace(/__FIREBASE_PROJECT_ID__/g, process.env.FIREBASE_PROJECT_ID || '');
  html = html.replace(/__FIREBASE_STORAGE_BUCKET__/g, process.env.FIREBASE_STORAGE_BUCKET || '');
  html = html.replace(/__FIREBASE_MESSAGING_SENDER_ID__/g, process.env.FIREBASE_MESSAGING_SENDER_ID || '');
  html = html.replace(/__FIREBASE_APP_ID__/g, process.env.FIREBASE_APP_ID || '');
  html = html.replace(/__FIREBASE_MEASUREMENT_ID__/g, process.env.FIREBASE_MEASUREMENT_ID || '');

  fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  console.log('ແທນທີ່ API Keys ແລະ Config ສຳເລັດຮຽບຮ້ອຍແລ້ວ!');
} catch (err) {
  console.error('ການ Build ຜິດພາດ:', err);
  process.exit(1);
}
