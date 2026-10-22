import { randomBytes } from "node:crypto";
import { slugSchema } from "@/utils/validation/provider/slug";

// slug مؤقت لحد ما صاحب الخدمة يختار رابطه (بصيغة p-xxxxxxxx)
export const generateTempSlug = () => `p-${randomBytes(4).toString("hex")}`;
export const isTempSlug = (slug: string) => /^p-[0-9a-f]{8}$/.test(slug);

export function suggestSlug(email?: string | null) {
  if (!email) return "";
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return slugSchema.safeParse(base).success ? base : "";
}
