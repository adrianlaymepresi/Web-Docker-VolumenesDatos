import { Prisma } from "@/generated/prisma/client";

function hasPrismaCode(error: unknown, code: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

export function isUniqueConstraintError(error: unknown) {
  return hasPrismaCode(error, "P2002");
}

export function isForeignKeyConstraintError(error: unknown) {
  return hasPrismaCode(error, "P2003");
}

export function isRecordNotFoundError(error: unknown) {
  return hasPrismaCode(error, "P2025");
}
