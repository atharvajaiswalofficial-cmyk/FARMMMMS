export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    topic: "Cooperative",
    name: "Cooperative Laws & Model Bylaws (MSCS Act 2002/2023)",
    overview: "Guidelines regarding Multi-State Cooperative Societies Act amendments and Model Bylaws for PACS promoting democratic governance, transparency, and cooperative principles.",
    model_bylaws_provisions: [
      "PACS can diversify into 25+ business activities including grain storage, LPG distributorship, and CSC digital services.",
      "Mandatory electronic voting and transparent audit compliance.",
      "Reservation for women and SC/ST members on the Board of Directors."
    ]
  });
}
