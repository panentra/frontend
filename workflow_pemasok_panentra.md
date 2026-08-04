# Workflow & Arsitektur Fitur Pemasok/Pembeli — Aplikasi Panentra

Dokumen ini menjelaskan alur Pemasok/Pembeli (Suplier) secara end-to-end — dari pencarian hasil panen, negosiasi, pembayaran, hingga pengelolaan pesanan — dan bagaimana setiap tahap terhubung langsung dengan fitur Petani yang sudah dirancang sebelumnya.

---

## 0. Prinsip Keterhubungan Data Petani ↔ Pemasok

Sebelum masuk ke alur, berikut peta keterhubungan data antar dua sisi — ini yang membuat marketplace terasa "satu sistem", bukan dua aplikasi terpisah:

| Data / Aksi di Sisi Petani | Muncul/Berdampak di Sisi Pemasok |
|---|---|
| Petani menekan **"Tayangkan di Marketplace Panentra"** (dari `JualPanenView`) | Produk otomatis muncul di **Katalog Marketplace** Pemasok, lengkap dengan Grade, HPP-based price range, lokasi, & status nego |
| Petani mengisi **Grade Panen (SNI)** & benchmark harga | Badge Grade & label kepercayaan harga tampil di kartu produk Pemasok |
| Pemasok **Ajukan Penawaran** di Ruang Negosiasi | Notifikasi masuk ke Dashboard Petani, tercatat sebagai status **Pending** di `Riwayat Penjualan` sementara |
| Petani **Setujui / Tolak / Nego Balik** | Status transaksi ter-update real-time di **Pesanan** Pemasok |
| Pembayaran Pemasok berhasil (Escrow) | Saldo masuk ke **Panentra Pay** milik Petani (tercatat di `AkunKeuanganView`) & transaksi otomatis masuk ke **Sales History Card** Petani |
| Petani update **Progres Masa Tanam** (misal produk pre-order/panen mendatang) | Pemasok bisa lihat estimasi ketersediaan di katalog (untuk fitur pre-order, opsional tahap lanjut) |

---

## 1. Tahap Awal: Dashboard & Pencarian Hasil Panen

### 1.1 Dashboard Pemasok
Ringkasan cepat saat membuka aplikasi:
- Sapaan + ringkasan aktivitas (pesanan aktif, chat belum dibalas, penawaran pending)
- **Rekomendasi Hari Ini** — komoditas dengan harga sedang turun/promo dari petani terdekat (data ditarik dari listing aktif `Pasar Panen`)
- Shortcut: `Marketplace`, `Pesanan Saya`, `Chat`, `Keranjang`

### 1.2 Marketplace (Katalog Hasil Panen)
Menampilkan seluruh listing yang ditayangkan petani, dengan data yang langsung ditarik dari `JualPanenView` sisi Petani:

```
Kartu Produk di Marketplace
├─ Foto Hasil Panen (dari upload petani)
├─ Nama Komoditas + Grade (A/B/C, dari Standarisasi SNI)
├─ Harga per kg (ditetapkan petani, sudah di atas HPP)
├─ Lokasi Lahan + Jarak dari Pemasok
├─ Jumlah Tersedia (kg)
├─ Nama Petani + Badge Reputasi (⭐ rating, dari AkunKeuanganView)
└─ Badge "Bisa Nego" (jika petani mengaktifkan toggle nego)
```

**Filter & Sortir**: Kategori komoditas, Grade, Jarak terdekat, Harga terendah/tertinggi, Status (Bisa Nego / Harga Tetap)

---

## 2. Tahap Pemilihan & Keputusan Nego

