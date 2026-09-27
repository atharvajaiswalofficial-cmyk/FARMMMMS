let profile = {
  id: 1,
  name: "Ramesh Kumar Patel",
  phone: "9876543210",
  email: "ramesh.patel@farmer.in",
  role: "farmer",
  state: "Madhya Pradesh",
  district: "Hoshangabad",
  pacs_id: "MP-HOS-042",
  landholding_acres: 3.5,
  primary_crops: "Wheat, Soybean, Gram",
  preferred_language: "hi",
  occupation: "Small & Marginal Farmer",
  category: "OBC"
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'PUT') {
    profile = { ...profile, ...(req.body || {}) };
    return res.status(200).json(profile);
  }

  return res.status(200).json(profile);
}
