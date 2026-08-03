"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Sparkles,
  MapPin,
  Sun,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sprout,
  DollarSign,
  ArrowRight,
  Info,
  Filter,
} from "lucide-react";
import Button from "./Button";

interface CropRecommendation {
  id: string;
  rank: number;
  name: string;
  category: string;
  icon: string;
  duration: string;
  priceTrend: string;
  trendType: "up" | "high" | "stable";
  reason: string;
  estHarvest: string;
  estProfit: string;
  riskLevel: string;
  soilMatch: string;
  isTopPick?: boolean;
}

const RECOMMENDATIONS: CropRecommendation[] = [
  {
    id: "cabai-rawit",
    rank: 1,
    name: "Cabai Rawit Merah Super",
    category: "Bahan-Bahan / Hortikultura",
    icon: "🌶️",
    duration: "90 Hari",
    priceTrend: "Harga Naik +15%",
    trendType: "up",
    reason:
      "Sangat cocok untuk iklim sedang Lembang (1.200 mdpl) di musim kemarau. Pasokan pasar induk lokal sedang rendah sedangkan permintaan industri kuliner & resto tinggi.",
    estHarvest: "1.280 kg / 0.5 Ha",
    estProfit: "Rp 15.000.000",
    riskLevel: "Rendah (Tahan Kemarau)",
    soilMatch: "98% Cocok (Tanah Humus Subur)",
    isTopPick: true,
  },
  {
    id: "jagung-manis",
    rank: 2,
    name: "Jagung Manis Bonanza",
    category: "Pangan & Perkebunan",
    icon: "🌽",
    duration: "70 Hari",
    priceTrend: "Permintaan Sangat Tinggi",
    trendType: "high",
    reason:
      "Siklus tanam sedang dengan kebutuhan air efisien. Pasar swalayan modern dan mitra pedagang pasar siap menampung seluruh hasil panen dengan kontrak harga stabil.",
    estHarvest: "2.400 kg / 0.5 Ha",
    estProfit: "Rp 10.500.000",
    riskLevel: "Sangat Rendah",
    soilMatch: "94% Cocok",
  },
  {
    id: "sawi-hijau",
    rank: 3,
    name: "Sawi Hijau / Pakcoy Hydro",
    category: "Sayuran Dedaunan",
    icon: "🥬",
    duration: "35 Hari",
    priceTrend: "Harga Stabil",
    trendType: "stable",
    reason:
      "Panen kilat dalam 1 bulan! Solusi perputaran arus kas tercepat untuk petani. Risiko cuaca sangat minim dan biaya operasional bibit relatif rendah.",
    estHarvest: "850 kg / 0.5 Ha",
    estProfit: "Rp 6.000.000",
    riskLevel: "Rendah",
    soilMatch: "96% Cocok",
  },
];

interface RekomendasiTanamViewProps {
  onBack: () => void;
  onSelectCrop: (cropName: string, days: number) => void;
}

