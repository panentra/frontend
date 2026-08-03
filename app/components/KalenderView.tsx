"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  Droplets,
  Sun,
  Leaf,
  Clock,
  AlertCircle,
} from "lucide-react";
import Button from "./Button";

const SEASONAL_CROPS = [
  { id: "pakcoy", name: "Pakcoy Hydro", category: "Sayuran", duration: "30 Hari", phase: "Masa Pemupukan", icon: "🥬" },
  { id: "cabai", name: "Cabai Rawit Red", category: "Bahan-Bahan", duration: "90 Hari", phase: "Persiapan Panen", icon: "🌶️" },
  { id: "tomat", name: "Tomat Super", category: "Bahan-Bahan", duration: "75 Hari", phase: "Penanaman Bibit", icon: "🍅" },
  { id: "kopi", name: "Kopi Arabika", category: "Perkebunan", duration: "365 Hari", phase: "Perawatan Buah", icon: "☕" },
];

const SCHEDULE_ITEMS = [
  {
    id: 1,
    title: "Pemupukan Susulan NPK Presisi",
    crop: "Cabai Rawit Red",
    date: "Hari Ini, 08:00 WIB",
    status: "pending",
    type: "fertilizer",
    desc: "Gunakan 15kg NPK 16-16-16 + 2kg Kalsium Nitrate disiram ke perakaran.",
  },
  {
    id: 2,
    title: "Pengecekan Kelembapan & PH Tanah",
    crop: "Pakcoy Hydro",
    date: "Besok, 07:00 WIB",
    status: "scheduled",
    type: "water",
    desc: "Target PH 6.0 - 6.5, atur debit air nutrisi AB Mix 1.200 PPM.",
  },
  {
    id: 3,
    title: "Estimasi Panen Raya Tahap 1",
    crop: "Cabai Rawit Red",
    date: "6 Agustus 2026",
    status: "upcoming",
    type: "harvest",
    desc: "Estimasi 450 kg siap petik grade A. Hubungi mitra pembeli H-1 panen.",
  },
  {
    id: 4,
    title: "Penyemprotan Pestisida Organik Neem",
    crop: "Tomat Super",
    date: "8 Agustus 2026",
    status: "upcoming",
    type: "pest",
    desc: "Pencegahan ulat buah dan kutu kebul secara alami.",
  },
];

export default function KalenderView() {
  const [selectedCrop, setSelectedCrop] = useState("cabai");
  const [completedTasks, setCompletedTasks] = useState<number[]>([1]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const toggleTask = (id: number) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter((taskId) => taskId !== id));
    } else {
      setCompletedTasks([...completedTasks, id]);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C19] tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#1B5E20]" />
            Kalender Musim Tanam
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Jadwal Tanam, Dosis Pupuk & Rekomendasi AI Panentra
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#1B5E20] hover:bg-[#154D1A] text-white p-2.5 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          title="Tambah Jadwal Tanam"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* AI Seasonal Recommendation Banner */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#154D1A] rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[68%]">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase text-emerald-100 border border-white/20 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI Musim Tanam Ideal
            </span>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Cuaca Cerah: Saat Terbaik Pemupukan Cabai!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Kelembapan udara 68%. Lakukan pemupukan cair sebelum pukul 10.00 WIB untuk penyerapan nutrisi 40% lebih maksimal.
            </p>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative -mr-2 -mb-2">
            <Image
              src="/assets/bowo-calendar.png"
              alt="Bowo AI Kalender"
              width={110}
              height={110}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-[#1A1C19] uppercase tracking-wider">
          Pilih Komoditas Aktif
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SEASONAL_CROPS.map((crop) => (
            <button
              key={crop.id}
              type="button"
              onClick={() => setSelectedCrop(crop.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 border transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCrop === crop.id
                  ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{crop.icon}</span>
              <span>{crop.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items & Routine Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#1A1C19]">
            Agenda & Jadwal Tanam Minggu Ini
          </h3>
          <span className="text-xs font-bold text-[#1B5E20]">
            {completedTasks.length}/{SCHEDULE_ITEMS.length} Selesai
          </span>
        </div>

        <div className="space-y-2.5">
          {SCHEDULE_ITEMS.map((item) => {
            const isDone = completedTasks.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`p-4 rounded-[22px] border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                  isDone
                    ? "bg-[#F4F6F4] border-gray-200 opacity-75"
                    : "bg-white border-[#E1E4E0] hover:border-emerald-300 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isDone
                      ? "bg-[#1B5E20] text-white"
                      : "border-2 border-gray-300 hover:border-[#1B5E20]"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold ${
                        isDone ? "line-through text-gray-500" : "text-[#1A1C19]"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#1B5E20] rounded-full text-[10px] font-bold shrink-0">
                      {item.crop}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1B5E20]" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-[28px] p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-[#1A1C19]">
              Tambah Jadwal Tanam Baru
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Pemupukan Organik Ke-2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#1B5E20]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tanggal & Waktu</label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#1B5E20]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 justify-center"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    alert("Jadwal tanam baru berhasil ditambahkan!");
                    setShowAddModal(false);
                  }}
                  className="flex-1 justify-center"
                >
                  Simpan Jadwal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
