"use client";

import { useState, type ReactNode } from "react";
import { Croissant, Menu, X } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import type { NavigationItem } from "@/config/navigation";
import { ChangeOwnPasswordDialog } from "@/features/auth/components/change-own-password-dialog";
import type { CurrentUser } from "@/features/auth/types";

type AppShellProps = {
  user: CurrentUser;
  navigationItems: NavigationItem[];
  children: ReactNode;
};

export function AppShell({ user, navigationItems, children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const sidebar = (
    <Sidebar
      user={user}
      navigationItems={navigationItems}
      onNavigate={() => setIsMobileMenuOpen(false)}
      onChangePassword={() => {
        setIsMobileMenuOpen(false);
        setIsPasswordDialogOpen(true);
      }}
    />
  );

  return (
    <div className="min-h-dvh lg:pl-72">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-text-inverse">
            <Croissant aria-hidden className="size-5" />
          </div>
          <span className="font-display text-xl font-bold text-primary">PANADERIA</span>
        </div>
        <IconButton label="Abrir menú" tone="secondary" onClick={() => setIsMobileMenuOpen(true)} aria-expanded={isMobileMenuOpen}>
          <Menu aria-hidden className="size-6" />
        </IconButton>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 size-full bg-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {sidebar}
            <IconButton
              label="Cerrar menú"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-3 top-3 text-text-inverse hover:bg-secondary hover:text-text-inverse"
            >
              <X aria-hidden className="size-5" />
            </IconButton>
          </aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>

      <ChangeOwnPasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} />
    </div>
  );
}
