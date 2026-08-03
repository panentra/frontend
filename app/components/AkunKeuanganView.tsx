"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Settings,
  ChevronRight,
  HelpCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  LogOut,
  Edit2,
  Sprout,
  Coins,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";
import Button from "./Button";

const EXPENSE_HISTORY = [
  { id: 1, title: "Bibit Cabai Unggul (10 Pack)", category: "Bibit", amount: "Rp 150.000", date: "25 Juli 2026" },
  { id: 2, title: "Pupuk NPK 16-16-16 (50kg)", category: "Pupuk", amount: "Rp 480.000", date: "28 Juli 2026" },
  { id: 3, title: "Pestisida Organik Neem (2L)", category: "Obat", amount: "Rp 120.000", date: "30 Juli 2026" },
  { id: 4, title: "Upah Buruh Olah Lahan (2 Hari)", category: "Tenaga Kerja", amount: "Rp 300.000", date: "1 Agustus 2026" },
];

export default function AkunKeuanganView() {
  const router = useRouter();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Pupuk");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState(EXPENSE_HISTORY);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Panentra?")) {
      router.push("/login");
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    const newExp = {
      id: Date.now(),
      title: expenseTitle,
      category: expenseCategory,
      amount: `Rp ${parseInt(expenseAmount).toLocaleString("id-ID")}`,
      date: "Hari Ini",
    };

    setExpenses([newExp, ...expenses]);
    setShowExpenseModal(false);
    setExpenseTitle("");
    setExpenseAmount("");
    alert("Pengeluaran produksi berhasil dicatat & HPP otomatis diperbarui!");
  };

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* ================= 1. HEADER PROFILE HERO CARD (MATCHING REFERENCE IMAGE 2) ================= */}
      <div className="rounded-[32px] overflow-hidden border border-emerald-900/10 shadow-xl bg-white">
        {/* Forest Green Header */}
        <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] p-6 text-white text-center relative flex flex-col items-center justify-center min-h-[160px]">
          {/* Edit Pencil Button Top Right */}
          <button
            type="button"
            onClick={() => alert("Edit Profil Petani & Lahan")}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all cursor-pointer"
            title="Edit Profil"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Centered Avatar Image Circle */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-white shadow-lg overflow-hidden relative mb-2 p-0.5">
            <Image
              src="/assets/bowo-senang.png"
              alt="Profil Andi Sugiharto"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
            Andi Sugiharto <ShieldCheck className="w-4 h-4 text-emerald-300" />
          </h2>
          <span className="text-xs font-bold text-emerald-200">
            Lahan Kelompok Tani Mandiri (1,5 Ha)
          </span>
        </div>

        {/* Info Grid Card (Matching Image 2 details) */}
        <div className="p-4 sm:p-5 bg-white space-y-3 divide-y divide-gray-100 text-xs">
          <div className="flex justify-between items-center pt-1">
            <span className="font-bold text-gray-500">Lokasi Lahan</span>
            <span className="font-black text-[#1A1C19] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C25]" /> Lembang, Kab. Bandung Barat
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-gray-500">Komoditas Aktif</span>
            <span className="font-black text-[#0F4C25] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🌶️ Cabai Rawit Merah
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-gray-500">Status Panen</span>
            <span className="font-black text-[#1A1C19]">Hari Ke-68 / 90 Hari</span>
          </div>
        </div>
      </div>

      {/* ================= 2. REKAP SALDO & KEUANGAN ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">
              Saldo Rekening Panentra Pay
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              Rp 14.850.000
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert("Fitur Penarikan Saldo Panentra Pay ke Bank / E-Wallet")}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            Tarik Saldo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-medium">Pendapatan Omset</span>
              <span className="font-black text-white text-xs">Rp 18.250.000</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-400/20 flex items-center justify-center text-red-300">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-medium">Total Biaya Produksi</span>
              <span className="font-black text-white text-xs">Rp 1.050.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. PENGELOLAAN TANI ("MANAGE" - MATCHING IMAGE 2) ================= */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
          Pengelolaan Tani (Manage)
        </h2>

        {/* Reset / Adjust Goals Card */}
        <button
          type="button"
          onClick={() => alert("Atur Ulang Target & Musim Tanam Baru")}
          className="w-full bg-[#EBF7EE] border border-emerald-200/80 hover:border-emerald-400 rounded-[28px] p-4 flex items-center justify-between text-left cursor-pointer group relative overflow-hidden transition-all shadow-sm"
        >
          <div className="space-y-0.5 max-w-[68%] z-10">
            <h3 className="text-sm font-black text-[#111827]">
              Atur Ulang Target & Musim Tanam
            </h3>
            <p className="text-xs text-gray-600 font-medium leading-tight">
              Sesuaikan target hasil panen & komoditas musim depan
            </p>
          </div>

          <div className="w-20 h-20 shrink-0 relative -mr-2 -mb-2 pointer-events-none">
            <Image
              src="/assets/bowo-tanam.png"
              alt="Atur Target Tanam"
              width={80}
              height={80}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
        </button>
      </section>

      {/* ================= 4. CATATAN PENGELUARAN PRODUKSI (HPP) ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1C19]">
            Pencatatan Biaya Produksi (HPP)
          </h3>
          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="text-xs font-black text-[#0F4C25] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
          >
            <PlusCircle className="w-4 h-4" />
            Catat Biaya
          </button>
        </div>

        <div className="space-y-2">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <h4 className="font-black text-[#1A1C19]">{exp.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] rounded-md font-extrabold border border-emerald-100">
                    {exp.category}
                  </span>
                  <span>{exp.date}</span>
                </div>
              </div>

              <span className="font-black text-red-600 text-xs">
                - {exp.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. PENGATURAN & BANTUAN ================= */}
      <section className="space-y-2 pt-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pengaturan & Akses Peran
        </h3>

        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => alert("Ganti mode ke Dashboard Pemasok/Pembeli")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Ganti Peran ke Dashboard Pemasok</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Unduh Rekap Laporan Keuangan HPP (PDF/Excel)")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Unduh Laporan Keuangan Tani (PDF)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Menghubungi Pusat Bantuan Panentra AI")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Pusat Bantuan & AI Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* STANDALONE PROMINENT LIGHT RED LOGOUT BUTTON (EXACTLY LIKE REFERENCE IMAGE 2) */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-12 bg-[#FFF5F5] hover:bg-red-100 border border-red-200 text-red-600 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </section>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-[32px] p-5 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="text-sm font-black text-[#1A1C19]">
              Catat Biaya Produksi (HPP)
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-black text-gray-700 block mb-1">Kategori Biaya</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                >
                  <option value="Pupuk">Pupuk & Nutrisi</option>
                  <option value="Bibit">Bibit & Benih</option>
                  <option value="Obat">Obat & Pestisida</option>
                  <option value="Tenaga Kerja">Tenaga Kerja / Upah Harian</option>
                  <option value="Peralatan">Peralatan & Transportasi</option>
                </select>
              </div>

              <div>
                <label className="font-black text-gray-700 block mb-1">Deskripsi Item</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembelian Pupuk KCL 25kg"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                  required
                />
              </div>

              <div>
                <label className="font-black text-gray-700 block mb-1">Nominal Biaya (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 250000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 justify-center"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1 justify-center"
                >
                  Simpan Biaya
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
