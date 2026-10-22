"use client";

import { useState } from "react";
import { Loader2, Store, UserRound, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, primaryBtn } from "@/components/ui/form-field";
import { api } from "@/lib/client-api";

type Role = "PROVIDER" | "CLIENT";

const OPTIONS: { role: Role; title: string; hint: string; icon: LucideIcon }[] = [
  { role: "PROVIDER", title: "صاحب خدمة أو نشاط", hint: "عيادة، صالون، أكاديمية، مستقل", icon: Store },
  { role: "CLIENT", title: "عميل مستفيد", hint: "لحجز ومتابعة مواعيدك", icon: UserRound },
];

export function RoleChooseForm() {
  const [role, setRole] = useState<Role>("PROVIDER");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    setSaving(true);
    const res = await api("/api/users/me/role", { method: "POST", body: JSON.stringify({ role }) });
    if (!res.ok) {
      setSaving(false);
      return setError(res.message);
    }
    // تحميل كامل علشان الـ session والـ proxy ياخدوا الدور الجديد
    window.location.assign(role === "PROVIDER" ? "/onboarding" : "/home");
  };

  return (
    <div className="space-y-5" dir="rtl">
      {error && <Alert type="error">{error}</Alert>}

      <div role="radiogroup" aria-label="نوع الحساب" className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ role: value, title, hint, icon: Icon }) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(value)}
              className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-4 text-right transition-all ${
                active ? "border-primary bg-[#EAF6F3] shadow-level1" : "border-border-subtle bg-surface hover:border-primary/50"
              }`}
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] ${
                  active ? "bg-primary text-white" : "bg-[#F4F8F6] text-neutral-muted"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-md font-semibold text-neutral-primary">{title}</span>
                <span className="block text-body-sm text-neutral-muted">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-body-sm text-neutral-muted">الاختيار ده بيتحفظ مرة واحدة ومش هتقدر تغيّره بعد كده.</p>

      <Button type="button" onClick={submit} disabled={saving} className={`${primaryBtn} w-full`}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        <span>متابعة</span>
      </Button>
    </div>
  );
}
