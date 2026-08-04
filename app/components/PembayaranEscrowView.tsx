"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Wallet,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { HarvestListing } from "./MarketplacePemasokView";

interface PembayaranEscrowViewProps {
  listing?: HarvestListing | null;
  agreedPrice?: number;
  agreedQty?: number;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function PembayaranEscrowView({
  listing,
  agreedPrice,
  agreedQty,
  onBack,
  onPaymentSuccess,
}: PembayaranEscrowViewProps) {
  const currentListing: HarvestListing = listing || {
    id: "LIST-101",
    farmerName: "Pak Andi Sugiharto",
    farmerRating: 4.9,
    farmerTotalSales: 38,
    farmerLocation: "Lahan Sukamaju, Lembang",
    distanceKm: 3.2,
    commodity: "Cabai Rawit Merah Super",
    grade: "Grade A (SNI)",
    hppPerKg: 28500,
    sellingPrice: 38000,
    availableKg: 1280,
    harvestStatus: "Siap Dipetik Besok",
    allowNegotiation: true,
    productImage: "https://images.unsplash.com/photo-1588252303782-7cc9888970aa?q=80&w=600&auto=format&fit=crop",
    farmerAvatar: "/assets/bowo-senang.png",
    farmImage: "/assets/bowo-senang.png",
    harvestCategory: "Bahan-Bahan",
  };

  const displayImage = currentListing.productImage || currentListing.farmImage || "/assets/bowo-senang.png";

  const finalPrice = agreedPrice || currentListing.sellingPrice;
  const finalQty = agreedQty || 100;
  const subtotal = finalPrice * finalQty;
  const serviceFee = 2500;
  const grandTotal = subtotal + serviceFee;

  const [paymentMethod, setPaymentMethod] = useState<"transfer_petani" | "panentra_pay" | "bca_va" | "qris">("transfer_petani");
  const [deliveryOption, setDeliveryOption] = useState<"dikirim_petani" | "diambil_sendiri" | "titik_kumpul">("dikirim_petani");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidEscrow, setIsPaidEscrow] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidEscrow(true);
    }, 1500);
  };

  const handleConfirmReceivedAndReleaseEscrow = () => {
    alert(
      `Sukses! Dana Escrow sebesar Rp ${grandTotal.toLocaleString("id-ID")} telah dicairkan ke Panentra Pay milik ${currentListing.farmerName}. Transaksi Selesai!`
    );
    onPaymentSuccess();
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
            Pembayaran Escrow Safe
          </h1>
          <p className="text-xs font-semibold text-[#0F4C25]">
            Panentra Secure Escrow System
          </p>
        </div>
      </div>

      {/* Escrow Guarantee Callout Card */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase text-emerald-100 border border-white/20 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            100% Proteksi Dana Pemasok
          </span>
          <span className="text-[10px] text-emerald-200 font-bold">Escrow Verified</span>
        </div>

        <h2 className="text-base font-black tracking-tight">
          Panentra Escrow Guarantee
        </h2>

        <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
          Dana Anda disimpan aman oleh Panentra. Pembayaran HANYA dicairkan ke dompet petani setelah Anda mengonfirmasi barang diterima sesuai <strong className="text-white">{currentListing.grade}</strong>.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
          Ringkasan Pesanan Pasokan
        </h3>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden relative">
              <Image
                src={displayImage}
                alt={currentListing.commodity}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1A1C19]">
                {currentListing.commodity}
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                Petani: {currentListing.farmerName} • {currentListing.farmerLocation}
              </p>
              <span className="text-[10px] font-bold text-[#0F4C25] bg-emerald-50 px-2 py-0.2 rounded-full inline-block mt-0.5">
                {currentListing.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Rows */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Kuantitas x Harga</span>
            <span>{finalQty} kg @ Rp {finalPrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Subtotal Pembelian</span>
            <span className="font-bold text-gray-800">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Biaya Layanan Escrow</span>
            <span className="font-bold text-gray-800">Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-100 font-black text-sm text-[#0F4C25]">
            <span>Total Pembayaran Escrow</span>
            <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {!isPaidEscrow ? (
        <form onSubmit={handlePay} className="space-y-4">
          {/* Delivery Method Selection */}
          <div className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm space-y-2.5">
            <h3 className="text-xs font-black text-[#1A1C19] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0F4C25]" />
              Pilih Metode Serah Terima Pasokan
            </h3>

            <div className="space-y-2 text-xs">
              <label
                onClick={() => setDeliveryOption("dikirim_petani")}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryOption === "dikirim_petani"
                    ? "bg-emerald-50/60 border-[#0F4C25]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#0F4C25]" />
                  <div>
                    <span className="font-extrabold text-[#1A1C19] block">Dikirim Langsung oleh Petani</span>
                    <span className="text-[10px] text-gray-500 font-medium">Armada pick-up mitra petani ke alamat toko</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "dikirim_petani"}
                  onChange={() => setDeliveryOption("dikirim_petani")}
                />
              </label>

              <label
                onClick={() => setDeliveryOption("diambil_sendiri")}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryOption === "diambil_sendiri"
                    ? "bg-emerald-50/60 border-[#0F4C25]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0F4C25]" />
                  <div>
                    <span className="font-extrabold text-[#1A1C19] block">Diambil Sendiri di Lahan</span>
                    <span className="text-[10px] text-gray-500 font-medium">Pemasok membawa armada penjemputan sendiri</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "diambil_sendiri"}
                  onChange={() => setDeliveryOption("diambil_sendiri")}
                />
              </label>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm space-y-2.5">
            <h3 className="text-xs font-black text-[#1A1C19] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#0F4C25]" />
              Pilih Metode Pembayaran
            </h3>

            <div className="space-y-2 text-xs">
              <label
                onClick={() => setPaymentMethod("transfer_petani")}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "transfer_petani" || paymentMethod === "panentra_pay"
                    ? "bg-emerald-50/60 border-[#0F4C25]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-[#0F4C25]" />
                  <div>
                    <span className="font-extrabold text-[#1A1C19] block">Transfer Bank Rekening Petani</span>
                    <span className="text-[10px] text-[#0F4C25] font-bold">BCA 8821-4402-192 (A.n. Petani)</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "transfer_petani" || paymentMethod === "panentra_pay"}
                  onChange={() => setPaymentMethod("transfer_petani")}
                />
              </label>

              <label
                onClick={() => setPaymentMethod("bca_va")}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "bca_va"
                    ? "bg-emerald-50/60 border-[#0F4C25]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#0F4C25]" />
                  <div>
                    <span className="font-extrabold text-[#1A1C19] block">BCA Virtual Account</span>
                    <span className="text-[10px] text-gray-500 font-medium">Verifikasi otomatis 24/7</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bca_va"}
                  onChange={() => setPaymentMethod("bca_va")}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer text-xs"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Memproses Pembayaran Escrow...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>Bayar Rp {grandTotal.toLocaleString("id-ID")} ke Escrow</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Paid State: Escrow Release Simulation */
        <div className="bg-white rounded-[28px] p-5 border border-gray-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 text-[#0F4C25] font-black text-sm">
            <CheckCircle2 className="w-6 h-6 text-[#0F4C25]" />
            <span>Pembayaran Escrow Berhasil Ditahan!</span>
          </div>

          <p className="text-gray-600 font-medium leading-relaxed">
            Status: <strong className="text-[#0F4C25]">Pesanan Dibayar (Escrow Active)</strong>. Notifikasi telah dikirim ke {currentListing.farmerName} untuk penyiapan pengiriman.
          </p>

          <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-black text-[#0F4C25] uppercase">
              Verifikasi Barang Diterima Pemasok
            </span>
            <p className="text-[11px] text-gray-500">
              Setel simulasi di bawah untuk menguji konfirmasi penerimaan pasokan di gudang Anda.
            </p>

            <button
              type="button"
              onClick={() => setIsDelivered(!isDelivered)}
              className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                isDelivered
                  ? "bg-emerald-100 text-[#0F4C25] border-[#0F4C25]"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Simulasi Status Barang: {isDelivered ? "Sudah Sampai di Gudang Toko" : "Dalam Perjalanan"}
            </button>
          </div>

          <button
            type="button"
            disabled={!isDelivered}
            onClick={handleConfirmReceivedAndReleaseEscrow}
            className={`w-full h-12 font-black rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs ${
              isDelivered
                ? "bg-[#0F4C25] hover:bg-[#0A381B] text-white cursor-pointer active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Konfirmasi Barang Sesuai & Cairkan Escrow</span>
          </button>
        </div>
      )}
    </div>
  );
}
