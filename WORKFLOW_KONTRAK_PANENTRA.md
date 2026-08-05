# 📜 Workflow Fitur Kontrak Panen — Panentra (MVP)

Kontrak Jual Beli antara **Petani** dan **Pemasok** agar petani memiliki pembeli pasti sebelum masa panen, dan pemasok memiliki pasokan dengan harga terkunci.

---

## 1. Konsep & Tujuan

| Sudut Pandang | Masalah | Solusi Kontrak |
|---|---|---|
| **Petani** | Khawatir panen tidak laku / harga anjlok saat panen raya | Harga & volume **terkunci** dengan pemasok sebelum tanam |
| **Pemasok** | Pasokan berfluktuasi, harga tidak stabil | Stok terjamin untuk musim depan dengan harga tetap |

**Alur inti:** Petani terbitkan tawaran kontrak → Pemasok tanda tangan → Kontrak aktif → Panen terkirim → Selesai.

---

## 2. Status Kontrak (Lifecycle)

```
menunggu_pemasok  →  aktif  →  panen_terkirim  →  selesai
  (tawaran terbuka)  (ditandatangani)  (petani kirim panen)  (pemasok terima)
```

| Status | Arti | Pelaku Aksi |
|---|---|---|
| `menunggu_pemasok` | Tawaran kontrak menunggu ditandatangani pemasok | Petani membuat |
| `aktif` | Kontrak disepakati, harga & volume terkunci | Pemasok tanda tangan |
| `panen_terkirim` | Petani sudah kirim hasil panen | Petani menandai |
| `selesai` | Pasokan diterima, transaksi rampung | Pemasok konfirmasi |

---

## 3. Alur Penggunaan (User Flow)

### 3.1 Sisi Petani
1. Buka **Home Petani → card "Kontrak Panen"**.
2. Tekan **"Buat Kontrak Panen Baru"**.
3. Isi form:
   - **Komoditas** (dropdown dari `GET /api/commodities`)
   - **Kuantitas (kg)**
   - **Harga (Rp/kg)** → nilai kontrak dihitung otomatis
   - **Estimasi tanggal panen**
   - **Metode pengiriman** (Dikirim / Diambil)
4. **Terbitkan Kontrak** → status `menunggu_pemasok`.
5. Saat pemasok menandatangani → status **`aktif`** (badge biru, nama pembeli tampil).
6. Setelah panen → tombol **"Tandai Panen Terkirim"** → status `panen_terkirim`.
7. Pemasok konfirmasi terima → status **`selesai`**.

### 3.2 Sisi Pemasok
1. Buka **Home Pemasok → card "Kontrak Pasokan"**.
2. Tab **"Tawaran Terbuka"** — lihat tawaran kontrak petani yang belum diambil.
3. Tekan **"Tanda Tangan & Kunci Kontrak"** → status `aktif`, nama toko tercatat.
4. Tab **"Kontrak Saya"** — pantau kontrak yang sudah ditandatangani.
5. Saat petani kirim panen (`panen_terkirim`) → tekan **"Konfirmasi Terima & Selesaikan"** → `selesai`.

---

## 4. Struktur Data (MVP)

```ts
interface Contract {
  id: string;              // KTR-xxxxxx
  commodity: string;       // dari /api/commodities
  commodityId?: number;
  qtyKg: number;
  pricePerKg: number;
  totalValue: number;      // qtyKg * pricePerKg
  farmerName: string;
  farmerLocation: string;
  supplierName: string | null;
  harvestDate: string;     // estimasi tanggal panen
  deliveryMethod: "dikirim" | "diambil";
  status: "menunggu_pemasok" | "aktif" | "panen_terkirim" | "selesai";
  createdAt: string;
  createdBy: "petani" | "pemasok";
}
```

**Penyimpanan MVP:** `localStorage` key `panentra_contracts` (shared antar role dalam satu browser). Untuk produksi → butuh endpoint backend (lihat §6).

---

## 5. Komponen & Lokasi Kode

| Item | File |
|---|---|
| Komponen utama | `app/components/ContractView.tsx` |
| Nav Petani (card + sub-view) | `app/components/DashboardPetani.tsx` |
| Nav Pemasok (card + sub-view) | `app/components/DashboardPemasok.tsx` |
| Avatar inisial | `app/components/Avatar.tsx` |
| Snackbar feedback | `app/components/Snackbar.tsx` |

---

## 6. Catatan MVP & Rekomendasi Produksi

### Sudah berjalan (MVP)
- ✅ Alur 4 status lengkap di kedua role
- ✅ Form pembuatan kontrak dengan komoditas dari API
- ✅ Nilai kontrak otomatis, feedback snackbar
- ✅ Data bertahan (localStorage)

### Perlu Backend (untuk produksi)
| Kebutuhan | Endpoint yang disarankan |
|---|---|
| List kontrak petani/pemasok | `GET /api/contracts?role=...` |
| Buat tawaran kontrak | `POST /api/contracts` |
| Tanda tangan kontrak | `PATCH /api/contracts/{id}/sign` |
| Tandai panen terkirim | `PATCH /api/contracts/{id}/sent` |
| Konfirmasi terima (selesai) | `PATCH /api/contracts/{id}/complete` |
| Notifikasi real-time saat status berubah | WebSocket / push |

---

## 7. Checklist Verifikasi
- [ ] Petani buat kontrak → muncul di "Tawaran Terbuka" pemasok
- [ ] Pemasok tanda tangan → petani lihat status `aktif` + nama pembeli
- [ ] Petani tandai panen terkirim → pemasok lihat `panen_terkirim`
- [ ] Pemasok konfirmasi terima → `selesai`
- [ ] Nilai kontrak = qty × harga, benar
- [ ] Refresh browser → data kontrak tetap tersimpan
