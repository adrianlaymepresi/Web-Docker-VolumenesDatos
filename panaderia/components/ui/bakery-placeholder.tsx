import { Croissant } from "lucide-react";

export function BakeryPlaceholder({ label = "Producto sin imagen" }: { label?: string }) {
  return (
    <div role="img" aria-label={label} className="bakery-pattern flex size-full items-center justify-center bg-accent-soft text-accent">
      <Croissant aria-hidden className="size-1/2 max-h-16 max-w-16" strokeWidth={1.5} />
    </div>
  );
}
