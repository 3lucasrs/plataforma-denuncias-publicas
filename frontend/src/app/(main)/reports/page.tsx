"use client";

import { useEffect, useState } from "react";
import { Complaint } from "@/types";
import { getAllComplaints } from "@/services/complaintService";
import { ComplaintCard } from "@/components/ComplaintCard";
import { ComplaintModal } from "@/components/ComplaintModal";

export default function MainPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      setError("Falha ao carregar as denúncias.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleComplaintCreated = () => {
    setIsModalOpen(false);
    fetchComplaints();
  };

  const handleComplaintDeleted = (deletedId: number) => {
    setComplaints((prevComplaints) => prevComplaints.filter((c) => c.id !== deletedId));
  };

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Mural de Denúncias</h1>
        <p className="text-gray-500 mt-1">
          Denúncias enviadas recentemente pela comunidade
        </p>
      </header>

      <div className="space-y-4">
        {isLoading && (
          <p className="text-center text-gray-500">Carregando denúncias...</p>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!isLoading &&
          !error &&
          complaints.length > 0 &&
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onComplaintDeleted={handleComplaintDeleted}
            />
          ))}

        {!isLoading && !error && complaints.length === 0 && (
          <div className="text-center bg-white border rounded-lg p-10">
            <p className="text-gray-500">Nenhuma denúncia encontrada no momento.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ComplaintModal
          onClose={() => setIsModalOpen(false)}
          onComplaintCreated={handleComplaintCreated}
        />
      )}
    </div>
  );
}
