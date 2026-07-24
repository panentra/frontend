"use client";

import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styling
  const baseClasses =
    "inline-flex items-center justify-center transition-all cursor-pointer font-bold select-none disabled:opacity-75 disabled:cursor-not-allowed";

  // Size styling
  const sizeClasses = {
    sm: "h-10 px-4 text-xs rounded-xl",
    md: "h-12 px-5 text-sm rounded-2xl",
    lg: "h-14 px-6 text-base rounded-2xl",
  }[size];

  // Variant styling
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-95 text-white shadow-md shadow-[#1B5E20]/20 active:scale-[0.99]",
    secondary:
      "bg-white/80 hover:bg-white border border-[#1B5E20]/30 text-[#1B5E20] shadow-sm active:scale-[0.99]",
    outline:
      "bg-transparent border border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20]/10 active:scale-[0.99]",
    ghost: "bg-transparent text-[#4B5563] hover:text-[#111827]",
  }[variant];

  // Width styling
  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
