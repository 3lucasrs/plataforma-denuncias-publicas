"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUserProfileSchema, UserProfileSchema } from "@/types/auth";
import { getProfile, updateProfile, uploadAvatar } from "@/services/userService";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Upload, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function ProfilePage() {
  const { login } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [userCpf, setUserCpf] = useState("");

  // Upload ft perfil
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TUserProfileSchema>({
    resolver: zodResolver(UserProfileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setInitialLoading(true);
      try {
        const userData = await getProfile();
        reset(userData);
        setUserCpf(userData.cpf);
        if (userData.avatarUrl) {
          setAvatarPreview(`${process.env.NEXT_PUBLIC_API_URL}${userData.avatarUrl}`);
        }
      } catch (error) {
        toast.error("Não foi possível carregar seus dados de perfil.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const promise = uploadAvatar(formData);
    toast.promise(promise, {
      loading: "Enviando nova foto...",
      success: (data) => {
        if (data.token) {
          login(data.token);
        }
        setAvatarFile(null);
        return "Foto de perfil atualizada!";
      },
      error: "Erro ao enviar a foto.",
    });
  };

  const onSubmit = async (data: TUserProfileSchema) => {
    const promise = updateProfile(data);
    toast.promise(promise, {
      loading: "Salvando alterações...",
      success: "Perfil atualizado com sucesso!",
      error: (err) => err.response?.data?.message || "Erro ao atualizar o perfil.",
    });
  };

  if (initialLoading) {
    return <div className="p-10 text-center text-gray-500">Carregando perfil...</div>;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">
          Gerencie suas informações pessoais e de contato.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-4 border-white shadow-md overflow-hidden">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Foto de Perfil"
                    fill
                    sizes="128px"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {`${getValues("name")?.[0] || ""}${
                      getValues("last_name")?.[0] || ""
                    }`.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {getValues("name")} {getValues("last_name")}
            </h2>
            <p className="text-sm text-gray-500">{getValues("email")}</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Alterar Foto
            </button>
            {avatarFile && (
              <button
                type="button"
                onClick={handleUploadAvatar}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2 px-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                <Upload size={16} />
                Salvar Nova Foto
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sobrenome
                  </label>
                  <input
                    id="last_name"
                    {...register("last_name")}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone
                </label>
                <input
                  id="phone"
                  {...register("phone")}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  CPF (não pode ser alterado)
                </label>
                <input
                  id="cpf"
                  type="text"
                  value={userCpf}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 justify-center py-2.5 px-6 font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  <UserIcon size={16} />
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
