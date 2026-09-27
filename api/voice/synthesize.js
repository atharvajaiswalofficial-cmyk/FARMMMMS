export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { text = '', language = 'hi' } = req.body || {};

  // For serverless Vercel edge/node, we instruct frontend to use browser Web Speech Synthesis
  return res.status(200).json({
    status: 'success',
    audio_base64: '',
    audio_url: null,
    fallback: 'browser_tts',
    language
  });
}
