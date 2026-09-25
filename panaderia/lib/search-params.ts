export function readSearchParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue?.trim() ?? "";
}

export function readIdParam(value: string | string[] | undefined) {
  const id = Number(readSearchParam(value));
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
