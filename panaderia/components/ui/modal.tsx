"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
};

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-3xl",
};

export function Modal({ isOpen, title, description, onClose, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby={titleId}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${sizeClasses[size]} overflow-hidden rounded-2xl border border-border bg-surface p-0 text-text shadow-2xl`}
    >
      {isOpen && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-border bg-surface-muted/60 px-5 py-4 sm:px-6">
            <div>
              <h2 id={titleId}className="font-display text-xl font-bold text-secondary-strong">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
            </div>
            <IconButton label="Cerrar" onClick={onClose}>
              <X aria-hidden className="size-5" />
            </IconButton>
          </header>
          <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}

type DialogActionsProps = {
  submitLabel: string;
  isPending: boolean;
  onCancel: () => void;
  submitVariant?: "primary" | "secondary" | "danger";
  onSubmit?: () => void;
};

export function DialogActions({ submitLabel, isPending, onCancel, submitVariant = "primary", onSubmit }: DialogActionsProps) {
  return (
    <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button variant="outline" onClick={onCancel} disabled={isPending}>
        Cancelar
      </Button>
      <Button type={onSubmit ? "button" : "submit"} variant={submitVariant} onClick={onSubmit} isLoading={isPending}>
        {submitLabel}
      </Button>
    </div>
  );
}
