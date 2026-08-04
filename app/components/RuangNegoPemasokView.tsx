"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Send,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  Plus,
  Handshake,
  Tag,
  X,
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

  const [inputMessage, setInputMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState<string>("34500");
  const [offerQty, setOfferQty] = useState<string>("100");
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);

  // Nego Status: "draft" | "pending" | "approved" | "counter"
  const [negoStatus, setNegoStatus] = useState<"draft" | "pending" | "approved" | "counter">("pending");
  
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: "pemasok" | "petani"; text: string; time: string; offerData?: { price: number; qty: number } }>
  >([
    {
      id: "1",
      sender: "petani",
      text: `Halo Toko Berkah! Hasil panen ${currentListing.commodity} (${currentListing.grade}) dari lahan Lembang siap dikirim. Silakan ajukan penawaran harga & kuantitas pasokan.`,
      time: "10:15 WIB",
    },
    {
      id: "2",
      sender: "pemasok",
      text: `Halo ${currentListing.farmerName}, saya tertarik mengajukan penawaran pasokan 100 kg.`,
      time: "10:18 WIB",
      offerData: { price: 34500, qty: 100 },
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: "pemasok" as const,
      text: inputMessage,
      time: "10:25 WIB",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  const handleSendNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(offerPrice) || currentListing.sellingPrice;
    const qtyNum = parseInt(offerQty) || 50;

    const newOfferMsg = {
      id: Date.now().toString(),
      sender: "pemasok" as const,
      text: `Saya memperbarui penawaran pasokan sebesar ${qtyNum} kg di harga Rp ${priceNum.toLocaleString("id-ID")}/kg.`,
      time: "10:26 WIB",
      offerData: { price: priceNum, qty: qtyNum },
    };

    setMessages((prev) => [...prev, newOfferMsg]);
    setNegoStatus("pending");
    setShowOfferDrawer(false);

    // Simulate Petani Response after 1.5 seconds
    setTimeout(() => {
      if (priceNum >= currentListing.hppPerKg + 3000) {
        setNegoStatus("approved");
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "petani" as const,
            text: `Penawaran Anda disetujui! Harga Rp ${priceNum.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg disepakati. Silakan klik 'Lanjut ke Pembayaran Escrow'.`,
            time: "10:27 WIB",
          },
        ]);
      } else {
        const counterPrice = Math.round((priceNum + currentListing.sellingPrice) / 2);
        setNegoStatus("counter");
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "petani" as const,
            text: `Maaf, tawaran tersebut mendekati HPP modal saya. Bagaimana jika di harga Rp ${counterPrice.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg?`,
            time: "10:27 WIB",
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
    <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pt-[116px] pb-24 bg-[#F4F6F4] min-h-screen flex flex-col relative z-20">
      {/* ================= FIXED TOP HEADER CONTAINER (WA / SHOPEE / TOKPED STYLE) ================= */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-b border-gray-200 shadow-md divide-y divide-gray-100">
        {/* Top Farmer Info Row */}
        <div className="p-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5] text-[#1A1C19]" />
            </button>

            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 relative shrink-0 p-0.5 overflow-hidden">
              <Image
                src={currentListing.farmerAvatar || currentListing.farmImage || "/assets/bowo-senang.png"}
                alt={currentListing.farmerName}
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-[#1A1C19] leading-tight truncate flex items-center gap-1">
                {currentListing.farmerName}
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C25]" />
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Mitra Petani Terverifikasi • {currentListing.farmerLocation}
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] font-black text-[10px] rounded-md border border-emerald-100">
            {currentListing.id}
          </span>
        </div>

        {/* Shopee / Tokopedia Style Pinned Product Bar */}
        <div className="p-2.5 px-4 flex items-center justify-between gap-3 bg-[#F9FAF9]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0 overflow-hidden relative">
              <Image
                src={displayImage}
                alt={currentListing.commodity}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#1A1C19] truncate">
                {currentListing.commodity}
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold">
                Listing: <span className="text-[#0F4C25] font-bold">Rp {currentListing.sellingPrice.toLocaleString("id-ID")}/kg</span> • {currentListing.grade}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black rounded-lg shrink-0">
            Nego Aktif
          </span>
        </div>
      </div>

      {/* ================= MAIN CHAT STREAM (NATIVE CHAT BUBBLES) ================= */}
      <div className="flex-1 p-4 space-y-3.5 text-xs">
        <div className="text-center">
          <span className="bg-gray-200/80 text-gray-600 text-[10px] font-bold px-3 py-0.5 rounded-full inline-block">
            Hari Ini
          </span>
        </div>

        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            {msg.sender === "petani" ? (
              /* Farmer Bubble (Left) */
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="space-y-1">
                  <div className="p-3 bg-white border border-gray-200/80 rounded-2xl rounded-tl-xs shadow-2xs text-gray-800 space-y-1">
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium pl-1 block">{msg.time}</span>
                </div>
              </div>
            ) : (
              /* Pemasok Bubble (Right) */
              <div className="flex flex-col items-end max-w-[85%] ml-auto">
                <div className="space-y-1 text-right">
                  <div className="p-3 bg-[#0F4C25] text-white rounded-2xl rounded-tr-xs shadow-2xs text-left space-y-1">
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium pr-1 block">{msg.time} · Dibaca</span>
                </div>
              </div>
            )}

            {/* Interactive Nego Offer Card in Chat Stream */}
            {msg.offerData && (
              <div className="max-w-[90%] space-y-1 mx-auto">
                <div className="bg-white border-2 border-[#0F4C25] rounded-2xl p-3.5 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="font-black text-[#0F4C25] text-xs flex items-center gap-1.5">
                      <Handshake className="w-4 h-4 text-emerald-600" />
                      Penawaran Harga Pasokan
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      negoStatus === "approved"
                        ? "bg-emerald-100 text-[#0F4C25]"
                        : negoStatus === "counter"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-amber-50 text-amber-800"
                    }`}>
                      {negoStatus === "approved" ? "Disetujui" : negoStatus === "counter" ? "Counter Offer" : "Menunggu Respon"}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[#0F4C25] font-black text-sm flex justify-between items-center">
                    <span>Rp {msg.offerData.price.toLocaleString("id-ID")} /kg</span>
                    <span className="text-xs text-gray-600 font-bold">Total {msg.offerData.qty} kg</span>
                  </div>

                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                    HPP Modal Petani: <strong>Rp {currentListing.hppPerKg.toLocaleString("id-ID")}/kg</strong> • Margin +{Math.round(((msg.offerData.price - currentListing.hppPerKg)/currentListing.hppPerKg)*100)}%
                  </p>

                  {/* Actions inside Nego Card */}
                  {negoStatus === "approved" ? (
                    <button
                      type="button"
                      onClick={() =>
                        onProceedToPayment({
                          listing: currentListing,
                          agreedPrice: msg.offerData?.price || parseInt(offerPrice),
                          agreedQty: msg.offerData?.qty || parseInt(offerQty),
                        })
                      }
                      className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-300" />
                      <span>Lanjut ke Pembayaran Escrow</span>
                    </button>
                  ) : negoStatus === "counter" ? (
                    <button
                      type="button"
                      onClick={handleAcceptCounter}
                      className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Setujui Counter Offer & Bayar Escrow</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOfferDrawer(true)}
                        className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all"
                      >
                        Ubah Tawaran
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ================= NATIVE FIXED BOTTOM INPUT BAR (FULL WIDTH WA / TOKPED STYLE) ================= */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-t border-gray-200 p-2.5 px-3.5 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setShowOfferDrawer(true)}
          title="Ajukan / Edit Penawaran Nego"
          className="p-2 text-[#0F4C25] bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <Tag className="w-5 h-5" />
        </button>

        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 h-10 px-4 bg-[#F3F4F6] border border-gray-200 rounded-full text-xs outline-none focus:border-[#0F4C25] focus:bg-white font-medium transition-all"
          />

          <button
            type="submit"
            className="w-10 h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-full flex items-center justify-center cursor-pointer shrink-0 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Offer Input Drawer Modal */}
      {showOfferDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-[32px] p-5 w-full max-w-[440px] space-y-4 shadow-2xl relative border-t border-gray-200 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#0F4C25]" />
                Ajukan Form Penawaran Harga Nego
              </h3>
              <button
                type="button"
                onClick={() => setShowOfferDrawer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendNewOffer} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">
                    Harga Tawaran (Rp/kg)
                  </label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="34500"
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
                  />
                  <span className="text-[9px] text-gray-400 font-medium block">
                    HPP: Rp {currentListing.hppPerKg.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">
                    Jumlah Pasokan (kg)
                  </label>
                  <input
                    type="number"
                    value={offerQty}
                    onChange={(e) => setOfferQty(e.target.value)}
                    placeholder="100"
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
                  />
                  <span className="text-[9px] text-gray-400 font-medium block">
                    Maks: {currentListing.availableKg} kg
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>Kirim Penawaran ke {currentListing.farmerName}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
