"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getSupplierDeliveries, confirmOrderReceived, SupplierOrderItem } from "@/lib/api";
import Snackbar, { useSnackbar } from "./Snackbar";

export interface DeliveryItem {
  id: string;
  orderId?: number;
  commodity: string;
  qty: string;
  farmer: string;
  farmLocation: string;
  destination: string;
  driverName: string;
  vehicle: string;
  driverPhone: string;
  eta: string;
  statusText: string;
  isCompleted: boolean;
  deliveredDate?: string;
  image: string;
  statusStep: number;
  steps: { title: string; time: string; done: boolean; current?: boolean }[];
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

function toDeliveryItem(o: SupplierOrderItem): DeliveryItem {
  const completed = o.status === "completed";
  const info = o.deliveryInfo || {};
  return {
    id: o.order_no || `TRX-${o.id}`,
    orderId: o.id,
    commodity: o.commodity,
    qty: `${o.qtyKg} kg`,
    farmer: o.seller?.name || "Petani",
    farmLocation: o.listingLocation || "Lokasi Lahan",
    destination: o.deliveryAddress || "Alamat Toko",
    driverName: info.driver_name || "Kurir Panentra",
    vehicle: info.vehicle || "-",
    driverPhone: info.driver_phone || "-",
    eta: info.eta || (completed ? "Selesai" : "Sedang Berlangsung"),
    statusText: completed ? "Sampai & Selesai" : "Kurir Dalam Perjalanan ke Toko",
    isCompleted: completed,
    deliveredDate: o.completedAt ? formatDateTime(o.completedAt) : undefined,
    image: "/assets/bowo-senang.png",
    statusStep: completed ? 4 : 3,
    steps: completed
      ? [
          { title: "Pesanan Dikonfirmasi Petani", time: "Terkonfirmasi", done: true },
          { title: "Hasil Panen Dipetik & Dikemas", time: "Disiapkan", done: true },
          { title: "Kurir Dalam Perjalanan ke Toko", time: "Dalam Perjalanan", done: true },
          { title: "Pasokan Sampai di Gudang Toko", time: formatDateTime(o.completedAt), done: true },
        ]
      : [
          { title: "Pesanan Dikonfirmasi Petani", time: "Terkonfirmasi", done: true },
          { title: "Hasil Panen Dipetik & Dikemas", time: "Disiapkan", done: true },
          { title: "Kurir Dalam Perjalanan ke Toko", time: info.eta || "Sedang Berlangsung", done: true, current: true },
          { title: "Pasokan Sampai di Gudang Toko", time: "Menunggu Konfirmasi", done: false },
        ],
  };
}

export default function PengantaranPemasokView() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);

  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();

  const loadDeliveries = () => {
    setLoading(true);
    setError(null);
    getSupplierDeliveries()
      .then((res) => {
        setDeliveries((res?.data || []).map(toDeliveryItem));
      })
      .catch((err: Error) => {
        setError(err.message);
        setDeliveries([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    getSupplierDeliveries()
      .then((res) => {
        if (cancelled) return;
        setDeliveries((res?.data || []).map(toDeliveryItem));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setDeliveries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConfirmReceived = async (item: DeliveryItem) => {
    if (item.orderId == null) return;
    setConfirmingId(item.orderId);
    try {
      await confirmOrderReceived(item.orderId);
      showSnackbar("Pasokan telah berhasil dikonfirmasi sampai di toko! Escrow pembayaran segera dicairkan ke Petani.", "success");
      setSelectedDelivery(null);
      loadDeliveries();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Order belum dapat dikonfirmasi.", "error");
    } finally {
      setConfirmingId(null);
    }
  };

  const activeDeliveries = deliveries.filter((d) => !d.isCompleted);
  const historyDeliveries = deliveries.filter((d) => d.isCompleted);

  // ================= VIEW 2: DETAIL LAGI TRACKING VIEW =================
  if (selectedDelivery) {
    return (
      <div className="space-y-5 animate-fade-in pb-10">
        {/* Header with Left Back Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedDelivery(null)}
            aria-label="Kembali ke Daftar Pengantaran"
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
              Detail Lacak Pengantaran
            </h1>
            <p className="text-xs font-bold text-[#0F4C25]">
              Order #{selectedDelivery.id} • {selectedDelivery.farmer}
            </p>
          </div>
        </div>

        {/* Live Delivery Map Visual Card */}
        <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase text-emerald-100 border border-white/20 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-300" />
              {selectedDelivery.isCompleted ? "Status Pengiriman" : "Live GPS Tracking"}
            </span>
            <span className="text-xs font-black text-emerald-200">
              {selectedDelivery.eta}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-tight text-white">
              {selectedDelivery.commodity} ({selectedDelivery.qty})
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Petani: {selectedDelivery.farmer} • {selectedDelivery.farmLocation}
            </p>
          </div>

          {/* Live Route Progress Bar */}
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {selectedDelivery.farmLocation.split(",")[0]}
              </span>
              <span className={selectedDelivery.isCompleted ? "text-emerald-300 font-extrabold" : "text-amber-300 font-extrabold"}>
                {selectedDelivery.statusText}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                Toko Berkah Jaya
              </span>
            </div>

            <div className="w-full h-3 bg-black/20 rounded-full p-0.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedDelivery.isCompleted
                    ? "bg-emerald-400 w-full"
                    : "bg-gradient-to-r from-emerald-400 to-amber-300 w-[65%]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Driver & Vehicle Info Card */}
        <div className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0F4C25] font-black shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-[#1A1C19]">
                {selectedDelivery.driverName}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {selectedDelivery.vehicle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showSnackbar(`Menghubungi Driver ${selectedDelivery.driverName} (${selectedDelivery.driverPhone})...`, "info")}
            className="px-3.5 py-2 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-extrabold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hubungi</span>
          </button>
        </div>

        {/* Timeline Tracking Steps */}
        <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5">
          <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
            Tahapan Pengiriman Pasokan
          </h3>

          <div className="space-y-4 relative pl-3 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {selectedDelivery.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 relative z-10">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                    step.current
                      ? "bg-[#0F4C25] text-white ring-4 ring-emerald-100"
                      : step.done
                      ? "bg-[#0F4C25] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.done && !step.current ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <h4
                    className={`text-xs font-extrabold ${
                      step.current
                        ? "text-[#0F4C25]"
                        : step.done
                        ? "text-[#1A1C19]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-medium block">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Confirm Button */}
        {!selectedDelivery.isCompleted && (
          <button
            type="button"
            disabled={confirmingId === selectedDelivery.orderId}
            onClick={() => handleConfirmReceived(selectedDelivery)}
            className="w-full h-12 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-xs cursor-pointer disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{confirmingId === selectedDelivery.orderId ? "Memproses..." : "Konfirmasi Pasokan Telah Diterima"}</span>
          </button>
        )}

        <Snackbar snackbar={snackbar} onDismiss={dismissSnackbar} />
      </div>
    );
  }

  // ================= VIEW 1: DAFTAR LIST PENGANTARAN PASOKAN =================
  const currentList = activeTab === "active" ? activeDeliveries : historyDeliveries;

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
          Lacak Pengantaran Pasokan
        </h1>
        <p className="text-xs font-bold text-gray-500">
          Daftar Pengiriman Real-Time & Riwayat Hasil Panen Petani
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "active"
              ? "bg-[#0F4C25] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span>Pengiriman Aktif ({activeDeliveries.length})</span>
          {activeDeliveries.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-[#0F4C25] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Riwayat Pengantaran ({historyDeliveries.length})
        </button>
      </div>

      {/* Delivery Cards List */}
      {loading && (
        <div className="space-y-3.5">
          {[0, 1].map((n) => (
            <div
              key={n}
              className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded-full w-1/3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-[28px] p-6 text-center space-y-3">
          <Package className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-xs font-bold text-rose-700">{error}</p>
          <button
            type="button"
            onClick={loadDeliveries}
            className="h-10 px-4 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl text-[11px] cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && currentList.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-[28px] p-8 text-center space-y-2">
          <p className="text-sm font-black text-[#1A1C19]">
            Tidak ada pengantaran {activeTab === "active" ? "aktif" : "riwayat"}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {activeTab === "active"
              ? "Semua pesanan telah sampai ke tujuan. Pantau pesanan baru di marketplace."
              : "Belum ada riwayat pengantaran yang tercatat."}
          </p>
        </div>
      )}

      {!loading && !error && currentList.length > 0 && (
      <div className="space-y-3.5">
        {currentList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedDelivery(item)}
            className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3 hover:border-[#0F4C25]/40 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Top Bar: Order ID & Status Badge */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 text-xs">
              <span className="font-black text-[#1A1C19]">#{item.id}</span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 ${
                  item.isCompleted
                    ? "bg-emerald-50 text-[#0F4C25] border-emerald-100"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                {!item.isCompleted && <Truck className="w-3 h-3 text-amber-600" />}
                {item.statusText}
              </span>
            </div>

            {/* Main Delivery Info Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 p-1">
                  <Image
                    src={item.image}
                    alt={item.commodity}
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-black text-[#1A1C19] group-hover:text-[#0F4C25] transition-colors">
                    {item.commodity} ({item.qty})
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0F4C25]" />
                    <span>{item.farmer} • {item.farmLocation}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Kurir: {item.driverName} ({item.vehicle.split("(")[0].trim()})
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#0F4C25] text-gray-400 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Bottom Timeline Quick Banner */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0F4C25]" />
                <span>{item.isCompleted ? item.deliveredDate : item.eta}</span>
              </span>
              <span className="text-[#0F4C25] font-black group-hover:underline">
                Klik untuk Lacak Real-Time &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      <Snackbar snackbar={snackbar} onDismiss={dismissSnackbar} />
    </div>
  );
}
