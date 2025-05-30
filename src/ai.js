const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });


async function extractWithAI(html) {
  const prompt = `
Berikut ini adalah HTML dari halaman produk eBay. Tolong ekstrak informasi berikut:
- Nama produk
- Harga produk
- Deskripsi produk

Jika tidak ditemukan, isikan dengan '-'.

HTML:
${html.slice(0, 12000)}
`;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('Deepseek error:', err.message);
    return '-';
  }
}

module.exports = { extractWithAI };
