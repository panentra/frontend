"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import Button from "./Button";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "register" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"petani" | "pemasok">("petani");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(initialMode);
  }, [initialMode]);

  // Form Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Password Visibility Toggle States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "register" && !name) {
      setErrorMessage("Silakan masukkan Nama.");
      return;
    }
    if (!email) {
      setErrorMessage("Silakan masukkan Email.");
      return;
    }
    if (!password) {
      setErrorMessage("Silakan masukkan Password.");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setErrorMessage("Konfirmasi Password tidak cocok.");
      return;
    }
    if (mode === "register" && !agreedToPolicy) {
      setErrorMessage("Anda harus menyetujui Kebijakan Privasi.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === "login") {
        setSuccessMessage(`Selamat datang kembali di Panentra!`);
        const targetRoute = role === "petani" ? "/dashboard" : "/pemasok/dashboard";
        setTimeout(() => router.push(targetRoute), 1200);
      } else {
        setSuccessMessage(`Pendaftaran ${role === "petani" ? "Petani" : "Pemasok"} berhasil!`);
        const targetRoute = role === "petani" ? "/onboarding/problem" : "/onboarding/pemasok/1";
        setTimeout(() => router.push(targetRoute), 1200);
      }
    }, 800);
  };

  // Dynamic Copywriting Subtitle based on Mode and Role
  const getCopywritingSubtitle = () => {
    if (mode === "login") {
      return role === "petani"
        ? "Kelola hasil panen & perluas jangkauan pasar pertanianmu."
        : "Temukan komoditas panen segar terbaik langsung dari petani.";
    } else {
      return role === "petani"
        ? "Gabung ekosistem Panentra & jual hasil panen dengan harga terbaik."
        : "Gabung sebagai mitra pembeli & dapatkan suplai komoditas terpercaya.";
    }
  };

  const copySubtitle = getCopywritingSubtitle();

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-5 my-auto min-h-screen relative overflow-hidden select-none bg-gradient-to-b from-[#F2F8F3] to-[#E8F3EA]">
      {/* Subtle Ambient Light Overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B5E20]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* OUTSIDE Logo & Brand Header */}
      <div className="flex flex-col items-center text-center mb-5 relative z-10 px-4">
        <div className="flex items-center justify-center gap-2.5 mb-1.5">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Panentra Logo"
              width={300}
              height={30}
              className="h-15 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#1B5E20] tracking-tight max-w-[300px] leading-relaxed">
          {copySubtitle}
        </p>
      </div>

      {/* Main Form Box Container */}
      <div className="w-full max-w-[360px] bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_15px_45px_-12px_rgba(27,94,32,0.12)] border border-[#E1E4E0] flex flex-col items-center relative z-10">
        {/* Role Switcher (Petani vs Pemasok) */}
        <div className="w-full bg-[#E5E7E5] p-1 rounded-2xl flex items-center mb-5">
          <button
            type="button"
            onClick={() => setRole("petani")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
              role === "petani"
                ? "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            Petani
          </button>
          <button
            type="button"
            onClick={() => setRole("pemasok")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
              role === "pemasok"
                ? "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            Pemasok
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="w-full mb-3 p-2.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="w-full mb-3 p-2.5 bg-green-50 border border-green-200 rounded-2xl text-[#1B5E20] text-xs text-center font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
            {successMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {/* Register: Nama */}
          {mode === "register" && (
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Masukkan Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#F3F4F6] border border-transparent focus:border-[#1B5E20]/40 focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F3F4F6] border border-transparent focus:border-[#1B5E20]/40 focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 bg-[#F3F4F6] border border-transparent focus:border-[#1B5E20]/40 focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] focus:outline-none p-1 cursor-pointer"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Register: Konfirmasi Password */}
          {mode === "register" && (
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ketik Ulang Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-11 bg-[#F3F4F6] border border-transparent focus:border-[#1B5E20]/40 focus:bg-white rounded-2xl text-xs text-[#111827] font-medium placeholder:text-[#9CA3AF] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] focus:outline-none p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Register: Privacy Policy Checkbox */}
          {mode === "register" && (
            <div className="flex items-center gap-2.5 pt-1 px-1">
              <input
                type="checkbox"
                id="privacyPolicy"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="w-4 h-4 accent-[#1B5E20] rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="privacyPolicy" className="text-xs text-[#4B5563] cursor-pointer">
                Saya menyetujui{" "}
                <span className="text-[#1B5E20] font-semibold underline">
                  Kebijakan Privasi
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" isLoading={isLoading} className="mt-2">
            {mode === "register" ? "Daftar" : "Masuk"}
          </Button>
        </form>

        {/* Switch Link */}
        <div className="mt-4 text-center text-xs font-bold text-[#111827]">
          {mode === "register" ? (
            <span>
              Sudah punya Akun?{" "}
              <Link
                href="/login"
                onClick={() => setMode("login")}
                className="text-[#1B5E20] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Masuk Disini
              </Link>
            </span>
          ) : (
            <span>
              Belum punya Akun?{" "}
              <Link
                href="/register"
                onClick={() => setMode("register")}
                className="text-[#1B5E20] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Daftar Disini
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
