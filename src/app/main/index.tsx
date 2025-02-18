"use client"; // Wajib agar bisa pakai useRouter

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/utils/useAuth";

export default function Home() {
  const router = useRouter();
  // const { isAuthenticated } = useAuth();

  useEffect(() => {
    // if (isAuthenticated !== null) {
      router.replace("main/dashboard");
    // }
    // Redirect ke /dashboard
  }, [router, 
    // isAuthenticated
  ]);

  return null;
}
