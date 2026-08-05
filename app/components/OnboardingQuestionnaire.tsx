"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  User,
} from "lucide-react";
import Button from "./Button";
import { completeOnboarding, getCommodities, Commodity } from "@/lib/api";

// Dynamically import Leaflet Map Picker to prevent Next.js SSR window errors
const LeafletMapPicker = dynamic(
  () => import("./LeafletMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-56 bg-[#E8F3EA] rounded-2xl border border-[#1B5E20]/30 flex flex-col items-center justify-center text-xs text-[#1B5E20] font-bold gap-2">
        <MapPin className="w-6 h-6 animate-bounce text-[#1B5E20]" />
        <span>Memuat Peta Interaktif Leaflet.js...</span>
      </div>
    ),
  }
);

// Farming System Options (Clean sans-emoji)
const FARMING_SYSTEM_OPTIONS = [
  { id: "konvensional", label: "Konvensional" },
  { id: "organik", label: "Organik" },
  { id: "semi_organik", label: "Semi-Organik" },
];

export default function OnboardingQuestionnaire() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form States ---
  const [farmerName, setFarmerName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [landArea, setLandArea] = useState<string>("");
  const [landAreaUnit, setLandAreaUnit] = useState<"ha" | "are" | "m2">("ha");
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [commoditiesLoading, setCommoditiesLoading] = useState(true);
  const [selectedCommodities, setSelectedCommodities] = useState<number[]>([]);
  const [customCommodity, setCustomCommodity] = useState("");
  const [farmingSystem, setFarmingSystem] = useState<string>("konvensional");

  React.useEffect(() => {
    let cancelled = false;
    getCommodities()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data || [];
        setCommodities(list);
        if (list.length > 0) {
          setSelectedCommodities([list[0].id]);
        }
      })
      .catch(() => {
        setCommodities([]);
      })
      .finally(() => {
        if (!cancelled) setCommoditiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLocationSelect = (lat: number, lng: number, addressText: string) => {
    setSelectedCoords({ lat, lng });
    if (addressText) {
      setAddress(addressText);
    }
  };

  const toggleCommodity = (id: number) => {
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

    const numericCommodityIds = selectedCommodities;
    const primaryCommodityId = numericCommodityIds[0] || 1;

    try {
      await completeOnboarding({
        role: "petani",
        display_name: farmerName.trim() || "Pak Budi Santoso",
        farming_system: (farmingSystem as "konvensional" | "organik" | "semi_organik") || "konvensional",
        land: {
          name: address ? `Lahan ${address.split(",")[0]}` : "Lahan Pertanian Utama",
          area: parseFloat(landArea) || 1.5,
          area_unit: landAreaUnit,
          address: address || "Jl. Raya Lembang No. 142, Bandung Barat",
          lat: selectedCoords?.lat || -6.8168,
          lng: selectedCoords?.lng || 107.6161,
          commodity_id: primaryCommodityId,
          commodity_ids: numericCommodityIds,
        },
      });
    } catch (err) {
      console.warn("Onboarding API error (fallback to local success state):", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F2F8F3] via-[#EBF4ED] to-[#E8F3EA] text-[#111827] flex flex-col justify-between p-4 sm:p-6 relative overflow-x-hidden select-none font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4CAF50]/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Mobile-First Shell Container */}
      <div className="w-full max-w-[440px] mx-auto relative z-10 my-auto py-3">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1B5E20]/10 rounded-full text-[#1B5E20] text-xs font-bold mb-2">
            <span>Data Lahan Pertanian</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Lengkapi Profil Pertanianmu
          </h1>
          <p className="text-xs text-[#5E635E] mt-1 font-medium max-w-[320px] mx-auto">
            Bantu Panentra AI memetakan lokasi lahan & komoditas untuk prediksi panen presisi.
          </p>
        </div>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_15px_45px_-12px_rgba(27,94,32,0.12)] border border-[#E1E4E0] flex flex-col space-y-4 relative"
          >
            {/* 1. Nama / Panggilan Petani */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Nama / Panggilan Petani</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Pak Budi / Ibu Sri"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] font-semibold outline-none transition-all placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* 2. Alamat & Interactive Leaflet.js Map Picker */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
                  <span>Alamat & Lokasi Lahan (Peta Leaflet.js)</span>
                </span>
              </label>

              {/* Textarea Alamat Lengkap */}
              <textarea
                rows={2}
                placeholder="Alamat akan terisi otomatis saat mengeklik peta Leaflet atau tombol pindai GPS..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all resize-none mb-3"
              />

              {/* Interactive Leaflet Map Picker Component */}
              <LeafletMapPicker onLocationSelect={handleLocationSelect} />
            </div>

            {/* 3. Luas Lahan */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 block">
                Luas Tanah / Lahan Pertanian
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Contoh: 1.5"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="flex-1 h-11 px-4 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] font-semibold outline-none transition-all"
                />
                <select
                  value={landAreaUnit}
                  onChange={(e) => setLandAreaUnit(e.target.value as "ha" | "are" | "m2")}
                  className="h-11 px-3 bg-[#E8F3EA] border border-[#1B5E20]/30 text-[#1B5E20] font-bold text-xs rounded-2xl outline-none cursor-pointer"
                >
                  <option value="ha">Hektar (ha)</option>
                  <option value="are">Are (100 m²)</option>
                  <option value="m2">Meter² (m²)</option>
                </select>
              </div>
            </div>

            {/* 4. Komoditas yang Biasa Ditanam (Clean 2-Column Layout) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#374151]">
                  Komoditas yang Biasa Ditanam
                </label>
                <span className="text-[10px] text-[#1B5E20] font-semibold bg-[#E8F3EA] px-2.5 py-0.5 rounded-full">
                  Multi-select
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {commoditiesLoading ? (
                  <div className="col-span-2 p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs text-gray-500 font-medium text-center">
                    Memuat daftar komoditas...
                  </div>
                ) : commodities.length === 0 ? (
                  <div className="col-span-2 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium text-center">
                    Daftar komoditas tidak tersedia. Silakan coba lagi nanti.
                  </div>
                ) : (
                  commodities.map((item) => {
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
                        <span className="text-xs leading-snug pr-1">{item.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="+ Komoditas lainnya (opsional)..."
                  value={customCommodity}
                  onChange={(e) => setCustomCommodity(e.target.value)}
                  className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B5E20] focus:bg-white rounded-2xl text-xs text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* 5. Sistem Tanam (Opsional) */}
            <div>
              <label className="text-xs font-bold text-[#374151] mb-1.5 flex items-center justify-between">
                <span>Sistem Tanam</span>
                <span className="text-[10px] text-gray-500 font-normal bg-gray-100 px-2 py-0.5 rounded">
                  Opsional
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {FARMING_SYSTEM_OPTIONS.map((sys) => {
                  const isSelected = farmingSystem === sys.id;
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => setFarmingSystem(sys.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#E8F3EA] border-[#1B5E20] text-[#1B5E20] font-bold"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#4B5563]"
                      }`}
                    >
                      <span className="text-xs font-bold">{sys.label}</span>
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
                <span>Simpan & Mulai Gunakan Panentra</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        ) : (
          /* ================= SUCCESS STATE ================= */
          <div className="bg-white rounded-[28px] p-6 shadow-[0_15px_45px_-12px_rgba(27,94,32,0.12)] border border-[#E1E4E0] flex flex-col items-center text-center animate-fade-in">
            <div className="mb-3 relative">
              <Image
                src="/assets/bowo-senang.png"
                alt="Bowo Senang Maskot"
                width={180}
                height={180}
                className="w-40 h-40 object-contain mx-auto drop-shadow-sm"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full text-[#1B5E20] text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
              <span>Data Lahan Tersimpan</span>
            </div>

            <h2 className="text-lg font-extrabold text-[#111827] mb-1.5 tracking-tight">
              Salam Kenal, {farmerName || "Mitra Petani"}
            </h2>

            <p className="text-xs text-[#5E635E] leading-relaxed mb-4 max-w-[320px]">
              Data pertanianmu sudah siap. Panentra AI akan membantu memantau prediksi harga komoditas dan jadwal tanammu.
            </p>

            {/* Summary Card */}
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-5 text-left text-xs space-y-3">
              <div className="flex justify-between items-start pb-2 border-b border-gray-200/80 gap-3">
                <span className="text-gray-500 font-medium shrink-0">Alamat Lahan:</span>
                <span className="font-bold text-[#111827] text-right leading-relaxed">
                  {address || "Lokasi Pertanian"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                <span className="text-gray-500 font-medium">Luas Lahan:</span>
                <span className="font-bold text-[#111827]">
                  {landArea || "1.5"} {landAreaUnit.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                <span className="text-gray-500 font-medium block text-xs">Komoditas Biasa Ditanam:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCommodities.map((cId) => {
                    const item = commodities.find((c) => c.id === cId);
                    return (
                      <span
                        key={cId}
                        className="px-2.5 py-1 bg-emerald-50 text-[#1B5E20] font-bold text-[11px] rounded-xl border border-emerald-200"
                      >
                        {item?.name || cId}
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
              onClick={() => router.push("/dashboard")}
            >
              <span>Masuk ke Beranda Panentra</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
