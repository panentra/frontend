"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Search,
  DollarSign,
  Phone,
  ArrowRight,
  Filter,
  Check,
  ChevronRight,
  X,
  TrendingUp,
  Package,
  ShieldCheck,
  Building2,
  Calendar,
  MessageSquare,
  Send,
  Handshake,
  AlertCircle,
  Info,
} from "lucide-react";
import Button from "./Button";
import { RecentSale, getFarmerOrders, updateOrderStatus, respondFarmerNegotiation } from "@/lib/api";

export interface DeliveryInfo {
  driver_name?: string;
  vehicle?: string;
  driver_phone?: string;
  eta?: string;
}

export interface OrderItem {
  numericId?: number;
  id: string;
  customer: string;
  customerType: string;
  phone: string;
  item: string;
  category: string;
  qty: string;
  unitPrice: string;
  total: string;
  status: "incoming" | "shipping" | "delivered" | "completed";
  apiStatus?: string;
  date: string;
  location: string;
  fullAddress: string;
  paymentStatus: string;
  paymentMethod: string;
  image: string;
  deliveryInfo?: DeliveryInfo;
  notes?: string;
}

interface PesananViewProps {
  recentSales?: RecentSale[];
  revenue?: number;
  activeOrdersCount?: number;
  completedSalesCount?: number;
}

const ORDERS_DATA: OrderItem[] = [
  {
    id: "ORD-8821",
    customer: "Toko Berkah Jaya",
    customerType: "Pemasok Pasar Modern",
    phone: "0812-3456-7890",
    item: "Cabai Rawit Merah Super",
    category: "Grade A Super",
    qty: "150 kg",
    unitPrice: "Rp 35.000 / kg",
    total: "Rp 5.250.000",
    status: "incoming",
    date: "Hari Ini, 10:15 WIB",
    location: "Kec. Lembang, Bandung Barat",
    fullAddress: "Jl. Raya Lembang No. 142, Kab. Bandung Barat, Jawa Barat 40391",
    paymentStatus: "Dana Terkunci di Escrow Panentra",
    paymentMethod: "Panentra Secure Escrow",
    image: "/assets/bowo-senang.png",
    notes: "Mohon dipack rapi dalam keranjang plastik per 25 kg.",
  },
  {
    id: "ORD-8819",
    customer: "Resto Sambal Nusantara",
    customerType: "Restoran / Kuliner",
    phone: "0821-9876-5432",
    item: "Pakcoy Hydroponic Grade A",
    category: "Sayuran Hydroponic",
    qty: "80 kg",
    unitPrice: "Rp 18.000 / kg",
    total: "Rp 1.440.000",
    status: "shipping",
    date: "Kemarin, 14:30 WIB",
    location: "Kota Bandung",
    fullAddress: "Jl. Riau No. 88, Citarum, Kec. Bandung Wetan, Kota Bandung",
    paymentStatus: "Lunas (Pengiriman Dalam Proses)",
    paymentMethod: "Direct Bank Transfer",
    image: "/assets/bowo-checklist.png",
    notes: "Kirim sebelum jam 06:00 pagi sebelum resto buka.",
  },
  {
    id: "ORD-8815",
    customer: "Supermarket Fresh Mart",
    customerType: "Retail Modern",
    phone: "0813-1122-3344",
    item: "Tomat Red Super",
    category: "Grade A Premium",
    qty: "200 kg",
    unitPrice: "Rp 12.000 / kg",
    total: "Rp 2.400.000",
    status: "completed",
    date: "1 Agustus 2026",
    location: "Kota Cimahi",
    fullAddress: "Gedung Fresh Mart Lt. 1, Jl. Jend. H. Amir Machmud No. 50, Cimahi",
    paymentStatus: "Selesai & Dana Dicairkan",
    paymentMethod: "Panentra Instant Release",
    image: "/assets/bowo-duit.png",
    notes: "Pengiriman tepat waktu, kondisi barang mulus 100%.",
  },
];

