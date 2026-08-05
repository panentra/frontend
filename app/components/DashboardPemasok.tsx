"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Lock,
  Star,
  ShieldCheck,
  Tag,
  BarChart3,
  ArrowUpRight,
  Grid,
} from "lucide-react";
import Button from "./Button";
import BottomNavbarPemasok from "./BottomNavbarPemasok";
import PasarHargaPemasokView from "./PasarHargaPemasokView";
import PengantaranPemasokView from "./PengantaranPemasokView";
import AkunPemasokView from "./AkunPemasokView";
import MarketplacePemasokView, { HarvestListing } from "./MarketplacePemasokView";
import DetailProdukPemasokView from "./DetailProdukPemasokView";
import RuangNegoPemasokView from "./RuangNegoPemasokView";
import PembayaranEscrowView from "./PembayaranEscrowView";
import RiwayatPembelianPemasokView from "./RiwayatPembelianPemasokView";
import { getSupplierDashboard, getAuthUser, SupplierDashboardData, User as AuthUser } from "@/lib/api";

// Nearby Harvests Sample Data for Radar Pasokan
const NEARBY_HARVESTS: HarvestListing[] = [
  {
    id: "LIST-101",
    farmerName: "Pak Andi Sugiharto",
    farmerRating: 4.9,
    farmerTotalSales: 38,
    farmerLocation: "Lembang",
    distanceKm: 3.2,
    commodity: "Cabai Rawit Merah Super",
    grade: "Grade A (SNI)",
    hppPerKg: 28500,
    sellingPrice: 38000,
    availableKg: 1280,
    harvestStatus: "Siap Dipetik Besok",
    allowNegotiation: true,
    productImage: "https://images.unsplash.com/photo-1588252303782-7cc9888970aa?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/bowo-senang.png",
    farmImage: "/assets/bowo-senang.png",
    harvestCategory: "Bahan-Bahan",
  },
  {
    id: "LIST-102",
    farmerName: "Ibu Sri Rahayu",
    farmerRating: 5.0,
    farmerTotalSales: 52,
    farmerLocation: "Ciwidey",
    distanceKm: 5.1,
    commodity: "Pakcoy Hydroponic Fresh",
    grade: "Grade A (SNI)",
    hppPerKg: 13500,
    sellingPrice: 18000,
    availableKg: 650,
    harvestStatus: "Panen Hari Ini",
    allowNegotiation: true,
    productImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/budi-kaget.png",
    farmImage: "/assets/budi-kaget.png",
    harvestCategory: "Sayuran",
  },
  {
    id: "LIST-103",
    farmerName: "Pak Budi Santoso",
    farmerRating: 4.8,
    farmerTotalSales: 24,
    farmerLocation: "Pangalengan",
    distanceKm: 8.4,
    commodity: "Tomat Red Super Harvest",
    grade: "Grade B (SNI)",
    hppPerKg: 8800,
    sellingPrice: 12000,
    availableKg: 2100,
    harvestStatus: "Siap Panen Lusa",
    allowNegotiation: false,
    productImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/bowo-calendar.png",
    farmImage: "/assets/bowo-calendar.png",
    harvestCategory: "Bahan-Bahan",
  },
  {
    id: "LIST-104",
    farmerName: "Kelompok Tani Harapan",
    farmerRating: 4.9,
    farmerTotalSales: 67,
    farmerLocation: "Parongpong",
    distanceKm: 4.5,
    commodity: "Jagung Manis Super Sweet",
    grade: "Grade A (SNI)",
    hppPerKg: 5200,
    sellingPrice: 7200,
    availableKg: 3500,
    harvestStatus: "Panen Raya",
    allowNegotiation: true,
    productImage: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/bowo-ide.png",
    farmImage: "/assets/bowo-ide.png",
    harvestCategory: "Pangan",
  },
];

