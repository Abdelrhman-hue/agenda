"use client";

import React, { useState, useEffect } from "react";
import { Calendar, X, Loader2, Check, Clock } from "lucide-react";
import { IAvailabilitySlot } from "@/utils/dto/booking";

interface RescheduleModalProps {
  isOpen: boolean;
  bookingId: string;
  providerId: string;
  serviceId: string;
  clientName: string;
  currentStartsAt: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function RescheduleModal({
  isOpen,
  bookingId,
  providerId,
  serviceId,
  clientName,
  currentStartsAt,
  onClose,
  onSuccess,
}: RescheduleModalProps) {
  // Format current date YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // default to tomorrow
    return d.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState<IAvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<IAvailabilitySlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!isOpen || !selectedDate || !providerId) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setError(null);
    setSelectedSlot(null);

    fetch(
      `/api/providers/availability?providerId=${providerId}&date=${selectedDate}&serviceId=${serviceId}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.status === "success" && res.data) {
          if (res.data.isAbsent) {
            setStatusMessage(`مقدم الخدمة في عطلة (${res.data.absenceReason || "غير متاح"})`);
            setSlots([]);
          } else if (!res.data.isWorkingDay) {
            setStatusMessage("عطلة أسبوعية في هذا اليوم");
            setSlots([]);
          } else {
            setStatusMessage(null);
            setSlots(res.data.slots || []);
          }
        } else {
          setError(res.message || "فشل تحميل المواعيد");
          setSlots([]);
        }
      })
      .catch((err) => {
        if (isMounted) setError("خطأ في الاتصال بالخادم");
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDate, providerId, serviceId]);

  if (!isOpen) return null;

  const handleReschedule = async () => {
    if (!selectedSlot) {
      setError("يرجى اختيار موعد جديد أولاً");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESCHEDULE",
          startsAt: selectedSlot.startsAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "فشل نقل الموعد");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء نقل الموعد");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-primary/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[16px] bg-surface p-6 shadow-level4 border border-border-subtle transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            <h3 className="font-semibold text-title-lg text-neutral-primary">
              نقل الموعد (تعديل التوقيت)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-muted hover:bg-neutral-100 hover:text-neutral-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <p className="text-body-md text-neutral-muted">
            تعديل موعد حجز العميل:{" "}
            <strong className="text-neutral-primary font-semibold">{clientName}</strong>
          </p>

          {/* Current Appointment */}
          <div className="rounded-xl bg-canvas p-3 border border-border-subtle/70 text-body-sm text-neutral-muted flex items-center justify-between">
            <span>الموعد الحالي:</span>
            <span className="font-semibold text-neutral-primary tabular-nums">
              {new Date(currentStartsAt).toLocaleString("ar-EG", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          {/* Date Picker Input */}
          <div>
            <label className="block text-label-md text-neutral-primary mb-1">
              اختر التاريخ الجديد
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-input border border-border-subtle bg-surface px-3 py-2 text-body-md text-neutral-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Slots selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-label-md text-neutral-primary">
                المواعيد المتاحة في هذا اليوم
              </label>
              {selectedSlot && (
                <span className="text-body-sm font-semibold text-primary">
                  تم تحديد: {selectedSlot.time}
                </span>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="flex items-center justify-center p-8 text-neutral-muted">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mr-2 text-body-sm">جاري جلب المواعيد المتاحة...</span>
              </div>
            ) : statusMessage ? (
              <div className="rounded-xl bg-amber-50 p-4 text-center text-body-sm text-amber-800 border border-amber-200">
                {statusMessage}
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-xl bg-canvas p-4 text-center text-body-sm text-neutral-muted">
                لا توجد مواعيد متاحة في هذا اليوم.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.time === slot.time;
                  if (!slot.isAvailable) {
                    return (
                      <button
                        key={slot.time}
                        disabled
                        className="h-10 rounded-lg bg-neutral-100/60 text-neutral-muted/60 line-through text-body-sm cursor-not-allowed select-none tabular-nums"
                      >
                        {slot.time}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`h-10 rounded-lg text-body-sm transition-all tabular-nums flex items-center justify-center gap-1 ${
                        isSelected
                          ? "border-2 border-primary bg-canvas font-bold text-primary shadow-level1"
                          : "border border-border-subtle bg-surface text-neutral-primary hover:border-primary/50"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-status-error/10 p-2.5 text-body-sm text-status-error">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-[10px] border border-border-subtle px-4 py-2 text-label-lg font-medium text-neutral-primary hover:bg-neutral-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleReschedule}
            disabled={isSubmitting || !selectedSlot}
            className="flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2 text-label-lg font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            تأكيد نقل الموعد
          </button>
        </div>
      </div>
    </div>
  );
}
