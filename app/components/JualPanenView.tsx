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
  Camera,
  HelpCircle,
  Clock,
  MapPin,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Truck,
  ShieldCheck,
  Eye,
  AlertCircle,
  X,
} from "lucide-react";
import Button from "./Button";

interface JualPanenViewProps {
  onBack: () => void;
  hppPerKg?: number;
  totalExpenseSum?: number;
  cropName?: string;
}

// Standar Grade Nasional Data (SNI)
const NATIONAL_GRADES = [
  {
    id: "grade-a",
    grade: "Grade A",
    title: "Super Premium",
    priceRange: "Rp 38.000 - Rp 42.000 / kg",
    minPrice: 38000,
    maxPrice: 42000,
    recommendedPrice: 39500,
    specs: "Panjang ≥ 4 cm, Warna Merah 95%+, Bebas Cacat & Segar Mulus",
    targetMarket: "Supermarket, Restoran Modern & Hotel",
    marginPercent: "+113%",
    badgeColor: "bg-emerald-100 text-[#0F4C25] border-emerald-300",
    bgColor: "bg-emerald-50/50",
    imageBg: "bg-emerald-100",
  },
  {
    id: "grade-b",
    grade: "Grade B",
    title: "Standar Pasar",
    priceRange: "Rp 32.000 - Rp 35.000 / kg",
    minPrice: 32000,
    maxPrice: 35000,
    recommendedPrice: 33500,
    specs: "Panjang 3-4 cm, Warna Merah 80%+, Kualitas Pasar Tradisional",
    targetMarket: "Pedagang Pasar Induk & Agen Sayur",
    marginPercent: "+81%",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    bgColor: "bg-blue-50/50",
    imageBg: "bg-blue-100",
  },
  {
    id: "grade-c",
    grade: "Grade C",
    title: "Industri Olahan",
    priceRange: "Rp 24.000 - Rp 27.000 / kg",
    minPrice: 24000,
    maxPrice: 27000,
    recommendedPrice: 25000,
    specs: "Ukuran bervariasi, Cocok untuk Pengolahan Sambal Botol/Pabrik",
    targetMarket: "Pabrik Saus, Katering & Industri Olahan",
    marginPercent: "+35%",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    bgColor: "bg-amber-50/50",
    imageBg: "bg-amber-100",
  },
];

// Live Market Benchmark Data (Hasil Penjualan Petani Lain)
const NEARBY_FARMER_SALES = [
  {
    id: 1,
    name: "Pak Budi Utomo",
    location: "Lembang",
    distance: "2 km dari Anda",
    crop: "Cabai Rawit Merah",
    gradeId: "grade-a",
    grade: "Grade A Super",
    price: 40000,
    status: "Laku 250 kg ke Resto Sambal Nusantara",
    badge: "Terjual",
    badgeStyle: "bg-green-100 text-green-800 border-green-200",
    transactionTime: "Terjual 3 jam lalu",
  },
  {
    id: 2,
    name: "Pak Maman Suherman",
    location: "Ciwidey",
    distance: "12 km dari Anda",
    crop: "Cabai Rawit Merah",
    gradeId: "grade-a",
    grade: "Grade A Super",
    price: 39500,
    status: "Aktif Tayang di Marketplace Panentra",
    badge: "Pasar Aktif",
    badgeStyle: "bg-blue-100 text-blue-800 border-blue-200",
    transactionTime: "Tayang 1 jam lalu",
  },
  {
    id: 3,
    name: "Pak Cecep Hendra",
    location: "Parongpong",
    distance: "5 km dari Anda",
    crop: "Cabai Rawit Merah",
    gradeId: "grade-b",
    grade: "Grade B Standar",
    price: 33000,
    status: "Laku 180 kg ke Agen Pasar Baru",
    badge: "Terjual",
    badgeStyle: "bg-green-100 text-green-800 border-green-200",
    transactionTime: "Terjual 1 hari lalu",
  },
  {
    id: 4,
    name: "Pasar Induk Caringin",
    location: "Bandung",
    distance: "Harga Grosir Regional",
    crop: "Cabai Rawit Merah",
    gradeId: "grade-b",
    grade: "Grade B Standar",
    price: 34000,
    status: "Referensi Harga Patokan Grosir",
    badge: "Pasar Induk",
    badgeStyle: "bg-gray-100 text-gray-700 border-gray-200",
    transactionTime: "Update 2 jam lalu",
  },
  {
    id: 5,
    name: "Ibu Imas Suryani",
    location: "Cisarua",
    distance: "8 km dari Anda",
    crop: "Cabai Rawit Merah",
    gradeId: "grade-c",
    grade: "Grade C Olahan",
    price: 25500,
    status: "Laku 500 kg ke Pabrik Sambal Botol",
    badge: "Terjual",
    badgeStyle: "bg-amber-100 text-amber-900 border-amber-200",
    transactionTime: "Terjual 2 hari lalu",
  },
];

