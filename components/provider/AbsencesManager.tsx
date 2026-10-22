"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarOff, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, FormField, inputClass, primaryBtn } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import { createAbsenceSchema } from "@/utils/validation/provider/absence";

type Absence = { id: string; date: string; reason: string | null };

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function AbsencesManager({ today }: { today: string }) {
  const [absences, setAbsences] = useState<Absence[] | null>(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api<{ absences: Absence[] }>("/api/provider/absences");
    if (res.ok && res.data) setAbsences(res.data.absences);
    else {
      setAbsences([]);
      setError(res.message || "تعذر تحميل الإجازات");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    setError(null);
    const payload = { date, reason: reason.trim() || undefined };
    const parsed = createAbsenceSchema.safeParse(payload);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (date < today) return setError("لا يمكن إضافة إجازة في تاريخ سابق");

    setSaving(true);
    const res = await api("/api/provider/absences", { method: "POST", body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) return setError(res.message);
    setDate("");
    setReason("");
    await load();
  };

  const remove = async (id: string) => {
    setError(null);
    setDeletingId(id);
    const res = await api(`/api/provider/absences/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) return setError(res.message);
    setAbsences((prev) => prev && prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h2 className="text-headline-md font-bold text-neutral-primary">الإجازات</h2>
        <p className="mt-1 text-body-md text-neutral-muted">الأيام اللي نشاطك فيها مقفول بالكامل.</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Card className="gap-4 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="تاريخ الإجازة" htmlFor="absence-date" required>
            <Input
              id="absence-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} tabular-numbers`}
            />
          </FormField>
          <FormField label="السبب (اختياري)" htmlFor="absence-reason">
            <Input
              id="absence-reason"
              value={reason}
              maxLength={200}
              onChange={(e) => setReason(e.target.value)}
              placeholder="سفر"
              className={inputClass}
            />
          </FormField>
        </div>
        <Button type="button" onClick={add} disabled={saving || !date} className={`${primaryBtn} w-full sm:w-fit sm:px-8`}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          <span>إضافة الإجازة</span>
        </Button>
      </Card>

      {absences === null ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : absences.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[16px] border border-dashed border-border-subtle py-10 text-center">
          <CalendarOff className="size-8 text-neutral-muted" />
          <p className="text-body-md text-neutral-muted">مفيش إجازات قادمة. اختر تاريخ فوق لإضافة أول إجازة.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {absences.map((a) => (
            <li key={a.id}>
              <Card className="flex-row items-center justify-between gap-3 rounded-[10px] border border-border-subtle bg-surface p-3.5 shadow-level1">
                <div className="min-w-0">
                  <p className="text-body-md font-semibold text-neutral-primary">{formatDate(a.date)}</p>
                  {a.reason && <p className="truncate text-body-sm text-neutral-muted">{a.reason}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  disabled={deletingId === a.id}
                  aria-label="حذف الإجازة"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-status-error hover:bg-status-error/10 disabled:opacity-50"
                >
                  {deletingId === a.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
