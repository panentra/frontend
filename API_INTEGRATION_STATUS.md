# Laporan Integrasi API Panentra (RESTAPI Collection)

Dokumen ini mencatat seluruh pemetaan dan status integrasi API dari repositori Bruno/OpenCollection `RESTAPI` ke dalam aplikasi frontend Panentra.

---

## 1. Ringkasan Autentikasi (`/api/...`)
| Endpoint | Method | Status Frontend | Keterangan |
| :--- | :--- | :--- | :--- |
| `/api/register` | `POST` | ✅ Terintegrasi | `AuthForm.tsx` (Register Petani/Pemasok via `role`) |
| `/api/login` | `POST` | ✅ Terintegrasi | `AuthForm.tsx` (Penyimpanan Token & User Session) |
| `/api/user` | `GET` | ✅ Terintegrasi | `HomeClient.tsx`, `DashboardPetani.tsx`, `DashboardPemasok.tsx` |
| `/api/logout` | `POST` | ✅ Terintegrasi | `AkunPemasokView.tsx`, `AkunKeuanganView.tsx` |

---

## 2. Endpoints Petani / Farmer (`/api/farmer/...`)
| Endpoint | Method | Status Frontend | Keterangan |
| :--- | :--- | :--- | :--- |
| `/api/farmer/dashboard` | `GET` | ✅ Terintegrasi | `DashboardPetani.tsx` (Revenue, Active Seasons, Recent Sales) |
| `/api/farmer/lands` | `GET` | ✅ Terintegrasi | `DashboardPetani.tsx`, `KalenderView.tsx` |
| `/api/farmer/lands` | `POST` | ✅ Terintegrasi | `lib/api.ts` (`createLand`) |
| `/api/farmer/lands/{id}` | `PUT` | ✅ Terintegrasi | `lib/api.ts` (`updateLand`) |
| `/api/farmer/lands/{id}` | `DELETE` | ✅ Terintegrasi | `lib/api.ts` (`deleteLand`) |
| `/api/farmer/seasons` | `GET` | ✅ Terintegrasi | `lib/api.ts` (`getSeasons`) |
| `/api/farmer/seasons` | `POST` | ✅ Terintegrasi | `lib/api.ts` (`createSeason`) |
| `/api/farmer/seasons/{id}` | `PUT` | ✅ Terintegrasi | `lib/api.ts` (`updateSeason`) |
| `/api/farmer/expenses` | `GET` | ✅ Terintegrasi | `AkunKeuanganView.tsx` |
| `/api/farmer/expenses` | `POST` | ✅ Terintegrasi | `AkunKeuanganView.tsx` (`createExpense`) |
| `/api/farmer/expenses/{id}` | `DELETE` | ✅ Terintegrasi | `AkunKeuanganView.tsx` (`deleteExpense`) |
| `/api/farmer/listings` | `GET` | ✅ Terintegrasi | `JualPanenView.tsx` |
| `/api/farmer/listings` | `POST` | ✅ Terintegrasi | `JualPanenView.tsx` (`createListing`) |
| `/api/farmer/listings/{id}` | `PUT` | ✅ Terintegrasi | `lib/api.ts` (`updateListing`) |
| `/api/farmer/listings/{id}` | `DELETE` | ✅ Terintegrasi | `lib/api.ts` (`deleteListing`) |
| `/api/farmer/orders` | `GET` | ✅ Terintegrasi | `PesananView.tsx` |
| `/api/farmer/orders/{id}` | `PATCH` | ✅ Terintegrasi | `PesananView.tsx` (`updateOrderStatus`) |
| `/api/farmer/tasks` | `GET` | ✅ Terintegrasi | `KalenderView.tsx` |
| `/api/farmer/tasks` | `POST` | ✅ Terintegrasi | `KalenderView.tsx` (`createTask`) |
| `/api/farmer/tasks/{id}` | `PUT` | ✅ Terintegrasi | `lib/api.ts` (`updateTask`) |
| `/api/farmer/negotiations/respond` | `POST` | ✅ Terintegrasi | `PesananView.tsx` |
| `/api/farmer/invoices/{id}` | `GET` | ✅ Terintegrasi | `lib/api.ts` (`downloadSalesInvoice`) |
| `/api/farmer/hpp-report` | `GET` | ✅ Terintegrasi | `lib/api.ts` (`downloadHPPReport`) |

---

