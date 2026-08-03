"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Button from "./Button";

const MARKET_PRICES = [
  {
    id: "cabai",
    name: "Cabai Rawit Merah Super",
    category: "Bahan-Bahan",
    farmerPrice: "Rp 35.000 / kg",
    marketPrice: "Rp 46.000 / kg",
    margin: "+31%",
    trend: "up",
    location: "Lembang, Bandung Barat",
    status: "Panen Raya (Oversupply)",
    harvestVol: "1.280 kg Siap Beli",
    image: "/assets/bowo-senang.png",
  },
  {
    id: "pakcoy",
    name: "Pakcoy Hydroponic Grade A",
    category: "Sayuran",
    farmerPrice: "Rp 18.000 / kg",
    marketPrice: "Rp 24.000 / kg",
    margin: "+33%",
    trend: "up",
    location: "Ciwidey, Bandung",
    status: "Stok Melimpah",
    harvestVol: "850 kg Siap Beli",
    image: "/assets/budi-kaget.png",
  },
  {
    id: "tomat",
    name: "Tomat Red Super",
    category: "Bahan-Bahan",
    farmerPrice: "Rp 12.000 / kg",
    marketPrice: "Rp 16.500 / kg",
    margin: "+37.5%",
    trend: "down",
    location: "Pangalengan",
    status: "Harga Stabil",
    harvestVol: "2.100 kg Siap Beli",
    image: "/assets/bowo-calendar.png",
  },
  {
    id: "kopi",
    name: "Kopi Arabika Bean",
    category: "Tanaman Perkebunan",
    farmerPrice: "Rp 95.000 / kg",
    marketPrice: "Rp 120.000 / kg",
    margin: "+26.3%",
    trend: "up",
    location: "Garut",
    status: "Permintaan Tinggi",
    harvestVol: "500 kg Siap Beli",
    image: "/assets/bowo-senang.png",
  },
];

export default function PasarHargaPemasokView() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrices = MARKET_PRICES.filter((item) => {
    const matchCat = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#1B5E20]" />
          Pasaran Harga Jual Petani
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Transparansi Harga Lahan Petani vs Harga Pasar Grosir & Margin AI
        </p>
      </div>

      {/* AI Market Insight Callout Banner */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-2 relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase text-emerald-100 border border-white/20 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI Buyer Market Intelligence
            </span>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Waktu Terbaik Borong Cabai Rawit & Pakcoy!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Panen raya di wilayah Lembang & Ciwidey menekan harga langsung di lahan petani hingga <span className="font-bold underline text-amber-300">-12%</span> di bawah rata-rata pasar. Potensi keuntungan grosir tinggi!
            </p>
          </div>

          <div className="w-22 h-22 sm:w-26 sm:h-26 shrink-0 relative -mr-2 -mb-2">
            <Image
              src="/assets/bowo-senang.png"
              alt="Bowo Market AI"
              width={100}
              height={100}
              className="w-full h-full object-contain drop-shadow-md"
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
            {filteredPrices.length} Komoditas
          </span>
        </div>

        <div className="space-y-3">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[24px] p-4 border border-[#E1E4E0] shadow-sm space-y-3 hover:border-emerald-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-extrabold text-[#1A1C19] flex items-center gap-1.5">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#1B5E20]" />
                      {item.location}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#1B5E20] rounded-full text-[10px] font-extrabold">
                      {item.status}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-xl text-xs font-black shrink-0 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Margin {item.margin}
                </span>
              </div>

              {/* Price Breakdown Grid */}
              <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div className="border-r border-gray-200 pr-2">
                  <span className="text-[10px] text-gray-500 font-medium block">
                    Harga Jual Petani (Lahan)
                  </span>
                  <span className="text-sm font-black text-[#1B5E20]">
                    {item.farmerPrice}
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold block">
                    {item.harvestVol}
                  </span>
                </div>

                <div className="pl-2">
                  <span className="text-[10px] text-gray-500 font-medium block">
                    Harga Acuan Pasar Grosir
                  </span>
                  <span className="text-sm font-black text-gray-800">
                    {item.marketPrice}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-bold block">
                    Potensi Untung Lebih Tinggi
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => alert(`Membeli pasokan ${item.name} langsung dari Petani ${item.location}`)}
                className="w-full justify-center text-xs"
              >
                Beli Pasokan Langsung dari Petani Ini
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
