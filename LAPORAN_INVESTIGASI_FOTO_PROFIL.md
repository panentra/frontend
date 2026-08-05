# 🔍 Laporan Investigasi: Upload Foto Profil Petani & Pemasok Tidak Bisa

> Tanggal investigasi: 5 Agustus 2026
> Base API: `https://senoaji.daffahmad.my.id`

---

## 1. Ringkasan

| Pertanyaan | Jawaban |
|---|---|
| Apakah ada tombol/UI upload foto profil? | ❌ **Tidak ada**. Form Edit Profil hanya berisi Nama + No. HP (tidak ada input file/foto). |
| Apakah backend punya endpoint upload foto profil? | ❌ **Tidak ada** — semua kandidat endpoint balas **404**. |
| Apakah data profil tersimpan ke API? | ❌ Tidak. `PATCH /api/user` tidak didukung (`/api/user` hanya GET), penyimpanan profil masih lokal. |

---

## 2. Temuan Frontend

### 2.1 Modal "Edit Profil" Petani (`AkunKeuanganView.tsx`)
- Hanya ada **2 input**: `Nama` dan `No. Handphone`.
- **Tidak ada** elemen `<input type="file">`, tombol upload, maupun preview foto.
- Tombol "Simpan Profil" hanya `setShowEditProfileModal(false)` + toast `"Profil berhasil diperbarui!"` — **tanpa panggilan API** (data tidak tersimpan ke server).

### 2.2 Profil Pemasok (`AkunPemasokView.tsx`)
- Header profil hanya ikon `Store` statis + nama "Toko Sembako Berkah Jaya".
- **Tidak ada** UI upload/ganti foto profil sama sekali.

---

## 3. Temuan Backend (Uji Live API)

Semua kandidat endpoint diuji dengan token valid:

```
404  POST /api/user/avatar
404  POST /api/upload/avatar
404  POST /api/user/photo
404  POST /api/profile/avatar
404  POST /api/upload
```

- `/api/user` hanya mendukung **GET** (`PATCH /api/user` → error "method not supported").
- Tidak ada endpoint penyimpanan file/avatar untuk user.

---

## 4. Root Cause

| Lapisan | Masalah |
|---|---|
| **Frontend** | UI Edit Profil tidak menyediakan input foto profil → user secara teknis tidak punya cara upload. |
| **Backend** | Tidak ada endpoint untuk menyimpan file avatar maupun field `avatar` pada user → kalaupun frontend dikirim, tidak tersimpan. |

Jadi: **bukan bug render**, tapi **fitur upload foto profil memang belum ada** — di sisi UI maupun API.

---

## 5. Spesifikasi yang Dibutuhkan (draft untuk Backend)

### 5.1 Endpoint Upload Avatar (disarankan)
```
POST /api/upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
Part: avatar (file, image/jpeg|png|webp, max 2MB)

Response 200 OK:
{
  "data": {
    "avatar_url": "https://cdn.panentra.com/avatars/9-abc123.jpg"
  }
}
```

### 5.2 Endpoint Update Profil User
```
PATCH /api/user
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Pak Budi Santoso",
  "phone": "0812-3456-7890",
  "avatar_url": "https://cdn.panentra.com/avatars/9-abc123.jpg"
}

Response 200 OK: { "data": { "id": 9, "name": "...", "email": "...", "avatar_url": "..." } }
```

### 5.3 Model User — tambah kolom
```
avatar_url  string nullable   // URL gambar profil
phone       string nullable   // (jika belum ada)
```

### 5.4 Refleksikan `avatar_url` di response
- `GET /api/user`
- `GET /api/supplier/marketplace` → `farmerAvatar`
- `GET /api/supplier/listings/{id}` → `farmerAvatar`
- `GET /api/chats` → `counterpart.avatar`

---

## 6. Rencana Integrasi Frontend (setelah backend siap)

1. Tambah area upload foto di Modal Edit Profil (petani & pemasok):
   - `<input type="file" accept="image/*">` + preview lingkaran.
   - Kirim file → `POST /api/upload/avatar` → dapat `avatar_url`.
2. Tombol Simpan → `PATCH /api/user` dengan `name`, `phone`, `avatar_url`.
3. Tampilkan `avatar_url` pada header profil, marketplace (`farmerAvatar`), dan avatar chat.

---

## 7. Catatan

- Saat ini semua `farmerAvatar` / `counterpart.avatar` di response API bernilai `null` (belum ada yang tersimpan).
- Begitu backend menyediakan endpoint di atas, integrasi frontend bisa langsung dikerjakan.
