"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, CalendarPlus, Loader2, MapPin, Pencil, Plus, Video, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, FormField, inputClass, outlineBtn, primaryBtn } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SideSheet } from "@/components/ui/side-sheet";
import { Toggle } from "@/components/ui/toggle";
import { api } from "@/lib/client-api";
import { MODES_BY_CATEGORY, MODE_LABELS, type Category, type ServiceMode } from "@/lib/constants";
import { createServiceSchema } from "@/utils/validation/provider/service";

export type ServiceItem = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  depositAmount: number | null;
  mode: ServiceMode;
  meetingUrl: string | null;
  requiresAddress: boolean;
  isActive: boolean;
};

const MODE_ICONS: Record<ServiceMode, LucideIcon> = {
  ONSITE: Building2,
  ONLINE: Video,
  HOME_VISIT: MapPin,
};

type Form = {
  name: string;
  durationMinutes: string;
  price: string;
  depositAmount: string;
  mode: ServiceMode;
  meetingUrl: string;
};

const emptyForm = (mode: ServiceMode): Form => ({
  name: "",
  durationMinutes: "30",
  price: "",
  depositAmount: "",
  mode,
  meetingUrl: "",
});

export function ServicesManager({
  category,
  onChange,
}: {
  category: Category;
  onChange?: (services: ServiceItem[]) => void;
}) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState<Form>(emptyForm(MODES_BY_CATEGORY[category][0]));
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = useCallback(
    (next: ServiceItem[]) => {
      setServices(next);
      onChange?.(next);
    },
    [onChange]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api<{ services: ServiceItem[] }>("/api/services");
      if (cancelled) return;
      if (res.ok && res.data) update(res.data.services);
      else setLoadError(res.message || "تعذر تحميل الخدمات");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modes = Array.from(new Set([...MODES_BY_CATEGORY[category], ...(editing ? [editing.mode] : [])]));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(MODES_BY_CATEGORY[category][0]));
    setFormError(null);
    setSheetOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditing(s);
    setForm({
      name: s.name,
      durationMinutes: String(s.durationMinutes),
      price: String(s.price),
      depositAmount: s.depositAmount === null ? "" : String(s.depositAmount),
      mode: s.mode,
      meetingUrl: s.meetingUrl ?? "",
    });
    setFormError(null);
    setSheetOpen(true);
  };

  const submit = async () => {
    setFormError(null);
    if (form.price.trim() === "") return setFormError("السعر مطلوب");
    if (form.durationMinutes.trim() === "") return setFormError("مدة الخدمة مطلوبة");

    const payload = {
      name: form.name,
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
      depositAmount: form.depositAmount.trim() === "" ? null : Number(form.depositAmount),
      mode: form.mode,
      meetingUrl: form.mode === "ONLINE" ? form.meetingUrl.trim() : null,
    };
    const parsed = createServiceSchema.safeParse(payload);
    if (!parsed.success) return setFormError(parsed.error.issues[0].message);

    setSaving(true);
    const res = editing
      ? await api<{ service: ServiceItem }>(`/api/services/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await api<{ service: ServiceItem }>("/api/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
    setSaving(false);

    if (!res.ok || !res.data) return setFormError(res.message);
    const saved = res.data.service;
    update(editing ? services.map((s) => (s.id === saved.id ? saved : s)) : [...services, saved]);
    setSheetOpen(false);
  };

  const toggleActive = async (s: ServiceItem, isActive: boolean) => {
    update(services.map((x) => (x.id === s.id ? { ...x, isActive } : x)));
    const res = await api(`/api/services/${s.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
    if (!res.ok) {
      update(services.map((x) => (x.id === s.id ? { ...x, isActive: s.isActive } : x)));
      setLoadError(res.message);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-headline-md font-bold text-neutral-primary">خدماتك</h2>
          <p className="mt-1 text-body-md text-neutral-muted">
            دي الخدمات اللي العميل هيختار منها وقت الحجز.
          </p>
        </div>
        {services.length > 0 && (
          <Button type="button" onClick={openCreate} className={`${primaryBtn} px-5`}>
            <Plus className="size-4" />
            <span>إضافة خدمة</span>
          </Button>
        )}
      </div>

      {loadError && <Alert type="error">{loadError}</Alert>}

      {loading ? (
        <div className="flex items-center justify-center py-14 text-neutral-muted">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="mr-3 text-body-md">جاري تحميل الخدمات...</span>
        </div>
      ) : services.length === 0 ? (
        <Card className="items-center gap-3 rounded-[16px] border border-dashed border-border-subtle bg-surface py-12 text-center shadow-level1">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
            <CalendarPlus className="size-6" />
          </span>
          <h3 className="text-title-lg font-semibold text-neutral-primary">لسه مفيش خدمات</h3>
          <p className="max-w-xs text-body-md text-neutral-muted">
            أضف أول خدمة بالاسم والمدة والسعر علشان العملاء يقدروا يحجزوا.
          </p>
          <Button type="button" onClick={openCreate} className={`${primaryBtn} px-6`}>
            <Plus className="size-4" />
            <span>إضافة أول خدمة</span>
          </Button>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = MODE_ICONS[s.mode];
            return (
              <li key={s.id}>
                <Card
                  className={`gap-3 rounded-[16px] border border-border-subtle bg-surface p-4 shadow-level1 transition-opacity ${
                    s.isActive ? "" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-body-lg font-bold text-neutral-primary">{s.name}</h3>
                      <p className="mt-0.5 text-body-sm text-neutral-muted tabular-numbers">
                        {s.durationMinutes} دقيقة
                      </p>
                    </div>
                    <Toggle
                      checked={s.isActive}
                      onChange={(v) => toggleActive(s, v)}
                      label={s.isActive ? "تعطيل الخدمة" : "تفعيل الخدمة"}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="h-6 gap-1.5 border-0 bg-primary-light px-2.5 text-label-md font-semibold text-primary-dark">
                      <Icon className="size-3.5" />
                      {MODE_LABELS[s.mode]}
                    </Badge>
                    <Badge className="h-6 border-0 bg-[#F4F8F6] px-2.5 text-label-md font-bold text-neutral-primary tabular-numbers">
                      {s.price} ج.م
                    </Badge>
                    {s.depositAmount !== null && (
                      <Badge className="h-6 border-0 bg-[#FEF6E7] px-2.5 text-label-md font-semibold text-neutral-primary tabular-numbers">
                        عربون {s.depositAmount} ج.م
                      </Badge>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEdit(s)}
                    className={`${outlineBtn} h-9 w-fit px-4`}
                  >
                    <Pencil className="size-3.5" />
                    <span>تعديل</span>
                  </Button>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <SideSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? "تعديل الخدمة" : "إضافة خدمة"}
        description="الاسم والمدة والسعر هما اللي هيظهروا للعميل."
      >
        <div className="space-y-4">
          {formError && <Alert type="error">{formError}</Alert>}

          <FormField label="اسم الخدمة" htmlFor="svc-name" required>
            <Input
              id="svc-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="كشف جديد"
              className={inputClass}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="المدة (دقيقة)" htmlFor="svc-duration" required hint="من 5 إلى 480">
              <Input
                id="svc-duration"
                type="number"
                inputMode="numeric"
                min={5}
                max={480}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                className={`${inputClass} tabular-numbers`}
              />
            </FormField>
            <FormField label="السعر (ج.م)" htmlFor="svc-price" required>
              <Input
                id="svc-price"
                type="number"
                inputMode="numeric"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="300"
                className={`${inputClass} tabular-numbers`}
              />
            </FormField>
          </div>

          <FormField
            label="عربون الخدمة (اختياري)"
            htmlFor="svc-deposit"
            hint="سيبه فاضي لاستخدام إعداد العربون العام"
          >
            <Input
              id="svc-deposit"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.depositAmount}
              onChange={(e) => setForm({ ...form, depositAmount: e.target.value })}
              placeholder="100"
              className={`${inputClass} tabular-numbers`}
            />
          </FormField>

          <FormField label="نوع الجلسة" required>
            <div role="radiogroup" aria-label="نوع الجلسة" className="grid gap-2">
              {modes.map((m) => {
                const Icon = MODE_ICONS[m];
                const active = form.mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setForm({ ...form, mode: m })}
                    className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-3 text-right transition-all ${
                      active
                        ? "border-primary bg-[#EAF6F3]"
                        : "border-border-subtle bg-surface hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-[10px] ${
                        active ? "bg-primary text-white" : "bg-[#F4F8F6] text-neutral-muted"
                      }`}
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <span className="text-body-md font-semibold text-neutral-primary">{MODE_LABELS[m]}</span>
                  </button>
                );
              })}
            </div>
          </FormField>

          {form.mode === "ONLINE" && (
            <FormField label="رابط الاجتماع (اختياري)" htmlFor="svc-url" hint="مثال: رابط Zoom أو Google Meet">
              <Input
                id="svc-url"
                type="url"
                dir="ltr"
                value={form.meetingUrl}
                onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
                placeholder="https://meet.google.com/..."
                className={inputClass}
              />
            </FormField>
          )}

          {form.mode === "HOME_VISIT" && (
            <Alert type="success">
              الزيارة المنزلية بتطلب من العميل يكتب عنوانه وقت الحجز تلقائيًا.
            </Alert>
          )}

          <Button type="button" onClick={submit} disabled={saving} className={`${primaryBtn} w-full`}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            <span>{editing ? "حفظ التعديلات" : "إضافة الخدمة"}</span>
          </Button>
        </div>
      </SideSheet>
    </div>
  );
}
