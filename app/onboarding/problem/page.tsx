"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingProblemPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F2F8F3] to-[#E8F3EA] text-[#111827] flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden select-none">
      {/* Subtle Ambient Light Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4CAF50]/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Content (Centered) */}
      <div className="w-full max-w-[380px] mx-auto relative z-10 flex flex-col items-center text-center my-auto pt-4">
        {/* Mascot Image */}
        <div className="mb-6 relative">
          <Image
            src="/assets/bowo-bingung.png"
            alt="Bowo Bingung Maskot"
            width={260}
            height={260}
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto drop-shadow-sm animate-fade-in"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight mb-4 tracking-tight px-1">
          Mengapa hasil panen sulit diprediksi dan sering tidak maksimal?
        </h1>

        {/* Body Text */}
        <p className="text-sm sm:text-base text-[#5E635E] leading-relaxed font-normal max-w-[330px] mx-auto px-1">
          Perubahan cuaca, jadwal tanam yang kurang presisi, serta perawatan yang kurang pas sering kali membuat hasil panen tidak sesuai harapan.
        </p>
      </div>

      {/* Bottom Action Button (Anchored at the bottom) */}
      <div className="w-full max-w-[360px] mx-auto relative z-10 pb-2 mt-auto">
        <button
          onClick={() => router.push("/onboarding/price-issue")}
          className="w-full h-14 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-95 text-white font-bold text-base rounded-2xl shadow-lg shadow-[#1B5E20]/20 flex items-center justify-center active:scale-[0.99] transition-all cursor-pointer"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
