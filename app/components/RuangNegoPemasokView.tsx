"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Handshake,
  Send,
  ShieldCheck,
  Tag,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { HarvestListing } from "./MarketplacePemasokView";

export interface PemasokChatConversation {
  id: string;
  farmerName: string;
  farmerLocation: string;
  item: string;
  grade: string;
  qty: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  statusBadge: string;
  statusType: "nego" | "shipping" | "completed" | "inquiry";
  farmerAvatar: string;
  productImage: string;
  listingPrice: number;
  offeredPrice: number;
  total: string;
  listingRef?: HarvestListing;
}

const PEMASOK_CHAT_LIST_DATA: PemasokChatConversation[] = [
  {
    id: "LIST-101",
    farmerName: "Pak Andi Sugiharto",
    farmerLocation: "Lahan Sukamaju, Lembang",
    item: "Cabai Rawit Merah Super",
    grade: "Grade A (SNI)",
    qty: "150 kg",
    lastMessage: "Penawaran Rp 34.500/kg sedang ditinjau. Siap kirim besok pagi dari lahan Lembang...",
    time: "10:22 WIB",
    unreadCount: 1,
    statusBadge: "Nego Rp 34.500/kg",
    statusType: "nego",
    farmerAvatar: "/assets/bowo-senang.png",
    productImage: "https://images.unsplash.com/photo-1588252303782-7cc9888970aa?q=80&w=600&auto=format&fit=crop",
    listingPrice: 38000,
    offeredPrice: 34500,
    total: "Rp 5.175.000",
  },
  {
    id: "LIST-102",
    farmerName: "Ibu Sri Rahayu",
    farmerLocation: "Desa Karanganyar, Ciwidey",
    item: "Pakcoy Hydroponic Fresh",
    grade: "Grade A (SNI)",
    qty: "80 kg",
    lastMessage: "Pasokan Pakcoy Hydro 80 kg sudah diangkut armada pick-up menuju toko Anda...",
    time: "Kemarin",
    unreadCount: 0,
    statusBadge: "Dalam Pengiriman",
    statusType: "shipping",
    farmerAvatar: "/assets/budi-kaget.png",
    productImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
    listingPrice: 18000,
    offeredPrice: 18000,
    total: "Rp 1.440.000",
  },
  {
    id: "LIST-103",
    farmerName: "Pak Budi Santoso",
    farmerLocation: "Pangalengan, Kab. Bandung",
    item: "Tomat Red Super Harvest",
    grade: "Grade B (SNI)",
    qty: "200 kg",
    lastMessage: "Pembayaran Escrow Rp 2.400.000 telah dicairkan ke dompet. Terima kasih Toko Berkah!",
    time: "28 Jul",
    unreadCount: 0,
    statusBadge: "Selesai",
    statusType: "completed",
    farmerAvatar: "/assets/bowo-calendar.png",
    productImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop",
    listingPrice: 12000,
    offeredPrice: 12000,
    total: "Rp 2.400.000",
  },
];

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
  const [activeFilter, setActiveFilter] = useState<"all" | "nego" | "unread" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState<PemasokChatConversation[]>(PEMASOK_CHAT_LIST_DATA);

  // If a specific listing was passed from marketplace, automatically set initial chat
  const initialChat = listing
    ? chatList.find((c) => c.id === listing.id) || {
        id: listing.id,
        farmerName: listing.farmerName,
        farmerLocation: listing.farmerLocation,
        item: listing.commodity,
        grade: listing.grade,
        qty: "100 kg",
        lastMessage: `Halo ${listing.farmerName}, saya tertarik mengajukan penawaran pasokan 100 kg.`,
        time: "Sekarang",
        unreadCount: 0,
        statusBadge: `Nego Rp ${listing.sellingPrice.toLocaleString("id-ID")}/kg`,
        statusType: "nego" as const,
        farmerAvatar: listing.farmerAvatar || "/assets/bowo-senang.png",
        productImage: listing.productImage,
        listingPrice: listing.sellingPrice,
        offeredPrice: listing.sellingPrice - 3500,
        total: `Rp ${((listing.sellingPrice - 3500) * 100).toLocaleString("id-ID")}`,
        listingRef: listing,
      }
    : null;

  const [selectedChat, setSelectedChat] = useState<PemasokChatConversation | null>(initialChat);

  // Chat Room Input States
  const [inputMessage, setInputMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState<string>("34500");
  const [offerQty, setOfferQty] = useState<string>("100");
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [negoStatus, setNegoStatus] = useState<"draft" | "pending" | "approved" | "counter">("pending");

  const [chatRoomMessages, setChatRoomMessages] = useState<
    Array<{ id: string; sender: "pemasok" | "petani"; text: string; time: string; offerData?: { price: number; qty: number } }>
  >([
    {
      id: "1",
      sender: "petani",
      text: `Halo Toko Berkah! Hasil panen Cabai Rawit Merah Super (Grade A (SNI)) dari lahan Lembang siap dikirim. Silakan ajukan penawaran harga & kuantitas pasokan.`,
      time: "10:15 WIB",
    },
    {
      id: "2",
      sender: "pemasok",
      text: `Halo Pak Andi, saya tertarik mengajukan penawaran pasokan 100 kg di harga Rp 34.500/kg.`,
      time: "10:18 WIB",
      offerData: { price: 34500, qty: 100 },
    },
  ]);

  const filteredChats = chatList.filter((chat) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "nego" && chat.statusType === "nego") ||
      (activeFilter === "unread" && chat.unreadCount > 0) ||
      (activeFilter === "completed" && chat.statusType === "completed");

    const matchesSearch =
      chat.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenChat = (chat: PemasokChatConversation) => {
    setChatList((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChat(chat);
    setOfferPrice(chat.offeredPrice.toString());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: "pemasok" as const,
      text: inputMessage,
      time: "10:25 WIB",
    };

    setChatRoomMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  const handleSendNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat) return;
    const priceNum = parseInt(offerPrice) || selectedChat.listingPrice;
    const qtyNum = parseInt(offerQty) || 50;

    const newOfferMsg = {
      id: Date.now().toString(),
      sender: "pemasok" as const,
      text: `Saya memperbarui penawaran pasokan sebesar ${qtyNum} kg di harga Rp ${priceNum.toLocaleString("id-ID")}/kg.`,
      time: "10:26 WIB",
      offerData: { price: priceNum, qty: qtyNum },
    };

    setChatRoomMessages((prev) => [...prev, newOfferMsg]);
    setNegoStatus("pending");
    setShowOfferDrawer(false);

    // Simulate Petani Response after 1.5 seconds
    setTimeout(() => {
      if (priceNum >= 28500 + 3000) {
        setNegoStatus("approved");
        setChatRoomMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "petani" as const,
            text: `Penawaran Anda disetujui! Harga Rp ${priceNum.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg disepakati. Silakan klik 'Lanjut ke Pembayaran Escrow'.`,
            time: "10:27 WIB",
          },
        ]);
      } else {
        const counterPrice = Math.round((priceNum + selectedChat.listingPrice) / 2);
        setNegoStatus("counter");
        setChatRoomMessages((prev) => [
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
    if (!selectedChat) return;
    setNegoStatus("approved");
    const lastCounter = chatRoomMessages.find((m) => m.sender === "petani" && m.offerData);
    const agreedP = lastCounter?.offerData?.price || parseInt(offerPrice);
    const agreedQ = lastCounter?.offerData?.qty || parseInt(offerQty);

    const targetListing: HarvestListing = selectedChat.listingRef || {
      id: selectedChat.id,
      farmerName: selectedChat.farmerName,
      farmerRating: 4.9,
      farmerTotalSales: 38,
      farmerLocation: selectedChat.farmerLocation,
      distanceKm: 3.2,
      commodity: selectedChat.item,
      grade: "Grade A (SNI)",
      hppPerKg: 28500,
      sellingPrice: selectedChat.listingPrice,
      availableKg: 1280,
      harvestStatus: "Siap Dipetik Besok",
      allowNegotiation: true,
      productImage: selectedChat.productImage,
      farmerAvatar: selectedChat.farmerAvatar,
      farmImage: selectedChat.farmerAvatar,
      harvestCategory: "Bahan-Bahan",
    };

    onProceedToPayment({
      listing: targetListing,
      agreedPrice: agreedP,
      agreedQty: agreedQ,
    });
  };

  // ================= VIEW 1: FULL PAGE CHAT ROOM VIEW =================
  if (selectedChat) {
    return (
      <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pt-[116px] pb-24 bg-[#F4F6F4] min-h-screen flex flex-col relative z-20">
        {/* Fixed Top Header Container */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-b border-gray-200 shadow-md divide-y divide-gray-100">
          {/* Top Farmer Info Row */}
          <div className="p-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedChat(null)}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5] text-[#1A1C19]" />
              </button>

              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 relative shrink-0 p-0.5 overflow-hidden">
                <Image
                  src={selectedChat.farmerAvatar}
                  alt={selectedChat.farmerName}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-black text-[#1A1C19] leading-tight truncate flex items-center gap-1">
                  {selectedChat.farmerName}
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C25]" />
                </h2>
                <p className="text-[10px] text-gray-500 font-semibold truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Mitra Petani • {selectedChat.farmerLocation}
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] font-black text-[10px] rounded-md border border-emerald-100">
              {selectedChat.id}
            </span>
          </div>

          {/* Shopee / Tokopedia Style Pinned Product Bar */}
          <div className="p-2.5 px-4 flex items-center justify-between gap-3 bg-[#F9FAF9]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0 overflow-hidden relative">
                <Image
                  src={selectedChat.productImage}
                  alt={selectedChat.item}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#1A1C19] truncate">
                  {selectedChat.item} ({selectedChat.qty})
                </h4>
                <p className="text-[10px] text-gray-500 font-semibold">
                  Listing: <span className="text-[#0F4C25] font-bold">Rp {selectedChat.listingPrice.toLocaleString("id-ID")}/kg</span> • {selectedChat.grade}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black rounded-lg shrink-0">
              Nego Aktif
            </span>
          </div>
        </div>

        {/* Main Chat Stream Container */}
        <div className="flex-1 p-4 space-y-3.5 text-xs">
          <div className="text-center">
            <span className="bg-gray-200/80 text-gray-600 text-[10px] font-bold px-3 py-0.5 rounded-full inline-block">
              Hari Ini
            </span>
          </div>

          {chatRoomMessages.map((msg) => (
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

              {/* Interactive Nego Offer Card in Stream */}
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
                      Modal HPP Petani: <strong>Rp 28.500/kg</strong> • Margin +{Math.round(((msg.offerData.price - 28500)/28500)*100)}%
                    </p>

                    {/* Actions inside Nego Card */}
                    {negoStatus === "approved" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const targetListing: HarvestListing = selectedChat.listingRef || {
                            id: selectedChat.id,
                            farmerName: selectedChat.farmerName,
                            farmerRating: 4.9,
                            farmerTotalSales: 38,
                            farmerLocation: selectedChat.farmerLocation,
                            distanceKm: 3.2,
                            commodity: selectedChat.item,
                            grade: "Grade A (SNI)",
                            hppPerKg: 28500,
                            sellingPrice: selectedChat.listingPrice,
                            availableKg: 1280,
                            harvestStatus: "Siap Dipetik Besok",
                            allowNegotiation: true,
                            productImage: selectedChat.productImage,
                            farmerAvatar: selectedChat.farmerAvatar,
                            farmImage: selectedChat.farmerAvatar,
                            harvestCategory: "Bahan-Bahan",
                          };

                          onProceedToPayment({
                            listing: targetListing,
                            agreedPrice: msg.offerData?.price || parseInt(offerPrice),
                            agreedQty: msg.offerData?.qty || parseInt(offerQty),
                          });
                        }}
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

        {/* Native Fixed Bottom Input Bar */}
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

        {/* Offer Drawer Modal */}
        {showOfferDrawer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-t-[32px] p-5 w-full max-w-[440px] space-y-4 shadow-2xl relative border-t border-gray-200 animate-slide-up">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#0F4C25]" />
                  Form Penawaran Nego Pasokan
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
                      HPP: Rp 28.500
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
                      Maks: 1.280 kg
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>Kirim Penawaran Nego</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW 2: DAFTAR LIST CHAT PEMASOK =================
  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title Bar (Corrected: Back Button on LEFT side) */}
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
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
            Pesan & Negosiasi Pasokan
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Daftar Percakapan & Penawaran Nego dengan Mitra Petani
          </p>
        </div>
      </div>

      {/* Hero Banner Callout */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 sm:p-6 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[65%]">
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Ruang Nego & Chat Petani
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              1 Percakapan nego aktif dengan Pak Andi Sugiharto (Cabai Rawit Merah Super).
            </p>
          </div>

          <div className="w-32 h-32 shrink-0 relative -mr-2 -mb-11 scale-190">
            <Image
              src="/assets/budi-chat.png"
              alt="Budi Chat Pemasok"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Search Input & Filter Tabs */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama petani, komoditas panen, ID listing..."
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
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                activeFilter === "all"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              Semua Chat ({chatList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("nego")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeFilter === "nego"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Nego Aktif
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeFilter === "unread"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Belum Dibaca
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("completed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeFilter === "completed"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Chat List Conversation Cards */}
      <div className="space-y-2.5">
        {filteredChats.length === 0 ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-black text-gray-700">Percakapan tidak ditemukan</h3>
            <p className="text-xs text-gray-500 font-medium">
              Gunakan kata kunci pencarian lain atau pilih filter berbeda.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleOpenChat(chat)}
              className="bg-white rounded-[24px] p-4 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs space-y-2.5 relative overflow-hidden group"
            >
              {/* Farmer Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <Image
                      src={chat.farmerAvatar}
                      alt={chat.farmerName}
                      width={44}
                      height={44}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-[#1A1C19] truncate group-hover:text-[#0F4C25] transition-colors">
                        {chat.farmerName}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold truncate">
                      {chat.farmerLocation} · <span className="font-bold text-[#0F4C25]">{chat.item}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold block">{chat.time}</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border mt-1 ${
                      chat.statusType === "nego"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : chat.statusType === "shipping"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : chat.statusType === "completed"
                        ? "bg-emerald-50 text-[#0F4C25] border-emerald-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {chat.statusBadge}
                  </span>
                </div>
              </div>

              {/* Last Message Preview */}
              <div className="p-2.5 bg-[#F8FAF8] rounded-xl border border-gray-100 text-xs text-gray-700 flex items-center justify-between gap-2">
                <p className="line-clamp-1 font-medium italic text-[11px] text-gray-600">
                  &ldquo;{chat.lastMessage}&rdquo;
                </p>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
