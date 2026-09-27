const SCHEMES = [
  {
    id: 1,
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Crop Insurance",
    user_type: "Individual Farmer",
    state: "All India",
    description: "Comprehensive crop insurance coverage against non-preventable natural risks (drought, flood, hailstorm, pest attack) from pre-sowing to post-harvest.",
    benefits: "Kharif food/oilseeds: max 2% farmer premium; Rabi crops: max 1.5%; Commercial & Horticultural crops: max 5%. Remaining premium paid 50:50 by Central & State Govts.",
    eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
    application_process: "Apply online at pmfby.gov.in, via nearest Bank Branch, PACS, Common Service Centre (CSC), or through the Crop Insurance App.",
    official_url: "https://pmfby.gov.in",
    helpline: "14447",
    target_crops: "Paddy, Wheat, Maize, Cotton, Soybean, Pulses, Oilseeds, Horticultural Crops"
  },
  {
    id: 2,
    name: "PM-KISAN Samman Nidhi Yojana",
    category: "Direct Income Support",
    user_type: "Small & Marginal Farmer",
    state: "All India",
    description: "Income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly transferred into Aadhaar-linked bank accounts (DBT).",
    benefits: "₹6,000 per annum direct cash transfer directly to farmer's Aadhaar-seeded bank account.",
    eligibility: "All landholding farmer families having cultivable land in their names (subject to exclusion criteria).",
    application_process: "Online registration through PM-KISAN Portal (pmkisan.gov.in) with Aadhaar, Land documents, and Bank Account details.",
    official_url: "https://pmkisan.gov.in",
    helpline: "155261 / 011-24300606",
    target_crops: "All Crops"
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC) Scheme",
    category: "Credit & Loans",
    user_type: "Individual Farmer",
    state: "All India",
    description: "Adequate and timely credit support from the banking system for agricultural and allied activities, input purchases, and post-harvest expenses.",
    benefits: "Concessional short-term crop loans up to ₹3 Lakh at 7% normal interest, effectively 4% with prompt repayment 3% subvention.",
    eligibility: "All farmers, individual/joint borrowers, tenant farmers, oral lessees, sharecroppers, and SHGs.",
    application_process: "Submit 1-page simplified application form at nearest Commercial Bank, RRB, or Cooperative Bank/PACS.",
    official_url: "https://myscheme.gov.in/schemes/kcc",
    helpline: "1800-180-1551",
    target_crops: "All Crops"
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    category: "Soil Health & Nutrients",
    user_type: "Individual Farmer",
    state: "All India",
    description: "Provides crop-wise fertilizer recommendations based on scientific soil testing for 12 essential soil parameters.",
    benefits: "Customized soil test report issued every 2 years recommending balanced NPK and micronutrient dosage.",
    eligibility: "All farmers across all States and Union Territories.",
    application_process: "Soil samples collected by local agriculture department extension staff or submit samples at block Soil Testing Lab (STL).",
    official_url: "https://soilhealth.dac.gov.in",
    helpline: "1800-180-1551",
    target_crops: "All Crops"
  },
  {
    id: 5,
    name: "Subsidized Fertilizer Distribution via PACS",
    category: "PACS & Inputs",
    user_type: "PACS Member",
    state: "All India",
    description: "Distribution of essential chemical and bio-fertilizers (Neem Coated Urea, DAP, MOP, NPK) at statutory subsidized maximum retail prices through PACS POS machines.",
    benefits: "Neem Coated Urea available at fixed ₹266.50 per 45kg bag; DAP at ₹1,350 per 50kg bag.",
    eligibility: "All farmers holding valid Aadhaar cards and land ownership records.",
    application_process: "Visit local PACS center with Aadhaar number for biometric POS machine authentication.",
    official_url: "https://cooperation.gov.in",
    helpline: "1800-180-1551",
    target_crops: "All Crops"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { user_type = '', requirement = '', state = '' } = req.body || {};
    let filtered = SCHEMES;
    if (user_type) {
      filtered = filtered.filter(s => s.user_type.toLowerCase().includes(user_type.toLowerCase()) || s.user_type.includes('All'));
    }
    if (requirement) {
      filtered = filtered.filter(s => s.category.toLowerCase().includes(requirement.toLowerCase()) || s.description.toLowerCase().includes(requirement.toLowerCase()));
    }
    return res.status(200).json({ count: filtered.length, results: filtered });
  }

  return res.status(200).json(SCHEMES);
}
