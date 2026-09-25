import type { ReactNode } from "react";
import { Wheat } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        {icon ?? <Wheat aria-hidden className="size-7" />}
      </div>
      <p className="font-display text-lg font-bold text-secondary-strong">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
    </div>
  );
}
