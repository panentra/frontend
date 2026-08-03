# Workflow Petani — Aplikasi Panentra

Dokumen ini menjelaskan alur petani dari awal (rekomendasi tanam) sampai penjualan hasil panen dengan rekomendasi harga jual yang menguntungkan.

---

## 1. Tahap Awal: Rekomendasi Komoditas Tanam

Sebelum menanam, petani mendapat rekomendasi dari sistem berdasarkan 3 faktor utama:

| Faktor | Sumber Data | Contoh |
|---|---|---|
| **Daerah** | Lokasi lahan petani (dari onboarding: pin GPS / kabupaten-kecamatan) | Dataran tinggi cocok untuk kentang, sayur dataran tinggi |
| **Musim** | Kalender musim tanam (data cuaca/BMKG + pola musim historis) | Musim hujan → padi, musim kemarau → palawija/cabai |
| **Harga** | Data harga pasar terkini & tren harga komoditas (dari histori transaksi Panentra + data pasar eksternal) | Komoditas dengan harga sedang naik & permintaan tinggi diprioritaskan |

### Alur:

```
Dashboard Petani
      │
      ▼
Kalender Pertanian
      │
      ▼
Rekomendasi AI (Mau Tanam Apa?)
      │
      ├─► Input/konfirmasi lokasi lahan (jika belum lengkap)
      ├─► Sistem cek musim tanam saat ini
      ├─► Sistem cek data harga & tren pasar per komoditas
      │
      ▼
Sistem menampilkan 3-5 rekomendasi komoditas
(disertai alasan: cocok musim, cocok daerah, prospek harga)
      │
      ▼
Petani pilih komoditas yang akan ditanam
      │
      ▼
Sistem catat sebagai "Tanaman Aktif" + estimasi jadwal panen
```

### Contoh tampilan rekomendasi:
- 🌶️ **Cabai Rawit** — Cocok musim kemarau di daerahmu · Harga naik 15% 3 bulan terakhir · Estimasi panen 90 hari
- 🌽 **Jagung Manis** — Cocok musim ini · Permintaan tinggi di pasar terdekat · Estimasi panen 70 hari
- 🥬 **Sawi Hijau** — Cocok dataran tinggi · Siklus panen cepat (30-40 hari) · Harga stabil

---

## 2. Tahap Penanaman: Pencatatan Pengeluaran

Selama proses tanam sampai panen, petani mencatat semua pengeluaran produksi lewat fitur **Pencatatan Keuangan**.

### Jenis pengeluaran yang dicatat:

| Kategori | Contoh Item | Satuan Input |
|---|---|---|
| **Bibit/Benih** | Bibit cabai, benih jagung | Rp / jumlah unit |
| **Pupuk** | Pupuk NPK, pupuk kandang, pupuk cair | Rp / kg atau liter |
| **Obat & Pestisida** | Pestisida, fungisida | Rp / liter atau botol |
| **Tenaga Kerja** | Upah harian buruh tani, upah panen | Rp / hari / orang |
| **Sewa Alat/Lahan** | Sewa traktor, sewa lahan | Rp |
| **Lain-lain** | Transportasi, irigasi, dll | Rp |

### Alur pencatatan:

```
Kalender Pertanian → Pencatatan Keuangan
      │
      ▼
Catat Pengeluaran Produksi
      │
      ├─► Pilih kategori (Bibit / Pupuk / Obat / Tenaga Kerja / Lain-lain)
      ├─► Input jumlah & harga
      ├─► Input tanggal pengeluaran
      ├─► (Opsional) Upload foto nota/struk
      │
      ▼
Sistem otomatis mengakumulasi Total Biaya Produksi
      │
      ▼
Dashboard Finansial
(menampilkan grafik total pengeluaran per kategori, per periode tanam)
```

Data ini penting karena akan menjadi dasar perhitungan **harga pokok produksi (HPP)** di tahap berikutnya.

---

## 3. Tahap Panen & Jual: Sub-Halaman "Jual Panen & Cek Harga"

Saat petani siap menjual hasil panen, menu **Jual Panen & Cek Harga** diakses sebagai **Sub-Halaman Khusus (Dedicated View)** — bukan pop-up modal — untuk menampung fitur benchmarking & standarisasi yang komprehensif:

