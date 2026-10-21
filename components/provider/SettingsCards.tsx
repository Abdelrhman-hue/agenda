"use client";

import { useEffect, useState } from "react";
import { Banknote, Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, FormField, inputClass, primaryBtn } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import { settingsSchema } from "@/utils/validation/provider/settings";

type DepositType = "NONE" | "FIXED" | "FULL";
type Settings = { bufferMinutes: number; depositType: DepositType; depositAmount: number; timezone: string };

const BUFFERS = [0, 5, 10, 15, 20, 30, 45, 60, 90, 120];
const DEPOSITS: { value: DepositType; label: string; hint: string }[] = [
  { value: "NONE", label: "بدون عربون", hint: "الحجز مؤكد مباشرة" },
  { value: "FIXED", label: "مبلغ ثابت", hint: "مبلغ محدد لكل حجز" },
  { value: "FULL", label: "كامل المبلغ", hint: "الدفع مقدمًا بالكامل" },
];

export function SettingsCards({ onSaved }: { onSaved?: () => void }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api<{ settings: Settings }>("/api/provider/settings");
      if (cancelled) return;
      if (res.ok && res.data) {
        setSettings(res.data.settings);
        setAmount(res.data.settings.depositAmount > 0 ? String(res.data.settings.depositAmount) : "");
      } else {
        setError(res.message || "تعذر تحميل الإعدادات");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    if (!settings) return;
    setError(null);
    setSuccess(null);
    const payload = {
      bufferMinutes: settings.bufferMinutes,
      depositType: settings.depositType,
      depositAmount: settings.depositType === "FIXED" ? Number(amount) : undefined,
      timezone: settings.timezone,
    };
    const parsed = settingsSchema.safeParse(payload);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setSaving(true);
    const res = await api("/api/provider/settings", { method: "PUT", body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) return setError(res.message);
    setSuccess("تم حفظ الإعدادات");
    onSaved?.();
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-10" dir="rtl">
        {error ? <Alert type="error">{error}</Alert> : <Loader2 className="size-6 animate-spin text-primary" />}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <Card className="gap-4 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#FEF6E7] text-accent-gold">
            <Banknote className="size-5" />
          </span>
          <div>
            <h3 className="text-title-lg font-bold text-neutral-primary">العربون</h3>
            <p className="text-body-sm text-neutral-muted">الإعداد العام، وتقدر تحدد عربون مختلف لكل خدمة.</p>
          </div>
        </div>

        <div role="radiogroup" aria-label="نوع العربون" className="grid gap-2 sm:grid-cols-3">
          {DEPOSITS.map((d) => {
            const active = settings.depositType === d.value;
            return (
              <button
                key={d.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setSuccess(null);
                  setSettings({ ...settings, depositType: d.value });
                }}
                className={`cursor-pointer rounded-[10px] border p-3 text-right transition-all ${
                  active
                    ? "border-accent-gold bg-[#FEF6E7]"
                    : "border-border-subtle bg-surface hover:border-accent-gold/60"
                }`}
              >
                <p className="text-body-md font-semibold text-neutral-primary">{d.label}</p>
                <p className="text-body-sm text-neutral-muted">{d.hint}</p>
              </button>
            );
          })}
        </div>

        {settings.depositType === "FIXED" && (
          <FormField label="مبلغ العربون (ج.م)" htmlFor="deposit-amount" required>
            <Input
              id="deposit-amount"
              type="number"
              inputMode="numeric"
              min={1}
              value={amount}
              onChange={(e) => {
                setSuccess(null);
                setAmount(e.target.value);
              }}
              placeholder="100"
              className={`${inputClass} tabular-numbers`}
            />
          </FormField>
        )}
      </Card>

      <Card className="gap-4 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary-light text-primary-dark">
            <Timer className="size-5" />
          </span>
          <div>
            <h3 className="text-title-lg font-bold text-neutral-primary">الراحة بين المواعيد</h3>
            <p className="text-body-sm text-neutral-muted">وقت فاصل بعد كل موعد قبل اللي بعده.</p>
          </div>
        </div>
        <select
          aria-label="مدة الراحة بين المواعيد"
          value={settings.bufferMinutes}
          onChange={(e) => {
            setSuccess(null);
            setSettings({ ...settings, bufferMinutes: Number(e.target.value) });
          }}
          className={`${inputClass} cursor-pointer tabular-numbers`}
        >
          {BUFFERS.map((m) => (
            <option key={m} value={m}>
              {m === 0 ? "بدون راحة" : `${m} دقيقة`}
            </option>
          ))}
        </select>
      </Card>

      <Button type="button" onClick={save} disabled={saving} className={`${primaryBtn} w-full sm:w-auto sm:px-8`}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        <span>حفظ الإعدادات</span>
      </Button>
    </div>
  );
}
