"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TreninkRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/hovory/novy-hovor");
  }, [router]);
  return null;
}
