export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { identifier = '', otp = '' } = req.body || {};

  return res.status(200).json({
    status: 'success',
    access_token: 'sahayak-demo-auth-token-vercel-2026',
    token_type: 'bearer',
    user: {
      id: 1,
      name: 'Ramesh Kumar Patel',
      phone: identifier.includes('@') ? '9876543210' : identifier,
      email: identifier.includes('@') ? identifier : 'ramesh.patel@farmer.in',
      role: 'farmer',
      state: 'Madhya Pradesh',
      district: 'Hoshangabad',
      pacs_id: 'MP-HOS-042',
      landholding_acres: 3.5,
      primary_crops: 'Wheat, Soybean, Gram',
      preferred_language: 'hi',
      occupation: 'Small & Marginal Farmer'
    }
  });
}
