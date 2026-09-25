"use client";

import type { LucideIcon } from "lucide-react";
import { useQueryParams } from "@/components/ui/use-query-params";

export type ViewOption<Value extends string> = {
  value: Value;
  label: string;
  icon: LucideIcon;
};

type ViewToggleProps<Value extends string> = {
  param: string;
  label: string;
  options: ViewOption<Value>[];
  currentValue: Value;
  defaultValue: Value;
};

export function ViewToggle<Value extends string>({ param, label, options, currentValue, defaultValue }: ViewToggleProps<Value>) {
  const { setParam } = useQueryParams();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-text-muted">{label}</span>
      <div role="group" aria-label={label} className="inline-flex h-[42px] rounded-xl border border-border bg-surface-muted p-1">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === currentValue;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setParam(param, option.value === defaultValue ? "" : option.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-bold transition-colors ${
                isSelected ? "bg-secondary text-text-inverse shadow-sm" : "text-text-muted hover:text-secondary"
              }`}
            >
              <Icon aria-hidden className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
