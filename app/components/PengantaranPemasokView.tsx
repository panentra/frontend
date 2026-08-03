"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  ChevronRight,
  Package,
} from "lucide-react";
import Button from "./Button";

const ACTIVE_DELIVERY = {
  id: "ORD-8821",
  commodity: "Cabai Rawit Merah Super",
  qty: "150 kg",
  farmer: "Pak Andi Sugiharto",
  farmLocation: "Lahan Sukamaju, Lembang",
  destination: "Toko Sembako Berkah Jaya (Jl. Swadaya II No. 45, Bandung)",
  driverName: "Pak Mulyono",
  vehicle: "Pick-Up Mitsubishi L300 (D 8892 ABC)",
  driverPhone: "0812-3456-7890",
  eta: "35 Menit Lagi (11:15 WIB)",
  statusStep: 3, // 1: Conformed, 2: Harvested, 3: On The Way, 4: Delivered
  steps: [
    { title: "Pesanan Dikonfirmasi Petani", time: "08:30 WIB", done: true },
    { title: "Hasil Panen Dipetik & Dikemas", time: "09:15 WIB", done: true },
    { title: "Kurir Dalam Perjalanan ke Toko", time: "Sedang Berlangsung", done: true, current: true },
    { title: "Pasokan Sampai di Gudang Toko", time: "Estimasi 11:15 WIB", done: false },
  ],
};

const COMPLETED_DELIVERIES = [
  {
    id: "ORD-8819",
    commodity: "Pakcoy Hydroponic Grade A",
    qty: "80 kg",
    farmer: "Pak Dadang",
    deliveredDate: "Kemarin, 15:40 WIB",
    status: "Sampai & Selesai",
  },
  {
    id: "ORD-8812",
    commodity: "Tomat Red Super",
    qty: "200 kg",
    farmer: "Kelompok Tani Ciwidey",
    deliveredDate: "1 Agustus 2026",
    status: "Sampai & Selesai",
  },
];

export default function PengantaranPemasokView() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <Truck className="w-6 h-6 text-[#1B5E20]" />
          Lacak Pengantaran Pasokan
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Pelacakan Real-Time Status Pengiriman Hasil Panen dari Petani
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "active"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span>Pengiriman Aktif</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Riwayat Pengantaran ({COMPLETED_DELIVERIES.length})
        </button>
      </div>

      {activeTab === "active" ? (
        <div className="space-y-4">
          {/* Live Delivery Map Visual Card */}
          <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase text-emerald-100 border border-white/20 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-emerald-300 animate-spin" />
                Live GPS Tracking
              </span>
              <span className="text-xs font-black text-emerald-200">
                ETA: {ACTIVE_DELIVERY.eta}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight text-white">
                {ACTIVE_DELIVERY.commodity} ({ACTIVE_DELIVERY.qty})
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                Petani: {ACTIVE_DELIVERY.farmer} • {ACTIVE_DELIVERY.farmLocation}
              </p>
            </div>

            {/* Simulated Live Route Progress Bar */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  Lahan Lembang
                </span>
                <span className="text-amber-300 animate-pulse">
                  Dalam Perjalanan (65%)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  Toko Berkah Jaya
                </span>
              </div>

              <div className="w-full h-3 bg-black/20 rounded-full p-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full w-[65%] transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Driver & Vehicle Info Card */}
          <div className="bg-white rounded-[24px] p-4 border border-[#E1E4E0] shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1B5E20] font-black shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[#1A1C19]">
                  {ACTIVE_DELIVERY.driverName}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  {ACTIVE_DELIVERY.vehicle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Menghubungi Driver ${ACTIVE_DELIVERY.driverName} (${ACTIVE_DELIVERY.driverPhone})...`)}
              className="px-3 py-2 bg-[#1B5E20] hover:bg-[#154D1A] text-white rounded-xl font-extrabold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi</span>
            </button>
          </div>

          {/* Timeline Tracking Steps */}
          <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E1E4E0] shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold text-[#1A1C19] uppercase tracking-wider">
              Tahapan Pengiriman Pasokan
            </h3>

            <div className="space-y-4 relative pl-3 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {ACTIVE_DELIVERY.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative z-10">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      step.current
                        ? "bg-[#1B5E20] text-white ring-4 ring-emerald-100 animate-bounce"
                        : step.done
                        ? "bg-[#1B5E20] text-white"
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
                          ? "text-[#1B5E20]"
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
        </div>
      ) : (
        <div className="space-y-3">
          {COMPLETED_DELIVERIES.map((del) => (
            <div
              key={del.id}
              className="bg-white rounded-[22px] p-4 border border-[#E1E4E0] shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#1B5E20]">{del.id}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-extrabold">
                  {del.status}
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className="font-extrabold text-[#1A1C19]">
                  {del.commodity} ({del.qty})
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Petani: {del.farmer} • Diterima: {del.deliveredDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
