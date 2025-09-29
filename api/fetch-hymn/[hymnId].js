const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async (req, res) => {
  // Vercel dynamic API route: /api/fetch-hymn/[hymnId]
  const { hymnId } = req.query;
  if (!hymnId) return res.status(400).json({ success: false, error: 'Missing hymnId' });
  const parts = hymnId.split('.');
  if (parts.length !== 3) return res.status(400).json({ success: false, error: 'Invalid hymnId format' });
  const apiId = parts[0].padStart(2, '0') + parts[1].padStart(3, '0') + parts[2].padStart(2, '0');
  const url = `https://vedaweb.uni-koeln.de/rigveda/api/document/id/${apiId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    res.json({ success: true, hymn: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
