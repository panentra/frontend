"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api";
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
  ChevronLeft,
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
  Star,
  CreditCard,
  Bell,
  Globe,
  Store,
  Plus,
  X,
  ShoppingBag,
  Check,
  Building2,
  ExternalLink,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  Calendar,
  Layers,
} from "lucide-react";
import Button from "./Button";

// Master Periode Musim Tanam Data
const PLANTING_SEASONS = [
  { id: "all", name: "Semua Periode", period: "Semua Musim Tanam", status: "" },
  { id: "season-1", name: "MT-1: Cabai Rawit", period: "Juni - Sept 2026", status: "Aktif" },
  { id: "season-2", name: "MT-2: Tomat Red", period: "Maret - Mei 2026", status: "Selesai" },
  { id: "season-3", name: "MT-3: Bawang Merah", period: "Jan - Feb 2026", status: "Selesai" },
];

// Sample Expense Data (Biaya HPP) per Periode Musim Tanam
const INITIAL_EXPENSE_HISTORY = [
  {
    id: 1,
    title: "Bibit Cabai Unggul (10 Pack)",
    category: "Bibit",
    amount: "Rp 150.000",
    rawAmount: 150000,
    date: "25 Juli 2026",
    note: "Varietas Red Hot Super",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit (Juni - Sept 2026)",
  },
  {
    id: 2,
    title: "Pupuk NPK 16-16-16 (50kg)",
    category: "Pupuk",
    amount: "Rp 480.000",
    rawAmount: 480000,
    date: "28 Juli 2026",
    note: "Toko Tani Makmur Lembang",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit (Juni - Sept 2026)",
  },
  {
    id: 3,
    title: "Pestisida Organik Neem (2L)",
    category: "Obat",
    amount: "Rp 120.000",
    rawAmount: 120000,
    date: "30 Juli 2026",
    note: "Semprot hama kutu daun",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit (Juni - Sept 2026)",
  },
  {
    id: 4,
    title: "Upah Buruh Olah Lahan (2 Hari)",
    category: "Tenaga Kerja",
    amount: "Rp 300.000",
    rawAmount: 300000,
    date: "1 Agustus 2026",
    note: "2 Orang pekerja harian",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit (Juni - Sept 2026)",
  },
  {
    id: 5,
    title: "Bibit Tomat Servo F1 (5 Pack)",
    category: "Bibit",
    amount: "Rp 250.000",
    rawAmount: 250000,
    date: "10 Maret 2026",
    note: "Varietas Tahan Virus",
    seasonId: "season-2",
    seasonName: "MT-2: Tomat Red (Maret - Mei 2026)",
  },
  {
    id: 6,
    title: "Mulsa Plastik Hitam Perak 50m",
    category: "Peralatan",
    amount: "Rp 350.000",
    rawAmount: 350000,
    date: "15 Maret 2026",
    note: "Pemasangan bedengan lahan",
    seasonId: "season-2",
    seasonName: "MT-2: Tomat Red (Maret - Mei 2026)",
  },
];

// Sample Harvest Sales History (Riwayat Penjualan Hasil Panen)
const SALES_HISTORY = [
  {
    id: "TRX-901",
    buyer: "Toko Berkah Jaya",
    buyerType: "Pemasok Pasar Modern",
    item: "Cabai Rawit Merah Super",
    qty: "150 kg",
    unitPrice: "Rp 35.000 / kg",
    total: "Rp 5.250.000",
    date: "3 Agustus 2026, 10:15 WIB",
    status: "Selesai",
    escrow: "Panentra Secure Escrow",
    location: "Kec. Lembang, Bandung Barat",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit",
  },
  {
    id: "TRX-882",
    buyer: "Resto Sambal Nusantara",
    buyerType: "Restoran / Kuliner",
    item: "Pakcoy Hydroponic Grade A",
    qty: "80 kg",
    unitPrice: "Rp 18.000 / kg",
    total: "Rp 1.440.000",
    date: "1 Agustus 2026, 14:30 WIB",
    status: "Selesai",
    escrow: "Direct Bank Transfer",
    location: "Kota Bandung",
    seasonId: "season-1",
    seasonName: "MT-1: Cabai Rawit",
  },
  {
    id: "TRX-754",
    buyer: "Supermarket Fresh Mart",
    buyerType: "Retail Modern",
    item: "Tomat Red Super",
    qty: "200 kg",
    unitPrice: "Rp 12.000 / kg",
    total: "Rp 2.400.000",
    date: "28 Juli 2026, 09:00 WIB",
    status: "Selesai",
    escrow: "Panentra Instant Release",
    location: "Kota Cimahi",
    seasonId: "season-2",
    seasonName: "MT-2: Tomat Red",
  },
  {
    id: "TRX-620",
    buyer: "CV Pangan Utama",
    buyerType: "Distributor Bahan Pokok",
    item: "Bawang Merah Brebes",
    qty: "300 kg",
    unitPrice: "Rp 28.000 / kg",
    total: "Rp 8.400.000",
    date: "20 Juli 2026, 11:20 WIB",
    status: "Selesai",
    escrow: "Panentra Secure Escrow",
    location: "Kab. Bandung",
    seasonId: "season-3",
    seasonName: "MT-3: Bawang Merah",
  },
];

