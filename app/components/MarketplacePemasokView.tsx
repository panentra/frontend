"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import DetailProdukPemasokView from "./DetailProdukPemasokView";
import { getMarketplace, FarmerListingItem } from "@/lib/api";

export interface HarvestListing {
  id: string | number;
  farmerName: string;
  farmerRating: number;
  farmerTotalSales: number;
  farmerLocation: string;
  distanceKm: number;
  commodity: string;
  grade: string;
  hppPerKg: number;
  sellingPrice: number;
  availableKg: number;
  harvestStatus: string;
  allowNegotiation: boolean;
  productImage: string | null;
  farmerAvatar: string | null;
  farmImage?: string | null;
  harvestCategory: string;
  isBestSeller?: boolean;
}

function toHarvestListing(item: FarmerListingItem): HarvestListing {
  return {
    id: item.id,
    farmerName: item.farmerName || "Petani Panentra",
    farmerRating: item.farmerRating || 0,
    farmerTotalSales: item.farmerTotalSales || 0,
    farmerLocation: item.farmerLocation || "Lokasi Lahan",
    distanceKm: item.distanceKm || 0,
    commodity: item.commodity || "Hasil Panen",
    grade: item.grade || "Grade A (SNI)",
    hppPerKg: item.hppPerKg || 0,
    sellingPrice: item.sellingPrice || 0,
    availableKg: item.availableKg || 0,
    harvestStatus: item.harvestStatus || "Siap Dipesan",
    allowNegotiation: item.allowNegotiation ?? false,
    productImage: item.productImage || "/assets/bowo-senang.png",
    farmerAvatar: item.farmerAvatar || "/assets/bowo-senang.png",
    farmImage: item.farmerAvatar || "/assets/bowo-senang.png",
    harvestCategory: item.harvestCategory || "Bahan-Bahan",
    isBestSeller: item.isBestSeller || false,
  };
}

const IMAGE_FALLBACK = "/assets/bowo-senang.png";

interface MarketplacePemasokViewProps {
  onBack: () => void;
  onSelectNego: (listing: HarvestListing) => void;
  onSelectBuy: (listing: HarvestListing) => void;
  onDetailVisibilityChange?: (open: boolean) => void;
}

export default function MarketplacePemasokView({
  onBack,
  onSelectNego,
  onSelectBuy,
  onDetailVisibilityChange,
}: MarketplacePemasokViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("Semua Grade");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [onlyNego, setOnlyNego] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<"grid" | "list">("grid");
  const [selectedDetailListing, setSelectedDetailListing] = useState<HarvestListing | null>(null);

  const [listings, setListings] = useState<HarvestListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Debounce search query so we don't spam the API per keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDeferredSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const params: Record<string, string> = {};
    if (deferredSearch.trim()) params.q = deferredSearch.trim();
    if (selectedCategory !== "Semua") params.category = selectedCategory;
    if (selectedGrade !== "Semua Grade") params.grade = selectedGrade;
    if (onlyNego) params.nego = "1";
    params.sort = "best_seller";

    getMarketplace(params)
      .then((res) => {
        if (cancelled) return;
        setListings((res?.data || []).map(toHarvestListing));
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setListings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deferredSearch, selectedGrade, selectedCategory, onlyNego, retryKey]);

  // Notify parent so bottom navbar can hide while detail view is open
  useEffect(() => {
    onDetailVisibilityChange?.(!!selectedDetailListing);
    return () => onDetailVisibilityChange?.(false);
  }, [selectedDetailListing, onDetailVisibilityChange]);

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
            {loading ? "Memuat Produk..." : `${listings.length} Produk Pasokan Ditemukan`}
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-[24px] p-5 text-center space-y-3">
            <p className="text-xs font-bold text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="h-10 px-4 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center gap-1.5 mx-auto text-[11px] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="space-y-3">
            {[0, 1].map((n) => (
              <div key={n} className="grid grid-cols-2 gap-3 sm:gap-4">
                {[0, 1].map((m) => (
                  <div
                    key={m}
                    className="bg-white rounded-[24px] border border-gray-200/90 shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="w-full aspect-square bg-gray-100" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {!error && !loading && listings.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-[24px] p-8 text-center space-y-2">
            <p className="text-sm font-black text-[#1A1C19]">Tidak ada produk ditemukan</p>
            <p className="text-xs text-gray-500 font-medium">
              Coba ubah kata kunci pencarian atau atur ulang filter.
            </p>
          </div>
        )}

        {!error && !loading && listings.length > 0 && layoutStyle === "grid" ? (
          /* ================= 2-COLUMN MARKETPLACE CARD GRID ================= */
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {listings.map((item) => {
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
                      src={item.productImage || IMAGE_FALLBACK}
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
            {listings.map((item) => {
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
                      src={item.productImage || IMAGE_FALLBACK}
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
