import type { Role } from "@/config/roles";

export type UserSummary = {
  id: number;
  username: string;
  role: Role;
  isActive: boolean;
};

export type UserStatusFilter = "active" | "inactive";

export type UserFilters = {
  query?: string;
  role?: Role;
  status?: UserStatusFilter;
};
