import api from "@/lib/api";
import { User } from "@/types";
import { TUserProfileSchema } from "@/types/auth";

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (data: TUserProfileSchema): Promise<User> => {
  const response = await api.put("/users/me", data);
  return response.data;
};

export const uploadAvatar = async (
  formData: FormData
): Promise<{ avatarUrl: string; token: string }> => {
  const response = await api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
