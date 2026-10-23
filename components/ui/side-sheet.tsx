"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/** Sheet بسيط: من تحت على الموبايل ومن الجنب على الشاشات الكبيرة */
export function SideSheet({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" dir="rtl">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-neutral-primary/40"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-[16px] bg-surface shadow-level4 md:inset-y-0 md:left-0 md:right-auto md:max-h-none md:w-[440px] md:rounded-none md:rounded-r-[16px]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border-subtle p-5">
          <div>
            <h2 className="text-title-lg font-bold text-neutral-primary">{title}</h2>
            {description && <p className="mt-0.5 text-body-sm text-neutral-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-muted hover:bg-[#F4F8F6]"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </section>
    </div>
  );
}
