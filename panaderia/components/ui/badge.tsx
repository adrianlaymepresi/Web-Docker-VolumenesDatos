import type { ReactNode } from "react";

export type BadgeTone = "primary" | "secondary" | "accent" | "success" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  primary: "bg-primary-soft text-primary-strong",
  secondary: "bg-secondary-soft text-secondary-strong",
  accent: "bg-accent-soft text-text",
  success: "bg-success-soft text-success",
  neutral: "bg-surface-muted text-text-muted",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
