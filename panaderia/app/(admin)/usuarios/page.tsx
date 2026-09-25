import type { Metadata } from "next";
import { ADMIN_ONLY, isRole } from "@/config/roles";
import { requireRole } from "@/features/auth/session";
import { UsersView } from "@/features/users/components/users-view";
import { listUsers } from "@/features/users/queries";
import type { UserStatusFilter } from "@/features/users/types";
import { readSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Usuarios",
};

function isUserStatusFilter(value: string): value is UserStatusFilter {
  return value === "active" || value === "inactive";
}

export default async function UsersPage({ searchParams }: PageProps<"/usuarios">) {
  const currentUser = await requireRole(ADMIN_ONLY);
  const params = await searchParams;
  const role = readSearchParam(params.role);
  const status = readSearchParam(params.status);

  const users = await listUsers({
    query: readSearchParam(params.q),
    role: isRole(role) ? role : undefined,
    status: isUserStatusFilter(status) ? status : undefined,
  });

  return <UsersView users={users} currentUserId={currentUser.id} />;
}