// Multi-Lahan Data
const FARM_PLOTS = [
  {
    id: "plot-1",
    name: "Plot 1: Kebun Lembang",
    area: "0.5 Ha",
    location: "Kec. Lembang, Bandung Barat",
    crop: "Cabai Rawit Merah",
    progressDay: 68,
    totalDays: 90,
  },
  {
    id: "plot-2",
    name: "Plot 2: Kebun Ciwidey",
    area: "0.8 Ha",
    location: "Kec. Pasirjambu, Ciwidey",
    crop: "Tomat Red Super",
    progressDay: 30,
    totalDays: 80,
  },
];

import { Land, getExpenses, createExpense, deleteExpense, getCurrentUser, getAuthUser, ExpenseItem } from "@/lib/api";

interface AkunKeuanganViewProps {
  onSubViewChange?: (isOpen: boolean) => void;
  lands?: Land[];
}

export default function AkunKeuanganView({ onSubViewChange, lands }: AkunKeuanganViewProps) {
  const router = useRouter();

  // Navigation Sub-Page View Mode
  const [subViewMode, setSubViewMode] = useState<"main" | "sales_history" | "expense_history" | "bank_accounts">("main");

  // Multi Lahan State
  const [activePlotId, setActivePlotId] = useState<string>("plot-1");

  // Filter & Search States
  const [salesSearch, setSalesSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("Semua");
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>("all"); // Defaults to All Seasons so API data displays immediately!

  // Modals Control States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // Form State Profile
  const [profileName, setProfileName] = useState("Pak Budi Santoso");
  const [profilePhone, setProfilePhone] = useState("+62 812-9988-7766");

  // Form State Expense
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Pupuk");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseSeasonId, setExpenseSeasonId] = useState("season-1");
  const [expenses, setExpenses] = useState<any[]>([]);

  React.useEffect(() => {
    async function loadUserData() {
      const storedUser = getAuthUser();
      if (storedUser) {
        if (storedUser.name) setProfileName(storedUser.name);
        if ((storedUser as Record<string, unknown>).phone || storedUser.email) {
          setProfilePhone((storedUser as Record<string, unknown>).phone as string || storedUser.email || "+62 812-9988-7766");
        }
      }

      try {
        const liveUser = await getCurrentUser();
        if (liveUser) {
          if (liveUser.name) setProfileName(liveUser.name);
          if ((liveUser as Record<string, unknown>).phone || liveUser.email) {
            setProfilePhone((liveUser as Record<string, unknown>).phone as string || liveUser.email || "+62 812-9988-7766");
          }
        }
      } catch (err) {
        console.warn("Gagal memuat API user profile:", err);
      }
    }

    async function loadExpensesData() {
      try {
        const res = await getExpenses();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped = res.data.slice().reverse().map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            amount: `Rp ${item.amount.toLocaleString("id-ID")}`,
            rawAmount: item.amount,
            date: "5 Agustus 2026",
            note: item.note || "Pencatatan HPP API",
            seasonId: `season-${item.season_id || 3}`,
            seasonName: item.season_name || "MT-1: Tomat",
          }));
          setExpenses(mapped);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        console.warn("Gagal memuat API expenses:", err);
        setExpenses([]);
      }
    }

    loadUserData();
    loadExpensesData();
  }, []);

  // Preference Toggles
  const [waNotify, setWaNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);
  const [selectedLang, setSelectedLang] = useState("Bahasa Indonesia");

  const plots = React.useMemo(() => {
    if (lands && lands.length > 0) {
      return lands.map((l, index) => {
        const season = l.seasons?.[0];
        let progressDay = 68;
        let totalDays = 90;

        if (season && season.start_date && season.end_date) {
          const startDate = new Date(season.start_date);
          const endDate = new Date(season.end_date);
          const today = new Date();

          const totalMs = endDate.getTime() - startDate.getTime();
          totalDays = Math.max(1, Math.round(totalMs / (1000 * 3600 * 24)));

          const passedMs = today.getTime() - startDate.getTime();
          const daysPassedRaw = Math.round(passedMs / (1000 * 3600 * 24));
          progressDay = Math.min(totalDays, Math.max(0, daysPassedRaw));
        }

        const cropName = season?.commodity?.name || season?.name || l.commodity?.name || "Tomat";
        const areaStr = `${l.area} ${l.area_unit || "ha"}`;
        return {
          id: `plot-${l.id || index + 1}`,
          name: l.name || `Plot ${index + 1}: Kebun Petani`,
          area: areaStr,
          location: l.address || "Pangalengan, Kab. Bandung",
          crop: cropName,
          progressDay: progressDay,
          totalDays: totalDays,
        };
      });
    }
    return FARM_PLOTS;
  }, [lands]);

  React.useEffect(() => {
    if (plots && plots.length > 0 && activePlotId === "plot-1" && plots[0].id !== "plot-1") {
      setActivePlotId(plots[0].id);
    }
  }, [plots, activePlotId]);

  const currentPlot = plots.find((p) => p.id === activePlotId) || plots[0];

  const handleOpenSubView = (mode: "sales_history" | "expense_history" | "bank_accounts") => {
    setSubViewMode(mode);
    if (onSubViewChange) onSubViewChange(true);
  };

  const handleCloseSubView = () => {
    setSubViewMode("main");
    if (onSubViewChange) onSubViewChange(false);
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Panentra?")) {
      await logoutUser();
      router.push("/login");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    const rawAmt = parseInt(expenseAmount);
    const targetSeason = plantingSeasons.find((s) => s.id === expenseSeasonId) || plantingSeasons[1] || plantingSeasons[0];
    const seasonNumericId = targetSeason?.numericId || 3;

    try {
      await createExpense({
        planting_season_id: seasonNumericId,
        title: expenseTitle,
        category: expenseCategory,
        amount: rawAmt,
        note: "Toko Tani",
      });

      const res = await getExpenses();
      if (res && res.data) {
        const mapped = res.data.slice().reverse().map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          amount: `Rp ${item.amount.toLocaleString("id-ID")}`,
          rawAmount: item.amount,
          date: "5 Agustus 2026",
          note: item.note || "Pencatatan HPP API",
          seasonId: `season-${item.season_id || 3}`,
          seasonName: item.season_name || "MT-1: Tomat",
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.warn("Gagal createExpense API:", err);
      const newExp = {
        id: Date.now(),
        title: expenseTitle,
        category: expenseCategory,
        amount: `Rp ${rawAmt.toLocaleString("id-ID")}`,
        rawAmount: rawAmt,
        date: "Hari Ini",
        note: "Pencatatan langsung HPP",
        seasonId: targetSeason.id,
        seasonName: targetSeason.name,
      };
      setExpenses([newExp, ...expenses]);
    }

    setShowExpenseModal(false);
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const filteredSales = SALES_HISTORY.filter(
    (s) =>
      s.buyer.toLowerCase().includes(salesSearch.toLowerCase()) ||
      s.item.toLowerCase().includes(salesSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(salesSearch.toLowerCase())
  );

  const plantingSeasons = React.useMemo(() => {
    const seasonMap = new Map<string, { id: string; name: string; period: string; status: string; numericId: number }>();
    seasonMap.set("all", { id: "all", name: "Semua Periode", period: "Semua Musim Tanam", status: "", numericId: 3 });

    if (lands && lands.length > 0) {
      lands.forEach((l) => {
        if (l.seasons && l.seasons.length > 0) {
          l.seasons.forEach((s) => {
            const id = `season-${s.id}`;
            const cropName = s.commodity?.name || s.name || l.commodity?.name || "Tomat";
            seasonMap.set(id, {
              id,
              name: s.name || `MT-${s.id}: ${cropName}`,
              period: "Juni - Sept 2026",
              status: s.status === "active" ? "Aktif" : "Selesai",
              numericId: s.id || 3,
            });
          });
        }
      });
    }

    if (expenses && expenses.length > 0) {
      expenses.forEach((exp) => {
        if (exp.seasonId && !seasonMap.has(exp.seasonId)) {
          const numId = parseInt(exp.seasonId.replace("season-", "")) || 3;
          seasonMap.set(exp.seasonId, {
            id: exp.seasonId,
            name: exp.seasonName || "MT-1: Tomat",
            period: "Musim Tanam Aktif",
            status: "Aktif",
            numericId: numId,
          });
        }
      });
    }

    if (seasonMap.size <= 1) {
      return [
        { id: "all", name: "Semua Periode", period: "Semua Musim Tanam", status: "", numericId: 3 },
        { id: "season-3", name: "MT-1: Tomat", period: "Juni - Sept 2026", status: "Aktif", numericId: 3 },
      ];
    }
    return Array.from(seasonMap.values());
  }, [lands, expenses]);

  const currentSelectedSeasonObj = plantingSeasons.find((s) => s.id === selectedSeasonFilter) || plantingSeasons[0];

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSeason =
      selectedSeasonFilter === "all" ||
      exp.seasonId === selectedSeasonFilter ||
      (exp.seasonName && currentSelectedSeasonObj && exp.seasonName.toLowerCase().includes(currentSelectedSeasonObj.name.toLowerCase()));
    const matchesCat = expenseCategoryFilter === "Semua" || exp.category === expenseCategoryFilter;
    const matchesQuery =
      exp.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
      exp.category.toLowerCase().includes(expenseSearch.toLowerCase()) ||
      (exp.seasonName && exp.seasonName.toLowerCase().includes(expenseSearch.toLowerCase()));
    return matchesSeason && matchesCat && matchesQuery;
  });

  const totalExpenseFiltered = filteredExpenses.reduce((acc, curr) => acc + (curr.rawAmount || 0), 0);

  // ================= 1. FULL PAGE SUB-VIEW: RIWAYAT PENJUALAN HASIL PANEN =================
  if (subViewMode === "sales_history") {
    return (
      <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pt-[65px] pb-24 bg-[#F4F6F4] min-h-screen flex flex-col relative z-20">
        {/* Pinned Top Header (Fixed at Top) */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-b border-gray-200 shadow-md p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloseSubView}
              aria-label="Kembali ke Profil"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5] text-[#1A1C19]" />
            </button>
            <div>
              <h2 className="text-sm font-black text-[#1A1C19] leading-tight">
                Riwayat Penjualan Hasil Panen
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold">
                Transkrip Lengkap Pembelian dari Pemasok
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] font-black text-[10px] rounded-md border border-emerald-200">
            {SALES_HISTORY.length} Transaksi
          </span>
        </div>

        {/* Content Body Container */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Summary Omset Banner */}
          <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[26px] p-5 text-white shadow-lg space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">
              Total Pendapatan Terjual
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              Rp 17.490.000
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/15 text-emerald-100">
              <span>Total Volume Terjual: <strong>730 kg</strong></span>
              <span className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-bold">100% Escrow Aman</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama pembeli, komoditas, ID transaksi..."
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#0F4C25] shadow-2xs"
            />
          </div>

          {/* Detailed Transaction Cards List */}
          <div className="space-y-3">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-xs space-y-3 relative overflow-hidden hover:border-emerald-300 transition-all"
              >
                {/* Header: ID, Date, Status */}
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#0F4C25] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                      {sale.id}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">· {sale.date}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-[#0F4C25] border border-emerald-200 rounded-full text-[10px] font-black">
                    ✓ {sale.status}
                  </span>
                </div>

                {/* Item Title & Buyer Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#1A1C19] leading-snug">
                    {sale.item}
                  </h3>
                  <p className="text-xs font-semibold text-gray-600 flex items-center gap-1 flex-wrap">
                    <span className="text-gray-400 font-normal">Pembeli:</span>
                    <strong className="text-[#0F4C25]">{sale.buyer}</strong>
                    <span className="text-gray-400 text-[10px]">({sale.buyerType})</span>
                  </p>
                </div>

                {/* Financial Summary Inner Box (Full Width & Clean Separation) */}
                <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
                      Kuantitas & Harga Satuan
                    </span>
                    <div className="font-black text-[#1A1C19]">
                      {sale.qty} <span className="text-gray-400 font-medium text-[11px]">({sale.unitPrice})</span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
                      Total Diterima
                    </span>
                    <div className="text-base font-black text-[#0F4C25]">
                      {sale.total}
                    </div>
                  </div>
                </div>

                {/* Footer Action & Escrow Info */}
                <div className="pt-1 flex items-center justify-between text-xs gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-gray-500 text-[10px] font-medium min-w-0 flex-wrap">
                    <span className="flex items-center gap-1 shrink-0">
                      <MapPin className="w-3 h-3 text-[#0F4C25]" /> {sale.location}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] rounded-md font-extrabold border border-emerald-100 shrink-0">
                      {sale.escrow}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Mengunduh Invoice Penjualan ${sale.id}...`)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-[11px] rounded-xl border border-gray-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0 active:scale-95 ml-auto"
                  >
                    <Download className="w-3 h-3 text-gray-600" />
                    <span>Cetak Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. FULL PAGE SUB-VIEW: PENCATATAN BIAYA PRODUKSI HPP =================
  if (subViewMode === "expense_history") {
    return (
      <div className="animate-fade-in -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 pt-[65px] pb-24 bg-[#F4F6F4] min-h-screen flex flex-col relative z-20">
        {/* Pinned Top Header (Fixed at Top) */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 bg-white border-b border-gray-200 shadow-md p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloseSubView}
              aria-label="Kembali ke Profil"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5] text-[#1A1C19]" />
            </button>
            <div>
              <h2 className="text-sm font-black text-[#1A1C19] leading-tight">
                Pencatatan Biaya Produksi (HPP)
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold">
                Terpisah per Periode Musim Tanam
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="px-3 py-1.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Catat
          </button>
        </div>

        {/* Content Body Container */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Summary HPP Banner with Season Context Tag */}
          <div className="bg-[#FFF5F5] border border-red-200 rounded-[26px] p-5 text-gray-900 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-red-700 uppercase tracking-wider block">
                Total Biaya HPP Modal Produksi
              </span>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded-full border border-red-200">
                {currentSelectedSeasonObj.name}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              Rp {totalExpenseFiltered.toLocaleString("id-ID")}
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Biaya HPP modal untuk <strong>{currentSelectedSeasonObj.name}</strong>. Semua penawaran harga pembeli AI disesuaikan agar selalu di atas modal ini.
            </p>
          </div>

          {/* PERIODE MUSIM TANAM FILTER HORIZONTAL BAR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1 text-[11px] font-black text-[#1A1C19]">
                <Calendar className="w-3.5 h-3.5 text-[#0F4C25]" /> Pilih Periode Musim Tanam:
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {filteredExpenses.length} catatan pengeluaran
              </span>
            </div>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
                {plantingSeasons.map((season) => (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => setSelectedSeasonFilter(season.id)}
                    className={`px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 shrink-0 ${
                      selectedSeasonFilter === season.id
                        ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>{season.name}</span>
                    {season.status && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${
                          selectedSeasonFilter === season.id
                            ? "bg-white/20 text-white"
                            : season.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {season.status}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F4F6F4] via-[#F4F6F4]/80 to-transparent pointer-events-none z-10" />
            </div>
          </div>

          {/* Search Input & Category Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pengeluaran, pupuk, bibit, upah..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#0F4C25] shadow-2xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
                {["Semua", "Pupuk", "Bibit", "Obat", "Tenaga Kerja", "Peralatan"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setExpenseCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                      expenseCategoryFilter === cat
                        ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F4F6F4] via-[#F4F6F4]/80 to-transparent pointer-events-none z-10" />
            </div>
          </div>

          {/* Detailed Expense Entries List */}
          <div className="space-y-2.5">
            {filteredExpenses.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 space-y-2">
                <p className="text-xs font-bold text-gray-500">
                  Tidak ada catatan biaya produksi untuk periode/kategori ini.
                </p>
              </div>
            ) : (
              filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-[24px] p-4 border border-gray-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all"
                >
                  {/* Top Bar: Season Tag Badge */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 text-[10px]">
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#0F4C25] font-black rounded-lg border border-emerald-200">
                      {exp.seasonName}
                    </span>
                    <span className="text-gray-400 font-bold">{exp.date}</span>
                  </div>

                  {/* Body Content */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="space-y-1 min-w-0 pr-2">
                      <h4 className="font-black text-[#1A1C19] leading-tight">{exp.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-bold border border-gray-200">
                          {exp.category}
                        </span>
                        {exp.note && (
                          <span className="text-gray-400 font-medium italic truncate max-w-[160px]">"{exp.note}"</span>
                        )}
                      </div>
                    </div>

                    <span className="font-black text-red-600 text-sm shrink-0">
                      - {exp.amount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 8. MODAL CATAT BIAYA (HPP FORM MODAL WITH SEASON SELECTOR) */}
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-[#1A1C19]">
                  Catat Biaya Produksi (HPP)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Periode / Musim Tanam</label>
                  <select
                    value={expenseSeasonId}
                    onChange={(e) => setExpenseSeasonId(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                  >
                    {plantingSeasons.filter((s) => s.id !== "all").map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name} ({season.period}) {season.status === "Aktif" ? "[Aktif]" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kategori Biaya</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                  >
                    <option value="Pupuk">Pupuk & Nutrisi</option>
                    <option value="Bibit">Bibit & Benih</option>
                    <option value="Obat">Obat & Pestisida</option>
                    <option value="Tenaga Kerja">Tenaga Kerja / Upah Harian</option>
                    <option value="Peralatan">Peralatan & Transportasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Deskripsi Item</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembelian Pupuk KCL 25kg"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
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
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
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
                    className="flex-1 justify-center py-2.5 font-bold"
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

  // ================= 3. MAIN DASHBOARD VIEW (PROFILE & KEAKUNAN) =================
  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* ================= 1. HEADER PROFILE HERO CARD ================= */}
      <div className="rounded-[32px] overflow-hidden border border-emerald-900/10 shadow-xl bg-white">
        {/* Dark Green Header Hero */}
        <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] p-6 text-white text-center relative flex flex-col items-center justify-center min-h-[170px]">
          {/* Edit Profile Pencil Button Top Right */}
          <button
            type="button"
            onClick={() => setShowEditProfileModal(true)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Edit Profil Petani"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Centered Avatar Image Circle */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-white shadow-lg overflow-hidden relative mb-2 p-0.5">
            <Image
              src="/assets/bowo-senang.png"
              alt={profileName}
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>

          {/* User Name & Verification Badge */}
          <div className="flex items-center gap-1.5 justify-center">
            <h2 className="text-lg font-black tracking-tight text-white">
              {profileName}
            </h2>
            <button
              type="button"
              onClick={() => setShowVerifyModal(true)}
              className="inline-flex items-center gap-1 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-300/30 cursor-pointer transition-colors"
              title="Klik untuk info verifikasi"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Terverifikasi</span>
            </button>
          </div>

          {/* Seller Reputation Rating */}
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-amber-300 font-extrabold bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.8 / 5.0</span>
            <span className="text-white/80 font-medium text-[10px]">• 32 Transaksi Penjualan Sukses</span>
          </div>
        </div>

        {/* Info Lahan Active Grid Summary */}
        <div className="p-4 sm:p-5 bg-white space-y-3 divide-y divide-gray-100 text-xs">
          <div className="flex justify-between items-center pt-1">
            <span className="font-bold text-gray-500">No. Handphone / WhatsApp</span>
            <span className="font-black text-[#1A1C19]">{profilePhone}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-gray-500">Status Akun Tani</span>
            <span className="font-black text-[#0F4C25] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Petani Komoditas Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. MULTI-LAHAN & STATUS PANEN ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
            Lahan & Komoditas Aktif
          </h2>
          <button
            type="button"
            onClick={() => alert("Tambah Lahan Tanam Baru")}
            className="text-xs font-black text-[#0F4C25] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Lahan
          </button>
        </div>

        {/* Plot Selector Tabs */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
            {plots.map((plot) => (
              <button
                key={plot.id}
                type="button"
                onClick={() => setActivePlotId(plot.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePlotId === plot.id
                    ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{plot.name} ({plot.area})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plot Active Details Card */}
        <div className="bg-white rounded-[26px] p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 block">{currentPlot.name}</span>
              <h3 className="text-sm font-black text-[#1A1C19]">
                <span>{currentPlot.crop}</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-[#0F4C25] border border-emerald-200 rounded-xl text-[10px] font-black">
              Luas {currentPlot.area}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0F4C25] shrink-0" />
            <span>{currentPlot.location}</span>
          </div>

          {/* Progress Bar Progress Panen */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-black text-gray-700">
              <span>Progres Masa Tanam</span>
              <span>Hari ke-{currentPlot.progressDay} / {currentPlot.totalDays} Hari</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-[#0F4C25] to-[#2E7D32] rounded-full transition-all duration-500"
                style={{ width: `${(currentPlot.progressDay / currentPlot.totalDays) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. REKAP SALDO & TRACKING PENDAPATAN ================= */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">
              Tracking Total Pendapatan Hasil Panen
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              Rp 14.850.000
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            + Metode Pembayaran
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-medium">Pendapatan Omset</span>
              <span className="font-black text-white text-xs">Rp 17.490.000</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-400/20 flex items-center justify-center text-red-300">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-medium">Total Biaya Produksi (HPP)</span>
              <span className="font-black text-white text-xs">Rp 1.050.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. RINGKASAN BIAYA PRODUKSI (HPP RINGKAS - 2 ITEM) ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1C19]">
            Ringkasan Biaya Produksi (HPP)
          </h3>
          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="text-xs font-black text-[#0F4C25] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Catat Biaya
          </button>
        </div>

        <div className="space-y-2">
          {expenses.length === 0 ? (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center space-y-1">
              <p className="text-xs font-bold text-gray-700">Belum Ada Catatan Biaya Produksi (HPP)</p>
              <p className="text-[11px] text-gray-500 font-medium">
                Tekan tombol <span className="font-extrabold text-[#0F4C25]">+ Catat Biaya</span> di atas untuk mendaftarkan pengeluaran bibit, pupuk, atau upah kerja.
              </p>
            </div>
          ) : (
            expenses.slice(0, 2).map((exp) => (
              <div
                key={exp.id}
                className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-[#1A1C19]">{exp.title}</h4>
                  </div>
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
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => handleOpenSubView("expense_history")}
          className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-black border border-gray-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <span>Lihat Halaman Catatan Biaya HPP ({expenses.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* ================= 5. RIWAYAT PENJUALAN HASIL PANEN ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#0F4C25]" />
            Riwayat Penjualan Hasil Panen
          </h3>
          <span className="text-[10px] font-extrabold text-[#0F4C25] bg-emerald-50 px-2 py-0.5 rounded-full">
            {SALES_HISTORY.length} Transaksi
          </span>
        </div>

        <div className="space-y-2">
          {SALES_HISTORY.slice(0, 2).map((sale) => (
            <div
              key={sale.id}
              className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <h4 className="font-black text-[#1A1C19] truncate">{sale.item}</h4>
                <p className="text-[10px] text-gray-500 font-semibold truncate">
                  Pembeli: {sale.buyer} · {sale.qty}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-[#0F4C25] block text-xs">{sale.total}</span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                  ✓ {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleOpenSubView("sales_history")}
          className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C25] rounded-2xl text-xs font-black border border-emerald-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <span>Lihat Halaman Riwayat Penjualan ({SALES_HISTORY.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* ================= 6. PENGELOLAAN TANI ("MANAGE") ================= */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-black text-[#1A1C19] tracking-tight">
          Pengelolaan Tani & AI
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

      {/* ================= 7. PENGATURAN & AKSES PERAN ================= */}
      <section className="space-y-2 pt-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pengaturan & Akses Peran
        </h3>

        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden text-xs">
          {/* Kelola Rekening Bank */}
          <button
            type="button"
            onClick={() => setShowBankModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Kelola Rekening Bank / E-Wallet</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              BCA · 8821xxxx <ChevronRight className="w-4 h-4 text-gray-400" />
            </span>
          </button>

          {/* Daftar Sebagai Pemasok */}
          <button
            type="button"
            onClick={() => setShowSupplierModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Daftar Sebagai Pemasok / Pembeli</span>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Daftar Toko
            </span>
          </button>

          {/* Unduh Laporan PDF */}
          <button
            type="button"
            onClick={() => alert("Unduh Rekap Laporan Keuangan HPP (PDF/Excel)")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Unduh Laporan Keuangan Tani (PDF)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Notifikasi & Privasi */}
          <button
            type="button"
            onClick={() => setShowNotifModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Notifikasi & Preferensi Privasi</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Bahasa Aplikasi */}
          <button
            type="button"
            onClick={() => setShowLangModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Bahasa Aplikasi</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
              {selectedLang} <ChevronRight className="w-4 h-4 text-gray-400" />
            </span>
          </button>

          {/* Pusat Bantuan AI */}
          <button
            type="button"
            onClick={() => alert("Menghubungi Pusat Bantuan Panentra AI 24/7")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0F4C25]" />
              <span className="font-black text-[#1A1C19]">Pusat Bantuan & AI Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* LOGOUT BUTTON */}
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

      {/* ================= MODALS SECTION ================= */}

      {/* 1. MODAL VERIFIKASI STATUS */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 text-center relative">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0F4C25] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#1A1C19]">
                Akun Terverifikasi Resmi
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Identitas KTP, nomor WhatsApp, dan dokumen kepemilikan lahan pertanian Anda telah berhasil diverifikasi oleh tim keamanan Panentra.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left text-xs space-y-1.5 text-[#0F4C25]">
              <div className="flex items-center gap-2 font-bold">
                <Check className="w-4 h-4 text-[#0F4C25]" /> KTP terverifikasi
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Check className="w-4 h-4 text-[#0F4C25]" /> Lahan Lembang (0.5 Ha) Terdaftar
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Check className="w-4 h-4 text-[#0F4C25]" /> Hak Akses Escrow Panentra Pay Aktif
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setShowVerifyModal(false)}
              className="w-full justify-center py-2.5 font-bold"
            >
              Mengerti
            </Button>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT PROFIL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19]">
                Edit Profil Petani
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditProfileModal(false);
                alert("Profil berhasil diperbarui!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Lengkap Petani</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditProfileModal(false)}
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
                  Simpan Profil
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL KELOLA REKENING BANK */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0F4C25]" />
                Rekening Pencairan Saldo
              </h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0F4C25] text-white flex items-center justify-center font-black text-[10px]">
                    BCA
                  </div>
                  <div>
                    <p className="font-black text-[#1A1C19]">Bank Central Asia (BCA)</p>
                    <p className="text-[10px] text-gray-500 font-semibold">8821-4402-192 • a.n. Bowo Santoso</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Utama
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                    DANA
                  </div>
                  <div>
                    <p className="font-black text-[#1A1C19]">DANA E-Wallet</p>
                    <p className="text-[10px] text-gray-500 font-semibold">0812-3456-7890 • Bowo Santoso</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Tambah Rekening Bank / E-Wallet Baru")}
              className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah Rekening Tujuan
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL DAFTAR SEBAGAI PEMASOK */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative text-center">
            <button
              onClick={() => setShowSupplierModal(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0F4C25] flex items-center justify-center mx-auto">
              <Store className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#1A1C19]">
                Daftar Sebagai Pemasok / Pembeli
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Selain menjual hasil tani milik sendiri, Anda dapat mendaftarkan akun Toko Pemasok untuk membeli pasokan dari sesama kelompok tani.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-left text-xs space-y-1.5 text-[#0F4C25]">
              <p className="font-black text-[#1A1C19]">Keuntungan Pemasok Panentra:</p>
              <p className="text-[11px] font-medium">• Akses borong hasil panen langsung dari 50+ petani</p>
              <p className="text-[11px] font-medium">• Garansi kualitas & Rekening Escrow Panentra Pay</p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSupplierModal(false)}
                className="flex-1 justify-center"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowSupplierModal(false);
                  router.push("/dashboard-pemasok");
                }}
                className="flex-1 justify-center py-2.5 font-bold"
              >
                Buka Dashboard Pemasok
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL NOTIFIKASI & PRIVASI */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0F4C25]" />
                Notifikasi & Privasi
              </h3>
              <button
                onClick={() => setShowNotifModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200">
                <div>
                  <p className="font-black text-[#1A1C19]">Notifikasi WhatsApp Alert</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Kirim pemberitahuan nego & pesanan via WA</p>
                </div>
                <input
                  type="checkbox"
                  checked={waNotify}
                  onChange={(e) => setWaNotify(e.target.checked)}
                  className="w-4 h-4 accent-[#0F4C25] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200">
                <div>
                  <p className="font-black text-[#1A1C19]">Push Notification Aplikasi</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Notifikasi pengingat siram & panen AI</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotify}
                  onChange={(e) => setPushNotify(e.target.checked)}
                  className="w-4 h-4 accent-[#0F4C25] rounded cursor-pointer"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setShowNotifModal(false)}
              className="w-full justify-center py-2.5 font-bold"
            >
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      )}

      {/* 6. MODAL BAHASA APLIKASI */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0F4C25]" />
                Pilih Bahasa Aplikasi
              </h3>
              <button
                onClick={() => setShowLangModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {["Bahasa Indonesia", "Basa Jawa", "Basa Sunda"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left font-black flex items-center justify-between cursor-pointer transition-all ${
                    selectedLang === lang
                      ? "bg-emerald-50 text-[#0F4C25] border-emerald-300"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>{lang}</span>
                  {selectedLang === lang && <Check className="w-4 h-4 text-[#0F4C25]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL TAMBAH METODE PEMBAYARAN PETANI */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19]">
                Tambah Metode Pembayaran Petani
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-[#0F4C25]">
              <span className="font-bold block">Penerimaan Pembayaran Jual Panen:</span>
              <span className="text-xs font-semibold text-[#0F4C25] block">
                Pembeli/Pemasok akan mentransfer langsung sesuai metode pembayaran yang Anda pilih.
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Jenis Metode Pembayaran</label>
                <select className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold cursor-pointer">
                  <option value="bca">Transfer Bank BCA</option>
                  <option value="bri">Transfer Bank BRI</option>
                  <option value="mandiri">Transfer Bank Mandiri</option>
                  <option value="qris">QRIS / E-Wallet (DANA/OVO/GoPay)</option>
                  <option value="cod">Tunai Saat Serah Terima (COD)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nomor Rekening / HP / Link QRIS</label>
                <input
                  type="text"
                  placeholder="Contoh: 8821-4402-192"
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Pemilik Rekening / Toko</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Andi Sugiharto"
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 justify-center"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowWithdrawModal(false);
                  alert("Permintaan penarikan saldo berhasil diproses ke rekening Bank BCA!");
                }}
                className="flex-1 justify-center py-2.5 font-bold"
              >
                Proses Penarikan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL CATAT BIAYA (HPP FORM MODAL WITH SEASON SELECTOR) */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 space-y-4 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1A1C19]">
                Catat Biaya Produksi (HPP)
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Periode / Musim Tanam</label>
                <select
                  value={expenseSeasonId}
                  onChange={(e) => setExpenseSeasonId(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                >
                  {plantingSeasons.filter((s) => s.id !== "all").map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name} ({season.period}) {season.status === "Aktif" ? "[Aktif]" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Kategori Biaya</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
                >
                  <option value="Pupuk">Pupuk & Nutrisi</option>
                  <option value="Bibit">Bibit & Benih</option>
                  <option value="Obat">Obat & Pestisida</option>
                  <option value="Tenaga Kerja">Tenaga Kerja / Upah Harian</option>
                  <option value="Peralatan">Peralatan & Transportasi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Deskripsi Item</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembelian Pupuk KCL 25kg"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
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
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold"
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
                  className="flex-1 justify-center py-2.5 font-bold"
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
