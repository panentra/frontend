"use client";

import React from "react";
import { Home, Calendar, Plus, ShoppingBag, User } from "lucide-react";

interface BottomNavbarProps {
  activeTab?: "beranda" | "kalender" | "jual" | "pesanan" | "akun";
  onTabChange?: (tab: "beranda" | "kalender" | "jual" | "pesanan" | "akun") => void;
  onPlusClick?: () => void;
}

export default function BottomNavbar({
  activeTab = "beranda",
  onTabChange,
  onPlusClick,
}: BottomNavbarProps) {
  const handleSelect = (tab: "beranda" | "kalender" | "jual" | "pesanan" | "akun") => {
    if (tab === "jual" && onPlusClick) {
      onPlusClick();
      return;
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[420px] bg-white/90 backdrop-blur-md border border-white/60 rounded-full shadow-xl shadow-green-950/10 px-3 py-2 flex justify-between items-center z-50">
      {/* 1. Beranda */}
      <button
        type="button"
        onClick={() => handleSelect("beranda")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "beranda" ? "text-[#1B5E20]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === "beranda" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] font-bold mt-0.5">Beranda</span>
      </button>

      {/* 2. Kalender */}
      <button
        type="button"
        onClick={() => handleSelect("kalender")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "kalender" ? "text-[#1B5E20]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Calendar className={`w-5 h-5 ${activeTab === "kalender" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] font-bold mt-0.5">Kalender</span>
      </button>

      {/* 3. Elevated Center Green Plus Action Button */}
      <div className="relative -top-5 px-1">
        <button
          type="button"
          onClick={() => handleSelect("jual")}
          title="Input Penjualan / Jual Hasil Panen"
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#4CAF50] text-white flex items-center justify-center shadow-lg shadow-green-800/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-[#F7F9F7]"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* 4. Pesanan */}
      <button
        type="button"
        onClick={() => handleSelect("pesanan")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "pesanan" ? "text-[#1B5E20]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag className={`w-5 h-5 ${activeTab === "pesanan" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] font-bold mt-0.5">Pesanan</span>
      </button>

      {/* 5. Akun */}
      <button
        type="button"
        onClick={() => handleSelect("akun")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "akun" ? "text-[#1B5E20]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <User className={`w-5 h-5 ${activeTab === "akun" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[10px] font-bold mt-0.5">Akun</span>
      </button>
    </nav>
  );
}
