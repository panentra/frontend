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
} from "lucide-react";
import Button from "./Button";

export default function AkunPemasokView() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Pemasok Panentra?")) {
      router.push("/login");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#1B5E20]" />
          Akun & Usaha Pemasok
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Profil Usaha Pembeli, Saldo Deposit & Pengaturan Mitra
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-4 sm:p-5 border border-[#E1E4E0] flex items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 p-1 shrink-0 border-2 border-[#1B5E20] shadow-sm overflow-hidden relative flex items-center justify-center">
          <Store className="w-8 h-8 text-[#1B5E20]" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-extrabold text-[#1A1C19]">Toko Sembako Berkah Jaya</h2>
            <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
          </div>
          <p className="text-xs text-[#1B5E20] font-bold">Mitra Pembeli Terverifikasi Panentra</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
            <MapPin className="w-3 h-3 text-[#1B5E20]" />
            <span>Kec. Lembang, Kab. Bandung Barat</span>
          </div>
        </div>
      </div>

      {/* Financial Deposit Card */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
              Saldo Deposit Pembelian Panentra
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              Rp 24.500.000
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert("Fitur Isi Ulang Saldo Deposit Pemasok")}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            Top Up Deposit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div>
            <span className="text-[10px] text-emerald-200 block font-medium">Pembelian Pasokan Bulan Ini</span>
            <span className="font-extrabold text-white text-xs">Rp 32.800.000</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 block font-medium">Hemat Langsung Lahan</span>
            <span className="font-extrabold text-amber-300 text-xs">Rp 6.450.000</span>
          </div>
        </div>
      </div>

      {/* General Settings Links */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
          Pengaturan & Bantuan Pemasok
        </h3>

        <div className="bg-white rounded-[24px] border border-[#E1E4E0] shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => alert("Ganti mode tampilan ke Dashboard Petani!")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Ganti Peran ke Petani</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Faktur & Rekapitulasi Pembelian Panen (PDF/Excel)")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Faktur & Invoice Pasokan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Menghubungi Layanan Support Panentra Pemasok...")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Pusat Bantuan Mitra Pemasok</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Logout Button inside settings list */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full p-3.5 flex items-center justify-between hover:bg-red-50 text-left cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-red-600">Keluar dari Akun Pemasok (Logout)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Standalone Prominent Red Logout Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-12 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
