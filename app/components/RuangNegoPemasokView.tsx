"use client";

import React, { useState, useEffect } from "react";
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
import Avatar from "./Avatar";
import {
  getChats,
  getChatMessages,
  sendChatMessage,
  startNegotiation,
  getAuthUser,
  ApiChatListItem,
  ApiChatMessageItem,
} from "@/lib/api";

function formatChatTime(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function toConversation(c: ApiChatListItem): PemasokChatConversation {
  const counterpart = c.counterpart || ({} as ApiChatListItem["counterpart"]);
  return {
    id: c.id,
    apiChatId: c.id,
    listingId: c.listing_id,
    farmerName: counterpart.name || "Mitra Petani",
    farmerLocation: counterpart.location || "",
    item: c.item,
    grade: c.grade || "Grade A (SNI)",
    qty: c.offer_qty ? `${c.offer_qty} kg` : "-",
    lastMessage: c.last_message || "",
    time: formatChatTime(c.last_message_time),
    unreadCount: c.unread_count || 0,
    statusBadge: c.offer_price
      ? `Nego Rp ${c.offer_price.toLocaleString("id-ID")}/kg`
      : "Chat Aktif",
    statusType: c.offer_price ? "nego" : "inquiry",
    farmerAvatar: counterpart.avatar || "/assets/bowo-senang.png",
    productImage: "/assets/bowo-senang.png",
    listingPrice: c.offer_price || 0,
    offeredPrice: c.offer_price || 0,
    total:
      c.offer_price && c.offer_qty
        ? `Rp ${(c.offer_price * c.offer_qty).toLocaleString("id-ID")}`
        : "-",
  };
}

export interface PemasokChatConversation {
  id: string | number;
  apiChatId?: number;
  listingId?: number | null;
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

interface ChatRoomMessage {
  id: string;
  sender: "pemasok" | "petani";
  text: string;
  time: string;
  offerData?: { price: number; qty: number };
}

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
  const [chatList, setChatList] = useState<PemasokChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const currentUserId = getAuthUser()?.id;

  // Load chat list from API
  useEffect(() => {
    let cancelled = false;
    getChats()
      .then((res) => {
        if (cancelled) return;
        setChatList((res?.data || []).map(toConversation));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // When opened from a listing, auto-open (or create via API) the negotiation room
  const [selectedChat, setSelectedChat] = useState<PemasokChatConversation | null>(null);
  const autoStartedRef = React.useRef(false);

  useEffect(() => {
    if (!listing || autoStartedRef.current) return;

    const existing = chatList.find((c) => c.listingId === listing.id || c.id === listing.id);
    if (existing) {
      setSelectedChat(existing);
      return;
    }

    autoStartedRef.current = true;
    startNegotiation({
      listing_id: listing.id,
      message: `Halo ${listing.farmerName}, saya tertarik mengajukan penawaran pasokan ${listing.commodity}.`,
    })
      .then((res) => {
        const data = res as { data?: { id?: number; conversation_id?: number; chat_id?: number } };
        const roomId = data?.data?.conversation_id ?? data?.data?.id ?? data?.data?.chat_id;
        if (roomId) {
          const local: PemasokChatConversation = {
            id: roomId,
            apiChatId: roomId,
            listingId: listing.id as number,
            farmerName: listing.farmerName,
            farmerLocation: listing.farmerLocation,
            item: listing.commodity,
            grade: listing.grade,
            qty: `${Math.min(100, listing.availableKg || 100)} kg`,
            lastMessage: `Halo ${listing.farmerName}, saya tertarik mengajukan penawaran pasokan ${listing.commodity}.`,
            time: "Sekarang",
            unreadCount: 0,
            statusBadge: `Nego Rp ${listing.sellingPrice.toLocaleString("id-ID")}/kg`,
            statusType: "nego",
            farmerAvatar: listing.farmerAvatar || "/assets/bowo-senang.png",
            productImage: listing.productImage || "/assets/bowo-senang.png",
            listingPrice: listing.sellingPrice,
            offeredPrice: listing.sellingPrice - 3500,
            total: `Rp ${((listing.sellingPrice - 3500) * Math.min(100, listing.availableKg || 100)).toLocaleString("id-ID")}`,
            listingRef: listing,
          };
          setSelectedChat(local);
          setChatList((prev) => [local, ...prev]);
        } else {
          // Room creation didn't return an id; still show a local conversation
          setSelectedChat({
            id: `new-${listing.id}`,
            listingId: listing.id as number,
            farmerName: listing.farmerName,
            farmerLocation: listing.farmerLocation,
            item: listing.commodity,
            grade: listing.grade,
            qty: `${Math.min(100, listing.availableKg || 100)} kg`,
            lastMessage: "Penawaran baru",
            time: "Sekarang",
            unreadCount: 0,
            statusBadge: `Nego Rp ${listing.sellingPrice.toLocaleString("id-ID")}/kg`,
            statusType: "nego",
            farmerAvatar: listing.farmerAvatar || "/assets/bowo-senang.png",
            productImage: listing.productImage || "/assets/bowo-senang.png",
            listingPrice: listing.sellingPrice,
            offeredPrice: listing.sellingPrice - 3500,
            total: "-",
            listingRef: listing,
          });
        }
      })
      .catch(() => {
        setSelectedChat({
          id: `new-${listing.id}`,
          listingId: listing.id as number,
          farmerName: listing.farmerName,
          farmerLocation: listing.farmerLocation,
          item: listing.commodity,
          grade: listing.grade,
          qty: `${Math.min(100, listing.availableKg || 100)} kg`,
          lastMessage: "Penawaran baru",
          time: "Sekarang",
          unreadCount: 0,
          statusBadge: `Nego Rp ${listing.sellingPrice.toLocaleString("id-ID")}/kg`,
          statusType: "nego",
          farmerAvatar: listing.farmerAvatar || "/assets/bowo-senang.png",
          productImage: listing.productImage || "/assets/bowo-senang.png",
          listingPrice: listing.sellingPrice,
          offeredPrice: listing.sellingPrice - 3500,
          total: "-",
          listingRef: listing,
        });
      });
  }, [listing, chatList]);

  // Chat Room Input States
  const [inputMessage, setInputMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState<string>("34500");
  const [offerQty, setOfferQty] = useState<string>("100");
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [negoStatus, setNegoStatus] = useState<"draft" | "pending" | "approved" | "counter">("pending");

  const [chatRoomMessages, setChatRoomMessages] = useState<ChatRoomMessage[]>([]);

  // Load messages when a real chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    const cid = selectedChat.apiChatId ?? selectedChat.id;
    if (typeof cid !== "number") return;

    let cancelled = false;
    getChatMessages(cid)
      .then((res) => {
        if (cancelled) return;
        const msgs = (res?.data || []).map((m: ApiChatMessageItem) => ({
          id: String(m.id),
          sender: m.sender_id === currentUserId ? ("pemasok" as const) : ("petani" as const),
          text: m.text,
          time: formatChatTime(m.created_at),
          offerData:
            m.offer_price != null && m.offer_qty != null
              ? { price: m.offer_price, qty: m.offer_qty }
              : undefined,
        }));
        setChatRoomMessages(msgs);
      })
      .catch(() => {
        setChatRoomMessages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedChat?.id, currentUserId]);

  const filteredChats = chatList.filter((chat) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "nego" && chat.statusType === "nego") ||
      (activeFilter === "unread" && chat.unreadCount > 0) ||
      (activeFilter === "completed" && chat.statusType === "completed");

    const matchesSearch =
      chat.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(chat.id).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenChat = (chat: PemasokChatConversation) => {
    setChatList((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChat(chat);
    setOfferPrice(chat.offeredPrice.toString());
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat || sending) return;

    const text = inputMessage.trim();
    setInputMessage("");
    const cid = selectedChat.apiChatId ?? selectedChat.id;

    if (typeof cid === "number") {
      setSending(true);
      try {
        await sendChatMessage(cid, { text });
      } catch {
        // Keep optimistic message even if API send fails
      }
      setSending(false);
    }

    setChatRoomMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "pemasok", text, time: "Sekarang" },
    ]);
  };

  const handleSendNewOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || sending) return;
    const priceNum = parseInt(offerPrice) || selectedChat.listingPrice;
    const qtyNum = parseInt(offerQty) || 50;

    const text = `Saya memperbarui penawaran pasokan sebesar ${qtyNum} kg di harga Rp ${priceNum.toLocaleString("id-ID")}/kg.`;
    const cid = selectedChat.apiChatId ?? selectedChat.id;

    if (typeof cid === "number") {
      setSending(true);
      try {
        await sendChatMessage(cid, { text, offer_price: priceNum, offer_qty: qtyNum });
      } catch {
        // Keep optimistic message even if API send fails
      }
      setSending(false);
    }

    setChatRoomMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "pemasok",
        text,
        time: "Sekarang",
        offerData: { price: priceNum, qty: qtyNum },
      },
    ]);
    setNegoStatus("pending");
    setShowOfferDrawer(false);
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

              <div className="relative shrink-0">
                <Avatar name={selectedChat.farmerName} size={36} className="border-2 border-emerald-200" textClassName="text-xs" />
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
                              agreedPrice: msg.offerData?.price || selectedChat.listingPrice,
                              agreedQty: msg.offerData?.qty || parseInt(offerQty) || 50,
                            });
                          }}
                          className="flex-1 py-2 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                          Lanjut ke Pembayaran Escrow
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
              {chatList.length > 0
                ? `${chatList.length} percakapan negosiasi dengan mitra petani tersimpan.`
                : "Mulai negosiasi dengan memilih produk dari marketplace."}
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
      {loading ? (
        <div className="space-y-2.5">
          {[0, 1].map((n) => (
            <div key={n} className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-2xs space-y-2.5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error && filteredChats.length === 0 ? (
        <div className="bg-rose-50 border border-rose-200 rounded-[28px] p-6 text-center space-y-3">
          <p className="text-xs font-bold text-rose-700">{error}</p>
          <p className="text-[11px] text-rose-600 font-medium">
            Pastikan login sebagai pemasok untuk melihat daftar chat.
          </p>
        </div>
      ) : (
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
                  <div className="relative shrink-0">
                    <Avatar name={chat.farmerName} size={44} className="border-2 border-emerald-100" textClassName="text-sm" />
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
      )}
    </div>
  );
}
