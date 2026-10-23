"use client";

import React, { useState, useEffect } from "react";
import { Clock, ShieldCheck, Banknote, Sparkles } from "lucide-react";

interface DepositBreakdownWidgetProps {
  servicePrice: number;
  depositAmount: number;
  remainingAmount: number;
  depositType: "NONE" | "FIXED" | "FULL";
  holdExpiresAt?: string | null;
  onTimeout?: () => void;
  showCountdown?: boolean;
}

export function DepositBreakdownWidget({
  servicePrice,
  depositAmount,
  remainingAmount,
  depositType,
  holdExpiresAt,
  onTimeout,
  showCountdown = true,
}: DepositBreakdownWidgetProps) {
  // 10 minutes default countdown (600 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (holdExpiresAt) {
      const diff = Math.floor((new Date(holdExpiresAt).getTime() - Date.now()) / 1000);
      return Math.max(diff, 0);
    }
    return 600; // 10 minutes
  });

  useEffect(() => {
    if (!showCountdown || depositAmount === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown, depositAmount, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 600) * 100));

  return (
    <div className="rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-primary text-title-md">
              تفاصيل العربون والدفع
            </h4>
            <p className="text-body-sm text-neutral-muted">
              نظام تحصيل ذكي يضمن التزام الطرفين
            </p>
          </div>
        </div>

        {depositType === "NONE" ? (
          <span className="rounded-full bg-status-success/10 px-3 py-1 text-label-md font-medium text-status-success">
            بدون عربون
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-accent-gold/15 px-3 py-1 text-label-md font-semibold text-accent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            عربون مضمون
          </span>
        )}
      </div>

      {/* Pricing Lines */}
      <div className="mt-4 space-y-3">
        {/* Total Price */}
        <div className="flex items-center justify-between text-body-md text-neutral-muted">
          <span>إجمالي سعر الخدمة</span>
          <span className="tabular-nums font-medium text-neutral-primary">
            {servicePrice.toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        {/* Required Deposit */}
        <div className="flex items-center justify-between rounded-xl bg-canvas p-3.5 border border-border-subtle/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-primary text-body-md">
              العربون المطلوب سداده
            </span>
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-label-md font-bold text-primary">
              يدفع الآن
            </span>
          </div>
          <div className="text-left">
            <span className="tabular-nums text-headline-md font-bold text-primary">
              {depositAmount.toLocaleString("ar-EG")}
            </span>
            <span className="mr-1 text-body-sm font-medium text-primary">ج.م</span>
          </div>
        </div>

        {/* Remaining balance */}
        <div className="flex items-center justify-between text-body-md text-neutral-muted pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-neutral-muted" />
            المبلغ المتبقي عند الحضور
          </span>
          <span className="tabular-nums font-semibold text-neutral-primary">
            {remainingAmount.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
      </div>

      {/* Countdown Timer Bar (Temporary 10-minute hold as per Design System) */}
      {showCountdown && depositAmount > 0 && (
        <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5">
          <div className="flex items-center justify-between text-body-sm font-medium text-amber-900">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-700 animate-pulse" />
              قفل الموعد مؤقتاً
            </span>
            <span className="tabular-nums font-bold text-amber-900">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/60">
            <div
              className="h-full rounded-full bg-amber-600 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-1.5 text-[11px] text-amber-800/80 leading-normal">
            الموعد محجوز باسمك لمدة 10 دقائق لإتمام سداد العربون وتأكيد الحجز نهائياً.
          </p>
        </div>
      )}
    </div>
  );
}
