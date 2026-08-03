"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Menu,
  Bell,
  ChevronDown,
  Sprout,
  TrendingUp,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import BottomNavbar from "./BottomNavbar";
import Button from "./Button";
import KalenderView from "./KalenderView";
import PesananView from "./PesananView";
import AkunKeuanganView from "./AkunKeuanganView";

// Sample commodities for price prediction chart
const COMMODITY_PRICE_DATA = {
  Beras: {
    unit: "/kg",
    currentPrice: "Rp 6.450",
    change: "+8%",
    isOverSupply: false,
    tooltipDate: "23 Mei 2025",
    points: [
      { date: "19 Mei", price: 4800, y: 110 },
      { date: "20 Mei", price: 5000, y: 100 },
      { date: "21 Mei", price: 4900, y: 105 },
      { date: "22 Mei", price: 6000, y: 50 },
      { date: "23 Mei", price: 5500, y: 75, active: true },
      { date: "24 Mei", price: 5800, y: 60 },
      { date: "25 Mei", price: 6450, y: 35 },
    ],
  },
  "Cabai Merah": {
    unit: "/kg",
    currentPrice: "Rp 38.500",
    change: "-5%",
    isOverSupply: true,
    tooltipDate: "23 Mei 2025",
    points: [
      { date: "19 Mei", price: 45000, y: 30 },
      { date: "20 Mei", price: 44000, y: 35 },
      { date: "21 Mei", price: 42000, y: 45 },
      { date: "22 Mei", price: 40000, y: 55 },
      { date: "23 Mei", price: 38500, y: 65, active: true },
      { date: "24 Mei", price: 37000, y: 75 },
      { date: "25 Mei", price: 36000, y: 80 },
    ],
  },
  Tomat: {
    unit: "/kg",
    currentPrice: "Rp 12.000",
    change: "+15%",
    isOverSupply: false,
    tooltipDate: "23 Mei 2025",
    points: [
      { date: "19 Mei", price: 9000, y: 120 },
      { date: "20 Mei", price: 9500, y: 110 },
      { date: "21 Mei", price: 10000, y: 95 },
      { date: "22 Mei", price: 11000, y: 70 },
      { date: "23 Mei", price: 12000, y: 50, active: true },
      { date: "24 Mei", price: 12500, y: 40 },
      { date: "25 Mei", price: 13000, y: 30 },
    ],
  },
  Pakcoy: {
    unit: "/kg",
    currentPrice: "Rp 8.500",
    change: "+4%",
    isOverSupply: false,
    tooltipDate: "23 Mei 2025",
    points: [
      { date: "19 Mei", price: 7500, y: 100 },
      { date: "20 Mei", price: 7800, y: 90 },
      { date: "21 Mei", price: 8000, y: 80 },
      { date: "22 Mei", price: 8200, y: 70 },
      { date: "23 Mei", price: 8500, y: 60, active: true },
      { date: "24 Mei", price: 8700, y: 50 },
      { date: "25 Mei", price: 9000, y: 40 },
    ],
  },
  Kopi: {
    unit: "/kg",
    currentPrice: "Rp 75.000",
    change: "+18%",
    isOverSupply: false,
    tooltipDate: "23 Mei 2025",
    points: [
      { date: "19 Mei", price: 60000, y: 110 },
      { date: "20 Mei", price: 62000, y: 100 },
      { date: "21 Mei", price: 65000, y: 85 },
      { date: "22 Mei", price: 70000, y: 60 },
      { date: "23 Mei", price: 75000, y: 40, active: true },
      { date: "24 Mei", price: 78000, y: 30 },
      { date: "25 Mei", price: 80000, y: 20 },
    ],
  },
};

