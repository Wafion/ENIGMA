export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      status: 'ONLINE',
      platform: 'ENIGMA Digital Documentary Exhibition',
      version: '2.0.0',
      edge: 'Vercel Production Network',
      cases: [
        {
          slug: '001',
          title: 'The Blair Witch Incident',
          status: 'published',
          classification: 'Declassified Archival Record',
        },
        {
          slug: '002',
          title: 'The Mystery of D.B. Cooper (Flight 305)',
          status: 'published',
          classification: 'FBI NORJAK Case File',
        },
      ],
      timestamp: new Date().toISOString(),
    })
  );
}
