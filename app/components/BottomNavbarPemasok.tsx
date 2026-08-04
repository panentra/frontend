"use client";

import React, { useState, useEffect } from "react";
import { Home, TrendingUp, ShoppingBag, Truck, User } from "lucide-react";

interface BottomNavbarPemasokProps {
  activeTab?: "beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun";
  onTabChange?: (tab: "beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun") => void;
  onPlusClick?: () => void;
}

export default function BottomNavbarPemasok({
  activeTab = "beranda",
  onTabChange,
  onPlusClick,
}: BottomNavbarPemasokProps) {
  const [isBodyLocked, setIsBodyLocked] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      setIsBodyLocked(document.body.style.overflow === "hidden");
    };

    checkOverflow();

    const observer = new MutationObserver(checkOverflow);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);

  const handleSelect = (tab: "beranda" | "pasar" | "jualbeli" | "pengantaran" | "akun") => {
    if (tab === "jualbeli" && onPlusClick) {
      onPlusClick();
      return;
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Hide bottom navbar completely when any modal/popup is open
  if (isBodyLocked) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-2 py-2 flex justify-between items-center z-30">
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

      {/* 2. Pasaran Harga */}
      <button
        type="button"
        onClick={() => handleSelect("pasar")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "pasar" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <TrendingUp className={`w-5 h-5 ${activeTab === "pasar" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Pasaran</span>
      </button>

      {/* 3. Marketplace Panen */}
      <button
        type="button"
        onClick={() => handleSelect("jualbeli")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          activeTab === "jualbeli" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag className={`w-5 h-5 ${activeTab === "jualbeli" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Marketplace</span>
      </button>

      {/* 4. Lacak Pengantaran */}
      <button
        type="button"
        onClick={() => handleSelect("pengantaran")}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
          activeTab === "pengantaran" ? "text-[#0F4C25]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <div className="relative">
          <Truck className={`w-5 h-5 ${activeTab === "pengantaran" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider mt-1">Pengantaran</span>
      </button>

      {/* 5. Akun */}
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
