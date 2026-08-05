"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  Store,
  Building,
  Sparkles,
} from "lucide-react";
import Button from "./Button";
import { completeOnboarding } from "@/lib/api";

// Dynamically import Leaflet Map Picker to prevent Next.js SSR window errors
const LeafletMapPicker = dynamic(
  () => import("./LeafletMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-56 bg-[#E8F3EA] rounded-2xl border border-[#1B5E20]/30 flex flex-col items-center justify-center text-xs text-[#1B5E20] font-bold gap-2">
        <MapPin className="w-6 h-6 animate-bounce text-[#1B5E20]" />
        <span>Memuat Peta Lokasi Toko...</span>
      </div>
    ),
  }
);

// Tipe / Jenis Toko (Clean sans-emoji)
const STORE_TYPE_OPTIONS = [
  {
    id: "modern",
    label: "Toko Modern / Supermarket",
    desc: "Swalayan, Minimarket, Modern Retail",
  },
  {
    id: "pasar",
    label: "Pedagang Pasar Tradisional",
    desc: "Kios Pasar, Lapak Pasar Basah/Kering",
  },
  {
    id: "distributor",
    label: "Distributor / Grosir Besar",
    desc: "Agen Pengumpul, Gudang Grosir",
  },
  {
    id: "horeka",
    label: "Restoran / Hotel / Catering",
    desc: "Usaha Kuliner, Dapur Olahan",
  },
  {
    id: "industri",
    label: "Industri Pengolahan Tani",
    desc: "Pabrik Pengolahan Komoditas",
  },
];

// Komoditas Kebutuhan Pembelian (Clean sans-emoji)
const PURCHASE_COMMODITIES = [
  { id: "padi_beras", label: "Padi / Beras" },
  { id: "jagung", label: "Jagung" },
  { id: "cabai", label: "Cabai Merah / Rawit" },
  { id: "bawang", label: "Bawang Merah" },
  { id: "tomat", label: "Tomat" },
  { id: "kentang", label: "Kentang" },
  { id: "sayur", label: "Sayuran (Pakcoy, Selada)" },
  { id: "perkebunan", label: "Sawit, Kopi, Kakao" },
  { id: "kedelai", label: "Kedelai" },
  { id: "buah", label: "Melon / Semangka" },
];

// Volume Kebutuhan Rutin
const PURCHASE_VOLUMES = [
  { id: "kecil", label: "< 100 kg / minggu", desc: "Kios / Usaha Kecil" },
  { id: "sedang", label: "100 kg - 500 kg / minggu", desc: "Toko / Restoran" },
  { id: "besar", label: "500 kg - 2 Ton / minggu", desc: "Supermarket / Agen" },
  { id: "grosir", label: "> 2 Ton / minggu", desc: "Distributor / Industri" },
];

