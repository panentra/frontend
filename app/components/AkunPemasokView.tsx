"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Store,
  Wallet,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Settings,
  ChevronRight,
  HelpCircle,
  FileText,
  LogOut,
  ShoppingBag,
  Star,
  RefreshCw,
  PlusCircle,
  Download,
  CreditCard,
  Sprout,
  CheckCircle2,
} from "lucide-react";

interface AkunPemasokViewProps {
  onNavigateToHistory?: () => void;
  onNavigateToPetani?: () => void;
}

export default function AkunPemasokView({
  onNavigateToHistory,
  onNavigateToPetani,
}: AkunPemasokViewProps) {
  const router = useRouter();

  // Favorite Farmers List (Section 4)
  const [favoriteFarmers] = useState([
    {
      id: 1,
      name: "Pak Andi Sugiharto",
      location: "Lahan Sukamaju, Lembang",
      rating: 4.9,
      commodity: "Cabai Rawit Merah",
      image: "/assets/bowo-senang.png",
    },
    {
      id: 2,
      name: "Ibu Sri Rahayu",
      location: "Desa Karanganyar, Ciwidey",
      rating: 5.0,
      commodity: "Pakcoy Hydroponic",
      image: "/assets/budi-kaget.png",
    },
  ]);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Pemasok Panentra?")) {
      router.push("/login");
    }
  };

  const handleSwitchToPetani = () => {
    if (onNavigateToPetani) {
      onNavigateToPetani();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#0F4C25]" />
          Manajemen Akun Pemasok
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Profil Usaha Pembeli, Deposit Panentra Pay & Reputasi
        </p>
      </div>

      {/* ================= 1. HEADER PROFIL & REPUTASI PEMASOK ================= */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-4 sm:p-5 border border-gray-200 flex items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 p-1 shrink-0 border-2 border-[#0F4C25] shadow-sm overflow-hidden relative flex items-center justify-center">
          <Store className="w-8 h-8 text-[#0F4C25]" />
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-black text-[#1A1C19] truncate">Toko Sembako Berkah Jaya</h2>
            <ShieldCheck className="w-4 h-4 text-[#0F4C25] shrink-0" />
          </div>
          <p className="text-xs text-[#0F4C25] font-bold">Terverifikasi (NIB / KTP Panentra Verified)</p>

          <div className="flex items-center gap-2 text-[11px] font-medium pt-0.5">
            <span className="flex items-center gap-1 text-amber-600 font-extrabold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              ⭐ 4.9 / 5.0 (Reputasi Pembeli)
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. SALDO PANENTRA PAY & DEPOSIT ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
              Saldo Panentra Pay Pemasok
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Rp 24.500.000
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => alert("Top Up Saldo Panentra Pay Pemasok")}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              Top Up
            </button>
            <button
              type="button"
              onClick={() => alert("Tarik Saldo ke Rekening Bank")}
              className="px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              Tarik
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div>
            <span className="text-[10px] text-emerald-200 block font-medium">Belanja Bulan Ini</span>
            <span className="font-extrabold text-white text-xs">Rp 32.800.000</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 block font-medium">Total Transaksi</span>
            <span className="font-extrabold text-amber-300 text-xs">48 Pasokan Selesai</span>
          </div>
        </div>
      </div>

      {/* ================= 3. RINGKASAN PESANAN AKTIF & RIWAYAT ================= */}
      <div className="bg-white rounded-[28px] p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
            Ringkasan Pesanan & Transaksi
          </h3>
          {onNavigateToHistory && (
            <button
              type="button"
              onClick={onNavigateToHistory}
              className="text-[11px] font-bold text-[#0F4C25] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          )}
        </div>

        <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold text-[#1A1C19] block">1 Pesanan Sedang Dikirim</span>
            <span className="text-[10px] text-gray-500">Cabai Rawit Merah (150 kg) • Pak Andi Sugiharto</span>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-extrabold">
            Dalam Perjalanan
          </span>
        </div>
      </div>

      {/* ================= 4. PETANI LANGGANAN (FAVORIT) ================= */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
          Petani Langganan (Mitra Favorit)
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {favoriteFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-[22px] p-3 border border-gray-200 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-[#1A1C19] truncate">{farmer.name}</h4>
                  <span className="text-[9px] text-gray-500 block truncate">{farmer.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                <span className="font-bold text-[#0F4C25]">{farmer.commodity}</span>
                <span className="text-amber-600 font-extrabold">⭐ {farmer.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 5. PENGATURAN & AKSES PERAN ================= */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pengaturan & Akses Peran
        </h3>

        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          {/* Dual Role Switcher Button */}
          <button
            type="button"
            onClick={handleSwitchToPetani}
            className="w-full p-3.5 flex items-center justify-between hover:bg-emerald-50/50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sprout className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Daftar / Masuk Sebagai Petani</span>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-[#0F4C25] px-2 py-0.5 rounded-full">
              Switch Role
            </span>
          </button>

          <button
            type="button"
            onClick={() => alert("Kelola Rekening Bank / E-Wallet Pembayaran")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-bold text-[#1A1C19]">Kelola Rekening Bank & E-Wallet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Unduh Rekap Laporan Pembelian Pasokan (PDF/Excel)")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-bold text-[#1A1C19]">Unduh Laporan Pembelian (PDF)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Menghubungi Pusat Bantuan AI Panentra 24/7...")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-bold text-[#1A1C19]">Pusat Bantuan & Support AI 24/7</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* ================= 6. LOGOUT ================= */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-12 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Keluar Akun Pemasok (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
