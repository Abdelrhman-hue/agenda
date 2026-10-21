"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface RegisterInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: LucideIcon;
  prefix?: string;
  error?: string;
  disabled?: boolean;
}

export function RegisterInput({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required,
  icon: Icon,
  prefix,
  error,
  disabled,
}: RegisterInputProps) {
  return (
    <div className="space-y-1.5 w-full text-right" dir="rtl">
      <Label htmlFor={name} className="text-body-md font-semibold text-neutral-primary flex items-center gap-1">
        {label}
        {required && <span className="text-[#D94B4B]">*</span>}
      </Label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute right-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-muted pointer-events-none" />
        )}

        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            h-11
            w-full
            rounded-[10px]
            bg-[#F4F8F6]
            text-body-md
            text-neutral-primary
            border
            ${error ? "border-[#D94B4B] focus-visible:ring-[#D94B4B]" : "border-border-subtle focus-visible:border-primary"}
            placeholder:text-neutral-muted
            shadow-none
            transition-all
            focus-visible:ring-1
            focus-visible:ring-primary
            ${Icon ? "pr-10" : "pr-3.5"}
            ${prefix ? "pl-16" : "pl-3.5"}
          `}
        />

        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body-sm font-medium text-neutral-muted pointer-events-none">
            {prefix}
          </span>
        )}
      </div>

      {error && (
        <p className="text-body-sm text-[#D94B4B] font-medium transition-all">
          {error}
        </p>
      )}
    </div>
  );
}