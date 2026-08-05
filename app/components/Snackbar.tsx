"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type SnackbarType = "success" | "error" | "info";

export interface SnackbarState {
  show: boolean;
  message: string;
  type: SnackbarType;
}

export const EMPTY_SNACKBAR: SnackbarState = { show: false, message: "", type: "success" };

export function useSnackbar() {
  const [snackbar, setSnackbar] = React.useState<SnackbarState>(EMPTY_SNACKBAR);

  const showSnackbar = React.useCallback((message: string, type: SnackbarType = "success") => {
    setSnackbar({ show: true, message, type });
    window.setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, show: false }));
    }, type === "error" ? 4000 : 3000);
  }, []);

  const dismissSnackbar = React.useCallback(() => {
    setSnackbar((prev) => ({ ...prev, show: false }));
  }, []);

  return { snackbar, showSnackbar, dismissSnackbar };
}

interface SnackbarProps {
  snackbar: SnackbarState;
  onDismiss: () => void;
}

export default function Snackbar({ snackbar, onDismiss }: SnackbarProps) {
  if (!snackbar.show) return null;

  return (
    <div className="fixed bottom-22 sm:bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1A1C19]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700/80 animate-slide-up max-w-[92vw] sm:max-w-md">
      {snackbar.type === "error" ? (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      ) : snackbar.type === "info" ? (
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <p className="text-xs font-bold leading-snug">{snackbar.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 text-gray-400 hover:text-white rounded-lg ml-auto shrink-0 cursor-pointer active:scale-95 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
