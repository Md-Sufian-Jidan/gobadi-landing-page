export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminProfile {
  id: number;
  name: string | null;
  email: string;
  role: "admin" | "super_admin";
  designation: string;
  avatar: string | null;
  status: "active" | "deactive";
  phone: string;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}
