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

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

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
    setAgreedDeal(null);
    setViewMode("pembayaran");
  };

  const handleProceedFromNegoToPayment = (dealDetails: {
    listing: HarvestListing;
    agreedPrice: number;
    agreedQty: number;
  }) => {
    setSelectedListing(dealDetails.listing);
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
              onBack={() => setViewMode("dashboard")}
              onPaymentSuccess={() => setViewMode("riwayat")}
            />
          ) : viewMode === "riwayat" ? (
            <RiwayatPembelianPemasokView
              onBack={() => setViewMode("dashboard")}
              onBuyAgain={(farmerName) => {
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
                      <h1 className="text-2xl font-black text-[#1A1C19] tracking-tight">
                        Halo, Toko Berkah! 👋
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
                          Rp 14.250.000
                        </div>

                        <p className="text-xs text-emerald-100/95 leading-relaxed font-medium drop-shadow-sm">
                          450 kg pasokan dipesan dari <span className="font-extrabold text-white">12 mitra petani terverifikasi!</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm">
                            450 kg Dipesan
                          </span>
                          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm">
                            Secure Escrow Active
                          </span>
                        </div>
                      </div>

                      {/* Enlarged Bowo Mascot */}
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
                        <span>Progress Target Pasokan: 450 / 500 kg</span>
                        <span className="text-[#0F4C25] font-extrabold">90%</span>
                      </div>

                      {/* Smooth Gray Pill Track */}
                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full transition-all duration-500"
                          style={{ width: "90%" }}
                        />
                      </div>
                    </div>
                  </section>

                  {/* ================= 3. LANGKAH UTAMA WORKFLOW CARDS (Cleaned: No Duplicate Marketplace Card) ================= */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
                        Langkah Utama Pemasok
                      </h2>
                    </div>

                    <div className="space-y-2.5">
                      {/* Workflow Card 1: Ruang Negosiasi & Chat */}
                      <button
                        type="button"
                        onClick={() => setViewMode("nego")}
                        className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                      >
                        <div className="absolute -left-2 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                          <Image
                            src="/assets/bowo-catat.png"
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
                            Ajukan penawaran harga & kuantitas pasokan real-time
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      </button>

                      {/* Workflow Card 2: Pembayaran Safe Escrow */}
                      <button
                        type="button"
                        onClick={() => setViewMode("pembayaran")}
                        className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                      >
                        <div className="absolute -left-3 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                          <Image
                            src="/assets/bowo-duit.png"
                            alt="Pembayaran Safe Escrow"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain transition-transform"
                          />
                        </div>

                        <div className="space-y-0.5 z-10">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                              Pembayaran Safe Escrow
                            </h3>
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium leading-tight">
                            Bayar aman via Panentra Pay, dana dicairkan setelah barang sesuai
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 group-hover:text-[#0F4C25] group-hover:bg-white transition-all shrink-0 z-10 ml-2 shadow-sm">
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      </button>

                      {/* Workflow Card 3: Riwayat Pembelian & Rating Petani */}
                      <button
                        type="button"
                        onClick={() => setViewMode("riwayat")}
                        className="w-full bg-[#EBF7EE] rounded-[28px] p-3.5 pl-20 flex items-center justify-between transition-all active:scale-[0.99] text-left cursor-pointer group relative overflow-hidden min-h-[78px] shadow-sm"
                      >
                        <div className="absolute -left-2 -bottom-2.1 z-10 w-24 h-24 sm:w-30 sm:h-30 pointer-events-none">
                          <Image
                            src="/assets/bowo-senang.png"
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
                            Rekap invoice, ulasan rating petani & tombol Beli Lagi
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
                        &ldquo;Panen Cabai Rawit Merah Grade A di Lembang sedang melimpah minggu ini (HPP Rp 28.500/kg). Harga pasar Rp 38.000/kg — dapatkan harga langsung petani dengan potensi hemat hingga 18%.&rdquo;
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        *Insight dipersonalisasi berdasarkan lokasi toko Bandung & rekomendasi HPP.
                      </p>
                    </div>
                  </section>

                  {/* ================= 5. RADAR PASOKAN TANI TERDEKAT (Shopee/Tokped 2-Column Card Grid Style) ================= */}
                  <section className="bg-white rounded-[28px] p-4 sm:p-5 shadow-sm border border-gray-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs sm:text-sm font-black text-[#1A1C19] tracking-tight flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#0F4C25]" />
                        Radar Pasokan Tani Siap Beli
                      </h2>
                      <button
                        type="button"
                        onClick={handleOpenMarketplace}
                        className="text-[10px] font-bold text-[#0F4C25] hover:underline cursor-pointer"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {["Semua", "Bahan-Bahan", "Sayuran"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-[#0F4C25] text-white shadow-sm"
                              : "bg-[#F8FAF8] text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* 2-Column Marketplace Cards (Shopee / Tokopedia Style) - Click Opens Product Detail */}
                    <div className="grid grid-cols-2 gap-3">
                      {filteredHarvests.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenDetail(item)}
                          className="bg-[#F8FAF8] rounded-[22px] border border-gray-200 overflow-hidden flex flex-col hover:border-[#0F4C25]/40 transition-all cursor-pointer group"
                        >
                          {/* Image Thumbnail */}
                          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                            <Image
                              src={item.productImage}
                              alt={item.commodity}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="200px"
                            />
                            <span className="absolute top-1.5 left-1.5 bg-[#0F4C25] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                              {item.grade}
                            </span>
                            {item.allowNegotiation && (
                              <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                Nego
                              </span>
                            )}
                          </div>

                          {/* Card Text Content */}
                          <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                            <div className="space-y-0.5">
                              <h3 className="text-[11px] font-extrabold text-[#1A1C19] line-clamp-2 leading-snug group-hover:text-[#0F4C25] transition-colors">
                                {item.commodity}
                              </h3>
                              <p className="text-[9px] text-gray-500 font-bold flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-[#0F4C25]" />
                                {item.farmerName} • {item.distanceKm} km
                              </p>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-gray-200/60">
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-xs font-black text-[#0F4C25]">
                                  Rp {item.sellingPrice.toLocaleString("id-ID")}
                                </span>
                                <span className="text-[8px] text-gray-400">/kg</span>
                              </div>

                              <div className="flex items-center justify-between text-[9px] text-gray-500 font-bold">
                                <span className="text-amber-600 font-black">⭐ {item.farmerRating}</span>
                                <span>{item.availableKg} kg</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Hidden when in sub-views) */}
        {viewMode === "dashboard" && (
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
