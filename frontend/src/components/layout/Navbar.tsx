"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User } from "@/types";
import { LogOut, User as UserIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const navLinks = [
  { href: "/reports", label: "Mural de Denúncias" },
  { href: "/my-reports", label: "Minhas Denúncias" },
  { href: "/submit-report", label: "Fazer Denúncia" },
  { href: "/credits", label: "Créditos" },
];

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="Logo Cuida+" width={60} height={40} />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base transition-colors font-medium ${
                      isActive
                        ? "text-[#5697c4] !font-bold"
                        : "text-gray-600 hover:text-[#5697c4]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center">
            {user && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5697c4] focus:ring-offset-2">
                    <span className="sr-only">Abrir menu do usuário</span>

                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-[#5697c4] font-bold text-sm overflow-hidden">
                      {user.avatarUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`}
                          alt={`Foto de ${user.name}`}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        `${user.name?.[0] || ""}${
                          user.last_name?.[0] || ""
                        }`.toUpperCase()
                      )}
                    </div>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name} {user.last_name}
                      </p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserIcon size={16} />
                          Meu Perfil
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLogout}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600`}
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
