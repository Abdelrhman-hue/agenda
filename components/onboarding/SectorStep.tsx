"use client";

import { useState } from "react";
import {
  Brain,
  Dumbbell,
  GraduationCap,
  LayoutGrid,
  Loader2,
  Scissors,
  Stethoscope,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, FormField, inputClass, primaryBtn } from "@/components/ui/form-field";
import { api } from "@/lib/client-api";
import { SECTORS, type Category } from "@/lib/constants";

const ICONS: Record<Category, LucideIcon> = {
  CLINIC: Stethoscope,
  TUTOR: GraduationCap,
  GYM: Dumbbell,
  CONSULTANT: Brain,
  BEAUTY: Scissors,
  CRAFTSMAN: Wrench,
  OTHER: LayoutGrid,
};

export function SectorStep({
  initialCategory,
  initialBio,
  onSaved,
}: {
  initialCategory: Category | null;
  initialBio: string;
  onSaved: (category: Category, bio: string) => void;
}) {
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!category) return setError("اختر قطاع نشاطك أولًا");
    setError(null);
    setSaving(true);
    const res = await api("/api/provider/profile", {
      method: "PUT",
      body: JSON.stringify({ category, bio: bio.trim() }),
    });
    setSaving(false);
    if (!res.ok) return setError(res.message);
    onSaved(category, bio.trim());
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-headline-md font-bold text-neutral-primary">إيه مجال نشاطك؟</h2>
        <p className="mt-1 text-body-md text-neutral-muted">
          هنقترح عليك أنواع الجلسات المناسبة لنشاطك في الخطوات الجاية.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div role="radiogroup" aria-label="القطاع" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SECTORS.map((s) => {
          const Icon = ICONS[s.value];
          const active = category === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCategory(s.value)}
              className={`flex cursor-pointer flex-col items-start gap-2 rounded-[16px] border p-4 text-right transition-all ${
                active
                  ? "border-primary bg-[#EAF6F3] shadow-level1"
                  : "border-border-subtle bg-surface hover:border-primary/50"
              }`}
            >
              <span
                className={`flex size-10 items-center justify-center rounded-[10px] ${
                  active ? "bg-primary text-white" : "bg-[#F4F8F6] text-neutral-muted"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-body-md font-semibold text-neutral-primary">{s.label}</span>
              <span className="text-body-sm text-neutral-muted">{s.hint}</span>
            </button>
          );
        })}
      </div>

      <FormField label="نبذة عن نشاطك (اختياري)" htmlFor="bio" hint={`${bio.length} / 300`}>
        <textarea
          id="bio"
          value={bio}
          maxLength={300}
          rows={3}
          onChange={(e) => setBio(e.target.value)}
          placeholder="مثال: عيادة باطنة وسكر"
          className={`${inputClass} h-auto resize-none py-2.5`}
        />
      </FormField>

      <Button type="button" onClick={save} disabled={saving} className={`${primaryBtn} w-full`}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        <span>حفظ والمتابعة</span>
      </Button>
    </div>
  );
}
