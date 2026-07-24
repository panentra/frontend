"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";

export default function OnboardingPriceIssuePage() {
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
            src="/assets/bowo-ngeluh.png"
            alt="Bowo Ngeluh Maskot"
            width={260}
            height={260}
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto drop-shadow-sm animate-fade-in"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight mb-4 tracking-tight px-1">
          Mengapa harga komoditas sering anjlok saat panen raya?
        </h1>

        {/* Body Text */}
        <p className="text-sm sm:text-base text-[#5E635E] leading-relaxed font-normal max-w-[330px] mx-auto px-1">
          Tanpa akses informasi harga yang transparan dan pembeli yang jelas, posisi tawar petani menjadi lemah saat menjual hasil bumi.
        </p>
      </div>

      {/* Bottom Action Buttons (Kembali & Lanjut side by side) */}
      <div className="w-full max-w-[360px] mx-auto relative z-10 pb-2 mt-auto flex items-center gap-3">
        {/* Button Kembali */}
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => router.push("/onboarding/problem")}
        >
          Kembali
        </Button>

        {/* Button Lanjut */}
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => router.push("/onboarding/solution")}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
