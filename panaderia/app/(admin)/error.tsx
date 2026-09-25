"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-danger/30 bg-danger-soft px-6 py-14 text-center">
      <TriangleAlert aria-hidden className="size-10 text-danger" />
      <h1 className="font-display text-2xl font-bold text-danger">No se pudo cargar la información</h1>
      <p className="max-w-md text-sm text-text">
        Verifica que la base de datos esté disponible e inténtalo nuevamente.
      </p>
      <Button variant="secondary" onClick={reset} icon={<RotateCcw aria-hidden className="size-4" />}>
        Reintentar
      </Button>
    </div>
  );
}
