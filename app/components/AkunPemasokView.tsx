"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, getFavorites, getBankAccounts, createBankAccount, deleteBankAccount, setPrimaryBankAccount, getAuthUser, getSupplierOrders, getSupplierDashboard, BankAccount, SupplierOrderItem, SupplierDashboardData } from "@/lib/api";
import Avatar from "./Avatar";
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
  Star,
  RefreshCw,
  PlusCircle,
  Download,
  CreditCard,
  Sprout,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

interface AkunPemasokViewProps {
  onNavigateToHistory?: () => void;
  onNavigateToPetani?: () => void;
}

export interface PaymentAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
}

function toPaymentAccount(acc: BankAccount): PaymentAccount {
  return {
    id: acc.id,
    bankName: acc.bank_name || "Bank",
    accountNumber: acc.account_number || "-",
    accountHolder: acc.account_holder || "-",
    isPrimary: !!(acc.is_primary || acc.is_default),
  };
}

interface FavoriteFarmer {
  id: number;
  sellerId?: number;
  name: string;
  location: string;
  rating: number;
  commodity: string;
  image: string;
}

export default function AkunPemasokView({
  onNavigateToHistory,
  onNavigateToPetani,
}: AkunPemasokViewProps) {
  const router = useRouter();
  const storeName = (getAuthUser()?.name as string) || "Toko Sembako Berkah Jaya";

  // Favorite Farmers List (from API)
  const [favoriteFarmers, setFavoriteFarmers] = useState<FavoriteFarmer[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  // Payment Methods / Bank Accounts State (from API)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Orders Summary State (from API)
  const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Financial Summary State (from API)
  const [dashboard, setDashboard] = useState<SupplierDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Add Account Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBankName, setNewBankName] = useState("Bank BCA");
  const [newAccNumber, setNewAccNumber] = useState("");
  const [newAccHolder, setNewAccHolder] = useState("");

  // Snackbar / Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showSnackbar = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, type === "error" ? 4000 : 3000);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getFavorites()
      .then((res) => {
        if (cancelled) return;
        const favs = (res as { data?: Array<{ seller_id?: number; name?: string; location?: string; rating?: number; commodity?: string }> })?.data || [];
        setFavoriteFarmers(
          favs.map((f) => ({
            id: f.seller_id ?? 0,
            sellerId: f.seller_id,
            name: f.name || "Petani",
            location: f.location || "Lokasi Lahan",
            rating: f.rating || 0,
            commodity: f.commodity || "Hasil Panen",
            image: "/assets/bowo-senang.png",
          }))
        );
      })
      .catch(() => {
        setFavoriteFarmers([]);
      })
      .finally(() => {
        if (!cancelled) setFavoritesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getBankAccounts()
      .then((res) => {
        if (cancelled) return;
        setPaymentAccounts((res?.data || []).map(toPaymentAccount));
      })
      .catch(() => {
        setPaymentAccounts([]);
      })
      .finally(() => {
        if (!cancelled) setAccountsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSupplierOrders()
      .then((res) => {
        if (cancelled) return;
        setOrders(res?.data || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSupplierDashboard()
      .then((data) => {
        if (cancelled) return;
        setDashboard(data);
      })
      .catch(() => {
        setDashboard(null);
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalMonthSpend =
    dashboard?.monthly_spend != null
      ? dashboard.monthly_spend
      : dashboard?.recent_orders?.reduce((sum, o) => sum + (o.grand_total || 0), 0) || 0;
  const totalMonthKg = dashboard?.monthly_kg ?? 0;
  const completedOrdersCount = dashboard?.completed_orders_count ?? 0;
  const activeOrdersCount = dashboard?.active_orders_count ?? 0;
  const monthlyBelanja =
    dashboard?.recent_orders?.reduce((sum, o) => sum + (o.grand_total || 0), 0) ?? totalMonthSpend;

  const deliveryOrders = orders.filter(
    (o) => o.status === "paid_escrow" || o.status === "shipping" || o.status === "delivered"
  );
  const firstDeliveryOrder = deliveryOrders[0] || null;

  // Lock background body scroll when popup/modal is open
  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPaymentModal]);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNumber || !newAccHolder) {
      showSnackbar("Mohon isi nomor rekening dan nama pemilik rekening!", "error");
      return;
    }

    try {
      const res = await createBankAccount({
        bank_name: newBankName,
        account_number: newAccNumber,
        account_holder: newAccHolder,
        is_primary: paymentAccounts.length === 0,
      });
      const created = (res as { data?: BankAccount })?.data;
      if (created) {
        setPaymentAccounts((prev) => [...prev, toPaymentAccount(created)]);
      }
      setNewAccNumber("");
      setNewAccHolder("");
      setShowAddForm(false);
      showSnackbar("Rekening/E-Wallet berhasil ditambahkan.");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal menambahkan rekening.", "error");
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await deleteBankAccount(id);
      setPaymentAccounts((prev) => prev.filter((acc) => acc.id !== id));
      showSnackbar("Rekening berhasil dihapus.");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal menghapus rekening.", "error");
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await setPrimaryBankAccount(id);
      setPaymentAccounts((prev) =>
        prev.map((acc) => ({
          ...acc,
          isPrimary: acc.id === id,
        }))
      );
      showSnackbar("Berhasil memperbarui rekening utama.");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal mengatur rekening utama.", "error");
    }
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Pemasok Panentra?")) {
      await logoutUser();
      router.push("/login");
    }
  };

  const handleSwitchToPetani = () => {
    if (onNavigateToPetani) {
      onNavigateToPetani();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight">
          Manajemen Akun Pemasok
        </h1>
        <p className="text-xs font-bold text-gray-500">
          Profil Usaha Pembeli, Rekapitulasi Keuangan & Reputasi
        </p>
      </div>

      {/* ================= 1. HEADER PROFIL & REPUTASI PEMASOK ================= */}
      <div className="bg-[#F8FAF8] rounded-[28px] p-5 border border-gray-200 flex items-center gap-4 relative overflow-hidden shadow-sm">
        <Avatar name={storeName} size={56} className="border-2 border-emerald-200" textClassName="text-xl" />

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-black text-[#1A1C19] truncate">Toko Sembako Berkah Jaya</h2>
            <ShieldCheck className="w-4 h-4 text-[#0F4C25] shrink-0" />
          </div>
          <p className="text-xs text-[#0F4C25] font-bold">Terverifikasi (NIB / KTP Panentra Verified)</p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-amber-900 font-black bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-xs shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>4.9 / 5.0 (Reputasi Pembeli)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. REKAPITULASI KEUANGAN & PEMBELIAN ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
            Anggaran Pembelian Pasokan
          </span>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {dashboardLoading ? (
              <span className="text-lg animate-pulse">Memuat...</span>
            ) : (
              <>Rp {totalMonthSpend.toLocaleString("id-ID")}</>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => showSnackbar("Menampilkan Rekapitulasi Keuangan Pembelian...", "info")}
            className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rekap Keuangan</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="h-10 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Metode Pembayaran</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-200/90 block font-medium">Belanja Bulan Ini</span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              {dashboardLoading ? "..." : `Rp ${monthlyBelanja.toLocaleString("id-ID")}`}
            </span>
            {totalMonthKg > 0 && (
              <span className="text-[9px] text-emerald-200/80 block font-medium">
                {totalMonthKg.toLocaleString("id-ID")} kg diamankan
              </span>
            )}
          </div>
          <div className="space-y-0.5 border-l border-white/15 pl-3">
            <span className="text-[10px] text-emerald-200/90 block font-medium">Total Transaksi</span>
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm">
              {dashboardLoading ? "..." : `${completedOrdersCount} Pasokan Selesai`}
            </span>
            {activeOrdersCount > 0 && (
              <span className="text-[9px] text-emerald-200/80 block font-medium">
                + {activeOrdersCount} pesanan aktif
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. RINGKASAN PESANAN AKTIF & RIWAYAT ================= */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
            Ringkasan Pesanan & Transaksi
          </h3>
          {onNavigateToHistory && (
            <button
              type="button"
              onClick={onNavigateToHistory}
              className="text-[11px] font-bold text-[#0F4C25] hover:underline cursor-pointer"
            >
              Lihat Semua &rarr;
            </button>
          )}
        </div>

        <div className="p-3.5 bg-[#F8FAF8] rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-xs">
          {ordersLoading ? (
            <div className="space-y-1.5 flex-1 animate-pulse">
              <div className="h-3 bg-gray-200 rounded-full w-2/3" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            </div>
          ) : deliveryOrders.length === 0 ? (
            <span className="text-xs text-gray-500 font-semibold py-1">
              Tidak ada pesanan dalam perjalanan saat ini.
            </span>
          ) : (
            <>
              <div className="space-y-0.5 min-w-0">
                <span className="font-black text-[#1A1C19] block truncate">
                  {deliveryOrders.length} Pesanan Sedang Dikirim
                </span>
                <span className="text-[10px] text-gray-500 font-medium truncate block">
                  {firstDeliveryOrder?.commodity} ({firstDeliveryOrder?.qtyKg} kg) •{" "}
                  {firstDeliveryOrder?.seller?.name || "Petani"}
                </span>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[10px] font-black shrink-0 whitespace-nowrap">
                Dalam Perjalanan
              </span>
            </>
          )}
        </div>
      </div>

      {/* ================= 4. PETANI LANGGANAN (FAVORIT) ================= */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
          Petani Langganan (Mitra Favorit)
        </h3>

        {favoritesLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((n) => (
              <div key={n} className="bg-white rounded-[24px] p-3.5 border border-gray-200 shadow-sm space-y-2.5 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteFarmers.length === 0 ? (
          <div className="bg-white rounded-[24px] p-6 border border-gray-200 text-center space-y-1.5">
            <p className="text-sm font-black text-[#1A1C19]">Belum ada petani favorit</p>
            <p className="text-[11px] text-gray-500 font-medium">
              Klik ikon ❤️ di halaman detail produk untuk menyimpan petani langganan.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-[24px] p-3.5 border border-gray-200 shadow-sm space-y-2.5 text-xs hover:border-[#0F4C25]/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={farmer.name} size={36} className="border-2 border-emerald-100" textClassName="text-xs" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-black text-[#1A1C19] truncate leading-tight">{farmer.name}</h4>
                  <span className="text-[9px] text-gray-500 font-semibold block truncate">{farmer.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px]">
                <span className="font-black text-[#0F4C25] truncate">{farmer.commodity}</span>
                <span className="text-amber-600 font-black shrink-0 ml-1">⭐ {farmer.rating}</span>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* ================= 5. PENGATURAN & AKSES PERAN ================= */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pengaturan & Akses Peran
        </h3>

        <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          {/* Dual Role Switcher Button */}
          <button
            type="button"
            onClick={handleSwitchToPetani}
            className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sprout className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Daftar / Masuk Sebagai Petani</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-[#0F4C25] px-2.5 py-1 rounded-full border border-emerald-200">
              Switch Role
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Kelola Rekening Bank & E-Wallet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => showSnackbar("Unduh Rekap Laporan Pembelian Pasokan (PDF/Excel) diproses...", "info")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Unduh Laporan Pembelian (PDF)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => showSnackbar("Menghubungi Pusat Bantuan AI Panentra 24/7...", "info")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-extrabold text-[#1A1C19]">Pusat Bantuan & Support AI 24/7</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* ================= 6. LOGOUT ================= */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-12 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-2xs text-xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Keluar Akun Pemasok (Logout)</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL KELOLA REKENING BANK & METODE PEMBAYARAN ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-[32px] p-5 space-y-4 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#1A1C19]">
                  Kelola Rekening Bank & E-Wallet
                </h3>
                <p className="text-[11px] text-gray-500 font-semibold">
                  Metode Pembayaran untuk Transfer Langsung Hasil Panen
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setShowAddForm(false);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Registered Accounts */}
            <div className="space-y-2.5">
              <span className="text-xs font-black text-gray-700 block">
                Rekening / E-Wallet Terdaftar ({paymentAccounts.length})
              </span>

              {accountsLoading ? (
                <p className="text-xs text-gray-400 italic text-center py-3">Memuat rekening...</p>
              ) : paymentAccounts.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-3">
                  Belum ada rekening terdaftar. Silakan tambah rekening baru.
                </p>
              ) : (
                <div className="space-y-2">
                  {paymentAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                        acc.isPrimary
                          ? "bg-emerald-50/70 border-[#0F4C25]"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#1A1C19]">{acc.bankName}</span>
                          {acc.isPrimary && (
                            <span className="px-2 py-0.5 bg-[#0F4C25] text-white text-[9px] font-black rounded-full">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="font-mono font-bold text-[#0F4C25] text-sm tracking-wide">
                          {acc.accountNumber}
                        </p>
                        <p className="text-[10px] text-gray-500 font-semibold">
                          a.n. {acc.accountHolder}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!acc.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(acc.id)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[10px] font-bold cursor-pointer"
                          >
                            Set Utama
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                          title="Hapus Rekening"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Toggle Button or Inline Form */}
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#0F4C25] font-black rounded-2xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rekening / Metode Pembayaran Baru</span>
              </button>
            ) : (
              <form onSubmit={handleAddAccount} className="p-4 bg-[#F8FAF8] rounded-2xl border border-gray-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-xs font-black text-[#1A1C19]">
                    Form Tambah Rekening Baru
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    Batal
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">
                    Jenis Bank / E-Wallet
                  </label>
                  <select
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  >
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="QRIS / DANA E-Wallet">QRIS / DANA E-Wallet</option>
                    <option value="OVO E-Wallet">OVO E-Wallet</option>
                    <option value="GoPay E-Wallet">GoPay E-Wallet</option>
                    <option value="Tunai / COD">Tunai Saat Panen Tiba (COD)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">
                    Nomor Rekening / HP / QRIS
                  </label>
                  <input
                    type="text"
                    value={newAccNumber}
                    onChange={(e) => setNewAccNumber(e.target.value)}
                    placeholder="misal: 8821-4402-192 atau 08123456789"
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">
                    Nama Pemilik Rekening / Usaha
                  </label>
                  <input
                    type="text"
                    value={newAccHolder}
                    onChange={(e) => setNewAccHolder(e.target.value)}
                    placeholder="misal: Toko Sembako Berkah Jaya"
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Simpan Rekening Baru</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Snackbar / Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-22 sm:bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1A1C19]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700/80 animate-slide-up max-w-[92vw] sm:max-w-md">
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === "info" ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <p className="text-xs font-bold leading-snug">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
