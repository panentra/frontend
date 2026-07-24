# 🎨 Panentra - Design System & UI Guidelines for AI Agents

Dokumen ini berisi pedoman sistem desain (*Design System*) aplikasi **Panentra** untuk memastikan konsistensi visual, tata letak, komponen UI, serta panduan bagi AI Agent / LLM Coding Assistant ketika menyusun code UI pada komponen Next.js / Tailwind CSS.

---

## 📌 Context & Overview

- **Nama Aplikasi**: Panentra (*Menghubungkan Panen dengan Peluang*)
- **Target Platform**: Web Progressive App (PWA) — **Mobile First Layout** (`max-width: 480px` centered canvas pada viewport desktop).
- **Domain**: Agriculture / Agrotech Marketplace & Smart Farming.
- **Vibe & Style**: Modern, Clean, Glassmorphic Accent, Organic-Professional, Accessible.

---

## 🎨 Color Palette & Tokens

Sistem warna Panentra menggunakan tema **Agro-Professional** yang segar, natural, dan berkontras tinggi untuk kemudahan membaca di outdoor/lapangan.

### Primary Colors
- **Primary Base**: `#1B5E20` (Dark Forest Green) — *Main CTA, Header Backgrounds, Active Nav Items*
- **Primary Hover/Light**: `#2E7D32` — *Hover States, Primary Badges*
- **Primary Light Container**: `#E8F5E9` — *Selected States, Soft Cards Background*

### Secondary Colors
- **Secondary Accent**: `#4CAF50` (Fresh Green) — *Progress Bars, Secondary Icons, Success Chips*
- **Secondary Soft**: `#A5D6A7` — *Borders, Inactive Steps*

### Functional & Accent Colors
- **Tertiary / Warning (Harvest Amber)**: `#F9A825` — *Price Recommendation Cards, Alert Badges*
- **Danger / Destructive**: `#E53935` — *Delete, Critical Alerts*
- **Info / Water Accent**: `#1E88E5` — *Irrigation Tracking, Info Toast*

### Neutrals
- **Background App**: `#F7F9F7` (Soft Mint White)
- **Card / Surface**: `#FFFFFF` (Pure White)
- **Text Main / High Contrast**: `#1A1C19`
- **Text Muted / Subtitle**: `#5E635E`
- **Border / Divider**: `#E1E4E0`

---

## 🔤 Typography & Font Specs

- **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Scale**:
  - `Display / Heading 1`: `22px` | Bold (`700`) | Line Height: `1.2`
  - `Heading 2`: `18px` | SemiBold (`600`) | Line Height: `1.3`
  - `Heading 3 / Subtitle`: `15px` | Medium (`500`) | Line Height: `1.4`
  - `Body Text`: `14px` | Regular (`400`) / Medium (`500`)
  - `Caption / Micro Label`: `11px - 12px` | Regular (`400`)

---

## 💎 Signature Component: Glassmorphism Bottom Navbar

Navbar utama bawah menggunakan efek transparan berpendar (*Glassmorphism*) agar konten di belakangnya tetap terlihat halus saat di-scroll.

### CSS Standard Specs
```css
.panentra-glass-nav {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 420px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 9999px; /* Pill shape */
  box-shadow: 0 10px 25px -5px rgba(27, 94, 32, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
```

### Tailwind CSS Implementation
```tsx
<nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[420px] bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-xl shadow-green-900/10 px-5 py-2.5 flex justify-around items-center z-50">
  {/* Nav Items */}
</nav>
```

---

## 🧩 UI Layout & Container Structure

Seluruh halaman PWA harus dibungkus dengan kontainer bertipe **Mobile Viewport Shell**:

```tsx
// layout.tsx or Main Container
export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center">
      <main className="w-full max-w-[440px] min-h-screen bg-[#F7F9F7] text-[#1A1C19] relative pb-24 shadow-2xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
```

---

## 🎛️ Input & Button Component Standards

### 1. Primary Action Button
- **Background**: `#1B5E20` (`bg-[#1B5E20]`)
- **Text Color**: White (`text-white`)
- **Shape**: Full Pill (`rounded-full`)
- **Font Weight**: SemiBold (`font-semibold`)
- **Height**: `48px` - `52px` (Touch friendly)

```tsx
<button className="w-full h-12 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2">
  Masuk
</button>
```

### 2. Segmented Role Switcher (Petani / Pemasok)
- **Container**: `bg-[#E8EBE8]` dengan `rounded-full` dan `p-1`
- **Active Tab**: `bg-[#1B5E20]` / White Card dengan `text-[#1B5E20]` atau white text depending on contrast mode.

### 3. Glass / Soft Form Inputs
- **Border**: `border border-[#4CAF50]/40 focus:border-[#1B5E20]`
- **Background**: White `bg-white`
- **Border Radius**: `rounded-2xl` atau `rounded-xl`
- **Padding**: `px-4 py-3`

---

## 📑 Page UI Patterns & Examples

### A. Jual Hasil Panen & Smart Recommendation Card
- Gunakan Card bertema Amber (`#F9A825` atau `bg-amber-100`) untuk penyorotan harga rekomendasi AI.
- Dolar/Rupiah Value: Bold Large (`text-lg font-bold text-amber-900`).

### B. Kalender Tani Grid (Heatmap Tanam)
- Petak aktivitas harian menggunakan grid bulat/persegi kecil (`w-3 h-3 rounded-sm`).
- Warna Kategori:
  - 🟢 **Pupuk**: Green (`#4CAF50`)
  - 🔵 **Air**: Blue (`#1E88E5`)
  - 🟡 **Panen**: Yellow/Amber (`#F9A825`)

---

## 🤖 Prompt Guidelines for AI Coding Agents

Ketika meminta AI Agent untuk membuat komponen baru di Panentra, sertakan atau pastikan AI mematuhi instruksi berikut:

1. **Selalu gunakan kelas Tailwind dengan token warna utama `#1B5E20`** untuk elemen interaktif utama.
2. **Jangan buat desain full-desktop**; selalu gunakan struktur layout berpola `max-w-[440px]` terpusat.
3. **Bottom Navigation harus berbentuk Pill Glassmorphism** (`rounded-full` dengan `backdrop-blur`).
4. **Gunakan sudut tumpul (rounded corners)** minimal `rounded-xl` hingga `rounded-3xl` pada semua Card untuk nuansa modern dan ramah pengguna.
5. **Gunakan Ikon dari `lucide-react`** dengan ukuran standar `20px` atau `24px` dan `strokeWidth={2}`.
