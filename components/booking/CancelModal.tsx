"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  bookingId: string;
  clientName: string;
  serviceName: string;
  appointmentTime: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelModal({
  isOpen,
  bookingId,
  clientName,
  serviceName,
  appointmentTime,
  onClose,
  onSuccess,
}: CancelModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CANCEL",
          cancellationReason: reason.trim() || "تم الإلغاء بواسطة مقدم الخدمة",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "فشل إلغاء الحجز");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إلغاء الحجز");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-primary/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[16px] bg-surface p-6 shadow-level4 border border-border-subtle transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-status-error">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold text-title-lg">إلغاء الحجز</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-muted hover:bg-neutral-100 hover:text-neutral-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-3">
          <p className="text-body-md text-neutral-primary">
            هل أنت متأكد من رغبتك في إلغاء حجز العميل{" "}
            <strong className="font-semibold">{clientName}</strong>؟
          </p>

          <div className="rounded-xl bg-canvas p-3 border border-border-subtle/80 text-body-sm text-neutral-muted space-y-1">
            <div>
              <span className="font-medium text-neutral-primary">الخدمة: </span>
              {serviceName}
            </div>
            <div>
              <span className="font-medium text-neutral-primary">الموعد: </span>
              <span className="tabular-nums">{appointmentTime}</span>
            </div>
          </div>

          <div>
            <label className="block text-label-md text-neutral-primary mb-1">
              سبب الإلغاء (اختياري)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: ظرف طارئ، اعتذار العميل، عدم توفر موعد بديل..."
              rows={3}
              className="w-full rounded-input border border-border-subtle bg-surface p-2.5 text-body-sm text-neutral-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-status-error/10 p-2.5 text-body-sm text-status-error">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-[10px] border border-border-subtle px-4 py-2 text-label-lg font-medium text-neutral-primary hover:bg-neutral-50 transition-colors"
          >
            تراجع
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-[10px] bg-status-error px-4 py-2 text-label-lg font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            تأكيد الإلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
