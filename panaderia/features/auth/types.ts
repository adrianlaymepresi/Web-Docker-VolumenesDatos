import type { Role } from "@/config/roles";

export type CurrentUser = {
  id: number;
  username: string;
  role: Role;
};
