"use client";

import React, { useState, useEffect } from "react";
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
  PlusCircle,
  Calendar,
  CloudSun,
  MapPin,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  Coins,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { getAuthUser, getFarmerDashboard, FarmerDashboardData } from "@/lib/api";
import BottomNavbar from "./BottomNavbar";
import Button from "./Button";
import KalenderView from "./KalenderView";
import PesananView from "./PesananView";
import AkunKeuanganView from "./AkunKeuanganView";
import RekomendasiTanamView from "./RekomendasiTanamView";
import JualPanenView from "./JualPanenView";
import ChatListView from "./ChatListView";

// Sample commodities for price prediction chart
const COMMODITY_PRICE_DATA = {
  "Cabai Rawit": {
    unit: "/kg",
    currentPrice: "Rp 38.500",
    change: "+15%",
    isOverSupply: false,
    tooltipDate: "3 Agustus 2026",
    points: [
      { date: "28 Jul", price: 32000, y: 100 },
      { date: "29 Jul", price: 34000, y: 85 },
      { date: "30 Jul", price: 35000, y: 75 },
      { date: "31 Jul", price: 36500, y: 60 },
      { date: "1 Agu", price: 37500, y: 45 },
      { date: "2 Agu", price: 38000, y: 40 },
      { date: "3 Agu", price: 38500, y: 30, active: true },
    ],
  },
  Beras: {
    unit: "/kg",
    currentPrice: "Rp 14.500",
    change: "+5%",
    isOverSupply: false,
    tooltipDate: "3 Agustus 2026",
    points: [
      { date: "28 Jul", price: 13800, y: 110 },
      { date: "29 Jul", price: 14000, y: 100 },
      { date: "30 Jul", price: 14100, y: 90 },
      { date: "31 Jul", price: 14200, y: 80 },
      { date: "1 Agu", price: 14300, y: 70 },
      { date: "2 Agu", price: 14400, y: 60 },
      { date: "3 Agu", price: 14500, y: 50, active: true },
    ],
  },
  Tomat: {
    unit: "/kg",
    currentPrice: "Rp 12.000",
    change: "-8%",
    isOverSupply: true,
    tooltipDate: "3 Agustus 2026",
    points: [
      { date: "28 Jul", price: 15000, y: 30 },
      { date: "29 Jul", price: 14500, y: 40 },
      { date: "30 Jul", price: 13800, y: 55 },
      { date: "31 Jul", price: 13000, y: 70 },
      { date: "1 Agu", price: 12500, y: 80 },
      { date: "2 Agu", price: 12200, y: 90 },
      { date: "3 Agu", price: 12000, y: 100, active: true },
    ],
  },
  Pakcoy: {
    unit: "/kg",
    currentPrice: "Rp 8.500",
    change: "+4%",
    isOverSupply: false,
    tooltipDate: "3 Agustus 2026",
    points: [
      { date: "28 Jul", price: 7500, y: 100 },
      { date: "29 Jul", price: 7800, y: 90 },
      { date: "30 Jul", price: 8000, y: 80 },
      { date: "31 Jul", price: 8200, y: 70 },
      { date: "1 Agu", price: 8300, y: 60 },
      { date: "2 Agu", price: 8400, y: 50 },
      { date: "3 Agu", price: 8500, y: 40, active: true },
    ],
  },
  Jagung: {
    unit: "/kg",
    currentPrice: "Rp 7.200",
    change: "+10%",
    isOverSupply: false,
    tooltipDate: "3 Agustus 2026",
    points: [
      { date: "28 Jul", price: 6200, y: 110 },
      { date: "29 Jul", price: 6400, y: 100 },
      { date: "30 Jul", price: 6600, y: 85 },
      { date: "31 Jul", price: 6800, y: 70 },
      { date: "1 Agu", price: 7000, y: 55 },
      { date: "2 Agu", price: 7100, y: 45 },
      { date: "3 Agu", price: 7200, y: 35, active: true },
    ],
  },
};

