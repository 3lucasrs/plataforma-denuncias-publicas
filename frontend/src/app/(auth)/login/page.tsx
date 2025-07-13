"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(cpf, password);
      if (data.token) {
        authLogin(data.token);
        router.push("/");
      }
    } catch (err) {
      setError("CPF ou senha inválidos. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-indigo-500 lg:flex lg:flex-col lg:items-center lg:justify-center p-12 text-white">
        <div className="text-center">
          <Image
            src="/logo_white.svg"
            alt="Logo Cuida+"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao Cuida+</h1>
          <p className="mt-4 text-indigo-200 text-lg">
            A sua voz para uma cidade melhor.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center lg:hidden mb-8">
            <Image
              src="/logo.svg"
              alt="Logo Cuida+"
              width={50}
              height={50}
              className="mx-auto"
            />
          </div>

          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Acesse sua conta</h1>
            <p className="mt-2 text-gray-500">
              Não tem uma conta?{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 text-gray-600"
                placeholder="Seu CPF"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 text-gray-600"
                placeholder="Sua senha"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Entrando..." : "Entrar"}
                <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                  <ArrowRight className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
