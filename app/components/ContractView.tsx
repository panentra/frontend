"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  FileSignature,
  Handshake,
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Avatar from "./Avatar";
import Snackbar, { useSnackbar } from "./Snackbar";
import {
  getCommodities,
  getAuthUser,
  createContract,
  getMyContracts,
  getOpenContractOffers,
  signContract,
  markContractSent,
  completeContract,
  Commodity,
  ContractData,
  ContractsResponse,
} from "@/lib/api";

type ContractStatus = "menunggu_pemasok" | "aktif" | "panen_terkirim" | "selesai";

interface Contract {
  id: string;
  contractNo: string;
  commodity: string;
  commodityId?: number;
  qtyKg: number;
  pricePerKg: number;
  totalValue: number;
  farmerName: string;
  farmerLocation: string;
  supplierName: string | null;
  harvestDate: string;
  deliveryMethod: string;
  status: ContractStatus;
  createdAt: string;
  createdBy: "petani" | "pemasok";
}

function mapApiContract(raw: ContractData): Contract {
  const commodity =
    typeof raw.commodity === "string"
      ? raw.commodity
      : (raw.commodity as { name?: string } | undefined)?.name || "Komoditas";
  const farmer = (raw.farmer || {}) as { name?: string; location?: string };
  const supplier = (raw.supplier || {}) as { name?: string };
  const farmerName = farmer.name || raw.farmer_name || "Petani";
  const farmerLocation = farmer.location || raw.farmer_location || "";
  const supplierName = supplier.name ?? raw.supplier_name ?? null;
  const qtyKg = Number(raw.qtyKg ?? raw.qty_kg ?? 0);
  const pricePerKg = Number(raw.pricePerKg ?? raw.price_per_kg ?? 0);
  return {
    id: String(raw.id),
    contractNo: String(raw.contractNo || raw.id),
    commodity,
    commodityId: raw.commodityId ?? raw.commodity_id,
    qtyKg,
    pricePerKg,
    totalValue: Number(raw.totalValue ?? raw.total_value ?? qtyKg * pricePerKg) || 0,
    farmerName,
    farmerLocation,
    supplierName,
    harvestDate: raw.harvestDate || raw.harvest_date || "",
    deliveryMethod: (raw.deliveryMethod || raw.delivery_method) === "diambil" ? "diambil" : "dikirim",
    status: raw.status || "menunggu_pemasok",
    createdAt: raw.createdAt || raw.created_at || "",
    createdBy: (raw.createdBy || raw.created_by) === "pemasok" ? "pemasok" : "petani",
  };
}

function extractContractList(res: ContractsResponse | ContractData[]): ContractData[] {
  if (Array.isArray(res)) return res;
  return res?.data || [];
}

const STATUS_LABEL: Record<ContractStatus, string> = {
  menunggu_pemasok: "Menunggu Pemasok",
  aktif: "Kontrak Aktif",
  panen_terkirim: "Panen Terkirim",
  selesai: "Selesai",
};

const STATUS_STYLE: Record<ContractStatus, string> = {
  menunggu_pemasok: "bg-amber-50 text-amber-900 border-amber-200",
  aktif: "bg-blue-50 text-blue-900 border-blue-200",
  panen_terkirim: "bg-indigo-50 text-indigo-900 border-indigo-200",
  selesai: "bg-emerald-50 text-[#0F4C25] border-emerald-200",
};