export default function DashboardPemasok() {
  const router = useRouter();
  
  // Navigation Tabs: "beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun"
  const [activeTab, setActiveTab] = useState<"beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun">("beranda");
  
  // Sub-view Mode: "dashboard" | "marketplace" | "detail" | "nego" | "pembayaran" | "riwayat"
  const [viewMode, setViewMode] = useState<"dashboard" | "marketplace" | "detail" | "nego" | "pembayaran" | "riwayat">("dashboard");

  // Selected Listing & Deal state for sub-views
  const [selectedListing, setSelectedListing] = useState<HarvestListing | null>(null);
  const [agreedDeal, setAgreedDeal] = useState<{ price: number; qty: number } | null>(null);
  const [buySource, setBuySource] = useState<"detail" | "nego">("nego");

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [marketplaceDetailOpen, setMarketplaceDetailOpen] = useState(false);

  const [dashboard, setDashboard] = useState<SupplierDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [user] = useState<AuthUser | null>(() => getAuthUser());

  useEffect(() => {
    getSupplierDashboard()
      .then((data) => setDashboard(data))
      .catch((err: Error) => setDashboardError(err.message))
      .finally(() => setDashboardLoading(false));
  }, []);

  const totalMonthSpend =
    dashboard?.monthly_spend != null
      ? dashboard.monthly_spend
      : dashboard?.recent_orders?.reduce((sum, o) => sum + (o.grand_total || 0), 0) || 0;
  const totalMonthKg =
    dashboard?.monthly_kg != null
      ? dashboard.monthly_kg
      : dashboard?.recent_orders?.reduce((sum, o) => sum + (o.qty_kg || 0), 0) || 0;

  const formatRupiah = (value: number) =>
    value.toLocaleString("id-ID");

  const storeName = (user?.name as string) || "Toko Berkah";

  const filteredHarvests =
    selectedCategory === "Semua"
      ? NEARBY_HARVESTS
      : NEARBY_HARVESTS.filter((item) => item.harvestCategory === selectedCategory);

  const handleOpenMarketplace = () => {
    setActiveTab("jualbeli");
    setViewMode("dashboard");
  };

  const handleOpenDetail = (listing: HarvestListing) => {
    setSelectedListing(listing);
    setViewMode("detail");
  };

  const handleOpenNego = (listing: HarvestListing) => {
    setSelectedListing(listing);
    setViewMode("nego");
  };

  const handleOpenBuyEscrow = (listing: HarvestListing) => {
    setSelectedListing(listing);
    setBuySource("detail");
    // Beli langsung dari detail: default harga jual & kuantitas, lalu lanjut ke pembayaran escrow (API)
    setAgreedDeal({
      price: listing.sellingPrice,
      qty: Math.max(1, Math.min(100, listing.availableKg || 100)),
    });
    setViewMode("pembayaran");
  };

  const handleProceedFromNegoToPayment = (dealDetails: {
    listing: HarvestListing;
    agreedPrice: number;
    agreedQty: number;
  }) => {
    setSelectedListing(dealDetails.listing);
    setBuySource("nego");
    setAgreedDeal({ price: dealDetails.agreedPrice, qty: dealDetails.agreedQty });
    setViewMode("pembayaran");
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center font-sans">
      {/* Mobile Viewport Shell Canvas */}
      <main
        className={`w-full max-w-[440px] min-h-screen bg-[#F8FAF8] text-[#1A1C19] relative shadow-2xl overflow-x-hidden border-x border-gray-200 ${
          viewMode === "dashboard" ? "pb-28" : "pb-8"
        }`}
      >
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F4C25]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-60 left-0 w-72 h-72 bg-[#2E7D32]/6 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="p-4 sm:p-5 relative z-10 space-y-5">
          {/* ================= SUB-VIEW MODES ================= */}
          {viewMode === "detail" && selectedListing ? (
            <DetailProdukPemasokView
              listing={selectedListing}
              onBack={() => setViewMode("dashboard")}
              onSelectNego={(listing) => handleOpenNego(listing)}
              onSelectBuy={(listing) => handleOpenBuyEscrow(listing)}
            />
          ) : viewMode === "nego" ? (
            <RuangNegoPemasokView
              listing={selectedListing}
              onBack={() => setViewMode("dashboard")}
              onProceedToPayment={handleProceedFromNegoToPayment}
            />
          ) : viewMode === "pembayaran" ? (
            <PembayaranEscrowView
              listing={selectedListing}
              agreedPrice={agreedDeal?.price}
              agreedQty={agreedDeal?.qty}
              onBack={() => setViewMode(buySource === "detail" ? "detail" : "nego")}
              onPaymentSuccess={() => setViewMode("riwayat")}
            />
          ) : viewMode === "riwayat" ? (
            <RiwayatPembelianPemasokView
              onBack={() => setViewMode("dashboard")}
              onBuyAgain={() => {
                setActiveTab("jualbeli");
                setViewMode("dashboard");
              }}
            />
          ) : (
            <>
              {/* ================= BOTTOM NAVBAR TAB VIEWS ================= */}
              {activeTab === "pasar" && <PasarHargaPemasokView />}
              {activeTab === "jualbeli" && (
                <MarketplacePemasokView
                  onBack={() => setActiveTab("beranda")}
                  onSelectNego={(listing) => handleOpenNego(listing)}
                  onSelectBuy={(listing) => handleOpenBuyEscrow(listing)}
                  onDetailVisibilityChange={setMarketplaceDetailOpen}
                />
              )}
              {activeTab === "pengantaran" && <PengantaranPemasokView />}
              {activeTab === "akun" && (
                <AkunPemasokView
                  onNavigateToHistory={() => setViewMode("riwayat")}
                  onNavigateToPetani={() => router.push("/dashboard")}
                />
              )}

              {activeTab === "beranda" && (
                <>
                  {/* ================= 1. TOP HEADER & GREETING ================= */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h1 className="text-2xl font-black text-[#1A1C19] tracking-tight" suppressHydrationWarning>
                        Halo, {storeName}! 👋
                      </h1>
                      <p className="text-xs font-bold text-[#0F4C25]">
                        Pasokan Hasil Panen Langsung dari Lahan Petani
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("akun")}
                      className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-[#0F4C25] p-0.5 shadow-sm hover:scale-105 transition-transform overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      <Store className="w-6 h-6 text-[#0F4C25]" />
                    </button>
                  </div>

                  {/* ================= 2. HERO CARD (RINGKASAN PEMBELIAN / TARGET PASOKAN) ================= */}
                  <section className="rounded-[32px] overflow-hidden shadow-xl border border-emerald-900/10 bg-white">
                    {/* Top Forest Green Banner */}
                    <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] p-5 sm:p-6 text-white relative overflow-hidden flex items-center min-h-[175px]">
                      {/* Subtle ambient light shape */}
                      <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Text Content */}
                      <div className="space-y-2 z-10 relative max-w-[72%]">
                        <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
                          Total Pembelian Bulan Ini
                        </span>

                        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                          {dashboardLoading ? (
                            <span className="animate-pulse">Memuat...</span>
                          ) : dashboardError ? (
                            <span className="text-base">Rp 0</span>
                          ) : (
                            <>Rp {formatRupiah(totalMonthSpend)}</>
                          )}
                        </div>

                        <p className="text-xs text-emerald-100/95 leading-relaxed font-medium drop-shadow-sm">
                          {dashboardLoading
                            ? "Mengambil data pesanan terbaru..."
                            : dashboardError
                            ? "Gagal memuat data dashboard."
                            : <>
                                {formatRupiah(totalMonthKg)} kg sudah diamankan dari{" "}
                                <span className="font-extrabold text-[#FFFFFF]">
                                  {dashboard?.favorite_farmers_count ?? 0} petani mitra terpercaya — pasokanmu makin kuat!
                                </span>
                              </>}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm">
                            {dashboardLoading ? "..." : `${formatRupiah(totalMonthKg)} kg Terpesan`}
                          </span>
                          <span className="text-[10px] text-emerald-100/90 font-medium leading-none">
                            {dashboard?.active_orders_count != null
                              ? `${dashboard.active_orders_count} pesanan aktif berjalan`
                              : "Pantau pesanan aktifmu di sini"}
                          </span>
                        </div>
                      </div>

                      {/* Enlarged Bowo/Budi Mascot */}
                      <div className="absolute -right-6 -bottom-12 z-0 w-60 h-60 sm:w-68 sm:h-68 pointer-events-none opacity-90">
                        <Image
                          src="/assets/budi-oke.png"
                          alt="Budi Panentra"
                          width={280}
                          height={280}
                          className="w-full h-full object-contain drop-shadow-2xl scale-100 translate-y-2"
                          priority
                        />
                      </div>
                    </div>

                    {/* Bottom White Progress Bar Track Section */}
                    <div className="bg-white p-4 sm:p-5 space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-black text-[#1A1C19]">
                        <span>Target Pasokan Bulanan</span>
                        <span className="text-[#0F4C25] font-extrabold">
                          {dashboardLoading
                            ? "..."
                            : dashboard?.completed_orders_count != null && dashboard?.active_orders_count != null
                            ? `${Math.round(
                                (dashboard.completed_orders_count /
                                  (dashboard.completed_orders_count + dashboard.active_orders_count)) *
                                  100
                              )}%`
                            : "0%"}
                        </span>
                      </div>

                      {/* Smooth Gray Pill Track */}
                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              dashboardLoading
                                ? "0"
                                : dashboard?.completed_orders_count != null && dashboard?.active_orders_count != null
                                ? Math.min(
                                    100,
                                    Math.round(
                                      (dashboard.completed_orders_count /
                                        (dashboard.completed_orders_count + dashboard.active_orders_count)) *
                                        100
                                    )
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      
                      <p className="text-[11px] text-gray-500 font-semibold pt-0.5">
                        {dashboardLoading
                          ? "Memuat statistik pesanan..."
                          : dashboardError
                          ? "Statistik tidak tersedia saat ini."
                          : `${dashboard?.completed_orders_count ?? 0} pesanan selesai dari total ${(dashboard?.completed_orders_count ?? 0) + (dashboard?.active_orders_count ?? 0)} — target pasokanmu makin mendekati`}
                      </p>
                    </div>
                  </section>


                  {/* ================= 3. LANGKAH UTAMA WORKFLOW CARDS (Strict Checkout Flow: No standalone Payment Card) ================= */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                        Aksi Cepat
                      </h2>
                    </div>

                    <div className="space-y-2.5">
                      {/* Workflow Card 1: Ruang Negosiasi & Chat */}
                      <button
                        type="button"
                        onClick={() => setViewMode("nego")}
                        className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                      >
                        <div className="absolute -left-4 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                          <Image
                            src="/assets/budi-chat.png"
                            alt="Ruang Negosiasi"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain transition-transform"
                          />
                        </div>

                        <div className="space-y-0.5 z-10">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                              Ruang Negosiasi & Chat
                            </h3>
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium leading-tight">
                            Tawar harga langsung ke petani, dapatkan kesepakatan terbaik tanpa perantara
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      </button>

                      {/* Workflow Card 2: Riwayat Pembelian & Rating Petani */}
                      <button
                        type="button"
                        onClick={() => setViewMode("riwayat")}
                        className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                      >
                        <div className="absolute -left-2 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                          <Image
                            src="/assets/budi-riwayat.png"
                            alt="Riwayat & Rating"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain transition-transform"
                          />
                        </div>

                        <div className="space-y-0.5 z-10">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                              Riwayat Pembelian & Rating
                            </h3>
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium leading-tight">
                            Semua invoice rapi di satu tempat — repeat order dari petani langganan tinggal satu tap
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      </button>
                    </div>
                  </section>

                  {/* ================= 4. TODAY AI BUYER INSIGHT ================= */}
                  <section className="space-y-2.5">
                    <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                      Insight AI Panentra Hari Ini
                    </h2>
                    <div className="bg-white rounded-[28px] p-5 border border-gray-200 shadow-sm space-y-2">
                      <p className="text-xs sm:text-sm italic font-extrabold text-[#0F4C25] leading-relaxed">
                        &ldquo;Peluang hari ini: Cabai Rawit Merah Grade A dari petani Lembang sedang melimpah (HPP Rp 28.500/kg vs harga pasar Rp 38.000/kg). Ambil sekarang, hemat hingga 18% dibanding beli musim depan.&rdquo;
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        *Insight dipersonalisasi berdasarkan lokasi toko Bandung & rekomendasi HPP.
                      </p>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Hidden when in sub-views) */}
        {viewMode === "dashboard" && !marketplaceDetailOpen && (
          <BottomNavbarPemasok
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setViewMode("dashboard");
            }}
            onPlusClick={handleOpenMarketplace}
          />
        )}
      </main>
    </div>
  );
}
