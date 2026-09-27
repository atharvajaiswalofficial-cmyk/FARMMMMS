export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { query = '' } = req.body || {};

  return res.status(200).json({
    query,
    count: 2,
    results: [
      {
        document_title: "PMFBY Revised Operational Guidelines",
        chunk_text: "In case of localized calamities like hailstorm, landslide, inundation, cloud burst, and natural fire, claim intimation must be reported within 72 hours.",
        source_url: "https://pmfby.gov.in",
        score: 0.92
      },
      {
        document_title: "Ministry of Cooperation PACS Directives",
        chunk_text: "Subsidized Neem Coated Urea is distributed at ₹266.50 per 45kg bag through Aadhaar biometric Point-of-Sale authentication.",
        source_url: "https://cooperation.gov.in",
        score: 0.88
      }
    ]
  });
}
