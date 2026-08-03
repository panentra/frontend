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
} from "lucide-react";
import Button from "./Button";

const EXPENSE_HISTORY = [
  { id: 1, title: "Pembelian Pupuk NPK 50kg", category: "Pupuk", amount: "Rp 480.000", date: "30 Juli 2026" },
  { id: 2, title: "Bibit Cabai Rawit Unggul 10 Pack", category: "Bibit", amount: "Rp 150.000", date: "25 Juli 2026" },
  { id: 3, title: "Upah Harian Tenaga Kerja Panen (2 Orang)", category: "Tenaga Kerja", amount: "Rp 300.000", date: "20 Juli 2026" },
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
    alert("Pengeluaran produksi berhasil dicatat!");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#1B5E20]" />
          Akun & Keuangan Petani
        </h1>
        <p className="text-xs font-semibold text-gray-500">
          Profil Lahan, Rekap Pendapatan & Pengeluaran Produksi
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-4 sm:p-5 border border-[#E1E4E0] flex items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 p-1 shrink-0 border-2 border-[#1B5E20] shadow-sm overflow-hidden relative">
          <Image
            src="/assets/bowo-senang.png"
            alt="Profil Andi Petani"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-extrabold text-[#1A1C19]">Andi Sugiharto</h2>
            <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
          </div>
          <p className="text-xs text-[#1B5E20] font-bold">Lahan Kelompok Tani Mandiri</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
            <MapPin className="w-3 h-3 text-[#1B5E20]" />
            <span>Lembang, Kab. Bandung Barat (1,5 Hektar)</span>
          </div>
        </div>
      </div>

      {/* Financial Overview Card */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
              Saldo Rekening Panentra Pay
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              Rp 14.850.000
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert("Fitur Penarikan Saldo / Cashout Bank")}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
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
              <span className="text-[10px] text-emerald-200 block font-medium">Pendapatan Bulan Ini</span>
              <span className="font-extrabold text-white text-xs">Rp 18.250.000</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-400/20 flex items-center justify-center text-red-300">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-medium">Pengeluaran Produksi</span>
              <span className="font-extrabold text-white text-xs">Rp 3.400.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Expense Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#1A1C19]">
            Pencatatan Pengeluaran Produksi
          </h3>
          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="text-xs font-extrabold text-[#1B5E20] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Catat Pengeluaran
          </button>
        </div>

        <div className="space-y-2">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-[#1A1C19]">{exp.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span className="px-2 py-0.5 bg-gray-100 rounded-md font-bold text-gray-600">
                    {exp.category}
                  </span>
                  <span>{exp.date}</span>
                </div>
              </div>

              <span className="font-extrabold text-red-600 text-xs">
                - {exp.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings Links */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
          Pengaturan & Bantuan
        </h3>

        <div className="bg-white rounded-[24px] border border-[#E1E4E0] shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => alert("Ganti mode tampilan ke Dashboard Pemasok!")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Ganti Peran ke Pemasok / Pembeli</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Laporan Rekapitulasi Keuangan Tani (PDF/Excel)")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Laporan Keuangan & Pajak Tani</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Menghubungi Tim Support Panentra AI...")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-extrabold text-[#1A1C19]">Pusat Bantuan & Layanan AI</span>
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
              <span className="font-extrabold text-red-600">Keluar dari Akun (Logout)</span>
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

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-[28px] p-5 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="text-sm font-extrabold text-[#1A1C19]">
              Input Pengeluaran Produksi
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Kategori Pengeluaran</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#1B5E20]"
                >
                  <option value="Pupuk">Pupuk & Nutrisi</option>
                  <option value="Bibit">Bibit & Benih</option>
                  <option value="Tenaga Kerja">Tenaga Kerja / Upah Harian</option>
                  <option value="Peralatan">Peralatan & Transportasi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Deskripsi Pengeluaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembelian Pupuk KCL 25kg"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#1B5E20]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nominal Biaya (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 250000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#1B5E20]"
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
