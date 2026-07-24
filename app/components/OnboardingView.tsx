"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OnboardingView() {
  return (
    <div className="w-full min-h-screen panentra-grid-bg text-[#1A1C19] flex flex-col justify-between p-6 relative overflow-hidden select-none bg-gradient-to-b from-[#EBF5EC]/50 via-transparent to-[#E2F0E5]/60">
      {/* Decorative Organic Subtle Green Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF50]/8 via-transparent to-[#1B5E20]/10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B5E20]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top / Middle Content Header */}
      <div className="w-full max-w-[360px] mx-auto relative z-10 flex flex-col items-center text-center space-y-7 my-auto pt-6">
        {/* Brand Logo */}
        <div>
          <Image
            src="/assets/logo.png"
            alt="Panentra Logo"
            width={250}
            height={250}
            className="h-20 w-auto object-contain mx-auto"
            priority
          />
        </div>

        {/* Title & Description */}
        <div className="px-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight mb-3 tracking-tight">
            Panen Cerdas, Masa Depan Berkualitas
          </h1>
          <p className="text-xs sm:text-sm text-[#5E635E] leading-relaxed font-normal max-w-[300px] mx-auto">
            Platform digital yang menghubungkan petani dan pembeli untuk pertanian yang lebih efisien dan menguntungkan.
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons (Anchored at the bottom) */}
      <div className="w-full max-w-[360px] mx-auto space-y-3 relative z-10 pb-2 mt-auto">
        {/* Primary Action Button ("Mulai Sekarang" + Right Arrow inside Circle) */}
        <Link
          href="/register"
          className="w-full h-14 bg-[#1B5E20] hover:bg-[#2E7D32] active:scale-[0.99] text-white font-bold text-sm rounded-full shadow-lg shadow-[#1B5E20]/25 flex items-center justify-between px-6 transition-all cursor-pointer group"
        >
          <span className="text-base font-semibold">Mulai Sekarang</span>
          <div className="w-8 h-8 rounded-full bg-white text-[#1B5E20] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </Link>

        {/* Secondary Action Button ("Masuk ke Akun") */}
        <Link
          href="/login"
          className="w-full h-14 bg-white/70 hover:bg-white border border-[#1B5E20]/30 active:scale-[0.99] text-[#1B5E20] font-bold text-sm rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs"
        >
          <span className="text-base font-semibold">Masuk ke Akun</span>
        </Link>
      </div>
    </div>
  );
}