export default function JualPanenView({
  onBack,
  hppPerKg = 21000,
  totalExpenseSum = 1050000,
  cropName = "Cabai Rawit Merah",
}: JualPanenViewProps) {
  // State variables
  const [selectedGradeId, setSelectedGradeId] = useState("grade-a");
  const [saleQtyKg, setSaleQtyKg] = useState("50");
  const [customPrice, setCustomPrice] = useState("39500");
  const [activeSortFilter, setActiveSortFilter] = useState<"grade-sama" | "jarak" | "harga-tertinggi">("grade-sama");
  const [expandOtherGrades, setExpandOtherGrades] = useState(false);
  const [showGradeEduModal, setShowGradeEduModal] = useState(false);
  const [showAiScanModal, setShowAiScanModal] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState<"idle" | "scanning" | "done">("idle");

  // Section 5.4 Form Settings States
  const [allowNego, setAllowNego] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<"diambil" | "dikirim" | "titikkumpul">("diambil");
  const [selectedCerts, setSelectedCerts] = useState<string[]>(["Bebas Pestisida"]);
  const [listingDuration, setListingDuration] = useState("14");

  const [saleSuccessMsg, setSaleSuccessMsg] = useState<string | null>(null);

  const selectedGradeObj = NATIONAL_GRADES.find((g) => g.id === selectedGradeId) || NATIONAL_GRADES[0];

  const handleSelectGrade = (grade: typeof NATIONAL_GRADES[0]) => {
    setSelectedGradeId(grade.id);
    setCustomPrice(grade.recommendedPrice.toString());
  };

  // Automatic fill from AI conclusion CTA
  const handleApplyRecommendedPrice = () => {
    setCustomPrice(selectedGradeObj.recommendedPrice.toString());
    // Smooth scroll down to section 5
    const el = document.getElementById("section-form-jual");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // AI Grade Scanner Simulation
  const handleStartAiScan = () => {
    setAiScanStatus("scanning");
    setTimeout(() => {
      setAiScanStatus("done");
    }, 1800);
  };

  const handleConfirmAiScan = () => {
    handleSelectGrade(NATIONAL_GRADES[0]); // Auto select Grade A
    setShowAiScanModal(false);
    setAiScanStatus("idle");
  };

  const toggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  // Financial calculations
  const qtyNumber = Math.max(1, parseInt(saleQtyKg || "1"));
  const priceNumber = parseInt(customPrice || "0");
  const calculatedTotalRevenue = qtyNumber * priceNumber;
  const calculatedTotalHpp = qtyNumber * hppPerKg;
  const platformFee = 0; // Rp 0 / Gratis Transaksi di Panentra
  const calculatedNetProfit = calculatedTotalRevenue - calculatedTotalHpp - platformFee;
  const calculatedProfitPercent = Math.round((calculatedNetProfit / Math.max(1, calculatedTotalHpp)) * 100);

  // Validation Flags
  const isBelowHpp = priceNumber < hppPerKg && priceNumber > 0;
  const isOptimalPrice = priceNumber >= selectedGradeObj.minPrice && priceNumber <= selectedGradeObj.maxPrice;

  // Filter benchmark list
  const sameGradeSales = NEARBY_FARMER_SALES.filter((s) => s.gradeId === selectedGradeId);
  const otherGradeSales = NEARBY_FARMER_SALES.filter((s) => s.gradeId !== selectedGradeId);

  const getSortedList = (list: typeof NEARBY_FARMER_SALES) => {
    if (activeSortFilter === "harga-tertinggi") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  };

  const sortedSameGrade = getSortedList(sameGradeSales);
  const sortedOtherGrade = getSortedList(otherGradeSales);

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSuccessMsg(
      `Berhasil! Panen (${saleQtyKg} kg - ${selectedGradeObj.grade}) ditayangkan di Marketplace Panentra dengan harga Rp ${priceNumber.toLocaleString("id-ID")}/kg!`
    );
    setTimeout(() => {
      onBack();
    }, 3000);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-16 text-[#1A1C19]">
      {/* ================= 1. HEADER ================= */}
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

      {/* ================= 2. SECTION 1: RINGKASAN AI (HERO CARD) ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[32px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl min-h-[175px] flex items-center">
        <div className="space-y-2 z-10 relative max-w-[62%]">

          <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-md">
            Rekomendasi Margin Penjualan AI
          </h2>

          <div className="text-xs text-emerald-100/90 leading-relaxed font-medium space-y-1 drop-shadow-sm bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center">
              <span>HPP Anda:</span>
              <span className="font-extrabold text-white">Rp {hppPerKg.toLocaleString("id-ID")} / kg</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-emerald-200/90">
              <span>Total Biaya Produksi:</span>
              <span className="font-bold text-white">Rp {totalExpenseSum.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-emerald-200/90 pt-1 border-t border-white/10">
              <span>Estimasi Hasil Panen:</span>
              <span className="font-extrabold text-emerald-300">50 kg siap jual</span>
            </div>
          </div>
        </div>

        {/* Mascot Image */}
        <div className="absolute -right-6 -bottom-8 z-0 w-60 h-60 sm:w-64 sm:h-64 pointer-events-none">
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

      {/* ================= 3. SECTION 2: PILIH GRADE PANEN (STANDAR SNI) ================= */}
      <section className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base font-black text-[#1A1C19] tracking-tight">
                Pilih Grade Panen
              </h2>
              <span className="bg-emerald-100 text-[#0F4C25] text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
                Standar SNI
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGradeEduModal(true)}
              className="text-[10px] font-extrabold text-[#0F4C25] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Edukasi Grade
            </button>
          </div>

          <p className="text-xs text-gray-500 font-medium leading-normal">
            Sesuaikan fisik hasil panen Anda dengan kelas mutu nasional
          </p>
        </div>

        {/* BANTU CEK GRADE OTOMATIS BANNER */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-[#0F4C25] rounded-[24px] text-white flex items-center justify-between gap-3 shadow-md">
          <div className="space-y-1">
            <h3 className="text-xs font-black tracking-tight text-white">Bantu Cek Grade Otomatis AI</h3>
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Upload foto hasil panen, AI akan menganalisis diameter, warna & kesegaran untuk menyarankan grade terakurat!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAiScanModal(true)}
            className="px-3 py-2 bg-white text-[#0F4C25] rounded-xl font-black text-[11px] hover:bg-emerald-50 active:scale-95 transition-all shadow-sm shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" /> Cek Foto AI
          </button>
        </div>

        {/* Grade Cards List */}
        <div className="space-y-3">
          {NATIONAL_GRADES.map((item) => {
            const isSelected = selectedGradeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectGrade(item)}
                className={`bg-white rounded-[26px] p-4 border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                  isSelected
                    ? "border-[#0F4C25] ring-2 ring-[#0F4C25]/20 shadow-md bg-emerald-50/20"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    {/* Checklist Icon on Card */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-[#0F4C25] text-white shadow-2xs"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <span className="text-sm font-black text-[#1A1C19]">
                        {item.grade} — {item.title}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${item.badgeColor}`}>
                      {item.priceRange}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium leading-snug pt-0.5 pl-7">{item.specs}</p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[11px] pl-7">
                  <span className="text-gray-500 font-medium">
                    Target Pembeli: <strong className="text-gray-800">{item.targetMarket}</strong>
                  </span>
                  <span className="font-extrabold text-[#0F4C25]">Proyeksi Margin {item.marginPercent}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 4. SECTION 3: BENCHMARK HARGA PETANI LAIN ================= */}
      <section className="space-y-3 pt-1">
        <div>
          <h2 className="text-base font-black text-[#1A1C19] tracking-tight">
            Benchmark Harga Petani Lain
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Referensi harga jual asli dari petani terdekat & pasar grosir
          </p>
        </div>

        {/* FILTER BAR: TEXT ON LEFT, DROPDOWN ON RIGHT (SPACE-BETWEEN) */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#0F4C25]" /> Filter:
          </span>

          <div className="relative shrink-0">
            <select
              value={activeSortFilter}
              onChange={(e) => setActiveSortFilter(e.target.value as any)}
              className="h-9.5 px-3.5 pr-8 bg-white border border-[#0F4C25] rounded-full text-xs font-black text-[#0F4C25] outline-none cursor-pointer shadow-2xs appearance-none focus:ring-2 focus:ring-[#0F4C25]/20 transition-all"
            >
              <option value="grade-sama">{selectedGradeObj.grade}</option>
              <option value="jarak">Jarak Terdekat</option>
              <option value="harga-tertinggi">Harga Tertinggi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#0F4C25] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Benchmark List Container */}
        <div className="bg-[#F8FAF8] rounded-[28px] p-4 border border-gray-200 space-y-4">
          {/* GRUP A — HARGA GRADE SAMA (Top Priority) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-[#0F4C25] px-1">
              <span className="text-xs font-black text-[#0F4C25] tracking-tight">
                Grup A — Patokan Grade Terpilih ({selectedGradeObj.grade})
              </span>
              <span className="text-[10px] bg-emerald-100/90 text-[#0F4C25] px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-200 shrink-0">
                Paling Relevan
              </span>
            </div>

            {sortedSameGrade.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-3 text-center bg-white rounded-2xl border border-gray-200">
                Belum ada transaksi {selectedGradeObj.grade} di sekitar Anda hari ini.
              </p>
            ) : (
              sortedSameGrade.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-[#0F4C25] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-[#1A1C19]">{sale.name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${sale.badgeStyle}`}>
                        {sale.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-gray-400" /> {sale.location} ({sale.distance})</span>
                      <span>·</span>
                      <span className="font-bold text-[#0F4C25]">{sale.grade}</span>
                    </div>

                    <p className="text-[10px] text-gray-600 font-medium italic">{sale.status}</p>

                    <div className="text-[9px] font-bold text-gray-400 flex items-center gap-1 pt-0.5">
                      <Clock className="w-2.5 h-2.5" /> {sale.transactionTime}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#0F4C25] block">
                      Rp {sale.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">/ kg</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* GRUP B — REFERENSI GRADE LAIN (Collapsible) */}
          <div className="pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setExpandOtherGrades(!expandOtherGrades)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 py-1.5 px-1 cursor-pointer"
            >
              <span>Grup B — Referensi Transaksi Grade Lain ({sortedOtherGrade.length} Item)</span>
              {expandOtherGrades ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandOtherGrades && (
              <div className="space-y-2 pt-2 animate-fade-in">
                {sortedOtherGrade.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white/80 p-3 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs opacity-90 hover:opacity-100 transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">{sale.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium">({sale.grade})</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{sale.location} · {sale.transactionTime}</div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">Rp {sale.price.toLocaleString("id-ID")}/kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 5. SECTION 4: KESIMPULAN AI PANENTRA ================= */}
      <section className="bg-white rounded-[32px] p-5 sm:p-6 border border-emerald-200 shadow-md space-y-4 relative overflow-hidden">
        {/* Ambient subtle light glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0F4C25] bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
              Analisis AI Panentra
            </span>
            <h3 className="text-sm sm:text-base font-black text-[#1A1C19] pt-1 tracking-tight">
              Kesimpulan & Rekomendasi Harga Jual
            </h3>
          </div>
          <span className="text-xs font-black text-[#0F4C25] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
            {selectedGradeObj.grade}
          </span>
        </div>

        {/* Highlighted Price Recommendation Card */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-emerald-50 to-emerald-100/50 rounded-2xl p-4 sm:p-5 border border-emerald-200 text-center space-y-1.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4C25] block">
            Rekomendasi Harga Jual Optimal
          </span>

          <div className="flex flex-wrap items-baseline justify-center gap-1 sm:gap-1.5 pt-0.5">
            <span className="text-xl sm:text-3xl font-black text-[#0F4C25] tracking-tight">
              Rp {selectedGradeObj.minPrice.toLocaleString("id-ID")} – Rp {selectedGradeObj.maxPrice.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-extrabold text-gray-500 whitespace-nowrap shrink-0">/ kg</span>
          </div>

          <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[95%] mx-auto pt-1">
            Di atas HPP modal Anda (<strong className="text-gray-900 font-extrabold">Rp {hppPerKg.toLocaleString("id-ID")}/kg</strong>) & sangat kompetitif dengan transaksi petani terdekat di wilayah Lembang.
          </p>
        </div>

        {/* Primary CTA Button */}
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleApplyRecommendedPrice}
          className="w-full justify-center text-xs font-black py-3.5 shadow-md bg-[#0F4C25] hover:bg-[#1B5E20] active:scale-[0.99] transition-all"
        >
          Gunakan Harga Rekomendasi Ini (Rp {selectedGradeObj.recommendedPrice.toLocaleString("id-ID")}/kg) →
        </Button>
      </section>

      {/* ================= 6. SECTION 5: PASANG HARGA & TAYANGKAN PANEN ================= */}
      <section id="section-form-jual" className="space-y-4 pt-2">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-base font-black text-[#1A1C19] tracking-tight">
            Form Pasang Harga & Tayangkan Panen
          </h2>
          <p className="text-xs text-gray-500 font-medium">Isi detail kelengkapan panen Anda sebelum ditayangkan ke Pasar Panentra</p>
        </div>

        {saleSuccessMsg ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[28px] text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-[#0F4C25] mx-auto" />
            <h3 className="text-base font-black text-[#0F4C25]">Hasil Panen Berhasil Ditayangkan!</h3>
            <p className="text-xs text-gray-600 font-medium">{saleSuccessMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitSale} className="space-y-5">
            {/* 5.1 FOTO HASIL PANEN */}
            <div className="bg-white rounded-[24px] p-4 border border-gray-200 space-y-2 shadow-2xs">
              <label className="font-black text-xs text-gray-800 block">Foto Hasil Panen</label>
              <div className="w-full h-28 bg-[#F8FAF8] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0F4C25] transition-all">
                <Upload className="w-6 h-6 text-[#0F4C25] mb-1" />
                <span className="text-xs font-black text-[#0F4C25]">
                  Upload Foto Panen {cropName} ({selectedGradeObj.grade})
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">Format JPG/PNG maks 10MB</span>
              </div>
            </div>

            {/* 5.2 DETAIL JUMLAH & HARGA + VALIDASI REAL-TIME */}
            <div className="bg-white rounded-[24px] p-4 border border-gray-200 space-y-3 shadow-2xs">
              <label className="font-black text-xs text-gray-800 block">Detail Jumlah & Harga Jual</label>

              <div>
                <label className="font-bold text-[11px] text-gray-600 mb-1 block">Jumlah Panen Siap Jual (kg)</label>
                <input
                  type="number"
                  value={saleQtyKg}
                  onChange={(e) => setSaleQtyKg(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] text-sm font-bold"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[11px] text-gray-600">Harga Jual Per kg (Rp)</label>
                  <span className="text-[11px] font-bold text-[#0F4C25]">HPP Modal: Rp {hppPerKg.toLocaleString("id-ID")}/kg</span>
                </div>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] text-base font-black text-[#0F4C25]"
                  required
                />
              </div>

              {/* [BARU] REAL-TIME PRICE VALIDATION BOX */}
              {isBelowHpp && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block">Peringatan: Harga Di Bawah Modal!</span>
                    <p className="text-[11px] text-red-700 font-medium">
                      Harga Rp {priceNumber.toLocaleString("id-ID")}/kg berada di bawah HPP (Rp {hppPerKg.toLocaleString("id-ID")}/kg). Anda berpotensi mengalami kerugian total sekitar{" "}
                      <strong>Rp {((hppPerKg - priceNumber) * qtyNumber).toLocaleString("id-ID")}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {isOptimalPrice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-[#0F4C25] animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#0F4C25] shrink-0" />
                  <span className="font-black">Harga Optimal ✓ (Berada dalam rentang rekomendasi AI {selectedGradeObj.grade})</span>
                </div>
              )}
            </div>

            {/* 5.3 RINGKASAN KEUNTUNGAN (+ BIAYA PLATFORM TERPISAH) */}
            <div className="bg-white rounded-[24px] p-4 border border-gray-200 space-y-2.5 text-xs shadow-2xs">
              <label className="font-black text-xs text-gray-800 block mb-1">yaProyeksi Ringkasan Keuangan</label>

              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>Total Penerimaan Kotor:</span>
                <span className="font-black text-[#1A1C19]">Rp {calculatedTotalRevenue.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>Total HPP Modal ({qtyNumber} kg):</span>
                <span className="font-bold text-gray-700">Rp {calculatedTotalHpp.toLocaleString("id-ID")}</span>
              </div>

              {/* [BARU] BIAYA PLATFORM TERPISAH */}
              <div className="flex justify-between items-center text-gray-600 font-semibold pb-1.5 border-b border-gray-100">
                <span className="flex items-center gap-1">Biaya Komisi Panentra:</span>
                <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Rp 0 (Gratis Transaksi)
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 font-black text-sm">
                <span className={calculatedNetProfit >= 0 ? "text-[#0F4C25]" : "text-red-600"}>
                  Estimasi Keuntungan Bersih:
                </span>
                <span className={calculatedNetProfit >= 0 ? "text-[#0F4C25]" : "text-red-600"}>
                  {calculatedNetProfit >= 0 ? "+" : ""}Rp {calculatedNetProfit.toLocaleString("id-ID")} ({calculatedProfitPercent}%)
                </span>
              </div>
            </div>

            {/* 5.4 [BARU] PENGATURAN TAMBAHAN */}
            <div className="bg-white rounded-[24px] p-4 border border-gray-200 space-y-3.5 shadow-2xs text-xs">
              <label className="font-black text-xs text-gray-800 block">5.4 Pengaturan Tambahan Penjualan</label>

              {/* Toggle Nego */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-bold text-gray-800 block">Izinkan Pembeli Menawar Harga?</span>
                  <span className="text-[10px] text-gray-500">Fitur nego interaktif dengan tengkulak/restoran</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowNego(!allowNego)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    allowNego ? "bg-[#0F4C25]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                      allowNego ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Delivery Option */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-800 block">Opsi Metode Pengiriman</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("diambil")}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all ${
                      deliveryMethod === "diambil"
                        ? "bg-[#0F4C25] text-white border-[#0F4C25]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    Diambil Sendiri
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("dikirim")}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all ${
                      deliveryMethod === "dikirim"
                        ? "bg-[#0F4C25] text-white border-[#0F4C25]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    Dikirim Petani
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("titikkumpul")}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all ${
                      deliveryMethod === "titikkumpul"
                        ? "bg-[#0F4C25] text-white border-[#0F4C25]"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    Titik Kumpul
                  </button>
                </div>
              </div>

              {/* Sertifikasi Tambahan */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-800 block">Sertifikasi Tambahan (Opsional)</span>
                <div className="flex flex-wrap gap-2">
                  {["Bebas Pestisida", "Organik Non-Kimia", "SNI Verified Panentra"].map((cert) => {
                    const isChecked = selectedCerts.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCert(cert)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-100 text-[#0F4C25] border-emerald-300"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-[#0F4C25]" />} {cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Listing Duration */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-800">Masa Berlaku Penayangan</span>
                <select
                  value={listingDuration}
                  onChange={(e) => setListingDuration(e.target.value)}
                  className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs font-bold text-gray-800"
                >
                  <option value="7">7 Hari (Reffresh Otomatis)</option>
                  <option value="14">14 Hari</option>
                  <option value="30">30 Hari</option>
                </select>
              </div>
            </div>

            {/* 5.5 [BARU] PREVIEW KARTU PRODUK */}
            <div className="bg-white rounded-[24px] p-4 border border-gray-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="font-black text-xs text-gray-800 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#0F4C25]" /> Pratinjau Tampilan Produk di Marketplace
                </label>
                <span className="text-[10px] text-gray-400 font-bold">Tampilan untuk pembeli</span>
              </div>

              {/* Marketplace Card Mockup */}
              <div className="bg-[#F8FAF8] rounded-2xl p-3 border border-gray-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl border border-black/5 shrink-0">
                    🌶️
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-[#1A1C19]">{cropName}</span>
                      <span className="bg-emerald-100 text-[#0F4C25] px-2 py-0.5 rounded-md text-[9px] font-black border border-emerald-200">
                        {selectedGradeObj.grade}
                      </span>
                    </div>

                    <div className="text-sm font-black text-[#0F4C25]">
                      Rp {priceNumber.toLocaleString("id-ID")} <span className="text-[10px] font-normal text-gray-500">/ kg</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                      <span>Stok: {qtyNumber} kg</span>
                      <span>·</span>
                      <span>Lembang</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200 text-[9px] font-bold">
                  {allowNego && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                      💬 Nego Aktif
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                    🚚 {deliveryMethod === "diambil" ? "Diambil" : deliveryMethod === "dikirim" ? "Dikirim" : "Titik Kumpul"}
                  </span>
                  {selectedCerts.map((cert) => (
                    <span key={cert} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5.6 CTA UTAMA */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center text-xs font-black shadow-lg py-3.5 bg-[#0F4C25] hover:bg-[#1B5E20]"
            >
              Tayangkan di Marketplace Panentra →
            </Button>
          </form>
        )}
      </section>

      {/* ================= MODAL EDUKASI GRADE ================= */}
      {showGradeEduModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in touch-none"
          onClick={() => setShowGradeEduModal(false)}
        >
          <div
            className="w-full max-w-[400px] bg-white rounded-[32px] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
                Kenapa Harga Beda Jauh Antar Grade?
              </h3>
              <button
                type="button"
                onClick={() => setShowGradeEduModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-600">
              <p>
                Standar SNI membagi komoditas hortikultura berdasarkan daya simpan, ukuran fisik, dan peruntukan pembeli.
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <strong className="text-[#0F4C25] block">Grade A Super:</strong>
                <p className="text-[11px] text-emerald-900">
                  Pembeli supermarket & hotel mencari penampilan sempurna. Harga tinggi karena sortir ketat.
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <strong className="text-blue-900 block">Grade B Standar:</strong>
                <p className="text-[11px] text-blue-900">
                  Cocok untuk konsumsi harian keluarga di pasar induk & pedagang keliling. Perputaran volume paling besar.
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <strong className="text-amber-900 block">Grade C Olahan:</strong>
                <p className="text-[11px] text-amber-900">
                  Dibeli pabrik dalam volume tonase untuk digiling jadi sambal botol. Fisik tidak begitu penting asal rasa & pedas tetap baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL AI GRADE SCANNER ================= */}
      {showAiScanModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in touch-none"
          onClick={() => setShowAiScanModal(false)}
        >
          <div
            className="w-full max-w-[380px] bg-white rounded-[32px] p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xs font-black text-[#1A1C19] flex items-center gap-1.5">
                AI Grade Inspector
              </h3>
              <button type="button" onClick={() => setShowAiScanModal(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiScanStatus === "idle" && (
              <div className="space-y-4 py-2">
                <div className="w-full h-32 bg-[#F8FAF8] border-2 border-dashed border-emerald-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 transition-all">
                  <Camera className="w-8 h-8 text-[#0F4C25] mb-1 animate-bounce" />
                  <span className="text-xs font-black text-[#0F4C25]">Ambil Foto / Upload Sampel Panen</span>
                  <span className="text-[10px] text-gray-400">AI akan mendeteksi warna, ukuran & tingkat kesegaran</span>
                </div>

                <Button type="button" variant="primary" size="md" onClick={handleStartAiScan} className="w-full justify-center text-xs font-black">
                  Mulai Analisis AI Sekarang
                </Button>
              </div>
            )}

            {aiScanStatus === "scanning" && (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#0F4C25] rounded-full animate-spin mx-auto" />
                <p className="text-xs font-black text-[#0F4C25] animate-pulse">Memproses foto sampel panen...</p>
                <p className="text-[10px] text-gray-400">Mengkalkulasi diameter cabai & konsentrasi pigmen merah SNI</p>
              </div>
            )}

            {aiScanStatus === "done" && (
              <div className="space-y-4 py-2 animate-fade-in text-left">
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-sm font-black text-[#0F4C25]">Hasil Analisis AI: Grade A Super!</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Sampel cabai Anda memiliki kesegaran 96% dan panjang rata-rata 4.2cm. Sangat layak masuk Grade A Super Premium.
                  </p>
                </div>

                <Button type="button" variant="primary" size="md" onClick={handleConfirmAiScan} className="w-full justify-center text-xs font-black">
                  Gunakan Grade A Ini →
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
