"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Upload,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Info,
  Building2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "./Button";

interface JualPanenViewProps {
  onBack: () => void;
  hppPerKg?: number;
  totalExpenseSum?: number;
  cropName?: string;
}

// Standar Grade Nasional Data
const NATIONAL_GRADES = [
  {
    id: "grade-a",
    grade: "Grade A",
    title: "Super Premium",
    priceRange: "Rp 38.000 - Rp 42.000 / kg",
    recommendedPrice: 39500,
    specs: "Panjang ≥ 4 cm, Warna Merah 95%+, Bebas Cacat & Segar Mulus",
    targetMarket: "Supermarket, Restoran Modern & Hotel",
    marginPercent: "+113%",
    badgeColor: "bg-emerald-100 text-[#0F4C25] border-emerald-200",
  },
  {
    id: "grade-b",
    grade: "Grade B",
    title: "Standar Pasar",
    priceRange: "Rp 32.000 - Rp 35.000 / kg",
    recommendedPrice: 33500,
    specs: "Panjang 3-4 cm, Warna Merah 80%+, Kualitas Pasar Tradisional",
    targetMarket: "Pedagang Pasar Induk & Agen Sayur",
    marginPercent: "+81%",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
  },
  {
    id: "grade-c",
    grade: "Grade C",
    title: "Industri Olahan",
    priceRange: "Rp 24.000 - Rp 27.000 / kg",
    recommendedPrice: 25000,
    specs: "Ukuran bervariasi, Cocok untuk Pengolahan Sambal Botol/Pabrik",
    targetMarket: "Pabrik Saus, Katering & Industri Olahan",
    marginPercent: "+35%",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
  },
];

// Live Market Benchmark Data (Hasil Penjualan Petani Lain)
const NEARBY_FARMER_SALES = [
  {
    id: 1,
    name: "Pak Budi Utomo",
    location: "Lembang (2 km dari Anda)",
    crop: "Cabai Rawit Merah",
    grade: "Grade A",
    price: 40000,
    status: "Laku 250 kg ke Resto Sambal Nusantara",
    badge: "Terjual",
    badgeStyle: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: 2,
    name: "Pak Maman Suherman",
    location: "Ciwidey (12 km dari Anda)",
    crop: "Cabai Rawit Merah",
    grade: "Grade A",
    price: 39500,
    status: "Aktif Tayang di Marketplace Panentra",
    badge: "Pasar Aktif",
    badgeStyle: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: 3,
    name: "Pasar Induk Caringin",
    location: "Bandung (Harga Grosir)",
    crop: "Cabai Rawit Merah",
    grade: "Grade B",
    price: 34000,
    status: "Referensi Harga Patokan Grosir",
    badge: "Pasar Induk",
    badgeStyle: "bg-gray-100 text-gray-700 border-gray-200",
  },
];

