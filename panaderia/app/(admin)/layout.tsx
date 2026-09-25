import { AppShell } from "@/components/layout/app-shell";
import { getNavigationForRole } from "@/config/navigation";
import { requireUser } from "@/features/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <AppShell user={user} navigationItems={getNavigationForRole(user.role)}>
      {children}
    </AppShell>
  );
}
