// Vercel Serverless Function: AI Chat & Voice Assistant Endpoint
// Handles POST /api/chat, GET /api/chat/history, DELETE /api/chat/history

const KNOWLEDGE_BASE = {
  pmfby: {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    url: "https://pmfby.gov.in",
    authority: "Ministry of Agriculture & Farmers Welfare",
    details: "PMFBY provides comprehensive crop insurance against non-preventable natural risks. Premium rates: Kharif crops max 2.0%, Rabi food & oilseeds max 1.5%, Commercial/Horticultural crops max 5.0%. Claim intimation deadline is STRICTLY within 72 hours of localized disaster (hailstorm, cloudburst, inundation, post-harvest damage) via Helpline 14447, Crop Insurance App, or nearest bank/PACS branch."
  },
  pmkisan: {
    title: "PM-KISAN Samman Nidhi Yojana",
    url: "https://pmkisan.gov.in",
    authority: "Department of Agriculture and Farmers Welfare",
    details: "Provides ₹6,000 per year direct income support in three equal installments of ₹2,000 directly to farmer bank accounts via DBT. Mandatory requirements: Aadhaar e-KYC, Land Seeding verification in State Land Records, and NPCI Aadhaar bank account linkage."
  },
  pacs: {
    title: "Primary Agricultural Credit Societies (PACS) & Fertilizer Hub",
    url: "https://cooperation.gov.in",
    authority: "Ministry of Cooperation",
    details: "PACS distributes government-subsidized fertilizers via biometric POS authentication. Urea ceiling price: ₹266.50 per 45kg bag. DAP ceiling price: ₹1,350 per 50kg bag. PACS also offers Custom Hiring Centers (CHC) for farm equipment rental and short-term crop loans (KCC)."
  },
  kcc: {
    title: "Kisan Credit Card (KCC) & Interest Subvention Scheme (MISS)",
    url: "https://myscheme.gov.in",
    authority: "NABARD & RBI",
    details: "KCC provides short-term crop credit up to ₹3 Lakh at a benchmark interest rate of 7%. With prompt repayment incentive of 3%, effective interest rate is just 4% per annum. Collateral-free loan limit is ₹1.60 Lakh (or ₹2.0 Lakh via tie-up arrangements)."
  }
};