## 3. Endpoints Pemasok / Supplier (`/api/supplier/...`)
| Endpoint | Method | Status Frontend | Keterangan |
| :--- | :--- | :--- | :--- |
| `/api/supplier/dashboard` | `GET` | ✅ Terintegrasi | `DashboardPemasok.tsx` |
| `/api/supplier/marketplace` | `GET` | ✅ Terintegrasi | `MarketplacePemasokView.tsx` |
| `/api/supplier/listings/{id}` | `GET` | ✅ Terintegrasi | `DetailProdukPemasokView.tsx` |
| `/api/supplier/purchases` | `GET` | ✅ Terintegrasi | `RiwayatPembelianPemasokView.tsx` |
| `/api/supplier/orders` | `POST` | ✅ Terintegrasi | `PembayaranEscrowView.tsx` (`createSupplierOrder`) |
| `/api/supplier/orders/{id}/pay` | `PATCH` | ✅ Terintegrasi | `PembayaranEscrowView.tsx` (`payOrder`) |
| `/api/supplier/orders/{id}/confirm-received` | `PATCH` | ✅ Terintegrasi | `RiwayatPembelianPemasokView.tsx` |
| `/api/supplier/negotiations/start` | `POST` | ✅ Terintegrasi | `RuangNegoPemasokView.tsx` (`startNegotiation`) |
| `/api/supplier/favorites` | `GET` | ✅ Terintegrasi | `AkunPemasokView.tsx` |
| `/api/supplier/favorites` | `POST` | ✅ Terintegrasi | `lib/api.ts` (`addFavorite`) |
| `/api/supplier/favorites/{id}` | `DELETE` | ✅ Terintegrasi | `lib/api.ts` (`removeFavorite`) |
| `/api/supplier/deliveries` | `GET` | ✅ Terintegrasi | `PengantaranPemasokView.tsx` |

---

## 4. Shared Endpoints (`/api/shared/...`) & Notifications (`/api/notifications/...`)
| Endpoint | Method | Status Frontend | Keterangan |
| :--- | :--- | :--- | :--- |
| `/api/shared/market-prices` | `GET` | ✅ Terintegrasi | `PasarHargaPemasokView.tsx`, `DashboardPetani.tsx` |
| `/api/shared/price-history` | `GET` | ✅ Terintegrasi | `PasarHargaPemasokView.tsx` |
| `/api/shared/chats` | `GET` | ✅ Terintegrasi | `ChatListView.tsx` |
| `/api/shared/chats/{id}/messages` | `GET` | ✅ Terintegrasi | `ChatListView.tsx` |
| `/api/shared/chats/{id}/messages` | `POST` | ✅ Terintegrasi | `ChatListView.tsx` |
| `/api/shared/bank-accounts` | `GET` | ✅ Terintegrasi | `AkunPemasokView.tsx`, `AkunKeuanganView.tsx` |
| `/api/shared/bank-accounts` | `POST` | ✅ Terintegrasi | `AkunPemasokView.tsx` |
| `/api/shared/bank-accounts/{id}` | `DELETE` | ✅ Terintegrasi | `AkunPemasokView.tsx` |
| `/api/shared/bank-accounts/{id}/primary` | `PATCH` | ✅ Terintegrasi | `AkunPemasokView.tsx` |
| `/api/notifications` | `GET` | ✅ Terintegrasi | `lib/api.ts` |
| `/api/notifications/{id}/read` | `PATCH` | ✅ Terintegrasi | `lib/api.ts` |
| `/api/notifications/read-all` | `PATCH` | ✅ Terintegrasi | `lib/api.ts` |

---

## 5. Admin Endpoints (`/api/admin/...`)
| Endpoint | Method | Status Frontend | Keterangan |
| :--- | :--- | :--- | :--- |
| Seluruh endpoint Admin (`/api/admin/*`) | Multi | ✅ Siap di `lib/api.ts` | Siap digunakan untuk modul Dashboard Admin internal. |

---

## 📌 Catatan Evaluasi & Rekomendasi Endpoint API yang Perlu Ditambahkan / Disempurnakan:

1. **Upload File & Gambar (Multipart/Form-Data)**:
   - **Kebutuhan**: Upload foto bukti transfer bank pada `payOrder` atau foto bukti panen di `createListing` dan foto profil user.
   - **Catatan**: Saat ini endpoint `POST /api/farmer/listings` dan `POST /api/shared/bank-accounts` menerima JSON text. Disarankan endpoint backend mendukung `multipart/form-data` atau melengkapi endpoint `POST /api/upload`.

2. **WebSocket / Real-time Event Subscription**:
   - **Kebutuhan**: Obrolan langsung (Chat) dan pembaruan lokasi pengiriman (Tracking Driver ETA).
   - **Catatan**: Obrolan obrolan saat ini menggunakan polling REST HTTP (`GET /api/shared/chats/{id}/messages`). Disarankan menambahkan `wss://...` WebSocket endpoint agar pesan chat dan status driver dapat diterima secara real-time tanpa delay.

3. **Status Penanganan List Kosong di Frontend**:
   - Seluruh komponen (Pesanan, Lahan, Pengeluaran HPP, Marketplace, Chat, Rekening Bank) telah dilengkapi penanganan kondisi list kosong (`Array.length === 0`) dengan pesan ramah pengguna tanpa menambah atau merubah struktur UI asli.