function formatRupiah(num: number): string {
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

interface ContractViewProps {
  role: "petani" | "pemasok";
  onBack: () => void;
}

export default function ContractView({ role, onBack }: ContractViewProps) {
  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();
  const user = getAuthUser();
  const myName = (user?.name as string) || (role === "petani" ? "Petani Panentra" : "Toko Berkah");

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [openOffers, setOpenOffers] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [commoditiesLoading, setCommoditiesLoading] = useState(true);
  const [pemasokTab, setPemasokTab] = useState<"terbuka" | "saya">("terbuka");

  // Form state
  const [commodityId, setCommodityId] = useState<number | "">("");
  const [qtyKg, setQtyKg] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"dikirim" | "diambil">("dikirim");
  const [creating, setCreating] = useState(false);

  const loadContracts = React.useCallback(async () => {
    try {
      if (role === "pemasok") {
        const [mine, open] = await Promise.all([getMyContracts(), getOpenContractOffers()]);
        setContracts(extractContractList(mine).map(mapApiContract));
        setOpenOffers(extractContractList(open).map(mapApiContract));
      } else {
        const mine = await getMyContracts();
        setContracts(extractContractList(mine).map(mapApiContract));
      }
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal memuat kontrak.", "error");
    } finally {
      setLoading(false);
    }
  }, [role, showSnackbar]);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setLoading(false);
    };
    if (role === "pemasok") {
      Promise.all([getMyContracts(), getOpenContractOffers()])
        .then(([mine, open]) => {
          if (cancelled) return;
          setContracts(extractContractList(mine).map(mapApiContract));
          setOpenOffers(extractContractList(open).map(mapApiContract));
        })
        .catch((err) => {
          if (cancelled) return;
          showSnackbar(err instanceof Error ? err.message : "Gagal memuat kontrak.", "error");
        })
        .finally(finish);
    } else {
      getMyContracts()
        .then((mine) => {
          if (cancelled) return;
          setContracts(extractContractList(mine).map(mapApiContract));
        })
        .catch((err) => {
          if (cancelled) return;
          showSnackbar(err instanceof Error ? err.message : "Gagal memuat kontrak.", "error");
        })
        .finally(finish);
    }
    return () => {
      cancelled = true;
    };
  }, [role, showSnackbar]);

  useEffect(() => {
    let cancelled = false;
    getCommodities()
      .then((res) => {
        if (cancelled) return;
        setCommodities(res?.data || []);
      })
      .catch(() => setCommodities([]))
      .finally(() => {
        if (!cancelled) setCommoditiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const cid = Number(commodityId);
    const qty = parseInt(qtyKg);
    const price = parseInt(pricePerKg);
    if (!cid || !qty || !price || !harvestDate) {
      showSnackbar("Lengkapi komoditas, kuantitas, harga, dan tanggal panen.", "error");
      return;
    }

    setCreating(true);
    try {
      await createContract({
        commodity_id: cid,
        qty_kg: qty,
        price_per_kg: price,
        harvest_date: harvestDate,
        delivery_method: deliveryMethod,
      });
      setShowCreate(false);
      setCommodityId("");
      setQtyKg("");
      setPricePerKg("");
      setHarvestDate("");
      showSnackbar("Kontrak panen dibuat. Menunggu pemasok menandatangani.", "success");
      await loadContracts();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal membuat kontrak.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleSignContract = async (id: string) => {
    setActionLoadingId(id);
    try {
      await signContract(id);
      showSnackbar("Kontrak ditandatangani! Harga & volume pasokan terkunci.", "success");
      await loadContracts();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal menandatangani kontrak.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkSent = async (id: string) => {
    setActionLoadingId(id);
    try {
      await markContractSent(id);
      showSnackbar("Panen ditandai terkirim. Menunggu konfirmasi pemasok.", "success");
      await loadContracts();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal menandai panen terkirim.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReceived = async (id: string) => {
    setActionLoadingId(id);
    try {
      await completeContract(id);
      showSnackbar("Pasokan diterima. Kontrak selesai.", "success");
      await loadContracts();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Gagal menyelesaikan kontrak.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const myContracts =
    role === "petani"
      ? contracts
      : contracts.filter((c) => c.status === "aktif" || c.status === "panen_terkirim" || c.status === "selesai");

  const signedContracts = contracts;
  const displayedList = role === "pemasok" ? (pemasokTab === "terbuka" ? openOffers : signedContracts) : myContracts;

  const totalActive = contracts.filter((c) => c.status === "aktif" || c.status === "panen_terkirim").length;
  const totalValueActive = contracts
    .filter((c) => c.status === "aktif" || c.status === "panen_terkirim")
    .reduce((s, c) => s + c.totalValue, 0);

  const renderActions = (c: Contract) => {
    const isWorking = actionLoadingId === c.id;
    const busyContent = (
      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
    );
    if (role === "pemasok") {
      if (pemasokTab === "terbuka") {
        return (
          <button
            type="button"
            onClick={() => handleSignContract(c.id)}
            disabled={isWorking}
            className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
          >
            {isWorking ? busyContent : <FileSignature className="w-4 h-4 text-emerald-300" />}
            {isWorking ? "Menandatangani..." : "Tanda Tangan & Kunci Kontrak"}
          </button>
        );
      }
      if (c.status === "panen_terkirim") {
        return (
          <button
            type="button"
            onClick={() => handleConfirmReceived(c.id)}
            disabled={isWorking}
            className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
          >
            {isWorking ? busyContent : <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            {isWorking ? "Menyelesaikan..." : "Konfirmasi Terima & Selesaikan"}
          </button>
        );
      }
      return (
        <div className="py-1.5 text-center text-[11px] font-extrabold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
          ✓ Menunggu hasil panen dikirim
        </div>
      );
    }

    // role petani
    if (c.status === "aktif") {
      return (
        <button
          type="button"
          onClick={() => handleMarkSent(c.id)}
          disabled={isWorking}
          className="w-full py-2.5 bg-[#0F4C25] hover:bg-[#0A381B] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
        >
          {isWorking ? busyContent : <Truck className="w-4 h-4 text-emerald-300" />}
          {isWorking ? "Mengirim..." : "Tandai Panen Terkirim"}
        </button>
      );
    }
    if (c.status === "menunggu_pemasok") {
      return (
        <div className="py-1.5 text-center text-[11px] font-extrabold text-amber-900 bg-amber-50 rounded-xl border border-amber-200">
          <Clock className="w-3.5 h-3.5 inline-block mr-1" />
          Menunggu pemasok menandatangani
        </div>
      );
    }
    if (c.status === "panen_terkirim") {
      return (
        <div className="py-1.5 text-center text-[11px] font-extrabold text-indigo-900 bg-indigo-50 rounded-xl border border-indigo-200">
          Menunggu konfirmasi pemasok
        </div>
      );
    }
    return (
      <div className="py-1.5 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
        ✓ Transaksi Selesai
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A1C19] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1A1C19] tracking-tight">
            Kontrak Panen
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            {role === "petani"
              ? "Amankan pembeli sebelum panen — jual pasti, harga terkunci"
              : "Kunci pasokan petani dengan harga tetap"}
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg">
        <div className="space-y-1.5 max-w-[70%] relative z-10">
          <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
            {role === "petani"
              ? "Tanam tanpa takut tidak ada pembeli."
              : "Amankan pasokan untuk musim depan."}
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
            {role === "petani"
              ? "Buat kontrak dengan pemasok sebelum masa panen. Harga & volume terkunci otomatis."
              : "Tanda tangan kontrak petani sekarang, pasokan terjamin saat musim panen tiba."}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 w-36 h-36 opacity-90 pointer-events-none">
          <Avatar name={role === "petani" ? myName : "Kontrak"} size={140} className="border-4 border-white/20" textClassName="text-4xl" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-[22px] p-3.5 border border-gray-200 shadow-2xs space-y-1">
          <Handshake className="w-4 h-4 text-[#0F4C25]" />
          <div className="text-lg font-black text-[#1A1C19] leading-none">{contracts.length}</div>
          <span className="text-[10px] font-bold text-gray-500 leading-tight block">Total Kontrak</span>
        </div>
        <div className="bg-white rounded-[22px] p-3.5 border border-gray-200 shadow-2xs space-y-1">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <div className="text-lg font-black text-[#1A1C19] leading-none">{totalActive}</div>
          <span className="text-[10px] font-bold text-gray-500 leading-tight block">Kontrak Aktif</span>
        </div>
        <div className="bg-white rounded-[22px] p-3.5 border border-gray-200 shadow-2xs space-y-1">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <div className="text-lg font-black text-[#1A1C19] leading-none">
            {totalValueActive >= 1000000
              ? `${(totalValueActive / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}Jt`
              : totalValueActive.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] font-bold text-gray-500 leading-tight block">Nilai Terkunci</span>
        </div>
      </div>

      {/* Pemasok: tab */}
      {role === "pemasok" && (
        <div className="flex gap-2 border-b border-gray-100 pb-2">
          <button
            type="button"
            onClick={() => setPemasokTab("terbuka")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              pemasokTab === "terbuka" ? "bg-[#0F4C25] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tawaran Terbuka ({openOffers.length})
          </button>
          <button
            type="button"
            onClick={() => setPemasokTab("saya")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              pemasokTab === "saya" ? "bg-[#0F4C25] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Kontrak Saya ({signedContracts.length})
          </button>
        </div>
      )}

      {/* Create Button (petani) */}
      {role === "petani" && (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="w-full h-12 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer text-xs"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          Buat Kontrak Panen Baru
        </button>
      )}

      {/* Contract List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <div className="w-7 h-7 border-4 border-[#0F4C25] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-sm font-black text-gray-700">Memuat kontrak...</h3>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="p-8 bg-white rounded-[28px] border border-gray-200 text-center space-y-2">
            <FileSignature className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-black text-gray-700">
              {role === "petani"
                ? "Belum ada kontrak"
                : pemasokTab === "terbuka"
                ? "Belum ada tawaran kontrak"
                : "Belum ada kontrak ditandatangani"}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {role === "petani"
                ? "Buat kontrak sekarang agar hasil panenmu sudah ada pembeli sebelum panen."
                : "Tawaran kontrak dari petani akan muncul di sini."}
            </p>
          </div>
        ) : (
          displayedList.map((c) => (
            <div key={c.id} className="bg-white rounded-[28px] p-4 border border-gray-200 shadow-sm space-y-3">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1A1C19] text-xs">{c.contractNo}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{formatDate(c.createdAt)}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${STATUS_STYLE[c.status]}`}>
                  {STATUS_LABEL[c.status]}
                </span>
              </div>

              {/* Commodity + parties */}
              <div className="flex items-start gap-3">
                <Avatar name={c.commodity} size={44} className="border-2 border-emerald-100" textClassName="text-sm" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="text-sm font-black text-[#1A1C19] truncate">
                    {c.commodity} · {c.qtyKg} kg
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold truncate">
                    Petani: {c.farmerName} {c.supplierName ? `• Pembeli: ${c.supplierName}` : ""}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-[#0F4C25] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Panen: {formatDate(c.harvestDate)}
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <Truck className="w-3 h-3" /> {c.deliveryMethod === "dikirim" ? "Dikirim" : "Diambil"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price summary */}
              <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Harga Terkunci</span>
                  <span className="font-black text-[#0F4C25]">{formatRupiah(c.pricePerKg)} / kg</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Nilai Kontrak</span>
                  <span className="text-base font-black text-[#1A1C19]">{formatRupiah(c.totalValue)}</span>
                </div>
              </div>

              {/* Actions */}
              {renderActions(c)}
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Kontrak */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-[32px] p-5 space-y-4 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#1A1C19]">Buat Kontrak Panen</h3>
                <p className="text-[11px] text-gray-500 font-semibold">
                  Kunci harga & volume sebelum masa panen
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">Komoditas</label>
                <select
                  value={commodityId}
                  onChange={(e) => setCommodityId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  disabled={commoditiesLoading}
                >
                  <option value="">{commoditiesLoading ? "Memuat..." : "Pilih komoditas"}</option>
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">Kuantitas (kg)</label>
                  <input
                    type="number"
                    value={qtyKg}
                    onChange={(e) => setQtyKg(e.target.value)}
                    placeholder="misal 500"
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">Harga (Rp/kg)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    placeholder="misal 35000"
                    className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">Estimasi Tanggal Panen</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#0F4C25]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">Metode Pengiriman</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("dikirim")}
                    className={`p-2.5 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      deliveryMethod === "dikirim" ? "bg-[#0F4C25] text-white border-[#0F4C25]" : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Dikirim
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("diambil")}
                    className={`p-2.5 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      deliveryMethod === "diambil" ? "bg-[#0F4C25] text-white border-[#0F4C25]" : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" /> Diambil
                  </button>
                </div>
              </div>

              {commodityId && qtyKg && pricePerKg && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[#0F4C25] flex justify-between items-center text-xs">
                  <span className="font-black">Nilai Kontrak</span>
                  <span className="font-black text-sm">
                    {formatRupiah((Number(qtyKg) || 0) * (Number(pricePerKg) || 0))}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full h-11 bg-[#0F4C25] hover:bg-[#0A381B] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <FileSignature className="w-4 h-4 text-emerald-300" />
                Terbitkan Kontrak
              </button>
            </form>
          </div>
        </div>
      )}

      <Snackbar snackbar={snackbar} onDismiss={dismissSnackbar} />
    </div>
  );
}
