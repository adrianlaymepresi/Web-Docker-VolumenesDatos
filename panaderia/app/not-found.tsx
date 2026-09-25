import Link from "next/link";
import { Croissant } from "lucide-react";
import { HOME_ROUTE } from "@/config/navigation";

export default function NotFound() {
  return (
    <main className="bakery-pattern flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-text-inverse">
        <Croissant aria-hidden className="size-9" />
      </div>
      <h1 className="font-display text-3xl font-bold text-secondary-strong">Página no encontrada</h1>
      <p className="text-text-muted">El recurso que buscas no existe o fue eliminado.</p>
      <Link href={HOME_ROUTE} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-text-inverse hover:bg-primary-strong">
        Volver a productos
      </Link>
    </main>
  );
}
