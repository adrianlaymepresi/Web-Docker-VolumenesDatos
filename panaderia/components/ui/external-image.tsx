"use client";

import { useState } from "react";
import { BakeryPlaceholder } from "@/components/ui/bakery-placeholder";

type ExternalImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
};

export function ExternalImage({ src, alt, className = "" }: ExternalImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (!src || failedSource === src) {
    return <BakeryPlaceholder label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedSource(src)}
      className={`size-full object-cover ${className}`}
    />
  );
}
