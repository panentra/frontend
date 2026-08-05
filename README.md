# Panentra — Frontend

**Menghubungkan Panen dengan Peluang.** Progressive Web App (PWA) marketplace agrotech & smart farming yang menghubungkan **Petani** dan **Pemasok** untuk transparansi harga, rekomendasi AI, dan pertanian yang lebih menguntungkan.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Maps | Leaflet + react-leaflet |
| PWA | Web App Manifest (`app/manifest.ts`), ikon & favicon brand |

## Fitur

### Petani (`/dashboard`)
- Dashboard ringkasan lahan, musim tanam aktif & progres panen
- Rekomendasi Tanam AI (komoditas, cuaca & tren harga)
- Kalender Tanam / jadwal aktivitas (pupuk, air, panen)
- Prediksi & riwayat harga komoditas (grafik interaktif)
- Catat biaya produksi → hitung **HPP** otomatis
- Jual Hasil Panen ke Marketplace + rekomendasi harga AI
- **Kontrak Panen** — kunci harga & volume sebelum panen
- Chat & negosiasi dengan pemasok

### Pemasok (`/pemasok/dashboard`)
- Pasaran / harga komoditas terkini
- Marketplace hasil panen + detail produk
- Ruang negosiasi & chat dengan petani (dengan polling live)
- **Pembayaran Escrow Safe** — dana dikunci sampai barang diterima
- Lacak pengantaran & konfirmasi penerimaan
- Riwayat pembelian, rating petani, petani langganan (favorit)
- **Kontrak Pasokan** — amankan stok dengan harga tetap
- Manajemen rekening bank & e-wallet

## Struktur Proyek

```
app/
  layout.tsx          # Root layout + mobile shell (max-w 440px)
  manifest.ts         # PWA web manifest
  page.tsx            # Home → route ke onboarding / dashboard sesuai role
  components/         # Semua view & komponen UI
  dashboard/          # Dashboard petani
  pemasok/            # Dashboard pemasok
  login, register, onboarding/...
lib/api.ts            # API client & helper autentikasi (Bearer token)
public/assets/        # Mascot, logo, gambar komoditas
public/icons/         # Ikon PWA & favicon
```

Semua halaman dibungkus **Mobile Viewport Shell** (`max-width: 440px`, terpusat di desktop) dan memakai **Bottom Navigation** floating ala glassmorphism sesuai Design System `DESIGN.md`.

## Setup

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Konfigurasi API

Frontend mengakses REST API Panentra. Base URL diambil dari environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

Tanpa variabel, default menuju `https://senoaji.daffahmad.my.id`.

Autentikasi memakai **Bearer token** (JWT) yang disimpan di `localStorage` setelah login/registrasi.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # start production server
npm run lint     # eslint
```

## Konvensi

- Mobile-first: layout selalu di-wrap shell `max-w-[440px]`, jangan buat desain full-desktop.
- Warna utama interaksi: `#1B5E20` (hijau hutan gelap), aksen amber `#F9A825`, background `#F7F9F7`.
- Kartu memakai sudut tumpul (`rounded-xl` sampai `rounded-3xl`), bottom nav berbentuk pill glassmorphism.
- Ikon dari `lucide-react`, ukuran standar 20–24px.
- Semua dokumen `.md` (workflow, audit) tidak di-version-control — hanya `README.md`.
