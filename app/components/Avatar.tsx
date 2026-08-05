"use client";

import React from "react";

const AVATAR_COLORS = [
  "#0F4C25",
  "#2E7D32",
  "#1B5E20",
  "#00695C",
  "#00796B",
  "#00897B",
  "#4E342E",
  "#5D4037",
  "#37474F",
  "#455A64",
  "#1565C0",
  "#283593",
  "#6A1B9A",
  "#AD1457",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function avatarColor(name?: string): string {
  return AVATAR_COLORS[hashName(name || "?") % AVATAR_COLORS.length];
}

interface AvatarProps {
  name?: string;
  size?: number;
  className?: string;
  textClassName?: string;
}

export default function Avatar({ name, size = 40, className = "", textClassName = "" }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-black select-none overflow-hidden shrink-0 ${className}`}
      style={{ backgroundColor: avatarColor(name), width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-label={name || "Avatar"}
    >
      <span className={`leading-none ${textClassName}`}>{getInitials(name)}</span>
    </div>
  );
}
