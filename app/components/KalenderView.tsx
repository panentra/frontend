"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  CheckCircle2,
  Clock,
  X,
  Check,
} from "lucide-react";
import Button from "./Button";
import { Land } from "@/lib/api";

interface KalenderViewProps {
  lands?: Land[];
}

export interface ScheduleItem {
  id: number;
  day: number; // 1 - 31
  monthYear: string; // "Agustus 2026"
  title: string;
  crop: string;
  time: string;
  status: "pending" | "completed";
  type: "fertilizer" | "water" | "harvest" | "pest" | "care";
  desc: string;
}

const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 1,
    day: 3,
    monthYear: "Agustus 2026",
    title: "Pemupukan Susulan NPK Presisi",
    crop: "Cabai Rawit Red",
    time: "08:00 WIB",
    status: "completed",
    type: "fertilizer",
    desc: "Gunakan 15kg NPK 16-16-16 + 2kg Kalsium Nitrate disiram ke perakaran.",
  },
  {
    id: 2,
    day: 4,
    monthYear: "Agustus 2026",
    title: "Pengecekan Kelembapan & PH Tanah",
    crop: "Pakcoy Hydro",
    time: "07:00 WIB",
    status: "pending",
    type: "water",
    desc: "Target PH 6.0 - 6.5, atur debit air nutrisi AB Mix 1.200 PPM.",
  },
  {
    id: 3,
    day: 6,
    monthYear: "Agustus 2026",
    title: "Estimasi Panen Raya Tahap 1",
    crop: "Cabai Rawit Red",
    time: "06:30 WIB",
    status: "pending",
    type: "harvest",
    desc: "Estimasi 450 kg siap petik grade A. Hubungi mitra pembeli H-1 panen.",
  },
  {
    id: 4,
    day: 8,
    monthYear: "Agustus 2026",
    title: "Penyemprotan Pestisida Organik Neem",
    crop: "Tomat Super",
    time: "16:00 WIB",
    status: "pending",
    type: "pest",
    desc: "Pencegahan ulat buah dan kutu kebul secara alami saat sore hari.",
  },
  {
    id: 5,
    day: 15,
    monthYear: "Agustus 2026",
    title: "Pemangkasan Tunas Air & Daun Tua",
    crop: "Cabai Rawit Red",
    time: "07:30 WIB",
    status: "pending",
    type: "care",
    desc: "Pangkas cabang bawah untuk memaksimalkan sirkulasi udara & pembentukan buah.",
  },
  {
    id: 6,
    day: 22,
    monthYear: "Agustus 2026",
    title: "Pemberian Nutrisi AB Mix Tahap 2",
    crop: "Pakcoy Hydro",
    time: "08:00 WIB",
    status: "pending",
    type: "fertilizer",
    desc: "Tambah kepekatan nutrisi menjadi 1.400 PPM menjelang panen.",
  },
];

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const SEASONAL_CROPS = [
  { id: "semua", name: "Semua Komoditas"},
  { id: "Cabai Rawit Red", name: "Cabai Rawit Red"},
  { id: "Pakcoy Hydro", name: "Pakcoy Hydro"},
  { id: "Tomat Super", name: "Tomat Super" },
];

const TYPE_CONFIG = {
  fertilizer: { label: "Pemupukan", color: "bg-emerald-500", text: "text-emerald-700", bgLight: "bg-emerald-50 border-emerald-200" },
  water: { label: "Penyiraman & pH", color: "bg-blue-500", text: "text-blue-700", bgLight: "bg-blue-50 border-blue-200" },
  harvest: { label: "Panen", color: "bg-amber-500", text: "text-amber-700", bgLight: "bg-amber-50 border-amber-200" },
  pest: { label: "Pestisida", color: "bg-rose-500", text: "text-rose-700", bgLight: "bg-rose-50 border-rose-200" },
  care: { label: "Perawatan", color: "bg-purple-500", text: "text-purple-700", bgLight: "bg-purple-50 border-purple-200" },
};

