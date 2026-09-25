export type UserRole = "user" | "doctor" | "clinic" | "admin";

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  address?: string | null;
  noOfAnimal?: string | null;
  addedTask?: string;
  appointments?: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  address?: string | null;
  pendingAppointments?: string | null;
  completedAppointments?: string;
  totalAppointments?: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  role?: UserRole;
  verified?: boolean;
}
