import { createHmac, timingSafeEqual } from "node:crypto";

export function createEmailVerificationStatusToken(email: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required to issue verification status tokens");

  const issuedAt = Date.now().toString();
  const signature = createHmac("sha256", secret).update(`${email}:${issuedAt}`).digest("hex");
  return `${issuedAt}.${signature}`;
}

export function isValidEmailVerificationStatusToken(email: string, token: string) {
  const [issuedAt, suppliedSignature, extraPart] = token.split(".");
  if (!issuedAt || !suppliedSignature || extraPart || !/^\d+$/.test(issuedAt)) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isSafeInteger(issuedAtMs) || issuedAtMs > Date.now() || Date.now() - issuedAtMs > 24 * 60 * 60 * 1000) {
    return false;
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required to validate verification status tokens");

  const expectedBuffer = Buffer.from(createHmac("sha256", secret).update(`${email}:${issuedAt}`).digest("hex"), "hex");
  const providedBuffer = Buffer.from(suppliedSignature, "hex");

  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}
