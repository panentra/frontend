"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  FileText,
  Star,
  CheckCircle2,
  Lock,
  MapPin,
  RefreshCw,
  X,
  MessageSquare,
  ShieldCheck,
  Search,
  Receipt,
  Sparkles,
  ShoppingBag,
  Filter,
} from "lucide-react";
import Button from "./Button";

export interface PurchaseHistoryItem {
  id: string;
  transactionDate: string;
  farmerName: string;
  farmerLocation: string;
  farmerRating: number;
  commodity: string;
  grade: string;
  qtyKg: number;
  pricePerKg: number;
  totalPaid: number;
  status: "Selesai" | "Dalam Pengiriman" | "Escrow Dicairkan";
  isReviewed: boolean;
  userRating?: number;
  userReview?: string;
  invoiceUrl: string;
  farmImage: string;
  productImage: string;
}

const SAMPLE_PURCHASES: PurchaseHistoryItem[] = [
  {
    id: "TRX-8841",
    transactionDate: "3 Agustus 2026",
    farmerName: "Pak Andi Sugiharto",
    farmerLocation: "Lahan Sukamaju, Lembang",
    farmerRating: 4.9,
    commodity: "Cabai Rawit Merah Super",
    grade: "Grade A (SNI)",
    qtyKg: 150,
    pricePerKg: 38000,
    totalPaid: 5700000,
    status: "Escrow Dicairkan",
    isReviewed: false,
    invoiceUrl: "#",
    farmImage: "/assets/bowo-senang.png",
    productImage: "https://images.unsplash.com/photo-1588252303782-7cc9888970aa?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "TRX-8820",
    transactionDate: "28 Juli 2026",
    farmerName: "Ibu Sri Rahayu",
    farmerLocation: "Ciwidey, Kab. Bandung",
    farmerRating: 5.0,
    commodity: "Pakcoy Hydroponic Organic",
    grade: "Grade A (SNI)",
    qtyKg: 80,
    pricePerKg: 18000,
    totalPaid: 1440000,
    status: "Selesai",
    isReviewed: true,
    userRating: 5,
    userReview: "Kualitas luar biasa presisi Grade A. Pengiriman sangat tepat waktu!",
    invoiceUrl: "#",
    farmImage: "/assets/budi-kaget.png",
    productImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "TRX-8799",
    transactionDate: "20 Juli 2026",
    farmerName: "Pak Budi Santoso",
    farmerLocation: "Pangalengan, Kab. Bandung",
    farmerRating: 4.8,
    commodity: "Tomat Red Super Harvest",
    grade: "Grade B (SNI)",
    qtyKg: 200,
    pricePerKg: 12000,
    totalPaid: 2400000,
    status: "Selesai",
    isReviewed: true,
    userRating: 4,
    userReview: "Barang bagus, buah segar dan tidak ada yang busuk.",
    invoiceUrl: "#",
    farmImage: "/assets/bowo-calendar.png",
    productImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop",
  },
];

interface RiwayatPembelianPemasokViewProps {
  onBack: () => void;
  onBuyAgain: (farmerName: string) => void;
}

