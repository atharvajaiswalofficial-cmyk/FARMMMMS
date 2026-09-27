export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    topic: "PMFBY",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    overview: "PMFBY is an actuarial premium based scheme where farmer pays very nominal premium and the balance premium is shared equally by the Central and State Governments.",
    premium_rates: {
      Kharif: "2.0% of Sum Insured or actuarial rate, whichever is less",
      Rabi: "1.5% of Sum Insured or actuarial rate, whichever is less",
      Commercial_Horticultural: "5.0% of Sum Insured or actuarial rate, whichever is less"
    },
    claim_intimation_deadline: "72 hours from the occurrence of localized disaster or post-harvest loss.",
    intimation_channels: [
      "Crop Insurance National Toll-Free Helpline: 14447",
      "Crop Insurance App (Farmer App on Google Play)",
      "Nearest Bank Branch / PACS where premium was debited",
      "District Agriculture Officer / Local Insurance Company Representative"
    ],
    required_documents: [
      "Aadhaar Card copy",
      "Land ownership document (Khasra/Khatauni / Land Possession Certificate)",
      "Sowing Certificate / Declaration verified by Patwari / Extension Worker",
      "Cancelled Bank Cheque / Passbook copy with clear IFSC code"
    ]
  });
}