export default function KalenderView({ lands }: KalenderViewProps = {}) {
  const [selectedCrop, setSelectedCrop] = useState("semua");
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);

  const seasonalCrops = React.useMemo(() => {
    if (lands && lands.length > 0) {
      const cropSet = new Set<string>();
      lands.forEach((l) => {
        if (l.seasons && l.seasons.length > 0) {
          l.seasons.forEach((s) => {
            const name = s.commodity?.name || s.name || l.commodity?.name || l.name;
            if (name) cropSet.add(name);
          });
        } else if (l.commodity?.name) {
          cropSet.add(l.commodity.name);
        } else if (l.name) {
          cropSet.add(l.name);
        }
      });
      const list = Array.from(cropSet).map((c) => ({ id: c, name: c }));
      return [{ id: "semua", name: "Semua Komoditas" }, ...list];
    }
    return SEASONAL_CROPS;
  }, [lands]);

  const activeLandCrop = React.useMemo(() => {
    return lands?.[0]?.seasons?.[0]?.commodity?.name || lands?.[0]?.commodity?.name || lands?.[0]?.name || "Tomat";
  }, [lands]);

  React.useEffect(() => {
    if (lands && lands.length > 0) {
      setScheduleList((prev) =>
        prev.map((item) => ({
          ...item,
          crop: activeLandCrop,
        }))
      );
      setNewCrop(activeLandCrop);
    }
  }, [lands, activeLandCrop]);
  
  // Selected date on calendar (1-31)
  const [selectedDay, setSelectedDay] = useState<number>(3); // Default today (3 Aug)
  
  // Month & Year state
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(7); // Default 7 = Agustus
  const [selectedYear, setSelectedYear] = useState<number>(2026); // Default 2026

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTargetDay, setModalTargetDay] = useState<number>(3);
  
  // New activity form inputs
  const [newTitle, setNewTitle] = useState("");
  const [newCrop, setNewCrop] = useState("Tomat");
  const [newType, setNewType] = useState<ScheduleItem["type"]>("fertilizer");
  const [newTime, setNewTime] = useState("08:00 WIB");
  const [newDesc, setNewDesc] = useState("");

  const todayNum = 3; // August 3, 2026

  // Dynamic days in selected month and starting day offset
  const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  const startDayOffset = new Date(selectedYear, selectedMonthIndex, 1).getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonthIndex((prev) => prev + 1);
    }
  };

  // Filter schedule based on crop
  const filteredSchedule = scheduleList.filter((item) => {
    if (selectedCrop === "semua") return true;
    return item.crop === selectedCrop;
  });

  const toggleTaskStatus = (id: number) => {
    setScheduleList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "completed" ? "pending" : "completed" }
          : item
      )
    );
  };

  const handleOpenAddModal = (day: number) => {
    setModalTargetDay(day);
    setShowAddModal(true);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ScheduleItem = {
      id: Date.now(),
      day: modalTargetDay,
      monthYear: `${MONTH_NAMES[selectedMonthIndex]} ${selectedYear}`,
      title: newTitle.trim(),
      crop: newCrop,
      time: newTime || "08:00 WIB",
      status: "pending",
      type: newType,
      desc: newDesc.trim() || "Kegiatan rutin perawatan lahan panen.",
    };

    setScheduleList((prev) => [...prev, newItem]);
    setSelectedDay(modalTargetDay);
    setShowAddModal(false);

    // Reset form
    setNewTitle("");
    setNewDesc("");
  };

  // Get items for selected day
  const selectedDayItems = filteredSchedule.filter((item) => item.day === selectedDay);

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1C19] tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0F4C25]" />
            Kalender Musim Tanam
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Jadwal Tanam, Dosis Pupuk & Rekomendasi AI Panentra
          </p>
        </div>
      </div>

      {/* AI Seasonal Recommendation Banner */}
      <div className="bg-gradient-to-br from-[#0F4C25] via-[#1B5E20] to-[#0A381B] rounded-[28px] p-5 sm:p-6 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1.5 max-w-[60%] sm:max-w-[65%]">
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Cuaca Cerah: Saat Terbaik Pemupukan {activeLandCrop}!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Kelembapan udara 68%. Lakukan pemupukan cair sebelum pukul 10.00 WIB untuk penyerapan nutrisi 40% lebih maksimal.
            </p>
          </div>

          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative -mr-4 -mb-11 scale-110 sm:scale-170">
            <Image
              src="/assets/bowo-checklist.png"
              alt="Bowo AI Kalender"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Crop Selector Filter Pills */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-[#1A1C19] uppercase tracking-wider">
          Pilih Komoditas Aktif
        </h3>
        <div className="relative">
          {/* Left Edge Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
            {seasonalCrops.map((crop) => (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCrop(crop.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 border transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCrop === crop.id
                    ? "bg-[#0F4C25] text-white border-[#0F4C25] shadow-xs"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{crop.name}</span>
              </button>
            ))}
          </div>

          {/* Right Edge Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F7F9F7] via-[#F7F9F7]/80 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* ================= UI KALENDER BULANAN INTERAKTIF ================= */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
        {/* Month & Year Header Navigation */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CalendarIcon className="w-5 h-5 text-[#0F4C25] shrink-0" />
            
            {/* Shortcut Month Select */}
            <div className="relative">
              <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                className="h-8.5 pl-2.5 pr-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs sm:text-sm font-black text-[#0F4C25] outline-none cursor-pointer appearance-none transition-colors"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0F4C25] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>

            {/* Shortcut Year Select */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-8.5 pl-2.5 pr-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs sm:text-sm font-black text-[#0F4C25] outline-none cursor-pointer appearance-none transition-colors"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0F4C25] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          </div>

          {/* Prev / Next Month Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#0F4C25] flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#0F4C25] flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Days of the Week Header */}
        <div className="grid grid-cols-7 text-center text-[11px] font-black text-gray-400 uppercase tracking-wider pb-1">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty offset cells for start of month */}
          {Array.from({ length: startDayOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-11 sm:h-13 rounded-2xl bg-gray-50/50" />
          ))}

          {/* Days 1 to daysInMonth */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday = dayNum === todayNum && selectedMonthIndex === 7 && selectedYear === 2026;
            const isSelected = dayNum === selectedDay;

            // Get activities for this day
            const dayActivities = filteredSchedule.filter((item) => item.day === dayNum);
            const hasActivities = dayActivities.length > 0;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-11 sm:h-13 rounded-2xl p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all relative overflow-hidden border ${
                  isSelected
                    ? "border-[#0F4C25] bg-emerald-50/70 ring-2 ring-[#0F4C25]/20 shadow-xs"
                    : isToday
                    ? "border-emerald-500 bg-emerald-50/30"
                    : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50"
                }`}
              >
                {/* Date Number */}
                <span
                  className={`text-xs font-black leading-none ${
                    isSelected
                      ? "text-[#0F4C25]"
                      : isToday
                      ? "text-emerald-700 bg-emerald-200/80 px-1.5 py-0.5 rounded-full"
                      : "text-gray-800"
                  }`}
                >
                  {dayNum}
                </span>

                {/* Indicator Dots for Activities */}
                {hasActivities ? (
                  <div className="flex items-center justify-center gap-0.5 max-w-full overflow-hidden px-1">
                    {dayActivities.slice(0, 3).map((act) => (
                      <span
                        key={act.id}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${TYPE_CONFIG[act.type].color}`}
                        title={`${act.crop}: ${act.title}`}
                      />
                    ))}
                    {dayActivities.length > 3 && (
                      <span className="text-[8px] font-black text-gray-500">+</span>
                    )}
                  </div>
                ) : (
                  <div className="h-1.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend for Activity Indicators */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2 border-t border-gray-100 text-[10px] font-bold text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pemupukan
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Penyiraman & pH
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Panen Raya
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Pestisida
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Perawatan
          </span>
        </div>
      </div>

      {/* ================= DETAIL AGENDA TANGGAL TERPILIH ================= */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-black text-[#1A1C19] tracking-tight whitespace-nowrap">
              Agenda {selectedDay} {MONTH_NAMES[selectedMonthIndex]} {selectedYear}
            </h3>
            {selectedDayItems.length > 0 && (
              <span className="bg-[#0F4C25] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black whitespace-nowrap shrink-0">
                {selectedDayItems.length} Kegiatan
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleOpenAddModal(selectedDay)}
            className="text-xs font-black text-[#0F4C25] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah
          </button>
        </div>

        {selectedDayItems.length === 0 ? (
          <div className="p-6 bg-white rounded-[24px] border border-gray-200 text-center space-y-2">
            <p className="text-xs font-bold text-gray-500">
              Tidak ada kegiatan tanam terjadwal pada tanggal {selectedDay} Agustus 2026.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAddModal(selectedDay)}
              className="text-xs font-black text-[#0F4C25] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Klik untuk menambah kegiatan baru
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayItems.map((item) => {
              const isDone = item.status === "completed";
              const typeCfg = TYPE_CONFIG[item.type];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleTaskStatus(item.id)}
                  className={`p-4 rounded-[22px] border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                    isDone
                      ? "bg-[#F4F6F4] border-gray-200 opacity-75"
                      : "bg-white border-[#E1E4E0] hover:border-emerald-300 shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isDone
                        ? "bg-[#0F4C25] text-white"
                        : "border-2 border-gray-300 hover:border-[#0F4C25]"
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${typeCfg.bgLight} ${typeCfg.text}`}>
                        {item.crop}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 font-bold">
                      <span className="flex items-center gap-1 text-[#0F4C25]">
                        <Clock className="w-3.5 h-3.5" />
                        Pukul {item.time}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">
                        {typeCfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= POP-UP MODAL TAMBAH KEGIATAN TANAM ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-[32px] p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden border border-emerald-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#1A1C19] tracking-tight flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-[#0F4C25]" />
                  Tambah Kegiatan Tanam
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Terjadwal untuk tanggal <strong className="text-[#0F4C25]">{modalTargetDay} {MONTH_NAMES[selectedMonthIndex]} {selectedYear}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama / Judul Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemupukan NPK Susulan Ke-2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] focus:ring-2 focus:ring-[#0F4C25]/10 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Komoditas</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold text-gray-800 bg-white"
                  >
                    <option value="Cabai Rawit Red">Cabai Rawit Red</option>
                    <option value="Pakcoy Hydro">Pakcoy Hydro</option>
                    <option value="Tomat Super">Tomat Super</option>
                    <option value="Kopi Arabika">Kopi Arabika</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jenis Kegiatan</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-bold text-gray-800 bg-white"
                  >
                    <option value="fertilizer">Pemupukan</option>
                    <option value="water">Penyiraman & pH</option>
                    <option value="harvest">Panen Raya</option>
                    <option value="pest">Pestisida</option>
                    <option value="care">Perawatan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Waktu Pelaksanaan</label>
                <input
                  type="text"
                  placeholder="Contoh: 08:00 WIB"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-10 px-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Detail / Catatan Dosis</label>
                <textarea
                  rows={2.5}
                  placeholder="Contoh: Siram 15kg NPK ke perakaran batang utama pada pagi hari..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#0F4C25] font-medium text-xs resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 justify-center py-2.5 rounded-xl font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1 justify-center py-2.5 rounded-xl font-black bg-[#0F4C25] hover:bg-[#0A381B]"
                >
                  Simpan Kegiatan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