export default function RiwayatPembelianPemasokView({
  onBack,
  onBuyAgain,
}: RiwayatPembelianPemasokViewProps) {
  const [purchases, setPurchases] = useState<PurchaseHistoryItem[]>(SAMPLE_PURCHASES);
  const [selectedForReview, setSelectedForReview] = useState<PurchaseHistoryItem | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "escrow" | "unreviewed" | "completed">("all");

  // Review Form States
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const filteredPurchases = purchases.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "escrow" && item.status === "Escrow Dicairkan") ||
      (activeFilter === "unreviewed" && !item.isReviewed) ||
      (activeFilter === "completed" && item.status === "Selesai");

    const matchesSearch =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalSpent = purchases.reduce((acc, curr) => acc + curr.totalPaid, 0);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForReview) return;

    setPurchases((prev) =>
      prev.map((item) =>
        item.id === selectedForReview.id
          ? {
              ...item,
              isReviewed: true,
              userRating: ratingStars,
              userReview: reviewComment || "Kualitas pasokan sangat baik!",
            }
          : item
      )
    );

    alert(`Terima kasih! Rating ⭐ ${ratingStars} dan ulasan berhasil ditambahkan untuk ${selectedForReview.farmerName}. Reputasi petani telah diperbarui.`);
    setSelectedForReview(null);
    setReviewComment("");
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Top Navigation Bar Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke Beranda"
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight">
            Riwayat Pembelian Pasokan
          </h1>
          <p className="text-xs font-semibold text-[#0F4C25]">
            Rekapitulasi Transaksi & Safe Escrow Panentra
          </p>
        </div>
      </div>

      {/* Summary Card Banner */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[30px] p-5 text-white relative overflow-hidden shadow-xl border border-emerald-900/10">
        <div className="absolute top-0 right-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1.5 max-w-[65%]">
            <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">
              Total Akumulasi Pembelian
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
              Rp {totalSpent.toLocaleString("id-ID")}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
              3 Transaksi Escrow terverifikasi • <span className="font-extrabold text-white">430 kg pasokan diamankan</span>
            </p>
          </div>

          <div className="w-28 h-28 shrink-0 relative -mr-2 -mb-8 scale-110 pointer-events-none">
            <Image
              src="/assets/budi-riwayat.png"
              alt="Budi Panentra"
              width={140}
              height={140}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi, komoditas, atau nama petani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#0F4C25] focus:ring-2 focus:ring-[#0F4C25]/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
              activeFilter === "all"
                ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            Semua ({purchases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("unreviewed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
              activeFilter === "unreviewed"
                ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            Perlu Ulasan
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("escrow")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
              activeFilter === "escrow"
                ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            Escrow Dicairkan
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("completed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
              activeFilter === "completed"
                ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* List of Purchase History Cards */}
      <div className="space-y-4">
        {filteredPurchases.length === 0 ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-black text-gray-700">Riwayat transaksi tidak ditemukan</h3>
            <p className="text-xs text-gray-500 font-medium">
              Coba gunakan filter lain atau kata kunci pencarian yang berbeda.
            </p>
          </div>
        ) : (
          filteredPurchases.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5 hover:border-[#0F4C25]/40 transition-all relative overflow-hidden group"
            >
              {/* Top Bar: Transaction ID & Status Badge */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#0F4C25] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                    {item.id}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {item.transactionDate}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-emerald-50 text-[#0F4C25] border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black">
                  <Lock className="w-3 h-3 text-[#0F4C25]" />
                  <span>{item.status}</span>
                </div>
              </div>

              {/* Middle Section: Crop Thumbnail + Product Info + Total Price */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.commodity}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-[#1A1C19] line-clamp-1 leading-snug">
                      {item.commodity} ({item.qtyKg} kg)
                    </h3>
                    <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#0F4C25] shrink-0" />
                      <span className="truncate">{item.farmerName} • {item.farmerLocation}</span>
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[9px] font-black text-white bg-[#0F4C25] px-2 py-0.5 rounded-full">
                        {item.grade}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        @ Rp {item.pricePerKg.toLocaleString("id-ID")}/kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                    Total Escrow
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#0F4C25]">
                    Rp {item.totalPaid.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* User Rating / Review Card Box */}
              {item.isReviewed && item.userRating && (
                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Ulasan & Rating Anda untuk Petani
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-600 font-black text-xs bg-white px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>{item.userRating}.0</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-950 italic font-medium leading-relaxed">
                    &ldquo;{item.userReview}&rdquo;
                  </p>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(item)}
                  className="h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  <span>Invoice</span>
                </button>

                {!item.isReviewed ? (
                  <button
                    type="button"
                    onClick={() => setSelectedForReview(item)}
                    className="h-10 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-[11px] shadow-2xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                    <span>Beri Rating</span>
                  </button>
                ) : (
                  <div className="h-10 bg-emerald-50 border border-emerald-200 text-[#0F4C25] font-black rounded-2xl flex items-center justify-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Telah Diulas</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onBuyAgain(item.farmerName)}
                  className="h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm text-[11px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Beli Lagi</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedForReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] p-5 sm:p-6 w-full max-w-[400px] space-y-4 shadow-2xl relative border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#1A1C19] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                Rating & Ulasan Petani
              </h3>
              <button
                type="button"
                onClick={() => setSelectedForReview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200 space-y-1 text-xs">
              <p className="font-extrabold text-[#1A1C19]">
                {selectedForReview.commodity} ({selectedForReview.grade})
              </p>
              <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C25]" />
                Petani: {selectedForReview.farmerName} • {selectedForReview.qtyKg} kg
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating Stars Selector */}
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-black text-gray-700 block">
                  Beri Rating Kualitas & Ketepatan Grade SNI:
                </span>
                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="p-1 cursor-pointer hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= ratingStars
                            ? "fill-amber-400 stroke-amber-500 drop-shadow-sm"
                            : "fill-gray-100 stroke-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">
                  Ulasan Tambahan untuk Petani Mitra
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="misal: Hasil panen sangat segar, grade A asli, pengiriman cepat tepat waktu!"
                  className="w-full p-3 bg-[#F8FAF8] border border-gray-200 rounded-2xl text-xs outline-none focus:border-[#0F4C25] font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-xs cursor-pointer"
              >
                <span>Kirim Ulasan & Update Reputasi Petani</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] p-5 sm:p-6 w-full max-w-[400px] space-y-4 shadow-2xl relative border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#1A1C19] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0F4C25]" />
                Faktur Pembelian Panentra
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-200 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between font-bold border-b border-gray-200 pb-2">
                <span>FAKTUR #{selectedInvoice.id}</span>
                <span>{selectedInvoice.transactionDate}</span>
              </div>
              <p><span className="text-gray-400">Pembeli:</span> Toko Sembako Berkah Jaya</p>
              <p><span className="text-gray-400">Mitra Petani:</span> {selectedInvoice.farmerName}</p>
              <p><span className="text-gray-400">Komoditas:</span> {selectedInvoice.commodity}</p>
              <p><span className="text-gray-400">Kualitas:</span> {selectedInvoice.grade}</p>
              <p><span className="text-gray-400">Kuantitas:</span> {selectedInvoice.qtyKg} kg @ Rp {selectedInvoice.pricePerKg.toLocaleString("id-ID")}</p>
              <div className="border-t border-gray-200 pt-2 font-bold flex justify-between text-sm text-[#0F4C25]">
                <span>TOTAL DIBAYAR</span>
                <span>Rp {selectedInvoice.totalPaid.toLocaleString("id-ID")}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans italic pt-1">
                *Status: Safe Escrow Verified & Released.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Mengunduh Faktur Invoice PDF...");
                setSelectedInvoice(null);
              }}
              className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Unduh Invoice (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
