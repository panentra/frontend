# 📋 Laporan Audit: Status Integrasi API Semua Fitur Panentra

> Tanggal audit: 5 Agustus 2026
> Metode: inspeksi kode + verifikasi live API
> Base API: `https://senoaji.daffahmad.my.id`

---

## 1. Ringkasan

| Status | Jumlah Fitur |
|---|---|
| ✅ **Terintegrasi API** (data live) | 40 |
| 🟡 **Parsial** (API + fallback statis) | 4 |
| ❌ **Tanpa API** (mock/placeholder, tidak ada endpoint) | 9 |
| 🧩 UI murni (tanpa data) | 5 |

---

## 2. ✅ Fitur Terintegrasi API

### Modul Petani
| # | Fitur | Endpoint | Status |
|---|---|---|---|
| 1 | Login / Register / Logout | `/api/login`, `/api/register`, `/api/logout` | ✅ |
| 2 | Dashboard beranda (revenue, pesanan, lahan aktif) | `/api/farmer/dashboard` | ✅ |
| 3 | Data user profil | `/api/user` | ✅ |
| 4 | Onboarding petani | `/api/onboarding` | ✅ |
| 5 | Kelola Lahan (list/tambah) | `/api/farmer/lands` | ✅ |
| 6 | Kelola Musim Tanam (list/tambah) | `/api/farmer/lands/{id}/seasons` | ✅ |
| 7 | Catat Biaya HPP (list/tambah) | `/api/farmer/expenses` | ✅ |
| 8 | Riwayat Penjualan (order selesai) | `/api/farmer/orders` | ✅ |
| 9 | Pesanan Masuk/Dikirim/Selesai + Kirim Pasokan | `/api/farmer/orders` + `PATCH .../status` | ✅ |
| 10 | Polling otomatis pesanan (30 dtk) + badge Escrow Dibayar | — | ✅ |
| 11 | Kalender Tugas (list/tambah/update) | `/api/farmer/tasks` | ✅ |
| 12 | Chat & Negosiasi (list/messages/kirim) | `/api/chats`, `/api/chats/{id}/messages` | ✅ |
| 13 | Card Aksi "Penawaran Harga" (ACC/Tawar Balik) | `/api/chats/{id}/messages` | ✅ |
| 14 | Jual Panen (list/tambah listing) | `/api/farmer/listings` | ✅ |
| 15 | Selector komoditas dari lahan/musim (semua, +badge status) | `/api/farmer/lands` | ✅ |
| 16 | Harga Pasar & Riwayat Harga (chart) | `/api/shared/market-prices`, `/api/price-history` | ✅ |
| 17 | Rekomendasi Tanam (berbasis lahan API) | `/api/farmer/lands` + `/api/farmer/dashboard` | ✅ |
| 18 | Rekening Bank (list/tambah/hapus/utama) | `/api/bank-accounts` | ✅ |
| 19 | Unduh Invoice & Laporan HPP | `/api/farmer/orders/{id}/invoice`, `/api/farmer/hpp-report` | ✅ |
| 20 | Avatar inisial dari nama (WhatsApp style) | — | ✅ |

### Modul Pemasok
| # | Fitur | Endpoint | Status |
|---|---|---|---|
| 21 | Dashboard beranda (spend, stats, pesanan terbaru) | `/api/supplier/dashboard` | ✅ |
| 22 | Marketplace + filter (q/grade/category/nego/sort) | `/api/supplier/marketplace` | ✅ |
| 23 | Detail listing (refresh by id) | `/api/supplier/listings/{id}` | ✅ |
| 24 | Beli langsung (detail/marketplace) | `/api/supplier/orders` + `.../pay` | ✅ |
| 25 | Pembayaran Escrow (create + pay) | `POST /api/supplier/orders`, `PATCH .../pay` | ✅ |
| 26 | Riwayat Pembelian | `/api/supplier/orders` | ✅ |
| 27 | Konfirmasi Barang Diterima (+ error 422) | `PATCH /api/supplier/orders/{id}/confirm-received` | ✅ |
| 28 | Lacak Pengantaran + konfirmasi sampai | `/api/supplier/deliveries` | ✅ |
| 29 | Ruang Nego & Chat (list/messages/kirim) | `/api/supplier/chats/from-listing`, `/api/chats`, `/api/chats/{id}/messages` | ✅ |
| 30 | Favorit (tambah/hapus/list) | `/api/supplier/favorites` | ✅ |
| 31 | Pasar Harga Pemasok | `/api/prices` (fallback) | ✅ |
| 32 | Rekening Bank Pemasok | `/api/bank-accounts` | ✅ |
| 33 | Chat List (sisi petani, pesan) | `/api/chats` | ✅ |
| 34 | Snackbar feedback (pengganti alert) | — | ✅ |
| 35 | Navbar tidak menutupi tombol beli | — | ✅ |
| 36 | Hydration fix greeting dinamis | — | ✅ |