```
Marketplace ──► Pilih Hasil Panen ──► Detail Produk
                                           │
                                           ▼
                          Ingin Nego Harga dengan Petani?
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                ▼ Tidak                                                ▼ Ya
        Menu Pembayaran                                        Ajukan Penawaran
     (harga tetap sesuai listing)                          (input harga tawaran + qty)
                │                                                       │
                │                                                       ▼
                │                                          Ruang Negosiasi / Chat
                │                                          (terhubung real-time ke
                │                                           Dashboard Petani)
                │                                                       │
                │                                                       ▼
                │                                              Status Penawaran
                │                                          ┌────────────┼────────────┐
                │                                          ▼            ▼            ▼
                │                                      Pending      Disetujui     Ditolak/
                │                                    (menunggu    (lanjut ke     Nego Balik
                │                                    respon tani)  pembayaran)   (kembali ke
                │                                          │            │        Ruang Nego)
                │                                          └──────┬─────┘
                │                                                 ▼
                └─────────────────────────────────────►  Menu Pembayaran
```

**Catatan koneksi**: Setiap kali status berubah (Pending → Disetujui/Ditolak), sistem mengirim notifikasi dua arah — Pemasok dapat update di halaman **Pesanan**, Petani dapat update di **Dashboard/Riwayat Penjualan** sisi mereka. Ini menghindari Pemasok harus terus bertanya manual ke petani soal status.

---

## 3. Tahap Pembayaran (Escrow System)

Mengacu pada badge **"Panentra Secure Escrow"** yang sudah muncul di Sales History Card Petani, berikut alurnya dari sisi Pemasok:

```
Menu Pembayaran
      │
      ├─► Ringkasan Pesanan (qty, harga, grade, total)
      ├─► Pilih Metode Pembayaran (Panentra Pay Saldo / Transfer Bank / QRIS / VA)
      ├─► Pilih Metode Pengambilan (Diambil Sendiri / Dikirim Petani / Titik Kumpul)
      │        (opsi ini ditentukan dari pengaturan pengiriman yang dipilih petani saat listing)
      │
      ▼
Dana Ditahan di Escrow Panentra
      │
      ▼
Notifikasi ke Petani: "Pesanan Dibayar — Siap Kirim/Diambil"
      │
      ▼
Petani Konfirmasi Pengiriman/Serah Terima
      │
      ▼
Pemasok Konfirmasi Barang Diterima Sesuai Grade & Jumlah
      │
      ▼
Dana Escrow Dicairkan ke Panentra Pay Petani
      │
      ▼
Transaksi Tercatat sebagai "Selesai" di kedua sisi
(Sales History Card - Petani | Riwayat Pembelian - Pemasok)
```

**Perlindungan dua arah**: Jika barang tidak sesuai (grade/jumlah berbeda), Pemasok dapat mengajukan **Komplain** sebelum dana dicairkan — status transaksi berubah jadi "Dalam Sengketa" dan masuk ke Pusat Bantuan AI untuk mediasi awal.

---

## 4. Tahap Manajemen Pembelian

### 4.1 Keranjang Pesanan
Untuk Pemasok yang membeli dari beberapa petani sekaligus (multi-vendor cart), dengan checkout per petani (karena lokasi & metode kirim berbeda-beda).

### 4.2 Pelacakan Pengiriman
Status real-time: `Dikonfirmasi Petani` → `Sedang Dikirim/Siap Diambil` → `Diterima Pemasok` → `Selesai`
Terhubung dengan update yang diinput petani di sisi mereka (misal saat mereka menandai "Pesanan Siap Kirim").

### 4.3 Riwayat Pembelian (Sub-Page, cermin dari Sales History Card Petani)
Kartu riwayat pembelian Pemasok menampilkan info simetris dengan yang dilihat petani:
- ID Transaksi, Tanggal, Status
- Nama Petani/Lahan asal + lokasi
- Kuantitas @ Harga Satuan → Total Dibayar
- Badge Escrow + Tombol `Lihat Invoice` / `Beli Lagi dari Petani Ini`

---

## 5. Tahap Pasca-Transaksi: Rating & Reputasi

```
Transaksi Selesai
      │
      ▼
Pemasok Diminta Beri Rating & Ulasan untuk Petani
(kualitas produk, ketepatan grade, ketepatan waktu)
      │
      ▼
Rating Masuk ke Reputasi Petani (⭐ X.X / 32 Transaksi)
      │
      ▼
Rating ini muncul kembali di Marketplace sebagai
sinyal kepercayaan untuk Pemasok lain
```

