"use client";

import React from "react";
import { Home, Calendar, ShoppingBag, User } from "lucide-react";

interface BottomNavbarProps {
  activeTab?: "beranda" | "kalender" | "jual" | "pesanan" | "akun";
  onTabChange?: (tab: any) => void;
}

export default function BottomNavbar({
  activeTab = "beranda",
  onTabChange,
}: BottomNavbarProps) {
  const handleSelect = (tab: "beranda" | "kalender" | "pesanan" | "akun") => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-200 shadow-2xl px-3 py-2 flex justify-between items-center z-40">
      {/* 1. Beranda */}
      <button
        type="button"
        onClick={() => handleSelect("beranda")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "beranda" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === "beranda" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Beranda</span>
      </button>

      {/* 2. Kalender */}
      <button
        type="button"
        onClick={() => handleSelect("kalender")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "kalender" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Calendar className={`w-5 h-5 ${activeTab === "kalender" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Kalender</span>
      </button>

      {/* 3. Pesanan */}
      <button
        type="button"
        onClick={() => handleSelect("pesanan")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "pesanan" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag className={`w-5 h-5 ${activeTab === "pesanan" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Pesanan</span>
      </button>

      {/* 4. Akun */}
      <button
        type="button"
        onClick={() => handleSelect("akun")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "akun" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <User className={`w-5 h-5 ${activeTab === "akun" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Akun</span>
      </button>
    </nav>
  );
}