// AI Recommendations for Stage 1 (Mau Tanam Apa?)
const AI_CROP_RECOMMENDATIONS = [
  {
    id: "cabai-rawit",
    name: "Cabai Rawit Merah",
    icon: "🌶️",
    seasonFit: "Cocok Kemarau (BMKG)",
    priceTrend: "Harga Naik +15%",
    harvestDuration: "90 Hari",
    reason: "Cocok untuk dataran sedang Lembang. Permintaan industri sambal tinggi & stok pasar sedang tipis.",
    estimatedProfit: "Rp 15.000.000 / 0.5 Ha",
  },
  {
    id: "jagung-manis",
    name: "Jagung Manis Super",
    icon: "🌽",
    seasonFit: "Cocok Transisi Musim",
    priceTrend: "Harga Permintaan Tinggi",
    harvestDuration: "70 Hari",
    reason: "Siklus tanam cepat dengan risiko hama rendah di daerahmu. Pasar pasar swalayan siap menampung.",
    estimatedProfit: "Rp 10.500.000 / 0.5 Ha",
  },
  {
    id: "sawi-hijau",
    name: "Sawi Hijau / Pakcoy",
    icon: "🥬",
    seasonFit: "Cocok Dataran Tinggi",
    priceTrend: "Harga Stabil",
    harvestDuration: "35 Hari",
    reason: "Panen sangat cepat (1 bulan). Cocok untuk perputaran modal harian yang cepat.",
    estimatedProfit: "Rp 6.000.000 / 0.5 Ha",
  },
];

