"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Star,
  ShieldCheck,
  Tag,
  MessageSquare,
  ShoppingBag,
  Info,
  Calendar,
  Package,
  TrendingUp,
  CheckCircle2,
  Lock,
  Share2,
  Heart,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { HarvestListing } from "./MarketplacePemasokView";
import { getListingDetail, getFavorites, addFavorite, removeFavorite, FarmerListingItem } from "@/lib/api";

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

interface DetailProdukPemasokViewProps {
  listing: HarvestListing;
  onBack: () => void;
  onSelectNego: (listing: HarvestListing) => void;
  onSelectBuy: (listing: HarvestListing) => void;
}

export default function DetailProdukPemasokView({
  listing,
  onBack,
  onSelectNego,
  onSelectBuy,
}: DetailProdukPemasokViewProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHppDetail, setShowHppDetail] = useState(false);
  const [detail, setDetail] = useState<HarvestListing | null>(null);
  const [favoriteSellerId, setFavoriteSellerId] = useState<number | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Sync heart button with favorites API (match by farmer name)
  useEffect(() => {
    let cancelled = false;
    getFavorites()
      .then((res) => {
        if (cancelled) return;
        const favs = (res as { data?: Array<{ seller_id?: number; name?: string }> })?.data || [];
        const match = favs.find((f) => f.name === listing.farmerName);
        if (match) {
          setFavoriteSellerId(match.seller_id ?? null);
          setIsLiked(true);
        }
      })
      .catch(() => {
        // Favorites unavailable; keep local toggle only
      });
    return () => {
      cancelled = true;
    };
  }, [listing.farmerName]);

  const handleToggleFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      if (isLiked) {
        await removeFavorite(favoriteSellerId ?? (listing.id as number));
        setIsLiked(false);
        setFavoriteSellerId(null);
      } else {
        await addFavorite((listing.id as number) || favoriteSellerId || 0);
        setIsLiked(true);
        setFavoriteSellerId(listing.id as number);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui favorit.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Refresh listing detail from API by ID on mount
  useEffect(() => {
    let cancelled = false;
    if (listing?.id != null) {
      getListingDetail(listing.id)
        .then((res) => {
          if (!cancelled && res?.data) setDetail(toHarvestListing(res.data));
        })
        .catch(() => {
          // Keep passed listing on failure so UI stays usable
        });
    }
    return () => {
      cancelled = true;
    };
  }, [listing?.id]);

  const data = detail || listing;

  const marginFromHpp = Math.round(
    ((data.sellingPrice - data.hppPerKg) / data.hppPerKg) * 100
  );

  return (
    <div className="space-y-4 animate-fade-in pb-24">
      {/* Top Header Bar */}
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
            <h1 className="text-lg font-black text-[#1A1C19] tracking-tight">
              Detail Hasil Panen
            </h1>
            <p className="text-[10px] font-bold text-[#0F4C25]">
              Terhubung Langsung dengan Lahan Petani
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              isLiked
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => alert("Link produk berhasil disalin!")}
            className="w-9 h-9 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Product Image Banner */}
      <div className="relative w-full aspect-square rounded-[32px] overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
        <Image
          src={data.productImage || data.farmImage || "/assets/bowo-senang.png"}
          alt={data.commodity}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 440px) 100vw, 440px"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Badges Overlaid on Image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#0F4C25]/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full border border-white/20 shadow-md">
            {data.grade}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          {data.allowNegotiation && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Bisa Nego
            </span>
          )}
        </div>

        {/* Bottom Location Tag */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center justify-between">
          <span className="text-xs font-extrabold flex items-center gap-1.5 drop-shadow-md">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {data.farmerLocation} ({data.distanceKm} km dari Toko Anda)
          </span>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="bg-white rounded-[28px] p-5 border border-gray-200 shadow-sm space-y-4">
        {/* Title & Status */}
        <div className="space-y-1 border-b border-gray-100 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {data.harvestCategory}
            </span>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {data.harvestStatus}
            </span>
          </div>

          <h2 className="text-lg font-black text-[#1A1C19] leading-snug">
            {data.commodity}
          </h2>
        </div>

        {/* Pricing & HPP Section */}
        <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-200/80 space-y-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">
            Harga Jual Lahan Petani
          </span>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#0F4C25]">
                Rp {data.sellingPrice.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-extrabold text-gray-500">/kg</span>
            </div>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
              Margin Fair +{marginFromHpp}%
            </span>
          </div>

          {/* Transparansi HPP Callout */}
          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-extrabold text-gray-700">
                Estimasi HPP Petani: Rp {data.hppPerKg.toLocaleString("id-ID")}/kg
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowHppDetail(!showHppDetail)}
              className="text-[11px] font-bold text-[#0F4C25] hover:underline cursor-pointer"
            >
              {showHppDetail ? "Sembunyikan" : "Detail HPP"}
            </button>
          </div>

          {/* Expanded HPP Breakdown */}
          {showHppDetail && (
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] space-y-1.5 font-medium animate-fade-in text-gray-600">
              <p className="font-extrabold text-[#1A1C19]">Rincian Transparansi HPP Petani:</p>
              <div className="flex justify-between">
                <span>Biaya Bibit & Olah Lahan</span>
                <span>Rp 8.500 /kg</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pupuk NPK & Organik</span>
                <span>Rp 12.000 /kg</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pestisida & Perawatan</span>
                <span>Rp 4.000 /kg</span>
              </div>
              <div className="flex justify-between">
                <span>Upah Tenaga Kerja Panen</span>
                <span>Rp 4.000 /kg</span>
              </div>
              <div className="border-t border-gray-200 pt-1 font-bold flex justify-between text-[#0F4C25]">
                <span>TOTAL HPP PANEN</span>
                <span>Rp {data.hppPerKg.toLocaleString("id-ID")} /kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Stock & Availability Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
            <span className="text-[10px] text-gray-500 font-medium block">Total Stok Tersedia</span>
            <span className="text-sm font-black text-[#1A1C19]">{data.availableKg} kg</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
            <span className="text-[10px] text-gray-500 font-medium block">Status Negosiasi</span>
            <span className="text-xs font-black text-amber-700">
              {data.allowNegotiation ? "Bisa Nego Harga" : "Harga Tetap (Pas)"}
            </span>
          </div>
        </div>
      </div>

      {/* Farmer Profile Card */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Informasi Mitra Petani
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden relative">
              <Image
                src={data.farmerAvatar || data.farmImage || "/assets/bowo-senang.png"}
                alt={data.farmerName}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-[#1A1C19] flex items-center gap-1">
                {data.farmerName}
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C25]" />
              </h4>
              <p className="text-[10px] text-gray-500 font-medium">
                {data.farmerLocation} ({data.distanceKm} km)
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="text-amber-600 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                  ⭐ {data.farmerRating}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{data.farmerTotalSales} Transaksi Selesai</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-extrabold text-[#0F4C25] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Terverifikasi
          </span>
        </div>
      </div>

      {/* Quality Standards & SNI Description */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-2.5 text-xs">
        <h3 className="font-black text-[#1A1C19] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#0F4C25]" />
          Standar Mutu Panen & Jaminan SNI
        </h3>
        <p className="text-gray-600 leading-relaxed font-medium">
          Produk <strong className="text-[#1A1C19]">{data.commodity}</strong> dipanen secara langsung dari lahan pertanian mitra {data.farmerName}. Bebas pestisida berlebih dan dipilah sesuai standar kualifikasi <strong className="text-[#0F4C25]">{data.grade}</strong>.
        </p>
      </div>

      {/* Sticky Bottom Action Bar (Shopee / Tokopedia Style) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl p-3 flex gap-2.5 items-center z-50">
        {data.allowNegotiation ? (
          <button
            type="button"
            onClick={() => onSelectNego(data)}
            className="flex-1 h-12 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-700" />
            <span>Ajukan Nego</span>
          </button>
        ) : (
          <div className="flex-1 h-12 bg-gray-100 border border-gray-200 text-gray-400 font-extrabold rounded-2xl text-xs flex items-center justify-center">
            Harga Tetap
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectBuy(data)}
          className="flex-1 h-12 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-300" />
          <span>Beli Escrow</span>
        </button>
      </div>
    </div>
  );
}
