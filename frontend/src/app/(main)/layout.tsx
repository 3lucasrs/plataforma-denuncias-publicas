"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [isLoading, token, router]);

  if (isLoading || !token) {
    return (
      <div className="flex bg-white items-center justify-center h-screen">
        <p className="text-black">Carregando...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        user={user}
        onLogout={() => {
          logout();
          router.push("/login");
        }}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
