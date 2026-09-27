export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { identifier = '' } = req.body || {};
  return res.status(200).json({
    status: 'success',
    message: `OTP sent successfully to ${identifier || 'registered contact'}.`,
    demo_otp: '123456',
    cooldown_seconds: 60
  });
}
