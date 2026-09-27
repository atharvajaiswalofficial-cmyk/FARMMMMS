export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { category = 'Crop Insurance (PMFBY)', description = '' } = req.body || {};

  return res.status(200).json({
    category,
    authority: "District Grievance Redressal Committee / PMFBY State Nodal Officer",
    helpline: "14447",
    resolution_timeline_days: 15,
    recommended_escalation: [
      "1. Register claim intimation on National Crop Insurance Portal (pmfby.gov.in)",
      "2. Submit formal written representation to District Agriculture Officer (DAO)",
      "3. Escalate to Central CPGRAMS Portal (pgportal.gov.in) if unresolved within 15 days"
    ]
  });
}
