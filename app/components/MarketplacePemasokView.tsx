"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Tag,
  MessageSquare,
  ShoppingBag,
  Grid,
  List,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";
import DetailProdukPemasokView from "./DetailProdukPemasokView";

export interface HarvestListing {
  id: string;
  farmerName: string;
  farmerRating: number;
  farmerTotalSales: number;
  farmerLocation: string;
  distanceKm: number;
  commodity: string;
  grade: "Grade A (SNI)" | "Grade B (SNI)" | "Grade C (SNI)";
  hppPerKg: number;
  sellingPrice: number;
  availableKg: number;
  harvestStatus: string;
  allowNegotiation: boolean;
  productImage: string;
  farmerAvatar: string;
  farmImage?: string;
  harvestCategory: "Sayuran" | "Pangan" | "Bahan-Bahan" | "Tanaman Perkebunan";
  isBestSeller?: boolean;
}

const SAMPLE_LISTINGS: HarvestListing[] = [
  {
    id: "LIST-101",
    farmerName: "Pak Andi Sugiharto",
    farmerRating: 4.9,
    farmerTotalSales: 38,
    farmerLocation: "Lembang, Bandung",
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
    isBestSeller: true,
  },
  {
    id: "LIST-102",
    farmerName: "Ibu Sri Rahayu",
    farmerRating: 5.0,
    farmerTotalSales: 52,
    farmerLocation: "Ciwidey, Kab. Bandung",
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
    isBestSeller: true,
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
    isBestSeller: true,
  },
  {
    id: "LIST-105",
    farmerName: "Pak Mulyana",
    farmerRating: 4.9,
    farmerTotalSales: 41,
    farmerLocation: "Garut",
    distanceKm: 12.0,
    commodity: "Kopi Arabika Bean Premium",
    grade: "Grade A (SNI)",
    hppPerKg: 75000,
    sellingPrice: 95000,
    availableKg: 500,
    harvestStatus: "Petik Merah",
    allowNegotiation: true,
    productImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/bowo-senang.png",
    farmImage: "/assets/bowo-senang.png",
    harvestCategory: "Tanaman Perkebunan",
  },
  {
    id: "LIST-106",
    farmerName: "Poktan Sukamaju",
    farmerRating: 4.8,
    farmerTotalSales: 89,
    farmerLocation: "Subang",
    distanceKm: 15.2,
    commodity: "Beras Pandan Wangi Super",
    grade: "Grade A (SNI)",
    hppPerKg: 11500,
    sellingPrice: 14500,
    availableKg: 5000,
    harvestStatus: "Stok Gudang Lahan",
    allowNegotiation: false,
    productImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/budi-senang.png",
    farmImage: "/assets/budi-senang.png",
    harvestCategory: "Pangan",
  },
];

interface MarketplacePemasokViewProps {
  onBack: () => void;
  onSelectNego: (listing: HarvestListing) => void;
  onSelectBuy: (listing: HarvestListing) => void;
}

