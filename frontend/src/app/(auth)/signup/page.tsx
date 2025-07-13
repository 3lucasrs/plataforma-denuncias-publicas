"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUserRegistrationSchema, UserRegistrationSchema } from "@/types/auth";
import { register as registerService } from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TUserRegistrationSchema>({
    resolver: zodResolver(UserRegistrationSchema),
  });

  const onSubmit = async (data: TUserRegistrationSchema) => {
    try {
      const { confirmPassword, ...userData } = data;
      const response = await registerService(userData);

      toast.success(response.message || "Cadastro realizado com sucesso!");
      reset();
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao realizar o cadastro.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-6 sm:px-12 lg:px-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Formulário de Cadastro</h1>
            <p className="mt-2 text-gray-500">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:underline">
                Faça o login
              </Link>
            </p>
          </div>

          <form
            className="space-y-4 placeholder:text-gray-400 text-gray-600"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <input
                  {...register("name")}
                  placeholder="Nome"
                  className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div className="w-full">
                <input
                  {...register("last_name")}
                  placeholder="Sobrenome"
                  className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("cpf")}
                placeholder="CPF"
                className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              />
              {errors.cpf && (
                <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="E-mail"
                className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="Telefone"
                className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                {...register("password")}
                placeholder="Senha (mínimo 6 caracteres)"
                className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirme sua Senha"
                className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
                <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                  <ArrowRight className="h-5 w-5 text-indigo-400" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden bg-indigo-500 lg:flex lg:flex-col lg:items-center lg:justify-center p-12 text-white">
        <div className="text-center">
          <Image
            src="/logo_white.svg"
            alt="Logo Cuida+"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold tracking-tight">Crie sua Conta no Cuida+</h1>
          <p className="mt-4 text-indigo-200 text-lg">
            Faça parte da mudança na sua cidade.
          </p>
        </div>
      </div>
    </div>
  );
}
