"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { outlineBtn, primaryBtn } from "@/components/ui/form-field";

/** شريط التقدم (مكون مشترك لخطوات الـ Onboarding) */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="space-y-3" dir="rtl">
      <div className="flex items-center justify-between text-body-sm">
        <span className="font-semibold text-primary-dark tabular-numbers">
          الخطوة {current + 1} من {steps.length}
        </span>
        <span className="text-neutral-muted">{steps[current]}</span>
      </div>
      <ol className="flex items-center gap-2" aria-label="خطوات الإعداد">
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className="flex flex-1 items-center gap-2"
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-label-md font-bold ${
                i < current
                  ? "bg-primary text-white"
                  : i === current
                    ? "border-2 border-primary bg-primary-light text-primary-dark"
                    : "border border-border-subtle bg-surface text-neutral-muted"
              }`}
            >
              {i < current ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`h-1 flex-1 rounded-full ${i < current ? "bg-primary" : "bg-border-subtle"} ${
                i === steps.length - 1 ? "hidden" : ""
              }`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

/** أزرار رجوع / التالي */
export function StepperNav({
  onBack,
  onNext,
  nextLabel = "التالي",
  nextDisabled,
  loading,
  hideNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  hideNext?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-5" dir="rtl">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack} className={`${outlineBtn} px-5`}>
          <ArrowRight className="size-4" />
          <span>رجوع</span>
        </Button>
      ) : (
        <span />
      )}
      {!hideNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || loading}
          className={`${primaryBtn} px-6`}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          <span>{nextLabel}</span>
          {!loading && <ArrowLeft className="size-4" />}
        </Button>
      )}
    </div>
  );
}
