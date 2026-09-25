export type FieldErrors = Partial<Record<string, string[]>>;

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors };
