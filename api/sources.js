const SOURCES = [
  {
    source_name: "PMFBY Official Portal",
    domain: "pmfby.gov.in",
    authority: "Ministry of Agriculture and Farmers Welfare",
    category: "Insurance",
    portal_url: "https://pmfby.gov.in",
    description: "National Crop Insurance Portal for online applications, claim status tracking, premium calculator, and grievance registration."
  },
  {
    source_name: "PM-KISAN Samman Nidhi",
    domain: "pmkisan.gov.in",
    authority: "Department of Agriculture & Farmers Welfare",
    category: "Direct Income",
    portal_url: "https://pmkisan.gov.in",
    description: "Direct Benefit Transfer portal for ₹6,000 annual installment eligibility, beneficiary status check, e-KYC, and registration."
  },
  {
    source_name: "Ministry of Cooperation",
    domain: "cooperation.gov.in",
    authority: "Government of India",
    category: "Cooperatives & PACS",
    portal_url: "https://cooperation.gov.in",
    description: "National cooperative policies, Model PACS By-laws, PACS computerization initiative, and MSCS registry."
  },
  {
    source_name: "myScheme Portal",
    domain: "myscheme.gov.in",
    authority: "National e-Governance Division (NeGD)",
    category: "Schemes Directory",
    portal_url: "https://myscheme.gov.in",
    description: "Government of India single-window platform for discovering eligible central and state agricultural welfare schemes."
  },
  {
    source_name: "Farmer Portal (DAC&FW)",
    domain: "farmer.gov.in",
    authority: "Ministry of Agriculture",
    category: "General Agriculture",
    portal_url: "https://farmer.gov.in",
    description: "Comprehensive agricultural information system on seeds, fertilizers, farm machinery, market prices, and advisories."
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { category } = req.query || {};
  if (category) {
    return res.status(200).json(SOURCES.filter(s => s.category.toLowerCase().includes(category.toLowerCase())));
  }
  return res.status(200).json(SOURCES);
}
