# 📋 Laporan Integrasi API Dashboard Pemasok

> Referensi: `Dokumentasi_API_Supplier_Dashboard (1).md` (14 endpoint)
> Base URL test: `https://senoaji.daffahmad.my.id`
> Tanggal test: 5 Agustus 2026

---

## 1️⃣ Status Integrasi per Fitur

### ✅ Fitur yang SUDAH Ada API & SUDAH Terintegrasi

| # | Fitur | Endpoint API | Metode | Status Integrasi |
|---|-------|-------------|--------|------------------|
| 1 | Dashboard Beranda (stats hero) | `/api/supplier/dashboard` | `GET` | ✅ Terintegrasi |
| 2 | Marketplace (Pasar Hasil Panen) | `/api/supplier/marketplace` | `GET` | ✅ Terintegrasi + filter `q`, `category`, `grade`, `nego`, `sort` |
| 3 | Detail Hasil Panen | `/api/supplier/listings/{id}` | `GET` | ✅ Terintegrasi (refresh saat dibuka) |
| 4 | Tombol Beli di Detail | `/api/supplier/orders` + `/api/supplier/orders/{id}/pay` | `POST` + `PATCH` | ✅ Terintegrasi (langsung ke layar pembayaran) |
| 5 | Pembayaran Escrow Safe | `/api/supplier/orders` + `.../{id}/pay` | `POST` + `PATCH` | ✅ Terintegrasi |
| 6 | Riwayat Pembelian Pasokan | `/api/supplier/orders` | `GET` | ✅ Terintegrasi |
| 7 | Konfirmasi Barang Diterima | `/api/supplier/orders/{id}/confirm-received` | `PATCH` | ✅ Terintegrasi + penanganan error 422 |
| 8 | Lacak Pengantaran | `/api/supplier/deliveries` | `GET` | ✅ Terintegrasi |
| 9 | Ruang Nego & Chat | `/api/supplier/chats/from-listing`, `/api/chats`, `/api/chats/{id}/messages` | `POST` + `GET` | ✅ Terintegrasi (baru) |
| 10 | Favorit (tombol ❤️ detail) | `/api/supplier/favorites/{sellerId}` | `POST`/`DELETE` | ✅ Terintegrasi (baru) |
| 11 | Petani Langganan (tab Akun) | `/api/supplier/favorites` | `GET` | ✅ Terintegrasi (baru) |
| 12 | Pasar Harga (tab Pasaran) | `/api/prices` (fallback `/api/shared/market-prices`) | `GET` | ✅ Terintegrasi (baru) |
| 13 | Kelola Rekening Bank (tab Akun) | `/api/bank-accounts` (CRUD + primary) | `GET`/`POST`/`DELETE`/`PATCH` | ✅ Terintegrasi (baru) |

### 🟡 Fitur yang SUDAH Ada API TAPI Belum Terintegrasi

| Fitur | Endpoint | Catatan |
|-------|----------|---------|
| Kirim pesan chat (dari UI) | `POST /api/chats/{id}/messages` | API sudah dipakai untuk kirim pesan/offer ✅ *(sebenarnya sudah terintegrasi via RuangNego)* |
| Beli Lagi di Riwayat | - | Tombol masih navigate ke marketplace, tidak buat ulang pesanan otomatis via API |

### ❌ Fitur yang TIDAK Ada API (tetap mock/placeholder)

| Fitur | Lokasi | Keterangan |
|-------|--------|-----------|
| Insight AI Panentra Hari Ini | Beranda | Statis, tidak ada endpoint AI |
| Rekap Keuangan Pembelian | Akun | Hanya `alert()`, tidak ada endpoint supplier |
| Unduh Laporan Pembelian (PDF) | Akun | Hanya `alert()`, tidak ada endpoint |
| Unduh Invoice (PDF) | Riwayat | Endpoint invoice hanya ada untuk sisi **petani** (`/api/farmer/orders/{id}/invoice`) |
| Rating & Review petani | Riwayat | Form ada, tidak ada endpoint supplier untuk submit review |
| Pusat Bantuan & Support AI 24/7 | Akun | Hanya `alert()` |
| Rekapitulasi transaksi "48 Pasokan Selesai", "Rp 24.500.000" | Akun | Angka statis, tidak ada endpoint metrik keuangan supplier |

---

## 2️⃣ Perbaikan Kode yang Dilakukan

- **`lib/api.ts`**
  - `addFavorite(sellerId)` → `POST /api/supplier/favorites/{sellerId}` (sebelumnya body ke `/favorites`)
  - `startNegotiation()` → `POST /api/supplier/chats/from-listing` (sebelumnya `/negotiations/start`)
  - `getSupplierDashboard()` di-typing + tambah field `monthly_spend`, `monthly_kg`
  - `getMarketplace`/`getListingDetail`/`getSupplierOrders`/`getSupplierDeliveries` pakai typed response (bukan `Record`)
