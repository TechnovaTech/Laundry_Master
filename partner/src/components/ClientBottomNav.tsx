"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";

export default function ClientBottomNav() {
  const pathname = usePathname();
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => {
    const partner = localStorage.getItem("partner");
    if (partner) {
      const data = JSON.parse(partner);
      setKycApproved(data.kycStatus === "approved");
    }
  }, [pathname]);

  // Hide bottom nav on pre-KYC pages
  const preKycPages = ["/", "/check-availability", "/congrats", "/login", "/verify", "/profile/create", "/profile/kyc"];
  if (preKycPages.includes(pathname) || !kycApproved) return null;

  return <BottomNav />;
}