import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export class HttpError extends Error {
  status: number;
  data?: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const ok = <T>(message: string, data?: T, status = 200) =>
  NextResponse.json({ status: "success", message, data }, { status });

export const fail = (message: string, status = 400, data?: unknown) =>
  NextResponse.json(
    { status: "fail", message, ...(data !== undefined ? { data } : {}) },
    { status }
  );

export function handleError(error: unknown, scope: string) {
  if (error instanceof HttpError) return fail(error.message, error.status, error.data);
  console.error(`error from ${scope} =>`, error);
  return NextResponse.json(
    { status: "error", message: "حدث خطأ فى السيرفر" },
    { status: 500 }
  );
}

export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new HttpError(400, "صيغة البيانات المرسلة غير صحيحة");
  }
  const result = schema.safeParse(body);
  if (!result.success) throw new HttpError(400, result.error.issues[0].message);
  return result.data;
}

// Prisma unique constraint violation
export const isUniqueError = (e: unknown) =>
  typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
