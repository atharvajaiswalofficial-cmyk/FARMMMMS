export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    topic: "PACS",
    name: "Primary Agricultural Credit Societies (PACS) Hub & Services",
    overview: "PACS are village-level cooperative credit societies providing subsidized inputs (fertilizers, certified seeds), farm machinery hiring, and short-term crop loans to small and marginal farmers.",
    services: [
      {
        name: "Subsidized Fertilizer Distribution",
        description: "Distribution of Urea (₹266.50/45kg bag) and DAP (₹1,350/50kg bag) with Aadhaar biometric POS authentication."
      },
      {
        name: "Short-Term Crop Loans (KCC)",
        description: "Concessional loans at 7% normal interest, effectively 4% with prompt repayment subvention."
      },
      {
        name: "Custom Hiring Centers (CHC)",
        description: "Tractors, rotavators, and sprayers rented out to small farmers at nominal hourly rates."
      }
    ],
    fertilizer_rules: {
      urea_price_per_bag: "₹266.50 per 45kg bag",
      dap_price_per_bag: "₹1,350.00 per 50kg bag",
      verification_mode: "Aadhaar authentication via POS machine mandatory",
      hoarding_helpline: "1800-180-1551"
    }
  });
}
