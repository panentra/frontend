"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  Wallet,
  Package,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  ShoppingBag,
  Plus,
  Home,
  User,
  History,
  Store,
  Sprout,
} from "lucide-react";
import Button from "./Button";
import BottomNavbarPemasok from "./BottomNavbarPemasok";
import PasarHargaPemasokView from "./PasarHargaPemasokView";
import PengantaranPemasokView from "./PengantaranPemasokView";
import AkunPemasokView from "./AkunPemasokView";

// Sample Nearby Farmer Harvests (Sans-emoji)
const NEARBY_HARVESTS = [
  {
    id: 1,
    farmerName: "Pak Budi",
    farmLocation: "Desa Sukamaju (3.2 km)",
    commodity: "Padi Ciherang Super",
    category: "Pangan",
    stock: "800 kg",
    price: "Rp 6.450",
    unit: "/kg",
    harvestDate: "Siap Panen Besok",
    rating: "4.9",
    isBestDeal: true,
  },
  {
    id: 2,
    farmerName: "Ibu Sri Rahayu",
    farmLocation: "Desa Karanganyar (5.1 km)",
    commodity: "Cabai Rawit Merah Super",
    category: "Bahan-Bahan",
    stock: "150 kg",
    price: "Rp 38.000",
    unit: "/kg",
    harvestDate: "Panen Hari Ini",
    rating: "5.0",
    isBestDeal: false,
  },
  {
    id: 3,
    farmerName: "Pak Agus",
    farmLocation: "Desa Ngaglik (2.8 km)",
    commodity: "Tomat Organik Fresh",
    category: "Bahan-Bahan",
    stock: "300 kg",
    price: "Rp 12.000",
    unit: "/kg",
    harvestDate: "Siap Panen Lusa",
    rating: "4.8",
    isBestDeal: true,
  },
];

