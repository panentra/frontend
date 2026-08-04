# Workflow & Arsitektur Fitur Petani — Aplikasi Panentra

Dokumen ini menjelaskan alur petani secara end-to-end dari rekomendasi tanam, pengelolaan multi-lahan, pencatatan HPP per periode musim tanam, penjualan hasil panen di marketplace, hingga manajemen akun & keuangan Panentra Pay.

---

## 1. Tahap Awal: Rekomendasi Komoditas Tanam (AI Recommendation)

Sebelum menanam, petani mendapat rekomendasi dari sistem berdasarkan 3 faktor utama:

| Faktor | Sumber Data | Implikasi Keputusan AI |
|---|---|---|
| **Daerah** | Lokasi lahan petani (GPS / kabupaten-kecamatan dari onboarding) | Dataran tinggi cocok untuk kentang & sayur, dataran rendah cocok untuk padi & palawija |
| **Musim** | Kalender musim tanam (BMKG + data historis cuaca) | Musim hujan ➔ padi & sayuran daun, Musim kemarau ➔ palawija & cabai |
| **Harga & Pasar** | Data tren harga pasar real-time & transaksi Panentra | Komoditas dengan tren harga naik & proyeksi profit tinggi diprioritaskan |

### Alur Fitur Rekomendasi Tanam:

```
Dashboard Petani ──► Tab Kalender ──► Mau Tanam Apa? (Rekomendasi AI)
                                           │
                                           ├─► Evaluasi Lokasi Lahan & Jenis Tanah
                                           ├─► Cek Kalender Musim Tanam Saat Ini
                                           ├─► Analisis Proyeksi Harga & Profit Margin
                                           │
                                           ▼
                           Tampilan 3-5 Rekomendasi Komoditas
                           (Lengkap dengan estimasi hari panen & margin)
                                           │
                                           ▼
                           Petani Memilih Komoditas
                                           │
                                           ▼
                   Komoditas Tercatat sebagai "Musim Tanam Aktif (MT-1)"
```

---

## 2. Tahap Masa Tanam: Pengelolaan Multi-Lahan & Pencatatan Biaya Produksi (HPP)

### 2.1 Multi-Lahan & Multi-Komoditas (Multi-Plot Management)
Petani dapat mengelola lebih dari satu plot lahan pertanian (misal: *Plot 1: Kebun Lembang 0.5 Ha* dan *Plot 2: Kebun Ciwidey 0.8 Ha*). Setiap plot memiliki indikator progres masa tanam (misal: *Hari ke-68 dari 90 Hari*) dan tombol tambah lahan baru.

### 2.2 Pencatatan Biaya Produksi (HPP) Terpisah per Periode Musim Tanam
Untuk mencegah tercampurnya biaya antar-musim tanam saat petani melakukan penanaman ulang (*re-planting*), seluruh pengeluaran modal dikelompokkan berdasarkan **Periode Musim Tanam**:

| Kategori Pengeluaran | Contoh Item | Pengelompokan Periode |
|---|---|---|
| **Bibit/Benih** | Benih Cabai Rawit Red Hot Super | Tagged to: **MT-1: Cabai Rawit (Juni - Sept 2026)** |
| **Pupuk & Nutrisi** | Pupuk NPK 16-16-16 (50kg) | Tagged to: **MT-1: Cabai Rawit (Juni - Sept 2026)** |
| **Obat & Pestisida** | Pestisida Organik Neem (2L) | Tagged to: **MT-1: Cabai Rawit (Juni - Sept 2026)** |
| **Tenaga Kerja** | Upah harian buruh olah lahan & panen | Tagged to: **MT-1: Cabai Rawit (Juni - Sept 2026)** |
| **Peralatan & Transport** | Mulsa plastik, sewa traktor, irigasi | Tagged to: **MT-2: Tomat Red (Maret - Mei 2026)** |

### 2.3 Halaman Penuh Pencatatan HPP (Full-Page Sub-View):
Akses pencatatan HPP kini disajikan dalam **Sub-Halaman Khusus (Full-Page View)** dengan navigasi header tetap (`fixed top-[#0]`) dan tombol kembali (`<`):

1. **Header Pinned & Quick Action**: Header tetap dengan tombol kembali lingkaran putih + tombol `+ Catat Biaya`.
2. **Banner Total Biaya HPP Per Periode**: Kalkulasi otomatis total modal produksi khusus untuk periode musim tanam yang sedang dipilih.
3. **Filter Bar Periode Musim Tanam**: Filter pill horizontal (`Semua Periode`, `MT-1: Cabai Rawit [Aktif]`, `MT-2: Tomat Red [Selesai]`) lengkap dengan gradasi *soft fade overlay* di ujung kiri dan kanan.
4. **Filter Pill Kategori**: Filter (*Semua, Pupuk, Bibit, Obat, Tenaga Kerja, Peralatan*).
5. **Item Card dengan Season Badge**: Setiap kartu pengeluaran memiliki badge periode hijau (`MT-1: Cabai Rawit (Juni - Sept 2026)`).

---

## 3. Tahap Panen & Jual: Sub-Halaman "Jual Panen & Cek Harga" (JualPanenView)

Saat panen tiba, petani membuka menu **Jual Panen & Cek Harga** (Full Sub-Page) untuk penentuan harga transparan & obyektif:

1. **Kalkulasi HPP Otomatis**: `HPP/kg = Total Pengeluaran Periode Ini ÷ Estimasi Hasil Panen (kg)`.
2. **Standarisasi Grade Panen Nasional (SNI)**:
   - **Grade A (Super Premium)**: Target Supermarket & Restoran (Margin tertinggi).
   - **Grade B (Standar Pasar)**: Target Pasar Induk & Agen Sayur.
   - **Grade C (Industri Olahan)**: Target Pabrik Saus & Sambal.
