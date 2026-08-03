"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Search,
  CheckCheck,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Handshake,
  Send,
  Building2,
  Sparkles,
  ShieldCheck,
  Filter,
  ArrowLeft,
  Plus,
  Phone,
  MoreVertical,
} from "lucide-react";
import Button from "./Button";

export interface ChatConversation {
  id: string;
  customer: string;
  customerType: string;
  item: string;
  qty: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  statusBadge: string;
  statusType: "nego" | "shipping" | "completed" | "inquiry";
  image: string;
  unitPrice: string;
  offeredPrice: string;
  total: string;
  notes?: string;
}

const CHAT_LIST_DATA: ChatConversation[] = [
  {
    id: "ORD-8821",
    customer: "Toko Berkah Jaya",
    customerType: "Pemasok Pasar Modern",
    item: "Cabai Rawit Merah Super",
    qty: "150 kg",
    lastMessage: "Bagaimana Pak Bowo? Jika sepakat Rp 34.000/kg, dana langsung dikunci aman...",
    time: "10:22 WIB",
    unreadCount: 1,
    statusBadge: "Nego Rp 34.000/kg",
    statusType: "nego",
    image: "/assets/bowo-senang.png",
    unitPrice: "Rp 35.000 / kg",
    offeredPrice: "Rp 34.000 / kg",
    total: "Rp 5.100.000",
    notes: "Mohon dipack rapi dalam keranjang plastik per 25 kg.",
  },
  {
    id: "ORD-8819",
    customer: "Resto Sambal Nusantara",
    customerType: "Restoran / Kuliner",
    item: "Pakcoy Hydroponic Grade A",
    qty: "80 kg",
    lastMessage: "Terima kasih Pak Bowo, barang Pakcoy Hydro 80 kg sudah dalam perjalanan...",
    time: "Kemarin",
    unreadCount: 0,
    statusBadge: "Dalam Pengiriman",
    statusType: "shipping",
    image: "/assets/bowo-checklist.png",
    unitPrice: "Rp 18.000 / kg",
    offeredPrice: "Rp 18.000 / kg",
    total: "Rp 1.440.000",
    notes: "Kirim sebelum jam 06:00 pagi.",
  },
  {
    id: "ORD-8815",
    customer: "Supermarket Fresh Mart",
    customerType: "Retail Modern",
    item: "Tomat Red Super",
    qty: "200 kg",
    lastMessage: "Transaksi Rp 2.400.000 selesai & dana dicairkan ke rekening utama.",
    time: "1 Agu",
    unreadCount: 0,
    statusBadge: "Selesai",
    statusType: "completed",
    image: "/assets/bowo-duit.png",
    unitPrice: "Rp 12.000 / kg",
    offeredPrice: "Rp 12.000 / kg",
    total: "Rp 2.400.000",
  },
  {
    id: "ORD-8802",
    customer: "CV Pangan Lestari",
    customerType: "Distributor Bahan Pokok",
    item: "Cabai Rawit Red Grade A",
    qty: "500 kg",
    lastMessage: "Halo Pak Bowo, apakah stok Cabai Rawit Red grade A masih ready 500 kg?",
    time: "31 Jul",
    unreadCount: 0,
    statusBadge: "Tanya Stok",
    statusType: "inquiry",
    image: "/assets/budi-kaget.png",
    unitPrice: "Rp 36.000 / kg",
    offeredPrice: "Rp 36.000 / kg",
    total: "Rp 18.000.000",
  },
];

