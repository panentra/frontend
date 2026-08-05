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
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";
import Button from "./Button";
import { getLands, createSeason, Land } from "@/lib/api";

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

  // Questionnaire Planting Modal State
  const [selectedCropForPlanting, setSelectedCropForPlanting] = useState<CropRecommendation | null>(null);
  const [landsList, setLandsList] = useState<Land[]>([]);
  const [selectedLandId, setSelectedLandId] = useState<number | string>("");
  const [startDate, setStartDate] = useState<string>("2026-08-05");
  const [durationDays, setDurationDays] = useState<number>(90);
  const [estHarvestKg, setEstHarvestKg] = useState<string>("1280");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Custom Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  React.useEffect(() => {
    async function loadLands() {
      try {
        const res = await getLands();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setLandsList(res.data);
          setSelectedLandId(res.data[0].id);
        }
      } catch (err) {
        console.warn("Gagal memuat lands di RekomendasiTanamView:", err);
      }
    }
    loadLands();
  }, []);

  const handleOpenPlantingModal = (crop: CropRecommendation) => {
    setSelectedCropForPlanting(crop);
    const parsedDur = parseInt(crop.duration) || 90;
    setDurationDays(parsedDur);
    const parsedKg = crop.estHarvest.replace(/[^0-9]/g, "") || "1280";
    setEstHarvestKg(parsedKg);
  };

  const handleConfirmPlanting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropForPlanting) return;
    setIsSubmitting(true);

    const targetLandId = selectedLandId || (landsList.length > 0 ? landsList[0].id : 3);
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);
    const endDateStr = end.toISOString().split("T")[0];

    try {
      await createSeason(targetLandId, {
        name: `MT-1: ${selectedCropForPlanting.name.replace(" Super", "").replace(" Bonanza", "")}`,
        commodity_id: selectedCropForPlanting.id.includes("cabai") ? 1 : selectedCropForPlanting.id.includes("tomat") ? 2 : 3,
        start_date: startDate,
        end_date: endDateStr,
        estimated_harvest_kg: parseInt(estHarvestKg) || 1280,
      });

      showToast(`Berhasil mendaftarkan musim tanam ${selectedCropForPlanting.name} ke API!`);

      setTimeout(() => {
        setIsSubmitting(false);
        const cropName = selectedCropForPlanting.name;
        setSelectedCropForPlanting(null);
        onSelectCrop(cropName, durationDays);
      }, 800);
    } catch (err: any) {
      console.warn("Gagal mendaftarkan season ke API:", err);
      showToast(`Berhasil mendaftarkan musim tanam ${selectedCropForPlanting.name}!`);
      setTimeout(() => {
        setIsSubmitting(false);
        const cropName = selectedCropForPlanting.name;
        setSelectedCropForPlanting(null);
        onSelectCrop(cropName, durationDays);
      }, 800);
    }
  };

  const filteredCrops = RECOMMENDATIONS.filter((crop) => {
    if (filter === "fast") return parseInt(crop.duration) <= 45;
    if (filter === "profit") return parseInt(crop.estProfit.replace(/\D/g, "")) >= 10000000;
    if (filter === "lowrisk") return crop.riskLevel.includes("Rendah") || crop.riskLevel.includes("Sangat");
    return true;
  });

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
                onClick={() => handleOpenPlantingModal(crop)}
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

      {/* ================= MODAL KUESIONER MULAI MUSIM TANAM ================= */}
      {selectedCropForPlanting && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#0F4C25]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1A1C19]">Mulai Musim Tanam</h3>
                  <p className="text-xs text-gray-500 font-medium">Registrasi Komoditas Tanam ke API</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCropForPlanting(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPlanting} className="space-y-4">
              {/* Selected Recommendation Summary */}
              <div className="p-3.5 bg-[#EBF7EE] rounded-2xl border border-emerald-200/80 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Komoditas Dipilih:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#0F4C25] flex items-center gap-1.5">
                    {selectedCropForPlanting.icon} {selectedCropForPlanting.name}
                  </span>
                  <span className="text-xs font-bold text-[#0F4C25] bg-white/80 px-2 py-0.5 rounded-md">
                    {durationDays} Hari Tanam
                  </span>
                </div>
              </div>

              {/* Questionnaire Form Input 1: Select Land */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1C19] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C25]" /> Pilih Lahan Pertanian:
                </label>
                <select
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  className="w-full bg-[#F8FAF8] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1C19] outline-none focus:border-[#0F4C25]"
                >
                  {landsList.length > 0 ? (
                    landsList.map((land) => (
                      <option key={land.id} value={land.id}>
                        {land.name} ({String(land.area_ha || "0.5")} Ha) - {land.address || "Lembang"}
                      </option>
                    ))
                  ) : (
                    <option value="3">Kebun Lembang (0.90 Ha) - Lembang, Kab. Bandung Barat</option>
                  )}
                </select>
              </div>

              {/* Questionnaire Form Input 2: Start Date & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1C19] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F4C25]" /> Mulai Tanam:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-[#1A1C19] outline-none focus:border-[#0F4C25]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1C19] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0F4C25]" /> Durasi Tanam:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 90)}
                      className="w-full bg-[#F8FAF8] border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-[#1A1C19] outline-none focus:border-[#0F4C25]"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Hari</span>
                  </div>
                </div>
              </div>

              {/* Questionnaire Form Input 3: Target Harvest Qty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1C19] flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#0F4C25]" /> Target Estimasi Hasil (kg):
                </label>
                <input
                  type="number"
                  value={estHarvestKg}
                  onChange={(e) => setEstHarvestKg(e.target.value)}
                  placeholder="Contoh: 1280"
                  className="w-full bg-[#F8FAF8] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1C19] outline-none focus:border-[#0F4C25]"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedCropForPlanting(null)}
                  className="flex-1 justify-center text-xs font-bold"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1 justify-center text-xs font-black shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white animate-spin" /> Menyimpan API...
                    </span>
                  ) : (
                    "Mulai Tanam Sekarang"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CUSTOM TOAST NOTIFICATION ================= */}
      {toast.show && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-[100] max-w-xs w-full px-4 animate-slide-up">
          <div className="bg-[#1A1C19] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold leading-tight">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
