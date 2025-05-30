const puppeteer = require('puppeteer');
const { extractWithAI } = require('./ai');

async function scrapeEbay(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let currentPage = 1;
  const results = [];

  while (true) {
    await page.goto(
      `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${query}&_sacat=0&rt=nc&_pgn=${currentPage}`,
      { waitUntil: 'domcontentloaded', timeout: 0 }
    );

    // Ambil hanya produk dengan URL yang valid
    const items = await page.$$eval('.s-item', (nodes) =>
      nodes
        .map((node) => {
          const link = node.querySelector('.s-item__link')?.href || '-';
          return {
            title: node.querySelector('.s-item__title')?.innerText || '-',
            price: node.querySelector('.s-item__price')?.innerText || '-',
            url: link.includes('/itm/') ? link : '-',
          };
        })
        .filter((item) => item.url !== '-')
    );

    if (items.length === 0) break;

    // Batasi untuk mempercepat testing
    const limitedItems = items.slice(0, 10); // bisa kamu naikin ke 10–20 untuk real run

    for (const item of limitedItems) {
      try {
        const detailPage = await browser.newPage();
        await detailPage.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 0 });
        await detailPage.waitForSelector('h1', { timeout: 5000 });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const html = await detailPage.content();
        const aiResult = await extractWithAI(html);

        const title = aiResult.match(/Nama Produk: (.+)/i)?.[1]?.trim() || item.title || '-';
        const price = aiResult.match(/Harga Produk: (.+)/i)?.[1]?.trim() || item.price || '-';
        const desc = aiResult.match(/Deskripsi Produk: ([\s\S]+)/i)?.[1]?.trim() || '-';

        results.push({ title, price, url: item.url, description: desc });
        await detailPage.close();
      } catch (err) {
        console.warn(`Gagal scrape detail: ${item.url}`);
        console.warn(`Error: ${err.message}`);
        results.push({ ...item, description: '-' });
      }
    }

    currentPage++;
    // Optional: Stop di halaman 2 saat testing
    if (currentPage > 2) break;
  }

  await browser.close();
  return results;
}

module.exports = { scrapeEbay };