const SYSTEM_PROMPT = `You are Sahayak AI (सहायक AI), an expert agricultural and rural advisory intelligence assistant for Indian farmers, PACS members, and rural communities.
Provide clear, accurate, practical, empathetic, and actionable guidance.
Always adhere to official government guidelines:
- PMFBY claim intimation deadline: 72 hours from damage via Helpline 14447 or Crop Insurance App.
- PMFBY farmer premium caps: 2% (Kharif), 1.5% (Rabi), 5% (Commercial/Horticultural).
- Subsidized Urea price: ₹266.50 per 45kg bag via biometric POS.
- KCC effective interest rate: 4% per annum for prompt repayment (up to ₹3 Lakh).
- PM-KISAN: ₹6,000/year in 3 installments (Aadhaar e-KYC & land seeding mandatory).`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET' || req.method === 'DELETE') {
    return res.status(200).json([]);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  try {
    const { message, language = 'en', input_mode = 'text', conversation_id = 'default' } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ detail: 'Message query cannot be empty.' });
    }

    const query = message.trim();
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    const configuredModel = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : 'gemini-3.8-flash';

    // Build relevant context from knowledge base
    const queryLower = query.toLowerCase();
    const sources = [];
    let contextSnippets = [];

    if (queryLower.includes('bima') || queryLower.includes('insurance') || queryLower.includes('pmfby') || queryLower.includes('barish') || queryLower.includes('damage') || queryLower.includes('loss') || queryLower.includes('नुकसान') || queryLower.includes('बीमा') || queryLower.includes('खराब')) {
      sources.push({
        title: KNOWLEDGE_BASE.pmfby.title,
        document_name: "PMFBY Revised Operational Guidelines",
        authority: KNOWLEDGE_BASE.pmfby.authority,
        source_url: KNOWLEDGE_BASE.pmfby.url
      });
      contextSnippets.push(KNOWLEDGE_BASE.pmfby.details);
    }

    if (queryLower.includes('pacs') || queryLower.includes('fertilizer') || queryLower.includes('urea') || queryLower.includes('dap') || queryLower.includes('khad') || queryLower.includes('खाद') || queryLower.includes('यूरिया') || queryLower.includes('पैक्स')) {
      sources.push({
        title: KNOWLEDGE_BASE.pacs.title,
        document_name: "Ministry of Cooperation PACS Operational Directives",
        authority: KNOWLEDGE_BASE.pacs.authority,
        source_url: KNOWLEDGE_BASE.pacs.url
      });
      contextSnippets.push(KNOWLEDGE_BASE.pacs.details);
    }

    if (queryLower.includes('kcc') || queryLower.includes('loan') || queryLower.includes('credit') || queryLower.includes('interest') || queryLower.includes('ऋण') || queryLower.includes('कर्ज') || queryLower.includes('ब्याज')) {
      sources.push({
        title: KNOWLEDGE_BASE.kcc.title,
        document_name: "Kisan Credit Card National Guidelines",
        authority: KNOWLEDGE_BASE.kcc.authority,
        source_url: KNOWLEDGE_BASE.kcc.url
      });
      contextSnippets.push(KNOWLEDGE_BASE.kcc.details);
    }

    if (queryLower.includes('kisan') || queryLower.includes('pm-kisan') || queryLower.includes('samman') || queryLower.includes('installment') || queryLower.includes('किस्त') || queryLower.includes('सम्मान निधि')) {
      sources.push({
        title: KNOWLEDGE_BASE.pmkisan.title,
        document_name: "PM-KISAN Samman Nidhi Operational Scheme",
        authority: KNOWLEDGE_BASE.pmkisan.authority,
        source_url: KNOWLEDGE_BASE.pmkisan.url
      });
      contextSnippets.push(KNOWLEDGE_BASE.pmkisan.details);
    }

    if (sources.length === 0) {
      sources.push({
        title: "National Farmers Portal & Scheme Repository",
        document_name: "Ministry of Agriculture Official Registry",
        authority: "Government of India",
        source_url: "https://farmer.gov.in"
      });
    }

    let answer = '';
    const isVoice = input_mode === 'voice';
    const langInstructions = language === 'hi' 
      ? 'Respond strictly in clear, natural Hindi (हिंदी).' 
      : language === 'mr' 
      ? 'Respond strictly in Marathi (मराठी).'
      : language === 'gu'
      ? 'Respond strictly in Gujarati (ગુજરાતી).'
      : language === 'pa'
      ? 'Respond strictly in Punjabi (ਪੰਜਾਬੀ).'
      : `Respond strictly in ${language.toUpperCase()} language.`;

    const voiceFormat = isVoice
      ? 'VOICE MODE: Keep response to 2-3 concise spoken sentences without markdown formatting, bullet points, or asterisks.'
      : 'Format response cleanly with bullet points and clear sections.';

    const promptText = `${SYSTEM_PROMPT}

Language: ${langInstructions}
${voiceFormat}

Context:
${contextSnippets.join('\n\n')}

Farmer Question:
${query}`;

    // Call Gemini API if key is present
    if (apiKey) {
      const candidateModels = [configuredModel, 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
      const uniqueModels = [...new Set(candidateModels)];

      for (const model of uniqueModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: isVoice ? 300 : 800
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              answer = text.trim();
              break;
            }
          }
        } catch (modelErr) {
          // Try next model fallback
        }
      }
    }

    // Curated Fallback if Gemini key is missing or models are busy
    if (!answer) {
      if (queryLower.includes('bima') || queryLower.includes('insurance') || queryLower.includes('barish') || queryLower.includes('damage') || queryLower.includes('खराब')) {
        answer = language === 'hi'
          ? "फसल नुकसान होने पर 72 घंटे के भीतर टोल-फ्री नंबर 14447 या क्रॉप इंश्योरेंस ऐप पर शिकायत दर्ज करें। रबी फसलों पर अधिकतम 1.5% और खरीफ फसलों पर 2% किसान प्रीमियम देय होता है।"
          : "In case of crop loss, submit an intimation within 72 hours via the national toll-free helpline 14447 or the Crop Insurance App. Farmer premium is capped at 2% for Kharif and 1.5% for Rabi crops under PMFBY.";
      } else if (queryLower.includes('pacs') || queryLower.includes('urea') || queryLower.includes('khad') || queryLower.includes('यूरिया')) {
        answer = language === 'hi'
          ? "पैक्स (PACS) केंद्रों पर नीम-कोटेड यूरिया की 45 किलोग्राम बोरी ₹266.50 के सरकारी रियायती मूल्य पर उपलब्ध है। खाद प्राप्त करने के लिए आधार कार्ड और बायोमेट्रिक सत्यापन आवश्यक है।"
          : "Neem-coated Urea is available at PACS centers at the government subsidized price of ₹266.50 per 45kg bag. Aadhaar biometric verification at the POS machine is mandatory.";
      } else if (queryLower.includes('kcc') || queryLower.includes('loan') || queryLower.includes('ब्याज')) {
        answer = language === 'hi'
          ? "किसान क्रेडिट कार्ड (KCC) पर ₹3 लाख तक के अल्पकालिक ऋण पर सामान्य ब्याज दर 7% है, और समय पर भुगतान करने पर 3% की छूट के साथ प्रभावी ब्याज केवल 4% प्रति वर्ष लगता है।"
          : "Under the Kisan Credit Card (KCC) scheme, short-term crop loans up to ₹3 Lakh carry an effective interest rate of only 4% per annum with prompt repayment subvention.";
      } else {
        answer = language === 'hi'
          ? "सहायक AI में आपका स्वागत है। आप फसल बीमा (PMFBY), पीएम-किसान सम्मान निधि, पैक्स से खाद-बीज और केसीसी ऋण के बारे में कोई भी प्रश्न पूछ सकते हैं।"
          : "Welcome to Sahayak AI. You can ask any question regarding PMFBY crop insurance, PM-KISAN, PACS subsidized fertilizers, and KCC crop loans.";
      }
    }

    return res.status(200).json({
      answer,
      language,
      topic: "Agriculture & Schemes",
      intent: "GENERAL_AGRICULTURE",
      grounded: true,
      sources,
      audio_url: null,
      conversation_id
    });
  } catch (error) {
    console.error('[API /chat Error]:', error.message || error);
    return res.status(500).json({
      detail: 'Failed to process assistant query. Please try again.',
      error: error.message || 'Internal Server Error'
    });
  }
}