export default function JualPanenView({
  onBack,
  hppPerKg = 18500,
  totalExpenseSum = 925000,
  cropName = "Cabai Rawit Merah",
}: JualPanenViewProps) {
  const [selectedGradeId, setSelectedGradeId] = useState("grade-a");
  const [saleQtyKg, setSaleQtyKg] = useState("50");
  const [customPrice, setCustomPrice] = useState("39500");
  const [saleSuccessMsg, setSaleSuccessMsg] = useState<string | null>(null);

  const selectedGradeObj = NATIONAL_GRADES.find((g) => g.id === selectedGradeId) || NATIONAL_GRADES[0];

  const handleSelectGrade = (grade: typeof NATIONAL_GRADES[0]) => {
    setSelectedGradeId(grade.id);
    setCustomPrice(grade.recommendedPrice.toString());
  };

  const qtyNumber = Math.max(1, parseInt(saleQtyKg || "1"));
  const priceNumber = parseInt(customPrice || "0");
  const calculatedTotalRevenue = qtyNumber * priceNumber;
  const calculatedTotalHpp = qtyNumber * hppPerKg;
  const calculatedNetProfit = calculatedTotalRevenue - calculatedTotalHpp;
  const calculatedProfitPercent = Math.round((calculatedNetProfit / Math.max(1, calculatedTotalHpp)) * 100);

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSuccessMsg(
      `Berhasil! Panen (${saleQtyKg} kg - ${selectedGradeObj.grade}) ditayangkan di Marketplace Panentra dengan harga Rp ${parseInt(customPrice).toLocaleString("id-ID")}/kg!`
    );
    setTimeout(() => {
      onBack();
    }, 2500);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Top Header Bar with Back Button */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
            Jual Panen & Benchmark Harga
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Standar Grade Nasional & Harga Pasaran Petani Lain
          </p>
        </div>
      </div>

      {/* Hero Banner: HPP Summary */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[32px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl min-h-[160px] flex items-center">
        <div className="space-y-1.5 z-10 relative max-w-[62%]">
          <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-md">
            Rekomendasi Margin Penjualan AI
          </h2>
          <div className="text-xs text-emerald-100/90 leading-relaxed font-medium space-y-0.5 drop-shadow-sm">
            <div>
              HPP Anda: <span className="font-extrabold text-white">Rp {hppPerKg.toLocaleString("id-ID")} / kg</span>
            </div>
            <div className="text-[11px] text-emerald-200/80">
              Total Biaya Produksi: Rp {totalExpenseSum.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {/* Mascot Image */}
        <div className="absolute -right-3 -bottom-6 z-0 w-44 h-44 sm:w-48 sm:h-48 pointer-events-none">
          <Image
            src="/assets/bowo-duit.png"
            alt="Bowo Panentra Jual Panen"
            width={220}
            height={220}
            className="w-full h-full object-contain drop-shadow-2xl scale-110"
            priority
          />
        </div>
      </div>

      {/* SECTION 1: STANDAR GRADE PANEN NASIONAL (SNI) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-[#1A1C19] flex items-center gap-1.5">
            1. Pilih Grade Panen (Standar SNI)
          </h2>
          <span className="text-[11px] font-bold text-gray-500">Pilih salah satu</span>
        </div>

        <div className="space-y-2.5">
          {NATIONAL_GRADES.map((item) => {
            const isSelected = selectedGradeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectGrade(item)}
                className={`bg-white rounded-[24px] p-4 border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "border-[#0F4C25] ring-2 ring-[#0F4C25]/20 shadow-md"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#1A1C19]">
                        {item.grade} — {item.title}
                      </span>
                      {isSelected && (
                        <span className="bg-[#0F4C25] text-white p-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-tight">{item.specs}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 ${item.badgeColor}`}>
                    {item.priceRange}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                  <span className="text-gray-500 font-medium">
                    Target Pembeli: <strong className="text-gray-800">{item.targetMarket}</strong>
                  </span>
                  <span className="font-extrabold text-[#0F4C25]">Margin {item.marginPercent}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: KOMPARASI HARGA PETANI LAIN & PASAR INDUK */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-[#1A1C19] flex items-center gap-1.5">
            2. Benchmark Harga Petani Lain ({cropName})
          </h2>
        </div>

        <div className="bg-[#F8FAF8] rounded-[28px] p-4 border border-gray-200 space-y-3">
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Berikut adalah referensi harga jual asli dari petani terdekat & pasar grosir daerah Anda sebagai bahan pertimbangan menetapkan harga:
          </p>

          <div className="space-y-2">
            {NEARBY_FARMER_SALES.map((sale) => (
              <div
                key={sale.id}
                className="bg-white p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#1A1C19]">{sale.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${sale.badgeStyle}`}>
                      {sale.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-semibold">{sale.location} · {sale.grade}</div>
                  <p className="text-[10px] text-gray-600 font-medium italic">{sale.status}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#0F4C25] block">
                    Rp {sale.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">/ kg</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-100/70 rounded-2xl border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-black text-[#0F4C25]">
              <Sparkles className="w-4 h-4" /> Kesimpulan AI Panentra:
            </div>
            <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
              Harga pasaran ideal untuk <strong>{selectedGradeObj.grade}</strong> berkisar antara{" "}
              <strong>Rp {selectedGradeObj.recommendedPrice.toLocaleString("id-ID")}/kg</strong>. Penjualan di atas HPP Rp {hppPerKg.toLocaleString("id-ID")}/kg menjamin keuntungan bersih yang sangat sehat.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FORM PENAYANGAN DI MARKETPLACE */}
      <section className="space-y-3 pt-1">
        <h2 className="text-sm sm:text-base font-black text-[#1A1C19] flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-[#0F4C25]" />
          3. Pasang Harga & Tayangkan Panen
        </h2>

        {saleSuccessMsg ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[28px] text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-[#0F4C25] mx-auto" />
            <h3 className="text-base font-black text-[#0F4C25]">Hasil Panen Berhasil Ditayangkan!</h3>
            <p className="text-xs text-gray-600 font-medium">{saleSuccessMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitSale} className="bg-white rounded-[28px] p-5 border border-gray-200 space-y-4 shadow-md">
            {/* Foto Input */}
            <div>
              <label className="font-black text-xs text-gray-700 mb-1.5 block">Foto Hasil Panen</label>
              <div className="w-full h-24 bg-[#F8FAF8] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0F4C25] transition-all">
                <Upload className="w-6 h-6 text-[#0F4C25] mb-1" />
                <span className="text-xs font-bold text-[#0F4C25]">Upload Foto Panen {cropName} ({selectedGradeObj.grade})</span>
              </div>
            </div>

            {/* Qty Input */}
            <div>
              <label className="font-black text-xs text-gray-700 mb-1.5 block">Jumlah Panen Siap Jual (kg)</label>
              <input
                type="number"
                value={saleQtyKg}
                onChange={(e) => setSaleQtyKg(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] text-sm font-bold"
                required
              />
            </div>

            {/* Custom Price Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-black text-xs text-gray-700">Harga Jual Per kg (Rp)</label>
                <span className="text-[11px] font-bold text-[#0F4C25]">HPP: Rp {hppPerKg.toLocaleString("id-ID")}/kg</span>
              </div>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] text-base font-black text-[#0F4C25]"
                required
              />
            </div>

            {/* Dynamic Financial Profit Summary */}
            <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>Total Penerimaan Kotor:</span>
                <span className="font-black text-[#1A1C19]">Rp {calculatedTotalRevenue.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>Total HPP Modal:</span>
                <span className="font-bold text-gray-700">Rp {calculatedTotalHpp.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-black text-sm">
                <span className="text-[#0F4C25]">Estimasi Keuntungan Bersih:</span>
                <span className="text-[#0F4C25]">
                  +Rp {calculatedNetProfit.toLocaleString("id-ID")} ({calculatedProfitPercent}%)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" size="md" className="w-full justify-center text-xs font-black shadow-md py-3">
              Tayangkan di Marketplace Panentra <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
