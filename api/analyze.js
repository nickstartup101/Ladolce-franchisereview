export default async function handler(req, res) {
  // ອະນຸຍາດໃຫ້ເອີ້ນໃຊ້ສະເພาະ Method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lng, cafeCount } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'ກະລຸນາຕັ້ງຄ່າ GEMINI_API_KEY ໃນ Vercel Environment Variables ກ່ອນ' });
  }

  // ກຳນົດຄຳສັ່ງ (Prompt) ໃຫ້ຄຳນວນ ແລະ ຕອບກັບເປັນ JSON ທີ່ລະອຽດ
  const prompt = `ວິເຄາະທຳເລເປີດຮ້ານກາເຟ La Dolce ທີ່ພິກັດ ເສັ້ນຂະໜານ (Latitude): ${lat}, ເສັ້ນແວງ (Longitude): ${lng}.
ປັດຈຸບັນມີຮ້ານກາເຟຄູ່ແຂ່ງອ້ອມຂ້າງໃນລັດສະໝີ 500 ແມັດ ຈຳນວນ: ${cafeCount}.
ຈົ່ງປະເມີນ ແລະ ສົ່ງຄຳຕອບກັບມາເປັນ JSON ຟໍແມັດ ຫ້າມມີຕົວອັກສອນອື່ນປົນ ໂດຍໃຫ້ມີໂຄງສ້າງດັ່ງນີ້:
{
  "overallScore": 86,
  "status": "recommended", 
  "summary": "ຂຽນບົດວິເຄາະສະຫຼຸບເປັນພາສາລາວ ຍາວປະມານ 3-4 ແຖວ",
  "tags": ["📍 ຕົວເມືອງ", "☕ ເໝາະສຳລັບກາເຟ", "🚗 ເຂົ້າ-ອອກງ່າຍ"],
  "recommendations": [
    "ຂໍ້ແນະນຳຂໍ້ທີ 1 ເປັນພາສາລາວ",
    "ຂໍ້ແນະນຳຂໍ້ທີ 2 ເປັນພາສາລາວ",
    "ຂໍ້ແນະນຳຂໍ້ທີ 3 ເປັນພາສາລາວ",
    "ຂໍ້ແນະນຳຂໍ້ທີ 4 ເປັນພາສາລາວ",
    "ຂໍ້ແນະນຳຂໍ້ທີ 5 ເປັນພາສາລາວ"
  ],
  "notes": [
    "ບັນທຶກຂໍ້ສັງເກດຂໍ້ທີ 1 ເປັນພາສາລາວ",
    "ບັນທຶກຂໍ້ສັງເກດຂໍ້ທີ 2 ເປັນພາສາລາວ",
    "ບັນທຶກຂໍ້ສັງເກດຂໍ້ທີ 3 ເປັນພາສາລາວ"
  ],
  "kpi": {
    "customer": {"score": 18, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "access": {"score": 13, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "competition": {"score": 7, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "parking": {"score": 8, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "facilities": {"score": 8, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "rental": {"score": 9, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "growth": {"score": 15, "comment": "ຄວາມເຫັນພາສາລາວ"},
    "safety": {"score": 9, "comment": "ຄວາມເຫັນພາສາລາວ"}
  }
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API Error' });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const resultJson = JSON.parse(aiText);
    return res.status(200).json(resultJson);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນຂອງ Server: ' + error.message });
  }
}
