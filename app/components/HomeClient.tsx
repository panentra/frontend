"use client";

import React, { useEffect, useState } from "react";
import OnboardingView from "./OnboardingView";
import DashboardPetani from "./DashboardPetani";
import DashboardPemasok from "./DashboardPemasok";
import { getAuthToken, getAuthUser } from "@/lib/api";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("petani");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      const user = getAuthUser();
      if (user?.role === "pemasok") {
        setUserRole("pemasok");
      } else {
        setUserRole("petani");
      }
    } else {
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#F2F8F3] to-[#E8F3EA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <OnboardingView />;
  }

  if (userRole === "pemasok") {
    return <DashboardPemasok />;
  }

  return <DashboardPetani />;
}