export default function DashboardPemasok() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun">("beranda");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedHarvest, setSelectedHarvest] = useState<typeof NEARBY_HARVESTS[0] | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Buy Form States
  const [buyQuantity, setBuyQuantity] = useState<string>("50");
  const [deliveryAddress, setDeliveryAddress] = useState("Jl. Swadaya II, Condongcatur, Sleman (Toko Sembako Berkah)");
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");
  const [buySuccessMessage, setBuySuccessMessage] = useState<string | null>(null);

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuySuccessMessage(`Pesanan ${selectedHarvest?.commodity || "Pasokan"} berhasil dibuat. Menunggu konfirmasi Petani.`);
    setTimeout(() => {
      setBuySuccessMessage(null);
      setShowBuyModal(false);
      setSelectedHarvest(null);
    }, 1500);
  };

  const filteredHarvests = selectedCategory === "Semua"
    ? NEARBY_HARVESTS
    : NEARBY_HARVESTS.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center font-sans">
      {/* Mobile Viewport Shell Canvas */}
      <main className="w-full max-w-[440px] min-h-screen bg-white text-[#1A1C19] relative pb-28 shadow-2xl overflow-x-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-60 left-0 w-72 h-72 bg-[#4CAF50]/6 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="p-4 sm:p-5 relative z-10 space-y-5">
          {activeTab === "pasar" && <PasarHargaPemasokView />}
          {activeTab === "pengantaran" && <PengantaranPemasokView />}
          {activeTab === "akun" && <AkunPemasokView />}

          {activeTab === "beranda" && (
            <>
              {/* ================= 1. TOP HEADER & ROLE SWITCHER ================= */}
              {/* User Greeting */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight">
              Halo, Toko Berkah
            </h1>
            <p className="text-xs font-semibold text-[#1B5E20]">
              Dashboard Pemasok / Pembeli
            </p>
          </div>

          {/* ================= 2. CARD: RINGKASAN PEMBELIAN (UNIFIED CARD DESIGN) ================= */}
          <section className="rounded-[32px] overflow-hidden shadow-md border border-[#E1E4E0] bg-white">
            {/* Top Dark Green Hero Section */}
            <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] p-5 sm:p-6 text-white relative overflow-hidden flex items-center min-h-[150px]">
              {/* Subtle ambient light shapes */}
              <div className="absolute top-0 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Text Content */}
              <div className="space-y-1.5 z-10 max-w-[62%]">
                <span className="text-[11px] font-extrabold text-emerald-200 uppercase tracking-wider block">
                  Total Pembelian Bulan Ini
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                  <span className="text-lg font-bold text-emerald-200">Rp</span>
                  <span>14,25 Jt</span>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                  450 kg pasokan dipesan dari 12 mitra petani terverifikasi!
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
                    450 kg Dipesan
                  </span>
                  <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
                    12 Mitra Petani
                  </span>
                </div>
              </div>

              {/* Mascot Image on Right (bowo-calendar.png) */}
              <div className="absolute -right-2 -bottom-2 z-10 w-36 h-36 sm:w-40 sm:h-40 pointer-events-none">
                <Image
                  src="/assets/bowo-calendar.png"
                  alt="Bowo Calendar AI Panentra"
                  width={150}
                  height={150}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Bottom White Progress Section */}
            <div className="bg-white p-5 space-y-3">
              {/* Progress Title & Days Count */}
              <div className="flex justify-between items-center text-sm sm:text-base font-black text-[#374151]">
                <span>Progress: 25 / 30 Hari</span>
              </div>

              {/* Smooth Gray Pill Progress Track */}
              <div className="w-full h-4 bg-[#E5E7EB] rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-[#1B5E20] rounded-full transition-all duration-500"
                  style={{ width: "83.3%" }}
                />
              </div>
            </div>
          </section>

          {/* ================= 3. RADAR PASOKAN TANI TERDEKAT ================= */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#E1E4E0] space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1B5E20]" />
                <span>Pasokan Tani Siap Beli</span>
              </h2>
              <span className="text-[10px] font-bold text-[#1B5E20] bg-emerald-50 px-2 py-0.5 rounded-full">
                Area Sleman & Malang
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {["Semua", "Pangan", "Bahan-Bahan", "Sayuran"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#1B5E20] text-white shadow-sm"
                      : "bg-[#F8FAF8] text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Harvest Cards Grid */}
            <div className="space-y-3">
              {filteredHarvests.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#F8FAF8] border border-gray-200/80 rounded-2xl flex flex-col space-y-2.5 hover:border-[#1B5E20]/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center shrink-0 shadow-sm">
                      <Sprout className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#1A1C19] truncate">
                          {item.commodity}
                        </h3>
                        {item.isBestDeal && (
                          <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full">
                            Best Deal
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium flex items-center gap-1">
                        <span className="font-bold text-[#111827]">{item.farmerName}</span> • {item.farmLocation}
                      </p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-extrabold text-[#1B5E20]">
                          {item.price} <span className="text-[9px] font-normal text-gray-500">{item.unit}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          Stok: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHarvest(item);
                        setShowBuyModal(true);
                      }}
                      className="flex-1 py-1.5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Beli Pasokan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Menghubungkan pesan langsung ke ${item.farmerName}...`)}
                      className="py-1.5 px-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Chat Nego
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= 4. PREDIKSI HARGA & MARGIN PEMBELI ================= */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#E1E4E0] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#1A1C19] tracking-tight">
                Transparansi & Margin Harga
              </h2>
              <span className="text-[10px] font-bold text-[#1B5E20] bg-emerald-50 px-2 py-0.5 rounded-full">
                Harga Petani vs Pasar
              </span>
            </div>

            {/* Over-Supply Buyer AI Insight Callout Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <span className="font-bold">Insight Pembeli AI:</span> Cabai Rawit sedang panen raya di area Sleman/Malang (-5%). Momen tepat borong pasokan langsung dari petani dengan potensi margin penjualan hingga <span className="font-bold underline">+22%</span>!
              </p>
            </div>

            {/* Price Comparison Summary Card */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-medium block">Rata-rata Harga Petani</span>
                <span className="text-sm font-extrabold text-[#1B5E20] block mt-0.5">Rp 6.450 /kg</span>
                <span className="text-[9px] text-emerald-700 font-semibold">Harga Langsung Lahan</span>
              </div>
              <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-medium block">Harga Grosir Pasar</span>
                <span className="text-sm font-extrabold text-gray-800 block mt-0.5">Rp 8.200 /kg</span>
                <span className="text-[9px] text-amber-700 font-semibold">Hemat Rp 1.750/kg</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>

        {/* ================= 5. QUICK BUY DIRECT MODAL ================= */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 space-y-4 relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#1A1C19] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#1B5E20]" />
                  Beli Pasokan Langsung Petani
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBuyModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {buySuccessMessage ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center text-xs font-bold text-[#1B5E20] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#1B5E20] mx-auto" />
                  <p>{buySuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleBuySubmit} className="space-y-3 text-xs">
                  {/* Selected Item Info Card */}
                  {selectedHarvest && (
                    <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#1A1C19] text-xs">
                          {selectedHarvest.commodity}
                        </span>
                        <span className="text-[10px] font-extrabold text-[#1B5E20] bg-emerald-50 px-2 py-0.5 rounded-full">
                          {selectedHarvest.price}{selectedHarvest.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Petani: {selectedHarvest.farmerName} • {selectedHarvest.farmLocation}
                      </p>
                    </div>
                  )}

                  {/* Quantity Input */}
                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Jumlah Pembelian (kg)</label>
                    <input
                      type="number"
                      placeholder="Masukkan jumlah kg"
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20]"
                      required
                      min="1"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Alamat Tujuan Pengiriman</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20] resize-none"
                      required
                    />
                  </div>

                  {/* Metode Pembayaran */}
                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Metode Pembayaran</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20]"
                    >
                      <option value="BCA Virtual Account">BCA Virtual Account</option>
                      <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                      <option value="BRI Virtual Account">BRI Virtual Account</option>
                      <option value="GoPay / E-Wallet">GoPay / E-Wallet</option>
                      <option value="Bayar di Tempat (COD)">Bayar Saat Pasokan Tiba (COD)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="md" className="w-full justify-center mt-2">
                    Konfirmasi & Buat Pesanan
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= 6. GLASSMORPHISM BOTTOM NAVBAR (PEMASOK) ================= */}
        <BottomNavbarPemasok
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPlusClick={() => {
            setSelectedHarvest(NEARBY_HARVESTS[0]);
            setShowBuyModal(true);
          }}
        />
      </main>
    </div>
  );
}
