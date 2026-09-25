"use client";

import { useState } from "react";
import { TextInput } from "@/components/ui/form-field";
import { ExternalImage } from "@/components/ui/external-image";

type ImageUrlFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

function isPreviewableUrl(value: string) {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

export function ImageUrlField({ id, label, error, hint }: ImageUrlFieldProps) {
  const [url, setUrl] = useState("");
  const previewUrl = isPreviewableUrl(url) ? url.trim() : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <TextInput
          id={id}
          label={label}
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          error={error}
          hint={hint}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-text">Vista previa</span>
        <div className="size-24 overflow-hidden rounded-xl border border-border">
          <ExternalImage src={previewUrl} alt="Vista previa de la imagen" />
        </div>
      </div>
    </div>
  );
}
