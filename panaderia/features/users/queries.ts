import "server-only";
import { getPrisma } from "@/lib/prisma";
import type { UserFilters, UserSummary } from "@/features/users/types";

export async function listUsers({ query, role, status }: UserFilters): Promise<UserSummary[]> {
  return getPrisma().user.findMany({
    where: {
      username: query ? { contains: query } : undefined,
      role,
      isActive: status ? status === "active" : undefined,
    },
    select: { id: true, username: true, role: true, isActive: true },
    orderBy: { username: "asc" },
  });
}