export default function DashboardPetani() {
  const [userName, setUserName] = useState("Andi");
  const [activeTab, setActiveTab] = useState<"beranda" | "kalender" | "jual" | "pesanan" | "chat" | "akun">("beranda");
  const [dashboardData, setDashboardData] = useState<FarmerDashboardData | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user?.name) {
      setUserName(user.name);
    }

    async function loadDashboard() {
      try {
        const data = await getFarmerDashboard();
        if (data) {
          setDashboardData(data);
        }
      } catch (err) {
        console.warn("Gagal memuat farmer dashboard API:", err);
      }
    }
    loadDashboard();
  }, []);
  const [viewMode, setViewMode] = useState<"dashboard" | "rekomendasi" | "jual">("dashboard");
  const [isChatRoomActive, setIsChatRoomActive] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<keyof typeof COMMODITY_PRICE_DATA>("Cabai Rawit");
  const [selectedDate, setSelectedDate] = useState<number>(3);

  // Workflow Modal Control States
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const isAnyModalOpen = showExpenseModal || showSaleModal || showEmergencyModal;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnyModalOpen]);

  // Active Crop State (Workflow Stage 1 Result)
  const [activeCrop, setActiveCrop] = useState({
    name: "Cabai Rawit Merah",
    daysPassed: 68,
    totalDays: 90,
    estimatedHarvestKg: 1280,
  });

  // Financial Production Expense State (Workflow Stage 2)
  const [productionExpenses, setProductionExpenses] = useState([
    { id: 1, title: "Bibit Cabai Unggul (10 Pack)", category: "Bibit", amount: 150000, date: "25 Jul 2026" },
    { id: 2, title: "Pupuk NPK 16-16-16 (50kg)", category: "Pupuk", amount: 480000, date: "28 Jul 2026" },
    { id: 3, title: "Pestisida Organik Neem (2L)", category: "Obat", amount: 120000, date: "30 Jul 2026" },
    { id: 4, title: "Upah Buruh Olah Lahan (2 Hari)", category: "Tenaga Kerja", amount: 300000, date: "1 Agu 2026" },
  ]);

  // Form states for adding expense
  const [expCategory, setExpCategory] = useState("Pupuk");
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");

  // Form states for harvest sale (Workflow Stage 3)
  const [saleQtyKg, setSaleQtyKg] = useState("50");
  const [customPrice, setCustomPrice] = useState("38000");
  const [saleSuccessMsg, setSaleSuccessMsg] = useState<string | null>(null);

  // Calculated HPP
  const totalExpenseSum = productionExpenses.reduce((sum, item) => sum + item.amount, 0); // e.g. Rp 1.050.000
  const hppPerKg = Math.round(totalExpenseSum / Math.max(1, parseInt(saleQtyKg || "50"))); // HPP calculation

  const activeData = COMMODITY_PRICE_DATA[selectedCommodity];

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    const newExp = {
      id: Date.now(),
      title: expTitle,
      category: expCategory,
      amount: parseInt(expAmount),
      date: "Hari Ini",
    };
    setProductionExpenses([newExp, ...productionExpenses]);
    setExpTitle("");
    setExpAmount("");
    setShowExpenseModal(false);
    alert("Pengeluaran produksi berhasil dicatat! HPP otomatis diperbarui.");
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSuccessMsg(`Hasil panen (${saleQtyKg} kg) berhasil dipasang di Marketplace Panentra dengan harga Rp ${parseInt(customPrice).toLocaleString("id-ID")}/kg!`);
    setTimeout(() => {
      setSaleSuccessMsg(null);
      setShowSaleModal(false);
    }, 2000);
  };

  const handleSelectRecommendation = (cropName: string, days: number) => {
    setActiveCrop({
      name: cropName,
      daysPassed: 1,
      totalDays: days,
      estimatedHarvestKg: 1200,
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center font-sans">
      {/* Mobile Viewport Shell Canvas */}
      <main className={`w-full max-w-[440px] min-h-screen bg-[#F8FAF8] text-[#1A1C19] relative shadow-2xl overflow-x-hidden border-x border-gray-200 ${viewMode === "dashboard" ? "pb-28" : "pb-8"}`}>
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F4C25]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-60 left-0 w-72 h-72 bg-[#2E7D32]/6 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="p-4 sm:p-5 relative z-10 space-y-5">
          {viewMode === "rekomendasi" ? (
            <RekomendasiTanamView
              onBack={() => setViewMode("dashboard")}
              onSelectCrop={(cropName, days) => {
                handleSelectRecommendation(cropName, days);
                setViewMode("dashboard");
              }}
            />
          ) : viewMode === "jual" ? (
            <JualPanenView
              onBack={() => setViewMode("dashboard")}
              hppPerKg={hppPerKg}
              totalExpenseSum={totalExpenseSum}
              cropName={activeCrop.name}
            />
          ) : (
            <>
              {activeTab === "kalender" && <KalenderView />}
              {activeTab === "pesanan" && (
                <PesananView
                  recentSales={dashboardData?.recent_sales}
                  revenue={dashboardData?.revenue}
                />
              )}
              {activeTab === "chat" && <ChatListView onChatRoomStateChange={setIsChatRoomActive} />}
              {activeTab === "akun" && <AkunKeuanganView onSubViewChange={setIsChatRoomActive} />}

              {activeTab === "beranda" && (
                <>
              {/* ================= 1. TOP HEADER & GREETING ================= */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-black text-[#1A1C19] tracking-tight">
                    Halo, {userName}! 👋
                  </h1>
                  <p className="text-xs font-bold text-[#0F4C25]/80">
                    Semangat mengelola lahan pertanianmu hari ini
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("akun")}
                  className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-[#0F4C25] p-0.5 shadow-sm hover:scale-105 transition-transform overflow-hidden cursor-pointer"
                >
                  <Image
                    src="/assets/bowo-senang.png"
                    alt="Profil Andi"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </button>
              </div>

              {/* ================= 2. HERO CARD (STREAK / TANAMAN AKTIF PROGRESS) ================= */}
              <section className="rounded-[32px] overflow-hidden shadow-xl border border-emerald-900/10 bg-white">
                {/* Top Forest Green Banner */}
                <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] p-5 sm:p-6 text-white relative overflow-hidden flex items-center min-h-[175px]">
                  {/* Subtle ambient light shape */}
                  <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Text Content (Layered ON TOP with z-10) */}
                  <div className="space-y-2 z-10 relative max-w-[75%]">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                      {dashboardData?.active_seasons?.[0]?.name || activeCrop.name}
                    </div>

                    <p className="text-xs text-emerald-100/95 leading-relaxed font-medium drop-shadow-sm">
                      Estimasi Panen: <span className="font-extrabold text-white">{activeCrop.estimatedHarvestKg} kg</span> · Diprediksi 22 hari lagi!
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm">
                        HPP: Rp {hppPerKg.toLocaleString("id-ID")}/kg
                      </span>
                    </div>
                  </div>

                  {/* Enlarged Farmer Mascot (Layered BEHIND text with z-0) */}
                  <div className="absolute -right-6 -bottom-6 z-0 w-60 h-60 sm:w-68 sm:h-68 pointer-events-none opacity-90">
                    <Image
                      src="/assets/bowo-calendar.png"
                      alt="Bowo Panentra"
                      width={280}
                      height={280}
                      className="w-full h-full object-contain drop-shadow-2xl scale-110"
                      priority
                    />
                  </div>
                </div>

                {/* Bottom White Progress Bar Track Section */}
                <div className="bg-white p-4 sm:p-5 space-y-2.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-black text-[#1A1C19]">
                    <span>Progress Tanam: {activeCrop.daysPassed} / {activeCrop.totalDays} Hari</span>
                    <span className="text-[#0F4C25] font-extrabold">
                      {Math.round((activeCrop.daysPassed / activeCrop.totalDays) * 100)}%
                    </span>
                  </div>

                  {/* Smooth Gray Pill Track */}
                  <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full transition-all duration-500"
                      style={{ width: `${(activeCrop.daysPassed / activeCrop.totalDays) * 100}%` }}
                    />
                  </div>
                </div>
              </section>

              {/* ================= 3. Langkah Selanjutnya (DAILY ROUTINE & WORKFLOW CARDS) ================= */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                    Langkah Selanjutnya
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {/* Workflow Card 1: Rekomendasi Komoditas Tanam AI (Mau Tanam Apa?) */}
                  <button
                    type="button"
                    onClick={() => setViewMode("rekomendasi")}
                    className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                  >
                    <div className="absolute -left-2 -bottom-2.5 z-10 w-22 h-22 sm:w-24 sm:h-24 pointer-events-none">
                      <Image
                        src="/assets/bowo-ide.png"
                        alt="Rekomendasi Tanam AI"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain transition-transform"
                      />
                    </div>

                    <div className="space-y-0.5 z-10">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                          Rekomendasi Tanam AI
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium leading-tight">
                        Rekomendasi komoditas berdasar lokasi, cuaca & tren harga
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </button>

                  {/* Workflow Card 2: Catat Pengeluaran Produksi (HPP) */}
                  <button
                    type="button"
                    onClick={() => setShowExpenseModal(true)}
                    className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                  >
                    <div className="absolute -left-2 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                      <Image
                        src="/assets/bowo-catat.png"
                        alt="Catat Keuangan Produksi"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain transition-transform"
                      />
                    </div>

                    <div className="space-y-0.5 z-10">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                          Catat Biaya Produksi (HPP)
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium leading-tight">
                        Catat bibit, pupuk, obat & upah untuk hitung HPP otomatis
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </button>

                  {/* Workflow Card 3: Jual Panen & Rekomendasi Harga Jual AI */}
                  <button
                    type="button"
                    onClick={() => setViewMode("jual")}
                    className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                  >
                    <div className="absolute -left-3 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                      <Image
                        src="/assets/bowo-duit.png"
                        alt="Jual Panen & Rekomendasi Harga"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain transition-transform"
                      />
                    </div>

                    <div className="space-y-0.5 z-10">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                          Jual Panen & Cek Harga
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium leading-tight">
                        Penjualan berbasis HPP dengan margin paling untung.
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </button>

                </div>
              </section>

              {/* ================= 4. TODAY INSIGHT (MATCHING REFERENCE IMAGE 3) ================= */}
              <section className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                  Insight AI Panentra Hari Ini
                </h2>
                <div className="bg-white rounded-[28px] p-5 border border-gray-200 shadow-sm space-y-2">
                  <p className="text-xs sm:text-sm italic font-extrabold text-[#0F4C25] leading-relaxed">
                    &ldquo;Harga Cabai Rawit diprediksi naik 15% dalam 2 minggu ke depan. Keputusan menanam Cabai saat ini berpotensi memberikan margin keuntungan hingga 38%.&rdquo;
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    *Insight dipersonalisasi berdasarkan lokasi lahan Lembang & histori HPP Anda.
                  </p>
                </div>
              </section>

              {/* ================= 5. CARD: PREDIKSI HARGA KOMODITAS ================= */}
              <section className="bg-white rounded-[28px] p-4 sm:p-5 shadow-sm border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-black text-[#1A1C19] tracking-tight flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#0F4C25]" />
                    Prediksi Harga Komoditas Pasar
                  </h2>

                  <div className="relative">
                    <select
                      value={selectedCommodity}
                      onChange={(e) => setSelectedCommodity(e.target.value as keyof typeof COMMODITY_PRICE_DATA)}
                      className="appearance-none bg-[#F8FAF8] border border-gray-200 text-[#1A1C19] font-black text-xs py-1.5 pl-3 pr-7 rounded-xl outline-none cursor-pointer focus:border-[#0F4C25]"
                    >
                      <option value="Cabai Rawit">Cabai Rawit</option>
                      <option value="Beras">Beras</option>
                      <option value="Tomat">Tomat</option>
                      <option value="Pakcoy">Pakcoy</option>
                      <option value="Jagung">Jagung</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Price AI Banner */}
                <div className={`p-3 rounded-2xl flex items-start gap-2 text-xs ${activeData.isOverSupply
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-emerald-50 border border-emerald-200 text-[#0F4C25]"
                  }`}>
                  {activeData.isOverSupply ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#0F4C25] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-[11px] leading-relaxed font-medium">
                    <span className="font-black">
                      {activeData.isOverSupply ? "Warning Over-Supply AI: " : "Transparansi Harga AI: "}
                    </span>
                    {activeData.isOverSupply
                      ? `Pasokan ${selectedCommodity} melimpah minggu ini. Disarankan atur jadwal panen agar harga tetap stabil.`
                      : `Harga ${selectedCommodity} diprediksi naik ${activeData.change}. Permintaan mitra pembeli sangat kuat.`}
                  </div>
                </div>

                {/* Interactive SVG Curve Chart */}
                <div className="relative pt-6 pb-2">
                  <div className="absolute top-0 left-[58%] -translate-x-1/2 bg-white rounded-2xl px-3 py-1.5 shadow-lg border border-gray-100 flex flex-col items-center z-10">
                    <span className="text-xs font-black text-[#1A1C19]">
                      {activeData.currentPrice} <span className="text-[9px] font-normal text-gray-500">{activeData.unit}</span>
                    </span>
                    <span className="text-[9px] font-medium text-gray-400">{activeData.tooltipDate}</span>
                    <div className="w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 -mb-2 -mt-1" />
                  </div>

                  <div className="w-full h-36 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 350 140">
                      <defs>
                        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0F4C25" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#0F4C25" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="20" x2="350" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="350" y2="50" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="350" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />

                      <path
                        d="M 15,100 C 60,95 100,110 140,70 C 180,40 210,85 245,60 C 280,40 310,60 340,30 L 340,125 L 15,125 Z"
                        fill="url(#greenGradient)"
                      />

                      <path
                        d="M 15,100 C 60,95 100,110 140,70 C 180,40 210,85 245,60 C 280,40 310,60 340,30"
                        fill="none"
                        stroke="#0F4C25"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <circle cx="212" cy="72" r="6" fill="#0F4C25" />
                      <circle cx="212" cy="72" r="10" fill="#2E7D32" fillOpacity="0.3" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] font-semibold text-gray-400 px-1 mt-1">
                    {activeData.points.map((pt, idx) => (
                      <span key={idx} className={pt.active ? "text-[#0F4C25] font-black" : ""}>
                        {pt.date}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
        </div>

        {/* ================= 6. GLASSMORPHISM BOTTOM NAVBAR (Only visible in main dashboard view & not inside sub chat room) ================= */}
        {viewMode === "dashboard" && !isChatRoomActive && (
          <BottomNavbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* ================= MODAL POPUPS (Rendered at root level with z-[60] so backdrop covers everything) ================= */}
        {/* MODAL TAHAP 2: CATAT PENGELUARAN PRODUKSI (HPP) */}
        {showExpenseModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in touch-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowExpenseModal(false);
            }}
          >
            <div className="w-full max-w-[380px] bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto z-[70]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5 mt-1">
                    Pencatatan Keuangan & Biaya Produksi
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* HPP Live Summary Box */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-600">Total Pengeluaran Saat Ini:</span>
                  <span className="font-black text-[#0F4C25] text-sm">Rp {totalExpenseSum.toLocaleString("id-ID")}</span>
                </div>
                <p className="text-[10px] text-emerald-800 font-medium">
                  Data biaya ini otomatis diakumulasi untuk menghitung Harga Pokok Produksi (HPP) saat panen.
                </p>
              </div>

              <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-black text-gray-700 block mb-1">Kategori Pengeluaran</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                  >
                    <option value="Pupuk">Pupuk & Nutrisi</option>
                    <option value="Bibit">Bibit & Benih</option>
                    <option value="Obat">Obat & Pestisida</option>
                    <option value="Tenaga Kerja">Tenaga Kerja / Upah Buruh</option>
                    <option value="Sewa Alat">Sewa Alat / Traktor / Lahan</option>
                    <option value="Lain-lain">Transportasi & Irigasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-gray-700 block mb-1">Deskripsi Item / Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembelian Pupuk NPK 50kg"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                    required
                  />
                </div>

                <div>
                  <label className="font-black text-gray-700 block mb-1">Total Biaya (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 480000"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExpenseModal(false)}
                    className="flex-1 justify-center"
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex-1 justify-center">
                    Simpan Biaya
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* MODAL TOMBOL DARURAT HAMA AI */}
        {showEmergencyModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in touch-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEmergencyModal(false);
            }}
          >
            <div className="w-full max-w-[380px] bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-4 z-[70]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Tombol Darurat Hama AI
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="w-full h-24 bg-[#F8FAF8] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-all">
                  <Upload className="w-6 h-6 text-red-500 mb-1" />
                  <span className="text-[10px] font-black text-red-600">Ambil / Upload Foto Tanaman Sakit</span>
                </div>

                <p className="text-gray-600 font-medium text-[11px] leading-relaxed">
                  AI Panentra akan mendiagnosa jenis hama / penyakit tanaman secara otomatis & memberikan rekomendasi penanganan presisi.
                </p>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => {
                    alert("Diagnosa AI: Terdeteksi gejala Antraknosa (Patek). Direkomendasikan penyemprotan Fungisida Tembaga Hidroksida dosis 2g/L.");
                    setShowEmergencyModal(false);
                  }}
                  className="w-full justify-center bg-red-600 hover:bg-red-700"
                >
                  Mulai Diagnosa AI Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
