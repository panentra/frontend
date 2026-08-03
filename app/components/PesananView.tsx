"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  User,
  DollarSign,
  Phone,
  ArrowRight,
  Filter,
} from "lucide-react";
import Button from "./Button";

const ORDERS_DATA = [
  {
    id: "ORD-8821",
    customer: "Toko Berkah Jaya",
    customerType: "Pemasok Pasar Modern",
    item: "Cabai Rawit Merah Super",
    category: "Bahan-Bahan",
    qty: "150 kg",
    price: "Rp 35.000 / kg",
    total: "Rp 5.250.000",
    status: "incoming",
    date: "Hari Ini, 10:15 WIB",
    location: "Kec. Lembang, Bandung Barat",
    paymentStatus: "Lunas (Transfer Direct)",
    image: "/assets/bowo-senang.png",
  },
  {
    id: "ORD-8819",
    customer: "Resto Sambal Nusantara",
    customerType: "Restoran / Kuliner",
    item: "Pakcoy Hydroponic Grade A",
    category: "Sayuran",
    qty: "80 kg",
    price: "Rp 18.000 / kg",
    total: "Rp 1.440.000",
    status: "shipping",
    date: "Kemarin, 14:30 WIB",
    location: "Kota Bandung",
    paymentStatus: "Lunas (Panentra Escrow)",
    image: "/assets/budi-kaget.png",
  },
  {
    id: "ORD-8815",
    customer: "Supermarket Fresh Mart",
    customerType: "Retail Modern",
    item: "Tomat Red Super",
    category: "Bahan-Bahan",
    qty: "200 kg",
    price: "Rp 12.000 / kg",
    total: "Rp 2.400.000",
    status: "completed",
    date: "1 Agustus 2026",
    location: "Kota Cimahi",
    paymentStatus: "Selesai",
    image: "/assets/bowo-calendar.png",
  },
];

export default function PesananView() {
  const [activeFilter, setActiveFilter] = useState<"all" | "incoming" | "shipping" | "completed">("all");
  const [orders, setOrders] = useState(ORDERS_DATA);

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    alert(`Status pesanan ${id} berhasil diperbarui!`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#1B5E20]" />
          Pesanan & Penjualan Pasokan
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Kelola Pesanan Masuk & Pengiriman ke Mitra Pembeli
        </p>
      </div>

      {/* Quick Summary Stats Banner */}
      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block">Pesanan Masuk</span>
          <span className="text-base font-black text-[#1B5E20]">3 Baru</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block">Dalam Pengiriman</span>
          <span className="text-base font-black text-amber-700">2 Pasokan</span>
        </div>
        <div className="bg-[#F8FAF8] border border-gray-100 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block">Total Omset</span>
          <span className="text-base font-black text-[#1A1C19]">Rp 9,09 Jt</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeFilter === "all"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Semua ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("incoming")}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeFilter === "incoming"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("shipping")}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeFilter === "shipping"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Dikirim
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("completed")}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeFilter === "completed"
              ? "bg-[#1B5E20] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-[24px] p-4 border border-[#E1E4E0] shadow-sm space-y-3 relative overflow-hidden"
          >
            {/* Header Status & ID */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
              <span className="font-extrabold text-[#1B5E20]">{order.id}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  order.status === "incoming"
                    ? "bg-amber-100 text-amber-800"
                    : order.status === "shipping"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {order.status === "incoming"
                  ? "Pesanan Baru"
                  : order.status === "shipping"
                  ? "Dalam Pengiriman"
                  : "Selesai"}
              </span>
            </div>

            {/* Buyer & Commodity Summary */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 p-1 flex items-center justify-center shrink-0 border border-emerald-100">
                <Image
                  src={order.image}
                  alt={order.item}
                  width={44}
                  height={44}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div className="space-y-0.5 flex-1">
                <h3 className="text-sm font-extrabold text-[#1A1C19]">
                  {order.item}
                </h3>
                <p className="text-xs font-bold text-[#1B5E20]">
                  {order.customer} <span className="text-gray-400 font-normal">({order.customerType})</span>
                </p>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium pt-0.5">
                  <MapPin className="w-3 h-3 text-[#1B5E20]" />
                  <span>{order.location}</span>
                </div>
              </div>
            </div>

            {/* Price & Quantity Grid */}
            <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Jumlah Pasokan</span>
                <span className="font-extrabold text-[#1A1C19]">{order.qty}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Total Pembayaran</span>
                <span className="font-extrabold text-[#1B5E20] text-sm">{order.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              {order.status === "incoming" && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, "shipping")}
                  className="w-full justify-center text-xs"
                >
                  <Truck className="w-4 h-4 mr-1" />
                  Konfirmasi & Kirim Pasokan
                </Button>
              )}
              {order.status === "shipping" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, "completed")}
                  className="w-full justify-center text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[#1B5E20]" />
                  Tandai Pesanan Selesai
                </Button>
              )}
              {order.status === "completed" && (
                <div className="w-full py-1.5 text-center text-xs font-bold text-gray-500 bg-gray-50 rounded-xl">
                  Transaksi Selesai & Dana Dicairkan
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
