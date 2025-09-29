// Vercel API route for hymn fetch/save
const express = require('express');
const fs = require('fs');
const path = require('path');
let fetch;

const app = express();
app.use(express.json());

function hymnIdToApiId(hymnId) {
  const parts = hymnId.split('.');
  if (parts.length !== 3) throw new Error('Invalid hymnId format');
  return parts[0].padStart(2, '0') + parts[1].padStart(3, '0') + parts[2].padStart(2, '0');
}

app.post('/fetch-hymn/:hymnId', async (req, res) => {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  const hymnId = req.params.hymnId;
  const apiId = hymnIdToApiId(hymnId);
  const url = `https://vedaweb.uni-koeln.de/rigveda/api/document/id/${apiId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    // Save to hymn_json in public folder (one level up from api)
    const outDir = path.join(__dirname, '..', 'public', 'hymn_json');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${hymnId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true, path: outPath });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
