"use client";

import { useState } from "react";
import { Response } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { updateResponse, deleteResponse } from "@/services/responseService";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface ResponseItemProps {
  response: Response;
  onResponseDeleted: (responseId: number) => void;
  onResponseUpdated: (updatedResponse: Response) => void;
}

export const ResponseItem = ({
  response,
  onResponseDeleted,
  onResponseUpdated,
}: ResponseItemProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(response.message);

  const canEdit = user?.userId === response.User?.id;
  const canDelete = user?.userId === response.User?.id || user?.admin;

  const handleUpdate = () => {
    const promise = updateResponse(response.id, { message: editedMessage });
    toast.promise(promise, {
      loading: "Salvando...",
      success: (updatedResponse) => {
        onResponseUpdated(updatedResponse);
        setIsEditing(false);
        return "Comentário atualizado!";
      },
      error: "Erro ao salvar.",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      const promise = deleteResponse(response.id);
      toast.promise(promise, {
        loading: "Excluindo...",
        success: () => {
          onResponseDeleted(response.id);
          return "Comentário excluído!";
        },
        error: "Erro ao excluir.",
      });
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 text-sm bg-gray-50 rounded-md border group">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-[#5697c4] font-bold text-xs overflow-hidden">
        {response.User?.avatarUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${response.User.avatarUrl}`}
            alt={`Foto de ${response.User.name}`}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        ) : (
          `${response.User?.name?.[0] || ""}${
            response.User?.last_name?.[0] || ""
          }`.toUpperCase()
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-800">{`${response.User?.name} ${response.User?.last_name}`}</p>
            <p className="text-xs text-gray-400">
              {new Date(response.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="flex gap-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                title="Editar Comentário"
                className="hover:text-blue-600"
              >
                <Edit size={16} />
              </button>
            )}
            {canDelete && !isEditing && (
              <button
                onClick={handleDelete}
                title="Excluir Comentário"
                className="hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {!isEditing ? (
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{response.message}</p>
        ) : (
          <div className="mt-2">
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-2 justify-center py-3 px-6 font-medium rounded-lg text-gray-800 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                className="inline-flex items-center gap-2 justify-center py-3 px-6 font-medium rounded-lg text-white bg-[#3dab78] hover:bg-[#56c491] disabled:bg-[#6cef8f]"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
