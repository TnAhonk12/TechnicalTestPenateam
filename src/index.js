const express = require('express');
const { scrapeEbay } = require('./scraper');
require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();

app.get('/scrape', async (req, res) => {
  const keyword = req.query.q;
  try {
    const data = await scrapeEbay(keyword);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log(`Server aktif di http://localhost:3000`));