export default function RekomendasiTanamView({
  onBack,
  onSelectCrop,
}: RekomendasiTanamViewProps) {
  const [filter, setFilter] = useState<"all" | "fast" | "profit" | "lowrisk">("all");
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  const filteredCrops = RECOMMENDATIONS.filter((crop) => {
    if (filter === "fast") return parseInt(crop.duration) <= 45;
    if (filter === "profit") return parseInt(crop.estProfit.replace(/\D/g, "")) >= 10000000;
    if (filter === "lowrisk") return crop.riskLevel.includes("Rendah") || crop.riskLevel.includes("Sangat");
    return true;
  });

  const handleChoose = (crop: CropRecommendation) => {
    setSelectedCropId(crop.id);
    setTimeout(() => {
      onSelectCrop(crop.name, parseInt(crop.duration));
    }, 400);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1A1C19] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1A1C19] tracking-tight flex items-center gap-1.5">
            Rekomendasi Tanam AI
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Analisis Presisi Berdasarkan BMKG, Lokasi & Tren Pasar
          </p>
        </div>
      </div>

      {/* Hero Banner: AI Analysis Context */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[32px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl min-h-[155px] flex items-center">
        {/* Text Content (Layered ON TOP) */}
        <div className="space-y-1.5 z-10 relative max-w-[62%]">
          <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-md">
            Rekomendasi Musim Tanam Lembang
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-medium drop-shadow-sm">
            Sistem telah memproses data cuaca 3 bulan ke depan & histori harga pasar terdekat untuk hasil panen paling menguntungkan.
          </p>
        </div>

        {/* Enlarged Mascot (Positioned with depth & scale) */}
        <div className="absolute -right-3 -bottom-6 z-0 w-44 h-44 sm:w-48 sm:h-48 pointer-events-none">
          <Image
            src="/assets/bowo-ide.png"
            alt="Bowo Rekomendasi Tanam AI"
            width={220}
            height={220}
            className="w-full h-full object-contain drop-shadow-2xl scale-110"
            priority
          />
        </div>
      </div>

      {/* 3 Core Factors Grid Banner */}
      <div className="space-y-2">
        <span className="text-xs font-black text-[#1A1C19] uppercase tracking-wider block">
          3 Faktor Utama Rekomendasi:
        </span>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-1 text-center flex flex-col justify-center items-center min-h-[76px]">
            <span className="text-[10px] font-bold text-gray-500 block">Lokasi Lahan</span>
            <span className="text-xs font-black text-[#1A1C19]">Lembang (1.200 mdpl)</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-1 text-center flex flex-col justify-center items-center min-h-[76px]">
            <span className="text-[10px] font-bold text-gray-500 block">Prakiraan Cuaca</span>
            <span className="text-xs font-black text-[#1A1C19]">Musim Kemarau</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-1 text-center flex flex-col justify-center items-center min-h-[76px]">
            <span className="text-[10px] font-bold text-gray-500 block">Tren Permintaan</span>
            <span className="text-xs font-black text-[#0F4C25]">Naik +15%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[#0F4C25] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Semua Rekomendasi
        </button>
        <button
          type="button"
          onClick={() => setFilter("profit")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            filter === "profit"
              ? "bg-[#0F4C25] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Profit Tertinggi
        </button>
        <button
          type="button"
          onClick={() => setFilter("fast")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            filter === "fast"
              ? "bg-[#0F4C25] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Panen Kilat (30-45 Hari)
        </button>
        <button
          type="button"
          onClick={() => setFilter("lowrisk")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            filter === "lowrisk"
              ? "bg-[#0F4C25] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Risiko Rendah
        </button>
      </div>

      {/* Crop Cards List */}
      <div className="space-y-4">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          return (
            <div
              key={crop.id}
              className={`bg-white rounded-[28px] p-5 border transition-all shadow-md relative overflow-hidden space-y-3.5 ${
                crop.isTopPick
                  ? "border-[#0F4C25] ring-2 ring-[#0F4C25]/20"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              {/* Card Header with Title & Price Trend Badge */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-black text-[#1A1C19] leading-snug">
                    {crop.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#0F4C25] text-xs font-extrabold border border-emerald-200/70 whitespace-nowrap">
                      {crop.duration}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black shrink-0 border shadow-2xs ${
                    crop.trendType === "up"
                      ? "bg-emerald-100 text-[#0F4C25] border-emerald-200"
                      : crop.trendType === "high"
                      ? "bg-amber-100 text-amber-900 border-amber-200"
                      : "bg-blue-100 text-blue-900 border-blue-200"
                  }`}
                >
                  {crop.priceTrend}
                </span>
              </div>

              {/* AI Reason Description */}
              <div className="p-3.5 bg-[#F8FAF8] rounded-2xl border border-gray-200 text-xs text-gray-700 leading-relaxed font-medium space-y-1">
                <span className="font-black text-[#0F4C25] flex items-center gap-1 text-[11px]">
                  Analisis AI Panentra:
                </span>
                <p>{crop.reason}</p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Estimasi Hasil</span>
                  <span className="font-black text-[#1A1C19]">{crop.estHarvest}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Potensi Profit</span>
                  <span className="font-black text-[#0F4C25]">{crop.estProfit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Tingkat Risiko</span>
                  <span className="font-extrabold text-amber-800">{crop.riskLevel}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => handleChoose(crop)}
                className="w-full justify-center text-xs font-black shadow-sm"
              >
                {isSelected ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Tanam Ini
                  </span>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
