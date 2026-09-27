export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    topic: "Financial",
    name: "Rural Financial Literacy, Credit & Banking",
    overview: "Comprehensive guide to agricultural credit, Kisan Credit Cards, interest subvention, digital payments via UPI, and micro-insurance.",
    kcc_guidelines: {
      interest_rate_normal: "7.0% per annum",
      prompt_repayment_subvention: "3.0%",
      effective_interest_rate: "4.0% per annum",
      collateral_free_limit: "₹1.60 Lakh"
    },
    safety_guidelines: [
      "Never share OTP or PIN with anyone claiming to be a bank official.",
      "Check SMS alerts immediately after withdrawing cash from PACS POS machines.",
      "Always take a printed receipt for fertilizer purchases and loan disbursements."
    ]
  });
}
