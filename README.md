# Technical Test Penateam

API ini digunakan untuk melakukan scraping produk dari halaman eBay dan mengekstrak informasi penting menggunakan AI (Deepseek).

## Fitur

- Scrape daftar produk dari hasil pencarian eBay berdasarkan keyword.
- Kunjungi halaman detail setiap produk untuk mengambil deskripsi.
- Gunakan AI (Deepseek) untuk mengekstrak:
  - Nama produk
  - Harga produk
  - Deskripsi produk
- Navigasi otomatis ke semua halaman (pagination).
- Hasil dikembalikan dalam format JSON.

## Teknologi

- **Node.js** & **Express** – Backend API
- **Puppeteer** – Web scraper (headless browser)
- **Deepseek API** – AI untuk ekstraksi data
- **Dotenv** – Manajemen API key

## Instalasi & Menjalankan

### 1. Clone project:
```bash
git clone https://github.com/TnAhonk12/TechnicalTestPenateam.git
cd TechnicalTestPenateam
```

### 2. Install dependency:
```bash
npm install
```

### 3. Jalankan server:
```bash
npm run dev
```

## Endpoint

### `GET /scrape?q=KEYWORD`

 **Query Parameter:**
- `q` → keyword pencarian (contoh: `nike`, `puma one piece`, dll)

 **Response JSON:**
```json
[
  {
    "title": "Nama Produk",
    "price": "Harga Produk",
    "url": "Link Produk",
    "description": "Deskripsi dari halaman detail"
  }
]
```

Jika informasi tidak tersedia, maka akan diisi dengan `"-"`.

## Error Handling

Jika kamu melihat error berikut saat scraping:

```
Deepseek error: Request failed with status code 402
```

Itu berarti **kuota pemakaian API Deepseek kamu telah habis** atau **belum aktifkan billing/akses premium**.

## Catatan Teknis

- Semua deskripsi diambil dari **halaman detail produk** menggunakan AI, bukan dari halaman pencarian.
- Jika AI gagal mengekstrak data, sistem akan memberikan fallback `"-"`.
- Pembatasan produk per halaman dapat diatur dengan `slice()` untuk testing cepat.

## Contoh Jalankan

```
http://localhost:3000/scrape?q=nike
```