export default function ChatListView() {
  const [activeFilter, setActiveFilter] = useState<"all" | "nego" | "unread" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState<ChatConversation[]>(CHAT_LIST_DATA);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);

  const filteredChats = chatList.filter((chat) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "nego" && chat.statusType === "nego") ||
      (activeFilter === "unread" && chat.unreadCount > 0) ||
      (activeFilter === "completed" && chat.statusType === "completed");

    const matchesSearch =
      chat.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenChat = (chat: ChatConversation) => {
    setChatList((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChat(chat);
  };

  // ================= VIEW FULL PAGE NATIVE CHAT ROOM (WA / SHOPEE / TOKPED STYLE) =================
  if (selectedChat) {
    return (
      <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pb-24 bg-[#F4F6F4] min-h-screen flex flex-col">
        {/* Native Top Header Bar (Fixed / Sticky at Top) */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-3 px-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedChat(null)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1C19]" />
            </button>

            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 relative shrink-0 p-0.5 overflow-hidden">
              <Image
                src={selectedChat.image}
                alt={selectedChat.customer}
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-[#1A1C19] leading-tight truncate">
                {selectedChat.customer}
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {selectedChat.customerType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-black text-[10px] rounded-md">
              {selectedChat.id}
            </span>
          </div>
        </div>

        {/* Shopee / Tokopedia Style Pinned Product Bar */}
        <div className="sticky top-[57px] z-30 bg-white border-b border-gray-200 p-2.5 px-4 flex items-center justify-between shadow-2xs gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 p-1 border border-emerald-100 shrink-0">
              <Image
                src={selectedChat.image}
                alt={selectedChat.item}
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#1A1C19] truncate">
                {selectedChat.item} ({selectedChat.qty})
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold">
                Penawaran: <span className="text-[#0F4C25] font-bold">{selectedChat.unitPrice}</span>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-50 text-[#0F4C25] border border-emerald-200 text-[10px] font-black rounded-lg shrink-0">
            Nego Aktif
          </span>
        </div>

        {/* Main Chat Stream Container (Seamless Background) */}
        <div className="flex-1 p-4 space-y-3.5 text-xs">
          <div className="text-center">
            <span className="bg-gray-200/80 text-gray-600 text-[10px] font-bold px-3 py-0.5 rounded-full inline-block">
              Hari Ini
            </span>
          </div>

          {/* Message 1 from Buyer */}
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="space-y-1">
              <div className="p-3 bg-white border border-gray-200/80 rounded-2xl rounded-tl-xs shadow-2xs text-gray-800 space-y-1">
                <p className="leading-relaxed">
                  Halo Pak Bowo! Mengenai pesanan <strong>{selectedChat.item} ({selectedChat.qty})</strong>, apakah bisa tawar harga Rp 33.000/kg kalau saya ambil langsung di kebun?
                </p>
              </div>
              <span className="text-[9px] text-gray-400 font-medium pl-1 block">10:18 WIB</span>
            </div>
          </div>

          {/* Message 2 Response from Farmer */}
          <div className="flex items-start gap-2 max-w-[85%] ml-auto justify-end">
            <div className="space-y-1 text-right">
              <div className="p-3 bg-[#0F4C25] text-white rounded-2xl rounded-tr-xs shadow-2xs space-y-1 text-left">
                <p className="leading-relaxed">
                  Halo Pak! Berdasarkan HPP modal saya & analisis AI harga pasar terdekat Lembang (Rp 35.000/kg), harga penawaran terbaik saya <strong>Rp 34.000/kg</strong> sudah gratis penataan armada.
                </p>
              </div>
              <span className="text-[9px] text-gray-400 font-medium pr-1 block">10:20 WIB · Dibaca</span>
            </div>
          </div>

          {/* Shopee/Tokopedia Style Interactive Nego Offer Card */}
          <div className="max-w-[90%] space-y-1">
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-black text-[#0F4C25] text-xs flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-emerald-600" />
                  Penawaran Nego Pembeli
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">
                  Menunggu Keputusan
                </span>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[#0F4C25] font-black text-base flex justify-between items-center">
                <span>{selectedChat.offeredPrice}</span>
                <span className="text-xs text-gray-500 font-semibold">(Total {selectedChat.total})</span>
              </div>

              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Bagaimana Pak Bowo? Jika sepakat, dana langsung dikunci aman di Panentra Escrow.
              </p>

              {/* Action Buttons Inside Chat Stream Card */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Penawaran nego ${selectedChat.offeredPrice} disetujui! Transaksi ${selectedChat.id} diperbarui.`);
                    setSelectedChat(null);
                  }}
                  className="flex-1 py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Handshake className="w-3.5 h-3.5 text-amber-300" />
                  Setujui Nego {selectedChat.offeredPrice}
                </button>

                <button
                  type="button"
                  onClick={() => alert("Kirim harga tawar balik ke pembeli.")}
                  className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C25] border border-emerald-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Tawar Balik
                </button>
              </div>
            </div>
            <span className="text-[9px] text-gray-400 font-medium pl-1 block">10:22 WIB</span>
          </div>
        </div>

        {/* Native Fixed Bottom Input Bar (Full Width WA / Tokped Style) */}
        <div className="sticky bottom-14 sm:bottom-16 z-40 bg-white border-t border-gray-200 p-2.5 px-3 flex items-center gap-2 shadow-lg">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Tulis pesan..."
            className="flex-1 h-10 px-4 bg-[#F3F4F6] border border-gray-200 rounded-full text-xs outline-none focus:border-[#0F4C25] focus:bg-white font-medium transition-all"
          />

          <button
            type="button"
            onClick={() => alert("Pesan terkirim ke pembeli!")}
            className="w-10 h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-[#FFFFFF] rounded-full flex items-center justify-center cursor-pointer shrink-0 shadow-xs active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ================= VIEW DAFTAR LIST CHAT =================
  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#0F4C25]" />
          Pesan & Negosiasi Pasokan
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Kelola Percakapan & Tawar-Menawar Harga Dengan Pembeli
        </p>
      </div>

      {/* AI Seasonal Hero Recommendation Banner */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 sm:p-6 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[60%] sm:max-w-[65%]">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase text-emerald-100 border border-white/20 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI Nego Helper
            </span>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Ada Penawaran Nego Rp 34.000/kg!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Toko Berkah Jaya menawar 150 kg Cabai Rawit. Disarankan terima karena 14% di atas modal HPP Anda.
            </p>
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative -mr-4 -mb-11 scale-110 sm:scale-170">
            <Image
              src="/assets/bowo-checklist.png"
              alt="Bowo AI Chat"
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
            placeholder="Cari nama pembeli, komoditas, ID pesanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#0F4C25] focus:ring-2 focus:ring-[#0F4C25]/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
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

      {/* Chat List Items */}
      <div className="space-y-2.5">
        {filteredChats.length === 0 ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-black text-gray-700">Percakapan tidak ditemukan</h3>
            <p className="text-xs text-gray-500 font-medium">
              Coba gunakan kata kunci lain atau pilih filter yang berbeda.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleOpenChat(chat)}
              className="bg-white rounded-[24px] p-4 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              {/* Buyer Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 p-1 flex items-center justify-center shrink-0 border border-emerald-100 relative">
                    <Image
                      src={chat.image}
                      alt={chat.customer}
                      width={44}
                      height={44}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-[#1A1C19] truncate">
                        {chat.customer}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold truncate">
                      {chat.customerType} · <span className="font-bold text-[#0F4C25]">{chat.item}</span>
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

              {/* Last Message Bubble Preview */}
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
