import api from "@/lib/api";
import { Complaint } from "@/types";
import { Response as ComplaintResponse } from "@/types";
import { TComplaintSchema } from "@/types/complaint";

export const getAllComplaints = async (): Promise<Complaint[]> => {
  const response = await api.get("/complaint");
  return response.data;
};

export const createComplaint = async (data: TComplaintSchema) => {
  const dataToSend = {
    ...data,
    status: "Pending",
  };
  const response = await api.post("/complaint", dataToSend);
  return response.data;
};
export const updateComplaint = async (id: number, data: { status: string }) => {
  const response = await api.put(`/complaint/${id}`, data);
  return response.data;
};

export const deleteComplaint = async (id: number) => {
  const response = await api.delete(`/complaint/${id}`);
  return response.data;
};

export const getResponsesByComplaintId = async (
  id: number
): Promise<ComplaintResponse[]> => {
  const response = await api.get(`/complaint/${id}/responses`);
  return response.data;
};

export const getMyComplaints = async (): Promise<Complaint[]> => {
  const response = await api.get("/complaint/my-complaints");
  return response.data;
};

export const uploadAttachments = async (complaintId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });

  const response = await api.post(`/attachments/${complaintId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
