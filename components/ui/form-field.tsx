import type { ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

export const inputClass =
  "h-11 w-full rounded-[10px] bg-[#F4F8F6] border border-border-subtle px-3.5 text-body-md text-neutral-primary shadow-none placeholder:text-neutral-muted focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-all";

export const primaryBtn =
  "h-11 rounded-[10px] bg-primary text-white text-label-lg font-semibold shadow-level2 hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed gap-2";

export const outlineBtn =
  "h-11 rounded-[10px] border border-border-subtle bg-surface text-neutral-primary text-label-lg font-medium hover:bg-[#F4F8F6] transition-all cursor-pointer disabled:opacity-60 gap-2";

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="w-full space-y-1.5 text-right">
      <Label htmlFor={htmlFor} className="text-body-md font-semibold text-neutral-primary">
        {label}
        {required && <span className="text-status-error">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-body-sm font-medium text-status-error">{error}</p>
      ) : hint ? (
        <p className="text-body-sm text-neutral-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Alert({ type, children }: { type: "error" | "success"; children: ReactNode }) {
  const isError = type === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-[10px] border p-3.5 text-body-md ${
        isError
          ? "border-status-error/30 bg-[#FFDAD6] text-status-error"
          : "border-status-success/30 bg-primary-light text-status-success"
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
      ) : (
        <Check className="mt-0.5 size-5 shrink-0" />
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