- **`RuangNegoPemasokView.tsx`** — mock chat diganti API: list chat dari `/api/chats`, buka room via `from-listing`, riwayat via `/api/chats/{id}/messages`, kirim pesan & offer via `POST /api/chats/{id}/messages`
- **`DetailProdukPemasokView.tsx`** — tombol ❤️ sinkron `getFavorites` + `addFavorite`/`removeFavorite`
- **`AkunPemasokView.tsx`** — daftar favorit dari `getFavorites`; rekening bank dari `getBankAccounts` + CRUD API
- **`PasarHargaPemasokView.tsx`** — harga pasar dari `getMarketPrices` (fallback `/api/prices`)

---

## 3️⃣ Laporan Pengujian API (Live Test)

Akun uji: `pemasok` baru (register via `/api/register`). Semua request memakai `Authorization: Bearer <token>`.

### 3.1 Cek Ketersediaan Endpoint

| Endpoint | Tanpa Token | Dengan Token |
|----------|:-----------:|:------------:|
| `GET /api/supplier/dashboard` | 401 | ✅ 200 |
| `GET /api/supplier/marketplace` | 401 | ✅ 200 |
| `GET /api/supplier/listings/1` | 401 | ✅ 200 |
| `GET /api/supplier/orders` | 401 | ✅ 200 |
| `GET /api/supplier/deliveries` | 401 | ✅ 200 |
| `GET /api/supplier/favorites` | 401 | ✅ 200 |
| `POST /api/supplier/favorites/{id}` | - | ✅ 201 |
| `DELETE /api/supplier/favorites/{id}` | - | ✅ 200 |
| `POST /api/supplier/chats/from-listing` | - | ✅ 201 (data) |
| `GET /api/chats` | 401 | ✅ 200 |
| `GET /api/chats/{id}/messages` | 401 | ✅ 200 |
| `POST /api/chats/{id}/messages` | - | ✅ 200 |
| `GET /api/prices` (fallback) | 401 | ✅ 200 |
| `GET /api/bank-accounts` (fallback) | 401 | ✅ 200 |

### 3.2 Tes Alur Bisnis (End-to-End)

| Langkah | Request | Hasil |
|---------|---------|-------|
| Buat pesanan | `POST /api/supplier/orders` | ✅ `status: incoming`, order no `TRX-52332` |
| Bayar escrow | `PATCH /api/supplier/orders/8/pay` | ✅ `status: paid_escrow`, `escrowStatus: held` |
| Konfirmasi prematur | `PATCH /api/supplier/orders/8/confirm-received` | ✅ HTTP 422 `"Order cannot be confirmed yet."` (sesuai dokumen) |
| Mulai negosiasi | `POST /api/supplier/chats/from-listing` | ✅ balas `conversation_id: 5` |
| List chat | `GET /api/chats` | ✅ chat id 5, `listing_id: 1` |
| Ambil pesan | `GET /api/chats/5/messages` | ✅ 1 pesan offer `Rp 35.000/kg` |
| Kirim pesan | `POST /api/chats/5/messages` | ✅ pesan tersimpan |
| Filter marketplace | `?q=cabai`, `?nego=1`, `?sort=price_desc`, `?grade=...&category=...` | ✅ semua filter bekerja |

### 3.3 Temuan & Catatan Penting

1. **`/api/shared/market-prices` & `/api/shared/bank-accounts` → HTTP 404** di server ini. Endpoint yang valid: `/api/prices` dan `/api/bank-accounts`. Kode sudah memakai fallback otomatis.
2. **Respons `from-listing`** menaruh ID room chat di field `conversation_id` (bukan `id` — `id` itu ID pesan). Kode sudah disesuaikan.
3. **Dashboard** mengirim `monthly_spend` & `monthly_kg` — dipakai langsung untuk hero card.
4. **Confirm-received** akan gagal (422) selama status belum `paid_escrow` + driver pengiriman belum siap. UI sudah menampilkan pesan error 422.
5. **`GET /api/supplier/orders`** = riwayat pembelian (dipakai di Riwayat) — endpoint `/api/supplier/purchases` (versi lama) **tidak ada**.

---

## 4️⃣ Kesimpulan

- **13 fitur** dashboard pemasok sudah terintegrasi API (termasuk 6 endpoint baru dari dokumen: favorites, start-negotiation, chats).
- **7+ fitur** masih placeholder karena **tidak ada endpoint** (Insight AI, rekap keuangan, laporan PDF, rating/review, pusat bantuan).
- Build: ✅ lulus (`next build`), TypeScript: ✅ 0 error, ESLint: 29 error (sama dengan baseline proyek, tidak ada regresi).
- Semua 14 endpoint di dokumen sudah **diverifikasi live** dengan token asli.
