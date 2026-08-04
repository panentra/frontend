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
} from "lucide-react";

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
  },
  {
    id: "TRX-8799",
    transactionDate: "20 Juli 2026",
    farmerName: "Pak Budi Santoso",
    farmerLocation: "Pangalengan",
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

  // Review Form States
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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
      {/* Clean Mobile Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
            Riwayat Pembelian Pasokan
          </h1>
          <p className="text-xs font-bold text-[#0F4C25]">
            Rekapitulasi Pembelian & Escrow Panentra
          </p>
        </div>
      </div>

      {/* List of Purchase History Cards */}
      <div className="space-y-4">
        {purchases.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5 hover:border-[#0F4C25]/40 transition-all relative overflow-hidden"
          >
            {/* Top Bar: ID, Date & Escrow Status Badge */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-[#1A1C19]">{item.id}</span>
                <span className="text-[10px] text-gray-400 font-medium block">
                  {item.transactionDate}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 text-[#0F4C25] border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-extrabold">
                <Lock className="w-3 h-3 text-[#0F4C25]" />
                <span>{item.status}</span>
              </div>
            </div>

            {/* Content: Farmer & Commodity Details */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden relative p-1">
                  <Image
                    src={item.farmImage}
                    alt={item.commodity}
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-black text-[#1A1C19]">
                    {item.commodity} ({item.qtyKg} kg)
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0F4C25]" />
                    <span>{item.farmerName} • {item.farmerLocation}</span>
                  </p>
                  <div className="pt-0.5">
                    <span className="text-[10px] font-bold text-[#0F4C25] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                      {item.grade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 font-medium block">Total Dibayar</span>
                <span className="text-sm sm:text-base font-black text-[#0F4C25]">
                  Rp {item.totalPaid.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Rating Section (If already reviewed) */}
            {item.isReviewed && item.userRating && (
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-900">Ulasan & Rating Anda</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                    <span>{item.userRating}.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-900 italic font-medium">&ldquo;{item.userReview}&rdquo;</p>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedInvoice(item)}
                className="h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-extrabold rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-[11px]"
              >
                <FileText className="w-3.5 h-3.5 text-gray-600" />
                <span>Invoice</span>
              </button>

              {!item.isReviewed ? (
                <button
                  type="button"
                  onClick={() => setSelectedForReview(item)}
                  className="h-10 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-[11px]"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                  <span>Beri Rating</span>
                </button>
              ) : (
                <div className="h-10 bg-emerald-50 border border-emerald-200 text-[#0F4C25] font-extrabold rounded-2xl flex items-center justify-center gap-1.5 text-[10px]">
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
        ))}
      </div>

      {/* Review Modal */}
      {selectedForReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[400px] space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#1A1C19]">
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

            <div className="space-y-1 text-xs">
              <p className="font-bold text-[#1A1C19]">
                {selectedForReview.commodity} ({selectedForReview.grade})
              </p>
              <p className="text-[11px] text-gray-500">
                Petani: {selectedForReview.farmerName}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              {/* Rating Stars Selector */}
              <div className="space-y-1 text-center">
                <span className="text-xs font-extrabold text-gray-700 block">
                  Beri Rating Kualitas & Ketepatan Grade SNI:
                </span>
                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="p-1 cursor-pointer hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingStars
                            ? "fill-amber-400 stroke-amber-500"
                            : "fill-gray-100 stroke-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">
                  Ulasan Tambahan (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="misal: Hasil panen sangat segar, grade A asli, pengiriman cepat!"
                  className="w-full p-3 bg-[#F8FAF8] border border-gray-200 rounded-2xl text-xs outline-none focus:border-[#0F4C25]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-xs cursor-pointer"
              >
                <span>Kirim Ulasan & Update Reputasi</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[400px] space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#1A1C19]">
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

            <div className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between font-bold border-b border-gray-200 pb-2">
                <span>INVOICE #{selectedInvoice.id}</span>
                <span>{selectedInvoice.transactionDate}</span>
              </div>
              <p>Pembeli: Toko Sembako Berkah Jaya</p>
              <p>Penjual (Petani): {selectedInvoice.farmerName}</p>
              <p>Komoditas: {selectedInvoice.commodity}</p>
              <p>Grade: {selectedInvoice.grade}</p>
              <p>Qty: {selectedInvoice.qtyKg} kg @ Rp {selectedInvoice.pricePerKg.toLocaleString("id-ID")}</p>
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
                alert("Mengunduh Invoice PDF...");
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
