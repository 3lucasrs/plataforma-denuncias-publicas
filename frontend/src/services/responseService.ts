import api from "@/lib/api";
import { Response } from "@/types";

export const getAllResponses = async (): Promise<Response[]> => {
  const response = await api.get("/response");
  return response.data;
};

export const createResponse = async (data: {
  complaintId: number;
  message: string;
}): Promise<Response> => {
  const response = await api.post("/response", data);
  return response.data;
};

export const updateResponse = async (
  id: number,
  data: { message: string }
): Promise<Response> => {
  const response = await api.put(`/response/${id}`, data);
  return response.data;
};

export const deleteResponse = async (id: number): Promise<void> => {
  await api.delete(`/response/${id}`);
};
