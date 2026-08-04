"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Tag,
} from "lucide-react";
import { HarvestListing } from "./MarketplacePemasokView";

interface RuangNegoPemasokViewProps {
  listing?: HarvestListing | null;
  onBack: () => void;
  onProceedToPayment: (dealDetails: {
    listing: HarvestListing;
    agreedPrice: number;
    agreedQty: number;
  }) => void;
}

export default function RuangNegoPemasokView({
  listing,
  onBack,
  onProceedToPayment,
}: RuangNegoPemasokViewProps) {
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

  const [offerPrice, setOfferPrice] = useState<string>("34500");
  const [offerQty, setOfferQty] = useState<string>("100");
  const [notes, setNotes] = useState("");
  
  // Nego Status: "draft" | "pending" | "approved" | "counter"
  const [negoStatus, setNegoStatus] = useState<"draft" | "pending" | "approved" | "counter">("draft");
  const [messages, setMessages] = useState<
    Array<{ sender: "pemasok" | "petani"; text: string; time: string; offerData?: { price: number; qty: number } }>
  >([
    {
      sender: "petani",
      text: `Halo Toko Berkah! Hasil panen ${currentListing.commodity} (${currentListing.grade}) dari lahan Lembang siap dikirim. Silakan ajukan penawaran harga & kuantitas pasokan.`,
      time: "10:15 WIB",
    },
  ]);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(offerPrice) || currentListing.sellingPrice;
    const qtyNum = parseInt(offerQty) || 50;

    const newPemasokMsg = {
      sender: "pemasok" as const,
      text: `Saya mengajukan penawaran pasokan sebesar ${qtyNum} kg di harga Rp ${priceNum.toLocaleString("id-ID")}/kg. ${notes}`,
      time: "10:30 WIB",
      offerData: { price: priceNum, qty: qtyNum },
    };

    setMessages((prev) => [...prev, newPemasokMsg]);
    setNegoStatus("pending");

    // Simulate Petani Response after 1.5 seconds
    setTimeout(() => {
      if (priceNum >= currentListing.hppPerKg + 3000) {
        // Accept offer
        setNegoStatus("approved");
        setMessages((prev) => [
          ...prev,
          {
            sender: "petani" as const,
            text: `Penawaran Anda di setujui! Harga Rp ${priceNum.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg disepakati. Silakan lanjutkan ke Pembayaran Escrow Panentra.`,
            time: "10:31 WIB",
          },
        ]);
      } else {
        // Counter offer
        const counterPrice = Math.round((priceNum + currentListing.sellingPrice) / 2);
        setNegoStatus("counter");
        setMessages((prev) => [
          ...prev,
          {
            sender: "petani" as const,
            text: `Maaf, tawaran tersebut mendekati HPP saya. Bagaimana jika di harga Rp ${counterPrice.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg?`,
            time: "10:31 WIB",
            offerData: { price: counterPrice, qty: qtyNum },
          },
        ]);
      }
    }, 1500);
  };

  const handleAcceptCounter = () => {
    setNegoStatus("approved");
    const lastCounter = messages.find((m) => m.sender === "petani" && m.offerData);
    const agreedP = lastCounter?.offerData?.price || parseInt(offerPrice);
    const agreedQ = lastCounter?.offerData?.qty || parseInt(offerQty);

    onProceedToPayment({
      listing: currentListing,
      agreedPrice: agreedP,
      agreedQty: agreedQ,
    });
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
            Ruang Negosiasi Panen
          </h1>
          <p className="text-xs font-semibold text-[#0F4C25]">
            Terhubung Langsung dengan {currentListing.farmerName}
          </p>
        </div>
      </div>

      {/* Product Summary Card Header */}
      <div className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm flex items-center justify-between gap-3">
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
            <h3 className="text-xs font-black text-[#1A1C19]">
              {currentListing.commodity}
            </h3>
            <span className="text-[10px] font-bold text-[#0F4C25] bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {currentListing.grade} • HPP Rp {currentListing.hppPerKg.toLocaleString("id-ID")}/kg
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 font-medium block">Harga Listing</span>
          <span className="text-xs font-black text-gray-800">
            Rp {currentListing.sellingPrice.toLocaleString("id-ID")}/kg
          </span>
        </div>
      </div>

      {/* Status Alert Banner */}
      {negoStatus === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-amber-900 text-xs">
          <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
          <div>
            <p className="font-black">Menunggu Respon Petani...</p>
            <p className="text-[11px] text-amber-700">Notifikasi telah dikirimkan ke Dashboard Petani real-time.</p>
          </div>
        </div>
      )}

      {negoStatus === "approved" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-emerald-900 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black">
              <CheckCircle2 className="w-5 h-5 text-[#0F4C25]" />
              <span>Penawaran Disetujui Petani!</span>
            </div>
            <span className="bg-[#0F4C25] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Siap Bayar
            </span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Kesepakatan harga & kuantitas berhasil dicapai. Lanjutkan ke pembayaran aman Panentra Escrow.
          </p>
          <button
            type="button"
            onClick={() =>
              onProceedToPayment({
                listing: currentListing,
                agreedPrice: parseInt(offerPrice),
                agreedQty: parseInt(offerQty),
              })
            }
            className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer text-xs mt-1"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>Lanjut ke Pembayaran Escrow</span>
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-4 border border-gray-200 space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === "pemasok" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs space-y-1 ${
                msg.sender === "pemasok"
                  ? "bg-[#0F4C25] text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
              }`}
            >
              <p className="leading-relaxed font-medium">{msg.text}</p>
              {msg.offerData && (
                <div
                  className={`p-2 rounded-xl text-[11px] font-bold mt-1 ${
                    msg.sender === "pemasok"
                      ? "bg-white/15 text-white border border-white/20"
                      : "bg-emerald-50 text-[#0F4C25] border border-emerald-100"
                  }`}
                >
                  Detail Tawaran: Rp {msg.offerData.price.toLocaleString("id-ID")}/kg ({msg.offerData.qty} kg)
                </div>
              )}
              <span
                className={`text-[9px] block text-right font-medium ${
                  msg.sender === "pemasok" ? "text-emerald-200" : "text-gray-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Counter Offer Accept Action (if counter) */}
      {negoStatus === "counter" && (
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
          <p className="font-extrabold text-amber-900">
            Petani mengajukan Nego Balik (Counter Offer).
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAcceptCounter}
              className="flex-1 h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Setujui Counter Offer</span>
            </button>
          </div>
        </div>
      )}

      {/* Offer Form Input */}
      {negoStatus !== "approved" && (
        <form onSubmit={handleSendOffer} className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-[#1A1C19] flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#0F4C25]" />
            Ajukan Penawaran Baru
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 block">
                Harga Tawaran (Rp/kg)
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="misal: 35000"
                className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
              />
              <span className="text-[9px] text-gray-400 font-medium">HPP: Rp {currentListing.hppPerKg.toLocaleString("id-ID")}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 block">
                Jumlah Pasokan (kg)
              </label>
              <input
                type="number"
                value={offerQty}
                onChange={(e) => setOfferQty(e.target.value)}
                placeholder="misal: 100"
                className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
              />
              <span className="text-[9px] text-gray-400 font-medium">Maks: {currentListing.availableKg} kg</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 block">
              Catatan untuk Petani (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="misal: Siap jemput sendiri ke lahan Lembang"
              className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-[#0F4C25]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer text-xs"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Kirim Penawaran Nego</span>
          </button>
        </form>
      )}
    </div>
  );
}
