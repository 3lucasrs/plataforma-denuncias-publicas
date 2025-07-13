import api from "@/lib/api";
import { AuthResponse } from "@/types";
import { TUserRegistrationSchema } from "@/types/auth";

export const login = async (cpf?: string, password?: string) => {
  const response = await api.post<AuthResponse>("auth/login", { cpf, password });
  return response.data;
};

export const register = async (
  userData: Omit<TUserRegistrationSchema, "confirmPassword">
) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const uploadAvatar = async (
  formData: FormData
): Promise<{ avatarUrl: string }> => {
  const response = await api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
