// Node.js script to fetch hymn data from vedaweb.uni-koeln.de and save as JSON
// Usage: node fetch_hymn_json.js 1.1.1

const fs = require('fs');
const path = require('path');
const https = require('https');

function hymnIdToApiId(hymnId) {
  // Convert 1.1.1 to 0100101
  const parts = hymnId.split('.');
  if (parts.length !== 3) throw new Error('Invalid hymnId format');
  return parts.map(p => p.padStart(2, '0')).join('');
}

function fetchHymn(hymnId) {
  const apiId = hymnIdToApiId(hymnId);
  const url = `https://vedaweb.uni-koeln.de/rigveda/api/document/id/${apiId}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject('Failed to parse JSON');
          }
        } else {
          reject(`HTTP ${res.statusCode}: ${data}`);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const hymnId = process.argv[2];
  if (!hymnId) {
    console.error('Usage: node fetch_hymn_json.js <hymnId>');
    process.exit(1);
  }
  try {
    const hymnData = await fetchHymn(hymnId);
    const outPath = path.join(__dirname, 'hymn_json', `${hymnId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(hymnData, null, 2), 'utf8');
    console.log(`Saved hymn data to ${outPath}`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
