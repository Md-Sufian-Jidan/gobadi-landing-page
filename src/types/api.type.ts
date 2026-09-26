export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── User List Page Types ─────────────────────────────────────────────────────

export type Period = "last_7_days" | "last_30_days" | "this_year";

export interface StatWithChange {
  value: number;
  changePercent: number;
  isPositive: boolean;
}

export interface UserListStats {
  totalFarmers: StatWithChange;
  totalDoctors: StatWithChange;
  activeAnimals: StatWithChange;
  referralUsers: StatWithChange;
}

export interface UserLocationData {
  chartData: { location: string; count: number }[];
}

export interface DailyUserData {
  chartData: { day: string; users: number }[];
  summary: {
    total: number;
    changePercent: number;
    isPositive: boolean;
  };
}

export interface RegisteredAnimalData {
  chartData: { day: string; fullDay: string; count: number }[];
  summary: {
    total: number;
    changePercent: number;
    isPositive: boolean;
  };
}

export interface TaskFeatureUserData {
  chartData: { month: string; value: number }[];
  summary: {
    total: number;
    changePercent: number;
    isPositive: boolean;
  };
}

// ─── Animal List Page Types ───────────────────────────────────────────────────

export interface AnimalOwner {
  name: string;
  tag: string;
  avatar: string | null;
}

export interface AnimalListItem {
  id: number;
  animalTag: string;
  animalName: string;
  category: string;
  avatar: string | null;
  age: string;
  breed: string;
  gender: string;
  liveWeight: string;
  price: string;
  vaccinationDate: string;
  doctorVisit: string;
  owner: AnimalOwner;
}
