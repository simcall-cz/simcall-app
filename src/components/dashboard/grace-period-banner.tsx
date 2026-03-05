"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

export function GracePeriodBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [daysOverdue, setDaysOverdue] = useState(0);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/subscription", { headers });
        const data = await res.json();
        
        if (data && !data.error && data.status === "active" && data.billingMethod === "invoice" && data.currentPeriodEnd) {
          const expirationDate = new Date(data.currentPeriodEnd);
          const today = new Date();
          
          if (today > expirationDate) {
            const diffTime = Math.abs(today.getTime() - expirationDate.getTime());
            const overdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (overdue > 0 && overdue <= 10) {
              setDaysOverdue(overdue);
              setIsVisible(true);
            }
          }
        }
      } catch (err) {
        // silent
      }
    }
    checkSubscription();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-sm">
      <div className="flex items-start sm:items-center gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-sm">
          <p className="font-semibold">Faktura po splatnosti ({daysOverdue} dní)</p>
          <p className="text-amber-50 mt-0.5 sm:mt-0">
            Vaše předplatné nebylo uhrazeno. Účet bude zablokován po uplynutí 10 dní od splatnosti. Prosím, zkontrolujte svůj e-mail nebo nás kontaktujte.
          </p>
        </div>
      </div>
    </div>
  );
}
