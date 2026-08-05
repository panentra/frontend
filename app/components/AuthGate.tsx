"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/lib/api";

function LoadingScreen() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F2F8F3] to-[#E8F3EA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    const isProtected =
      pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname.startsWith("/pemasok/dashboard");
    const isPublic =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/welcome" ||
      pathname.startsWith("/onboarding");

    if (isProtected && !token) {
      router.replace("/");
    } else if (isPublic && token && user) {
      router.replace(user.role === "pemasok" ? "/pemasok/dashboard" : "/dashboard");
    }
    setChecked(true);
  }, [pathname, router]);

  if (!checked) return <LoadingScreen />;

  return <>{children}</>;
}
