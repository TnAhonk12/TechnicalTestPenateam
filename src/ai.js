const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });

async function extractWithAI(html) {
  const prompt = `
Berikut adalah HTML dari halaman produk eBay.
Tolong ekstrak informasi berikut:
- Nama Produk
- Harga Produk
- Deskripsi Produk

Balas dalam format:

Nama Produk: ...
Harga Produk: ...
Deskripsi Produk: ...

Jika tidak tersedia, isi dengan "-".

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
        timeout: 10000,
      }
    );

    const result = response.data.choices[0].message.content.trim();
    if (result.includes('Deskripsi Produk:')) {
      return result;
    } else {
      throw new Error('AI tidak mengembalikan format yang benar');
    }
  } catch (err) {
    console.warn('Deepseek error: ', err.message);

    // Manual fallback: cari deskripsi langsung dari HTML
    const match = html.match(/<div[^>]*itemprop="description"[^>]*>(.*?)<\/div>/is);
    if (match) {
      const rawText = match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `Deskripsi Produk: ${rawText}`;
    }
    return 'Deskripsi Produk: -';
  }
}

module.exports = { extractWithAI };
