export interface User {
  id: number;
  name: string;
  last_name: string;
  cpf: string;
  email: string;
  phone: string;
  admin: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "In Progress" | "Resolved";
  neighborhood: string;
  address: string;
  complement: string;
  createdAt: string;
  User: {
    id: number;
    name: string;
    last_name: string;
    avatarUrl: string;
  };
  Attachments?: Attachment[];
}

export interface Attachment {
  id: number;
  type: string;
  url: string;
}

export interface Response {
  id: number;
  message: string;
  complaintId: number;
  createdAt: string;
  User: {
    id: number;
    name: string;
    last_name: string;
    avatarUrl: string;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  token: string;
}
