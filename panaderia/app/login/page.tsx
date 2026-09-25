import type { Metadata } from "next";
import { Croissant } from "lucide-react";
import { BakeryIllustration } from "@/features/auth/components/bakery-illustration";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section
        aria-hidden
        className="relative hidden overflow-hidden bg-secondary lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-8 lg:p-12"
      >
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/80" />
        <div className="absolute -bottom-24 -right-16 size-80 rounded-full bg-accent/70" />
        <div className="absolute right-16 top-24 size-16 rounded-full bg-background/20" />
        <BakeryIllustration className="relative w-full max-w-md drop-shadow-xl" />
        <p className="relative max-w-sm text-center font-display text-2xl font-semibold text-text-inverse">
          Pan fresco, gestión sencilla.
        </p>
      </section>

      <section className="bakery-pattern flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-text-inverse shadow-md">
              <Croissant aria-hidden className="size-9" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-wide text-primary">PANADERIA</h1>
            <p className="text-sm text-text-muted">Ingresa tus credenciales para acceder al sistema.</p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
