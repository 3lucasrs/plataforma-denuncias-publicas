"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TComplaintSchema, ComplaintSchema } from "@/types/complaint";
import { createComplaint, uploadAttachments } from "@/services/complaintService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus, Send, X } from "lucide-react";
import { reportCategories } from "@/lib/constants";
import { useState } from "react";
import Image from "next/image";

export default function SubmitReportPage() {
  const router = useRouter();

  // Lucas: Anexos
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Fim anexos

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TComplaintSchema>({
    resolver: zodResolver(ComplaintSchema),
  });

  const onSubmit = async (data: TComplaintSchema) => {
    let newComplaint;
    try {
      toast.loading("Registrando denúncia...");
      newComplaint = await createComplaint(data);
      toast.dismiss();

      if (files.length > 0 && newComplaint.id) {
        toast.loading("Enviando anexos...");
        await uploadAttachments(newComplaint.id, files);
        toast.dismiss();
      }

      toast.success("Denúncia enviada com sucesso!");
      reset();
      setFiles([]);
      setPreviews([]);
      router.push("/my-reports");
    } catch (err: any) {
      toast.dismiss();
      // Lucas: Se o upload falhar, mas a denúncia foi criada, idealmente deveríamos deletá-la
      // (Isso é uma melhoria para o futuro)
      const errorMessage = err.response?.data?.message || "Ocorreu um erro.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Fazer uma Denúncia</h1>
        <p className="text-gray-500 mt-1">
          Descreva o problema com o máximo de detalhes possível.
        </p>
      </header>

      <div className=" bg-white p-8 rounded-lg shadow-sm border ">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título da Denúncia
            </label>
            <input
              id="title"
              {...register("title")}
              placeholder="Ex: Poste de luz queimado"
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4] placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição Detalhada
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Descreva o problema, a localização exata, há quanto tempo ocorre, etc."
              rows={5}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4] placeholder:text-gray-400"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoria
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4]"
              >
                <option value="" disabled>
                  Selecione uma categoria...
                </option>
                {reportCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="neighborhood"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bairro
              </label>
              <input
                id="neighborhood"
                {...register("neighborhood")}
                placeholder="Ex: Centro"
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4] placeholder:text-gray-400"
              />
              {errors.neighborhood && (
                <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rua
              </label>
              <input
                id="address"
                {...register("address")}
                placeholder="Ex: Rua Principal, Av. Brasil"
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4] placeholder:text-gray-400"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="complement"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Complemento e Ponto de Referência
              </label>
              <input
                id="complement"
                {...register("complement")}
                placeholder="Ex: em frente à padaria, apto 101"
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-[#5697c4] focus:border-[#5697c4] placeholder:text-gray-400"
              />
              {errors.complement && (
                <p className="text-red-500 text-xs mt-1">{errors.complement.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anexar Fotos (opcional)
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#5697c4] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#5697c4] focus-within:ring-offset-2 hover:text-[#5697c4]"
                  >
                    <span>Selecione os arquivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF até 5MB</p>
              </div>
            </div>
          </div>

          {previews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">Imagens selecionadas:</p>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {previews.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md object-cover w-full h-24"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 justify-center py-3 px-6 font-medium rounded-lg text-white bg-[#3d7dab] hover:bg-[#5697c4] disabled:bg-[#6cb9ef]"
            >
              <Send size={18} />
              {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