export default function MarketplacePemasokView({
  onBack,
  onSelectNego,
  onSelectBuy,
}: MarketplacePemasokViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("Semua Grade");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [onlyNego, setOnlyNego] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<"grid" | "list">("grid");
  const [selectedDetailListing, setSelectedDetailListing] = useState<HarvestListing | null>(null);

  const filteredListings = SAMPLE_LISTINGS.filter((item) => {
    const matchSearch =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGrade =
      selectedGrade === "Semua Grade" || item.grade.includes(selectedGrade);

    const matchCategory =
      selectedCategory === "Semua" || item.harvestCategory === selectedCategory;

    const matchNego = !onlyNego || item.allowNegotiation;

    return matchSearch && matchGrade && matchCategory && matchNego;
  });

  if (selectedDetailListing) {
    return (
      <DetailProdukPemasokView
        listing={selectedDetailListing}
        onBack={() => setSelectedDetailListing(null)}
        onSelectNego={(listing) => {
          setSelectedDetailListing(null);
          onSelectNego(listing);
        }}
        onSelectBuy={(listing) => {
          setSelectedDetailListing(null);
          onSelectBuy(listing);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
              Pasar Hasil Panen
            </h1>
            <p className="text-[11px] font-bold text-[#0F4C25]">
              Klik Produk untuk Melihat Detail Panen
            </p>
          </div>
        </div>

        {/* View Layout Switcher (Grid vs List) */}
        <div className="flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setLayoutStyle("grid")}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              layoutStyle === "grid"
                ? "bg-[#0F4C25] text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Tampilan Grid 2-Kolom (Shopee/Tokped Style)"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setLayoutStyle("list")}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              layoutStyle === "list"
                ? "bg-[#0F4C25] text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Tampilan Daftar Detail"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari Cabai, Pakcoy, Tomat, atau Petani..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#0F4C25] shadow-sm"
        />
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["Semua", "Bahan-Bahan", "Sayuran", "Pangan", "Tanaman Perkebunan"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0F4C25] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["Semua Grade", "Grade A", "Grade B"].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setSelectedGrade(grade)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                selectedGrade === grade
                  ? "bg-emerald-100 text-[#0F4C25] border-[#0F4C25]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {grade}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOnlyNego(!onlyNego)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              onlyNego
                ? "bg-amber-100 text-amber-900 border-amber-400"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Bisa Nego Saja</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Grid (Shopee / Tokopedia 2-Column Marketplace Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#1A1C19]">
            {filteredListings.length} Produk Pasokan Ditemukan
          </span>
          <span className="text-[10px] font-bold text-[#0F4C25] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Panentra Secure Escrow
          </span>
        </div>

        {layoutStyle === "grid" ? (
          /* ================= 2-COLUMN MARKETPLACE CARD GRID ================= */
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredListings.map((item) => {
              const marginFromHpp = Math.round(
                ((item.sellingPrice - item.hppPerKg) / item.hppPerKg) * 100
              );

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetailListing(item)}
                  className="bg-white rounded-[24px] border border-gray-200/90 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-[#0F4C25]/50 transition-all group cursor-pointer"
                >
                  {/* Product Image Thumbnail Banner */}
                  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.commodity}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 440px) 50vw, 220px"
                    />

                    {/* Gradient Overlay Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Left Badge: Grade SNI */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      <span className="bg-[#0F4C25]/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                        {item.grade}
                      </span>
                    </div>

                    {/* Top Right Badge: Nego Toggle */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                      {item.allowNegotiation && (
                        <span className="bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          Nego
                        </span>
                      )}
                    </div>

                    {/* Bottom Image Overlay: Farmer Name & Distance */}
                    <div className="absolute bottom-2 left-2 right-2 text-white z-10 flex items-center justify-between">
                      <span className="text-[10px] font-bold truncate flex items-center gap-1 drop-shadow-md">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        {item.farmerName} • {item.distanceKm} km
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      {/* Product Name (2 Lines Max) */}
                      <h3 className="text-xs font-black text-[#1A1C19] line-clamp-2 leading-snug group-hover:text-[#0F4C25] transition-colors">
                        {item.commodity}
                      </h3>

                      {/* Pricing Section (Shopee/Tokopedia Style) */}
                      <div className="space-y-0.5 pt-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-[#0F4C25]">
                            Rp {item.sellingPrice.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[9px] font-semibold text-gray-500">/kg</span>
                        </div>

                        {/* HPP Margin Tag */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-500">
                            HPP Rp {item.hppPerKg.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 rounded">
                            +{marginFromHpp}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock & Rating Info */}
                    <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-bold">
                      <span className="flex items-center gap-0.5 text-amber-500 font-black">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                        {item.farmerRating} ({item.farmerTotalSales})
                      </span>
                      <span className="text-emerald-800 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded">
                        Stok {item.availableKg} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= LIST VIEW (FULL CARDS WITH THUMBNAIL) ================= */
          <div className="space-y-3.5">
            {filteredListings.map((item) => {
              const marginFromHpp = Math.round(
                ((item.sellingPrice - item.hppPerKg) / item.hppPerKg) * 100
              );

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetailListing(item)}
                  className="bg-white rounded-[24px] p-3.5 border border-gray-200 shadow-sm flex items-start gap-3 hover:border-[#0F4C25]/40 transition-all cursor-pointer group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 relative overflow-hidden shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.commodity}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1 left-1 bg-[#0F4C25] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {item.grade}
                    </span>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <h3 className="text-xs font-black text-[#1A1C19] truncate group-hover:text-[#0F4C25] transition-colors">
                      {item.commodity}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0F4C25]" />
                      <span>{item.farmerName} • {item.farmerLocation} ({item.distanceKm} km)</span>
                    </p>

                    <div className="flex items-baseline gap-1 pt-0.5">
                      <span className="text-sm font-black text-[#0F4C25]">
                        Rp {item.sellingPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[9px] text-gray-500 font-medium">/kg</span>
                      <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded ml-1">
                        HPP Rp {item.hppPerKg.toLocaleString("id-ID")} (+{marginFromHpp}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold pt-1 border-t border-gray-100">
                      <span>Tersedia: {item.availableKg} kg</span>
                      <span className="text-amber-600 font-black">⭐ {item.farmerRating} ({item.farmerTotalSales})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