3. **Benchmark Harga Penjualan Petani Sekitar (Real-Time)**:
   - Petani dapat melihat referensi harga transaksi petani terdekat di wilayahnya sebelum menetapkan harga jual.
4. **Kalkulator Profit Margin Live**:
   - Menampilkan harga jual rekomendasi AI, estimasi penerimaan kotor, modal HPP, dan keuntungan bersih secara live (% profit di atas HPP).

---

## 4. Tahap Paska-Jual: Riwayat Penjualan & Transkrip Finansial (Sales History Sub-Page)

Setiap transaksi hasil panen yang berhasil dibeli oleh Pemasok/Pembeli dicatat di **Sub-Halaman Riwayat Penjualan (Full-Page View)**:

### Desain Kartu Transaksi Penjualan (Sales History Card):
- **Header Kartu**: ID Transaksi (`TRX-901`), Tanggal & Waktu (`3 Agustus 2026, 10:15 WIB`), dan Badge Status (`✓ Selesai`).
- **Informasi Utama**: Judul Komoditas (`Cabai Rawit Merah Super`) & Nama Pembeli (`Toko Berkah Jaya - Pemasok Pasar Modern`).
- **Kotak Ringkasan Finansial Mandiri (Inner Box `#F8FAF8`)**:
  - Sisi Kiri: Kuantitas & Harga Satuan (`150 kg @ Rp 35.000 / kg`).
  - Sisi Kanan: Total Diterima (`Rp 5.250.000` — Font hijau gelap `#0F4C25` menonjol).
- **Footer Kartu**: Lokasi Lahan (`Kec. Lembang`), Badge Escrow (`Panentra Secure Escrow`), dan Tombol `Cetak Invoice`.

---

## 5. Manajemen Akun, Keuangan, & Pengaturan Peran (AkunKeuanganView)

Halaman Akun Petani dirancang dengan struktur komprehensif untuk mendukung operasional harian:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER PROFIL & REPUTASI                                           │
│    Foto Profile Bowo + Tombol Edit Profil (Pensil)                    │
│    Nama: Pak Bowo Santoso                                              │
│    Badge: Terverifikasi (KTP & Lahan Panentra Security Verified)       │
│    Reputasi: ⭐ 4.8 / 5.0 (32 Transaksi Penjualan Sukses)             │
├────────────────────────────────────────────────────────────────────────┤
│ 2. LAHAN & KOMODITAS AKTIF (MULTI-LAHAN)                              │
│    Tabs: [Plot 1: Kebun Lembang (0.5 Ha)] [Plot 2: Kebun Ciwidey]     │
│    Card: Progres Masa Tanam (Hari ke-68 / 90 Hari) + Tambah Lahan    │
├────────────────────────────────────────────────────────────────────────┤
│ 3. REKAP SALDO PANENTRA PAY & FINANSIAL                               │
│    Saldo: Rp 14.850.000 + Tombol "Tarik Saldo"                        │
│    Stats: Total Pendapatan Omset vs Total Biaya Produksi (HPP)        │
├────────────────────────────────────────────────────────────────────────┤
│ 4. RINGKASAN BIAYA PRODUKSI (HPP) & RIWAYAT PENJUALAN                  │
│    • 2 Ringkasan HPP Terbaru ──► [Lihat Halaman Catatan Biaya HPP]    │
│    • 2 Ringkasan Penjualan Terbaru ──► [Lihat Halaman Riwayat Penjualan]│
├────────────────────────────────────────────────────────────────────────┤
│ 5. PENGELOLAAN TANI & AI                                              │
│    Atur Ulang Target & Musim Tanam Baru                                │
├────────────────────────────────────────────────────────────────────────┤
│ 6. PENGATURAN & AKSES PERAN                                            │
│    • Kelola Rekening Bank / E-Wallet (BCA, DANA, dll.)                │
│    • Daftar Sebagai Pemasok / Pembeli (Toko Pemasok)                  │
│    • Unduh Laporan Keuangan Tani (PDF)                                │
│    • Notifikasi & Preferensi Privasi (WhatsApp Alert & Push Notif)    │
│    • Bahasa Aplikasi (Bahasa Indonesia, Basa Jawa, Basa Sunda)        │
│    • Pusat Bantuan & Support AI 24/7                                  │
├────────────────────────────────────────────────────────────────────────┤
│ 7. LOGOUT (Tombol Merah Prominen)                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Standar Estetika UI & Navigasi Sistem

1. **Navigasi Sub-Page & Auto-Hide Bottom Navbar**:
   - Seluruh sub-tampilan (`Chat Room`, `JualPanenView`, `Riwayat Penjualan Full Page`, `Catatan HPP Full Page`) menggunakan tombol kembali lingkaran putih (`<`) dan secara otomatis **menyembunyikan Bottom Navbar** agar layar ponsel tetap lapang.
2. **Dual Edge Gradient Fade Overlay pada Scroll Filter Horizontal**:
   - Seluruh container filter tab horizontal (Kalender, Chat, Pesanan, HPP, Pasar Pemasok) menggunakan lapisan gradasi halus (`bg-gradient-to-r` & `bg-gradient-to-l`) di batas kiri dan kanan agar elemen filter memudar secara halus saat di-scroll tanpa terpotong patah.
3. **Pembersihan Emoticon/Emoji pada Fitur Fungsional**:
   - Antarmuka tabel, filter periode HPP, dan kartu transaksi menggunakan desain UI yang bersih, profesional, dan mengandalkan visual hirarki tipografi modern tanpa emoji dekoratif yang mengganggu.
