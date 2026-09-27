export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const {
    category = 'PMFBY Crop Loss',
    farmer_name = 'Ramesh Kumar Patel',
    phone = '9876543210',
    state = 'Madhya Pradesh',
    district = 'Hoshangabad',
    village = 'Rasulia',
    subject = 'Delay in Crop Insurance Claim Settlement',
    description = 'Crop damage caused by unseasonal rains has not been inspected within the statutory timeline.',
    language = 'en'
  } = req.body || {};

  const isHindi = language === 'hi';
  const draftDate = new Date().toLocaleDateString('en-IN');

  const draftText = isHindi
    ? `सेवा में,
जिला कृषि अधिकारी / नोडल अधिकारी (PMFBY),
जिला: ${district}, ${state}

विषय: ${subject}

महोदय,
सादर निवेदन है कि मैं, ${farmer_name}, ग्राम: ${village}, जिला: ${district} का निवासी हूँ।
विवरण: ${description}

अतः आपसे विनम्र निवेदन है कि इस विषय की निष्पक्ष जांच कराकर उचित समाधान करने की कृपा करें।

प्रार्थी:
नाम: ${farmer_name}
मोबाइल: ${phone}
दिनांक: ${draftDate}`
    : `To,
The District Agriculture Officer / Nodal Officer,
Department of Agriculture & Farmers Welfare,
District: ${district}, ${state}

Subject: ${subject}

Respected Sir/Madam,
I, ${farmer_name}, resident of Village: ${village}, District: ${district}, submit this formal grievance:
${description}

I kindly request your prompt intervention to resolve this matter as per government guidelines.

Sincerely,
${farmer_name}
Mobile: ${phone}
Date: ${draftDate}`;

  return res.status(200).json({
    draft: draftText,
    subject,
    recipient: "District Agriculture Officer",
    category
  });
}