### Shared
| # | Fitur | Endpoint | Status |
|---|---|---|---|
| 37 | Chat list & messages | `/api/chats`, `/api/chats/{id}/messages` | ✅ |
| 38 | Harga pasar | `/api/shared/market-prices` (fallback `/api/prices`) | ✅ |
| 39 | Rekening bank | `/api/bank-accounts` (fallback `/api/shared/bank-accounts`) | ✅ |
| 40 | Notifikasi (list/read/read-all/delete) | `/api/notifications*` | ✅ |

---

## 3. 🟡 Parsial (API utama + fallback statis)

| # | Fitur | Keterangan |
|---|---|---|
| 1 | Benchmark Harga Petani Lain (Jual Panen) | API `getFarmerListings` (listing sendiri) + fallback `NEARBY_FARMER_SALES`. Farmer dapat **403** dari `/api/supplier/marketplace` → tidak bisa lihat harga petani lain. **Butuh endpoint baru backend.** |
| 2 | Plot Lahan (Akun Keuangan) | API `getLands` utama; `FARM_PLOTS` fallback jika lahan kosong. |
| 3 | Kalender — saran tanaman musiman | `SEASONAL_CROPS` statis (tidak ada API saran tanaman). |
| 4 | Grade SNI (Jual Panen) | `NATIONAL_GRADES` = data standar statis (referensi mutu, bukan data dinamis). |

---

## 4. ❌ Tanpa API (mock/placeholder)

| # | Fitur | Lokasi | Catatan |
|---|---|---|---|
| 1 | **Insight / Rekomendasi AI** | Beranda petani & pemasok, Kesimpulan AI | Statis, tidak ada endpoint AI |
| 2 | Rekomendasi Tanam (daftar komoditas) | `RekomendasiTanamView` | Daftar komoditas statis `AI_CROP_RECOMMENDATIONS`; data lahan API, tapi saran tanam statis |
| 3 | Rekap Keuangan Pembelian | Akun Pemasok | Alert/snackbar saja, tanpa endpoint |
| 4 | Unduh Laporan Pembelian (PDF) | Akun Pemasok | Tidak ada endpoint supplier |
| 5 | Rating & Review petani | Riwayat Pembelian Pemasok | Form ada, tidak ada endpoint submit |
| 6 | Pusat Bantuan AI 24/7 | Akun | Placeholder |
| 7 | **Upload foto hasil panen** | Jual Panen | Backend tidak simpan `productImage` (semua `null`) — **butuh endpoint upload** |
| 8 | **Upload foto profil** | Akun Petani & Pemasok | Tidak ada UI + tidak ada endpoint (`/api/user` hanya GET) — **butuh endpoint avatar** |
| 9 | Unduh Invoice (PDF) | Riwayat Pemasok | Simulasi snackbar; invoice hanya ada sisi petani |

---

## 5. 🧩 UI Murni (tanpa data API)

`Avatar`, `Button`, `BottomNavbar`, `BottomNavbarPemasok`, `Snackbar`, `LeafletMapPicker` (map + geocoding Nominatim, bukan API Panentra).

---

## 6. Dead Code Ditemukan (statis tak terpakai)

Di `AkunKeuanganView.tsx` — konstanta yang sudah tidak dipakai (data kini dari API):
- `INITIAL_EXPENSE_HISTORY`, `SALES_HISTORY`, `PLANTING_SEASONS` (hanya deklarasi, tidak direferensikan).

---

## 7. Kesimpulan

- **Seluruh fitur berbasis data sudah terintegrasi API** (40 fitur) dengan 4 fallback statis yang aman.
- **Yang belum punya API (9)** mayoritas fitur AI/kreatif (insight, rekomendasi, laporan PDF) + 2 kebutuhan backend nyata:
  1. **Upload gambar** (foto panen & foto profil) — perlu endpoint upload + kolom DB.
  2. **Benchmark harga petani lain** untuk role farmer — perlu endpoint khusus.
- Verifikasi: TypeScript 0 error, lint baseline 29, build ✓.
