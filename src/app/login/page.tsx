
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Instantly bypass login screen
    router.push("/");
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <p>Bypassing login...</p>
    </div>
  );
}
