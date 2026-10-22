"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, FormField, inputClass, primaryBtn } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import { slugSchema } from "@/utils/validation/provider/slug";

type Checked = { slug: string; available: boolean; reason?: string };

export function SlugStep({
  initialSlug,
  suggestedSlug,
  onSaved,
}: {
  initialSlug: string | null;
  suggestedSlug: string;
  onSaved: (slug: string) => void;
}) {
  const [slug, setSlug] = useState(initialSlug ?? suggestedSlug);
  const [checked, setChecked] = useState<Checked | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const value = slug.trim().toLowerCase();
  const parsed = useMemo(() => (value ? slugSchema.safeParse(value) : null), [value]);

  // فحص لحظي بـ debounce (الفحص النهائي عند الحفظ بيعتمد على unique في الداتابيز)
  useEffect(() => {
    if (!parsed?.success) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const res = await api<{ available: boolean; reason?: string }>(
        `/api/provider/slug-check?slug=${encodeURIComponent(value)}`
      );
      if (!cancelled && res.ok && res.data) setChecked({ slug: value, ...res.data });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, parsed]);

  type Status = "idle" | "invalid" | "checking" | "available" | "taken";
  let status: Status = "idle";
  let message = "";
  if (parsed && !parsed.success) {
    status = "invalid";
    message = parsed.error.issues[0].message;
  } else if (parsed?.success) {
    if (checked?.slug === value) {
      status = checked.available ? "available" : "taken";
      message = checked.available ? "الرابط متاح" : (checked.reason ?? "الرابط مستخدم");
    } else {
      status = "checking";
      message = "جاري الفحص...";
    }
  }

  const save = async () => {
    setError(null);
    setSaving(true);
    const res = await api("/api/provider/profile", {
      method: "PUT",
      body: JSON.stringify({ slug: value }),
    });
    setSaving(false);
    if (!res.ok) return setError(res.message);
    onSaved(value);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-headline-md font-bold text-neutral-primary">اختر رابط الحجز الخاص بك</h2>
        <p className="mt-1 text-body-md text-neutral-muted">
          ده الرابط اللي هتشاركه مع عملائك علشان يحجزوا عندك.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <FormField label="رابط الحجز" htmlFor="slug" required>
        <div className="relative" dir="ltr">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-body-md text-neutral-muted">
            /
          </span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setError(null);
            }}
            placeholder="dr-sherif"
            autoComplete="off"
            spellCheck={false}
            className={`${inputClass} pl-7 pr-10 ${
              status === "invalid" || status === "taken" ? "border-status-error" : ""
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {status === "checking" && <Loader2 className="size-4 animate-spin text-neutral-muted" />}
            {status === "available" && <Check className="size-4 text-status-success" />}
            {(status === "taken" || status === "invalid") && <X className="size-4 text-status-error" />}
          </span>
        </div>
        <p
          aria-live="polite"
          className={`min-h-5 text-body-sm font-medium ${
            status === "available"
              ? "text-status-success"
              : status === "taken" || status === "invalid"
                ? "text-status-error"
                : "text-neutral-muted"
          }`}
        >
          {message || "3 إلى 30 حرف: إنجليزي صغير وأرقام وشرطة (-)"}
        </p>
      </FormField>

      <Button
        type="button"
        onClick={save}
        disabled={saving || status !== "available"}
        className={`${primaryBtn} w-full`}
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        <span>حفظ والمتابعة</span>
      </Button>
    </div>
  );
}
