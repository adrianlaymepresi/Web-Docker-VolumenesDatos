export function PageSkeleton() {
  return (
    <div role="status" aria-label="Cargando contenido" className="flex animate-pulse flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-48 rounded-lg bg-surface-muted" />
          <div className="h-4 w-72 max-w-full rounded bg-surface-muted" />
        </div>
        <div className="hidden h-11 w-40 rounded-xl bg-surface-muted sm:block" />
      </div>
      <div className="h-20 rounded-2xl bg-surface-muted" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-12 rounded-xl bg-surface-muted" />
        ))}
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