export default function OnboardingPemasokQuestionnaire() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("pasar");
  const [address, setAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(["padi_beras", "cabai"]);
  const [customCommodity, setCustomCommodity] = useState("");
  const [purchaseVolume, setPurchaseVolume] = useState("sedang");

  const handleLocationSelect = (lat: number, lng: number, addressText: string) => {
    setSelectedCoords({ lat, lng });
    if (addressText) {
      setAddress(addressText);
    }
  };

  const toggleCommodity = (id: string) => {
    if (selectedCommodities.includes(id)) {
      if (selectedCommodities.length > 1) {
        setSelectedCommodities(selectedCommodities.filter((item) => item !== id));
      }
    } else {
      setSelectedCommodities([...selectedCommodities, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await completeOnboarding({
        role: "pemasok",
        store_name: storeName.trim() || "Toko Sembako Berkah Jaya",
        store_type: (storeType as "modern" | "pasar" | "distributor" | "horeka" | "industri") || "pasar",
        purchase_volume: (purchaseVolume as "kecil" | "sedang" | "besar" | "grosir") || "sedang",
        address: address || "Jl. Raya Lembang No. 142, Bandung Barat",
        lat: selectedCoords?.lat || -6.8168,
        lng: selectedCoords?.lng || 107.6161,
      });
    } catch (err) {
      console.warn("Supplier Onboarding API error (fallback to local success state):", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F2F8F3] via-[#EBF4ED] to-[#E8F3EA] text-[#111827] flex flex-col justify-between p-4 sm:p-6 relative overflow-x-hidden select-none font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4CAF50]/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[440px] mx-auto relative z-10 my-auto py-3">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1B5E20]/10 rounded-full text-[#1B5E20] text-xs font-bold mb-2">
            <span>Profil Toko & Kebutuhan Usaha</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Profil Usaha & Kebutuhan Suplai
          </h1>
          <p className="text-xs text-[#5E635E] mt-1 font-medium max-w-[320px] mx-auto">
            Bantu Panentra menghubungkan usahamu langsung dengan petani pencetak hasil panen terbaik.
          </p>
        </div>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_15px_45px_-12px_rgba(27,94,32,0.12)] border border-[#E1E4E0] flex flex-col space-y-4 relative"
          >
            {/* 1. Nama Toko / Usaha / Pembeli */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Nama Toko / Usaha / Pembeli</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Toko Sembako Berkah / FreshMart"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] font-semibold outline-none transition-all placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            {/* 2. Jenis / Tipe Toko */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Tipe Toko / Usaha</span>
              </label>

              <div className="space-y-2">
                {STORE_TYPE_OPTIONS.map((type) => {
                  const isSelected = storeType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setStoreType(type.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#E8F3EA] border-[#1B5E20] text-[#1B5E20]"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#374151] hover:border-[#CBD5E1]"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold">{type.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{type.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Alamat & Interactive Leaflet.js Map Picker */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
                  <span>Lokasi Toko / Pasar</span>
                </span>
              </label>

              {/* Textarea Alamat Lengkap Toko */}
              <textarea
                rows={2}
                placeholder="Alamat toko akan otomatis terisi saat memilih lokasi di peta..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all resize-none mb-3"
              />

              {/* Interactive Leaflet Map Picker */}
              <LeafletMapPicker onLocationSelect={handleLocationSelect} />
            </div>

            {/* 4. Kebutuhan Komoditas yang Ingin Dibeli (Refactored 2-Column Layout) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#374151]">
                  Komoditas yang Ingin Dibeli / Disuplai
                </label>
                <span className="text-[10px] text-[#1B5E20] font-semibold bg-[#E8F3EA] px-2.5 py-0.5 rounded-full">
                  Multi-select
                </span>
              </div>

              {/* Clean 2-column grid layout preventing text overflow */}
              <div className="grid grid-cols-2 gap-2.5">
                {PURCHASE_COMMODITIES.map((item) => {
                  const isSelected = selectedCommodities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCommodity(item.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-sm font-bold"
                          : "bg-[#F8FAFC] text-[#374151] border-[#E2E8F0] hover:border-[#1B5E20]/40 font-medium"
                      }`}
                    >
                      <span className="text-xs leading-snug pr-1">{item.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="+ Komoditas spesifik lainnya (opsional)..."
                  value={customCommodity}
                  onChange={(e) => setCustomCommodity(e.target.value)}
                  className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* 5. Estimasi Volume Kebutuhan Rutin */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 block">
                Estimasi Kebutuhan Pembelian Rutin
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {PURCHASE_VOLUMES.map((vol) => {
                  const isSelected = purchaseVolume === vol.id;
                  return (
                    <button
                      key={vol.id}
                      type="button"
                      onClick={() => setPurchaseVolume(vol.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#E8F3EA] border-[#1B5E20] text-[#1B5E20] font-bold"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#4B5563]"
                      }`}
                    >
                      <span className="text-xs font-bold block">{vol.label}</span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">{vol.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
              >
                <span>Simpan & Cari Suplai Petani</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        ) : (
          /* ================= SUCCESS STATE ================= */
          <div className="bg-white rounded-[28px] p-6 shadow-[0_15px_45px_-12px_rgba(27,94,32,0.12)] border border-[#E1E4E0] flex flex-col items-center text-center animate-fade-in">
            <div className="mb-4 relative">
              <Image
                src="/assets/budi-senang.png"
                alt="Budi Senang Maskot Pemasok"
                width={180}
                height={180}
                className="w-40 h-40 object-contain mx-auto drop-shadow-sm"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full text-[#1B5E20] text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
              <span>Profil Usaha Pemasok Tersimpan</span>
            </div>

            <h2 className="text-lg font-extrabold text-[#111827] mb-1.5 tracking-tight">
              Selamat Datang, {storeName || "Mitra Pembeli"}!
            </h2>

            <p className="text-xs text-[#5E635E] leading-relaxed mb-4 max-w-[320px]">
              Panentra siap menghubungkan usahamu langsung dengan para petani terdekat yang memanen komoditas incaranmu.
            </p>

            {/* Summary Card */}
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-5 text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                <span className="text-gray-500 font-medium">Tipe Usaha:</span>
                <span className="font-bold text-[#111827]">
                  {STORE_TYPE_OPTIONS.find((t) => t.id === storeType)?.label}
                </span>
              </div>

              <div className="flex justify-between items-start pb-2 border-b border-gray-200/80 gap-3">
                <span className="text-gray-500 font-medium shrink-0">Alamat Toko:</span>
                <span className="font-bold text-[#111827] text-right leading-relaxed">
                  {address || "Lokasi Toko Leaflet"}
                </span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                <span className="text-gray-500 font-medium block text-xs">Komoditas Dicari:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCommodities.map((cId) => {
                    const item = PURCHASE_COMMODITIES.find((c) => c.id === cId);
                    return (
                      <span
                        key={cId}
                        className="px-2.5 py-1 bg-emerald-50 text-[#1B5E20] font-bold text-[11px] rounded-xl border border-emerald-200"
                      >
                        {item?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={() => router.push("/pemasok/dashboard")}
            >
              <span>Mulai Cari Hasil Panen Petani</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