export default function DashboardPetani() {
  const [activeTab, setActiveTab] = useState<"beranda" | "kalender" | "jual" | "pesanan" | "akun">("beranda");
  const [selectedCommodity, setSelectedCommodity] = useState<keyof typeof COMMODITY_PRICE_DATA>("Beras");
  const [selectedDate, setSelectedDate] = useState<number>(22);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Quick Sale Form States
  const [saleItemName, setSaleItemName] = useState("");
  const [saleCategory, setSaleCategory] = useState("Bahan-Bahan");
  const [salePrice, setSalePrice] = useState("");
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string | null>(null);

  const activeData = COMMODITY_PRICE_DATA[selectedCommodity];

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSuccessMessage("Hasil panen berhasil diunggah ke Marketplace Panentra!");
    setTimeout(() => {
      setSaleSuccessMessage(null);
      setShowSaleModal(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center font-sans">
      {/* Mobile Viewport Shell Canvas */}
      <main className="w-full max-w-[440px] min-h-screen bg-white text-[#1A1C19] relative pb-28 shadow-2xl overflow-x-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-60 left-0 w-72 h-72 bg-[#4CAF50]/6 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="p-4 sm:p-5 relative z-10 space-y-5">
          {activeTab === "kalender" && <KalenderView />}
          {activeTab === "pesanan" && <PesananView />}
          {activeTab === "akun" && <AkunKeuanganView />}

          {activeTab === "beranda" && (
            <>
              {/* ================= 1. TOP HEADER & GREETING ================= */}
              {/* User Greeting */}
              <div className="space-y-0.5">
                <h1 className="text-2xl font-extrabold text-[#1A1C19] tracking-tight">
                  Halo, Andi
                </h1>
                <p className="text-xs font-semibold text-[#1B5E20]">
                  Dashboard Petani
                </p>
              </div>

              {/* ================= 2. CARD: RINGKASAN HARI INI (UNIFIED CARD DESIGN) ================= */}
              <section className="rounded-[32px] overflow-hidden shadow-md border border-[#E1E4E0] bg-white">
                {/* Top Dark Green Hero Section */}
                <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] p-5 sm:p-6 text-white relative overflow-hidden flex items-center min-h-[150px]">
                  {/* Subtle ambient light shapes */}
                  <div className="absolute top-0 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Text Content */}
                  <div className="space-y-1.5 z-10 max-w-[62%]">
                    <span className="text-[11px] font-extrabold text-emerald-200 uppercase tracking-wider block">
                      Estimasi Hasil Panen
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                      <span>1.280</span>
                      <span className="text-sm font-bold text-emerald-200">kg</span>
                    </div>

                    <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                      Diprediksi siap panen 3 hari lagi. Siap dipasarkan ke 12 mitra pembeli!
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
                        Rp 6.450/kg
                      </span>
                      <span className="bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
                        3 Pesanan Aktif
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
                    <span>Progress: 68 / 90 Hari</span>
                  </div>

                  {/* Smooth Gray Pill Progress Track */}
                  <div className="w-full h-4 bg-[#E5E7EB] rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-[#1B5E20] rounded-full transition-all duration-500"
                      style={{ width: "75.5%" }}
                    />
                  </div>
                </div>
              </section>

              {/* ================= 3. RUTINITAS HARIAN (DAILY ROUTINE) ================= */}
              <section className="space-y-3">
                <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                  Rutinitas Harian (Daily Routine)
                </h2>
                <div className="space-y-2.5">
              {/* Routine Card 1: Check-In Lahan Harian */}
              <button
                type="button"
                onClick={() => alert("Check-In Lahan Harian berhasil dicatat!")}
                className="w-full bg-[#EBF7EE] border border-emerald-100/90 hover:border-emerald-300 rounded-[24px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[74px]"
              >
                {/* Large Clipped Mascot Character */}
                <div className="absolute -left-2 -bottom-2.5 z-10 w-22 h-22 sm:w-24 sm:h-24 pointer-events-none">
                  <Image
                    src="/assets/bowo-senang.png"
                    alt="Bowo Check-In Lahan"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="space-y-0.5 z-10">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Check-In Lahan Harian
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-tight">
                    Klik untuk catat kondisi & kelembapan lahan
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-400 group-hover:text-[#1B5E20] group-hover:bg-white transition-all shrink-0 z-10 ml-2">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>

              {/* Routine Card 2: Jadwal Pemupukan & Takaran */}
              <button
                type="button"
                onClick={() => alert("Rekomendasi Pemupukan & Takaran Presisi AI")}
                className="w-full bg-[#EBF7EE] border border-emerald-100/90 hover:border-emerald-300 rounded-[24px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[74px]"
              >
                {/* Large Clipped Mascot Character */}
                <div className="absolute -left-2 -bottom-2.5 z-10 w-22 h-22 sm:w-24 sm:h-24 pointer-events-none">
                  <Image
                    src="/assets/budi-kaget.png"
                    alt="Jadwal Pemupukan AI"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="space-y-0.5 z-10">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Jadwal & Takaran Pupuk
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-tight">
                    Rekomendasi AI dosis pupuk & kebutuhan nutrisi
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-400 group-hover:text-[#1B5E20] group-hover:bg-white transition-all shrink-0 z-10 ml-2">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>

              {/* Routine Card 3: Tombol Darurat Hama / Cuaca */}
              <button
                type="button"
                onClick={() => alert("Membuka Diagnosa Tombol Darurat AI Hama & Penyakit...")}
                className="w-full bg-[#EBF7EE] border border-emerald-100/90 hover:border-emerald-300 rounded-[24px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[74px]"
              >
                {/* Large Clipped Mascot Character */}
                <div className="absolute -left-2 -bottom-2.5 z-10 w-22 h-22 sm:w-24 sm:h-24 pointer-events-none">
                  <Image
                    src="/assets/bowo-ngeluh.png"
                    alt="Tombol Darurat Hama AI"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="space-y-0.5 z-10">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Tombol Darurat Hama
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-tight">
                    Dapatkan penanganan instan AI saat penyakit timbul
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-400 group-hover:text-[#1B5E20] group-hover:bg-white transition-all shrink-0 z-10 ml-2">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>
            </div>
          </section>

          {/* ================= 4. CARD: PREDIKSI HARGA KOMODITAS ================= */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#E1E4E0] space-y-3">
            {/* Header with Commodity Selector Dropdown */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#1A1C19] tracking-tight">
                Prediksi Harga Komoditas
              </h2>

              <div className="relative">
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value as keyof typeof COMMODITY_PRICE_DATA)}
                  className="appearance-none bg-[#F8FAF8] border border-gray-200 text-[#1A1C19] font-bold text-xs py-1.5 pl-3 pr-7 rounded-xl outline-none cursor-pointer focus:border-[#1B5E20]"
                >
                  <option value="Beras">Beras</option>
                  <option value="Cabai Merah">Cabai Merah</option>
                  <option value="Tomat">Tomat</option>
                  <option value="Pakcoy">Pakcoy</option>
                  <option value="Kopi">Kopi</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Price AI Transparansi & Over-Supply Insight Callout Banner */}
            <div className={`p-3 rounded-2xl flex items-start gap-2.5 text-xs ${activeData.isOverSupply
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-emerald-50 border border-emerald-200 text-[#1B5E20]"
              }`}>
              {activeData.isOverSupply ? (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-[11px] leading-relaxed">
                <span className="font-bold">
                  {activeData.isOverSupply ? "Warning Over-Supply AI: " : "Transparansi Harga AI: "}
                </span>
                {activeData.isOverSupply
                  ? `Pasokan ${selectedCommodity} melimpah minggu ini. Disarankan tunda panen raya 3 hari untuk harga optimal.`
                  : `Harga ${selectedCommodity} diprediksi naik ${activeData.change}. Bebas risiko Over-Supply minggu ini.`}
              </div>
            </div>

            {/* Interactive SVG Smooth Curve Chart */}
            <div className="relative pt-6 pb-2">
              {/* Tooltip Pin Badge on Active Date */}
              <div className="absolute top-0 left-[58%] -translate-x-1/2 bg-white rounded-2xl px-3 py-1.5 shadow-lg border border-gray-100 flex flex-col items-center z-10 animate-bounce">
                <span className="text-xs font-extrabold text-[#1A1C19]">
                  {activeData.currentPrice} <span className="text-[9px] font-normal text-gray-500">{activeData.unit}</span>
                </span>
                <span className="text-[9px] font-medium text-gray-400">{activeData.tooltipDate}</span>
                <div className="w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 -mb-2 -mt-1" />
              </div>

              {/* Chart Canvas Container */}
              <div className="w-full h-36 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 140">
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="20" x2="350" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="5" y="18" fill="#94A3B8" fontSize="9" fontWeight="bold">7K</text>

                  <line x1="0" y1="50" x2="350" y2="50" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="5" y="48" fill="#94A3B8" fontSize="9" fontWeight="bold">6K</text>

                  <line x1="0" y1="80" x2="350" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="5" y="78" fill="#94A3B8" fontSize="9" fontWeight="bold">5K</text>

                  <line x1="0" y1="110" x2="350" y2="110" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="5" y="108" fill="#94A3B8" fontSize="9" fontWeight="bold">4K</text>

                  <path
                    d="M 15,100 C 60,95 100,110 140,70 C 180,40 210,85 245,60 C 280,40 310,60 340,30 L 340,125 L 15,125 Z"
                    fill="url(#greenGradient)"
                  />

                  <path
                    d="M 15,100 C 60,95 100,110 140,70 C 180,40 210,85 245,60 C 280,40 310,60 340,30"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle cx="212" cy="72" r="6" fill="#1B5E20" />
                  <circle cx="212" cy="72" r="10" fill="#4CAF50" fillOpacity="0.3" />
                </svg>
              </div>

              {/* X-Axis Date Labels */}
              <div className="flex justify-between text-[10px] font-semibold text-gray-400 px-1 mt-1">
                {activeData.points.map((pt, idx) => (
                  <span
                    key={idx}
                    className={pt.active ? "text-[#1B5E20] font-bold" : ""}
                  >
                    {pt.date}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 4. CARD: KALENDER PERTANIAN ================= */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#E1E4E0] space-y-3.5">
            {/* Header & Month Switcher */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#1A1C19] tracking-tight">
                Kalender Pertanian
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-[#1A1C19]">Mei 2025</span>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weekly Date Picker Strip */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { day: "Sen", date: 19 },
                { day: "Sel", date: 20 },
                { day: "Rab", date: 21 },
                { day: "Kam", date: 22 },
                { day: "Jum", date: 23 },
                { day: "Sab", date: 24 },
                { day: "Min", date: 25 },
              ].map((item) => {
                const isActive = selectedDate === item.date;
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`py-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${isActive
                        ? "bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] text-white shadow-md shadow-green-900/20"
                        : "bg-[#F8FAF8] text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-[10px] font-medium opacity-80">{item.day}</span>
                    <span className="text-xs font-extrabold mt-0.5">{item.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Day Task Card */}
            <div className="bg-[#F8FAF8] border border-gray-200/80 rounded-2xl p-3.5 flex flex-col space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#1A1C19]">Fase Pemanenan</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Padi Ciherang (Lahan A)</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-[#1B5E20]">70%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-full transition-all duration-500"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          </section>
        </>
      )}

        {/* ================= 5. QUICK SALE MODAL ================= */}
        {showSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#1A1C19] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#1B5E20]" />
                  Input Penjualan Hasil Panen
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {saleSuccessMessage ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center text-xs font-bold text-[#1B5E20] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#1B5E20] mx-auto" />
                  <p>{saleSuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSaleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Upload Foto Panen</label>
                    <div className="w-full h-24 bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1B5E20] transition-all">
                      <Upload className="w-5 h-5 text-[#1B5E20] mb-1" />
                      <span className="text-[10px] font-bold text-[#1B5E20]">Upload Foto Komoditas</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Nama Komoditas / Varietas</label>
                    <input
                      type="text"
                      placeholder="Contoh: Cabai Rawit Merah Super"
                      value={saleItemName}
                      onChange={(e) => setSaleItemName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Kategori Komoditas</label>
                    <select
                      value={saleCategory}
                      onChange={(e) => setSaleCategory(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20]"
                    >
                      <option value="Bahan-Bahan">Bahan-Bahan (Cabai, Tomat, Bawang)</option>
                      <option value="Sayuran">Sayuran (Pakcoy, Selada, Kangkung)</option>
                      <option value="Tanaman Perkebunan">Tanaman Perkebunan (Sawit, Kopi, Kakao)</option>
                      <option value="Pangan">Pangan (Padi, Jagung, Kedelai)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#374151] mb-1 block">Biaya Jual / Harga (Rp/kg)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 35000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl outline-none focus:border-[#1B5E20]"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" className="w-full justify-center mt-2">
                    Jual Sekarang ke Pembeli
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
        </div>

        {/* ================= 6. GLASSMORPHISM BOTTOM NAVBAR ================= */}
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPlusClick={() => setShowSaleModal(true)}
        />
      </main>
    </div>
  );
}
