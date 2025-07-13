"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Newspaper,
  Contact,
} from "lucide-react";
import Image from "next/image";
import { User } from "@/types";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", icon: LayoutDashboard, label: "Ínicio" },
    { href: "/reports", icon: Newspaper, label: "Mural de Denúncias" },
    { href: "/my-reports", icon: FileText, label: "Minhas Denúncias" },
    { href: "/submit-report", icon: PlusCircle, label: "Nova Denúncia" },
    { href: "/profile", icon: UserIcon, label: "Meu Perfil" },
    { href: "/credits", icon: Contact, label: "Créditos" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col">
      <div className="h-24 flex items-center justify-center border-b">
        <Image src="/logo.svg" alt="Logo Cuida+" width={96} height={96} />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        {user && (
          <div className="flex items-center gap-3 mb-4 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold text-sm overflow-hidden">
              {user.avatarUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`}
                  alt={`Foto de perfil de ${user.name}`}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              ) : (
                `${user.name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name} {user.last_name}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};