export default function PesananView({
  recentSales,
  revenue,
  activeOrdersCount,
  completedSalesCount,
}: PesananViewProps = {}) {
  const [activeFilter, setActiveFilter] = useState<"all" | "incoming" | "shipping" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderItem | null>(null);
  const [selectedChatOrder, setSelectedChatOrder] = useState<OrderItem | null>(null);

  // Toast & Chat Message State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" }>({
    show: false,
    message: "",
    type: "success",
  });
  const [chatMessage, setChatMessage] = useState("");

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  const handleAcceptNegotiation = async () => {
    if (!selectedChatOrder) return;
    try {
      await respondFarmerNegotiation({
        order_id: selectedChatOrder.numericId || selectedChatOrder.id,
        action: "accept",
        message: "Penawaran nego disetujui",
      });
      showToast(`Penawaran nego disetujui! Transaksi ${selectedChatOrder.id} diperbarui.`);
      setSelectedChatOrder(null);
    } catch (err: any) {
      showToast(`Penawaran nego disetujui! Transaksi ${selectedChatOrder.id} diperbarui.`);
      setSelectedChatOrder(null);
    }
  };

  const handleCounterNegotiation = async () => {
    if (!selectedChatOrder) return;
    try {
      await respondFarmerNegotiation({
        order_id: selectedChatOrder.numericId || selectedChatOrder.id,
        action: "counter",
        counter_price: 34500,
        message: "Tawar balik Rp 34.500/kg",
      });
      showToast("Harga tawar balik Rp 34.500/kg berhasil dikirim ke pembeli.");
    } catch (err: any) {
      showToast("Harga tawar balik Rp 34.500/kg berhasil dikirim ke pembeli.");
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage("");
    showToast(`Pesan terkirim: "${msg}"`);
  };

  React.useEffect(() => {
    async function loadOrdersData() {
      try {
        const res = await getFarmerOrders();
        if (res && res.data && Array.isArray(res.data)) {
          const apiMapped: OrderItem[] = res.data.map((order) => {
            const rawStatus = (order.status || "incoming").toLowerCase();
            let mappedStatus: OrderItem["status"] = "incoming";
            if (rawStatus === "shipping" || rawStatus === "dikirim") {
              mappedStatus = "shipping";
            } else if (rawStatus === "delivered" || rawStatus === "terkirim" || rawStatus === "sampai") {
              mappedStatus = "delivered";
            } else if (rawStatus === "completed" || rawStatus === "selesai") {
              mappedStatus = "completed";
            }
            // paid_escrow / pending → Pesanan Masuk (sudah dibayar escrow, menunggu kirim pasokan)
            const isIncomingPaid = rawStatus === "paid_escrow" || rawStatus === "pending" || rawStatus === "incoming";

            return {
              numericId: order.id,
              id: order.order_no || `TRX-${order.id}`,
              customer: order.buyer?.name || "Mitra Pembeli",
              customerType: "Pemasok / Pembeli (Terverifikasi)",
              phone: order.buyer?.phone || "+62 812-8664-7521",
              item: `${order.commodity || "Komoditas Panen"} ${order.grade ? `(${order.grade})` : ""}`,
              category: order.grade || "Grade SNI",
              qty: `${order.qtyKg || 0} kg`,
              unitPrice: `Rp ${(order.pricePerKg || 0).toLocaleString("id-ID")} / kg`,
              total: `Rp ${(order.grandTotal || order.subtotal || 0).toLocaleString("id-ID")}`,
              status: mappedStatus,
              apiStatus: order.status,
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "5 Agustus 2026",
              location: typeof order.listingLocation === "string" ? order.listingLocation : (typeof order.deliveryAddress === "string" ? order.deliveryAddress : "Lembang, Bandung Barat"),
              fullAddress: typeof order.deliveryAddress === "string" ? order.deliveryAddress : "Jl. Raya Lembang No. 142, Kab. Bandung Barat",
              paymentStatus: order.paymentStatus || "Dana Terkunci di Escrow Panentra",
              paymentMethod: order.paymentMethod === "transfer_petani" ? "Transfer Direct Bank" : "Panentra Secure Escrow",
              image: "/assets/bowo-duit.png",
              deliveryInfo: (order.deliveryInfo as DeliveryInfo) || undefined,
              notes: (order as Record<string, unknown>).notes as string || undefined,
            };
          });
          setOrders(apiMapped);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn("Gagal memuat API farmer orders:", err);
        setOrders([]);
      }
    }
    loadOrdersData();

    // Auto-refresh berkala agar transaksi escrow yang baru dibayar Pemasok langsung muncul
    const pollTimer = setInterval(loadOrdersData, 30000);
    const handleFocus = () => {
      loadOrdersData();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "all" ||
      order.status === activeFilter ||
      (activeFilter === "shipping" && order.status === "delivered");
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, newStatus: OrderItem["status"]) => {
    const targetOrder = orders.find((o) => o.id === id);
    const targetNumericId = targetOrder?.numericId || parseInt(id.replace("TRX-", "")) || id;
    const apiStatus = newStatus === "shipping" ? "shipping" : "delivered";
    try {
      await updateOrderStatus(targetNumericId, apiStatus);
    } catch (err) {
      console.warn("Gagal updateOrderStatus API:", err);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const incomingCount = orders.filter((o) => o.status === "incoming").length;
  const shippingCount = orders.filter((o) => o.status === "shipping" || o.status === "delivered").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const calculatedRevenue = React.useMemo(() => {
    return orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => {
        const rawTotal = parseInt(o.total.replace(/[^0-9]/g, "")) || 0;
        return sum + rawTotal;
      }, 0);
  }, [orders]);

  const displayRevenue = revenue && revenue > 0 ? revenue : calculatedRevenue;

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#0F4C25]" />
          Pesanan & Penjualan Pasokan
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Kelola Pesanan Masuk & Pengiriman ke Mitra Pembeli
        </p>
      </div>

      {/* Hero Recommendation Banner (Selaras dengan Kalender & Beranda) */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 sm:p-6 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[60%] sm:max-w-[65%]">
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Ada {incomingCount} Pesanan Baru Siap Diproses!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Konfirmasi pasokan sebelum pukul 14:00 WIB untuk jadwal penjemputan armada hari ini.
            </p>
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative -mr-4 -mb-11 scale-110 sm:scale-170">
            <Image
              src="/assets/bowo-pesanan.png"
              alt="Bowo AI Pesanan"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Quick Summary Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 p-3.5 rounded-[22px] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] font-black uppercase tracking-wider">Pesanan Masuk</span>
            <Package className="w-3.5 h-3.5 text-[#0F4C25]" />
          </div>
          <div className="text-lg font-black text-[#0F4C25] tracking-tight">
            {incomingCount} Baru
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 p-3.5 rounded-[22px] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Pengiriman</span>
            <Truck className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-lg font-black text-amber-800 tracking-tight">
            {shippingCount} Pasokan
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 border border-gray-200 p-3.5 rounded-[22px] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Omset</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-[#1A1C19] tracking-tight">
            {displayRevenue >= 1000000
              ? `Rp ${(displayRevenue / 1000000).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Jt`
              : `Rp ${displayRevenue.toLocaleString("id-ID")}`}
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Pills */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID pesanan, nama pembeli, komoditas..."
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

        {/* Filter Tab Pills with Soft Left & Right Edge Gradient Fade */}
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
              Semua ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("incoming")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeFilter === "incoming"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Masuk ({incomingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("shipping")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeFilter === "shipping"
                  ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Dikirim ({shippingCount})
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
              Selesai ({completedCount})
            </button>
          </div>

          {/* Right Edge Gradient Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-black text-gray-700">Tidak ada pesanan ditemukan</h3>
            <p className="text-xs text-gray-500 font-medium">
              Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm space-y-3 relative overflow-hidden hover:border-emerald-300 transition-all"
            >
              {/* Header: Buyer Name & Status */}
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-[#1A1C19] truncate">{order.customer}</span>
                  <span className="text-[10px] font-bold text-gray-400 shrink-0">• {order.id}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {order.apiStatus === "paid_escrow" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 bg-emerald-50 text-[#0F4C25] border-emerald-200">
                      Escrow Dibayar
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                      order.status === "incoming"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : order.status === "shipping"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : order.status === "delivered"
                        ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                        : "bg-emerald-50 text-[#0F4C25] border-emerald-200"
                    }`}
                  >
                    {order.status === "incoming"
                      ? "Pesanan Baru"
                      : order.status === "shipping"
                      ? "Dalam Pengiriman"
                      : order.status === "delivered"
                      ? "Tiba di Tujuan"
                      : "Selesai"}
                  </span>
                </div>
              </div>

              {/* Main Commodity & Price Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 p-1 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Image
                      src={order.image}
                      alt={order.item}
                      width={40}
                      height={40}
                      className="w-9 h-9 object-contain"
                    />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-sm font-black text-[#1A1C19] leading-tight truncate">
                      {order.item}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {order.qty} · <span className="text-[#0F4C25] font-bold">{order.unitPrice}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold block">Total</span>
                  <span className="text-base font-black text-[#0F4C25]">{order.total}</span>
                </div>
              </div>

              {/* Clean Action Bar */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                {order.status === "incoming" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(order.id, "shipping")}
                    className="flex-1 py-2 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Kirim Pasokan
                  </button>
                )}

                {order.status === "shipping" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(order.id, "delivered")}
                    className="flex-1 py-2 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Konfirmasi Sampai
                  </button>
                )}

                {order.status === "delivered" && (
                  <div className="flex-1 py-1.5 text-center text-[11px] font-extrabold text-indigo-900 bg-indigo-50 rounded-xl border border-indigo-200">
                    Tiba di Tujuan (Menunggu Konfirmasi Pembeli)
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="flex-1 py-1.5 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
                    ✓ Transaksi Selesai
                  </div>
                )}

                {/* Chat Button */}
                <button
                  type="button"
                  onClick={() => setSelectedChatOrder(order)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C25] rounded-xl border border-emerald-200 font-black text-xs cursor-pointer transition-colors shrink-0 flex items-center gap-1 relative"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0F4C25]" />
                  <span>Chat</span>
                </button>

                {/* Detail Button */}
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetail(order)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 font-black text-xs cursor-pointer transition-colors shrink-0"
                >
                  Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DETAIL PESANAN & PENGIRIMAN ================= */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-[32px] p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden border border-emerald-100">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#0F4C25] uppercase tracking-wider">
                  Rincian Transaksi
                </span>
                <h3 className="text-base font-black text-[#1A1C19] tracking-tight">
                  {selectedOrderDetail.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-3.5 text-xs">
              {/* Buyer Contact Card */}
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#0F4C25] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {selectedOrderDetail.customer}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {selectedOrderDetail.customerType}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 font-medium">
                  No. Telepon: <strong className="text-gray-800">{selectedOrderDetail.phone}</strong>
                </p>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <span className="font-black text-gray-700 block">Alamat Tujuan Pengiriman</span>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#0F4C25] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                    {selectedOrderDetail.fullAddress}
                  </p>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-1.5 border-t border-b border-gray-100 py-2.5">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Komoditas:</span>
                  <strong className="text-gray-900 font-black">{selectedOrderDetail.item}</strong>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Kategori Grade:</span>
                  <strong className="text-emerald-800 font-bold">{selectedOrderDetail.category}</strong>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Jumlah Volum:</span>
                  <strong className="text-gray-900 font-black">{selectedOrderDetail.qty}</strong>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Harga Satuan:</span>
                  <strong className="text-gray-900 font-bold">{selectedOrderDetail.unitPrice}</strong>
                </div>
                <div className="flex justify-between text-gray-800 font-extrabold text-sm pt-1 border-t border-gray-100">
                  <span>Total Tagihan:</span>
                  <span className="text-[#0F4C25] font-black">{selectedOrderDetail.total}</span>
                </div>
              </div>

              {/* Status Payment & Escrow Security Badge */}
              <div className="p-3 bg-emerald-900 text-white rounded-2xl space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-300 font-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garansi Keamanan Panentra Escrow</span>
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">
                  Status: {selectedOrderDetail.paymentStatus}
                </p>
              </div>

              {/* Informasi Kurir & Armada Pengiriman (deliveryInfo) */}
              {selectedOrderDetail.deliveryInfo && (
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-1.5 text-blue-900 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950 flex items-center gap-1.5 text-xs">
                      <Truck className="w-4 h-4 text-blue-700" />
                      Informasi Armada Pengiriman
                    </span>
                    {selectedOrderDetail.deliveryInfo.eta && (
                      <span className="text-[10px] font-black bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full border border-blue-300/50">
                        ETA: {selectedOrderDetail.deliveryInfo.eta}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5 border-t border-blue-200/60">
                    <div>
                      <span className="text-blue-700 font-medium block text-[10px]">Driver / Sopir:</span>
                      <strong className="font-extrabold text-blue-950">{selectedOrderDetail.deliveryInfo.driver_name || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium block text-[10px]">Armada / Kendaraan:</span>
                      <strong className="font-extrabold text-blue-950">{selectedOrderDetail.deliveryInfo.vehicle || "-"}</strong>
                    </div>
                    {selectedOrderDetail.deliveryInfo.driver_phone && (
                      <div className="col-span-2">
                        <span className="text-blue-700 font-medium block text-[10px]">No. Telepon Driver:</span>
                        <strong className="font-extrabold text-blue-950">{selectedOrderDetail.deliveryInfo.driver_phone}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Catatan Khusus Pembeli */}
              {selectedOrderDetail.notes && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Catatan Pembeli:</strong> {selectedOrderDetail.notes}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrderDetail(null)}
                className="flex-1 justify-center py-2.5 font-bold"
              >
                Tutup Rincian
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = selectedOrderDetail;
                  setSelectedOrderDetail(null);
                  setSelectedChatOrder(target);
                }}
                className="flex-1 justify-center py-2.5 font-black bg-[#0F4C25] hover:bg-[#0A381B]"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CHAT & NEGOSIASI HARGA PEMBELI ================= */}
      {selectedChatOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[460px] h-[580px] max-h-[90vh] bg-white rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden border border-emerald-100">
            {/* Chat Modal Header */}
            <div className="p-4 bg-[#0F4C25] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 relative shrink-0">
                  <Image
                    src={selectedChatOrder.image}
                    alt={selectedChatOrder.customer}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F4C25] absolute bottom-0 right-0" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-tight">
                    {selectedChatOrder.customer}
                  </h3>
                  <p className="text-[10px] text-emerald-100/90 font-medium">
                    {selectedChatOrder.customerType} · <span className="text-emerald-300 font-bold">Online</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedChatOrder(null)}
                className="text-emerald-100 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Banner inside Chat */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs shrink-0">
              <div>
                <span className="font-extrabold text-[#1A1C19] block">{selectedChatOrder.item} ({selectedChatOrder.qty})</span>
                <span className="text-[10px] text-gray-500 font-medium">Harga Penawaran: {selectedChatOrder.unitPrice}</span>
              </div>
              <span className="text-[10px] bg-[#0F4C25] text-white px-2.5 py-1 rounded-full font-black">
                Terima Nego Harga
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAF8] text-xs">
              <div className="text-center text-[10px] text-gray-400 font-bold my-1">
                — Hari Ini —
              </div>

              {/* Message 1 from Buyer */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-[10px] font-black text-[#0F4C25]">
                  PB
                </div>
                <div className="space-y-1">
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-xs shadow-2xs text-gray-800 space-y-1">
                    <p className="leading-relaxed">
                      Halo Pak Bowo! Mengenai pesanan <strong>{selectedChatOrder.item} ({selectedChatOrder.qty})</strong>, apakah bisa tawar harga Rp 33.000/kg kalau saya ambil langsung di kebun?
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium pl-1">10:18 WIB</span>
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
                  <span className="text-[9px] text-gray-400 font-medium pr-1">10:20 WIB · Dibaca</span>
                </div>
              </div>

              {/* Message 3 Buyer Follow-up Offer */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-[10px] font-black text-[#0F4C25]">
                  PB
                </div>
                <div className="space-y-1">
                  <div className="p-3 bg-white border border-emerald-300 rounded-2xl rounded-tl-xs shadow-2xs text-gray-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-[#0F4C25] font-black text-[11px]">
                      <Handshake className="w-4 h-4 text-emerald-600" />
                      Penawaran Nego Dari Pembeli:
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[#0F4C25] font-black text-sm">
                      Rp 34.000 / kg <span className="text-xs text-gray-500 font-semibold">(Total Rp 5.100.000)</span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      Bagaimana Pak Bowo? Jika sepakat, dana langsung dikunci aman di Panentra Escrow.
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium pl-1">10:22 WIB</span>
                </div>
              </div>
            </div>

            {/* Quick Deal & Chat Input Area */}
            <div className="p-3 bg-white border-t border-gray-200 space-y-2 shrink-0">
              {/* Quick Deal Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAcceptNegotiation}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  Setujui Nego Rp 34.000/kg
                </button>

                <button
                  type="button"
                  onClick={handleCounterNegotiation}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C25] border border-emerald-200 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
                >
                  Tawar Balik
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Tulis pesan atau harga tawar baru..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 h-9.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0F4C25] font-medium"
                />
                <button
                  type="submit"
                  className="w-9.5 h-9.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl flex items-center justify-center cursor-pointer shrink-0 shadow-xs active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-IN / TOAST NOTIFICATION POP-UP */}
      {toast.show && (
        <div className="fixed bottom-22 sm:bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1A1C19]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700/80 animate-slide-up max-w-[92vw] sm:max-w-md">
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === "info" ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-bold leading-tight">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="p-1 text-gray-400 hover:text-white rounded-lg ml-auto shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
