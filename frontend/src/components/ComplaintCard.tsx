"use client";

import { useState, useEffect } from "react";
import { Complaint, Response } from "@/types";
import { createResponse } from "@/services/responseService";
import { useAuth } from "@/contexts/AuthContext";
import {
  deleteComplaint,
  getResponsesByComplaintId,
  updateComplaint,
} from "@/services/complaintService";
import { ResponseItem } from "./ResponseItem";
import toast from "react-hot-toast";
import { ChevronDown, MapPinned, Paperclip, Send, Trash2 } from "lucide-react";
import Image from "next/image";

interface ComplaintCardProps {
  complaint: Complaint;
  onComplaintDeleted: (id: number) => void;
}

const statusColors = {
  Pending: "bg-amber-300 text-amber-800",
  "In Progress": "bg-blue-300 text-blue-800",
  Resolved: "bg-green-300 text-green-800",
};

export const ComplaintCard = ({ complaint, onComplaintDeleted }: ComplaintCardProps) => {
  const { user } = useAuth();
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [newResponseMessage, setNewResponseMessage] = useState("");
  const [isPostingResponse, setIsPostingResponse] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(complaint.status);

  useEffect(() => {
    setCurrentStatus(complaint.status);
  }, [complaint.status]);

  const handleResponseUpdated = (updatedResponse: Response) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === updatedResponse.id ? updatedResponse : r))
    );
  };

  const handleResponseDeleted = (deletedResponseId: number) => {
    setResponses((prev) => prev.filter((r) => r.id !== deletedResponseId));
  };

  const handleFetchResponses = async () => {
    setResponsesLoading(true);
    try {
      const complaintResponses = await getResponsesByComplaintId(complaint.id);
      setResponses(complaintResponses);
    } catch (err) {
      toast.error("Não foi possível carregar as respostas.");
      console.error(err);
    } finally {
      setResponsesLoading(false);
    }
  };

  const toggleResponses = () => {
    const newShowState = !showResponses;
    setShowResponses(newShowState);
    if (newShowState && responses.length === 0) {
      handleFetchResponses();
    }
  };

  const handlePostResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponseMessage.trim()) return;
    setIsPostingResponse(true);
    try {
      const newCompleteResponse = await createResponse({
        complaintId: complaint.id,
        message: newResponseMessage,
      });
      setResponses((prevResponses) => [...prevResponses, newCompleteResponse]);
      setNewResponseMessage("");
      toast.success("Resposta enviada com sucesso!");
    } catch (err) {
      toast.error("Erro ao enviar resposta.");
    } finally {
      setIsPostingResponse(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta denúncia?")) {
      const promise = deleteComplaint(complaint.id);
      toast.promise(promise, {
        loading: "Excluindo denúncia...",
        success: () => {
          onComplaintDeleted(complaint.id);
          return "Denúncia excluída com sucesso!";
        },
        error: "Erro ao excluir a denúncia.",
      });
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as "Pending" | "In Progress" | "Resolved";
    setCurrentStatus(newStatus);
    const promise = updateComplaint(complaint.id, { status: newStatus });
    toast.promise(promise, {
      loading: "Atualizando status...",
      success: "Status atualizado com sucesso!",
      error: (err) => {
        setCurrentStatus(complaint.status);
        return "Erro ao atualizar o status.";
      },
    });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div
        className="flex items-center p-4 gap-4 cursor-pointer hover:bg-gray-50"
        onClick={toggleResponses}
      >
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold text-base overflow-hidden">
          {complaint.User?.avatarUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${complaint.User.avatarUrl}`}
              alt={`Foto de ${complaint.User.name}`}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            `${complaint.User?.name?.[0] || ""}${
              complaint.User?.last_name?.[0] || ""
            }`.toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{complaint.title}</p>
          <p className="text-sm text-gray-500">
            por {complaint.User?.name} {complaint.User?.last_name}
          </p>
        </div>

        {complaint.Attachments && complaint.Attachments.length > 0 && (
          <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
            <Paperclip size={14} />
            <span className="text-sm font-medium">{complaint.Attachments.length}</span>
          </div>
        )}

        <div className="flex-shrink-0 w-32 text-center">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              statusColors[currentStatus || "Pending"]
            }`}
          >
            {currentStatus}
          </span>
        </div>

        <div className="flex-shrink-0 w-24 text-right text-sm text-gray-500">
          {new Date(complaint.createdAt).toLocaleDateString("pt-BR")}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {user?.admin && (
            <div className="flex items-center gap-2">
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-xs border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button
                onClick={handleDelete}
                title="Excluir Denúncia"
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-300 ${
              showResponses ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {showResponses && (
        <div className="p-4 border-t space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-gray-600 uppercase tracking-wider">
              Detalhes da Denúncia
            </h4>
            <p className="text-sm text-gray-700">{complaint.description}</p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <MapPinned size={14} />
              <span>{`${complaint.address}, ${complaint.neighborhood}`}</span>
            </p>
          </div>

          {complaint.Attachments && complaint.Attachments.length > 0 && (
            <div>
              <hr />
              <h4 className="font-semibold text-sm my-2 text-gray-600 uppercase tracking-wider">
                Anexos
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {complaint.Attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${complaint.id}/${attachment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${complaint.id}/${attachment.url}`}
                      alt="Anexo da denúncia"
                      width={150}
                      height={150}
                      className="rounded-md object-cover w-full h-24 hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <hr />

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-600 uppercase tracking-wider">
              Comentários
            </h4>
            {responsesLoading && (
              <p className="text-sm text-gray-500 text-center">Carregando...</p>
            )}

            {!responsesLoading && responses.length > 0 && (
              <div className="space-y-3">
                {responses.map((resp) => (
                  <ResponseItem
                    key={resp.id}
                    response={resp}
                    onResponseUpdated={handleResponseUpdated}
                    onResponseDeleted={handleResponseDeleted}
                  />
                ))}
              </div>
            )}
            {!responsesLoading && responses.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
            )}

            <form onSubmit={handlePostResponse} className="pt-4 mt-4 border-t">
              <textarea
                value={newResponseMessage}
                onChange={(e) => setNewResponseMessage(e.target.value)}
                placeholder="Adicionar um comentário..."
                rows={2}
                className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                disabled={isPostingResponse}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 justify-center py-3 px-6 font-medium rounded-lg text-white bg-[#3d7dab] hover:bg-[#5697c4] disabled:bg-[#6cb9ef]"
                  disabled={isPostingResponse}
                >
                  <Send size={18} />
                  {isPostingResponse ? "Enviando..." : "Enviar Comentário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