1. **Akumulasi HPP Otomatis**: HPP per kg dihitung langsung dari total pengeluaran tahap 2 (`Total Biaya ÷ Estimasi Panen (kg)`).
2. **Penentuan Grade Panen Nasional (SNI)**:
   - **Grade A (Super Premium)**: Ukuran ≥ 4cm, warna merah 95%+, mulus. Target: Supermarket & Restoran (Harga: Rp 38.000–42.000/kg).
   - **Grade B (Standar Pasar)**: Ukuran 3–4cm, warna merah 80%+. Target: Pasar Induk & Agen Sayur (Harga: Rp 32.000–35.000/kg).
   - **Grade C (Industri Olahan)**: Ukuran bervariasi. Target: Pabrik Saus/Sambal Botol (Harga: Rp 24.000–27.000/kg).
3. **Komparasi Harga Pasaran Real-Time & Penjualan Petani Lain**:
   - Petani dapat melihat transaksi laku & harga penayangan petani terdekat di wilayahnya (misal: Pak Budi Lembang Rp 40.000/kg, Pasar Induk Rp 34.000/kg).
   - Data komparasi ini memberikan bargaining power & referensi objektif sebelum menentukan harga final.
4. **Kalkulator Margin Profit & Penayangan Marketplace**:
   - Menampilkan proyeksi penerimaan kotor, modal HPP, dan keuntungan bersih secara live.
   - Petani mengonfirmasi harga dan menayangkan komoditas ke Marketplace Panentra.

### Alur Sub-Halaman Jual Panen:

```
Dashboard Petani → Klik Kartu "Jual Panen & Cek Harga"
      │
      ▼
Sub-Halaman JualPanenView (Full Sub-Page)
      │
      ├─► Ringkasan HPP Komoditas Aktif (misal: Rp 18.500 / kg)
      ├─► Step 1: Pilih Grade Hasil Panen (Grade A / B / C SNI)
      ├─► Step 2: Cek Benchmark Harga Penjualan Petani Lain Terdekat
      ├─► Step 3: Input Foto, Jumlah Panen (kg), & Harga Jual Final
      │
      ▼
Kalkulator Live Hitung Estimasi Keuntungan Bersih & % Profit di Atas HPP
      │
      ▼
Klik "Tayangkan di Marketplace Panentra"
      │
      ▼
Produk Berhasil Tayang di Marketplace
```

### Contoh Tampilan Benchmark & Margin:

> **Cabai Rawit Merah — 50 kg**
> - Total Biaya Produksi: Rp 925.000 (HPP: Rp 18.500/kg)
> - **Grade A (Super Premium)** terpilih
> - Reference Harga Petani Sekitar: Pak Budi (Lembang) Rp 40.000/kg (Laku 250 kg)
> - 💡 **Rekomendasi AI Panentra: Rp 39.500 / kg**
> - Estimasi Keuntungan Bersih: **+Rp 1.050.000 (+113% profit di atas HPP)**
> - ⚠️ Batas Minimum Bebas Rugi: Rp 18.500 / kg

---

## 4. Ringkasan Alur End-to-End

```
[Onboarding: lokasi & komoditas lahan]
             │
             ▼
[Rekomendasi AI: mau tanam apa? — berdasar daerah, musim, harga]
             │
             ▼
[Petani mulai tanam → Tanaman Aktif tercatat]
             │
             ▼
[Selama masa tanam: Catat Pengeluaran Produksi
 (bibit, pupuk, obat, tenaga kerja, dll)]
             │
             ▼
[Panen tiba → Form Tambah Produk di Pasar Panen]
             │
             ▼
[Sistem hitung HPP dari total pengeluaran]
             │
             ▼
[Sistem beri Rekomendasi Harga Jual
 (HPP + margin vs harga pasar)]
             │
             ▼
[Petani jual di Marketplace dengan harga yang menguntungkan]
```

---

## 5. Catatan Kebutuhan Data/Sistem

Agar fitur ini berjalan, sistem butuh beberapa sumber data:

- **Data cuaca/musim** — integrasi API BMKG atau data historis musim per wilayah
- **Data harga pasar** — bisa dari histori transaksi internal Panentra + scraping/API harga komoditas (misal PIHPS, Kementan)
- **Basis perhitungan HPP** — akumulasi otomatis dari fitur Pencatatan Keuangan, jadi tidak perlu input manual ulang
- **Model rekomendasi** — bisa mulai dari rule-based (aturan sederhana: musim + lokasi + tren harga) sebelum berkembang ke model machine learning yang lebih personal berdasarkan histori petani tersebut
