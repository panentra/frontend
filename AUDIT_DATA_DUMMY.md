# 📊 Audit Data Dummy & Status Integrasi API Panentra

Dokumen ini menyajikan audit menyeluruh tentang komponen mana saja yang **sudah 100% terintegrasi API**, mana yang **parsial**, dan mana yang **masih menggunakan data dummy / statis** di aplikasi Panentra.

---

## 🟢 1. Komponen yang SUDAH 100% Terintegrasi API (Clean / Zero Dummy Data)

Berikut adalah halaman dan komponen yang **bebas dari data dummy** dan murni bergantung pada API backend:

| Halaman / Komponen | Endpoint API | Keterangan Status |
| :--- | :--- | :--- |
| **Login & Register** (`/login`, `/register`) | `POST /api/login`<br>`POST /api/register` | ✅ **100% Real API**: Autentikasi token JWT & session role (Petani / Pemasok). |
| **Onboarding Kuesioner** (`/onboarding/kuisioner`, `/onboarding/pemasok/kuisioner`) | `POST /api/onboarding` | ✅ **100% Real API**: Menyimpan data profil, sistem tanam, lahan, komoditas, dan toko ke database. |
| **Pesanan & Penjualan Pasokan** (`PesananView.tsx`) | `GET /api/farmer/orders`<br>`PATCH /api/farmer/orders/{id}/status` | ✅ **100% Real API**: List pesanan masuk/dikirim/selesai & update status pesanan murni dari API database. Dummy fallback telah dibersihkan total. |
| **Pesan & Negosiasi Chat** (`ChatListView.tsx`) | `GET /api/chats`<br>`GET /api/chats/{id}/messages`<br>`POST /api/chats/{id}/messages` | ✅ **100% Real API**: List percakapan chat, riwayat pesan, dan kirim pesan real-time terhubung langsung ke database API. |

---

## 🟡 2. Komponen Parsial (Sebagian API, Sebagian Masih Static Dummy UI)

Berikut adalah komponen yang sudah terhubung ke API untuk fitur utamanya, tetapi beberapa widget pendukung masih menggunakan objek/array statis lokal:

### 1. **Beranda Petani** (`DashboardPetani.tsx`)
- **✅ Sudah API**:
  - `GET /api/user` (Nama & profil petani di header)
  - `GET /api/farmer/dashboard` (Kartu ringkasan Pendapatan, Pesanan Aktif, Penjualan Selesai)
  - `GET /api/farmer/lands` (List lahan milik petani)
  - `GET /api/farmer/expenses` (Hitung total pengeluaran modal)
- **⚠️ Masih Static Dummy**:
  - **Grafik Tren Harga Komoditas**: Objek `COMMODITY_PRICE_DATA` (Cabai Rawit, Tomat, Pakcoy, Jagung) masih hardcoded statis. *(API Helper `getMarketPrices()` & `getPriceHistory()` sudah siap di `lib/api.ts`)*.
  - **Ringkasan Musim Tanam Aktif**: Objek `activeCrop` (Cabai Rawit Merah, 68/90 Hari, 1.280 kg) masih state lokal. *(Dapat di-fetch dari `GET /api/farmer/lands/{landId}/seasons`)*.

### 2. **Akun & Keuangan Petani** (`AkunKeuanganView.tsx`)
- **✅ Sudah API**:
  - `GET /api/user` (Nama & nomor HP petani di profil)
  - `GET /api/farmer/expenses` (Tabel Riwayat Pengeluaran murni dari API)
  - `POST /api/farmer/expenses` (Modal "+ Catat Pengeluaran" berhasil menyimpan ke API)
  - `DELETE /api/farmer/expenses/{id}` (Fitur hapus catatan pengeluaran)
- **⚠️ Masih Static Dummy**:
  - **Kartu Rekening Bank Utama**: List rekening bank masih state lokal (`REKENING_DATA`). *(API Helper `getBankAccounts()` & `createBankAccount()` sudah siap di `lib/api.ts`)*.
  - **Tombol Unduh Laporan PDF/Excel**: Menggunakan `alert()`. *(API Helper `downloadHPPReport()` sudah siap)*.

### 3. **Kalender Musim Tanam** (`KalenderView.tsx`)
- **✅ Sudah API**:
  - `GET /api/farmer/lands` (Dropdown pilihan lahan petani)
- **⚠️ Masih Static Dummy**:
  - **Timeline Musim & Task Harian**: Array `TASKS` dan tahapan tanam (Penyemaian, Pemupukan, Panen) masih menggunakan array static `TASKS_DATA`. *(API Helper `getSeasons()` & `getTasks()` sudah siap di `lib/api.ts`)*.

---

## 🔴 3. Komponen yang MASIH 100% Data Dummy / Statis

Komponen berikut saat ini masih menggunakan mock data lokal dan belum diintegrasikan dengan API backend:

| Komponen / Page | Fitur yang Masih Dummy | Endpoint API yang Siap Digunakan |
| :--- | :--- | :--- |
| **Rekomendasi Tanam AI** (`RekomendasiTanamView.tsx`) | List kartu rekomendasi komoditas AI (`AI_RECOMMENDATIONS_DATA`). | Can be fetched from `GET /api/shared/market-prices` & AI Engine backend. |
| **Dashboard Pemasok** (`DashboardPemasok.tsx`) | Ringkasan statistik & list pasokan panen terbaru pemasok. | `GET /api/supplier/dashboard`<br>`GET /api/supplier/marketplace` |
| **Ruang Nego Pemasok** (`RuangNegoPemasokView.tsx`) | Form tawar-menawar harga dan chat nego dari sisi pemasok. | `POST /api/supplier/negotiations/start` |
| **Pembayaran Escrow Pemasok** (`PembayaranEscrowView.tsx`) | Form checkout & konfirmasi pembayaran escrow pemasok. | `POST /api/supplier/orders`<br>`PATCH /api/supplier/orders/{id}/pay` |

---

## 📋 Rekomendasi Langkah Selanjutnya (Priority Checklist)

1. **Integrasi Grafik Harga Komoditas pada Beranda Petani** (`DashboardPetani.tsx`):
   - Hubungkan grafik harga ke `GET /api/shared/market-prices` dan `GET /api/shared/price-history`.
2. **Integrasi Rekening Bank di Akun Keuangan** (`AkunKeuanganView.tsx`):
   - Hubungkan modal & kartu rekening ke `GET /api/shared/bank-accounts` dan `POST /api/shared/bank-accounts`.
3. **Integrasi Tasks & Timeline Kalender Tanam** (`KalenderView.tsx`):
   - Hubungkan timeline ke `GET /api/farmer/lands/{landId}/seasons` dan `GET /api/farmer/tasks`.
4. **Integrasi Dashboard & Pembelian Pemasok** (`DashboardPemasok.tsx`):
   - Hubungkan marketplace & riwayat pembelian ke `GET /api/supplier/marketplace` & `GET /api/supplier/purchases`.
