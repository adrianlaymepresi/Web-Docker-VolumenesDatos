"use client";

import { DialogActions, Modal } from "@/components/ui/modal";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Eliminar",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <p className="mb-6 text-sm leading-relaxed text-text">{message}</p>
      <DialogActions submitLabel={confirmLabel} submitVariant="danger" isPending={isLoading} onCancel={onClose} onSubmit={onConfirm} />
    </Modal>
  );
}
