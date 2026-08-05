"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  DollarSign,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import Button from "./Button";
import { getMarketPrices, MarketPriceItem } from "@/lib/api";
import Snackbar, { useSnackbar } from "./Snackbar";

interface MarketPriceDisplay {
  id: string;
  name: string;
  category: string;
  farmerPrice: string;
  marketPrice: string;
  margin: string;
  trend: "up" | "down";
  location: string;
  status: string;
  harvestVol: string;
  image: string;
}

function formatRupiah(num: number): string {
  return `Rp ${num.toLocaleString("id-ID")} / kg`;
}

function toDisplay(item: MarketPriceItem): MarketPriceDisplay {
  const marginPct =
    item.farmerPrice > 0
      ? Math.round(((item.marketPrice - item.farmerPrice) / item.farmerPrice) * 100)
      : 0;
  return {
    id: String(item.id),
    name: item.name,
    category: item.category || "Bahan-Bahan",
    farmerPrice: formatRupiah(item.farmerPrice),
    marketPrice: formatRupiah(item.marketPrice),
    margin: `+${marginPct}%`,
    trend: item.trend === "down" ? "down" : "up",
    location: item.location || "Lokasi Lahan",
    status: item.status || "Harga Stabil",
    harvestVol: item.harvestVol || "-",
    image: "/assets/budi-tren.png",
  };
}

export default function PasarHargaPemasokView() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [prices, setPrices] = useState<MarketPriceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();

  useEffect(() => {
    let cancelled = false;
    getMarketPrices()
      .then((res) => {
        if (cancelled) return;
        setPrices((res?.data || []).map(toDisplay));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setPrices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPrices = prices.filter((item) => {
    const matchCat = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          Pasaran Harga Jual Petani
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Transparansi Harga Lahan Petani vs Harga Pasar Grosir & Margin AI
        </p>
      </div>

      {/* AI Market Insight Callout Banner with budi-tren.png Mascot */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[65%]">
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Waktu Terbaik Borong Cabai Rawit & Pakcoy!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Panen raya di wilayah Lembang & Ciwidey menekan harga langsung di lahan petani hingga <span className="font-bold underline text-amber-300">-12%</span> di bawah rata-rata pasar. Potensi keuntungan grosir tinggi!
            </p>
          </div>

          <div className="w-28 h-28 shrink-0 relative -mr-2 -mb-6 pointer-events-none">
            <Image
              src="/assets/budi-baca.png"
              alt="Budi Tren Market AI"
              width={120}
              height={120}
              className="w-full h-full object-contain drop-shadow-lg scale-110"
              priority
            />
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari komoditas panen atau lokasi petani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#1B5E20] shadow-sm"
          />
        </div>

        <div className="relative">
          {/* Left Edge Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
            {["Semua", "Bahan-Bahan", "Sayuran", "Tanaman Perkebunan", "Pangan"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Edge Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Market Prices List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#1A1C19]">
            Daftar Pasaran Harga Lahan Petani
          </h3>
          <span className="text-xs font-bold text-[#1B5E20]">
            {loading ? "Memuat..." : `${filteredPrices.length} Komoditas`}
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-[28px] p-6 text-center space-y-3">
            <p className="text-xs font-bold text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                getMarketPrices()
                  .then((res) => setPrices((res?.data || []).map(toDisplay)))
                  .catch((err: Error) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
              className="h-10 px-4 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center gap-1.5 mx-auto text-[11px] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="space-y-3.5">
            {[0, 1].map((n) => (
              <div key={n} className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                <div className="h-10 bg-gray-100 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        )}

        {!error && !loading && filteredPrices.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-[28px] p-8 text-center space-y-2">
            <p className="text-sm font-black text-[#1A1C19]">Tidak ada data harga ditemukan</p>
            <p className="text-xs text-gray-500 font-medium">Coba ubah kata kunci atau kategori.</p>
          </div>
        )}

        {!error && !loading && filteredPrices.length > 0 && (
        <div className="space-y-3.5">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5 hover:border-[#0F4C25]/40 transition-all"
            >
              {/* Header Row: Title & Margin Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-[#1A1C19] line-clamp-1 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C25] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-[#0F4C25] border border-emerald-100 rounded-full text-[10px] font-extrabold inline-block">
                      {item.status}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-50 text-[#0F4C25] border border-emerald-200 rounded-xl text-xs font-black shrink-0 flex items-center gap-1 shadow-2xs">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  Margin {item.margin}
                </span>
              </div>

              {/* Price Breakdown Grid */}
              <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200/80 grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Harga Jual Petani
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#0F4C25] block">
                    {item.farmerPrice}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold block">
                    {item.harvestVol}
                  </span>
                </div>

                <div className="border-l border-gray-200/80 pl-3 space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Pasar Grosir
                  </span>
                  <span className="text-sm sm:text-base font-black text-gray-800 block">
                    {item.marketPrice}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Potensi Margin Tinggi
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => showSnackbar(`Membeli pasokan ${item.name} langsung dari Petani ${item.location}`, "info")}
                className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >

                <span>Beli Pasokan Langsung dari Petani Ini</span>
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

      <Snackbar snackbar={snackbar} onDismiss={dismissSnackbar} />
    </div>
  );
}
