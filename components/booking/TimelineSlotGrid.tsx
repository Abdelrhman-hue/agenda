"use client";

import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { IAvailabilitySlot } from "@/utils/dto/booking";

interface TimelineSlotGridProps {
  slots: IAvailabilitySlot[];
  selectedSlotTime: string | null;
  onSelectSlot: (slot: IAvailabilitySlot) => void;
  isLoading?: boolean;
  isAbsent?: boolean;
  absenceReason?: string | null;
  isWorkingDay?: boolean;
}

export function TimelineSlotGrid({
  slots,
  selectedSlotTime,
  onSelectSlot,
  isLoading = false,
  isAbsent = false,
  absenceReason,
  isWorkingDay = true,
}: TimelineSlotGridProps) {
  if (isLoading) {
    return (
      <div className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-lg bg-neutral-100 border border-border-subtle/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isAbsent) {
    return (
      <div className="rounded-[16px] border border-amber-200 bg-amber-50/70 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-600 mb-2" />
        <h4 className="font-semibold text-amber-900 text-title-md">
          مقدم الخدمة في عطلة
        </h4>
        <p className="mt-1 text-body-sm text-amber-800">
          {absenceReason || "مقدم الخدمة غير متاح لاستقبال الحجوزات في هذا اليوم. يرجى اختيار تاريخ آخر."}
        </p>
      </div>
    );
  }

  if (!isWorkingDay) {
    return (
      <div className="rounded-[16px] border border-neutral-200 bg-canvas p-6 text-center">
        <Clock className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
        <h4 className="font-semibold text-neutral-primary text-title-md">
          يوم عطلة أسبوعية
        </h4>
        <p className="mt-1 text-body-sm text-neutral-muted">
          هذا اليوم ليس ضمن أيام العمل الرسمية لمقدم الخدمة. يرجى اختيار يوم آخر.
        </p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-[16px] border border-border-subtle bg-surface p-6 text-center">
        <p className="text-body-md text-neutral-muted">
          لا توجد مواعيد متاحة في هذا التاريخ. يرجى تجربة تاريخ لاحق.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
      {/* Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <h4 className="font-semibold text-neutral-primary text-title-md">
            المواعيد المتاحة
          </h4>
          <p className="text-body-sm text-neutral-muted">
            اختر التوقيت المناسب لك من القائمة أدناه
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-body-sm text-neutral-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-surface border border-neutral-300" />
            <span>متاح</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span>محدد</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
            <span>محجوز</span>
          </div>
        </div>
      </div>

      {/* Grid of Slots according to Agendah Design System */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlotTime === slot.time;
          const isBooked = !slot.isAvailable;

          if (isBooked) {
            return (
              <button
                key={slot.time}
                type="button"
                disabled
                title={slot.status === "PAST" ? "موعد مضى" : "محجوز بالفعل"}
                className="h-11 w-full rounded-lg bg-neutral-100/70 border border-transparent px-3 text-body-md text-neutral-muted/70 line-through cursor-not-allowed flex items-center justify-center transition-all select-none"
              >
                <span className="tabular-numbers">{slot.time}</span>
              </button>
            );
          }

          if (isSelected) {
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className="h-11 w-full rounded-lg border-2 border-primary bg-canvas shadow-level2 px-3 text-body-md font-semibold text-primary flex items-center justify-center gap-1.5 transition-all transform scale-[1.02]"
              >
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="tabular-numbers">{slot.time}</span>
              </button>
            );
          }

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className="h-11 w-full rounded-lg bg-surface border border-border-subtle hover:border-primary/60 hover:bg-canvas/50 px-3 text-body-md text-neutral-primary flex items-center justify-center transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
            >
              <span className="tabular-numbers">{slot.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
