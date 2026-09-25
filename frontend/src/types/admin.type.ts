export type AdminRole = "admin" | "super_admin";
export type AdminDesignation =
  | "founder"
  | "co-founder"
  | "manager"
  | "developer"
  | "analyst"
  | "support";
export type AdminStatus = "active" | "deactive";

export interface Admin {
  id: number;
  name: string | null;
  email: string;
  role: AdminRole;
  designation: AdminDesignation;
  avatar: string | null;
  status: AdminStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminListResponse {
  admins: Admin[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
  designation: AdminDesignation;
  avatar?: string;
  status?: AdminStatus;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  designation?: AdminDesignation;
  avatar?: string;
  status?: AdminStatus;
}