Ini menutup lingkaran (*loop*) kepercayaan antara dua sisi: makin banyak transaksi baik, makin tinggi reputasi petani → makin mudah produk mereka laku di harga optimal.

---

## 6. Manajemen Akun Pemasok (AkunPemasokView)

Struktur disusun paralel dengan `AkunKeuanganView` milik Petani, supaya konsisten secara sistem:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER PROFIL & REPUTASI PEMASOK                                    │
│    Foto Profil + Nama Usaha/Toko                                        │
│    Badge: Terverifikasi (NIB/KTP Panentra Security Verified)            │
│    Reputasi sebagai Pembeli: ⭐ 4.9 / 5.0 (Ketepatan Bayar & Komunikasi)│
├────────────────────────────────────────────────────────────────────────┤
│ 2. SALDO PANENTRA PAY & RIWAYAT PEMBELIAN                              │
│    Saldo tersedia + Tombol "Top Up" / "Tarik Saldo"                    │
│    Stats: Total Belanja Bulan Ini vs Total Transaksi                    │
├────────────────────────────────────────────────────────────────────────┤
│ 3. RINGKASAN PESANAN AKTIF & RIWAYAT PEMBELIAN                         │
│    • Pesanan Berjalan (status pelacakan) ──► [Lihat Semua Pesanan]     │
│    • Riwayat Transaksi Selesai ──► [Lihat Halaman Riwayat Pembelian]   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. PETANI LANGGANAN (FAVORIT)                                          │
│    Daftar petani yang sering dibeli produknya, shortcut "Beli Lagi"    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. PENGATURAN & AKSES PERAN                                            │
│    • Kelola Rekening Bank / E-Wallet                                    │
│    • Daftar Sebagai Petani (jika ingin dual-role)                      │
│    • Unduh Laporan Pembelian (PDF, untuk kebutuhan pembukuan usaha)    │
│    • Notifikasi & Preferensi Privasi                                    │
│    • Bahasa Aplikasi                                                    │
│    • Pusat Bantuan & Support AI 24/7                                    │
├────────────────────────────────────────────────────────────────────────┤
│ 6. LOGOUT                                                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Ringkasan Alur End-to-End (Pemasok)

```
[Onboarding: lokasi usaha & kebutuhan komoditas]
             │
             ▼
[Dashboard Pemasok → Marketplace: lihat listing dari Petani]
             │
             ▼
[Pilih Produk → Nego (opsional) atau Beli Langsung]
             │
             ▼
[Pembayaran via Escrow Panentra Pay]
             │
             ▼
[Pelacakan Pengiriman/Pengambilan]
             │
             ▼
[Konfirmasi Terima → Dana Cair ke Petani]
             │
             ▼
[Rating & Ulasan untuk Petani]
             │
             ▼
[Riwayat Pembelian tersimpan + rekomendasi "Beli Lagi"]
```

---

## 8. Standar Estetika UI & Navigasi (Konsisten dengan Sisi Petani)

1. **Navigasi Sub-Page & Auto-Hide Bottom Navbar** berlaku sama di seluruh sub-halaman Pemasok (`Detail Produk`, `Ruang Negosiasi`, `Riwayat Pembelian`, `Pelacakan Pengiriman`).
2. **Dual Edge Gradient Fade Overlay** digunakan pada filter horizontal Marketplace (kategori, grade, jarak) — konsisten dengan filter HPP di sisi Petani.
3. **Simetri Visual Kartu Transaksi**: Sales History Card (Petani) dan Riwayat Pembelian Card (Pemasok) menggunakan struktur & warna yang sama persis, hanya terbalik sudut pandang (uang masuk vs uang keluar) — ini memperkuat rasa bahwa keduanya adalah satu transaksi yang sama, dilihat dari dua sisi.
4. **Bebas emoji dekoratif** pada elemen fungsional (tabel, filter, kartu transaksi) — mengikuti standar yang sudah ditetapkan di dokumen Petani.
