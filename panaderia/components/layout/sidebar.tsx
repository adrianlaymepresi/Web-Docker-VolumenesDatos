"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Croissant, KeyRound, LogOut, Package, Tags, UserRound, Users, type LucideIcon } from "lucide-react";
import type { NavigationItem, NavigationItemKey } from "@/config/navigation";
import { ROLE_LABELS } from "@/config/roles";
import { logout } from "@/features/auth/actions";
import type { CurrentUser } from "@/features/auth/types";

const navigationIcons: Record<NavigationItemKey, LucideIcon> = {
  users: Users,
  categories: Tags,
  products: Package,
};

type SidebarProps = {
  user: CurrentUser;
  navigationItems: NavigationItem[];
  onNavigate: () => void;
  onChangePassword: () => void;
};

export function Sidebar({ user, navigationItems, onNavigate, onChangePassword }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-secondary-strong text-text-inverse">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary shadow-md">
          <Croissant aria-hidden className="size-6" />
        </div>
        <span className="font-display text-2xl font-bold tracking-wide">PANADERIA</span>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const Icon = navigationIcons[item.key];
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive ? "bg-background text-primary shadow-sm" : "text-text-inverse/80 hover:bg-secondary hover:text-text-inverse"
                  }`}
                >
                  <Icon aria-hidden className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-2xl bg-secondary p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-secondary-strong">
            <UserRound aria-hidden className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{user.username}</p>
            <p className="text-xs text-text-inverse/70">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={onChangePassword}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-inverse/90 hover:bg-secondary-strong"
          >
            <KeyRound aria-hidden className="size-4" />
            Cambiar contraseña
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-inverse/90 hover:bg-primary"
            >
              <LogOut aria-hidden className="size-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
