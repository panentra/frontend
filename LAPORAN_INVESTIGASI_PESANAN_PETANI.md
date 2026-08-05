# 🔍 Laporan Investigasi: Pesanan 150 kg Cabai Tidak Muncul di Dashboard Petani

> Tanggal investigasi: 5 Agustus 2026
> Base API: `https://senoaji.daffahmad.my.id`
> Metode: Pengujian live end-to-end dengan token asli (registrasi akun baru supplier + petani)

---

## 1. Ringkasan Hasil

| Pertanyaan | Jawaban |
|---|---|
| Apakah ada bug query backend `GET /api/farmer/orders` untuk status `paid_escrow`? | ❌ **TIDAK**. Backend sudah mengembalikan order `paid_escrow` dengan benar. |
| Apakah order yang dibayar Pemasok otomatis muncul di petani? | ✅ Ya, **hanya untuk akun petani yang menjadi penjual (seller) listing tersebut**. |
| Kenapa 150 kg cabai tidak muncul? | ⚠️ Kemungkinan besar **akun petani yang dipakai login ≠ akun seller** dari listing yang dibeli. |
| Apakah ada kekurangan backend yang nyata? | ⚠️ Ya: **tidak ada notifikasi real-time** (WebSocket/push). |

---

## 2. Bukti Pengujian Live (End-to-End)

### 2.1 Alur yang diuji (harus bekerja)

1. Petani baru (id **9**) membuat listing `Cabai Rawit Merah` → listing id **14**.
2. Pemasok membuat pesanan pada listing 14 → order id **11**, status `incoming`.
3. Pemasok bayar escrow → status **`paid_escrow`**, `escrowStatus: held`.
4. `GET /api/farmer/orders` (token petani id 9):
   ```
   id 11  TRX-83333  Cabai Rawit Merah  10 kg | status paid_escrow | seller id 9
   ```
   ✅ **Muncul** di daftar petani.
5. Tombol "Kirim Pasokan" → `PATCH /api/farmer/orders/11/status {"status":"shipping"}` → ✅ berhasil (`status: shipping`).

### 2.2 Temuan kunci — Order TERIKAT pada penjual listing

Dari data nyata di server:

```
Order id 8  (cabai, listing 1, paid_escrow) → seller id 4 = "Pak Andi Sugiharto"
Order id 11 (cabai, listing 14, paid_escrow) → seller id 9 = "Farmer Test"
```

**Kesimpulan:** Order marketplace hanya muncul di dashboard petani **jika akun petani yang login adalah penjual dari listing yang dibeli**.

Listing "Cabai Rawit Merah" yang ada di marketplace (id 1–6, farmerName *"Pak Andi Sugiharto"*) dimiliki oleh **user id 4**. Jika kamu membeli dari listing itu, order akan muncul di dashboard **akun id 4** — bukan di akun petani lain yang kamu pakai login.

### 2.3 Verifikasi ulang: Checkout Pemasok SUDAH terhubung API (pengujian 5 Agu)

Pengujian live alur penuh (bukan simulasi):

```
1. Pemasok beli listing 14 (milik petani id 9) → order id 13 dibuat
2. Pemasok bayar escrow → status paid_escrow (seller id 9)
3. GET /api/supplier/deliveries → order 13 MUNCUL (list pengantaran bertambah ✓)
4. GET /api/farmer/orders (petani id 9) → order 13 MUNCUL (paid_escrow) ✓
```

Hasil: `POST /api/supplier/orders`, `PATCH /api/supplier/orders/{id}/pay`, list pengantaran, dan orders petani **semua terhubung API dan bekerja**. Simulasi "status barang" di layar pembayaran hanya tombol visual untuk langkah **konfirmasi barang diterima** — tidak menggantikan pembayaran API.

---

## 3. Analisis Penyebab

### 3.1 Root cause utama: Mismatch akun (bukan bug kode)

- Kamu login supplier → pesan 150 kg cabai dari listing milik **user id 4**.
- Kamu login petani → kemungkinan pakai akun yang **bukan id 4** (misal akun baru / akun demo "Pak Budi").
- `GET /api/farmer/orders` hanya mengembalikan order yang **seller-nya = user yang sedang login**.
- Maka order 150 kg tidak muncul. Ini **perilaku API yang benar**, bukan kesalahan query.

> ⚠️ **Penting:** Nama "Pak Budi"/"Pak Andi" di marketplace hanyalah **nama tampilan** listing.
> Penjual sesungguhnya adalah akun user tertentu (id 4 untuk listing cabai seed).
> Login sebagai "Pak Budi" ≠ otomatis menjadi penjual listing "Pak Budi" — kecuali akun itu yang benar-benar membuat listingnya.

### 3.2 Root cause sekunder (sisi backend, benar-benar ada)

1. **Tidak ada notifikasi real-time** — Saat Pemasok membayar, petani tidak mendapat event (WebSocket / push). Dashboard petani hanya tahu kalau di-refresh. Frontend sudah kami tambahkan **polling otomatis 30 detik + refetch saat tab fokus** sebagai mitigasi.
2. **Listing detail tidak menampilkan `seller_id`** — Frontend tidak bisa memastikan siapa penjual sebuah listing dari endpoint `GET /api/supplier/listings/{id}` (field `seller_id` tidak dikembalikan). Ini menyulitkan debugging dari sisi UI.

---

## 4. Cara Memverifikasi (di sisi kamu)

1. **Cek akun penjual listing cabai** — listing di marketplace milik user id 4 ("Pak Andi Sugiharto"). Login ke dashboard petani **menggunakan akun penjual listing tersebut**, maka order 150 kg akan muncul.
2. **Uji dengan alur milik sendiri** (paling pasti):
   - Login petani → buat listing sendiri di **Jual Panen** (pastikan komoditas siap jual).
   - Login supplier → beli dari **listing kamu sendiri** → bayar escrow.
   - Kembali login petani → order muncul di tab **Masuk** dengan badge **"Escrow Dibayar"** + tombol **Kirim Pasokan**.
   - (Alur ini sudah dibuktikan bekerja pada pengujian 2.1.)

---

## 5. Rekomendasi

### Untuk segera (tanpa perubahan backend)
- Gunakan akun yang sama sebagai penjual dan pembeli, atau pastikan login petani = akun pemilik listing.

### Untuk produk (butuh kerja backend)
1. **Endpooint/flag `seller_id` di listing detail** agar UI bisa menampilkan pemilik.
2. **Notifikasi real-time** (WebSocket) saat order dibayar, agar dashboard petani ter-update instan (tanpa polling).
3. (Opsional) Jika memang diinginkan semua pesanan "kabupaten" tampil ke semua petani — itu keputusan bisnis; saat ini modelnya **order scoped per seller**.

---

## 6. Status Kode

- Bug filter `paid_escrow` di backend: **tidak ada** (sudah benar sejak awal).
- Fix frontend yang sudah dilakukan (`PesananView.tsx`):
  - Polling 30 detik + refetch saat fokus → order baru muncul tanpa reload manual.
  - Mapping eksplisit `paid_escrow`/`pending`/`incoming` → tab **Masuk**.
  - Badge **"Escrow Dibayar"** pada order `paid_escrow`.
