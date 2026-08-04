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

  // Favorite Farmers List
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
      location: "Ciwidey, Kab. Bandung",
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
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight">
          Manajemen Akun Pemasok
        </h1>
        <p className="text-xs font-bold text-gray-500">
          Profil Usaha Pembeli, Rekapitulasi Keuangan & Reputasi
        </p>
      </div>

      {/* ================= 1. HEADER PROFIL & REPUTASI PEMASOK ================= */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-5 border border-gray-200 flex items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-[#0F4C25] shadow-2xs">
          <Store className="w-7 h-7" />
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-black text-[#1A1C19] truncate">Toko Sembako Berkah Jaya</h2>
            <ShieldCheck className="w-4 h-4 text-[#0F4C25] shrink-0" />
          </div>
          <p className="text-xs text-[#0F4C25] font-bold">Terverifikasi (NIB / KTP Panentra Verified)</p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-amber-900 font-black bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-xs shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>4.9 / 5.0 (Reputasi Pembeli)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. REKAPITULASI KEUANGAN & PEMBELIAN ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
            Anggaran Pembelian Pasokan
          </span>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Rp 24.500.000
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => alert("Menampilkan Rekapitulasi Keuangan Pembelian...")}
            className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rekap Keuangan</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Fitur Tambah Metode Pembayaran Petani / Pemasok")}
            className="h-10 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Metode Pembayaran</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-200/90 block font-medium">Belanja Bulan Ini</span>
            <span className="font-extrabold text-white text-xs sm:text-sm">Rp 32.800.000</span>
          </div>
          <div className="space-y-0.5 border-l border-white/15 pl-3">
            <span className="text-[10px] text-emerald-200/90 block font-medium">Total Transaksi</span>
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm">48 Pasokan Selesai</span>
          </div>
        </div>
      </div>

      {/* ================= 3. RINGKASAN PESANAN AKTIF & RIWAYAT ================= */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5">
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
              Lihat Semua &rarr;
            </button>
          )}
        </div>

        <div className="p-3.5 bg-[#F8FAF8] rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="font-black text-[#1A1C19] block truncate">1 Pesanan Sedang Dikirim</span>
            <span className="text-[10px] text-gray-500 font-medium truncate block">
              Cabai Rawit Merah (150 kg) • Pak Andi Sugiharto
            </span>
          </div>

          <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[10px] font-black shrink-0 whitespace-nowrap">
            Dalam Perjalanan
          </span>
        </div>
      </div>

      {/* ================= 4. PETANI LANGGANAN (FAVORIT) ================= */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
          Petani Langganan (Mitra Favorit)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {favoriteFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-[24px] p-3.5 border border-gray-200 shadow-sm space-y-2.5 text-xs hover:border-[#0F4C25]/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-black text-[#1A1C19] truncate leading-tight">{farmer.name}</h4>
                  <span className="text-[9px] text-gray-500 font-semibold block truncate">{farmer.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px]">
                <span className="font-black text-[#0F4C25] truncate">{farmer.commodity}</span>
                <span className="text-amber-600 font-black shrink-0 ml-1">⭐ {farmer.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 5. PENGATURAN & AKSES PERAN ================= */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pengaturan & Akses Peran
        </h3>

        <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          {/* Dual Role Switcher Button */}
          <button
            type="button"
            onClick={handleSwitchToPetani}
            className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sprout className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Daftar / Masuk Sebagai Petani</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-[#0F4C25] px-2.5 py-1 rounded-full border border-emerald-200">
              Switch Role
            </span>
          </button>

          <button
            type="button"
            onClick={() => alert("Kelola Rekening Bank / E-Wallet Pembayaran")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Kelola Rekening Bank & E-Wallet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Unduh Rekap Laporan Pembelian Pasokan (PDF/Excel)")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Unduh Laporan Pembelian (PDF)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Menghubungi Pusat Bantuan AI Panentra 24/7...")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Pusat Bantuan & Support AI 24/7</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* ================= 6. LOGOUT ================= */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-12 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-2xs text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Keluar Akun Pemasok (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
