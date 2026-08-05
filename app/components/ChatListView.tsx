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
  ChevronLeft,
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
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "./Button";
import Avatar from "./Avatar";

import { getChats, getChatMessages, sendChatMessage, getAuthUser, ApiChatListItem, ApiChatMessageItem } from "@/lib/api";

type OfferStatus = "pending" | "accepted" | "countered";

export interface ChatConversation {
  numericChatId?: number;
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
  rawOfferPrice?: number;
  rawOfferQty?: number;
  total: string;
  notes?: string;
}

interface ChatListViewProps {
  onChatRoomStateChange?: (isOpen: boolean) => void;
}

export default function ChatListView({ onChatRoomStateChange }: ChatListViewProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "nego" | "unread" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState<ChatConversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ApiChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // Penawaran aksi (ACC / tawar balik) sisi Petani
  const currentUserId = getAuthUser()?.id;
  const HPP_PER_KG = 28500;
  const [offerStatus, setOfferStatus] = useState<Record<number, OfferStatus>>({});
  const [showCounterSheet, setShowCounterSheet] = useState(false);
  const [counterChatId, setCounterChatId] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState("30000");
  const [counterQty, setCounterQty] = useState("150");
  const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showSnackbar = React.useCallback((message: string, type: "success" | "error" = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, show: false }));
    }, type === "error" ? 4000 : 3000);
  }, []);

  const handleAcceptOffer = async (msg: ApiChatMessageItem) => {
    if (!msg.offer_price || !msg.offer_qty) return;
    const chatId = Number(selectedChat?.numericChatId || selectedChat?.id);

    setOfferStatus((prev) => ({ ...prev, [msg.id]: "accepted" }));
    showSnackbar("Penawaran harga disetujui. Menunggu pembayaran escrow dari mitra.");

    try {
      if (chatId) {
        await sendChatMessage(chatId, {
          text: `Saya setuju dengan penawaran Rp ${msg.offer_price.toLocaleString("id-ID")}/kg untuk ${msg.offer_qty} kg. Mohon segera selesaikan pembayaran escrow.`,
        });
      }
    } catch {
      // Optimistic acceptance; konfirmasi tetap tampil walau API gagal
    }
  };

  const handleOpenCounter = (msg: ApiChatMessageItem) => {
    setCounterChatId(msg.id);
    setCounterPrice((msg.offer_price || 30000).toString());
    setCounterQty((msg.offer_qty || 150).toString());
    setShowCounterSheet(true);
  };

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const chatId = Number(selectedChat?.numericChatId || selectedChat?.id);
    const priceNum = parseInt(counterPrice) || HPP_PER_KG;
    const qtyNum = parseInt(counterQty) || 50;

    if (counterChatId != null) {
      setOfferStatus((prev) => ({ ...prev, [counterChatId]: "countered" }));
    }
    setShowCounterSheet(false);
    showSnackbar("Tawaran balik terkirim. Menunggu respon mitra.");

    try {
      if (chatId) {
        const res = await sendChatMessage(chatId, {
          text: `Tawaran balik saya: Rp ${priceNum.toLocaleString("id-ID")}/kg untuk ${qtyNum} kg. Apakah bisa?`,
          offer_price: priceNum,
          offer_qty: qtyNum,
        });
        if (res?.data) {
          setMessages((prev) => [...prev, res.data]);
        }
      }
    } catch {
      // Pesan tetap tampil lokal walau API gagal
    }
  };

  React.useEffect(() => {
    async function loadChatsData() {
      try {
        const res = await getChats();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped: ChatConversation[] = res.data.map((c) => ({
            id: `ORD-${c.order_id || c.id}`,
            numericChatId: c.id,
            customer: c.counterpart?.name || "Mitra Pembeli",
            customerType: c.counterpart?.location || "Pembeli (Terverifikasi)",
            item: `${c.item || "Komoditas"} ${c.grade ? `(${c.grade})` : ""}`,
            qty: c.offer_qty ? `${c.offer_qty} kg` : "Pasokan Panen",
            lastMessage: c.last_message || "Belum ada pesan",
            time: c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Hari ini",
            unreadCount: c.unread_count || 0,
            statusBadge: c.offer_price ? `Nego Rp ${c.offer_price.toLocaleString("id-ID")}/kg` : "Chat Aktif",
            statusType: c.offer_price ? "nego" : "inquiry",
            image: "/assets/bowo-senang.png",
            unitPrice: c.offer_price ? `Rp ${c.offer_price.toLocaleString("id-ID")} / kg` : "Rp 0 / kg",
            offeredPrice: c.offer_price ? `Rp ${c.offer_price.toLocaleString("id-ID")} / kg` : "Rp 0 / kg",
            rawOfferPrice: c.offer_price || 0,
            rawOfferQty: c.offer_qty || 0,
            total: c.offer_price && c.offer_qty ? `Rp ${(c.offer_price * c.offer_qty).toLocaleString("id-ID")}` : "Rp 0",
          }));
          setChatList(mapped);
        } else {
          setChatList([]);
        }
      } catch (err) {
        console.warn("Gagal memuat API chats:", err);
        setChatList([]);
      }
    }
    loadChatsData();
  }, []);

  React.useEffect(() => {
    if (!selectedChat) return;
    const targetChatId = selectedChat.numericChatId || selectedChat.id;
    let cancelled = false;

    const loadMessages = () => {
      getChatMessages(targetChatId)
        .then((res) => {
          if (cancelled) return;
          setMessages(res && res.data && Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {
          if (!cancelled) setMessages([]);
        });
    };

    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedChat]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [selectedChat?.id, messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const textToSend = inputText;
    setInputText("");

    const targetChatId = selectedChat.numericChatId || selectedChat.id;
    const offerPrice = selectedChat.rawOfferPrice;
    const offerQty = selectedChat.rawOfferQty;

    try {
      const res = await sendChatMessage(targetChatId, {
        text: textToSend,
        conversation_id: targetChatId,
        offer_price: offerPrice || undefined,
        offer_qty: offerQty || undefined,
      });

      if (res && res.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            conversation_id: Number(targetChatId),
            sender_id: 6,
            sender_name: "Pak Budi Santoso",
            text: textToSend,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn("Gagal kirim chat message API:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          conversation_id: Number(targetChatId),
          sender_id: 6,
          sender_name: "Pak Budi Santoso",
          text: textToSend,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

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
    if (onChatRoomStateChange) onChatRoomStateChange(true);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    if (onChatRoomStateChange) onChatRoomStateChange(false);
  };

  // ================= VIEW FULL PAGE NATIVE CHAT ROOM (WA / SHOPEE / TOKPED STYLE) =================
  if (selectedChat) {
    return (
      <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pt-[116px] pb-24 bg-[#F4F6F4] min-h-screen flex flex-col relative z-20">
        {/* Combined Fixed Top Header Container (Fixed 100% at Top of Canvas - Never Scrolls) */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-b border-gray-200 shadow-md divide-y divide-gray-100">
          {/* Top Buyer Info Row */}
          <div className="p-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleCloseChat}
                aria-label="Kembali ke Daftar Chat"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5] text-[#1A1C19]" />
              </button>

              <div className="relative shrink-0">
                <Avatar name={selectedChat.customer} size={36} className="border-2 border-emerald-200" textClassName="text-xs" />
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
              <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] font-black text-[10px] rounded-md border border-emerald-100">
                Nego Aktif
              </span>
            </div>
          </div>

          {/* Shopee / Tokopedia Style Pinned Product Bar */}
          <div className="p-2.5 px-4 flex items-center justify-between gap-3 bg-[#F9FAF9]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0">
                <Avatar name={selectedChat.customer} size={36} className="rounded-xl" textClassName="text-xs" />
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
        </div>

        {/* Main Chat Stream Container (Seamless Background) */}
        <div className="flex-1 p-4 space-y-3.5 text-xs">
          <div className="text-center">
            <span className="bg-gray-200/80 text-gray-600 text-[10px] font-bold px-3 py-0.5 rounded-full inline-block">
              Hari Ini
            </span>
          </div>

          {/* Real Dynamic Messages from API */}
          {messages.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-500 font-medium bg-white rounded-2xl p-4 border border-gray-200">
              Belum ada riwayat pesan. Mulai percakapan di bawah.
            </div>
          ) : (
            messages.map((msg) => {
              const isMe =
                currentUserId != null ? msg.sender_id === currentUserId : (msg.sender_name && msg.sender_name.toLowerCase().includes("budi"));
              const offerStatusKey = offerStatus[msg.id];
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-[85%] ${isMe ? "ml-auto justify-end text-right" : ""}`}
                >
                  <div className={`space-y-1 ${isMe ? "text-right" : ""}`}>
                    <div
                      className={`p-3 rounded-2xl shadow-2xs space-y-1 text-left ${
                        isMe
                          ? "bg-[#0F4C25] text-white rounded-tr-xs"
                          : "bg-white border border-gray-200/80 rounded-tl-xs text-gray-800"
                      }`}
                    >
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                      {msg.offer_price && (
                        <div className="pt-1 mt-1 border-t border-emerald-400/30 text-[11px] font-bold">
                          Penawaran: Rp {msg.offer_price.toLocaleString("id-ID")} / kg
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium px-1 block">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Hari ini"}
                    </span>

                    {/* ===== CARD AKSI PENAWARAN HARGA PASOKAN (dari Mitra/Pemasok) ===== */}
                    {!isMe && msg.offer_price && msg.offer_qty != null && (
                      <div className="max-w-[92%] space-y-1 mx-auto mt-1">
                        <div className="bg-white border-2 border-[#0F4C25] rounded-2xl p-3.5 space-y-2.5 shadow-md">
                          {/* Header Card */}
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="font-black text-[#0F4C25] text-xs flex items-center gap-1.5">
                              <Handshake className="w-4 h-4 text-emerald-700" />
                              Penawaran Harga Pasokan
                            </span>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                offerStatusKey === "accepted"
                                  ? "bg-emerald-100 text-[#0F4C25]"
                                  : offerStatusKey === "countered"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-amber-50 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {offerStatusKey === "accepted"
                                ? "Penawaran Disetujui"
                                : offerStatusKey === "countered"
                                ? "Menunggu Respon Mitra"
                                : "Menunggu Respon Anda"}
                            </span>
                          </div>

                          {/* Box Highlight Utama */}
                          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[#0F4C25] font-black text-sm flex justify-between items-center">
                            <span>Rp {msg.offer_price.toLocaleString("id-ID")} /kg</span>
                            <span className="text-xs text-gray-600 font-bold">Total {msg.offer_qty} kg</span>
                          </div>

                          {/* Sub-info Margin */}
                          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                            Modal HPP Petani: <strong>Rp {HPP_PER_KG.toLocaleString("id-ID")}/kg</strong> • Margin +
                            {Math.round(((msg.offer_price - HPP_PER_KG) / HPP_PER_KG) * 100)}%
                          </p>

                          {/* Aksi */}
                          {offerStatusKey === "accepted" ? (
                            <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl py-2 text-center">
                              ✓ Penawaran telah disetujui. Menunggu pembayaran escrow dari mitra.
                            </p>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenCounter(msg)}
                                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all"
                              >
                                <Tag className="w-3.5 h-3.5 inline-block mr-1 text-amber-700" />
                                Ubah Tawaran
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAcceptOffer(msg)}
                                className="flex-1 py-2 bg-emerald-800 hover:bg-[#0F4C25] text-white rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-1 text-emerald-300" />
                                Terima Penawaran
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Native Fixed Bottom Input Bar (Full Width WA / Tokped Style) */}
        <form
          onSubmit={handleSendMessage}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-t border-gray-200 p-2.5 px-3.5 flex items-center gap-2 shadow-2xl"
        >
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 h-10 px-4 bg-[#F3F4F6] border border-gray-200 rounded-full text-xs outline-none focus:border-[#0F4C25] focus:bg-white font-medium transition-all"
          />

          <button
            type="submit"
            className="w-10 h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-[#FFFFFF] rounded-full flex items-center justify-center cursor-pointer shrink-0 shadow-xs active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* BottomSheet Tawar Balik (Ubah Tawaran) */}
        {showCounterSheet && (
          <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-in">
            <div className="bg-white rounded-t-[32px] p-5 w-full max-w-[440px] space-y-4 shadow-2xl border-t border-gray-200 animate-slide-up">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#0F4C25]" />
                  Tawar Balik Harga Pasokan
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCounterSheet(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendCounter} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">Harga Tawaran (Rp/kg)</label>
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
                    />
                    <span className="text-[9px] text-gray-400 font-medium block">HPP: Rp {HPP_PER_KG.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">Jumlah Pasokan (kg)</label>
                    <input
                      type="number"
                      value={counterQty}
                      onChange={(e) => setCounterQty(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-extrabold outline-none focus:border-[#0F4C25]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  Kirim Tawaran Balik
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Snackbar / Toast Notification */}
        {snackbar.show && (
          <div className="fixed bottom-22 sm:bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1A1C19]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700/80 animate-slide-up max-w-[92vw] sm:max-w-md">
            {snackbar.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-xs font-bold leading-snug">{snackbar.message}</p>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW DAFTAR LIST CHAT =================
  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
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
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Ada Penawaran Nego Rp 34.000/kg!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Toko Berkah Jaya menawar 150 kg Cabai Rawit. Disarankan terima karena 14% di atas modal HPP Anda.
            </p>
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative -mr-4 -mb-11 scale-110 sm:scale-160">
            <Image
              src="/assets/bowo-nego.png"
              alt="Bowo AI Nego"
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

        {/* Filter Pills with Soft Left & Right Edge Gradient Fade */}
        <div className="relative">
          {/* Left Edge Gradient Mask */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />

          {/* Scrollable Container */}
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

          {/* Right Edge Gradient Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />
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
                  <div className="relative shrink-0">
                    <Avatar name={chat.customer} size={44} className="border-2 border-emerald-100" textClassName="text-sm" />
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
