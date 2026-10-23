"use client";

import { useEffect, useState } from "react";
import { CopyPlus, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, primaryBtn } from "@/components/ui/form-field";
import { Toggle } from "@/components/ui/toggle";
import { api } from "@/lib/client-api";
import { DAY_NAMES } from "@/lib/constants";
import { fromMinutes, toMinutes } from "@/lib/time";
import { workingHoursSchema } from "@/utils/validation/provider/workingHours";

type Shift = { startTime: string; endTime: string };
type Day = { dayOfWeek: number; isOpen: boolean; shifts: Shift[] };

const DEFAULT_SHIFT: Shift = { startTime: "09:00", endTime: "17:00" };

const timeInput =
  "h-10 w-full rounded-[10px] border border-border-subtle bg-[#F4F8F6] px-2.5 text-body-md text-neutral-primary tabular-numbers focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

export function WorkingHoursEditor({
  onSaved,
  saveLabel = "حفظ ساعات العمل",
}: {
  onSaved?: (days: Day[]) => void;
  saveLabel?: string;
}) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api<{ days: Day[] }>("/api/provider/working-hours");
      if (cancelled) return;
      if (res.ok && res.data) setDays(res.data.days);
      else setError(res.message || "تعذر تحميل ساعات العمل");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (i: number, next: Partial<Day>) => {
    setSuccess(null);
    setDays((prev) => prev && prev.map((d, idx) => (idx === i ? { ...d, ...next } : d)));
  };

  const toggleDay = (i: number, isOpen: boolean) => {
    const day = days![i];
    patch(i, { isOpen, shifts: isOpen && day.shifts.length === 0 ? [{ ...DEFAULT_SHIFT }] : day.shifts });
  };

  const setShift = (i: number, j: number, key: keyof Shift, value: string) => {
    const shifts = days![i].shifts.map((s, idx) => (idx === j ? { ...s, [key]: value } : s));
    patch(i, { shifts });
  };

  const addShift = (i: number) => {
    const shifts = days![i].shifts;
    const last = shifts[shifts.length - 1];
    const start = last ? Math.min(toMinutes(last.endTime) + 60, 22 * 60) : 9 * 60;
    const end = Math.min(start + 180, 23 * 60 + 55);
    patch(i, { shifts: [...shifts, { startTime: fromMinutes(start), endTime: fromMinutes(end) }] });
  };

  const removeShift = (i: number, j: number) => {
    const shifts = days![i].shifts.filter((_, idx) => idx !== j);
    patch(i, { shifts, isOpen: shifts.length > 0 ? days![i].isOpen : false });
  };

  const copyToAll = (i: number) => {
    const src = days![i];
    setSuccess(null);
    setDays(days!.map((d) => ({ ...d, isOpen: src.isOpen, shifts: src.shifts.map((s) => ({ ...s })) })));
  };

  const save = async () => {
    if (!days) return;
    setError(null);
    setSuccess(null);
    const payload = { days: days.map((d) => ({ ...d, shifts: d.isOpen ? d.shifts : [] })) };
    const parsed = workingHoursSchema.safeParse(payload);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setSaving(true);
    const res = await api<{ days: Day[] }>("/api/provider/working-hours", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok || !res.data) return setError(res.message);
    setDays(res.data.days);
    setSuccess("تم حفظ ساعات العمل");
    onSaved?.(res.data.days);
  };

  if (!days) {
    return (
      <div className="flex items-center justify-center py-14 text-neutral-muted" dir="rtl">
        {error ? <Alert type="error">{error}</Alert> : <Loader2 className="size-6 animate-spin text-primary" />}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h2 className="text-headline-md font-bold text-neutral-primary">ساعات العمل الأسبوعية</h2>
        <p className="mt-1 text-body-md text-neutral-muted">
          حدد أيام وفترات شغلك. تقدر تضيف أكتر من فترة في اليوم لعمل فترة راحة.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <ul className="space-y-3">
        {days.map((day, i) => (
          <li key={day.dayOfWeek}>
            <Card
              className={`gap-3 rounded-[16px] border p-4 shadow-level1 ${
                day.isOpen ? "border-border-subtle bg-surface" : "border-border-subtle bg-[#F4F8F6]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={day.isOpen}
                    onChange={(v) => toggleDay(i, v)}
                    label={`${DAY_NAMES[day.dayOfWeek]}: ${day.isOpen ? "إغلاق" : "فتح"}`}
                  />
                  <span className="text-body-lg font-bold text-neutral-primary">
                    {DAY_NAMES[day.dayOfWeek]}
                  </span>
                </div>
                {day.isOpen ? (
                  <button
                    type="button"
                    onClick={() => copyToAll(i)}
                    className="flex cursor-pointer items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
                  >
                    <CopyPlus className="size-4" />
                    <span>نسخ لباقي الأيام</span>
                  </button>
                ) : (
                  <span className="text-body-sm text-neutral-muted">مغلق</span>
                )}
              </div>

              {day.isOpen && (
                <div className="space-y-2.5">
                  {day.shifts.map((s, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <label className="flex flex-1 items-center gap-2 text-body-sm text-neutral-muted">
                        <span className="shrink-0">من</span>
                        <input
                          type="time"
                          step={300}
                          value={s.startTime}
                          onChange={(e) => setShift(i, j, "startTime", e.target.value)}
                          className={timeInput}
                          dir="ltr"
                        />
                      </label>
                      <label className="flex flex-1 items-center gap-2 text-body-sm text-neutral-muted">
                        <span className="shrink-0">إلى</span>
                        <input
                          type="time"
                          step={300}
                          value={s.endTime}
                          onChange={(e) => setShift(i, j, "endTime", e.target.value)}
                          className={timeInput}
                          dir="ltr"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeShift(i, j)}
                        aria-label="حذف الفترة"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-status-error hover:bg-status-error/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  {day.shifts.length < 6 && (
                    <button
                      type="button"
                      onClick={() => addShift(i)}
                      className="flex cursor-pointer items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
                    >
                      <Plus className="size-4" />
                      <span>إضافة فترة</span>
                    </button>
                  )}
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>

      <Button type="button" onClick={save} disabled={saving} className={`${primaryBtn} w-full sm:w-auto sm:px-8`}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        <span>{saveLabel}</span>
      </Button>
    </div>
  );
}
