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
    // Return the hymn JSON directly
    res.json({ success: true, hymn: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = (req, res) => app(req, res);
